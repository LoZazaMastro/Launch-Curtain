param(
    [string]$CommandPath = "",
    [string]$ReadyPath = "",
    [string]$LogPath = ""
)

$ErrorActionPreference = "Stop"

function Write-BlackCoverLog {
    param([string]$Message)
    if (-not $LogPath) {
        return
    }

    try {
        $logDir = Split-Path -Parent $LogPath
        if ($logDir) {
            New-Item -ItemType Directory -Force -Path $logDir | Out-Null
        }
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss.fff"
        Add-Content -LiteralPath $LogPath -Value "[$timestamp] [BLACK] $Message" -Encoding UTF8
    }
    catch {
    }
}

Write-BlackCoverLog "Black pre-cover starting commandPath=$CommandPath readyPath=$ReadyPath"

try {
    Add-Type -AssemblyName PresentationFramework
    Add-Type -AssemblyName PresentationCore
    Add-Type -AssemblyName WindowsBase
}
catch {
    Write-BlackCoverLog "WPF assembly load failed: $($_.Exception.Message)"
    throw
}

try {
    Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

public static class LaunchCurtainBlackCoverNative
{
    [DllImport("user32.dll", EntryPoint = "GetWindowLongPtr", SetLastError = true)]
    private static extern IntPtr GetWindowLongPtr64(IntPtr hWnd, int nIndex);

    [DllImport("user32.dll", EntryPoint = "GetWindowLong", SetLastError = true)]
    private static extern IntPtr GetWindowLongPtr32(IntPtr hWnd, int nIndex);

    public static IntPtr GetWindowLongPtr(IntPtr hWnd, int nIndex)
    {
        return IntPtr.Size == 8 ? GetWindowLongPtr64(hWnd, nIndex) : GetWindowLongPtr32(hWnd, nIndex);
    }

    [DllImport("user32.dll", EntryPoint = "SetWindowLongPtr", SetLastError = true)]
    private static extern IntPtr SetWindowLongPtr64(IntPtr hWnd, int nIndex, IntPtr dwNewLong);

    [DllImport("user32.dll", EntryPoint = "SetWindowLong", SetLastError = true)]
    private static extern IntPtr SetWindowLongPtr32(IntPtr hWnd, int nIndex, IntPtr dwNewLong);

    public static IntPtr SetWindowLongPtr(IntPtr hWnd, int nIndex, IntPtr dwNewLong)
    {
        return IntPtr.Size == 8 ? SetWindowLongPtr64(hWnd, nIndex, dwNewLong) : SetWindowLongPtr32(hWnd, nIndex, dwNewLong);
    }

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);

    [DllImport("user32.dll")]
    public static extern int ShowCursor(bool bShow);
}
"@
}
catch {
    Write-BlackCoverLog "Native helper unavailable: $($_.Exception.Message)"
}

$script:systemCursorHidden = $false

function Hide-SystemCursor {
    try {
        [System.Windows.Input.Mouse]::OverrideCursor = [System.Windows.Input.Cursors]::None
    }
    catch {
    }

    if ($script:systemCursorHidden) {
        return
    }

    try {
        for ($index = 0; $index -lt 8; $index++) {
            $count = [LaunchCurtainBlackCoverNative]::ShowCursor($false)
            if ($count -lt 0) {
                break
            }
        }
        $script:systemCursorHidden = $true
    }
    catch {
    }
}

function Restore-SystemCursor {
    try {
        [System.Windows.Input.Mouse]::OverrideCursor = $null
    }
    catch {
    }

    if (-not $script:systemCursorHidden) {
        return
    }

    try {
        for ($index = 0; $index -lt 8; $index++) {
            $count = [LaunchCurtainBlackCoverNative]::ShowCursor($true)
            if ($count -ge 0) {
                break
            }
        }
    }
    catch {
    }
    $script:systemCursorHidden = $false
}

function Get-ScreenSize {
    return @{
        Width = [System.Windows.SystemParameters]::PrimaryScreenWidth
        Height = [System.Windows.SystemParameters]::PrimaryScreenHeight
    }
}

$screen = Get-ScreenSize
$window = New-Object System.Windows.Window
$window.Title = "Launch Curtain Black Cover"
$window.WindowStyle = [System.Windows.WindowStyle]::None
$window.ResizeMode = [System.Windows.ResizeMode]::NoResize
$window.WindowStartupLocation = [System.Windows.WindowStartupLocation]::Manual
$window.Left = 0
$window.Top = 0
$window.Width = [double]$screen.Width
$window.Height = [double]$screen.Height
$window.Topmost = $true
$window.ShowInTaskbar = $false
$window.ShowActivated = $false
$window.Background = [System.Windows.Media.Brushes]::Black
$window.Opacity = 1
$window.Focusable = $false
$window.Visibility = [System.Windows.Visibility]::Hidden
$window.Cursor = [System.Windows.Input.Cursors]::None

$root = New-Object System.Windows.Controls.Grid
$root.Background = [System.Windows.Media.Brushes]::Black
$root.Cursor = [System.Windows.Input.Cursors]::None
$window.Content = $root

$script:isVisible = $false
$script:allowClose = $false
$script:lastCommandSequence = -1
$script:hideAt = [DateTime]::MaxValue
$script:lastTopmostRefresh = [DateTime]::MinValue

function Set-BlackCoverNoActivate {
    if ($script:isVisible) {
        Hide-SystemCursor
    }
    try {
        $handle = (New-Object System.Windows.Interop.WindowInteropHelper($window)).Handle
        if ($handle -eq [IntPtr]::Zero) {
            return
        }

        $GWL_EXSTYLE = -20
        $WS_EX_TOOLWINDOW = 0x00000080
        $WS_EX_NOACTIVATE = 0x08000000
        $HWND_TOPMOST = [IntPtr](-1)
        $SWP_NOSIZE = 0x0001
        $SWP_NOMOVE = 0x0002
        $SWP_NOACTIVATE = 0x0010
        $SWP_SHOWWINDOW = 0x0040

        $style = [LaunchCurtainBlackCoverNative]::GetWindowLongPtr($handle, $GWL_EXSTYLE).ToInt64()
        $newStyle = [IntPtr]($style -bor $WS_EX_TOOLWINDOW -bor $WS_EX_NOACTIVATE)
        [LaunchCurtainBlackCoverNative]::SetWindowLongPtr($handle, $GWL_EXSTYLE, $newStyle) | Out-Null
        [LaunchCurtainBlackCoverNative]::SetWindowPos($handle, $HWND_TOPMOST, 0, 0, 0, 0, [uint32]($SWP_NOSIZE -bor $SWP_NOMOVE -bor $SWP_NOACTIVATE -bor $SWP_SHOWWINDOW)) | Out-Null
        $window.Topmost = $false
        $window.Topmost = $true
    }
    catch {
    }
}

function Refresh-BlackCoverTopmost {
    if (-not $script:isVisible) {
        return
    }

    $now = [DateTime]::UtcNow
    if (($now - $script:lastTopmostRefresh).TotalMilliseconds -lt 750) {
        return
    }

    $script:lastTopmostRefresh = $now
    Set-BlackCoverNoActivate
}

function Resize-BlackCover {
    try {
        $screen = Get-ScreenSize
        $window.Left = 0
        $window.Top = 0
        $window.Width = [double]$screen.Width
        $window.Height = [double]$screen.Height
    }
    catch {
    }
}

function Show-BlackCover {
    param([int]$TtlMs = 12000)

    if ($TtlMs -gt 0) {
        $script:hideAt = [DateTime]::UtcNow.AddMilliseconds($TtlMs)
    }
    else {
        $script:hideAt = [DateTime]::MaxValue
    }

    if ($script:isVisible) {
        return
    }

    Resize-BlackCover
    $window.Topmost = $true
    $window.Visibility = [System.Windows.Visibility]::Visible
    $window.Opacity = 1
    Hide-SystemCursor
    Set-BlackCoverNoActivate
    $script:isVisible = $true
    Write-BlackCoverLog "Black pre-cover shown ttlMs=$TtlMs"
}

function Hide-BlackCover {
    param([bool]$RestoreCursor = $true)

    if (-not $script:isVisible) {
        $script:hideAt = [DateTime]::MaxValue
        if ($RestoreCursor) {
            Restore-SystemCursor
        }
        return
    }

    $window.Topmost = $false
    $window.Visibility = [System.Windows.Visibility]::Hidden
    $script:isVisible = $false
    $script:hideAt = [DateTime]::MaxValue
    if ($RestoreCursor) {
        Restore-SystemCursor
    }
    Write-BlackCoverLog "Black pre-cover hidden restoreCursor=$RestoreCursor"
}

function Read-Command {
    if (-not $CommandPath -or -not (Test-Path -LiteralPath $CommandPath)) {
        return
    }

    try {
        $share = [System.IO.FileShare]::ReadWrite -bor [System.IO.FileShare]::Delete
        $stream = [System.IO.File]::Open($CommandPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, $share)
        try {
            $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
            try {
                $raw = $reader.ReadToEnd()
            }
            finally {
                $reader.Dispose()
            }
        }
        finally {
            $stream.Dispose()
        }
        if (-not $raw) {
            return
        }
        $command = $raw | ConvertFrom-Json
        $sequence = [int64]($command.sequence)
        if ($sequence -eq $script:lastCommandSequence) {
            return
        }
        $script:lastCommandSequence = $sequence
        $action = [string]($command.action)
        if ($action -eq "show") {
            $ttlMs = 12000
            try { $ttlMs = [int]($command.ttl_ms) } catch { $ttlMs = 12000 }
            Show-BlackCover -TtlMs $ttlMs
        }
        elseif ($action -eq "hide") {
            $restoreCursor = $true
            if ($null -ne $command.restore_cursor) {
                try {
                    $restoreCursor = [System.Convert]::ToBoolean($command.restore_cursor)
                }
                catch {
                    $restoreCursor = $true
                }
            }
            Hide-BlackCover -RestoreCursor $restoreCursor
        }
        elseif ($action -eq "exit") {
            $script:allowClose = $true
            $window.Close()
        }
    }
    catch {
        Write-BlackCoverLog "Command read failed: $($_.Exception.Message)"
    }
}

$timer = New-Object System.Windows.Threading.DispatcherTimer
$timer.Interval = [TimeSpan]::FromMilliseconds(25)
$timer.Add_Tick({
    Read-Command
    Refresh-BlackCoverTopmost
    if ($script:isVisible -and [DateTime]::UtcNow -ge $script:hideAt) {
        Hide-BlackCover
    }
})

$window.Add_SourceInitialized({
    Set-BlackCoverNoActivate
})

$window.Add_Loaded({
    Set-BlackCoverNoActivate
    if ($ReadyPath) {
        try {
            $readyDir = Split-Path -Parent $ReadyPath
            if ($readyDir) {
                New-Item -ItemType Directory -Force -Path $readyDir | Out-Null
            }
            Set-Content -LiteralPath $ReadyPath -Value ([DateTime]::UtcNow.ToString("o")) -Encoding UTF8
        }
        catch {
        }
    }
    Write-BlackCoverLog "Black pre-cover ready"
})

$window.Add_Closing({
    param($sender, $event)
    if (-not $script:allowClose) {
        $event.Cancel = $true
        Hide-BlackCover
    }
})

$dispatcher = [System.Windows.Threading.Dispatcher]::CurrentDispatcher
$window.Add_Closed({
    Write-BlackCoverLog "Black pre-cover closed"
    Restore-SystemCursor
    if ($timer) {
        $timer.Stop()
    }
    $dispatcher.BeginInvokeShutdown([System.Windows.Threading.DispatcherPriority]::Background)
})

$timer.Start()
$window.Show() | Out-Null
$window.Visibility = [System.Windows.Visibility]::Hidden
[System.Windows.Threading.Dispatcher]::Run()
