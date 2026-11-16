@echo off
setlocal
cd /d "%~dp0"

echo =====================================================
echo  Student Score Portal - Windows admin tools setup
echo =====================================================
echo.

where py >nul 2>nul
if errorlevel 1 (
  echo Python was not found.
  echo Install Python 3.10 or newer from https://www.python.org/downloads/windows/
  echo During setup, enable the Python launcher if the installer offers it.
  pause
  exit /b 1
)

echo Installing the small QR-code package for your Windows user account.
echo Internet is needed for this one-time setup.
py -3 -m pip install --user -r requirements.txt
if errorlevel 1 goto :error

echo.
echo Setup complete. You can now run GENERATE-QR-CODES.bat.
pause
exit /b 0

:error
echo.
echo Setup did not complete. Check the error above and try again.
pause
exit /b 1
