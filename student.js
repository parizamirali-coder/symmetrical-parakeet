(() => {
  "use strict";

  const REFRESH_INTERVAL_MS = 30_000;

  // Read the CSV dataset directly from the repository, not from the GitHub Pages
  // deployment. CSV-only commits therefore become visible on the next poll without
  // waiting for a Pages rebuild.
  const DATA_REPOSITORY = Object.freeze({
    owner: "parizamirali-coder",
    repo: "symmetrical-parakeet",
    branch: "main"
  });

  const studentId = (new URLSearchParams(window.location.search).get("student") || "").trim();

  const ui = {
    status: document.getElementById("connection-status"),
    statusLabel: document.getElementById("connection-label"),
    notice: document.getElementById("connection-notice"),
    refreshButton: document.getElementById("refresh-button"),
    profile: document.getElementById("profile-card"),
    studentName: document.getElementById("student-name"),
    studentCode: document.getElementById("student-code"),
    studentAvatar: document.getElementById("student-avatar"),
    averageScore: document.getElementById("average-score"),
    assessmentCount: document.getElementById("assessment-count"),
    resultsSection: document.getElementById("results-section"),
    resultCount: document.getElementById("result-count"),
    resultsList: document.getElementById("results-list"),
    stateCard: document.getElementById("state-card"),
    stateIcon: document.getElementById("state-icon"),
    stateTitle: document.getElementById("state-title"),
    stateMessage: document.getElementById("state-message"),
    pageMeta: document.getElementById("page-meta"),
    lastUpdated: document.getElementById("last-updated")
  };

  let refreshing = false;
  let hasLoadedData = false;

  function setConnection(state, label) {
    ui.status.dataset.state = state;
    ui.statusLabel.textContent = label;
  }

  function showNotice(message, type = "warning") {
    ui.notice.textContent = message;
    ui.notice.dataset.type = type;
    ui.notice.hidden = false;
  }

  function clearNotice() {
    ui.notice.hidden = true;
    ui.notice.textContent = "";
    ui.notice.removeAttribute("data-type");
  }

  function showState(title, message, kind = "info") {
    ui.stateCard.hidden = false;
    ui.stateTitle.textContent = title;
    ui.stateMessage.textContent = message;
    ui.stateIcon.replaceChildren();

    if (kind === "loading") {
      const spinner = document.createElement("span");
      spinner.className = "loading-spinner";
      ui.stateIcon.append(spinner);
    } else {
      const symbol = document.createElement("span");
      symbol.textContent = kind === "error" ? "!" : kind === "empty" ? "—" : "i";
      symbol.style.fontSize = "20px";
      symbol.style.fontWeight = "750";
      ui.stateIcon.append(symbol);
    }
  }

  function parseCsv(input, requiredColumns) {
    const text = input.replace(/^\uFEFF/, "");
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];

      if (quoted) {
        if (char === '"' && next === '"') {
          field += '"';
          index += 1;
        } else if (char === '"') {
          quoted = false;
        } else {
          field += char;
        }
        continue;
      }

      if (char === '"' && field.length === 0) {
        quoted = true;
      } else if (char === ",") {
        row.push(field);
        field = "";
      } else if (char === "\n" || char === "\r") {
        if (char === "\r" && next === "\n") index += 1;
        row.push(field);
        if (row.some((cell) => cell.trim() !== "")) rows.push(row);
        row = [];
        field = "";
      } else {
        field += char;
      }
    }

    if (field.length > 0 || row.length > 0) {
      row.push(field);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
    }

    if (rows.length === 0) return [];
    const headers = rows.shift().map((header) => header.trim());
    const missing = requiredColumns.filter((column) => !headers.includes(column));
    if (missing.length > 0) {
      throw new Error(`A data file is missing these columns: ${missing.join(", ")}.`);
    }

    return rows.map((cells) => {
      const record = {};
      headers.forEach((header, index) => {
        record[header] = (cells[index] ?? "").trim();
      });
      return record;
    });
  }

  async function fetchCsv(filename, requiredColumns) {
    // This data URL is independent from the Pages URL. Pages may take time to
    // redeploy after a commit; raw.githubusercontent.com serves the current branch
    // file directly while this page stays open and polls every 30 seconds.
    const safeFilename = filename.split("/").map(encodeURIComponent).join("/");
    const url = new URL(
      `https://raw.githubusercontent.com/${encodeURIComponent(DATA_REPOSITORY.owner)}/${encodeURIComponent(DATA_REPOSITORY.repo)}/${encodeURIComponent(DATA_REPOSITORY.branch)}/${safeFilename}`
    );
    url.searchParams.set("_score_refresh", String(Date.now()));

    const response = await fetch(url.toString(), {
      method: "GET",
      mode: "cors",
      cache: "no-store",
      headers: {
        Accept: "text/plain",
        "Cache-Control": "no-cache"
      }
    });

    if (!response.ok) {
      throw new Error(
        `${filename} could not be loaded from the live GitHub dataset (HTTP ${response.status}). ` +
        `Check that ${filename} exists in ${DATA_REPOSITORY.owner}/${DATA_REPOSITORY.repo} on ${DATA_REPOSITORY.branch}.`
      );
    }

    return parseCsv(await response.text(), requiredColumns);
  }

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function formatDate(value) {
    if (!value) return "Date not supplied";
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(date);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
  }

  function renderProfile(student, records) {
    const displayName = student.display_name || "Student";
    ui.studentName.textContent = displayName;
    ui.studentCode.textContent = `Student code: ${studentId}`;
    ui.studentAvatar.textContent = Array.from(displayName.trim())[0]?.toUpperCase() || "S";
    ui.assessmentCount.textContent = String(records.length);

    if (records.length === 0) {
      ui.averageScore.textContent = "—";
    } else {
      const average = records.reduce((total, record) => {
        const score = Number(record.score);
        const max = Number(record.max_score);
        return total + (score / max) * 100;
      }, 0) / records.length;
      ui.averageScore.textContent = `${formatNumber(average)}%`;
    }

    ui.profile.hidden = false;
    ui.pageMeta.hidden = false;
  }

  function renderResults(records) {
    const sorted = [...records].sort((left, right) => {
      const leftDate = left.date || "";
      const rightDate = right.date || "";
      return rightDate.localeCompare(leftDate) || left.subject.localeCompare(right.subject);
    });

    const cards = sorted.map((record) => {
      const score = Number(record.score);
      const max = Number(record.max_score);
      const percent = Math.max(0, Math.min(100, (score / max) * 100));
      const card = makeElement("article", "result-card");
      const top = makeElement("div", "result-topline");
      const info = makeElement("div", "result-info");
      const subject = makeElement("div", "result-subject", record.subject || "Assessment");
      const title = makeElement("h3", "result-title", record.assessment || "Untitled assessment");
      const date = makeElement("div", "result-date", formatDate(record.date));
      const scoreBlock = makeElement("div", "result-score");
      const scoreValue = makeElement("strong", "", `${formatNumber(score)} / ${formatNumber(max)}`);
      const percentage = makeElement("span", "", `${formatNumber(percent)}%`);
      const track = makeElement("div", "score-track");
      const fill = makeElement("div", "score-fill");

      fill.style.setProperty("--progress", `${percent}%`);
      track.setAttribute("aria-label", `${formatNumber(percent)} percent`);
      track.setAttribute("role", "img");
      scoreBlock.append(scoreValue, percentage);
      info.append(subject, title, date);
      top.append(info, scoreBlock);
      track.append(fill);
      card.append(top, track);

      if (record.feedback) {
        card.append(makeElement("p", "result-feedback", record.feedback));
      }
      return card;
    });

    ui.resultsList.replaceChildren(...cards);
    ui.resultCount.textContent = `${records.length} ${records.length === 1 ? "result" : "results"}`;
    ui.resultsSection.hidden = records.length === 0;
    if (records.length > 0) {
      ui.stateCard.hidden = true;
    } else {
      showState("No results published yet", "Your student page is ready, but no assessment results have been published for you yet. Please check again later.", "empty");
    }
  }

  async function refreshScores({ manual = false } = {}) {
    if (refreshing || !studentId) return;
    refreshing = true;
    ui.refreshButton.disabled = true;
    if (!hasLoadedData) {
      setConnection("loading", "Connecting");
      showState("Loading your results", "Connecting to the published score data.", "loading");
    }

    try {
      const [students, allScores] = await Promise.all([
        fetchCsv("students.csv", ["student_id", "display_name"]),
        fetchCsv("scores.csv", ["student_id", "subject", "assessment", "score", "max_score"])
      ]);

      const normalisedId = studentId.toLocaleLowerCase();
      const student = students.find((record) => String(record.student_id || "").trim().toLocaleLowerCase() === normalisedId);
      if (!student) {
        ui.profile.hidden = true;
        ui.resultsSection.hidden = true;
        ui.pageMeta.hidden = true;
        ui.resultsList.replaceChildren();
        showState("Student profile not found", "This student ID is not in the live students.csv file on the school's GitHub repository yet. Ask the administrator to confirm that the student was saved to the main branch, then try Refresh again.", "error");
        setConnection("error", "Unknown student");
        hasLoadedData = true;
        clearNotice();
        return;
      }

      const records = allScores.filter((record) => String(record.student_id || "").trim().toLocaleLowerCase() === normalisedId);
      const validRecords = records.filter((record) => {
        const score = Number(record.score);
        const max = Number(record.max_score);
        return Number.isFinite(score) && Number.isFinite(max) && max > 0;
      });

      clearNotice();
      setConnection("success", "Live data");
      hasLoadedData = true;
      renderProfile(student, validRecords);
      renderResults(validRecords);
      ui.lastUpdated.textContent = `Updated ${new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date())}`;
    } catch (error) {
      console.error("Unable to refresh student scores:", error);
      setConnection("error", "Update unavailable");
      if (hasLoadedData) {
        showNotice("We could not reach the latest score data. The results shown are from the last successful update.", "error");
      } else {
        showState("Scores are temporarily unavailable", "Please check your internet connection and try again. Your QR link has not changed.", "error");
      }
    } finally {
      refreshing = false;
      ui.refreshButton.disabled = false;
      if (manual) ui.refreshButton.blur();
    }
  }

  if (!studentId) {
    setConnection("error", "QR code required");
    ui.refreshButton.disabled = true;
    showState("Open your personal QR link", "This page needs the student link from your printed QR code. Scan the QR code supplied by your school to view your results.", "empty");
    return;
  }

  if (!/^[A-Za-z0-9_-]{4,40}$/.test(studentId)) {
    setConnection("error", "Invalid link");
    ui.refreshButton.disabled = true;
    showState("This QR link is not valid", "Please use the QR code supplied by your school, or contact your school administrator for a replacement.", "error");
    return;
  }

  ui.refreshButton.addEventListener("click", () => refreshScores({ manual: true }));
  refreshScores();
  window.setInterval(() => refreshScores(), REFRESH_INTERVAL_MS);
})();
