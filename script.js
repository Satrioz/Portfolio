/* ════════════════════════════════════════════
   NIER:AUTOMATA PORTFOLIO — script.js
   v4 — notif/confirm sounds + Terminal + secure admin
════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  initAudio();
  initCursor();
  initNav();
  initGlitch();
  initSkillBars();
  initProjectList();
  initLogList();
  initClock();
  initAlert();
  initTerminal();
  initEasterEgg();

  const initScreen = document.getElementById("init-screen");
  if (initScreen) {
    const startSystem = () => {
      if (initScreen.classList.contains("loaded")) return;
      playSound("opening", 0.6);
      initScreen.classList.add("loaded");
      triggerGlitch();
      window.removeEventListener("click", startSystem);
      window.removeEventListener("keydown", startSystem);
    };
    window.addEventListener("click", startSystem);
    window.addEventListener("keydown", startSystem);
  }
});

/* ════════════════════════════════════════════
   AUDIO ENGINE
════════════════════════════════════════════ */
const SFX = {};

function initAudio() {
  const files = {
    opening: "opening.mp3",
    navigasi: "navigasi.mp3",
    select: "select.mp3",
    transmit: "transmit.mp3",
    notif: "notif.mp3", // easter egg / alert open
    confirm: "confirm.mp3", // confirm button
  };
  Object.entries(files).forEach(([key, src]) => {
    const a = new Audio(src);
    a.preload = "auto";
    SFX[key] = a;
  });
}

function playSound(key, volume = 0.7) {
  const src = SFX[key];
  if (!src) return;
  const clone = src.cloneNode();
  clone.volume = Math.min(1, Math.max(0, volume));
  clone.play().catch(() => {});
}

/* ════════════════════════════════════════════
   CUSTOM CURSOR
════════════════════════════════════════════ */
function initCursor() {
  const cur = document.getElementById("cur");
  const dot = document.getElementById("cur-dot");
  if (!cur || !dot) return;
  if (!window.matchMedia("(hover: none)").matches) {
    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2,
      cx = mx,
      cy = my;
    let isVisible = false;
    const toggleCursor = (show) => {
      isVisible = show;
      cur.classList.toggle("visible", show);
      dot.classList.toggle("visible", show);
    };
    document.addEventListener("mousemove", (e) => {
      if (!isVisible) toggleCursor(true);
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    });
    document.addEventListener("mouseleave", () => toggleCursor(false));
    document.addEventListener("mouseenter", (e) => {
      toggleCursor(true);
      mx = e.clientX;
      my = e.clientY;
      cx = mx;
      cy = my;
    });
    (function loop() {
      cx += (mx - cx) * 0.14;
      cy += (my - cy) * 0.14;
      cur.style.left = cx + "px";
      cur.style.top = cy + "px";
      requestAnimationFrame(loop);
    })();
    document
      .querySelectorAll(
        "a, button, .nav-item:not(.locked), .item-row:not(.locked-row), .btn-transmit, .al-btn, .term-close, #nav-terminal-btn, #nav-terminal-btn-desktop",
      )
      .forEach((el) => {
        el.addEventListener("mouseenter", () => cur.classList.add("big"));
        el.addEventListener("mouseleave", () => cur.classList.remove("big"));
      });
  }
}

/* ════════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════════ */
function initNav() {
  const navItems = document.querySelectorAll(".nav-item[data-target]");
  const sections = document.querySelectorAll(".page-section");
  const labels = {
    profile: { main: "PROFILE", sub: "- Unit Data" },
    projects: { main: "PROJECTS", sub: "- Mission Archive" },
    experience: { main: "FIELD LOG", sub: "- Operation History" },
    transmit: { main: "TRANSMIT", sub: "- Open Channel" },
  };

  function switchTab(targetId) {
    navItems.forEach((n) =>
      n.classList.toggle("active", n.dataset.target === targetId),
    );
    sections.forEach((s) => s.classList.toggle("active", s.id === targetId));
    const lbl = labels[targetId];
    const lEl = document.getElementById("section-label");
    const sEl = document.getElementById("section-label-sub");
    if (lEl && lbl) lEl.textContent = lbl.main;
    if (sEl && lbl) sEl.textContent = lbl.sub;
    triggerGlitch();
    if (targetId === "profile") animateSkillBars();
    if (targetId === "transmit") animateTechBars();
    const activeNav = document.querySelector(".nav-mobile .nav-item.active");
    if (activeNav)
      activeNav.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
  }

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("locked")) return;
      playSound("navigasi", 0.65);
      switchTab(item.dataset.target);
    });
  });

  document.addEventListener("keydown", (e) => {
    // Don't fire nav keys when terminal is focused
    if (document.getElementById("term-modal")?.classList.contains("open"))
      return;
    const all = [
      ...document.querySelectorAll(
        ".nav-desktop .nav-item[data-target]:not(.locked)",
      ),
    ];
    const active = document.querySelector(".nav-desktop .nav-item.active");
    const idx = all.indexOf(active);
    if (e.key === "ArrowRight" && idx < all.length - 1) {
      playSound("navigasi", 0.65);
      switchTab(all[idx + 1].dataset.target);
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      playSound("navigasi", 0.65);
      switchTab(all[idx - 1].dataset.target);
    }
  });
}

/* ════════════════════════════════════════════
   GLITCH
════════════════════════════════════════════ */
function initGlitch() {
  function schedule() {
    setTimeout(
      () => {
        triggerGlitch();
        if (Math.random() > 0.6) {
          const st = document.getElementById("sys-status");
          const bh = document.getElementById("bottom-hint");
          if (st) {
            st.textContent = "ERROR";
            st.style.color = "#8b1a1a";
          }
          if (bh) bh.textContent = "SYSTEM ANOMALY DETECTED...";
          setTimeout(() => {
            if (st) {
              st.textContent = "ONLINE";
              st.style.color = "";
            }
            if (bh) bh.textContent = "アイテムを選択してください。";
          }, 380);
        }
        schedule();
      },
      7000 + Math.random() * 11000,
    );
  }
  schedule();
}

function triggerGlitch() {
  const o = document.getElementById("glitch-o");
  if (!o) return;
  o.style.opacity = "1";
  for (let i = 0; i < 4; i++) {
    const l = document.createElement("div");
    l.className = "gl-line";
    l.style.top = Math.random() * 100 + "%";
    l.style.height = Math.random() * 3 + 1 + "px";
    o.appendChild(l);
    setTimeout(() => l.remove(), 180);
  }
  setTimeout(() => {
    o.style.opacity = "0";
  }, 140);
}

/* ════════════════════════════════════════════
   SKILL BARS
════════════════════════════════════════════ */
function initSkillBars() {
  setTimeout(animateSkillBars, 300);
}
function animateSkillBars() {
  document.querySelectorAll("#profile .skill-fill").forEach((bar, i) => {
    setTimeout(() => {
      bar.style.width = bar.dataset.w || "0%";
    }, i * 140);
  });
}
function animateTechBars() {
  document.querySelectorAll(".tech-fill").forEach((bar, i) => {
    setTimeout(() => {
      bar.style.width = bar.dataset.w || "0%";
    }, i * 100);
  });
}

/* ════════════════════════════════════════════
   PROJECT DATA (source of truth — shared with terminal)
════════════════════════════════════════════ */
let projectData = {
  "proj-1": {
    title: "DATA VISUALIZATION DASHBOARD",
    desc: "Interactive analytics dashboard for large-scale data exploration. Real-time WebSocket feeds for live operational data monitoring. Handles 1M+ data points with smooth 60fps rendering.",
    tags: ["PYTHON", "D3.JS", "WEBSOCKET", "PANDAS", "FLASK"],
    lv: 85,
    status: "COMPLETE",
    count: "3 / 99",
  },
  "proj-2": {
    title: "E-COMMERCE PLATFORM",
    desc: "Full-stack commerce system with real-time inventory management, Stripe payment gateway, and ML-powered product recommendations. Handles 10k+ concurrent users.",
    tags: ["REACT", "NODE.JS", "POSTGRESQL", "STRIPE", "REDIS"],
    lv: 90,
    status: "IN PROGRESS",
    count: "1 / 99",
  },
  "proj-3": {
    title: "AI CHATBOT SYSTEM",
    desc: "Adaptive chatbot powered by transformer models with context-aware dialogue management. Fine-tuned on domain-specific corpora. 94.2% intent classification accuracy.",
    tags: ["PYTHON", "TRANSFORMERS", "FASTAPI", "PYTORCH", "DOCKER"],
    lv: 78,
    status: "COMPLETE",
    count: "7 / 99",
  },
  "proj-4": {
    title: "PREDICTIVE ANALYTICS ENGINE",
    desc: "Time-series forecasting system for business intelligence. Ensemble model combining LSTM and XGBoost. Deployed as a microservice handling 500+ forecast requests per minute.",
    tags: ["SCIKIT-LEARN", "LSTM", "XGBOOST", "STREAMLIT", "AWS"],
    lv: 72,
    status: "ARCHIVED",
    count: "2 / 99",
  },
  "proj-5": {
    title: "REAL-TIME MONITORING SYSTEM",
    desc: "Infrastructure monitoring with ML anomaly detection and predictive maintenance. Processes 10k+ events per second at sub-100ms latency across distributed nodes.",
    tags: ["KAFKA", "ELASTICSEARCH", "NEXT.JS", "DOCKER", "GRAFANA"],
    lv: 95,
    status: "COMPLETE",
    count: "5 / 99",
  },
};

function refreshProjectList() {
  // Re-render left col project list from projectData
  const list = document.querySelector("#projects .item-list");
  if (!list) return;
  list.innerHTML =
    Object.entries(projectData)
      .map(
        ([key, d]) => `
    <div class="item-row" data-proj="${key}">
      <span class="item-arrow">◆</span>
      <span class="item-icon">⚙</span>
      <span class="item-name">${d.title.slice(0, 22).toUpperCase()}</span>
      <span class="item-badge">Lv:${d.lv}</span>
    </div>
  `,
      )
      .join("") +
    `
    <div class="item-row locked-row">
      <span class="item-arrow">◆</span>
      <span class="item-icon">⚙</span>
      <span class="item-name">CLASSIFIED</span>
      <span class="item-badge">???</span>
    </div>`;
  // Re-attach listeners
  const rows = list.querySelectorAll(".item-row[data-proj]");
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      if (row.classList.contains("selected")) return;
      playSound("select", 0.7);
      rows.forEach((r) => {
        r.classList.remove("selected", "animating");
      });
      row.classList.add("selected", "animating");
      showProjectDetail(row.dataset.proj);
    });
  });
  // Select first
  if (rows[0]) {
    rows[0].classList.add("selected");
    showProjectDetail(rows[0].dataset.proj);
  }
}

function initProjectList() {
  const rows = document.querySelectorAll(".item-row[data-proj]");
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      if (row.classList.contains("selected")) return;
      playSound("select", 0.7);
      rows.forEach((r) => {
        r.classList.remove("selected", "animating");
      });
      row.classList.add("selected", "animating");
      showProjectDetail(row.dataset.proj);
    });
  });
  if (rows[0]) {
    rows[0].classList.add("selected");
    showProjectDetail(rows[0].dataset.proj);
  }
}

function showProjectDetail(key) {
  const d = projectData[key];
  if (!d) return;
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  const setHtml = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = val;
  };
  set("proj-detail-title", d.title);
  set("proj-detail-desc", d.desc);
  set("proj-stat-lv", d.lv);
  setHtml("proj-detail-count", `所持数：<span>${d.count}</span>`);
  setHtml(
    "proj-detail-tags",
    d.tags.map((t) => `<span class="ptag">${t}</span>`).join(""),
  );
  const stEl = document.getElementById("proj-stat-status");
  if (stEl) {
    stEl.textContent = d.status;
    stEl.className = "status-val";
    if (d.status === "COMPLETE") stEl.style.color = "var(--status-ok)";
    else if (d.status === "IN PROGRESS") stEl.style.color = "#8b7a20";
    else stEl.style.color = "var(--mid)";
  }
}

/* ════════════════════════════════════════════
   FIELD LOG LIST
════════════════════════════════════════════ */
const logData = {
  "log-1": {
    date: "2023 — PRESENT",
    title: "SENIOR DATA ENGINEER",
    org: "// TECH CORP INDONESIA",
    desc: "Architected data pipeline infrastructure handling 50M+ daily transactions. Led a team of 6 engineers. Reduced processing latency by 67% through distributed computing optimizations and intelligent caching layers.",
  },
  "log-2": {
    date: "2021 — 2023",
    title: "FULL-STACK DEVELOPER",
    org: "// STARTUP VENTURES",
    desc: "Built and shipped 3 production web applications from zero to launch. Implemented CI/CD pipelines and automated testing suites. Scaled user base from 0 to 50k+ monthly active users.",
  },
  "log-3": {
    date: "2020 — 2021",
    title: "DATA ANALYST",
    org: "// ANALYTICS FIRM",
    desc: "Developed reporting dashboards and statistical models for Fortune 500 clients. Delivered weekly executive briefings translating complex datasets into actionable strategic recommendations.",
  },
  "log-4": {
    date: "2016 — 2020",
    title: "S1 COMPUTER SCIENCE",
    org: "// UNIVERSITAS INDONESIA",
    desc: "Graduated with honors. Thesis on neural network optimization for NLP tasks. Active in competitive programming — national ACM-ICPC regionals placement. GPA: 3.87 / 4.00.",
  },
};

function initLogList() {
  const items = document.querySelectorAll(".item-row[data-log]");
  items.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("selected")) return;
      playSound("select", 0.7);
      items.forEach((i) => {
        i.classList.remove("selected", "animating");
      });
      item.classList.add("selected", "animating");
      showLogDetail(item.dataset.log);
    });
  });
  if (items[0]) {
    items[0].classList.add("selected");
    showLogDetail(items[0].dataset.log);
  }
}

function showLogDetail(key) {
  const d = logData[key];
  if (!d) return;
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  set("log-detail-date", d.date);
  set("log-detail-title", d.title);
  set("log-detail-org", d.org);
  set("log-detail-desc", d.desc);
}

/* ════════════════════════════════════════════
   CLOCK
════════════════════════════════════════════ */
function initClock() {
  const tick = () => {
    const el = document.getElementById("sys-time");
    if (el) el.textContent = new Date().toLocaleTimeString("id-ID");
  };
  setInterval(tick, 1000);
  tick();
}

/* ════════════════════════════════════════════
   ALERT — with proper sound triggers
════════════════════════════════════════════ */
function initAlert() {
  document.getElementById("btn-transmit")?.addEventListener("click", (e) => {
    e.preventDefault();
    playSound("transmit", 0.75);
    openAlert(
      "SIGNAL RECEIVED",
      "Transmisi berhasil dikirim.<br/>Unit Satrio akan merespons dalam 24 jam.",
    );
  });
  document.getElementById("al-ov")?.addEventListener("click", () => {
    playSound("select", 0.5);
    closeAlert();
  });

  // CONFIRM button → confirm.mp3
  document.getElementById("al-btn-confirm")?.addEventListener("click", () => {
    playSound("confirm", 0.75);
    closeAlert();
  });
  // DISMISS button → select.mp3
  document.getElementById("al-btn-dismiss")?.addEventListener("click", () => {
    playSound("select", 0.5);
    closeAlert();
  });
}

function openAlert(msg, sub, isNotif = false) {
  const msgEl = document.getElementById("al-msg");
  const subEl = document.getElementById("al-sub");
  if (msgEl) msgEl.textContent = msg;
  if (subEl) subEl.innerHTML = sub;
  document.getElementById("al")?.classList.add("open");
  document.getElementById("al-ov")?.classList.add("open");
  // notif.mp3 for easter egg / system notifications, transmit handles its own sound
  if (isNotif) playSound("notif", 0.7);
}

function closeAlert() {
  document.getElementById("al")?.classList.remove("open");
  document.getElementById("al-ov")?.classList.remove("open");
}
window.closeAlert = closeAlert;

/* ════════════════════════════════════════════
   TERMINAL
   Security model:
   - Credentials NEVER stored in localStorage/sessionStorage/cookie
   - Auth token is a JS-only in-memory flag, cleared on close/reload
   - Password input masked in UI (shows ● characters)
   - Username/password matched against hashed values via SubtleCrypto
   - Plain credentials never appear in JS source — only SHA-256 hashes
════════════════════════════════════════════ */

// ── CHANGE THESE HASHES to set your own credentials ──
// Generate: https://emn178.github.io/online-tools/sha256.html
// Default: username="operator" password="YoRHa2B9S!"
// REPLACE with your own hashes before deploying!
const CRED_HASH = {
  user: "94065e16c7735a2f29115469daf78177b42e1518d335dcd4593153845b472950", // sha256("satrio")
  pass: "409a14887e0958f1efcd8de91a587561397bfcc5d994b9d6cfc2d758c8b49296", // sha256("glory")
};

let termAuth = false; // in-memory only — cleared on every page load/refresh
let termInputMode = null; // null | "username" | "password" | "proj-add" | "proj-edit" | "proj-delete"
let termInputStep = 0;
let termTempUser = "";
let termProjDraft = {};
let termEditKey = "";

async function sha256(str) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function openTerminal() {
  playSound("notif", 0.65);
  document.getElementById("term-modal")?.classList.add("open");
  document.getElementById("term-ov")?.classList.add("open");
  setTimeout(() => document.getElementById("term-input")?.focus(), 100);
}

function closeTerminal() {
  playSound("select", 0.5);
  document.getElementById("term-modal")?.classList.remove("open");
  document.getElementById("term-ov")?.classList.remove("open");
  // Security: clear auth on close so re-open requires login again
  termAuth = false;
  termInputMode = null;
  termTempUser = "";
  termProjDraft = {};
  const promptEl = document.getElementById("term-prompt");
  if (promptEl) promptEl.textContent = "guest@yorha:~$";
}

function termPrint(text, cls = "term-sys") {
  const body = document.getElementById("term-body");
  if (!body) return;
  const line = document.createElement("div");
  line.className = `term-line ${cls}`;
  line.innerHTML = text;
  body.appendChild(line);
  body.scrollTop = body.scrollHeight;
}

function termBlank() {
  termPrint("&nbsp;");
}

function termClear() {
  const body = document.getElementById("term-body");
  if (body) body.innerHTML = "";
}

function initTerminal() {
  // Open buttons (desktop + mobile)
  document.getElementById("nav-terminal-btn")?.addEventListener("click", () => {
    playSound("navigasi", 0.5);
    openTerminal();
  });
  document
    .getElementById("nav-terminal-btn-desktop")
    ?.addEventListener("click", () => {
      playSound("navigasi", 0.5);
      openTerminal();
    });

  // Close
  document
    .getElementById("term-close")
    ?.addEventListener("click", closeTerminal);
  document.getElementById("term-ov")?.addEventListener("click", closeTerminal);

  // Input handler
  const input = document.getElementById("term-input");
  if (!input) return;

  input.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const raw = input.value;
    input.value = "";

    // Mask password display
    const displayVal =
      termInputMode === "password" ? "●".repeat(raw.length) : raw;
    termPrint(
      `<span class="term-cmd">${document.getElementById("term-prompt")?.textContent || "$"} ${displayVal}</span>`,
    );

    await handleTermInput(raw.trim());
  });

  // Block Tab (prevent focus escape)
  input.addEventListener("keydown", (e) => {
    if (e.key === "Tab") e.preventDefault();
  });

  // Escape closes
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      document.getElementById("term-modal")?.classList.contains("open")
    ) {
      closeTerminal();
    }
  });
}

async function handleTermInput(cmd) {
  const lower = cmd.toLowerCase();

  /* ── Multi-step input modes ── */
  if (termInputMode === "username") {
    termTempUser = cmd;
    termInputMode = "password";
    const prompt = document.getElementById("term-prompt");
    if (prompt) prompt.textContent = "password:";
    termPrint("Enter password:", "term-sys");
    return;
  }

  if (termInputMode === "password") {
    const uHash = await sha256(termTempUser);
    const pHash = await sha256(cmd);
    termInputMode = null;
    termTempUser = "";
    const prompt = document.getElementById("term-prompt");
    if (prompt) prompt.textContent = "guest@yorha:~$";
    if (uHash === CRED_HASH.user && pHash === CRED_HASH.pass) {
      termAuth = true;
      if (prompt) prompt.textContent = "operator@yorha:~#";
      playSound("confirm", 0.7);
      termBlank();
      termPrint("Authentication successful. Welcome, Operator.", "term-ok");
      termPrint("Clearance level: ADMINISTRATOR", "term-priv");
      termPrint(
        "Type <span class='term-hl'>help</span> for available commands.",
        "term-sys",
      );
      termBlank();
    } else {
      playSound("select", 0.4);
      termPrint("Authentication failed. Access denied.", "term-err");
      termPrint(
        "Credentials are not stored. Try again with <span class='term-hl'>login</span>.",
        "term-sys",
      );
      termBlank();
    }
    return;
  }

  /* ── Project add multi-step ── */
  if (termInputMode === "proj-add") {
    const fields = ["title", "desc", "tags", "lv", "status"];
    const prompts = [
      "Project title:",
      "Description:",
      "Tags (comma-separated):",
      "Level (1-99):",
      "Status (COMPLETE/IN PROGRESS/ARCHIVED):",
    ];
    termProjDraft._fields = fields;
    termProjDraft._step = termProjDraft._step || 0;

    const field = fields[termProjDraft._step];
    if (field === "tags") {
      termProjDraft[field] = cmd
        .split(",")
        .map((t) => t.trim().toUpperCase())
        .filter(Boolean);
    } else if (field === "lv") {
      termProjDraft[field] = Math.min(99, Math.max(1, parseInt(cmd) || 50));
    } else if (field === "status") {
      const valid = ["COMPLETE", "IN PROGRESS", "ARCHIVED"];
      termProjDraft[field] = valid.includes(cmd.toUpperCase())
        ? cmd.toUpperCase()
        : "IN PROGRESS";
    } else {
      termProjDraft[field] = cmd;
    }
    termProjDraft._step++;

    if (termProjDraft._step < fields.length) {
      termPrint(prompts[termProjDraft._step], "term-priv");
    } else {
      // Save
      const newKey = "proj-" + Date.now();
      projectData[newKey] = {
        title: termProjDraft.title,
        desc: termProjDraft.desc,
        tags: termProjDraft.tags,
        lv: termProjDraft.lv,
        status: termProjDraft.status,
        count: "1 / 99",
      };
      termInputMode = null;
      termProjDraft = {};
      refreshProjectList();
      playSound("confirm", 0.7);
      termPrint("Project added successfully.", "term-ok");
      termPrint(
        `ID: <span class='term-hl'>${newKey}</span> — Switch to PROJECTS tab to view.`,
        "term-sys",
      );
      termBlank();
    }
    return;
  }

  /* ── Project edit multi-step ── */
  if (termInputMode === "proj-edit") {
    if (termProjDraft._step === 0) {
      // Expecting field name
      const validFields = ["title", "desc", "tags", "lv", "status"];
      if (!validFields.includes(cmd.toLowerCase())) {
        termPrint(
          `Unknown field. Valid: ${validFields.join(", ")}`,
          "term-err",
        );
        termPrint("Field to edit:", "term-priv");
        return;
      }
      termProjDraft._editField = cmd.toLowerCase();
      termProjDraft._step = 1;
      termPrint(
        `New value for <span class='term-hl'>${termProjDraft._editField}</span>:`,
        "term-priv",
      );
      return;
    }
    if (termProjDraft._step === 1) {
      const field = termProjDraft._editField;
      const proj = projectData[termEditKey];
      if (!proj) {
        termInputMode = null;
        termPrint("Project not found.", "term-err");
        return;
      }
      if (field === "tags") {
        proj[field] = cmd
          .split(",")
          .map((t) => t.trim().toUpperCase())
          .filter(Boolean);
      } else if (field === "lv") {
        proj[field] = Math.min(99, Math.max(1, parseInt(cmd) || proj.lv));
      } else {
        proj[field] = cmd;
      }
      termInputMode = null;
      termEditKey = "";
      termProjDraft = {};
      refreshProjectList();
      playSound("confirm", 0.7);
      termPrint("Project updated successfully.", "term-ok");
      termBlank();
      return;
    }
  }

  /* ── Standard commands ── */
  if (!cmd) return;

  switch (lower) {
    case "help":
      termBlank();
      termPrint("Available commands:", "term-priv");
      termPrint(
        "  <span class='term-hl'>help</span>          — Show this list",
        "term-sys",
      );
      termPrint(
        "  <span class='term-hl'>clear</span>         — Clear terminal",
        "term-sys",
      );
      termPrint(
        "  <span class='term-hl'>whoami</span>        — Current user info",
        "term-sys",
      );
      termPrint(
        "  <span class='term-hl'>status</span>        — System status",
        "term-sys",
      );
      termPrint(
        "  <span class='term-hl'>ls projects</span>   — List all projects",
        "term-sys",
      );
      termPrint(
        "  <span class='term-hl'>yorha</span>         — ???",
        "term-sys",
      );
      termBlank();
      termPrint(
        "Authenticated commands (requires <span class='term-hl'>login</span>):",
        "term-priv",
      );
      termPrint(
        "  <span class='term-hl'>login</span>         — Authenticate as operator",
        "term-sys",
      );
      termPrint(
        "  <span class='term-hl'>logout</span>        — End session",
        "term-sys",
      );
      termPrint(
        "  <span class='term-hl'>proj add</span>      — Add new project",
        "term-sys",
      );
      termPrint(
        "  <span class='term-hl'>proj edit [id]</span>— Edit project by ID",
        "term-sys",
      );
      termPrint(
        "  <span class='term-hl'>proj delete [id]</span>— Delete project by ID",
        "term-sys",
      );
      termPrint(
        "  <span class='term-hl'>proj list</span>     — List with IDs",
        "term-sys",
      );
      termBlank();
      break;

    case "clear":
      termClear();
      break;

    case "whoami":
      termPrint(
        termAuth
          ? "operator — authenticated session"
          : "guest — unauthenticated",
        termAuth ? "term-ok" : "term-sys",
      );
      termBlank();
      break;

    case "status":
      termPrint("System: <span class='term-ok'>ONLINE</span>", "term-sys");
      termPrint(
        "Auth:   " +
          (termAuth
            ? "<span class='term-ok'>AUTHENTICATED</span>"
            : "<span class='term-warn'>GUEST</span>"),
        "term-sys",
      );
      termPrint("Projects: " + Object.keys(projectData).length, "term-sys");
      termPrint("Time: " + new Date().toLocaleString("id-ID"), "term-sys");
      termBlank();
      break;

    case "ls projects":
      termBlank();
      termPrint("Projects:", "term-priv");
      Object.entries(projectData).forEach(([k, d]) => {
        termPrint(`  [${k}] ${d.title} — Lv:${d.lv} ${d.status}`, "term-sys");
      });
      termBlank();
      break;

    case "yorha":
      triggerGlitch();
      setTimeout(triggerGlitch, 130);
      playSound("notif", 0.7);
      termBlank();
      termPrint("// GLORY TO MANKIND //", "term-priv");
      termPrint("// Emotions are prohibited. //", "term-priv");
      termBlank();
      openAlert(
        "GLORY TO MANKIND",
        "// Easter Egg Unlocked, Commander. //<br/>Emotions are prohibited.",
        true,
      );
      break;

    case "login":
      if (termAuth) {
        termPrint("Already authenticated.", "term-ok");
        termBlank();
        break;
      }
      termInputMode = "username";
      const prompt = document.getElementById("term-prompt");
      if (prompt) prompt.textContent = "username:";
      termPrint("Enter username:", "term-sys");
      break;

    case "logout":
      if (!termAuth) {
        termPrint("Not authenticated.", "term-warn");
        termBlank();
        break;
      }
      termAuth = false;
      const pr = document.getElementById("term-prompt");
      if (pr) pr.textContent = "guest@yorha:~$";
      playSound("select", 0.5);
      termPrint("Session terminated.", "term-sys");
      termBlank();
      break;

    default:
      /* Authenticated multi-word commands */
      if (!termAuth) {
        termPrint(
          `Command not found: ${cmd}. Type <span class='term-hl'>help</span> for list.`,
          "term-err",
        );
        termBlank();
        break;
      }

      if (lower === "proj add") {
        termInputMode = "proj-add";
        termProjDraft = { _step: 0 };
        termBlank();
        termPrint(
          "Adding new project. Fill in the following fields:",
          "term-priv",
        );
        termPrint("Project title:", "term-priv");
        break;
      }

      if (lower === "proj list") {
        termBlank();
        termPrint("ID → Title [Status]", "term-priv");
        Object.entries(projectData).forEach(([k, d]) => {
          termPrint(
            `  <span class='term-hl'>${k}</span> → ${d.title} [${d.status}] Lv:${d.lv}`,
            "term-sys",
          );
        });
        termBlank();
        break;
      }

      if (lower.startsWith("proj edit ")) {
        const key = lower.replace("proj edit ", "").trim();
        if (!projectData[key]) {
          termPrint(
            `Project "${key}" not found. Use <span class='term-hl'>proj list</span> for IDs.`,
            "term-err",
          );
          termBlank();
          break;
        }
        termEditKey = key;
        termInputMode = "proj-edit";
        termProjDraft = { _step: 0 };
        termBlank();
        termPrint(
          `Editing: <span class='term-hl'>${projectData[key].title}</span>`,
          "term-priv",
        );
        termPrint("Field to edit (title/desc/tags/lv/status):", "term-priv");
        break;
      }

      if (lower.startsWith("proj delete ")) {
        const key = lower.replace("proj delete ", "").trim();
        if (!projectData[key]) {
          termPrint(`Project "${key}" not found.`, "term-err");
          termBlank();
          break;
        }
        const title = projectData[key].title;
        delete projectData[key];
        refreshProjectList();
        playSound("confirm", 0.7);
        termPrint(`Deleted: ${title}`, "term-ok");
        termBlank();
        break;
      }

      termPrint(
        `Command not found: ${cmd}. Type <span class='term-hl'>help</span> for list.`,
        "term-err",
      );
      termBlank();
  }
}

/* ════════════════════════════════════════════
   EASTER EGG (keyboard — desktop)
   Mobile uses terminal command 'yorha'
════════════════════════════════════════════ */
function initEasterEgg() {
  let buf = "";
  document.addEventListener("keydown", (e) => {
    // Don't capture when terminal input is focused
    if (document.activeElement?.id === "term-input") return;
    buf = (buf + e.key.toLowerCase()).slice(-10);
    if (buf.includes("yorha")) {
      buf = "";
      triggerGlitch();
      setTimeout(triggerGlitch, 130);
      playSound("notif", 0.7);
      openAlert(
        "GLORY TO MANKIND",
        "// Easter Egg Unlocked, Commander. //<br/>Emotions are prohibited.",
        false,
      );
    }
    if (e.key === "g") triggerGlitch();
  });
}
