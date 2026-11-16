#!/usr/bin/env python3
"""Validate the public student roster and score CSV using only Python's standard library."""

from __future__ import annotations

import csv
import sys
from datetime import datetime
from decimal import Decimal, InvalidOperation
from pathlib import Path
import re

SCORE_COLUMNS = [
    "student_id",
    "subject",
    "assessment",
    "date",
    "score",
    "max_score",
    "feedback",
]
STUDENT_COLUMNS = ["student_id", "display_name"]
STUDENT_ID_RE = re.compile(r"^[A-Za-z0-9_-]{4,40}$")


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)


def read_csv(path: Path, expected_columns: list[str]) -> tuple[list[dict[str, str]], str | None]:
    if not path.is_file():
        return [], f"File not found: {path}"
    try:
        with path.open("r", encoding="utf-8-sig", newline="") as file:
            reader = csv.DictReader(file)
            actual_columns = [column.strip() if column else "" for column in (reader.fieldnames or [])]
            if actual_columns != expected_columns:
                return [], (
                    f"{path} headers must be exactly: "
                    + ",".join(expected_columns)
                    + f". Found: {','.join(actual_columns)}"
                )
            rows = []
            for line_number, raw_row in enumerate(reader, start=2):
                if None in raw_row:
                    return [], f"{path}, line {line_number}: too many comma-separated fields. If a text field contains commas, save it as a quoted CSV field."
                row = {key: (value or "").strip() for key, value in raw_row.items()}
                if any(row.values()):
                    rows.append(row)
            return rows, None
    except UnicodeDecodeError:
        return [], f"{path} must be saved as UTF-8 CSV."
    except csv.Error as error:
        return [], f"CSV parsing error in {path}: {error}"


def main() -> int:
    scores_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("scores.csv")
    students_path = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("students.csv")

    students, error = read_csv(students_path, STUDENT_COLUMNS)
    if error:
        fail(error)
        return 1

    errors: list[str] = []
    known_students: dict[str, str] = {}
    for line_number, row in enumerate(students, start=2):
        student_id = row.get("student_id", "")
        display_name = row.get("display_name", "")
        if not STUDENT_ID_RE.fullmatch(student_id):
            errors.append(f"{students_path}, line {line_number}: student_id must be 4–40 letters, numbers, underscores or hyphens.")
        if not display_name:
            errors.append(f"{students_path}, line {line_number}: display_name is required.")
        if len(display_name) > 80:
            errors.append(f"{students_path}, line {line_number}: display_name must be 80 characters or fewer.")
        if student_id in known_students:
            errors.append(f"{students_path}, line {line_number}: duplicate student_id {student_id}.")
        elif student_id:
            known_students[student_id] = display_name

    score_rows, error = read_csv(scores_path, SCORE_COLUMNS)
    if error:
        fail(error)
        return 1

    seen_records: set[tuple[str, str, str, str]] = set()
    valid_count = 0

    for line_number, row in enumerate(score_rows, start=2):
        student_id = row.get("student_id", "")
        subject = row.get("subject", "")
        assessment = row.get("assessment", "")
        date_value = row.get("date", "")
        score_value = row.get("score", "")
        max_value = row.get("max_score", "")
        feedback = row.get("feedback", "")
        line_errors: list[str] = []

        def add_error(message: str) -> None:
            line_errors.append(f"{scores_path}, line {line_number}: {message}")

        if student_id not in known_students:
            add_error(f"student_id {student_id or '(blank)'} is not present in {students_path}.")
        if not subject:
            add_error("subject is required.")
        if len(subject) > 80:
            add_error("subject must be 80 characters or fewer.")
        if not assessment:
            add_error("assessment is required.")
        if len(assessment) > 120:
            add_error("assessment must be 120 characters or fewer.")
        if len(feedback) > 500:
            add_error("feedback must be 500 characters or fewer.")

        if date_value:
            try:
                datetime.strptime(date_value, "%Y-%m-%d")
            except ValueError:
                add_error("date must use YYYY-MM-DD format, or be left blank.")

        try:
            score = Decimal(score_value)
            maximum = Decimal(max_value)
            if not score.is_finite() or not maximum.is_finite():
                raise InvalidOperation
            if maximum <= 0:
                add_error("max_score must be greater than zero.")
            if score < 0:
                add_error("score cannot be negative.")
            if score > maximum:
                add_error("score cannot be greater than max_score.")
        except (InvalidOperation, ValueError):
            add_error("score and max_score must be valid numbers.")

        if student_id and subject and assessment:
            record_key = (student_id, subject, assessment, date_value)
            if record_key in seen_records:
                add_error("duplicate student/subject/assessment/date record.")
            seen_records.add(record_key)

        if line_errors:
            errors.extend(line_errors)
        else:
            valid_count += 1

    if errors:
        print("Data validation failed:")
        for error_message in errors:
            print(f" - {error_message}")
        print(f"\nFound {len(errors)} problem(s). Fix the CSV files and push again.")
        return 1

    print(f"Data is valid. Checked {len(known_students)} student(s) and {valid_count} score record(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
