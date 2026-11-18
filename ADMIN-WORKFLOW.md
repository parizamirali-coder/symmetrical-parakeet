# Administrator workflow (Windows)

There is one administrator. Students do not create accounts and do not edit data.

## One-time setup

1. Install GitHub Desktop: https://desktop.github.com/ .
2. Install Python 3.10 or newer: https://www.python.org/downloads/windows/ . Python is used for the QR generator and optional local validation.
3. Extract the project ZIP into one directory. Run `CREATE-GITHUB-WORKFLOW.bat` once, then upload/commit all files to the public GitHub repository, including the generated `.github/workflows/deploy.yml`.
4. In GitHub repository **Settings → Pages**, select **GitHub Actions** as the publishing source. See `SETUP-GITHUB.md`.
5. Run `SETUP-ADMIN-TOOLS.bat` once to install the small QR package for your Windows user account. This one-time installation needs internet. QR generation itself runs locally.
6. Clone the repository using GitHub Desktop.

## Regular score updates

1. Open `students.csv` and `scores.csv` in Excel. Both files are in the project root, beside the website files.
2. Add each student once to `students.csv`, using an approved public display label and a matching `student_id`.
3. Add or edit assessment rows in `scores.csv`. Every score row must use a `student_id` present in `students.csv`.
4. Save as **CSV UTF-8 (Comma delimited)**. Keep the filenames and exact header rows.
5. Optionally double-click `VALIDATE-SCORES.bat` to check both files locally. GitHub Actions also validates them on every push.
6. Open GitHub Desktop. It detects the modified CSV files.
7. Enter a short commit summary, such as `Publish mathematics test results`.
8. Click **Commit to main**, then **Push origin**.
9. Open the GitHub repository's **Actions** tab and confirm deployment succeeded.

The workflow will not publish a new version when validation fails. Fix the reported CSV problems and push again. Students see the new data after GitHub Pages finishes deployment and their browser performs its next background check (normally within 30 seconds after the data is live).

## Make or reprint QR cards

1. Make sure `students.csv` contains every student who needs a QR card. A student does not need a score row yet.
2. Double-click `GENERATE-QR-CODES.bat`.
3. Enter the published GitHub Pages base URL, including the repository path and trailing slash. Example: `https://yourname.github.io/student-score-portal/`.
4. The utility creates `QR-<student_id>.png` images and `QR-PRINT-SHEET.html` in the same project directory.
5. Open the print sheet, check the destination links, and print it from your browser.

The QR generator reads the local `students.csv`. It needs no web server. The QR images and print sheet are ignored by Git so they are not accidentally committed.

## What the administrator does not need

- No local server or database.
- No browser-based admin dashboard.
- No Git commands or terminal workflow for normal score updates.
- No manual website rebuild. Pushing to `main` triggers validation and deployment.
