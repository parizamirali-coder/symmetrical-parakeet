@echo off
setlocal
cd /d "%~dp0"

echo =====================================================
echo  Student Score Portal - QR code generator
echo =====================================================
echo.

where py >nul 2>nul
if errorlevel 1 (
  echo Python 3 was not found. Run SETUP-ADMIN-TOOLS.bat after installing Python.
  pause
  exit /b 1
)

echo Enter the published GitHub Pages base URL.
echo Example: https://yourname.github.io/student-score-portal/
echo.
set /p PAGES_URL=GitHub Pages URL: 
if "%PAGES_URL%"=="" (
  echo A website URL is required.
  pause
  exit /b 1
)

py -3 generate_qr_codes.py --students-csv students.csv --base-url "%PAGES_URL%"
if errorlevel 1 (
  echo.
  echo QR generation failed. Check the message above.
  pause
  exit /b 1
)

start "" "%CD%\QR-PRINT-SHEET.html"
echo.
echo The printable QR sheet has opened in your browser.
echo Use the browser Print command to print or save it as a PDF.
pause
