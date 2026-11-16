# One-time GitHub setup

The ZIP is flat: every supplied file is in the same directory. GitHub Actions has one fixed requirement: workflow files must be located in `.github/workflows/`. The Windows helper creates that required folder automatically inside your repository.

## Initial setup

1. Extract the ZIP into a folder on the Windows administrator computer.
2. Create an empty **public** GitHub repository named, for example, `student-score-portal`. Use `main` as the default branch.
3. Install/open GitHub Desktop and clone that empty repository to your computer.
4. Copy all files from the extracted project folder into the cloned repository folder. Copy the files themselves, not an enclosing project folder; `index.html`, `scores.csv`, and the other files should sit directly in the repository root.
5. In the cloned repository folder, double-click `CREATE-GITHUB-WORKFLOW.bat`. It creates `.github/workflows/deploy.yml` automatically.
6. In GitHub, open repository **Settings → Pages** and select **GitHub Actions** as the source.
7. Return to GitHub Desktop. Commit all added files to `main`, then click **Push origin**.
8. Open the **Actions** tab and confirm that validation and publishing complete successfully.
9. The Pages deployment job shows the published website URL. A project site normally looks like `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.
10. Run `GENERATE-QR-CODES.bat` and enter that exact base URL, including the final slash.

## What GitHub publishes

The workflow publishes only these six root-level files: `index.html`, `student.html`, `styles.css`, `student.js`, `students.csv`, and `scores.csv`. Documentation, demo CSVs, Python tools, and batch files are not copied into the Pages website artifact. The GitHub repository itself remains public, so its contents can still be inspected there.

The roster and score dataset are served as public files at `/students.csv` and `/scores.csv` because this flat version intentionally keeps all data files at the website root.
