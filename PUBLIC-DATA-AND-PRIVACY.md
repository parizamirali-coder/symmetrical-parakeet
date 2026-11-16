# Public data warning — read before adding real results

This project intentionally uses a public GitHub repository and publishes the complete student roster and score CSV files as public website assets. The dataset files are `students.csv` and `scores.csv` at the website root. The project has no authentication, authorisation, per-student permissions, or private access.

**Anyone can download the complete roster and score files.** The student page filters records in the browser only. That filtering is for display, not security. A QR code is a link, not a password. Anyone with a QR code can open that page, and anyone can inspect the public CSV files to see all rows.

Git commits also retain history. Deleting a row from the latest CSV does not automatically remove earlier versions from repository history.

## Safe intended use

Use this project only for results and display labels explicitly approved for unrestricted public release by the responsible school or organisation. Do not publish confidential or restricted student records. Prefer an approved display label; do not use student numbers, birth dates, email addresses, or similar identifiers as QR IDs. Random-looking codes reduce accidental guessability but do not make public data private.

Before deploying real records, have the responsible data-protection contact confirm the legal basis, required notices/permissions, retention period, and applicable local rules. Student grades linked to an identifier can be personal data under GDPR. See the [official GDPR text on EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj). This project is not legal advice.

## Transport note

CSV files remain plain, readable text; this project does not encrypt them. GitHub Pages normally serves websites over HTTPS. HTTPS does not restrict who can read public data.

## If private grades are required

This exact public/no-account/no-access-control design is not suitable. At least one requirement must change, such as adding an access-control service or using a data host that supports private access.
