$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Parent = Split-Path -Parent $Root
$Version = (Get-Content (Join-Path $Root "package.json") -Raw | ConvertFrom-Json).version
$StagingRoot = Join-Path $Root "build-package"
$InstallerStage = Join-Path $StagingRoot "launch-curtain"
$ProjectStage = Join-Path $StagingRoot "launch-curtain-project-$Version"
$InstallerZip = Join-Path $Parent "Launch-Curtain_Installer-$Version.zip"
$ProjectZip = Join-Path $Parent "launch-curtain-project-$Version.zip"

$ResolvedRoot = [IO.Path]::GetFullPath($Root).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
$ResolvedStaging = [IO.Path]::GetFullPath($StagingRoot)
if (-not $ResolvedStaging.StartsWith($ResolvedRoot, [StringComparison]::OrdinalIgnoreCase)) {
  throw "Refusing to recreate a staging directory outside the Launch Curtain WIP"
}

if (Test-Path $StagingRoot) { Remove-Item -LiteralPath $StagingRoot -Recurse -Force }
New-Item -ItemType Directory -Force -Path (Join-Path $InstallerStage "dist") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $InstallerStage "assets") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $InstallerStage "helpers") | Out-Null

$Node = if ($env:PLAYHUB_NODE_DIR) { Join-Path $env:PLAYHUB_NODE_DIR "node.exe" } else { (Get-Command node -ErrorAction Stop).Source }
$Python = if ($env:PLAYHUB_PYTHON) { $env:PLAYHUB_PYTHON } else { (Get-Command python -ErrorAction Stop).Source }

& $Node (Join-Path $Root "tools/build-local.mjs")
if ($LASTEXITCODE -ne 0) { throw "Launch Curtain frontend build failed" }
& $Node --check (Join-Path $Root "dist/index.js")
if ($LASTEXITCODE -ne 0) { throw "dist/index.js validation failed" }
& $Python -m py_compile (Join-Path $Root "main.py")
if ($LASTEXITCODE -ne 0) { throw "main.py validation failed" }

foreach ($File in @("plugin.json", "main.py", "package.json", "LICENSE", "NOTICE", "README.md", "VERSION.txt", "CHANGELOG.md")) {
  Copy-Item -LiteralPath (Join-Path $Root $File) -Destination $InstallerStage -Force
}
Copy-Item -LiteralPath (Join-Path $Root "dist/index.js") -Destination (Join-Path $InstallerStage "dist/index.js") -Force
Copy-Item -Path (Join-Path $Root "assets/*") -Destination (Join-Path $InstallerStage "assets") -Recurse -Force
Copy-Item -Path (Join-Path $Root "helpers/*") -Destination (Join-Path $InstallerStage "helpers") -Recurse -Force
Compress-Archive -Path $InstallerStage -DestinationPath $InstallerZip -CompressionLevel Optimal -Force

New-Item -ItemType Directory -Force -Path $ProjectStage | Out-Null
$ProjectExclude = @(".git", "build-package", "data", "node_modules", "__pycache__", "logs")
Get-ChildItem -LiteralPath $Root -Force | Where-Object {
  $ProjectExclude -notcontains $_.Name
} | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination $ProjectStage -Recurse -Force
}
$ProjectPrefix = [IO.Path]::GetFullPath($ProjectStage).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
Get-ChildItem -LiteralPath $ProjectStage -Recurse -File | Where-Object {
  $_.Extension -in @('.pyc', '.pyo')
} | ForEach-Object {
  if (-not $_.FullName.StartsWith($ProjectPrefix, [StringComparison]::OrdinalIgnoreCase)) { throw 'Unsafe cached bytecode target' }
  Remove-Item -LiteralPath $_.FullName -Force
}
Get-ChildItem -LiteralPath $ProjectStage -Recurse -Directory | Where-Object {
  $_.Name -eq '__pycache__'
} | Sort-Object { $_.FullName.Length } -Descending | ForEach-Object {
  if (-not $_.FullName.StartsWith($ProjectPrefix, [StringComparison]::OrdinalIgnoreCase) -or ($_.Attributes -band [IO.FileAttributes]::ReparsePoint)) { throw 'Unsafe cache directory target' }
  Remove-Item -LiteralPath $_.FullName -Recurse -Force
}
Compress-Archive -Path $ProjectStage -DestinationPath $ProjectZip -CompressionLevel Optimal -Force
Remove-Item -LiteralPath $StagingRoot -Recurse -Force

Write-Host "Created $InstallerZip"
Write-Host "Created $ProjectZip"
