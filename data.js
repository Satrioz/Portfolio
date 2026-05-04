/* ════════════════════════════════════════════
   data.js — SATU-SATUNYA FILE YANG PERLU DIEDIT

   Untuk tambah / ubah / hapus project atau field log,
   cukup edit file ini. Tidak perlu sentuh index.html.

   FORMAT PROJECT:
   {
     title:  "NAMA PROJECT",          // teks kapital
     desc:   "Deskripsi singkat.",    // bebas
     tags:   ["TAG1", "TAG2"],        // array string
     lv:     85,                      // angka 1–99
     status: "COMPLETE",             // "COMPLETE" | "IN PROGRESS" | "ARCHIVED"
     github: "https://...",          // URL atau "" kalau tidak ada
     demo:   "https://...",          // URL atau "" kalau tidak ada
   }

   FORMAT FIELD LOG:
   {
     date:  "2023 — PRESENT",        // rentang waktu
     title: "NAMA POSISI / GELAR",
     org:   "// NAMA ORGANISASI",
     desc:  "Deskripsi pengalaman.",
   }
════════════════════════════════════════════ */

const PROJECTS = [
  {
    title: "DATA VISUALIZATION DASHBOARD",
    desc: "Interactive analytics dashboard for large-scale data exploration. Real-time WebSocket feeds for live operational data monitoring. Handles 1M+ data points with smooth 60fps rendering.",
    tags: ["PYTHON", "D3.JS", "WEBSOCKET", "PANDAS", "FLASK"],
    lv: 85,
    status: "COMPLETE",
    github: "https://github.com/satrio/data-viz-dashboard",
    demo: "",
  },
  {
    title: "E-COMMERCE PLATFORM",
    desc: "Full-stack commerce system with real-time inventory management, Stripe payment gateway, and ML-powered product recommendations. Handles 10k+ concurrent users.",
    tags: ["REACT", "NODE.JS", "POSTGRESQL", "STRIPE", "REDIS"],
    lv: 90,
    status: "IN PROGRESS",
    github: "https://github.com/satrio/ecommerce",
    demo: "https://demo.satrio.dev/shop",
  },
  {
    title: "AI CHATBOT SYSTEM",
    desc: "Adaptive chatbot powered by transformer models with context-aware dialogue management. Fine-tuned on domain-specific corpora. 94.2% intent classification accuracy.",
    tags: ["PYTHON", "TRANSFORMERS", "FASTAPI", "PYTORCH", "DOCKER"],
    lv: 78,
    status: "COMPLETE",
    github: "https://github.com/satrio/ai-chatbot",
    demo: "",
  },
  {
    title: "PREDICTIVE ANALYTICS ENGINE",
    desc: "Time-series forecasting system for business intelligence. Ensemble model combining LSTM and XGBoost. Deployed as microservice handling 500+ forecast requests per minute.",
    tags: ["SCIKIT-LEARN", "LSTM", "XGBOOST", "STREAMLIT", "AWS"],
    lv: 72,
    status: "ARCHIVED",
    github: "https://github.com/satrio/predictive-engine",
    demo: "",
  },
  {
    title: "REAL-TIME MONITORING SYSTEM",
    desc: "Infrastructure monitoring with ML anomaly detection and predictive maintenance. Processes 10k+ events per second at sub-100ms latency across distributed nodes.",
    tags: ["KAFKA", "ELASTICSEARCH", "NEXT.JS", "DOCKER", "GRAFANA"],
    lv: 95,
    status: "COMPLETE",
    github: "https://github.com/satrio/monitoring",
    demo: "https://monitor.satrio.dev",
  },
];

const FIELD_LOG = [
  {
    date: "2020 — 2024",
    title: "S1 COMPUTER SCIENCE",
    org: "// UNIVERSITAS AMIKOM YOGYAKARTA",
    desc: "GPA: 3.68 / 4.00.",
  },
];
