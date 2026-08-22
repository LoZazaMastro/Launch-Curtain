param(
    [Parameter(Mandatory=$true)][string]$Path,
    [double]$Volume = 1.0,
    [string]$LogPath = ""
)

$ErrorActionPreference = 'Stop'
$script:done = $false
$script:failed = $false
$script:opened = $false
$player = $null

function Write-SoundbiteLog([string]$Message) {
    if ([string]::IsNullOrWhiteSpace($LogPath)) { return }
    try {
        $stamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss.fff'
        Add-Content -LiteralPath $LogPath -Value "[$stamp] Soundbite: $Message" -Encoding UTF8
    } catch {}
}

try {
    Add-Type -AssemblyName PresentationCore
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw "Audio file does not exist: $Path"
    }

    $player = New-Object System.Windows.Media.MediaPlayer
    if ($Volume -lt 0.0) { $Volume = 0.0 }
    if ($Volume -gt 1.0) { $Volume = 1.0 }
    $player.IsMuted = $false
    $player.Volume = $Volume
    $player.add_MediaOpened({ $script:opened = $true })
    $player.add_MediaEnded({ $script:done = $true })
    $player.add_MediaFailed({ $script:failed = $true; $script:done = $true })
    $uri = New-Object System.Uri($Path, [System.UriKind]::Absolute)
    $player.Open($uri)

    # MediaPlayer.Open is asynchronous. Starting playback immediately used to work
    # most of the time, but can silently race the decoder on a cold Windows session.
    # Pump the WPF dispatcher until MediaOpened fires, then apply volume again and play.
    $openStarted = [DateTime]::UtcNow
    while (-not $script:opened -and -not $script:done) {
        try {
            [System.Windows.Threading.Dispatcher]::CurrentDispatcher.Invoke(
                [System.Action]{},
                [System.Windows.Threading.DispatcherPriority]::Background
            )
        } catch {}
        Start-Sleep -Milliseconds 25
        if (([DateTime]::UtcNow - $openStarted).TotalSeconds -gt 5) {
            throw "Timed out waiting for MediaPlayer to open the Soundbite"
        }
    }
    if ($script:failed) {
        throw "MediaPlayer failed while opening the Soundbite"
    }
    $player.IsMuted = $false
    $player.Volume = $Volume
    $player.Play()
    Write-SoundbiteLog "Started path=$Path volume=$Volume opened=$script:opened"

    $started = [DateTime]::UtcNow
    while (-not $script:done) {
        # MediaPlayer events are dispatched through WPF's dispatcher. Yielding via
        # Dispatcher.Invoke keeps MediaEnded/MediaFailed responsive in a hidden host.
        try {
            [System.Windows.Threading.Dispatcher]::CurrentDispatcher.Invoke(
                [System.Action]{},
                [System.Windows.Threading.DispatcherPriority]::Background
            )
        } catch {}
        Start-Sleep -Milliseconds 40
        if (([DateTime]::UtcNow - $started).TotalMinutes -gt 15) {
            Write-SoundbiteLog "Safety timeout reached"
            break
        }
    }
    if ($script:failed) {
        Write-SoundbiteLog "Playback failed"
        exit 2
    }
    Write-SoundbiteLog "Finished"
    exit 0
}
catch {
    Write-SoundbiteLog "Error: $($_.Exception.Message)"
    exit 1
}
finally {
    if ($null -ne $player) {
        try { $player.Stop() } catch {}
        try { $player.Close() } catch {}
    }
}
