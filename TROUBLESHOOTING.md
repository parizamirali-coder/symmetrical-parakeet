# Troubleshooting

## GitHub Actions workflow does not start

- Confirm that `CREATE-GITHUB-WORKFLOW.bat` was run before uploading the project.
- Confirm that `.github/workflows/deploy.yml` exists in the repository. GitHub requires this exact folder and file location; the project ZIP keeps the template at the root and generates this required path for you.
- Confirm the default branch is `main` and that Pages uses **GitHub Actions** as the source.

## Validation fails

Open the failed validation step in the repository's Actions tab. It reports the file, line, and problem. Common causes:

- A header row was changed or deleted.
- Excel saved a non-UTF-8 or non-comma-separated file.
- A score is blank, non-numeric, negative, or above the maximum.
- A date is not `YYYY-MM-DD`.
- A duplicate student/subject/assessment/date row exists.
- A student ID contains spaces or unsupported punctuation.
- A score row references an ID missing from `students.csv`.

Correct the local CSV files, save, commit, and push again.

## QR link opens but shows no results

- Confirm that the URL's `student` value matches `student_id` in `students.csv` exactly.
- Confirm there is a matching row in `scores.csv`.
- Confirm the latest GitHub Actions deployment succeeded.
- Wait up to 30 seconds after deployment, or use the refresh icon.

## Student page cannot load score data

- Confirm that `/students.csv` and `/scores.csv` are published at the same site base path as `student.html`.
- Confirm Pages uses **GitHub Actions** and the latest deployment succeeded.
- The browser requests the CSV files separately; the page itself is not reloaded during the normal background refresh.

## QR generation says the qrcode package is missing

Run `SETUP-ADMIN-TOOLS.bat` once. It installs the small Python QR-code package for your Windows user account. Then run `GENERATE-QR-CODES.bat` again.

## QR cards point to the wrong address

Run the QR generator again and enter the exact Pages base URL shown by GitHub. Include the repository name for project sites and include the trailing slash, for example:

`https://yourname.github.io/student-score-portal/`

## Results do not update immediately

A data push must pass validation and finish deploying first. The student page polls every 30 seconds without a page reload. This is near-live polling, not instant push delivery. CDN or deployment delay can add extra time.
