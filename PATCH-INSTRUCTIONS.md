# Live dataset patch

This patch makes the student page read `students.csv` and `scores.csv` directly from
the public GitHub repository's `main` branch, instead of from the GitHub Pages
deployment. The page loads once and refreshes its data every 30 seconds. CSV-only
commits no longer trigger a Pages deployment.

## Files

- `student.js` — replace the existing root-level `student.js`.
- `admin.js` — replace the existing root-level `admin.js` (updates the publish message).
- `deploy.yml` — copy to `.github/workflows/deploy.yml`, replacing the current deploy workflow.
- `validate-data.yml` — add as `.github/workflows/validate-data.yml`.

## Install

1. Replace the repository's root `student.js` and `admin.js`.
2. Replace `.github/workflows/deploy.yml` with this patch's `deploy.yml`.
3. Add this patch's `validate-data.yml` as `.github/workflows/validate-data.yml`.
4. Commit and push these changes to `main` once. This one-time website-code change deploys the updated student page.
5. Future student/score edits only update the CSV dataset. The student page fetches the current CSVs directly from GitHub and refreshes every 30 seconds; no Pages redeploy is needed for CSV-only commits.

## Important: verify the student row

I checked the current public `main` branch while preparing this patch. At that time:
- `students.csv` contained only its header: `student_id,display_name`
- `scores.csv` contained only its header.

So `rohan` was not present in the live public dataset at the time of inspection. The QR format
`student.html?student=rohan` is correct; the student row must first be saved to `students.csv`
on the `main` branch. It should look like:

```csv
student_id,display_name
rohan,Rohan
```

After creating the student in the admin panel, verify that row appears in the repository's
`students.csv`. If it does not, the admin panel may be connected to a different repository
or branch, or the GitHub save did not complete.

## How it works

- Student scans the QR once and opens `student.html`.
- `student.js` fetches CSV data from `raw.githubusercontent.com`.
- The open page polls every 30 seconds and updates the score UI without reloading.
- CSV commits do not redeploy GitHub Pages. Only website-code/style/workflow changes need a Pages deployment.

The CSV dataset remains public. QR codes are not access control.
