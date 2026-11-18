# Scoreboard live-data and direct-save patch (r2)

This patch addresses the currently published student page and the local admin panel.

## Confirmed live diagnosis (18 Nov 2026)

The Pages site is `amiraliparizz-coder/symmetrical-parakeet`, but the live `student.js` still reads `students.csv` and `scores.csv` relative to the Pages site. Those CSV files in the Pages repository contain only headers.

The actual data is in `parizamirali-coder/symmetrical-parakeet` on branch `main`:

`students.csv`
```csv
student_id,display_name
rohan,Rohan Khoda
```

`scores.csv`
```csv
student_id,subject,assessment,date,score,max_score,feedback
rohan,4,4,2026-11-18,4,100,
rohan,gfg,gf,2026-11-18,3,100,
```

## A. Update the public student website

In GitHub repository `amiraliparizz-coder/symmetrical-parakeet`, branch `main`, replace these two root-level files:

- `student.html`
- `student.js`

Commit and push them. Wait for the GitHub Pages deployment to finish. The updated HTML references a newly versioned JS URL (`student.js?v=20261118-live-csv-fix-r2`) to avoid reusing the old script from browser cache.

The new `student.js` fetches CSV data directly from:

`https://raw.githubusercontent.com/parizamirali-coder/symmetrical-parakeet/main/students.csv`

and

`https://raw.githubusercontent.com/parizamirali-coder/symmetrical-parakeet/main/scores.csv`

It polls every 30 seconds and does not need another Pages deployment when only CSV data changes.

## B. Update the local Windows admin panel

In the local folder where you open the admin panel, replace:

- `admin.html`
- `admin.js`
- `admin.css`

Open `admin.html` again in the same browser profile. In Settings, verify:

- Repository owner: `parizamirali-coder`
- Repository: `symmetrical-parakeet`
- Branch: `main`

If the browser previously saved `amiraliparizz-coder` as the data owner, this admin.js migrates that exact old setting to `parizamirali-coder`. Verify the settings after opening.

Your GitHub token must have **Contents: Read and write** permission on `parizamirali-coder/symmetrical-parakeet`. A token restricted to the Pages repository cannot save the data repository's CSV files.

## C. Saving and deleting scores

- **Save score to GitHub** commits the new row to `scores.csv` immediately. A success message appears only after GitHub confirms the commit.
- **Edit** followed by **Save changes to GitHub** commits the edit immediately.
- **Delete** asks for confirmation, then commits the row removal to `scores.csv` immediately.
- The previous staged/batch workflow is removed from the active save flow.

After a successful commit, the student's already-open page should show the change on its next background refresh (within about 30 seconds). A newly opened QR page fetches the current data when it loads.

## D. Verify after installation

1. Visit `https://amiraliparizz-coder.github.io/symmetrical-parakeet/student.html?student=rohan`.
2. It should identify Rohan Khoda and show two results (4/100 and 3/100) based on the data observed when this patch was prepared.
3. If it still does not, hard-refresh once (`Ctrl+F5`) and check the browser's Network tab for requests to `raw.githubusercontent.com/parizamirali-coder/symmetrical-parakeet/main/students.csv` and `scores.csv`.
4. If admin Save fails, read the exact GitHub error toast. Common causes are a token without write permission, wrong owner/repository/branch, or a stale file SHA. Refresh the admin data and retry after reviewing the latest rows.

## Important

The admin files must remain local and must not be committed to the public Pages repository. Only `student.html` and `student.js` from this patch go into the Pages repository. This patch does not push changes to GitHub on your behalf; you must commit the files in the two locations above.
