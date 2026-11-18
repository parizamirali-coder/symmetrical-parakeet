(() => {
  "use strict";

  const DEFAULT_SETTINGS = {
    owner: "parizamirali-coder",
    repo: "symmetrical-parakeet",
    branch: "main",
    theme: "system",
    language: "en",
    studentSiteUrl: "https://amiraliparizz-coder.github.io/symmetrical-parakeet/"
  };
  const STORAGE_KEY = "scoreboard-admin-settings-v1";
  const API_ROOT = "https://api.github.com";
  const API_VERSION = "2022-11-28";
  const SCORE_COLUMNS = ["student_id", "subject", "assessment", "date", "score", "max_score", "feedback"];
  const STUDENT_COLUMNS = ["student_id", "display_name"];
  const STUDENT_ID_PATTERN = /^[A-Za-z0-9_-]{4,40}$/;

  const $ = (id) => document.getElementById(id);
  const ui = {
    connection: $("connection-status"),
    connectionLabel: $("connection-label"),
    repoLabel: $("repo-label"),
    connectCard: $("connect-card"),
    connectNow: $("connect-now"),
    offlineConfigure: $("offline-configure"),
    offlineState: $("offline-state"),
    dashboard: $("dashboard"),
    updatedLabel: $("updated-label"),
    averageValue: $("average-value"),
    ringValue: $("ring-value"),
    averageRing: $("average-ring"),
    averageCaption: $("average-caption"),
    studentTotal: $("student-total"),
    assessmentTotal: $("assessment-total"),
    bestValue: $("best-value"),
    bestCaption: $("best-caption"),
    subjectBars: $("subject-bars"),
    highlightScore: $("highlight-score"),
    highlightSubject: $("highlight-subject"),
    highlightStudent: $("highlight-student"),
    studentSelect: $("student-select"),
    scoreForm: $("score-form"),
    formTitle: $("form-title"),
    subjectInput: $("subject-input"),
    assessmentInput: $("assessment-input"),
    scoreInput: $("score-input"),
    maxScoreInput: $("max-score-input"),
    dateInput: $("date-input"),
    feedbackInput: $("feedback-input"),
    previewRing: $("preview-ring"),
    previewPercent: $("preview-percent"),
    previewCaption: $("preview-caption"),
    formError: $("form-error"),
    saveButton: $("save-score"),
    saveLabel: $("save-label"),
    cancelEdit: $("cancel-edit"),
    recordsBody: $("records-body"),
    recordTotal: $("record-total"),
    recordSearch: $("record-search"),
    reloadData: $("reload-data"),
    rosterDescription: $("roster-description"),
    addStudentOpen: $("add-student-open"),
    settingsModal: $("settings-modal"),
    openSettings: $("open-settings"),
    closeSettings: $("close-settings"),
    repoOwner: $("repo-owner"),
    repoName: $("repo-name"),
    repoBranch: $("repo-branch"),
    githubToken: $("github-token"),
    tokenStatus: $("token-status"),
    settingsError: $("settings-error"),
    saveSettings: $("save-settings"),
    clearToken: $("clear-token"),
    studentModal: $("student-modal"),
    closeStudentModal: $("close-student-modal"),
    studentForm: $("student-form"),
    newStudentId: $("new-student-id"),
    newStudentName: $("new-student-name"),
    studentError: $("student-error"),
    saveStudent: $("save-student"),
    toastStack: $("toast-stack"),
    studentPicker: $("student-picker"),
    studentPickerTrigger: $("student-picker-trigger"),
    studentPickerMenu: $("student-picker-menu"),
    studentPickerSearch: $("student-picker-search"),
    studentPickerOptions: $("student-picker-options"),
    studentPickerValue: $("student-picker-value"),
    studentPickerMeta: $("student-picker-meta"),
    pickerAvatar: $("picker-avatar"),
    pickerCreateStudent: $("picker-create-student"),
    showStudentQr: $("show-student-qr"),
    settingsTabs: Array.from(document.querySelectorAll("[data-settings-tab]")),
    settingsPanels: Array.from(document.querySelectorAll("[data-settings-panel]")),
    saveAppearance: $("save-appearance"),
    saveDeveloper: $("save-developer"),
    saveLanguage: $("save-language"),
    languageChoices: Array.from(document.querySelectorAll("[data-language-choice]")),
    studentSiteUrl: $("student-site-url"),
    qrDestinationPreview: $("qr-destination-preview"),
    developerError: $("developer-error"),
    qrModal: $("qr-modal"),
    closeQrModal: $("close-qr-modal"),
    qrModalTitle: $("qr-modal-title"),
    qrStudentLabel: $("qr-student-label"),
    qrCanvas: $("qr-canvas"),
    qrUrlText: $("qr-url-text"),
    copyQrLink: $("copy-qr-link"),
    downloadQr: $("download-qr")
  };

  const FA_TRANSLATIONS = {
    "Admin workspace · Scoreboard": "پنل مدیریت · کارنامه",
    "Admin workspace": "پنل مدیریت",
    "Scoreboard": "کارنامه",
    "Scoreboard admin home": "صفحه اصلی مدیریت کارنامه",
    "Settings sections": "بخش‌های تنظیمات",
    "Color theme": "پوسته رنگی",
    "Close settings": "بستن تنظیمات",
    "Close QR code": "بستن کد QR",
    "Student results QR code": "کد QR نتایج دانش‌آموز",
    ". Grant": ". اعطا کنید",
    "fa": "فارسی",
    "Scoreboard Admin": "مدیریت کارنامه",
    "Not connected": "متصل نیست",
    "Settings": "تنظیمات",
    "ADMINISTRATION": "مدیریت",
    "Good work starts": "نتایج روشن، آغاز پیشرفت است",
    "with clear results.": "با کارنامه‌ای شفاف.",
    "Manage student assessments and publish updates straight to GitHub. No desktop Git client, no command line.": "ارزیابی‌های دانش‌آموزان را مدیریت کنید و تغییرات را مستقیم در گیت‌هاب منتشر کنید؛ بدون نرم‌افزار Git دسکتاپ و بدون خط فرمان.",
    "CONNECTED REPOSITORY": "مخزن متصل",
    "Changes are committed automatically when you save.": "تغییرات هنگام ذخیره به‌صورت خودکار ثبت می‌شوند.",
    "Connect your GitHub repository": "اتصال مخزن گیت‌هاب",
    "Enter a fine-grained GitHub token once. It stays on this Windows browser and can be changed or cleared in Settings.": "توکن دسترسی محدود گیت‌هاب را یک‌بار وارد کنید. توکن در مرورگر ویندوز شما ذخیره می‌شود و از بخش تنظیمات قابل تغییر یا حذف است.",
    "Configure connection": "تنظیم اتصال",
    "YOUR CLASS AT A GLANCE": "نمای کلی کلاس",
    "Score analytics": "تحلیل نمرات",
    "Waiting for data": "در انتظار دریافت داده‌ها",
    "CLASS AVERAGE": "میانگین کلاس",
    "Average percentage across published assessments": "میانگین درصدی ارزیابی‌های منتشرشده",
    "No results yet": "هنوز نتیجه‌ای ثبت نشده است",
    "Waiting for data": "در انتظار دریافت داده‌ها",
    "Refreshing…": "در حال به‌روزرسانی…",
    "Publishing batch…": "در حال انتشار گروهی…",
    "Adding student…": "در حال افزودن دانش‌آموز…",
    "Deleting…": "در حال حذف…",
    "Saving score…": "در حال ذخیره نمره…",
    "Saving changes…": "در حال ذخیره تغییرات…",
    "Save score to GitHub": "ذخیره نمره در گیت‌هاب",
    "Save changes to GitHub": "ذخیره تغییرات در گیت‌هاب",
    "Changes saved to GitHub": "تغییرات در گیت‌هاب ذخیره شد",
    "Score saved to GitHub": "نمره در گیت‌هاب ذخیره شد",
    "Could not save score": "ذخیره نمره انجام نشد",
    "Saving commits this score directly to GitHub. The student's page updates on its next refresh.": "با زدن ذخیره، نمره مستقیماً در گیت‌هاب ثبت می‌شود و صفحه دانش‌آموز در به‌روزرسانی بعدی آن را نشان می‌دهد.",
    "The new result is committed in scores.csv. The student's page will pick it up on its next refresh.": "نتیجه جدید در scores.csv ثبت شد و در به‌روزرسانی بعدی در صفحه دانش‌آموز نمایش داده می‌شود.",
    "The updated result is committed in scores.csv. The student's page will pick it up on its next refresh.": "نتیجه ویرایش‌شده در scores.csv ثبت شد و در به‌روزرسانی بعدی در صفحه دانش‌آموز نمایش داده می‌شود.",
    "Publish 0 scores": "انتشار ۰ نمره",
    "Select from your roster": "از فهرست دانش‌آموزان انتخاب کنید",
    "Find a student…": "جست‌وجوی دانش‌آموز…",
    "Create student": "ایجاد دانش‌آموز",
    "Show QR": "نمایش QR",
    "Edit": "ویرایش",
    "Delete": "حذف",
    "AVG": "میانگین",
    "STUDENTS": "دانش‌آموزان",
    "In your roster": "در فهرست شما",
    "ASSESSMENTS": "ارزیابی‌ها",
    "Published score entries": "نمره‌های منتشرشده",
    "HIGHEST RESULT": "بالاترین نتیجه",
    "Awaiting first score": "در انتظار اولین نمره",
    "PERFORMANCE": "عملکرد",
    "By subject": "بر اساس درس",
    "Average %": "میانگین ٪",
    "Subject insights will appear once scores are published.": "پس از انتشار نمره‌ها، تحلیل درس‌ها نمایش داده می‌شود.",
    "A LITTLE HIGHLIGHT": "نکته برجسته",
    "Top performance": "بهترین عملکرد",
    "No assessment data yet": "هنوز داده‌ای برای ارزیابی وجود ندارد",
    "Your strongest result will appear here.": "بهترین نتیجه شما اینجا نمایش داده می‌شود.",
    "NEW RESULT": "نتیجه جدید",
    "Add an assessment score": "افزودن نمره ارزیابی",
    "Student": "دانش‌آموز",
    "Choose a student": "یک دانش‌آموز انتخاب کنید",
    "Select from your roster": "از فهرست دانش‌آموزان انتخاب کنید",
    "Find a student…": "جست‌وجوی دانش‌آموز…",
    "Find a student": "جست‌وجوی دانش‌آموز",
    "Students": "دانش‌آموزان",
    "Connect GitHub to load the roster.": "برای بارگذاری فهرست، گیت‌هاب را متصل کنید.",
    "Create student": "ایجاد دانش‌آموز",
    "Show QR": "نمایش QR",
    "Subject": "درس",
    "Assessment": "ارزیابی",
    "Score": "نمره",
    "Numbers only · decimals allowed": "فقط عدد · اعشار مجاز است",
    "Out of": "از",
    "Maximum possible score": "حداکثر نمره ممکن",
    "Score preview": "پیش‌نمایش نمره",
    "Enter a score to see the percentage.": "برای مشاهده درصد، نمره را وارد کنید.",
    "Assessment date": "تاریخ ارزیابی",
    "Feedback": "بازخورد",
    "Optional": "اختیاری",
    "Add a short note for the student...": "یادداشت کوتاهی برای دانش‌آموز بنویسید...",
    "Add to batch": "افزودن به انتشار گروهی",
    "Cancel edit": "لغو ویرایش",
    "Publishing batch": "انتشار گروهی",
    "Clear all": "پاک‌کردن همه",
    "All staged scores are saved in one GitHub commit.": "تمام نمره‌های آماده‌شده در یک ثبت گیت‌هاب ذخیره می‌شوند.",
    "Add one or more results to the batch, then publish them together.": "یک یا چند نتیجه به فهرست اضافه کنید و سپس همه را با هم منتشر کنید.",
    "RECENT ACTIVITY": "فعالیت‌های اخیر",
    "Published scores": "نمره‌های منتشرشده",
    "STUDENT": "دانش‌آموز",
    "SUBJECT / ASSESSMENT": "درس / ارزیابی",
    "SCORE": "نمره",
    "DATE": "تاریخ",
    "Actions": "عملیات",
    "Connect GitHub to load score records.": "برای بارگذاری سوابق نمره، گیت‌هاب را متصل کنید.",
    "Updates are committed to scores.csv": "تغییرات در فایل scores.csv ثبت می‌شوند",
    "View commit history ↗": "مشاهده تاریخچه ثبت‌ها ↗",
    "Student roster": "فهرست دانش‌آموزان",
    "The score form uses student IDs from students.csv.": "فرم نمره از شناسه‌های فایل students.csv استفاده می‌کند.",
    "+ Add student": "+ افزودن دانش‌آموز",
    "Your admin space is ready.": "فضای مدیریت شما آماده است.",
    "Connect the repository once to load your student roster and published scores. Your settings stay on this Windows browser.": "برای بارگذاری فهرست دانش‌آموزان و نمره‌های منتشرشده، یک‌بار مخزن را متصل کنید. تنظیمات در همین مرورگر ویندوز ذخیره می‌شوند.",
    "Set up GitHub connection": "راه‌اندازی اتصال گیت‌هاب",
    "One-time token setup": "تنظیم یک‌باره توکن",
    "Direct commits to GitHub": "ثبت مستقیم در گیت‌هاب",
    "No GitHub Desktop": "بدون GitHub Desktop",
    "Local tool · GitHub stores the published data": "ابزار محلی · داده‌های منتشرشده در گیت‌هاب ذخیره می‌شوند",
    "CONNECTION": "اتصال",
    "GitHub settings": "تنظیمات گیت‌هاب",
    "Connect this local admin tool to your repository.": "این ابزار مدیریت محلی را به مخزن خود متصل کنید.",
    "Connection": "اتصال",
    "Appearance": "ظاهر",
    "Developer": "توسعه‌دهنده",
    "Language": "زبان",
    "One-time setup": "راه‌اندازی یک‌باره",
    "Your token is saved in this browser's local storage. It is sent only to api.github.com when the panel reads or commits repository files.": "توکن در حافظه محلی این مرورگر ذخیره می‌شود و فقط هنگام خواندن یا ثبت فایل‌های مخزن به api.github.com فرستاده می‌شود.",
    "Repository owner": "مالک مخزن",
    "Repository name": "نام مخزن",
    "Branch": "شاخه",
    "Fine-grained personal access token": "توکن دسترسی شخصی محدود",
    "No token saved on this browser yet.": "هنوز توکنی در این مرورگر ذخیره نشده است.",
    "Clear the saved GitHub token from this browser? You will need to enter it again to publish scores.": "توکن ذخیره‌شده گیت‌هاب از این مرورگر پاک شود؟ برای انتشار نمره‌ها باید دوباره آن را وارد کنید.",
    "Refreshing reloads the latest GitHub data and clears your unpublished batch. Continue?": "به‌روزرسانی، آخرین داده‌های گیت‌هاب را بارگذاری و فهرست انتشارنشده را پاک می‌کند. ادامه می‌دهید؟",
    "Clear all staged scores? Nothing in the batch has been published yet.": "تمام نمره‌های آماده‌شده پاک شوند؟ هنوز هیچ‌کدام از این موارد منتشر نشده‌اند.",
    "Token permissions": "دسترسی‌های توکن",
    "Create a": "ایجاد یک",
    "fine-grained token": "توکن دسترسی محدود",
    "for": "برای",
    "only this repository": "فقط همین مخزن",
    "Contents: Read and write": "محتوا: خواندن و نوشتن",
    "GitHub's default Metadata read permission is sufficient for repository identification.": "دسترسی پیش‌فرض خواندن Metadata در گیت‌هاب برای شناسایی مخزن کافی است.",
    "Create a fine-grained token ↗": "ایجاد توکن دسترسی محدود ↗",
    "Clear saved token": "حذف توکن ذخیره‌شده",
    "Save & connect": "ذخیره و اتصال",
    "Keep this HTML file and its JavaScript on your own computer. Do not publish the admin files or share this browser profile. The token is not encrypted by this tool.": "این فایل HTML و جاوااسکریپت را روی رایانه خود نگه دارید. فایل‌های مدیریت را منتشر نکنید و نمایه مرورگر را به اشتراک نگذارید. این ابزار توکن را رمزگذاری نمی‌کند.",
    "PERSONALISE YOUR WORKSPACE": "شخصی‌سازی فضای کاری",
    "Choose how the admin workspace looks on this device.": "ظاهر پنل مدیریت را در این دستگاه انتخاب کنید.",
    "Light": "روشن",
    "Bright and clean": "روشن و ساده",
    "Dark": "تیره",
    "Low-light comfort": "مناسب محیط کم‌نور",
    "System": "سیستم",
    "Follow Windows": "پیروی از ویندوز",
    "Saved on this browser": "ذخیره‌شده در این مرورگر",
    "Your appearance preference is local to this admin device and does not change the public student website.": "ترجیحات ظاهری فقط در این دستگاه مدیریت ذخیره می‌شوند و سایت عمومی دانش‌آموزان را تغییر نمی‌دهند.",
    "Save appearance": "ذخیره ظاهر",
    "ADVANCED CONFIGURATION": "پیکربندی پیشرفته",
    "Developer settings": "تنظیمات توسعه‌دهنده",
    "These values control the published student destination and local admin behaviour.": "این مقادیر مقصد سایت دانش‌آموزان و رفتار پنل مدیریت محلی را کنترل می‌کنند.",
    "Student score site URL": "نشانی سایت نمایش نمرات دانش‌آموزان",
    "Use the published site base URL and include the trailing slash. QR codes open student.html?student=STUDENT_ID.": "نشانی اصلی سایت منتشرشده را همراه با / پایانی وارد کنید. کدهای QR صفحه student.html?student=STUDENT_ID را باز می‌کنند.",
    "QR destination": "مقصد کد QR",
    "Save developer settings": "ذخیره تنظیمات توسعه‌دهنده",
    "The public student page reads the": "صفحه عمومی دانش‌آموز پارامتر",
    "student": "دانش‌آموز",
    "URL parameter. Keep that route unchanged when printing QR cards.": "را می‌خواند. هنگام چاپ کارت‌های QR این مسیر را تغییر ندهید.",
    "WORKSPACE LANGUAGE": "زبان فضای کاری",
    "Choose the language for this administrator workspace. Persian automatically enables a right-to-left layout.": "زبان پنل مدیریت را انتخاب کنید. با انتخاب فارسی، چیدمان راست‌به‌چپ به‌صورت خودکار فعال می‌شود.",
    "English": "انگلیسی",
    "Left-to-right layout": "چیدمان چپ‌به‌راست",
    "چیدمان راست‌به‌چپ": "چیدمان راست‌به‌چپ",
    "Language preference is stored locally and does not change the public student score page.": "زبان انتخاب‌شده به‌صورت محلی ذخیره می‌شود و صفحه عمومی نمرات دانش‌آموزان را تغییر نمی‌دهد.",
    "Save language": "ذخیره زبان",
    "ROSTER": "فهرست دانش‌آموزان",
    "Add a student": "افزودن دانش‌آموز",
    "Add a student record to students.csv.": "یک رکورد دانش‌آموز به فایل students.csv اضافه کنید.",
    "Student ID": "شناسه دانش‌آموز",
    "4–40 letters, numbers, underscores or hyphens.": "۴ تا ۴۰ حرف، عدد، زیرخط یا خط تیره.",
    "Display name": "نام نمایشی",
    "Name shown on the score page": "نامی که در صفحه نمرات نمایش داده می‌شود",
    "Add student": "افزودن دانش‌آموز",
    "STUDENT ACCESS": "دسترسی دانش‌آموز",
    "Student QR code": "کد QR دانش‌آموز",
    "Scan to open this student's published results.": "برای مشاهده نتایج منتشرشده این دانش‌آموز اسکن کنید.",
    "STUDENT RESULTS LINK": "پیوند نتایج دانش‌آموز",
    "Copy link": "کپی پیوند",
    "Download PNG": "دریافت PNG",
    "This QR code opens the student's personal score page, not the admin panel.": "این کد QR صفحه نمرات شخصی دانش‌آموز را باز می‌کند، نه پنل مدیریت را.",
    "Choose a student first.": "ابتدا یک دانش‌آموز انتخاب کنید.",
    "Enter a subject. The subject field is free text.": "نام درس را وارد کنید. این فیلد متنی آزاد است.",
    "Enter an assessment name.": "نام ارزیابی را وارد کنید.",
    "Score cannot be negative.": "نمره نمی‌تواند منفی باشد.",
    "Maximum score must be greater than zero.": "حداکثر نمره باید بزرگ‌تر از صفر باشد.",
    "Score cannot be greater than the maximum score.": "نمره نمی‌تواند از حداکثر نمره بیشتر باشد.",
    "This student already has a score for the same subject, assessment and date.": "برای این دانش‌آموز، در همین درس و ارزیابی و تاریخ، نمره‌ای ثبت شده است.",
    "No students yet. Create your first student.": "هنوز دانش‌آموزی وجود ندارد. اولین دانش‌آموز را ایجاد کنید.",
    "No matching students.": "دانش‌آموزی مطابق جست‌وجو پیدا نشد.",
    "No scores match your search.": "هیچ نمره‌ای با جست‌وجوی شما مطابقت ندارد.",
    "No assessment scores yet. Add your first result using the form.": "هنوز نمره ارزیابی وجود ندارد. اولین نتیجه را با فرم اضافه کنید.",
    "Enter a score and maximum to see the percentage.": "برای مشاهده درصد، نمره و حداکثر نمره را وارد کنید.",
    "Score cannot exceed the maximum.": "نمره نمی‌تواند از حداکثر بیشتر باشد.",
    "Use a decimal point for fractional values.": "برای مقادیر اعشاری از نقطه استفاده کنید.",
    "Score must be a number. Use a decimal point for fractional values.": "نمره باید عددی باشد. برای مقادیر اعشاری از نقطه استفاده کنید.",
    "Maximum score must be a valid finite number.": "حداکثر نمره باید یک عدد معتبر باشد.",
    "Score must be a valid finite number.": "نمره باید یک عدد معتبر باشد.",
    "The student site URL must start with https:// or http://.": "نشانی سایت دانش‌آموز باید با https:// یا http:// شروع شود.",
    "Enter the student site base URL, without query parameters or a hash.": "نشانی اصلی سایت دانش‌آموز را بدون پارامتر پرس‌وجو یا بخش هش وارد کنید.",
    "Add your GitHub token in Settings first.": "ابتدا توکن گیت‌هاب را در تنظیمات وارد کنید.",
    "No GitHub token is saved. Open Settings to connect.": "توکن گیت‌هاب ذخیره نشده است. برای اتصال تنظیمات را باز کنید.",
    "GitHub rejected this token. Check that it is copied correctly and has not expired.": "گیت‌هاب این توکن را نپذیرفت. از درستی کپی‌شدن و منقضی‌نشدن آن مطمئن شوید.",
    "GitHub denied this request. Check the token's repository access and Contents: Read and write permission. You may also have hit an API rate limit.": "گیت‌هاب این درخواست را رد کرد. دسترسی توکن به مخزن و مجوز خواندن و نوشتن محتوا را بررسی کنید. ممکن است به محدودیت تعداد درخواست‌های API نیز رسیده باشید.",
    "GitHub could not find this repository, branch, or CSV file. Check the owner, repository name and branch in Settings.": "گیت‌هاب این مخزن، شاخه یا فایل CSV را پیدا نکرد. مالک، نام مخزن و شاخه را در تنظیمات بررسی کنید.",
    "The file changed on GitHub while this page was open. The latest data has been reloaded; review it and try again.": "هنگامی که این صفحه باز بود، فایل در گیت‌هاب تغییر کرد. داده‌های جدید بارگذاری شدند؛ آن‌ها را بررسی و دوباره تلاش کنید.",
    "Connected": "متصل شد",
    "Connecting": "در حال اتصال",
    "Loading data": "در حال بارگذاری داده‌ها",
    "Syncing with GitHub…": "همگام‌سازی با گیت‌هاب…",
    "Sync failed": "همگام‌سازی ناموفق بود",
    "Connection failed": "اتصال ناموفق بود",
    "Verifying access": "در حال بررسی دسترسی",
    "Could not reconnect": "اتصال دوباره ممکن نشد",
    "Could not refresh": "به‌روزرسانی ممکن نشد",
    "Data refreshed": "داده‌ها به‌روزرسانی شدند",
    "Scores published": "نمره‌ها منتشر شدند",
    "Score deleted": "نمره حذف شد",
    "Student added": "دانش‌آموز اضافه شد",
    "Appearance saved": "ظاهر ذخیره شد",
    "Developer settings saved": "تنظیمات توسعه‌دهنده ذخیره شد",
    "Language saved": "زبان ذخیره شد",
    "Language updated": "زبان تغییر کرد",
    "QR generator unavailable": "تولیدکننده QR در دسترس نیست",
    "Could not create QR code": "ایجاد کد QR ممکن نشد",
    "Could not copy link": "کپی پیوند ممکن نشد",
    "Link copied": "پیوند کپی شد",
    "QR rendering failed.": "تولید تصویر QR ناموفق بود.",
    "The QR library could not load. Check your internet connection and reopen the admin page.": "کتابخانه QR بارگذاری نشد. اتصال اینترنت را بررسی کرده و صفحه مدیریت را دوباره باز کنید.",
    "Your theme preference has been saved on this browser.": "ترجیح ظاهری شما در این مرورگر ذخیره شد.",
    "New QR codes will use the updated student score site.": "کدهای QR جدید از نشانی به‌روزشده سایت نمرات استفاده می‌کنند.",
    "Saved token cleared. Enter a new token before reconnecting.": "توکن ذخیره‌شده پاک شد. پیش از اتصال دوباره، توکن جدید وارد کنید.",
    "Browser storage unavailable": "حافظه مرورگر در دسترس نیست",
    "Settings may not persist after closing this page. Keep the admin file in the same folder and browser.": "ممکن است تنظیمات پس از بستن صفحه ذخیره نمانند. فایل مدیریت را در همین پوشه و با همین مرورگر نگه دارید.",
    "Could not publish batch": "انتشار گروهی ممکن نشد",
    "Could not delete score": "حذف نمره ممکن نشد",
    "Could not add student": "افزودن دانش‌آموز ممکن نشد",
    "Could not refresh": "به‌روزرسانی ممکن نشد",
    "Finish the publishing batch first": "ابتدا انتشار گروهی را تمام کنید",
    "Publish or clear staged scores before deleting an existing record.": "پیش از حذف یک رکورد، نمره‌های آماده‌شده را منتشر یا پاک کنید.",
    "Batch cleared": "فهرست انتشار پاک شد",
    "All unpublished staged scores have been removed.": "تمام نمره‌های منتشرنشده از فهرست حذف شدند.",
    "Clear all staged scores? Nothing in the batch has been published yet.": "تمام نمره‌های آماده‌شده پاک شوند؟ هنوز هیچ‌کدام از این موارد منتشر نشده‌اند.",
    "A staged edit no longer matches the current score list. Clear the batch and review the latest records.": "یکی از ویرایش‌های آماده‌شده دیگر با فهرست فعلی نمره‌ها مطابقت ندارد. فهرست را پاک کرده و آخرین رکوردها را بررسی کنید.",
    "Refreshing reloads the latest GitHub data and clears your unpublished batch. Continue?": "به‌روزرسانی، آخرین داده‌های گیت‌هاب را بارگذاری و فهرست انتشارنشده را پاک می‌کند. ادامه می‌دهید؟",
    "Could not publish score": "انتشار نمره ممکن نشد",
    "A token is saved on this browser. Leave the field blank to keep it, or enter a replacement.": "یک توکن در این مرورگر ذخیره شده است. برای حفظ آن، فیلد را خالی بگذارید؛ یا توکن جایگزین وارد کنید.",
    "The token appears to contain spaces or line breaks. Paste it again without extra whitespace.": "به نظر می‌رسد توکن دارای فاصله یا شکست خط است. آن را دوباره و بدون فاصله اضافی وارد کنید.",
    "Repository owner, repository name and branch are all required.": "واردکردن مالک مخزن، نام مخزن و شاخه الزامی است.",
    "Paste a GitHub fine-grained token to connect this admin panel.": "برای اتصال پنل مدیریت، یک توکن دسترسی محدود گیت‌هاب وارد کنید.",
    "Connected for this session": "برای این نشست متصل شد",
    "This browser would not save local settings. The token will remain in memory until this page is closed.": "این مرورگر تنظیمات محلی را ذخیره نمی‌کند. توکن تا زمان بسته‌شدن این صفحه در حافظه باقی می‌ماند.",
    "GitHub connected": "گیت‌هاب متصل شد",
    "Student site URL is not valid": "نشانی سایت دانش‌آموز معتبر نیست",
    "Could not load": "بارگذاری ممکن نشد",
    "Could not reconnect": "اتصال دوباره ممکن نشد",
    "Could not connect": "اتصال ممکن نشد",
    "The latest data has been loaded and the pending batch was cleared. Review the latest records and stage the changes again.": "آخرین داده‌ها بارگذاری و فهرست انتشار پاک شد. رکوردهای جدید را بررسی و تغییرات را دوباره آماده کنید.",
    "The QR code could not be generated. Try again after checking your connection.": "کد QR ایجاد نشد. پس از بررسی اتصال دوباره تلاش کنید.",
    "This browser does not support local storage.": "این مرورگر از حافظه محلی پشتیبانی نمی‌کند.",
    "Could not save local settings.": "ذخیره تنظیمات محلی ممکن نشد.",
    "Change staged": "ویرایش آماده انتشار شد",
    "Score added to batch": "نمره به فهرست انتشار اضافه شد",
    "Stage changes": "آماده‌سازی تغییرات",
    "Save changes": "ذخیره تغییرات",
    "Publish score": "انتشار نمره",
    "Delete": "حذف",
    "Edit": "ویرایش",
    "Could not copy link": "کپی پیوند ممکن نشد",
    "Select a student before showing their QR code.": "برای نمایش کد QR ابتدا یک دانش‌آموز انتخاب کنید.",
    "Student site URL is not valid.": "نشانی سایت دانش‌آموز معتبر نیست.",
    "Scan to open their published results.": "برای مشاهده نتایج منتشرشده اسکن کنید.",
    "QR generator is loading…": "تولیدکننده QR در حال بارگذاری است…",
    "QR code ready": "کد QR آماده است",
    "Use a valid student site URL.": "از یک نشانی معتبر برای سایت دانش‌آموز استفاده کنید.",
    "The score was added to the publishing batch.": "نمره به فهرست انتشار گروهی اضافه شد.",
    "This score is ready to publish.": "این نمره آماده انتشار است.",
    "GitHub request failed": "درخواست گیت‌هاب ناموفق بود",
    "Could not add the student.": "افزودن دانش‌آموز ممکن نشد.",
    "Student ID must be 4–40 letters, numbers, underscores or hyphens.": "شناسه دانش‌آموز باید ۴ تا ۴۰ حرف، عدد، زیرخط یا خط تیره داشته باشد.",
    "Enter a display name.": "نام نمایشی را وارد کنید.",
    "Display name must be 80 characters or fewer.": "نام نمایشی باید حداکثر ۸۰ نویسه باشد.",
    "That student ID already exists.": "این شناسه دانش‌آموز از قبل وجود دارد.",
    "No scores yet": "هنوز نمره‌ای وجود ندارد",
    "No scores match your search.": "هیچ نمره‌ای با جست‌وجوی شما مطابقت ندارد."
  };

  const ORIGINAL_TEXT = new WeakMap();
  const ORIGINAL_ATTRIBUTES = new WeakMap();
  let translationObserver = null;

  function translatedString(original, language = state.settings.language) {
    if (language !== "fa") return original;
    const trimmed = String(original).trim();
    let translated = FA_TRANSLATIONS[trimmed];
    if (!translated) {
      let match;
      if ((match = trimmed.match(/^(\d+) students? in students\.csv · Changes are saved directly to GitHub\.$/))) {
        translated = `${match[1]} دانش‌آموز در students.csv · تغییرات مستقیماً در گیت‌هاب ذخیره می‌شوند.`;
      } else if ((match = trimmed.match(/^(\d+) scores? staged$/))) {
        translated = `${match[1]} نمره آماده انتشار`;
      } else if ((match = trimmed.match(/^Publish (\d+) scores?$/))) {
        translated = `انتشار ${match[1]} نمره`;
      } else if ((match = trimmed.match(/^(\d+) records?$/))) {
        translated = `${match[1]} رکورد`;
      } else if ((match = trimmed.match(/^(\d+) published results? included$/))) {
        translated = `${match[1]} نتیجه منتشرشده در محاسبه لحاظ شد`;
      } else if ((match = trimmed.match(/^Loaded (\d+) student\(s\) and (\d+) score record\(s\)\.$/))) {
        translated = `${match[1]} دانش‌آموز و ${match[2]} رکورد نمره بارگذاری شد.`;
      } else if ((match = trimmed.match(/^Connected to (.+) on (.+)\. Settings are saved on this PC\.$/))) {
        translated = `به ${match[1]} در شاخه ${match[2]} متصل شد. تنظیمات در این رایانه ذخیره شدند.`;
      } else if ((match = trimmed.match(/^Committed (.+)$/))) {
        translated = `ثبت شد: ${match[1]}`;
      } else if ((match = trimmed.match(/^Student ID · (.+)$/))) {
        translated = `شناسه دانش‌آموز · ${match[1]}`;
      } else if ((match = trimmed.match(/^Student ID (.+) · Scan to open their published results\.$/))) {
        translated = `شناسه دانش‌آموز ${match[1]} · برای مشاهده نتایج منتشرشده اسکن کنید.`;
      } else if ((match = trimmed.match(/^(.+)'s QR code$/))) {
        translated = `کد QR ${match[1]}`;
      } else if ((match = trimmed.match(/^Delete (.+) · (.+) for (.+)\? This will commit a change to scores\.csv\.$/))) {
        translated = `نمره «${match[1]} · ${match[2]}» برای ${match[3]} حذف شود؟ این تغییر در فایل scores.csv ثبت خواهد شد.`;
      } else if ((match = trimmed.match(/^(\d+) students? in your roster$/))) {
        translated = `${match[1]} دانش‌آموز در فهرست شما`;
      } else if ((match = trimmed.match(/^([0-9]+) score(s)? ready to publish together\.$/))) {
        translated = `${match[1]} نمره آماده انتشار گروهی است.`;
      } else if ((match = trimmed.match(/^([0-9]+) score(s)? committed together\. Students will see the new data on their next background refresh\.$/))) {
        translated = `${match[1]} نمره با هم در گیت‌هاب ثبت شد. دانش‌آموزان در تازه‌سازی خودکار بعدی داده‌های جدید را می‌بینند.`;
      } else if ((match = trimmed.match(/^([0-9]+) student(s)? and ([0-9]+) score record(s)? loaded\.$/))) {
        translated = `${match[1]} دانش‌آموز و ${match[3]} رکورد نمره بارگذاری شد.`;
      } else if ((match = trimmed.match(/^([0-9]+) students? in students\.csv · Changes are saved directly to GitHub\.$/))) {
        translated = `${match[1]} دانش‌آموز در students.csv · تغییرات مستقیماً در گیت‌هاب ذخیره می‌شوند.`;
      } else if ((match = trimmed.match(/^Score row (\d+): (.+)$/))) {
        translated = `سطر نمره ${match[1]}: ${match[2]}`;
      } else if ((match = trimmed.match(/^Student (.+) needs a display name\.$/))) {
        translated = `برای دانش‌آموز ${match[1]} باید نام نمایشی وارد شود.`;
      } else if ((match = trimmed.match(/^Duplicate student ID: (.+)\.$/))) {
        translated = `شناسه دانش‌آموز تکراری است: ${match[1]}.`;
      } else if ((match = trimmed.match(/^Student name for (.+) is longer than 80 characters\.$/))) {
        translated = `نام دانش‌آموز ${match[1]} بیشتر از ۸۰ نویسه است.`;
      } else if ((match = trimmed.match(/^Student ID "(.+)" must be 4–40 letters, numbers, underscores or hyphens\.$/))) {
        translated = `شناسه دانش‌آموز «${match[1]}» باید ۴ تا ۴۰ حرف، عدد، زیرخط یا خط تیره داشته باشد.`;
      }
    }
    if (!translated) return original;
    const start = String(original).indexOf(trimmed);
    return `${String(original).slice(0, start)}${translated}${String(original).slice(start + trimmed.length)}`;
  }

  function translateNode(node) {
    if (node.nodeType !== Node.TEXT_NODE || !node.parentElement) return;
    if (node.parentElement.closest("script,style,[data-no-translate]")) return;
    if (!ORIGINAL_TEXT.has(node)) ORIGINAL_TEXT.set(node, node.nodeValue);
    const original = ORIGINAL_TEXT.get(node);
    const next = translatedString(original);
    if (node.nodeValue !== next) node.nodeValue = next;
  }

  function translateElementAttributes(element) {
    if (!(element instanceof Element) || element.closest("[data-no-translate]")) return;
    const attrs = ["placeholder", "aria-label", "title", "alt"];
    let originals = ORIGINAL_ATTRIBUTES.get(element);
    if (!originals) {
      originals = {};
      ORIGINAL_ATTRIBUTES.set(element, originals);
    }
    attrs.forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      const current = element.getAttribute(attribute);
      if (!(attribute in originals)) originals[attribute] = { original: current, lastApplied: current };
      else if (current !== originals[attribute].lastApplied) originals[attribute].original = current;
      const next = translatedString(originals[attribute].original);
      if (current !== next) element.setAttribute(attribute, next);
      originals[attribute].lastApplied = next;
    });
  }

  function translateSubtree(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateNode(root);
      return;
    }
    if (root.nodeType === Node.ELEMENT_NODE) translateElementAttributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateNode(node);
    if (root.querySelectorAll) root.querySelectorAll("*").forEach(translateElementAttributes);
  }

  function applyLanguage(language = state.settings.language) {
    const selected = language === "fa" ? "fa" : "en";
    state.settings.language = selected;
    document.documentElement.lang = selected;
    document.documentElement.dir = selected === "fa" ? "rtl" : "ltr";
    document.title = translatedString("Admin workspace · Scoreboard", selected);
    document.querySelectorAll("[data-language-choice]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.languageChoice === selected));
    });
    translateSubtree(document.body);
  }

  function observeDynamicContent() {
    if (translationObserver || !document.body || typeof MutationObserver === "undefined") return;
    translationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        if (record.type === "attributes") translateElementAttributes(record.target);
        record.addedNodes && record.addedNodes.forEach((node) => translateSubtree(node));
      });
    });
    translationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["placeholder", "aria-label", "title", "alt"]
    });
  }


  const state = {
    settings: { ...DEFAULT_SETTINGS },
    token: "",
    students: [],
    scores: [],
    scoresSha: "",
    studentsSha: "",
    connected: false,
    busy: false,
    editingIndex: null,
    selectedSettingsTab: "connection",
    activeQrUrl: "",
    storageAvailable: true
  };

  function loadSavedSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      const savedOwner = String(saved.owner || "");
      const savedRepo = String(saved.repo || DEFAULT_SETTINGS.repo);
      const savedBranch = String(saved.branch || DEFAULT_SETTINGS.branch);
      // Older copies of this project saved the website-hosting account as the
      // data repository owner. Migrate that exact default combination once.
      const migrateLegacyRepositoryOwner =
        savedOwner.toLowerCase() === "amiraliparizz-coder" &&
        savedRepo.toLowerCase() === DEFAULT_SETTINGS.repo.toLowerCase() &&
        savedBranch.toLowerCase() === DEFAULT_SETTINGS.branch.toLowerCase();
      state.settings = {
        owner: migrateLegacyRepositoryOwner ? DEFAULT_SETTINGS.owner : String(savedOwner || DEFAULT_SETTINGS.owner),
        repo: savedRepo,
        branch: savedBranch,
        theme: ["light", "dark", "system"].includes(saved.theme) ? saved.theme : DEFAULT_SETTINGS.theme,
        language: ["en", "fa"].includes(saved.language) ? saved.language : DEFAULT_SETTINGS.language,
        studentSiteUrl: String(saved.studentSiteUrl || DEFAULT_SETTINGS.studentSiteUrl)
      };
      state.token = typeof saved.token === "string" ? saved.token : "";
      if (migrateLegacyRepositoryOwner) saveSettingsLocally();
    } catch (error) {
      state.storageAvailable = false;
      console.warn("Local settings could not be read.", error);
    }
  }

  function saveSettingsLocally() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state.settings, token: state.token }));
      state.storageAvailable = true;
      return true;
    } catch (error) {
      state.storageAvailable = false;
      console.warn("Local settings could not be saved.", error);
      return false;
    }
  }

  function applyTheme(theme = state.settings.theme) {
    const selected = ["light", "dark", "system"].includes(theme) ? theme : "system";
    state.settings.theme = selected;
    document.documentElement.dataset.theme = selected === "system"
      ? (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : selected;
    document.documentElement.dataset.themePreference = selected;
    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.themeChoice === selected));
    });
  }

  function setSettingsTab(name) {
    state.selectedSettingsTab = name;
    ui.settingsTabs.forEach((tab) => {
      const active = tab.dataset.settingsTab === name;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    ui.settingsPanels.forEach((panel) => { panel.hidden = panel.dataset.settingsPanel !== name; });
  }

  function normaliseBaseUrl(value) {
    const raw = String(value || "").trim();
    const url = new URL(raw);
    if (!/^https?:$/.test(url.protocol)) throw new Error("The student site URL must start with https:// or http://.");
    if (url.search || url.hash) throw new Error("Enter the student site base URL, without query parameters or a hash.");
    if (!url.pathname.endsWith("/")) url.pathname += "/";
    return url.toString();
  }

  function makeStudentUrl(studentId) {
    const base = normaliseBaseUrl(state.settings.studentSiteUrl || DEFAULT_SETTINGS.studentSiteUrl);
    const url = new URL("student.html", base);
    url.searchParams.set("student", studentId);
    return url.toString();
  }

  function setConnection(status, label) {
    ui.connection.dataset.state = status;
    ui.connectionLabel.textContent = label;
  }

  function showToast(title, message, kind = "success") {
    const toast = document.createElement("div");
    toast.className = `toast${kind === "error" ? " error" : ""}`;
    const strong = document.createElement("strong");
    strong.textContent = title;
    const text = document.createElement("span");
    text.textContent = message;
    toast.append(strong, text);
    ui.toastStack.append(toast);
    window.setTimeout(() => toast.remove(), 5200);
  }

  function showError(target, message) {
    target.textContent = message;
    target.hidden = false;
  }

  function hideError(target) {
    target.textContent = "";
    target.hidden = true;
  }

  function setBusy(busy, label) {
    state.busy = busy;
    ui.saveButton.disabled = busy;
    ui.reloadData.disabled = busy;
    ui.saveSettings.disabled = busy;
    ui.saveStudent.disabled = busy;
    ui.saveLabel.textContent = busy && label ? label : (state.editingIndex === null ? "Save score to GitHub" : "Save changes to GitHub");
  }

  function currentRepoPath(path) {
    const { owner, repo } = state.settings;
    return `${API_ROOT}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path}`;
  }

  function authHeaders() {
    if (!state.token) throw new Error("Add your GitHub token in Settings first.");
    return {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${state.token}`,
      "X-GitHub-Api-Version": API_VERSION
    };
  }

  async function readJsonResponse(response) {
    let payload = {};
    try { payload = await response.json(); } catch (_) { /* GitHub may return an empty response. */ }
    if (!response.ok) {
      const detail = payload && payload.message ? payload.message : `GitHub returned HTTP ${response.status}.`;
      const error = new Error(explainGitHubError(response.status, detail));
      error.status = response.status;
      throw error;
    }
    return payload;
  }

  function explainGitHubError(status, detail) {
    if (status === 401) return "GitHub rejected this token. Check that it is copied correctly and has not expired.";
    if (status === 403) return "GitHub denied this request. Check the token's repository access and Contents: Read and write permission. You may also have hit an API rate limit.";
    if (status === 404) return "GitHub could not find this repository, branch, or CSV file. Check the owner, repository name and branch in Settings.";
    if (status === 409) return "The file changed on GitHub while this page was open. The latest data has been reloaded; review it and try again.";
    if (status === 422) return `GitHub could not create this commit. Check the data and repository permissions. ${detail}`;
    return `GitHub request failed (HTTP ${status}). ${detail}`;
  }

  async function getRepository() {
    const url = `${API_ROOT}/repos/${encodeURIComponent(state.settings.owner)}/${encodeURIComponent(state.settings.repo)}`;
    const response = await fetch(url, { headers: authHeaders(), cache: "no-store" });
    return readJsonResponse(response);
  }

  function decodeBase64Utf8(encoded) {
    const clean = String(encoded || "").replace(/\s/g, "");
    const binary = atob(clean);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
  }

  function encodeBase64Utf8(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
    }
    return btoa(binary);
  }

  async function getContents(path) {
    const url = `${currentRepoPath(path)}?ref=${encodeURIComponent(state.settings.branch)}&t=${Date.now()}`;
    const response = await fetch(url, { headers: authHeaders(), cache: "no-store" });
    const payload = await readJsonResponse(response);
    if (!payload || payload.type !== "file" || !payload.content) {
      throw new Error(`${path} is missing, empty or is not a normal file in the repository.`);
    }
    return { sha: payload.sha, text: decodeBase64Utf8(payload.content) };
  }

  async function putContents(path, text, sha, message) {
    const body = { message, content: encodeBase64Utf8(text), branch: state.settings.branch };
    if (sha) body.sha = sha;
    const response = await fetch(currentRepoPath(path), {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return readJsonResponse(response);
  }

  function parseCsv(text, expectedHeaders, filename) {
    const source = String(text).replace(/^\uFEFF/, "");
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;

    for (let index = 0; index < source.length; index += 1) {
      const char = source[index];
      const next = source[index + 1];
      if (quoted) {
        if (char === '"' && next === '"') {
          field += '"';
          index += 1;
        } else if (char === '"') {
          quoted = false;
        } else {
          field += char;
        }
      } else if (char === '"' && field.length === 0) {
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
    if (quoted) throw new Error(`${filename} contains an unfinished quoted CSV field.`);
    if (field.length > 0 || row.length > 0) {
      row.push(field);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
    }
    if (rows.length === 0) throw new Error(`${filename} has no CSV header row.`);

    const headers = rows.shift().map((value) => value.trim());
    if (headers.join("\u001f") !== expectedHeaders.join("\u001f")) {
      throw new Error(`${filename} must have these exact columns: ${expectedHeaders.join(", " )}.`);
    }
    return rows.map((cells, rowIndex) => {
      if (cells.length > headers.length) throw new Error(`${filename}, row ${rowIndex + 2}: too many columns.`);
      const record = {};
      headers.forEach((header, index) => { record[header] = String(cells[index] ?? "").trim(); });
      return record;
    }).filter((record) => Object.values(record).some((value) => value !== ""));
  }

  function csvCell(value) {
    const text = String(value ?? "");
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  function serialiseCsv(records, columns) {
    const lines = [columns.join(",")];
    records.forEach((record) => lines.push(columns.map((column) => csvCell(record[column])).join(",")));
    return `${lines.join("\r\n")}\r\n`;
  }

  function formatNumber(value) {
    const locale = state.settings.language === "fa" ? "fa-IR" : undefined;
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(Number(value));
  }

  function formatDate(value) {
    if (!value) return "—";
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    const locale = state.settings.language === "fa" ? "fa-IR-u-ca-gregory" : undefined;
    return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(date);
  }

  function percentOf(record) {
    const score = Number(record.score);
    const maximum = Number(record.max_score);
    return Number.isFinite(score) && Number.isFinite(maximum) && maximum > 0 ? (score / maximum) * 100 : 0;
  }

  function studentMap() {
    return new Map(state.students.map((student) => [student.student_id, student.display_name]));
  }

  function validateRoster(students) {
    const seen = new Set();
    for (const student of students) {
      if (!STUDENT_ID_PATTERN.test(student.student_id)) throw new Error(`Student ID "${student.student_id || "(blank)"}" must be 4–40 letters, numbers, underscores or hyphens.`);
      if (!student.display_name) throw new Error(`Student ${student.student_id} needs a display name.`);
      if (student.display_name.length > 80) throw new Error(`Student name for ${student.student_id} is longer than 80 characters.`);
      if (seen.has(student.student_id)) throw new Error(`Duplicate student ID: ${student.student_id}.`);
      seen.add(student.student_id);
    }
  }

  function validateScoreRows(scores, students) {
    const known = new Set(students.map((student) => student.student_id));
    const seen = new Set();
    for (const [index, record] of scores.entries()) {
      const rowNumber = index + 2;
      if (!known.has(record.student_id)) throw new Error(`Score row ${rowNumber} refers to unknown student ID "${record.student_id}".`);
      if (!record.subject || record.subject.length > 80) throw new Error(`Score row ${rowNumber}: subject is required and must be 80 characters or fewer.`);
      if (!record.assessment || record.assessment.length > 120) throw new Error(`Score row ${rowNumber}: assessment is required and must be 120 characters or fewer.`);
      if ((record.feedback || "").length > 500) throw new Error(`Score row ${rowNumber}: feedback must be 500 characters or fewer.`);
      if (record.date && !/^\d{4}-\d{2}-\d{2}$/.test(record.date)) throw new Error(`Score row ${rowNumber}: date must use YYYY-MM-DD format.`);
      const score = Number(record.score);
      const max = Number(record.max_score);
      if (record.score === "" || record.max_score === "" || !Number.isFinite(score) || !Number.isFinite(max)) throw new Error(`Score row ${rowNumber}: score and max_score must be valid numbers.`);
      if (score < 0) throw new Error(`Score row ${rowNumber}: score cannot be negative.`);
      if (max <= 0) throw new Error(`Score row ${rowNumber}: max_score must be greater than zero.`);
      if (score > max) throw new Error(`Score row ${rowNumber}: score cannot be greater than max_score.`);
      const key = [record.student_id, record.subject, record.assessment, record.date || ""].join("\u001f");
      if (seen.has(key)) throw new Error(`Duplicate score: ${record.subject} / ${record.assessment} for ${record.student_id} on ${record.date || "the same date"}.`);
      seen.add(key);
    }
  }

  async function loadData({ announce = false } = {}) {
    if (!state.token) throw new Error("No GitHub token is saved. Open Settings to connect.");
    setConnection("loading", "Loading data");
    ui.updatedLabel.textContent = "Syncing with GitHub…";
    const [studentFile, scoreFile] = await Promise.all([getContents("students.csv"), getContents("scores.csv")]);
    const students = parseCsv(studentFile.text, STUDENT_COLUMNS, "students.csv");
    const scores = parseCsv(scoreFile.text, SCORE_COLUMNS, "scores.csv");
    validateRoster(students);
    validateScoreRows(scores, students);
    state.students = students;
    state.scores = scores;
    state.studentsSha = studentFile.sha;
    state.scoresSha = scoreFile.sha;
    state.connected = true;
    setConnection("success", "Connected to GitHub");
    ui.repoLabel.textContent = `${state.settings.owner} / ${state.settings.repo}`;
    ui.connectCard.hidden = true;
    ui.offlineState.hidden = true;
    ui.dashboard.hidden = false;
    ui.updatedLabel.textContent = `Synced ${new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date())}`;
    renderAll();
    if (announce) showToast("Connected", `Loaded ${students.length} student(s) and ${scores.length} score record(s).`);
  }

  function renderAll() {
    renderStudents();
    renderAnalytics();
    renderRecords();
    ui.rosterDescription.textContent = `${state.students.length} student${state.students.length === 1 ? "" : "s"} in students.csv · Changes are saved directly to GitHub.`;
  }

  function renderStudents() {
    const previous = ui.studentSelect.value;
    const sorted = state.students.slice().sort((a, b) => a.display_name.localeCompare(b.display_name));
    const options = [new Option("Choose a student", "")];
    sorted.forEach((student) => options.push(new Option(`${student.display_name} · ${student.student_id}`, student.student_id)));
    ui.studentSelect.replaceChildren(...options);
    if (state.students.some((student) => student.student_id === previous)) ui.studentSelect.value = previous;
    else ui.studentSelect.value = "";
    const selected = state.students.find((student) => student.student_id === ui.studentSelect.value);
    ui.studentPickerValue.textContent = selected ? selected.display_name : "Choose a student";
    ui.studentPickerMeta.textContent = selected ? `Student ID · ${selected.student_id}` : `${state.students.length} student${state.students.length === 1 ? "" : "s"} in your roster`;
    ui.pickerAvatar.textContent = selected ? Array.from(selected.display_name.trim())[0]?.toUpperCase() || "S" : "?";
    ui.showStudentQr.disabled = !selected;
    ui.studentPickerOptions.replaceChildren();
    if (!sorted.length) {
      const empty = document.createElement("div");
      empty.className = "picker-empty";
      empty.textContent = "No students yet. Create your first student.";
      ui.studentPickerOptions.append(empty);
    } else {
      sorted.forEach((student) => {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "picker-option";
        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", String(student.student_id === ui.studentSelect.value));
        option.dataset.studentId = student.student_id;
        const avatar = document.createElement("span");
        avatar.className = "picker-option-avatar";
        avatar.textContent = Array.from(student.display_name.trim())[0]?.toUpperCase() || "S";
        const identity = document.createElement("span");
        identity.className = "picker-option-identity";
        const name = document.createElement("strong");
        name.textContent = student.display_name;
        const id = document.createElement("small");
        id.textContent = student.student_id;
        identity.append(name, id);
        const check = document.createElement("span");
        check.className = "picker-option-check";
        check.textContent = student.student_id === ui.studentSelect.value ? "✓" : "";
        option.append(avatar, identity, check);
        ui.studentPickerOptions.append(option);
      });
    }
    renderPickerFilter();
  }

  function renderPickerFilter() {
    const query = ui.studentPickerSearch.value.trim().toLocaleLowerCase();
    let visible = 0;
    ui.studentPickerOptions.querySelectorAll(".picker-option").forEach((option) => {
      const match = `${option.dataset.studentId} ${option.textContent}`.toLocaleLowerCase().includes(query);
      option.hidden = !match;
      if (match) visible += 1;
    });
    let empty = ui.studentPickerOptions.querySelector(".picker-no-match");
    if (!visible && ui.studentPickerOptions.querySelector(".picker-option")) {
      if (!empty) {
        empty = document.createElement("div");
        empty.className = "picker-empty picker-no-match";
        empty.textContent = "No matching students.";
        ui.studentPickerOptions.append(empty);
      }
      empty.hidden = false;
    } else if (empty) empty.hidden = true;
  }

  function setStudentSelection(studentId) {
    ui.studentSelect.value = studentId;
    const selected = state.students.find((student) => student.student_id === studentId);
    ui.studentPickerValue.textContent = selected ? selected.display_name : "Choose a student";
    ui.studentPickerMeta.textContent = selected ? `Student ID · ${selected.student_id}` : `${state.students.length} student${state.students.length === 1 ? "" : "s"} in your roster`;
    ui.pickerAvatar.textContent = selected ? Array.from(selected.display_name.trim())[0]?.toUpperCase() || "S" : "?";
    ui.showStudentQr.disabled = !selected;
    ui.studentPickerOptions.querySelectorAll(".picker-option").forEach((option) => {
      const active = option.dataset.studentId === studentId;
      option.setAttribute("aria-selected", String(active));
      const check = option.querySelector(".picker-option-check");
      if (check) check.textContent = active ? "✓" : "";
    });
    closeStudentPicker();
  }

  function openStudentPicker() {
    ui.studentPickerMenu.hidden = false;
    ui.studentPickerTrigger.setAttribute("aria-expanded", "true");
    ui.studentPickerSearch.value = "";
    renderPickerFilter();
    ui.studentPickerSearch.focus();
  }

  function closeStudentPicker() {
    ui.studentPickerMenu.hidden = true;
    ui.studentPickerTrigger.setAttribute("aria-expanded", "false");
  }


  function renderAnalytics() {
    const percentages = state.scores.map(percentOf);
    const average = percentages.length ? percentages.reduce((total, value) => total + value, 0) / percentages.length : 0;
    const bestIndex = percentages.length ? percentages.reduce((best, value, index) => value > percentages[best] ? index : best, 0) : -1;
    const best = bestIndex >= 0 ? state.scores[bestIndex] : null;
    const names = studentMap();

    ui.studentTotal.textContent = String(state.students.length);
    ui.assessmentTotal.textContent = String(state.scores.length);
    ui.averageValue.textContent = percentages.length ? `${formatNumber(average)}%` : "—";
    ui.ringValue.textContent = percentages.length ? `${Math.round(average)}%` : "—";
    ui.averageRing.style.setProperty("--ring-value", `${Math.max(0, Math.min(100, average))}%`);
    ui.averageRing.setAttribute("aria-label", percentages.length ? `Class average ${formatNumber(average)} percent` : "No scores yet");
    ui.averageCaption.textContent = percentages.length ? `${percentages.length} published result${percentages.length === 1 ? "" : "s"} included` : "No results yet";

    if (best) {
      const bestPercent = percentOf(best);
      ui.bestValue.textContent = `${formatNumber(bestPercent)}%`;
      ui.bestCaption.textContent = names.get(best.student_id) || best.student_id;
      ui.highlightScore.textContent = `${formatNumber(best.score)} / ${formatNumber(best.max_score)}`;
      ui.highlightSubject.textContent = best.subject;
      ui.highlightStudent.textContent = `${names.get(best.student_id) || best.student_id} · ${best.assessment}`;
    } else {
      ui.bestValue.textContent = "—";
      ui.bestCaption.textContent = "Awaiting first score";
      ui.highlightScore.textContent = "—";
      ui.highlightSubject.textContent = "No assessment data yet";
      ui.highlightStudent.textContent = "Your strongest result will appear here.";
    }

    const bySubject = new Map();
    state.scores.forEach((record) => {
      const key = record.subject;
      if (!bySubject.has(key)) bySubject.set(key, []);
      bySubject.get(key).push(percentOf(record));
    });
    const subjectRows = Array.from(bySubject.entries()).map(([subject, values]) => ({
      subject,
      average: values.reduce((total, value) => total + value, 0) / values.length,
      count: values.length
    })).sort((a, b) => b.average - a.average).slice(0, 6);
    if (!subjectRows.length) {
      ui.subjectBars.innerHTML = '<div class="empty-inline">Subject insights will appear once scores are published.</div>';
    } else {
      ui.subjectBars.innerHTML = subjectRows.map((item) => `
        <div class="subject-bar-row">
          <span class="subject-name" title="${escapeHtml(item.subject)}">${escapeHtml(item.subject)}</span>
          <span class="subject-track"><span class="subject-fill" style="--bar-value:${Math.max(0, Math.min(100, item.average))}%"></span></span>
          <span class="subject-percent">${formatNumber(item.average)}%</span>
        </div>`).join("");
    }
  }

  function renderRecords() {
    const query = ui.recordSearch.value.trim().toLocaleLowerCase();
    const names = studentMap();
    const matches = state.scores.map((record, index) => ({ record, index })).filter(({ record }) => {
      const haystack = [names.get(record.student_id), record.student_id, record.subject, record.assessment, record.date].join(" ").toLocaleLowerCase();
      return haystack.includes(query);
    }).sort((left, right) => (right.record.date || "").localeCompare(left.record.date || "") || left.record.subject.localeCompare(right.record.subject));

    ui.recordTotal.textContent = `${state.scores.length} record${state.scores.length === 1 ? "" : "s"}`;
    if (!matches.length) {
      ui.recordsBody.innerHTML = `<tr><td colspan="5" class="table-empty">${state.scores.length ? "No scores match your search." : "No assessment scores yet. Add your first result using the form."}</td></tr>`;
      return;
    }
    ui.recordsBody.innerHTML = matches.map(({ record, index }) => {
      const percent = percentOf(record);
      const name = names.get(record.student_id) || record.student_id;
      return `<tr>
        <td><span class="student-cell"><span>${escapeHtml(name)}</span><small>${escapeHtml(record.student_id)}</small></span></td>
        <td><span class="subject-cell"><strong>${escapeHtml(record.subject)}</strong><small>${escapeHtml(record.assessment)}</small></span></td>
        <td class="score-cell">${formatNumber(record.score)} / ${formatNumber(record.max_score)}<small>${formatNumber(percent)}%</small></td>
        <td class="date-cell">${escapeHtml(formatDate(record.date))}</td>
        <td><span class="row-actions"><button class="row-action" type="button" data-action="edit" data-index="${index}" aria-label="Edit ${escapeHtml(record.assessment)} for ${escapeHtml(name)}">Edit</button><button class="row-action delete" type="button" data-action="delete" data-index="${index}" aria-label="Delete ${escapeHtml(record.assessment)} for ${escapeHtml(name)}">Delete</button></span></td>
      </tr>`;
    }).join("");
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function updateScorePreview() {
    const score = ui.scoreInput.valueAsNumber;
    const maximum = ui.maxScoreInput.valueAsNumber;
    if (!Number.isFinite(score) || !Number.isFinite(maximum) || maximum <= 0 || score < 0) {
      ui.previewRing.style.setProperty("--preview-value", "0%");
      ui.previewPercent.textContent = "—";
      ui.previewCaption.textContent = "Enter a score and maximum to see the percentage.";
      return;
    }
    const percent = (score / maximum) * 100;
    ui.previewRing.style.setProperty("--preview-value", `${Math.min(100, percent)}%`);
    ui.previewPercent.textContent = `${formatNumber(percent)}%`;
    ui.previewCaption.textContent = score > maximum ? "Score cannot exceed the maximum." : `${formatNumber(score)} out of ${formatNumber(maximum)} points.`;
  }

  function showFormError(message) {
    showError(ui.formError, message);
  }

  function normaliseNumericField(input, label) {
    const raw = input.value.trim();
    if (!raw || input.validity.badInput) throw new Error(`${label} must be a number. Use a decimal point for fractional values.`);
    const value = input.valueAsNumber;
    if (!Number.isFinite(value)) throw new Error(`${label} must be a valid finite number.`);
    return value;
  }

  function scoreFromForm() {
    const studentId = ui.studentSelect.value;
    const subject = ui.subjectInput.value.trim();
    const assessment = ui.assessmentInput.value.trim();
    const score = normaliseNumericField(ui.scoreInput, "Score");
    const maxScore = normaliseNumericField(ui.maxScoreInput, "Maximum score");
    const date = ui.dateInput.value;
    const feedback = ui.feedbackInput.value.trim();
    if (!studentId) throw new Error("Choose a student first.");
    if (!subject) throw new Error("Enter a subject. The subject field is free text.");
    if (subject.length > 80) throw new Error("Subject must be 80 characters or fewer.");
    if (!assessment) throw new Error("Enter an assessment name.");
    if (assessment.length > 120) throw new Error("Assessment name must be 120 characters or fewer.");
    if (score < 0) throw new Error("Score cannot be negative.");
    if (maxScore <= 0) throw new Error("Maximum score must be greater than zero.");
    if (score > maxScore) throw new Error("Score cannot be greater than the maximum score.");
    if (feedback.length > 500) throw new Error("Feedback must be 500 characters or fewer.");
    return {
      student_id: studentId,
      subject,
      assessment,
      date,
      score: String(score),
      max_score: String(maxScore),
      feedback
    };
  }

  function scoreKey(record) {
    return [record.student_id, record.subject, record.assessment, record.date || ""].join("\u001f");
  }

  function checkDuplicate(candidate, records, skipIndex = null) {
    const candidateKey = scoreKey(candidate);
    const duplicateIndex = records.findIndex((record, index) => index !== skipIndex && scoreKey(record) === candidateKey);
    if (duplicateIndex >= 0) throw new Error("This student already has a score for the same subject, assessment and date.");
  }

  async function commitCsvFile(filename, text, sha, commitMessage) {
    const remote = await getContents(filename);
    if (remote.sha !== sha) {
      await loadData();
      throw new Error(`${filename} changed in GitHub since your last sync. The latest data has been loaded. Review the current records and try saving again.`);
    }
    const result = await putContents(filename, text, sha, commitMessage);
    return result.content && result.content.sha ? result.content.sha : "";
  }

  async function onSaveScore(event) {
    event.preventDefault();
    if (state.busy || !state.connected) return;
    hideError(ui.formError);
    const wasEditing = state.editingIndex !== null;
    const editingIndex = state.editingIndex;
    try {
      const candidate = scoreFromForm();
      checkDuplicate(candidate, state.scores, editingIndex);

      const next = state.scores.map((record) => ({ ...record }));
      if (wasEditing) {
        if (editingIndex < 0 || editingIndex >= next.length) {
          throw new Error("This score is no longer in the current list. Refresh the data and try again.");
        }
        next[editingIndex] = candidate;
      } else {
        next.push(candidate);
      }
      validateScoreRows(next, state.students);

      setBusy(true, wasEditing ? "Saving changes…" : "Saving score…");
      const newSha = await commitCsvFile(
        "scores.csv",
        serialiseCsv(next, SCORE_COLUMNS),
        state.scoresSha,
        wasEditing ? "Update student assessment score" : "Add student assessment score"
      );

      state.scores = next;
      state.scoresSha = newSha;
      resetScoreForm();
      renderAll();
      ui.updatedLabel.textContent = `Saved ${new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date())}`;
      showToast(
        wasEditing ? "Changes saved to GitHub" : "Score saved to GitHub",
        `${wasEditing ? "The updated result" : "The new result"} is committed in scores.csv. The student's page will pick it up on its next refresh.`
      );
    } catch (error) {
      showFormError(error.message || "The score could not be saved to GitHub.");
      showToast("Could not save score", error.message || "GitHub returned an error.", "error");
    } finally {
      setBusy(false);
    }
  }

  function resetScoreForm() {
    state.editingIndex = null;
    ui.scoreForm.reset();
    setStudentSelection("");
    ui.dateInput.value = new Date().toISOString().slice(0, 10);
    ui.maxScoreInput.value = "100";
    ui.formTitle.textContent = "Add an assessment score";
    ui.saveLabel.textContent = "Save score to GitHub";
    ui.cancelEdit.hidden = true;
    hideError(ui.formError);
    updateScorePreview();
  }

  function startEdit(index) {
    const record = state.scores[index];
    if (!record) return;
    state.editingIndex = index;
    setStudentSelection(record.student_id);
    ui.subjectInput.value = record.subject;
    ui.assessmentInput.value = record.assessment;
    ui.scoreInput.value = record.score;
    ui.maxScoreInput.value = record.max_score;
    ui.dateInput.value = record.date;
    ui.feedbackInput.value = record.feedback;
    ui.formTitle.textContent = "Edit assessment score";
    ui.saveLabel.textContent = "Save changes to GitHub";
    ui.cancelEdit.hidden = false;
    hideError(ui.formError);
    updateScorePreview();
    ui.scoreForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function deleteScore(index) {
    const record = state.scores[index];
    if (!record) return;
    const name = studentMap().get(record.student_id) || record.student_id;
    const confirmDelete = `Delete ${record.subject} · ${record.assessment} for ${name}? This will commit a change to scores.csv.`;
    if (!window.confirm(translatedString(confirmDelete))) return;
    if (state.busy) return;
    const next = state.scores.filter((_, itemIndex) => itemIndex !== index);
    try {
      setBusy(true, "Deleting…");
      const newSha = await commitCsvFile("scores.csv", serialiseCsv(next, SCORE_COLUMNS), state.scoresSha, "Delete student assessment score");
      state.scores = next;
      state.scoresSha = newSha;
      if (state.editingIndex === index) resetScoreForm();
      else if (state.editingIndex !== null && state.editingIndex > index) state.editingIndex -= 1;
      renderAll();
      showToast("Score deleted", "The deletion has been committed to GitHub.");
    } catch (error) {
      showToast("Could not delete score", error.message || "GitHub returned an error.", "error");
    } finally {
      setBusy(false);
    }
  }

  let qrLibraryPromise = null;

  function loadQrLibrary() {
    if (window.QRCode && window.QRCode.CorrectLevel) return Promise.resolve(window.QRCode);
    if (qrLibraryPromise) return qrLibraryPromise;
    const sources = [
      "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
    ];
    qrLibraryPromise = new Promise((resolve, reject) => {
      let index = 0;
      const tryNext = () => {
        if (window.QRCode && window.QRCode.CorrectLevel) return resolve(window.QRCode);
        if (index >= sources.length) {
          qrLibraryPromise = null;
          return reject(new Error("The QR generator could not load from either supported CDN. Check your internet connection, then try again."));
        }
        const script = document.createElement("script");
        script.src = sources[index++];
        script.async = true;
        script.onload = () => {
          if (window.QRCode && window.QRCode.CorrectLevel) resolve(window.QRCode);
          else tryNext();
        };
        script.onerror = tryNext;
        document.head.appendChild(script);
      };
      tryNext();
    });
    return qrLibraryPromise;
  }

  async function openQrForSelectedStudent() {
    const student = state.students.find((record) => record.student_id === ui.studentSelect.value);
    if (!student) return showToast("Choose a student", "Select a student before showing their QR code.", "error");
    let url;
    try { url = makeStudentUrl(student.student_id); }
    catch (error) { return showToast("Student site URL is not valid", error.message, "error"); }
    state.activeQrUrl = url;
    ui.qrModalTitle.textContent = `${student.display_name}'s QR code`;
    ui.qrStudentLabel.textContent = `Student ID ${student.student_id} · Scan to open their published results.`;
    ui.qrUrlText.textContent = url;
    ui.qrCanvas.replaceChildren();
    ui.qrModal.hidden = false;
    try {
      const QRCodeLibrary = await loadQrLibrary();
      if (ui.qrModal.hidden || state.activeQrUrl !== url) return;
      new QRCodeLibrary(ui.qrCanvas, {
        text: url,
        width: 280,
        height: 280,
        colorDark: "#17233c",
        colorLight: "#ffffff",
        correctLevel: QRCodeLibrary.CorrectLevel.H
      });
      const renderedCanvas = ui.qrCanvas.querySelector("canvas");
      if (!renderedCanvas) throw new Error("The QR library loaded, but this browser did not produce a QR canvas.");
      renderedCanvas.setAttribute("aria-label", `QR code for ${student.display_name}`);
    } catch (error) {
      ui.qrCanvas.replaceChildren();
      showToast("QR generator unavailable", error.message || "Could not create the QR code.", "error");
    }
  }

  function closeQrModal() { ui.qrModal.hidden = true; }

  async function copyQrLink() {
    if (!state.activeQrUrl) return;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(state.activeQrUrl);
      else {
        const helper = document.createElement("textarea");
        helper.value = state.activeQrUrl;
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.append(helper);
        helper.select();
        document.execCommand("copy");
        helper.remove();
      }
      showToast("Link copied", "The student's results link is on your clipboard.");
    } catch (_) {
      showToast("Could not copy link", "Select and copy the link shown below the QR code.", "error");
    }
  }

  function downloadQr() {
    if (!state.activeQrUrl) return;
    const canvas = ui.qrCanvas.querySelector("canvas");
    if (!canvas) return showToast("QR code is not ready", "Wait for the QR code to finish rendering, then download it.", "error");
    const link = document.createElement("a");
    link.download = `QR-${ui.studentSelect.value}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function saveAppearance() {
    const chosen = document.querySelector('[data-theme-choice][aria-pressed="true"]');
    state.settings.theme = chosen ? chosen.dataset.themeChoice : state.settings.theme;
    applyTheme(state.settings.theme);
    const saved = saveSettingsLocally();
    showToast("Appearance saved", saved ? "Your theme preference has been saved on this browser." : "Could not save local settings.", saved ? "success" : "error");
  }

  function saveLanguage() {
    const chosen = document.querySelector('[data-language-choice][aria-pressed="true"]');
    state.settings.language = chosen ? chosen.dataset.languageChoice : state.settings.language;
    applyLanguage(state.settings.language);
    const saved = saveSettingsLocally();
    showToast("Language saved", saved ? "Language preference is stored locally and does not change the public student score page." : "Could not save local settings.", saved ? "success" : "error");
  }

  function updateQrDestinationPreview() {
    try {
      const base = normaliseBaseUrl(ui.studentSiteUrl.value || state.settings.studentSiteUrl);
      ui.qrDestinationPreview.textContent = `${new URL("student.html", base).toString()}?student=STUDENT_ID`;
      hideError(ui.developerError);
      return base;
    } catch (error) {
      ui.qrDestinationPreview.textContent = "Enter a valid published student site URL.";
      showError(ui.developerError, error.message);
      return "";
    }
  }

  function saveDeveloperSettings() {
    try {
      const base = normaliseBaseUrl(ui.studentSiteUrl.value);
      state.settings.studentSiteUrl = base;
      ui.studentSiteUrl.value = base;
      saveSettingsLocally();
      updateQrDestinationPreview();
      showToast("Developer settings saved", "New QR codes will use the updated student score site.");
    } catch (error) {
      showError(ui.developerError, error.message);
    }
  }

  function openSettings() {
    ui.repoOwner.value = state.settings.owner;
    ui.repoName.value = state.settings.repo;
    ui.repoBranch.value = state.settings.branch;
    ui.studentSiteUrl.value = state.settings.studentSiteUrl || DEFAULT_SETTINGS.studentSiteUrl;
    updateQrDestinationPreview();
    applyTheme(state.settings.theme);
    applyLanguage(state.settings.language);
    setSettingsTab(state.selectedSettingsTab || "connection");
    ui.githubToken.value = "";
    ui.tokenStatus.textContent = state.token ? "A token is saved on this browser. Leave the field blank to keep it, or enter a replacement." : "No token saved on this browser yet.";
    ui.settingsError.hidden = true;
    ui.settingsModal.hidden = false;
    ui.githubToken.focus();
  }

  function closeSettings() { ui.settingsModal.hidden = true; }

  async function saveConnectionSettings() {
    hideError(ui.settingsError);
    const owner = ui.repoOwner.value.trim();
    const repo = ui.repoName.value.trim();
    const branch = ui.repoBranch.value.trim();
    const tokenInput = ui.githubToken.value.trim();
    const token = tokenInput || state.token;
    if (!owner || !repo || !branch) return showError(ui.settingsError, "Repository owner, repository name and branch are all required.");
    if (!token) return showError(ui.settingsError, "Paste a GitHub fine-grained token to connect this admin panel.");
    if (/\s/.test(token)) return showError(ui.settingsError, "The token appears to contain spaces or line breaks. Paste it again without extra whitespace.");

    const previousSettings = state.settings;
    const previousToken = state.token;
    state.settings = { ...state.settings, owner, repo, branch };
    state.token = token;
    setBusy(true, "Connecting…");
    setConnection("loading", "Verifying access");
    try {
      const repository = await getRepository();
      if (repository.full_name && repository.full_name.toLowerCase() !== `${owner}/${repo}`.toLowerCase()) {
        throw new Error(`The token connected to ${repository.full_name}, not ${owner}/${repo}.`);
      }
      await loadData();
      saveSettingsLocally();
      closeSettings();
      if (!state.storageAvailable) {
        showToast("Connected for this session", "This browser would not save local settings. The token will remain in memory until this page is closed.", "error");
      } else {
        showToast("GitHub connected", `Connected to ${owner}/${repo} on ${branch}. Settings are saved on this PC.`);
      }
    } catch (error) {
      state.settings = previousSettings;
      state.token = previousToken;
      setConnection("error", "Connection failed");
      showError(ui.settingsError, error.message || "Could not connect to GitHub.");
    } finally {
      setBusy(false);
      if (!state.connected) ui.connectCard.hidden = false;
    }
  }

  function clearSavedToken() {
    if (!window.confirm(translatedString("Clear the saved GitHub token from this browser? You will need to enter it again to publish scores."))) return;
    state.token = "";
    state.connected = false;
    state.students = [];
    state.scores = [];
    state.studentsSha = "";
    state.scoresSha = "";
    saveSettingsLocally();
    ui.dashboard.hidden = true;
    ui.offlineState.hidden = false;
    ui.connectCard.hidden = false;
    setConnection("offline", "Not connected");
    ui.tokenStatus.textContent = "No token saved on this browser yet.";
    ui.githubToken.value = "";
    showError(ui.settingsError, "Saved token cleared. Enter a new token before reconnecting.");
  }

  function openStudentModal() {
    ui.studentForm.reset();
    hideError(ui.studentError);
    ui.studentModal.hidden = false;
    ui.newStudentId.focus();
  }

  function closeStudentModal() { ui.studentModal.hidden = true; }

  async function onAddStudent(event) {
    event.preventDefault();
    if (state.busy || !state.connected) return;
    hideError(ui.studentError);
    const id = ui.newStudentId.value.trim();
    const displayName = ui.newStudentName.value.trim();
    if (!STUDENT_ID_PATTERN.test(id)) return showError(ui.studentError, "Student ID must be 4–40 letters, numbers, underscores or hyphens.");
    if (!displayName) return showError(ui.studentError, "Enter a display name.");
    if (displayName.length > 80) return showError(ui.studentError, "Display name must be 80 characters or fewer.");
    if (state.students.some((student) => student.student_id.toLowerCase() === id.toLowerCase())) return showError(ui.studentError, "That student ID already exists.");
    const next = [...state.students, { student_id: id, display_name: displayName }];
    try {
      setBusy(true, "Adding student…");
      const newSha = await commitCsvFile("students.csv", serialiseCsv(next, STUDENT_COLUMNS), state.studentsSha, "Add student to score portal roster");
      state.students = next;
      state.studentsSha = newSha;
      renderAll();
      closeStudentModal();
      setStudentSelection(id);
      showToast("Student added", `${displayName} is now in students.csv. You can add a score for them.`);
    } catch (error) {
      showError(ui.studentError, error.message || "Could not add the student.");
      showToast("Could not add student", error.message || "GitHub returned an error.", "error");
    } finally {
      setBusy(false);
    }
  }

  function bindEvents() {
    ui.openSettings.addEventListener("click", openSettings);
    ui.connectNow.addEventListener("click", openSettings);
    ui.offlineConfigure.addEventListener("click", openSettings);
    ui.closeSettings.addEventListener("click", closeSettings);
    ui.settingsModal.addEventListener("click", (event) => { if (event.target === ui.settingsModal) closeSettings(); });
    ui.saveSettings.addEventListener("click", saveConnectionSettings);
    ui.clearToken.addEventListener("click", clearSavedToken);
    ui.scoreForm.addEventListener("submit", onSaveScore);
    ui.scoreInput.addEventListener("input", updateScorePreview);
    ui.maxScoreInput.addEventListener("input", updateScorePreview);
    ui.cancelEdit.addEventListener("click", resetScoreForm);
    ui.recordSearch.addEventListener("input", renderRecords);
    ui.reloadData.addEventListener("click", async () => {
      if (state.busy) return;
      try {
        setBusy(true, "Refreshing…");
        await loadData();
        showToast("Data refreshed", "The latest student roster and scores have been loaded.");
      } catch (error) {
        showToast("Could not refresh", error.message || "GitHub returned an error.", "error");
        setConnection("error", "Sync failed");
      } finally { setBusy(false); }
    });
    ui.recordsBody.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const index = Number(button.dataset.index);
      if (!Number.isInteger(index)) return;
      if (button.dataset.action === "edit") startEdit(index);
      if (button.dataset.action === "delete") deleteScore(index);
    });
    ui.addStudentOpen.addEventListener("click", openStudentModal);
    ui.closeStudentModal.addEventListener("click", closeStudentModal);
    ui.studentModal.addEventListener("click", (event) => { if (event.target === ui.studentModal) closeStudentModal(); });
    ui.studentForm.addEventListener("submit", onAddStudent);
    ui.studentPickerTrigger.addEventListener("click", () => {
      if (ui.studentPickerMenu.hidden) openStudentPicker(); else closeStudentPicker();
    });
    ui.studentPickerSearch.addEventListener("input", renderPickerFilter);
    ui.studentPickerOptions.addEventListener("click", (event) => {
      const option = event.target.closest("button[data-student-id]");
      if (option) setStudentSelection(option.dataset.studentId);
    });
    ui.pickerCreateStudent.addEventListener("click", () => { closeStudentPicker(); openStudentModal(); });
    ui.showStudentQr.addEventListener("click", openQrForSelectedStudent);
    ui.closeQrModal.addEventListener("click", closeQrModal);
    ui.qrModal.addEventListener("click", (event) => { if (event.target === ui.qrModal) closeQrModal(); });
    ui.copyQrLink.addEventListener("click", copyQrLink);
    ui.downloadQr.addEventListener("click", downloadQr);

    ui.settingsTabs.forEach((tab) => tab.addEventListener("click", () => setSettingsTab(tab.dataset.settingsTab)));
    document.querySelectorAll("[data-theme-choice]").forEach((button) => button.addEventListener("click", () => {
      state.settings.theme = button.dataset.themeChoice;
      applyTheme(state.settings.theme);
      saveSettingsLocally();
    }));
    ui.saveAppearance.addEventListener("click", saveAppearance);
    ui.languageChoices.forEach((button) => button.addEventListener("click", () => {
      state.settings.language = button.dataset.languageChoice;
      applyLanguage(state.settings.language);
      saveSettingsLocally();
    }));
    ui.saveLanguage.addEventListener("click", saveLanguage);
    ui.saveDeveloper.addEventListener("click", saveDeveloperSettings);
    ui.studentSiteUrl.addEventListener("input", updateQrDestinationPreview);
    document.addEventListener("click", (event) => {
      if (!ui.studentPicker.contains(event.target)) closeStudentPicker();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (!ui.settingsModal.hidden) closeSettings();
        if (!ui.studentModal.hidden) closeStudentModal();
        if (!ui.qrModal.hidden) closeQrModal();
        closeStudentPicker();
      }
    });
  }

  async function initialise() {
    bindEvents();
    loadSavedSettings();
    ui.repoOwner.value = state.settings.owner;
    ui.repoName.value = state.settings.repo;
    ui.repoBranch.value = state.settings.branch;
    ui.studentSiteUrl.value = state.settings.studentSiteUrl || DEFAULT_SETTINGS.studentSiteUrl;
    applyTheme(state.settings.theme);
    applyLanguage(state.settings.language);
    observeDynamicContent();
    if (window.matchMedia) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
      const onSystemThemeChange = () => { if (state.settings.theme === "system") applyTheme("system"); };
      if (typeof systemTheme.addEventListener === "function") systemTheme.addEventListener("change", onSystemThemeChange);
      else if (typeof systemTheme.addListener === "function") systemTheme.addListener(onSystemThemeChange);
    }
    ui.dateInput.value = new Date().toISOString().slice(0, 10);
    updateScorePreview();
    updateQrDestinationPreview();

    if (!state.storageAvailable) {
      showToast("Browser storage unavailable", "Settings may not persist after closing this page. Keep the admin file in the same folder and browser.", "error");
    }
    if (state.token) {
      try {
        setConnection("loading", "Connecting");
        await getRepository();
        await loadData();
      } catch (error) {
        state.connected = false;
        ui.connectCard.hidden = false;
        ui.offlineState.hidden = false;
        setConnection("error", "Connection failed");
        showToast("Could not reconnect", error.message || "Open Settings to check your token and repository.", "error");
      }
    } else {
      setConnection("offline", "Not connected");
      openSettings();
    }
  }

  initialise();
})();
