@echo off
for /f "tokens=1,2*delims=[],=" %%a in ('find /n /v "" %~dp0.env') do if not "%%~b" == "" set "%%b=%%c"