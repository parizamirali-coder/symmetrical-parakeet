#!/usr/bin/env python3
"""Generate printable QR cards from the public student roster CSV."""

from __future__ import annotations

import argparse
import csv
import html
import re
import sys
from pathlib import Path
from urllib.parse import urlencode, urljoin, urlparse

try:
    import qrcode
except ImportError:
    print("The QR package is not installed. Run SETUP-ADMIN-TOOLS.bat first.", file=sys.stderr)
    raise SystemExit(2)

STUDENT_ID_RE = re.compile(r"^[A-Za-z0-9_-]{4,40}$")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create QR codes and a printable sheet from students.csv.")
    parser.add_argument("--students-csv", default="students.csv", help="Path to the student roster CSV.")
    parser.add_argument("--base-url", required=True, help="Published GitHub Pages base URL, ending in a slash.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    base_url = args.base_url.strip()
    parsed = urlparse(base_url)
    if parsed.scheme not in {"https", "http"} or not parsed.netloc:
        print("ERROR: --base-url must be a complete https:// or http:// URL.", file=sys.stderr)
        return 2
    if not base_url.endswith("/"):
        base_url += "/"

    roster_path = Path(args.students_csv)
    out_dir = Path(".")
    if not roster_path.is_file():
        print(f"ERROR: Student roster not found: {roster_path}", file=sys.stderr)
        return 1

    students: dict[str, str] = {}
    with roster_path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        if reader.fieldnames != ["student_id", "display_name"]:
            print("ERROR: students.csv must have exactly these columns: student_id,display_name", file=sys.stderr)
            return 1

        for line_number, row in enumerate(reader, start=2):
            student_id = (row.get("student_id") or "").strip()
            display_name = (row.get("display_name") or "").strip()
            if not student_id and not display_name:
                continue
            if not STUDENT_ID_RE.fullmatch(student_id):
                print(f"ERROR: Invalid student_id on roster line {line_number}: {student_id}", file=sys.stderr)
                return 1
            if not display_name:
                print(f"ERROR: Missing display_name on roster line {line_number}.", file=sys.stderr)
                return 1
            if student_id in students:
                print(f"ERROR: Duplicate student_id on roster: {student_id}", file=sys.stderr)
                return 1
            students[student_id] = display_name

    if not students:
        print("No students were found. Add rows to students.csv first.")
        return 1

    cards: list[str] = []

    for student_id, display_name in sorted(students.items(), key=lambda item: item[1].casefold()):
        query = urlencode({"student": student_id})
        student_url = urljoin(base_url, f"student.html?{query}")
        filename = f"QR-{student_id}.png"
        image_path = out_dir / filename

        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=9,
            border=4,
        )
        qr.add_data(student_url)
        qr.make(fit=True)
        qr.make_image(fill_color="#15213b", back_color="#ffffff").save(image_path)

        safe_name = html.escape(display_name)
        safe_id = html.escape(student_id)
        safe_url = html.escape(student_url, quote=True)
        cards.append(
            f'''<article class="qr-card">
  <div class="school-label">STUDENT SCORE PORTAL</div>
  <img src="{html.escape(filename, quote=True)}" alt="QR code for {safe_name}">
  <h2>{safe_name}</h2>
  <p class="student-code">Code: {safe_id}</p>
  <p class="instruction">Scan to view published results</p>
  <p class="small-url">{safe_url}</p>
</article>'''
        )

    sheet = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Student QR Cards</title>
<style>
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; padding: 24px; color: #17233c; background: #f4f6fa; font-family: Arial, sans-serif; }}
  .toolbar {{ max-width: 1100px; margin: 0 auto 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; }}
  .toolbar h1 {{ margin: 0; font-size: 20px; }}
  .toolbar p {{ margin: 5px 0 0; color: #62708a; font-size: 12px; }}
  button {{ border: 0; border-radius: 9px; padding: 11px 16px; color: #fff; background: #425fe8; font-weight: 700; cursor: pointer; }}
  .grid {{ max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }}
  .qr-card {{ min-width: 0; padding: 18px; border: 1px solid #e3e8f1; border-radius: 15px; background: #fff; text-align: center; break-inside: avoid; page-break-inside: avoid; }}
  .school-label {{ margin-bottom: 10px; color: #61719a; font-size: 9px; font-weight: 700; letter-spacing: .13em; }}
  .qr-card img {{ width: 150px; height: 150px; object-fit: contain; }}
  .qr-card h2 {{ margin: 10px 0 4px; font-size: 16px; }}
  .student-code {{ margin: 0; color: #697790; font-size: 10px; }}
  .instruction {{ margin: 11px 0 4px; font-size: 11px; font-weight: 700; }}
  .small-url {{ margin: 0; color: #8993a5; font-size: 8px; overflow-wrap: anywhere; }}
  @media (max-width: 560px) {{ body {{ padding: 14px; }} .toolbar {{ align-items: flex-start; flex-direction: column; }} }}
  @media print {{
    @page {{ size: A4; margin: 10mm; }}
    body {{ padding: 0; background: #fff; print-color-adjust: exact; -webkit-print-color-adjust: exact; }}
    .toolbar {{ display: none; }}
    .grid {{ max-width: none; grid-template-columns: repeat(3, 1fr); gap: 8mm; }}
    .qr-card {{ padding: 5mm; border: 1px solid #d9deea; border-radius: 3mm; }}
    .qr-card img {{ width: 34mm; height: 34mm; }}
    .qr-card h2 {{ font-size: 11pt; }}
    .small-url {{ display: none; }}
  }}
</style>
</head>
<body>
  <header class="toolbar"><div><h1>Student QR cards</h1><p>{len(cards)} QR card(s) generated from {html.escape(str(roster_path))}. Check the destination links before printing.</p></div><button onclick="window.print()" type="button">Print QR cards</button></header>
  <main class="grid">{''.join(cards)}</main>
</body>
</html>'''
    sheet_path = out_dir / "QR-PRINT-SHEET.html"
    sheet_path.write_text(sheet, encoding="utf-8")

    print(f"Generated {len(students)} QR code(s) beside the project files: {out_dir.resolve()}")
    print(f"Printable sheet: {sheet_path.resolve()}")
    print("Open QR-PRINT-SHEET.html in a browser and choose Print.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
