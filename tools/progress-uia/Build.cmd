@echo off
call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat" >nul
if errorlevel 1 exit /b 1
cd /d "%~dp0"
cl /nologo /std:c++20 /W4 /WX /EHsc /O2 /MT Program.cpp Checks.cpp /Fe:LaunchCurtainProgressUia.exe /link /Brepro
exit /b %errorlevel%
