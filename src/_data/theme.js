const themes = {
  christmas: {
    name: "christmas",
    displayName: "크리스마스",
    accent: "#e11d48",
    accentLight: "#f472b6",
    text: "#0f172a",
    background: "linear-gradient(135deg,#0f172a 0%,#1e293b 40%,#0ea5e9 100%)",
    deco: "radial-gradient(circle at 20% 20%, rgba(255,255,255,.25) 0 12%, transparent 12%), radial-gradient(circle at 80% 30%, rgba(255,255,255,.18) 0 10%, transparent 10%)"
  },
  spring: {
    name: "spring",
    displayName: "봄",
    accent: "#16a34a",
    accentLight: "#4ade80",
    text: "#0f172a",
    background: "linear-gradient(135deg,#ecfccb 0%,#d9f99d 45%,#86efac 100%)",
    deco: "radial-gradient(circle at 25% 35%, rgba(22,163,74,.18) 0 18%, transparent 18%), radial-gradient(circle at 75% 25%, rgba(34,197,94,.12) 0 14%, transparent 14%)"
  },
  summer: {
    name: "summer",
    displayName: "여름",
    accent: "#0284c7",
    accentLight: "#38bdf8",
    text: "#0f172a",
    background: "linear-gradient(135deg,#cffafe 0%,#7dd3fc 35%,#38bdf8 100%)",
    deco: "radial-gradient(circle at 30% 40%, rgba(2,132,199,.16) 0 18%, transparent 18%), radial-gradient(circle at 80% 30%, rgba(14,165,233,.12) 0 14%, transparent 14%)"
  },
  autumn: {
    name: "autumn",
    displayName: "가을",
    accent: "#c2410c",
    accentLight: "#fb923c",
    text: "#1f2937",
    background: "linear-gradient(135deg,#fff7ed 0%,#fed7aa 45%,#fb923c 100%)",
    deco: "radial-gradient(circle at 30% 30%, rgba(194,65,12,.16) 0 18%, transparent 18%), radial-gradient(circle at 75% 40%, rgba(249,115,22,.12) 0 14%, transparent 14%)"
  }
};

module.exports = function() {
  const envThemeRaw = process.env.THEME_NAME;
  const envTheme = envThemeRaw ? envThemeRaw.toLowerCase() : "";

  // env가 없거나 none이면 테마 비활성
  if (!envTheme || envTheme === "none") {
    return { current: null, list: Object.values(themes) };
  }

  const theme = themes[envTheme] || themes.spring;
  return { current: theme, list: Object.values(themes) };
};

