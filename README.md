# Student Score Portal (flat Windows project)

A small static student score website for GitHub Pages. The ZIP contains **no project subfolders**: all supplied files are in one directory.

## What it does

- One administrator edits `students.csv` and `scores.csv` offline in Excel.
- Students do not create accounts. Each printed QR code opens `student.html?student=...`.
- The student page fetches the two public CSV files separately and checks for updates every 30 seconds. It updates the page content without reloading the page.
- GitHub Actions validates the CSV files and publishes only the website files and the two CSV files.
- Windows `.bat` utilities create the required GitHub Actions workflow, validate CSV data, install the QR package, and generate printable QR cards.

## Quick start

1. Extract this ZIP into one folder on Windows.
2. Create an empty public GitHub repository and clone it with GitHub Desktop.
3. Copy the files from the extracted folder directly into the cloned repository folder.
4. Run `CREATE-GITHUB-WORKFLOW.bat` from inside the cloned repository. It creates GitHub's required `.github/workflows/deploy.yml` automatically.
5. In GitHub repository Settings → Pages, select **GitHub Actions** as the source.
6. In GitHub Desktop, commit and push to `main`. GitHub Actions validates the data and publishes the website.
7. Read `SETUP-GITHUB.md` and `ADMIN-WORKFLOW.md` for the full setup and everyday editing steps.


## Flat file layout

All files below are at the same directory level:

- `index.html`, `student.html`, `styles.css`, `student.js` — public website.
- `students.csv`, `scores.csv` — public data at the website root.
- `validate_scores.py`, `generate_qr_codes.py`, `requirements.txt` — administrator utilities.
- `CREATE-GITHUB-WORKFLOW.bat`, `SETUP-ADMIN-TOOLS.bat`, `VALIDATE-SCORES.bat`, `GENERATE-QR-CODES.bat` — Windows setup and admin shortcuts.
- `deploy-workflow-template.yml` — copied into GitHub's required workflow location by the setup batch file.
- Markdown guides and fictional demo CSVs — documentation and examples, not included in the published website.

## Important privacy warning

The repository and published CSV files are public. Anyone can download the entire roster and score dataset. A QR code is only a link, not a password. Use only names/labels and results explicitly approved for unrestricted public release. See `PUBLIC-DATA-AND-PRIVACY.md` before adding data.
