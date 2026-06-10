param(
    [string]$Title = "",
    [string]$Subtitle = "",
    [string]$Accent = "#FFFFFF",
    [string]$Logo = "",
    [string]$ShowLogo = "1",
    [string]$ZoomLogo = "1",
    [int]$LogoPositionX = 50,
    [int]$LogoPositionY = 50,
    [int]$LogoScale = 100,
    [string]$BackdropImage = "",
    [int]$BackdropOpacity = 100,
    [int]$Timeout = 45,
    [string]$LogPath = "",
    [string]$PreCoverCommandPath = ""
)

$ErrorActionPreference = "Stop"

function Write-OverlayLog {
    param([string]$Message)
    if (-not $LogPath) {
        return
    }

    try {
        $logDir = Split-Path -Parent $LogPath
        if ($logDir) {
            New-Item -ItemType Directory -Force -Path $logDir | Out-Null
        }
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Add-Content -LiteralPath $LogPath -Value "[$timestamp] [OVERLAY] $Message" -Encoding UTF8
    }
    catch {
    }
}

$showLogoEnabled = -not ([string]$ShowLogo).Trim().ToLowerInvariant().Equals("0") -and -not ([string]$ShowLogo).Trim().ToLowerInvariant().Equals("false") -and -not ([string]$ShowLogo).Trim().ToLowerInvariant().Equals("off")
$zoomLogoEnabled = -not ([string]$ZoomLogo).Trim().ToLowerInvariant().Equals("0") -and -not ([string]$ZoomLogo).Trim().ToLowerInvariant().Equals("false") -and -not ([string]$ZoomLogo).Trim().ToLowerInvariant().Equals("off")
$logoPositionXPct = [Math]::Max(0, [Math]::Min(100, $LogoPositionX))
$logoPositionYPct = [Math]::Max(0, [Math]::Min(100, $LogoPositionY))
$logoScaleFactor = [Math]::Max(0.5, [Math]::Min(2.0, $LogoScale / 100.0))
$backdropOpacityFactor = [Math]::Max(0.0, [Math]::Min(1.0, $BackdropOpacity / 100.0))

Write-OverlayLog "Overlay script starting timeout=$Timeout logo=$Logo showLogo=$showLogoEnabled zoomLogo=$zoomLogoEnabled logoPosition=$logoPositionXPct,$logoPositionYPct logoScale=$LogoScale backdrop=$BackdropImage backdropOpacity=$BackdropOpacity preCoverCommandPath=$PreCoverCommandPath"

function Hide-BlackPreCover {
    if (-not $PreCoverCommandPath) {
        return
    }

    $lastError = $null
    for ($attempt = 0; $attempt -lt 12; $attempt++) {
        try {
            $commandDir = Split-Path -Parent $PreCoverCommandPath
            if ($commandDir) {
                New-Item -ItemType Directory -Force -Path $commandDir | Out-Null
            }
            $payload = @{
                sequence = [DateTime]::UtcNow.Ticks + $attempt
                action = "hide"
                ttl_ms = 0
                restore_cursor = $false
                written_at = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() / 1000.0
            } | ConvertTo-Json -Compress
            $tmpPath = "$PreCoverCommandPath.$PID.$attempt.tmp"
            Set-Content -LiteralPath $tmpPath -Value $payload -Encoding UTF8
            Move-Item -LiteralPath $tmpPath -Destination $PreCoverCommandPath -Force
            Write-OverlayLog "Black pre-cover hide requested"
            return
        }
        catch {
            $lastError = $_.Exception.Message
            try {
                if ($tmpPath -and (Test-Path -LiteralPath $tmpPath)) {
                    Remove-Item -LiteralPath $tmpPath -Force
                }
            }
            catch {
            }
            Start-Sleep -Milliseconds (20 + ($attempt * 8))
        }
    }
    Write-OverlayLog "Black pre-cover hide request failed: $lastError"
}

try {
    Add-Type -AssemblyName PresentationFramework
    Add-Type -AssemblyName PresentationCore
    Add-Type -AssemblyName WindowsBase
    Write-OverlayLog "WPF assemblies loaded"
}
catch {
    Write-OverlayLog "WPF assembly load failed: $($_.Exception.Message)"
    throw
}

$script:XInputAvailable = $false
try {
    Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

public static class LaunchCurtainXInput
{
    [StructLayout(LayoutKind.Sequential)]
    public struct XINPUT_GAMEPAD
    {
        public ushort wButtons;
        public byte bLeftTrigger;
        public byte bRightTrigger;
        public short sThumbLX;
        public short sThumbLY;
        public short sThumbRX;
        public short sThumbRY;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct XINPUT_STATE
    {
        public uint dwPacketNumber;
        public XINPUT_GAMEPAD Gamepad;
    }

    [DllImport("xinput1_4.dll", EntryPoint = "XInputGetState")]
    public static extern int XInputGetState(int dwUserIndex, out XINPUT_STATE pState);

    [DllImport("user32.dll")]
    public static extern short GetAsyncKeyState(int vKey);

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
    $script:XInputAvailable = $true
}
catch {
    $script:XInputAvailable = $false
    Write-OverlayLog "XInput helper unavailable: $($_.Exception.Message)"
}
$script:KeyboardApiAvailable = $script:XInputAvailable
$script:systemCursorHidden = $false

function Hide-SystemCursor {
    try {
        [System.Windows.Input.Mouse]::OverrideCursor = [System.Windows.Input.Cursors]::None
    }
    catch {
    }

    if (-not $script:XInputAvailable -or $script:systemCursorHidden) {
        return
    }

    try {
        for ($index = 0; $index -lt 8; $index++) {
            $count = [LaunchCurtainXInput]::ShowCursor($false)
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

    if (-not $script:XInputAvailable -or -not $script:systemCursorHidden) {
        return
    }

    try {
        for ($index = 0; $index -lt 8; $index++) {
            $count = [LaunchCurtainXInput]::ShowCursor($true)
            if ($count -ge 0) {
                break
            }
        }
    }
    catch {
    }
    $script:systemCursorHidden = $false
}

$screenWidth = [System.Windows.SystemParameters]::PrimaryScreenWidth
$screenHeight = [System.Windows.SystemParameters]::PrimaryScreenHeight
$hiddenCursor = [System.Windows.Input.Cursors]::None

$window = New-Object System.Windows.Window
$window.Title = "Launch Curtain"
$window.WindowStyle = [System.Windows.WindowStyle]::None
$window.ResizeMode = [System.Windows.ResizeMode]::NoResize
$window.WindowStartupLocation = [System.Windows.WindowStartupLocation]::Manual
$window.Left = 0
$window.Top = 0
$window.Width = $screenWidth
$window.Height = $screenHeight
$window.Topmost = $true
$window.ShowInTaskbar = $false
$window.ShowActivated = $false
$window.Background = [System.Windows.Media.Brushes]::Black
$window.Opacity = 1
$window.Focusable = $false
$window.Cursor = $hiddenCursor

$root = New-Object System.Windows.Controls.Grid
$root.Background = [System.Windows.Media.Brushes]::Black
$root.Cursor = $hiddenCursor
$root.Opacity = 1
$window.Content = $root

$backdrop = New-Object System.Windows.Controls.Image
$backdrop.Stretch = [System.Windows.Media.Stretch]::UniformToFill
$backdrop.HorizontalAlignment = [System.Windows.HorizontalAlignment]::Center
$backdrop.VerticalAlignment = [System.Windows.VerticalAlignment]::Center
$backdrop.Width = $screenWidth
$backdrop.Height = $screenHeight
$backdrop.Opacity = 0
$backdrop.Cursor = $hiddenCursor
$root.Children.Add($backdrop) | Out-Null

$logoLayer = New-Object System.Windows.Controls.Canvas
$logoLayer.Width = $screenWidth
$logoLayer.Height = $screenHeight
$logoLayer.Cursor = $hiddenCursor
$root.Children.Add($logoLayer) | Out-Null

$stack = New-Object System.Windows.Controls.StackPanel
$stack.HorizontalAlignment = [System.Windows.HorizontalAlignment]::Left
$stack.VerticalAlignment = [System.Windows.VerticalAlignment]::Top
$stack.Orientation = [System.Windows.Controls.Orientation]::Vertical
$stack.Margin = New-Object System.Windows.Thickness 0, 0, 0, 0
$stack.Cursor = $hiddenCursor
$stack.Opacity = 0
$logoScaleTransform = New-Object System.Windows.Media.ScaleTransform
$logoScaleTransform.ScaleX = $logoScaleFactor
$logoScaleTransform.ScaleY = $logoScaleFactor
$stack.RenderTransform = $logoScaleTransform
$stack.RenderTransformOrigin = New-Object System.Windows.Point 0.5, 0.5
$logoLayer.Children.Add($stack) | Out-Null

function New-CurtainBitmap {
    param(
        [string]$Source,
        [int]$DecodePixelWidth = 0
    )

    if (-not $Source) {
        return $null
    }
    if (($Source -notmatch '^https?://') -and -not (Test-Path -LiteralPath $Source)) {
        return $null
    }

    $bitmap = New-Object System.Windows.Media.Imaging.BitmapImage
    $bitmap.BeginInit()
    $bitmap.CacheOption = [System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad
    if ($DecodePixelWidth -gt 0) {
        $bitmap.DecodePixelWidth = $DecodePixelWidth
    }
    $bitmap.UriSource = New-Object System.Uri $Source
    $bitmap.EndInit()
    try {
        if ($bitmap.CanFreeze) {
            $bitmap.Freeze()
        }
    }
    catch {
        Write-OverlayLog "Bitmap freeze skipped for $Source : $($_.Exception.Message)"
    }
    return $bitmap
}

function Update-LogoPlacement {
    if (-not $stack) {
        return
    }

    try {
        $stack.UpdateLayout()
        $width = [Math]::Max(1, $stack.ActualWidth)
        $height = [Math]::Max(1, $stack.ActualHeight)
        $left = ($screenWidth * ($logoPositionXPct / 100.0)) - ($width / 2.0)
        $top = ($screenHeight * ($logoPositionYPct / 100.0)) - ($height / 2.0)
        $left = [Math]::Max(0, [Math]::Min($screenWidth - $width, $left))
        $top = [Math]::Max(0, [Math]::Min($screenHeight - $height, $top))
        [System.Windows.Controls.Canvas]::SetLeft($stack, $left)
        [System.Windows.Controls.Canvas]::SetTop($stack, $top)
    }
    catch {
        Write-OverlayLog "Logo placement failed: $($_.Exception.Message)"
    }
}

function Set-LogoVisual {
    param(
        [string]$Source,
        [string]$Label = "Logo"
    )

    if (-not $showLogoEnabled -or -not $Source) {
        return $false
    }

    try {
        $displayWidth = [Math]::Min($screenWidth * 0.42, 720)
        $decodeWidth = [Math]::Max(1, [int][Math]::Min($displayWidth * 2, 1600))
        $bitmap = New-CurtainBitmap -Source $Source -DecodePixelWidth $decodeWidth
        if (-not $bitmap) {
            return $false
        }

        $image = New-Object System.Windows.Controls.Image
        $image.Source = $bitmap
        $image.Stretch = [System.Windows.Media.Stretch]::Uniform
        $image.Width = $displayWidth
        $image.MaxHeight = [Math]::Min($screenHeight * 0.2, 180)
        $image.Opacity = 0.94
        $image.Cursor = $hiddenCursor
        [System.Windows.Media.RenderOptions]::SetBitmapScalingMode($image, [System.Windows.Media.BitmapScalingMode]::HighQuality)
        $stack.Children.Clear()
        $stack.Children.Add($image) | Out-Null
        $stack.Opacity = 1
        Update-LogoPlacement
        Write-OverlayLog "$Label loaded from $Source"
        return $true
    }
    catch {
        Write-OverlayLog "$Label load failed from $Source : $($_.Exception.Message)"
        return $false
    }
}

function Set-TextFallbackLogo {
    if (-not $showLogoEnabled) {
        return
    }

    $fallback = New-Object System.Windows.Controls.TextBlock
    $fallback.Text = "PLAYHUB"
    $fallback.Foreground = [System.Windows.Media.Brushes]::White
    $fallback.FontFamily = "Segoe UI"
    $fallback.FontSize = 48
    $fallback.FontWeight = [System.Windows.FontWeights]::Bold
    $fallback.HorizontalAlignment = [System.Windows.HorizontalAlignment]::Center
    $fallback.Cursor = $hiddenCursor
    $stack.Children.Clear()
    $stack.Children.Add($fallback) | Out-Null
    $stack.Opacity = 1
    Update-LogoPlacement
    Write-OverlayLog "Using text fallback logo"
}

function Load-BackdropVisual {
    if (-not $BackdropImage -or -not (Test-Path -LiteralPath $BackdropImage)) {
        return
    }

    try {
        $bitmap = New-CurtainBitmap -Source $BackdropImage
        if (-not $bitmap) {
            return
        }
        $backdrop.Source = $bitmap
        $backdrop.Opacity = 0
        [System.Windows.Media.RenderOptions]::SetBitmapScalingMode($backdrop, [System.Windows.Media.BitmapScalingMode]::HighQuality)
        Write-OverlayLog "Backdrop loaded from $BackdropImage"
        $fade = New-Object System.Windows.Media.Animation.DoubleAnimation
        $fade.From = 0
        $fade.To = $backdropOpacityFactor
        $fade.Duration = New-Object System.Windows.Duration ([TimeSpan]::FromMilliseconds(500))
        $backdrop.BeginAnimation([System.Windows.UIElement]::OpacityProperty, $fade)
    }
    catch {
        Write-OverlayLog "Backdrop load failed from $BackdropImage : $($_.Exception.Message)"
    }
}

function Start-LogoZoom {
    if (-not $zoomLogoEnabled -or -not $showLogoEnabled -or $stack.Children.Count -le 0) {
        return
    }

    $zoomX = New-Object System.Windows.Media.Animation.DoubleAnimation
    $zoomX.From = $logoScaleFactor
    $zoomX.To = ($logoScaleFactor * 1.1)
    $zoomX.Duration = New-Object System.Windows.Duration ([TimeSpan]::FromSeconds(10))
    $zoomX.FillBehavior = [System.Windows.Media.Animation.FillBehavior]::HoldEnd
    $logoScaleTransform.BeginAnimation([System.Windows.Media.ScaleTransform]::ScaleXProperty, $zoomX)

    $zoomY = New-Object System.Windows.Media.Animation.DoubleAnimation
    $zoomY.From = $logoScaleFactor
    $zoomY.To = ($logoScaleFactor * 1.1)
    $zoomY.Duration = New-Object System.Windows.Duration ([TimeSpan]::FromSeconds(10))
    $zoomY.FillBehavior = [System.Windows.Media.Animation.FillBehavior]::HoldEnd
    $logoScaleTransform.BeginAnimation([System.Windows.Media.ScaleTransform]::ScaleYProperty, $zoomY)
}

function Load-CurtainContent {
    Load-BackdropVisual

    if ($showLogoEnabled) {
        $loadedGameLogo = $false
        if ($Logo) {
            $loadedGameLogo = Set-LogoVisual -Source $Logo -Label "Logo"
        }
        if (-not $loadedGameLogo -and $stack.Children.Count -eq 0) {
            $fallbackLogoPath = Join-Path (Split-Path -Parent $PSScriptRoot) "assets\base_logo.png"
            if (-not (Set-LogoVisual -Source $fallbackLogoPath -Label "Fallback logo")) {
                Set-TextFallbackLogo
            }
        }
    }

    Start-LogoZoom
    Hide-BlackPreCover
}

function Set-WindowNoActivate {
    Hide-SystemCursor
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

        $style = [LaunchCurtainXInput]::GetWindowLongPtr($handle, $GWL_EXSTYLE).ToInt64()
        $newStyle = [IntPtr]($style -bor $WS_EX_TOOLWINDOW -bor $WS_EX_NOACTIVATE)
        [LaunchCurtainXInput]::SetWindowLongPtr($handle, $GWL_EXSTYLE, $newStyle) | Out-Null
        [LaunchCurtainXInput]::SetWindowPos($handle, $HWND_TOPMOST, 0, 0, 0, 0, [uint32]($SWP_NOSIZE -bor $SWP_NOMOVE -bor $SWP_NOACTIVATE -bor $SWP_SHOWWINDOW)) | Out-Null
        $window.Topmost = $false
        $window.Topmost = $true
    }
    catch {
        # Best effort: the overlay still works even if no-activate styling fails.
    }
}

function Refresh-CurtainTopmost {
    if ($script:isClosing) {
        return
    }

    $now = [DateTime]::UtcNow
    if (($now - $script:lastTopmostRefresh).TotalMilliseconds -lt 100) {
        return
    }

    $script:lastTopmostRefresh = $now
    Hide-SystemCursor
    Set-WindowNoActivate
}

$script:allowClose = $false
$script:isClosing = $false
$script:closeButtonDown = $false
$script:escapeDown = $false
$script:lastTopmostRefresh = [DateTime]::MinValue

function Start-CurtainClose {
    if ($script:isClosing) {
        return
    }

    $script:isClosing = $true
    Write-OverlayLog "Overlay closing"
    if ($timer) {
        $timer.Stop()
    }

    $screenFade = New-Object System.Windows.Media.Animation.DoubleAnimation
    $screenFade.To = 0
    $screenFade.Duration = New-Object System.Windows.Duration ([TimeSpan]::FromMilliseconds(500))
    $screenFade.Add_Completed({
        $script:allowClose = $true
        $window.Close()
    })
    $root.BeginAnimation([System.Windows.UIElement]::OpacityProperty, $screenFade)
}

$startedAt = [DateTime]::UtcNow
$timer = New-Object System.Windows.Threading.DispatcherTimer
$timer.Interval = [TimeSpan]::FromMilliseconds(50)
$timer.Add_Tick({
    Refresh-CurtainTopmost
    $elapsed = ([DateTime]::UtcNow - $startedAt).TotalSeconds

    if ($Timeout -gt 0 -and $elapsed -ge $Timeout) {
        Start-CurtainClose
        return
    }

    if ($script:KeyboardApiAvailable) {
        try {
            $escapePressed = (([LaunchCurtainXInput]::GetAsyncKeyState(0x1B) -band 0x8000) -ne 0)
            if ($escapePressed -and -not $script:escapeDown) {
                $script:escapeDown = $true
                Start-CurtainClose
                return
            }
            $script:escapeDown = $escapePressed
        }
        catch {
            $script:escapeDown = $false
        }
    }

    if ($script:XInputAvailable) {
        $anyCloseButtonDown = $false
        for ($controller = 0; $controller -lt 4; $controller++) {
            $state = New-Object LaunchCurtainXInput+XINPUT_STATE
            try {
                $result = [LaunchCurtainXInput]::XInputGetState($controller, [ref]$state)
            }
            catch {
                $script:XInputAvailable = $false
                break
            }
            if ($result -ne 0) {
                continue
            }

            $buttons = $state.Gamepad.wButtons
            $closeButtonDown = (($buttons -band 0x2000) -ne 0) -or (($buttons -band 0x1000) -ne 0)
            $anyCloseButtonDown = $anyCloseButtonDown -or $closeButtonDown
            if ($closeButtonDown -and -not $script:closeButtonDown) {
                $script:closeButtonDown = $true
                Start-CurtainClose
                return
            }
        }
        $script:closeButtonDown = $anyCloseButtonDown
    }
})

$window.Add_KeyDown({
    param($sender, $event)
    if ($event.Key -eq [System.Windows.Input.Key]::Escape) {
        Start-CurtainClose
    }
})

$window.Add_Closing({
    param($sender, $event)
    if (-not $script:allowClose) {
        $event.Cancel = $true
        Start-CurtainClose
    }
})

$window.Add_SourceInitialized({
    Set-WindowNoActivate
    Hide-SystemCursor
})

$window.Add_Loaded({
    Set-WindowNoActivate
    Hide-SystemCursor
    Write-OverlayLog "Overlay window loaded"
    $window.Dispatcher.BeginInvoke([Action]{
        Load-CurtainContent
    }, [System.Windows.Threading.DispatcherPriority]::Background) | Out-Null
})

$dispatcher = [System.Windows.Threading.Dispatcher]::CurrentDispatcher
$window.Add_Closed({
    Write-OverlayLog "Overlay window closed"
    Restore-SystemCursor
    if ($timer) {
        $timer.Stop()
    }
    $dispatcher.BeginInvokeShutdown([System.Windows.Threading.DispatcherPriority]::Background)
})

$timer.Start()
$window.Show() | Out-Null
[System.Windows.Threading.Dispatcher]::Run()
