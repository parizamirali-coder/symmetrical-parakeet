# Scoreboard Admin Panel — direct GitHub publishing

These are **new add-on files only** for the existing `symmetrical-parakeet` Student Score Portal. They are not a replacement for your student-facing website files.

## Files

- `admin.html` — open this file on the administrator's Windows computer.
- `admin.js` — reads the student roster and scores, validates edits, and commits changes using GitHub's REST API.
- `admin.css` — the matching responsive admin UI and analytics styling.

Keep all three files together in one folder. You can keep this folder outside the GitHub website repository. The admin panel is designed to run locally by double-clicking `admin.html`; it does not need GitHub Desktop, Python, Node, a local server, or a workflow change.

## First-time setup

1. Save/extract the three files into a permanent folder on the administrator's Windows PC, for example `Documents\Scoreboard Admin`.
2. Open `admin.html` in current Chrome or Microsoft Edge.
3. The GitHub settings window opens automatically.
4. Create a **fine-grained personal access token** from <https://github.com/settings/personal-access-tokens/new>.
5. Configure it as follows:
   - Resource owner: `amiraliparizz-coder`
   - Repository access: **Only select repositories** → `symmetrical-parakeet`
   - Repository permissions: **Contents — Read and write**
   - Keep the default Metadata read access.
   - Set an expiry that suits your school's token-rotation policy.
6. Paste the token in the admin panel and select **Save & connect**.

The default repository is `amiraliparizz-coder/symmetrical-parakeet`, branch `main`. The owner, repository, branch and token can be changed later in **Settings**. Use **Clear saved token** to remove the token from this browser.

## Everyday use

- The panel loads `students.csv` and `scores.csv` from the repository.
- Use **Add student** to append a student to `students.csv` when needed.
- Choose a student, type a subject manually, enter an assessment label, and enter a numeric score. The score input accepts decimal values (for example `17.5`).
- The `Out of` field defaults to `100`; change it when the assessment uses another maximum.
- Select **Publish score**. The panel writes a commit directly to `scores.csv`.
- Edit and Delete actions also create commits automatically.
- GitHub Actions then validates and publishes the student site. Students see the new data on their next background fetch; the student page does not reload.

The student roster uses the existing CSV format:

```csv
student_id,display_name
STU_1042,Alex Example
```

The score file keeps the existing format expected by `student.js` and `validate_scores.py`:

```csv
student_id,subject,assessment,date,score,max_score,feedback
STU_1042,Mathematics,Quiz 1,2026-11-15,17.5,20,Good progress
```

## Token and privacy notes

- The token is saved in the local browser's `localStorage` on this Windows PC. This tool does **not** encrypt it. It is never written into the repository or CSV files.
- The panel sends the token in the `Authorization` header to `https://api.github.com` only. The panel does not load third-party scripts, fonts, analytics, or services.
- Keep this admin folder private, keep the browser profile under the administrator's control, and do not share the Windows account or browser profile. Do not publish `admin.html` or `admin.js` to the student website.
- Anyone who obtains the token may be able to change repository contents within the permissions you granted. Revoke the token in GitHub immediately if the computer/browser profile is lost or compromised.
- The student site and CSV files remain public. The QR code is not access control; anyone can download the full roster and score file. Only publish scores and display names explicitly approved for public release.

## Troubleshooting

- **401 Unauthorized:** token is wrong, expired, revoked, or copied incorrectly.
- **403 Forbidden:** confirm this exact repository is selected and Contents is set to Read and write. GitHub may also enforce token approval or rate limits.
- **404 Not Found:** verify owner, repository, branch and that both CSV files exist in the repository root.
- **A file changed in GitHub:** the panel detects that its copy is stale, reloads the latest records and asks you to review before submitting again. This helps prevent overwriting another change.
- **Settings do not persist:** use current Chrome or Edge and leave the admin files in the same folder. If browser storage is unavailable, the token remains in memory only until the page closes.
- **No students appear:** add students using **Add student**. IDs must contain 4–40 letters, numbers, underscores or hyphens.

## What this tool changes

It updates only `students.csv` and `scores.csv`. It does not edit website code, GitHub Actions workflows, or Pages settings. The student-facing site continues to be deployed by the repository's existing workflow.
