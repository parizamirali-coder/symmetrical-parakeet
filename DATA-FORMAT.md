# CSV data format

The central dataset consists of two plain-text CSV files in the project root. They are also published as public website files.

## 1. `students.csv`

Exact header:

```csv
student_id,display_name
```

One row per student. This roster provides the display label and is used to generate QR cards. It can be completed before any scores are entered.

| Column | Required? | Meaning | Example |
|---|---|---|---|
| `student_id` | Yes | QR lookup code | `A103-X7Q` |
| `display_name` | Yes | Approved public label | `Jamie` |

## 2. `scores.csv`

Exact header:

```csv
student_id,subject,assessment,date,score,max_score,feedback
```

Each row represents one assessment result.

| Column | Required? | Meaning | Example |
|---|---|---|---|
| `student_id` | Yes | Must match an ID in `students.csv` | `A103-X7Q` |
| `subject` | Yes | Subject/course label | `Mathematics` |
| `assessment` | Yes | Assessment name | `Unit 2 test` |
| `date` | No | Date in `YYYY-MM-DD` format | `2026-10-12` |
| `score` | Yes | Awarded points | `18` |
| `max_score` | Yes | Maximum points; greater than zero | `20` |
| `feedback` | No | Optional short note, up to 500 characters | `Good work on fractions.` |

## Rules

- Keep the exact column names and order.
- Use UTF-8 CSV with commas. In Excel, choose **CSV UTF-8 (Comma delimited)**.
- Add each student once to `students.csv`; one student can have many rows in `scores.csv`.
- IDs must be 4–40 letters, numbers, underscores or hyphens.
- Do not use student numbers, birth dates, email addresses, or other personal identifiers as IDs.
- `display_name` is required and limited to 80 characters.
- `subject` is limited to 80 characters; `assessment` to 120; `feedback` to 500.
- `score` cannot be negative or greater than `max_score`. Use a period for decimal values.
- The same student/subject/assessment/date combination cannot appear twice.
- Keep optional columns even when their values are blank.

For a fictional demo, copy the contents of `demo-students.csv` into `students.csv`, and `demo-scores.csv` into `scores.csv`. These are fictional examples. Replace or clear them before using the project for anything else.
