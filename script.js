/* ════════════════════════════════════════════
   NIER:AUTOMATA PORTFOLIO — script.js
   Data bersumber dari data.js (PROJECTS & FIELD_LOG).
   Terminal hanya showcase — tidak ada CRUD.
════════════════════════════════════════════ */

/* ════════════════════════════════════════════
   AUDIO
════════════════════════════════════════════ */
const SFX = {};

function initAudio() {
  ["opening", "navigasi", "select", "transmit", "notif", "confirm"].forEach(
    (key) => {
      const a = new Audio(`${key}.mp3`);
      a.preload = "auto";
      SFX[key] = a;
    },
  );
}

function playSound(key, vol = 0.7) {
  const src = SFX[key];
  if (!src) return;
  const clone = src.cloneNode();
  clone.volume = Math.min(1, Math.max(0, vol));
  clone.play().catch(() => {});
}

/* ════════════════════════════════════════════
   CURSOR
════════════════════════════════════════════ */
function initCursor() {
  const cur = document.getElementById("cur");
  const dot = document.getElementById("cur-dot");
  if (!cur || !dot || window.matchMedia("(hover: none)").matches) return;

  let mx = innerWidth / 2,
    my = innerHeight / 2;
  let cx = mx,
    cy = my,
    visible = false;

  const setVisible = (v) => {
    visible = v;
    cur.classList.toggle("visible", v);
    dot.classList.toggle("visible", v);
  };

  document.addEventListener("mousemove", (e) => {
    if (!visible) setVisible(true);
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = `${mx}px`;
    dot.style.top = `${my}px`;
  });
  document.addEventListener("mouseleave", () => setVisible(false));
  document.addEventListener("mouseenter", (e) => {
    setVisible(true);
    mx = e.clientX;
    my = e.clientY;
    cx = mx;
    cy = my;
  });

  (function loop() {
    cx += (mx - cx) * 0.14;
    cy += (my - cy) * 0.14;
    cur.style.left = `${cx}px`;
    cur.style.top = `${cy}px`;
    requestAnimationFrame(loop);
  })();

  document
    .querySelectorAll(
      "a, button, .nav-item:not(.locked), .item-row:not(.locked-row), .btn-transmit, .al-btn, .term-close, .nav-terminal-btn, .proj-link-btn",
    )
    .forEach((el) => {
      el.addEventListener("mouseenter", () => cur.classList.add("big"));
      el.addEventListener("mouseleave", () => cur.classList.remove("big"));
    });
}

/* ════════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════════ */
const NAV_LABELS = {
  profile: { main: "PROFILE", sub: "- Unit Data" },
  projects: { main: "PROJECTS", sub: "- Mission Archive" },
  experience: { main: "FIELD LOG", sub: "- Operation History" },
  transmit: { main: "TRANSMIT", sub: "- Open Channel" },
};

let currentTab = "profile";

function switchTab(id) {
  if (!NAV_LABELS[id]) return;
  currentTab = id;

  document
    .querySelectorAll(".nav-item[data-target]")
    .forEach((n) => n.classList.toggle("active", n.dataset.target === id));
  document
    .querySelectorAll(".page-section")
    .forEach((s) => s.classList.toggle("active", s.id === id));

  const label = NAV_LABELS[id];
  const lEl = document.getElementById("section-label");
  const sEl = document.getElementById("section-label-sub");
  if (lEl) lEl.textContent = label.main;
  if (sEl) sEl.textContent = label.sub;

  triggerGlitch();
  if (id === "profile") animateSkillBars();
  if (id === "transmit") animateTechBars();

  document
    .querySelector(".nav-mobile .nav-item.active")
    ?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
}

function initNav() {
  document.querySelectorAll(".nav-item[data-target]").forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("locked")) return;
      playSound("navigasi", 0.65);
      switchTab(item.dataset.target);
    });
  });
}

/* ════════════════════════════════════════════
   GLITCH
════════════════════════════════════════════ */
function triggerGlitch() {
  const overlay = document.getElementById("glitch-o");
  if (!overlay) return;

  overlay.style.opacity = "1";
  for (let i = 0; i < 4; i++) {
    const line = document.createElement("div");
    line.className = "gl-line";
    line.style.top = `${Math.random() * 100}%`;
    line.style.height = `${Math.random() * 3 + 1}px`;
    overlay.appendChild(line);
    setTimeout(() => line.remove(), 180);
  }
  setTimeout(() => {
    overlay.style.opacity = "0";
  }, 140);
}

function initGlitch() {
  (function schedule() {
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
  })();
}

/* ════════════════════════════════════════════
   SKILL / TECH BARS
════════════════════════════════════════════ */
function initSkillBars() {
  setTimeout(animateSkillBars, 300);
}

function animateSkillBars() {
  document.querySelectorAll("#profile .skill-fill").forEach((bar, i) =>
    setTimeout(() => {
      bar.style.width = bar.dataset.w || "0%";
    }, i * 140),
  );
}

function animateTechBars() {
  document.querySelectorAll(".tech-fill").forEach((bar, i) =>
    setTimeout(() => {
      bar.style.width = bar.dataset.w || "0%";
    }, i * 100),
  );
}

/* ════════════════════════════════════════════
   PROJECTS — rendered from PROJECTS in data.js
════════════════════════════════════════════ */
function renderProjectLinks(proj) {
  const container = document.getElementById("proj-detail-links");
  if (!container) return;

  const links = [];
  if (proj.github)
    links.push(
      `<a class="proj-link-btn" href="${proj.github}" target="_blank" rel="noopener"><span>&lt;/&gt; GITHUB</span></a>`,
    );
  if (proj.demo)
    links.push(
      `<a class="proj-link-btn" href="${proj.demo}"   target="_blank" rel="noopener"><span>&#9654; LIVE DEMO</span></a>`,
    );
  container.innerHTML = links.join("");
}

function showProjectDetail(index) {
  const proj = PROJECTS[index];
  if (!proj) return;

  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  };
  const setHtml = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = v;
  };

  set("proj-detail-title", proj.title);
  set("proj-detail-desc", proj.desc);
  set("proj-stat-lv", proj.lv);
  setHtml(
    "proj-detail-tags",
    proj.tags.map((t) => `<span class="ptag">${t}</span>`).join(""),
  );
  renderProjectLinks(proj);

  const statusEl = document.getElementById("proj-stat-status");
  if (statusEl) {
    statusEl.textContent = proj.status;
    statusEl.style.color =
      proj.status === "COMPLETE"
        ? "var(--status-ok)"
        : proj.status === "IN PROGRESS"
          ? "#8b7a20"
          : "var(--mid)";
  }
}

function buildProjectList() {
  const list = document.querySelector("#projects .item-list");
  if (!list) return;

  list.innerHTML =
    PROJECTS.map((proj, i) => {
      const name =
        proj.title.length > 22 ? proj.title.slice(0, 22) + "…" : proj.title;
      return `<div class="item-row" data-index="${i}" tabindex="-1">
      <span class="item-arrow">&#9670;</span>
      <span class="item-icon">&#9881;</span>
      <span class="item-name">${name}</span>
      <span class="item-badge">Lv:${proj.lv}</span>
    </div>`;
    }).join("") +
    `<div class="item-row locked-row">
    <span class="item-arrow">&#9670;</span>
    <span class="item-icon">&#9881;</span>
    <span class="item-name">CLASSIFIED</span>
    <span class="item-badge">???</span>
  </div>`;

  const badge = document.querySelector("#projects .panel-header .ph-sub");
  if (badge) badge.textContent = `${PROJECTS.length} / ${PROJECTS.length + 1}`;

  list.querySelectorAll(".item-row[data-index]").forEach((row) => {
    row.addEventListener("click", () => selectProjectRow(row));
  });

  const first = list.querySelector(".item-row[data-index]");
  if (first) {
    first.classList.add("selected");
    showProjectDetail(0);
  }
}

function selectProjectRow(row) {
  playSound("select", 0.7);
  document
    .querySelectorAll(".item-row[data-index]")
    .forEach((r) => r.classList.remove("selected", "animating"));
  row.classList.add("selected", "animating");
  showProjectDetail(Number(row.dataset.index));
}

/* ════════════════════════════════════════════
   FIELD LOG — rendered from FIELD_LOG in data.js
════════════════════════════════════════════ */
function showLogDetail(index) {
  const log = FIELD_LOG[index];
  if (!log) return;

  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  };
  set("log-detail-date", log.date);
  set("log-detail-title", log.title);
  set("log-detail-org", log.org);
  set("log-detail-desc", log.desc);
}

function buildLogList() {
  const list = document.querySelector("#experience .item-list");
  if (!list) return;

  list.innerHTML = FIELD_LOG.map(
    (log, i) => `
    <div class="item-row log-row" data-log-index="${i}" tabindex="-1">
      <span class="item-arrow">&#9670;</span>
      <div>
        <div class="log-date-sm">${log.date}</div>
        <div class="item-name">${log.title}</div>
      </div>
    </div>`,
  ).join("");

  list.querySelectorAll(".item-row[data-log-index]").forEach((row) => {
    row.addEventListener("click", () => selectLogRow(row));
  });

  const first = list.querySelector(".item-row[data-log-index]");
  if (first) {
    first.classList.add("selected");
    showLogDetail(0);
  }
}

function selectLogRow(row) {
  playSound("select", 0.7);
  document
    .querySelectorAll(".item-row[data-log-index]")
    .forEach((r) => r.classList.remove("selected", "animating"));
  row.classList.add("selected", "animating");
  showLogDetail(Number(row.dataset.logIndex));
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
   ALERT
════════════════════════════════════════════ */
function openAlert(msg, sub, isNotif = false) {
  const msgEl = document.getElementById("al-msg");
  const subEl = document.getElementById("al-sub");
  if (msgEl) msgEl.textContent = msg;
  if (subEl) subEl.innerHTML = sub;
  document.getElementById("al")?.classList.add("open");
  document.getElementById("al-ov")?.classList.add("open");
  if (isNotif) playSound("notif", 0.7);
}

function closeAlert() {
  document.getElementById("al")?.classList.remove("open");
  document.getElementById("al-ov")?.classList.remove("open");
}
window.closeAlert = closeAlert;

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
  document.getElementById("al-btn-confirm")?.addEventListener("click", () => {
    playSound("confirm", 0.75);
    closeAlert();
  });
  document.getElementById("al-btn-dismiss")?.addEventListener("click", () => {
    playSound("select", 0.5);
    closeAlert();
  });
}

/* ════════════════════════════════════════════
   KEYBOARD NAVIGATION
   Tab  → toggle zone: nav ↔ list
   ← →  → switch tabs (zone: nav)
   ↑ ↓  → move items (zone: list)
════════════════════════════════════════════ */
let kbZone = "nav";
let kbListIndex = 0;

const ZONE_HINTS = {
  nav: "← → switch tab  ·  TAB focus list",
  list: "↑ ↓ select item  ·  TAB back to nav",
};

function setKbZone(zone) {
  kbZone = zone;

  const hint = document.getElementById("bottom-hint");
  if (hint)
    hint.textContent = ZONE_HINTS[zone] || "アイテムを選択してください。";

  const badge = document.getElementById("kb-zone-label");
  if (badge) badge.textContent = zone === "nav" ? "" : zone.toUpperCase();

  document
    .querySelectorAll(".nav-item[data-target]")
    .forEach((n) =>
      n.classList.toggle(
        "kb-nav-active",
        zone === "nav" && n.classList.contains("active"),
      ),
    );

  document
    .querySelectorAll(".col-left")
    .forEach((c) => c.classList.toggle("kb-list-active", zone === "list"));
}

function getActiveRows() {
  if (currentTab === "projects")
    return [...document.querySelectorAll("#projects .item-row[data-index]")];
  if (currentTab === "experience")
    return [
      ...document.querySelectorAll("#experience .item-row[data-log-index]"),
    ];
  return [];
}

function kbSelectRow(idx) {
  const rows = getActiveRows();
  if (!rows.length) return;
  kbListIndex = Math.max(0, Math.min(rows.length - 1, idx));
  const row = rows[kbListIndex];
  if (!row) return;
  if (currentTab === "projects") selectProjectRow(row);
  if (currentTab === "experience") selectLogRow(row);
  row.scrollIntoView({ block: "nearest" });
}

function initKeyboardNav() {
  setKbZone("nav");

  document.addEventListener("keydown", (e) => {
    if (document.getElementById("term-modal")?.classList.contains("open"))
      return;
    if (document.activeElement?.id === "term-input") return;
    if (document.getElementById("al")?.classList.contains("open")) return;

    const { key } = e;

    if (key === "Tab") {
      e.preventDefault();
      const hasRows = getActiveRows().length > 0;
      if (kbZone === "nav" && hasRows) {
        setKbZone("list");
        const rows = getActiveRows();
        const si = rows.findIndex((r) => r.classList.contains("selected"));
        kbListIndex = si >= 0 ? si : 0;
      } else {
        setKbZone("nav");
        document.querySelector(".nav-desktop .nav-item.active")?.focus();
      }
      return;
    }

    if (kbZone === "nav") {
      const navItems = [
        ...document.querySelectorAll(
          ".nav-desktop .nav-item[data-target]:not(.locked)",
        ),
      ];
      const idx = navItems.indexOf(
        document.querySelector(".nav-desktop .nav-item.active"),
      );
      if (key === "ArrowRight" && idx < navItems.length - 1) {
        playSound("navigasi", 0.65);
        switchTab(navItems[idx + 1].dataset.target);
      }
      if (key === "ArrowLeft" && idx > 0) {
        playSound("navigasi", 0.65);
        switchTab(navItems[idx - 1].dataset.target);
      }
    }

    if (kbZone === "list") {
      if (key === "ArrowDown") {
        e.preventDefault();
        kbSelectRow(kbListIndex + 1);
      }
      if (key === "ArrowUp") {
        e.preventDefault();
        kbSelectRow(kbListIndex - 1);
      }
    }
  });
}

/* ════════════════════════════════════════════
   TERMINAL — showcase only
   cls   = close terminal window
   clear = clear terminal output
════════════════════════════════════════════ */
const CRED_HASH = {
  user: "94065e16c7735a2f29115469daf78177b42e1518d335dcd4593153845b472950", // sha256("satrio")
  pass: "409a14887e0958f1efcd8de91a587561397bfcc5d994b9d6cfc2d758c8b49296", // sha256("glory")
};

let termAuth = false;
let termMode = null; // null | "username" | "password"
let termTempUser = "";
let termHistory = [];
let termHistoryIdx = -1;

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
  // Security: always clear auth on close
  termAuth = false;
  termMode = null;
  termTempUser = "";
  termHistoryIdx = -1;
  const pr = document.getElementById("term-prompt");
  if (pr) pr.textContent = "guest@yorha:~$";
}

function termPrint(html, cls = "term-sys") {
  const body = document.getElementById("term-body");
  if (!body) return;
  const line = document.createElement("div");
  line.className = `term-line ${cls}`;
  line.innerHTML = html;
  body.appendChild(line);
  body.scrollTop = body.scrollHeight;
}
const termBlank = () => termPrint("&nbsp;");
const termClearBody = () => {
  const b = document.getElementById("term-body");
  if (b) b.innerHTML = "";
};

function initTerminal() {
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
  document
    .getElementById("term-close")
    ?.addEventListener("click", closeTerminal);
  document.getElementById("term-ov")?.addEventListener("click", closeTerminal);

  const input = document.getElementById("term-input");
  if (!input) return;

  input.addEventListener("keydown", async (e) => {
    // Arrow up/down: history recall
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (termMode || !termHistory.length) return;
      termHistoryIdx = Math.min(termHistoryIdx + 1, termHistory.length - 1);
      input.value = termHistory[termHistory.length - 1 - termHistoryIdx];
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = input.value.length;
      }, 0);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (termMode) return;
      if (termHistoryIdx <= 0) {
        termHistoryIdx = -1;
        input.value = "";
        return;
      }
      termHistoryIdx--;
      input.value = termHistory[termHistory.length - 1 - termHistoryIdx];
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      return;
    }
    if (e.key !== "Enter") return;

    e.preventDefault();
    const raw = input.value;
    input.value = "";
    termHistoryIdx = -1;

    // Save to history (never save password)
    if (raw.trim() && termMode !== "password" && termMode !== "username") {
      if (termHistory[termHistory.length - 1] !== raw.trim()) {
        termHistory.push(raw.trim());
        if (termHistory.length > 50) termHistory.shift();
      }
    }

    // Echo line (mask password chars)
    const display = termMode === "password" ? "●".repeat(raw.length) : raw;
    const prompt = document.getElementById("term-prompt")?.textContent || "$";
    termPrint(`<span class="term-cmd">${prompt} ${display}</span>`);

    await handleTermInput(raw.trim());
  });

  // ESC closes terminal
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

  /* ── Auth flow ── */
  if (termMode === "username") {
    termTempUser = cmd;
    termMode = "password";
    document.getElementById("term-prompt").textContent = "password:";
    termPrint("Enter password:", "term-sys");
    return;
  }

  if (termMode === "password") {
    const [uHash, pHash] = await Promise.all([
      sha256(termTempUser),
      sha256(cmd),
    ]);
    const pr = document.getElementById("term-prompt");
    termMode = null;
    termTempUser = "";

    if (uHash === CRED_HASH.user && pHash === CRED_HASH.pass) {
      termAuth = true;
      if (pr) pr.textContent = "operator@yorha:~#";
      playSound("confirm", 0.7);
      termBlank();
      termPrint("Authentication successful. Welcome, Operator.", "term-ok");
      termPrint(
        "Clearance: <span class='term-hl'>ADMINISTRATOR</span>",
        "term-sys",
      );
      termPrint(
        "Type <span class='term-hl'>help</span> for commands.",
        "term-sys",
      );
      termBlank();
    } else {
      if (pr) pr.textContent = "guest@yorha:~$";
      playSound("select", 0.4);
      termPrint("Authentication failed. Access denied.", "term-err");
      termPrint("Try <span class='term-hl'>login</span> again.", "term-sys");
      termBlank();
    }
    return;
  }

  if (!cmd) return;

  /* ── Commands ── */
  if (lower === "help") {
    termBlank();
    termPrint("─── COMMANDS ───────────────────────────────", "term-priv");
    termPrint(
      "  <span class='term-hl'>help</span>            Show this list",
      "term-sys",
    );
    termPrint(
      "  <span class='term-hl'>clear</span>           Clear terminal output",
      "term-sys",
    );
    termPrint(
      "  <span class='term-hl'>cls</span>             Close terminal window",
      "term-sys",
    );
    termPrint(
      "  <span class='term-hl'>whoami</span>          Current user",
      "term-sys",
    );
    termPrint(
      "  <span class='term-hl'>status</span>          System status",
      "term-sys",
    );
    termPrint(
      "  <span class='term-hl'>ls projects</span>     List all projects",
      "term-sys",
    );
    termPrint(
      "  <span class='term-hl'>ls logs</span>         List field log entries",
      "term-sys",
    );
    termPrint("  <span class='term-hl'>yorha</span>           ???", "term-sys");
    termPrint(
      "  <span class='term-hl'>login</span>           Authenticate",
      "term-sys",
    );
    termPrint(
      "  <span class='term-hl'>logout</span>          End session",
      "term-sys",
    );
    termBlank();
    termPrint("─── TIPS ───────────────────────────────────", "term-priv");
    termPrint("  ↑ ↓  Recall command history", "term-sys");
    termPrint("  ESC  Close terminal", "term-sys");
    termBlank();
  } else if (lower === "clear") {
    termClearBody();
  } else if (lower === "cls") {
    // cls = close terminal (like closing a terminal window, not clearing output)
    closeTerminal();
  } else if (lower === "whoami") {
    termPrint(
      termAuth ? "operator — authenticated" : "guest — unauthenticated",
      termAuth ? "term-ok" : "term-sys",
    );
    termBlank();
  } else if (lower === "status") {
    termPrint(`System:   <span class='term-ok'>ONLINE</span>`, "term-sys");
    termPrint(
      `Auth:     ${termAuth ? "<span class='term-ok'>AUTHENTICATED</span>" : "<span class='term-warn'>GUEST</span>"}`,
      "term-sys",
    );
    termPrint(`Projects: ${PROJECTS.length}`, "term-sys");
    termPrint(`Logs:     ${FIELD_LOG.length}`, "term-sys");
    termPrint(`Time:     ${new Date().toLocaleString("id-ID")}`, "term-sys");
    termBlank();
  } else if (lower === "ls projects") {
    termBlank();
    termPrint("Projects:", "term-priv");
    PROJECTS.forEach((p, i) =>
      termPrint(`  [${i}] ${p.title} — Lv:${p.lv} [${p.status}]`, "term-sys"),
    );
    termBlank();
  } else if (lower === "ls logs") {
    termBlank();
    termPrint("Field Log:", "term-priv");
    FIELD_LOG.forEach((l, i) =>
      termPrint(`  [${i}] ${l.title} — ${l.date}`, "term-sys"),
    );
    termBlank();
  } else if (lower === "yorha") {
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
  } else if (lower === "login") {
    if (termAuth) {
      termPrint("Already authenticated.", "term-ok");
      termBlank();
      return;
    }
    termMode = "username";
    document.getElementById("term-prompt").textContent = "username:";
    termPrint("Enter username:", "term-sys");
  } else if (lower === "logout") {
    if (!termAuth) {
      termPrint("Not authenticated.", "term-warn");
      termBlank();
      return;
    }
    termAuth = false;
    document.getElementById("term-prompt").textContent = "guest@yorha:~$";
    playSound("select", 0.5);
    termPrint("Session terminated.", "term-sys");
    termBlank();
  } else {
    termPrint(
      `Command not found: ${cmd}. Type <span class='term-hl'>help</span>.`,
      "term-err",
    );
    termBlank();
  }
}

/* ════════════════════════════════════════════
   INIT SCREEN
════════════════════════════════════════════ */
function initInitScreen() {
  const screen = document.getElementById("init-screen");
  const appWrap = document.getElementById("app-wrap");
  if (!screen) return;

  let dismissed = false;

  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    try {
      playSound("opening", 0.6);
    } catch (e) {}
    screen.style.transition = "opacity 0.5s ease";
    screen.style.opacity = "0";
    if (appWrap) appWrap.style.visibility = "visible";
    setTimeout(() => {
      screen.style.display = "none";
    }, 550);
  }

  document.getElementById("btn-init")?.addEventListener("click", dismiss);
  screen.addEventListener("click", dismiss);
  window.addEventListener("keydown", dismiss, { once: true });
}

/* ════════════════════════════════════════════
   EASTER EGG — type "yorha" anywhere
════════════════════════════════════════════ */
function initEasterEgg() {
  let buf = "";
  document.addEventListener("keydown", (e) => {
    if (document.activeElement?.id === "term-input") return;
    if (document.getElementById("term-modal")?.classList.contains("open"))
      return;

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

/* ════════════════════════════════════════════
   BOOT
════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  initAudio();
  initCursor();
  initNav();
  initGlitch();
  initSkillBars();
  buildProjectList(); // renders from PROJECTS in data.js
  buildLogList(); // renders from FIELD_LOG in data.js
  initClock();
  initAlert();
  initTerminal();
  initKeyboardNav();
  initEasterEgg();
  initInitScreen();
});
