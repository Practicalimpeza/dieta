const STORAGE_KEY = "plano-45-dias:v1";
const AUTH_STORAGE_KEY = "plano-45-dias:supabase-session";
const SUPABASE_URL = "https://pjmaoqysyspbmdefygxd.supabase.co";
const SUPABASE_KEY = "sb_publishable_nio0RbbeRBusnXhTf-P5hA_Fpv8gA_1";
const CLOUD_TABLE = "diet_states";
const TOTAL_DAYS = 45;
const DAY_MS = 24 * 60 * 60 * 1000;
const REFEED_DAYS = [12, 24, 36];

const phases = [
  {
    id: 1,
    start: 1,
    end: 15,
    title: "Fase 1",
    goal: "Reduzir retenção, iniciar perda de gordura e manter performance alta.",
    macros: {
      proteina: "200 g",
      carbo: "260 g",
      gordura: "55 g",
      kcal: "~2.500",
      cardio: "30 min",
      agua: "4-5 L",
    },
    meals: [
      ["Refeição 1", "200 g carne moída + 250 g batata"],
      ["Refeição 2", "200 g carne moída + 250 g batata"],
      ["Pré-treino", "150 g carne moída + 350 g batata"],
      ["Pós-treino", "200 g carne moída + 350 g batata + whey"],
      ["Última", "200 g carne moída + 100 g batata"],
    ],
    totals: {
      carne: "950 g",
      batata: "1.300 g",
      whey: "1 dose",
      cardio: "30 min",
      sono: "7,5-9 h",
      agua: "4-5 L",
    },
  },
  {
    id: 2,
    start: 16,
    end: 30,
    title: "Fase 2",
    goal: "Acelerar definição mantendo densidade muscular e treino forte.",
    macros: {
      proteina: "200 g",
      carbo: "~220 g",
      gordura: "50 g",
      kcal: "~2.300",
      cardio: "35-40 min",
      agua: "4-5 L",
    },
    meals: [
      ["Refeição 1", "200 g carne moída + 200 g batata"],
      ["Refeição 2", "200 g carne moída + 200 g batata"],
      ["Pré-treino", "150 g carne moída + 350 g batata"],
      ["Pós-treino", "200 g carne moída + 350 g batata + whey"],
      ["Última", "200 g carne moída + 100 g batata"],
    ],
    totals: {
      carne: "950 g",
      batata: "1.200 g",
      whey: "1 dose",
      cardio: "35-40 min",
      sono: "7,5-9 h",
      agua: "4-5 L",
    },
  },
  {
    id: 3,
    start: 31,
    end: 45,
    title: "Fase 3",
    goal: "Secar o máximo possível preservando fullness no pré e pós-treino.",
    macros: {
      proteina: "200 g",
      carbo: "~200 g",
      gordura: "45-50 g",
      kcal: "~2.150",
      cardio: "40 min",
      agua: "4-5 L",
    },
    meals: [
      ["Refeição 1", "200 g carne moída + 150 g batata"],
      ["Refeição 2", "200 g carne moída + 150 g batata"],
      ["Pré-treino", "150 g carne moída + 350 g batata"],
      ["Pós-treino", "200 g carne moída + 350 g batata + whey"],
      ["Última", "200 g carne moída sem batata ou 50 g batata"],
    ],
    totals: {
      carne: "950 g",
      batata: "1.000-1.050 g",
      whey: "1 dose",
      cardio: "40 min",
      sono: "7,5-9 h",
      agua: "4-5 L",
    },
  },
];

const habitChecks = [
  ["treino", "Treino pesado", "60-75 min, carga alta, progressão e poucas firulas."],
  ["cardio", "Cardio", "Moderado e dentro da meta da fase."],
  ["agua", "Água", "4-5 litros ao longo do dia."],
  ["sono", "Sono", "Meta de 7,5-9 horas."],
  ["sodio", "Sódio constante", "Mesmo padrão de sal todos os dias."],
  ["semEscape", "Sem escapada", "Fim de semana conta como dia normal."],
];

const alertChecks = [
  ["forca", "Força despencou"],
  ["libido", "Libido caiu muito"],
  ["cansaco", "Cansaço extremo"],
  ["insonia", "Insônia"],
  ["irritabilidade", "Irritabilidade forte"],
];

let state = loadState();
let authSession = loadAuthSession();
let syncTimer = null;
let syncInFlight = false;
let syncAgain = false;

const els = {
  startDate: document.querySelector("#startDate"),
  syncStatus: document.querySelector("#syncStatus"),
  authForm: document.querySelector("#authForm"),
  authEmail: document.querySelector("#authEmail"),
  authPassword: document.querySelector("#authPassword"),
  signUpBtn: document.querySelector("#signUpBtn"),
  sessionBox: document.querySelector("#sessionBox"),
  sessionEmail: document.querySelector("#sessionEmail"),
  syncNowBtn: document.querySelector("#syncNowBtn"),
  signOutBtn: document.querySelector("#signOutBtn"),
  selectedDateLabel: document.querySelector("#selectedDateLabel"),
  dayTitle: document.querySelector("#dayTitle"),
  progressBar: document.querySelector("#progressBar"),
  progressLabel: document.querySelector("#progressLabel"),
  phaseBadge: document.querySelector("#phaseBadge"),
  phaseTitle: document.querySelector("#phaseTitle"),
  phaseGoal: document.querySelector("#phaseGoal"),
  scoreNumber: document.querySelector("#scoreNumber"),
  macroCards: document.querySelector("#macroCards"),
  mealChecks: document.querySelector("#mealChecks"),
  habitChecks: document.querySelector("#habitChecks"),
  focusBox: document.querySelector("#focusBox"),
  dailyTotals: document.querySelector("#dailyTotals"),
  refeedBox: document.querySelector("#refeedBox"),
  alertChecks: document.querySelector("#alertChecks"),
  alertAdvice: document.querySelector("#alertAdvice"),
  timeline: document.querySelector("#timeline"),
  weeklyReview: document.querySelector("#weeklyReview"),
  summaryLabel: document.querySelector("#summaryLabel"),
  chartLabel: document.querySelector("#chartLabel"),
  progressChart: document.querySelector("#progressChart"),
  prevDayBtn: document.querySelector("#prevDayBtn"),
  todayBtn: document.querySelector("#todayBtn"),
  nextDayBtn: document.querySelector("#nextDayBtn"),
  exportBtn: document.querySelector("#exportBtn"),
  importBtn: document.querySelector("#importBtn"),
  importFile: document.querySelector("#importFile"),
  resetBtn: document.querySelector("#resetBtn"),
};

function loadState() {
  const today = toISO(new Date());

  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && parsed.startDate && parsed.entries) {
      return {
        startDate: parsed.startDate,
        selectedDay: clampDay(parsed.selectedDay || 1),
        entries: parsed.entries,
      };
    }
  } catch (error) {
    console.warn("Não foi possível carregar os dados salvos.", error);
  }

  return {
    startDate: today,
    selectedDay: 1,
    entries: {},
  };
}

function saveState(options = {}) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (options.cloud !== false) scheduleCloudSave();
}

function loadAuthSession() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
  } catch {
    return null;
  }
}

function saveAuthSession(session) {
  authSession = normalizeSession(session);
  if (authSession) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authSession));
  else localStorage.removeItem(AUTH_STORAGE_KEY);
  renderAuthPanel();
}

function normalizeSession(session) {
  if (!session || !session.access_token || !session.refresh_token) return null;
  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at
      ? session.expires_at * 1000
      : Date.now() + (session.expires_in || 3600) * 1000,
    user: session.user || authSession?.user || null,
  };
}

async function supabaseRequest(path, options = {}) {
  const headers = {
    apikey: SUPABASE_KEY,
    "Content-Type": "application/json",
  };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (options.prefer) headers.Prefer = options.prefer;

  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = payload?.msg || payload?.message || payload?.error_description || response.statusText;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

async function ensureSession() {
  if (!authSession?.access_token) return null;

  const expiresSoon = authSession.expires_at && authSession.expires_at - Date.now() < 60_000;
  if (!expiresSoon) return authSession;

  try {
    const refreshed = await supabaseRequest("/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      body: { refresh_token: authSession.refresh_token },
    });
    saveAuthSession(refreshed);
    return authSession;
  } catch (error) {
    clearAuthSession();
    setSyncStatus("Sessão expirada. Entre de novo.", "warn");
    throw error;
  }
}

function clearAuthSession() {
  authSession = null;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  renderAuthPanel();
}

function renderAuthPanel() {
  const signedIn = Boolean(authSession?.access_token && authSession?.user);
  els.authForm.hidden = signedIn;
  els.sessionBox.hidden = !signedIn;
  els.sessionEmail.textContent = signedIn ? authSession.user.email || "Conta conectada" : "";
  if (!signedIn) setSyncStatus("Modo local", "local");
}

function setSyncStatus(text, mode = "local") {
  els.syncStatus.textContent = text;
  els.syncStatus.dataset.mode = mode;
}

async function bootCloudSync() {
  renderAuthPanel();
  if (!authSession?.access_token) return;

  try {
    await ensureSession();
    await loadCloudState();
  } catch (error) {
    console.warn("Sincronização inicial falhou.", error);
  }
}

async function signIn(email, password) {
  setSyncStatus("Entrando...", "pending");
  const session = await supabaseRequest("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: { email, password },
  });
  saveAuthSession(session);
  await loadCloudState();
}

async function signUp(email, password) {
  setSyncStatus("Criando conta...", "pending");
  const response = await supabaseRequest("/auth/v1/signup", {
    method: "POST",
    body: { email, password },
  });

  const session = response?.session || response;
  if (session?.access_token) {
    saveAuthSession(session);
    await loadCloudState();
    return;
  }

  setSyncStatus("Conta criada. Confirme o email e entre.", "pending");
}

async function loadCloudState() {
  const session = await ensureSession();
  if (!session?.user?.id) return;

  setSyncStatus("Carregando nuvem...", "pending");
  const query = `/rest/v1/${CLOUD_TABLE}?select=state,updated_at&user_id=eq.${encodeURIComponent(
    session.user.id,
  )}&limit=1`;
  const rows = await supabaseRequest(query, { token: session.access_token });

  if (rows?.[0]?.state) {
    state = mergeStates(state, rows[0].state);
    saveState({ cloud: false });
    render();
  }

  await syncNow();
}

function mergeStates(localState, remoteState) {
  const merged = {
    startDate: remoteState?.startDate || localState.startDate || toISO(new Date()),
    selectedDay: localState.selectedDay || remoteState?.selectedDay || 1,
    entries: {},
    updatedAt: newerTimestamp(localState.updatedAt, remoteState?.updatedAt),
  };
  const days = new Set([
    ...Object.keys(localState.entries || {}),
    ...Object.keys(remoteState?.entries || {}),
  ]);

  days.forEach((day) => {
    const localEntry = localState.entries?.[day];
    const remoteEntry = remoteState?.entries?.[day];
    merged.entries[day] = chooseEntry(localEntry, remoteEntry);
  });

  return merged;
}

function chooseEntry(localEntry, remoteEntry) {
  const hasLocal = entryHasData(localEntry);
  const hasRemote = entryHasData(remoteEntry);
  if (hasLocal && !hasRemote) return localEntry;
  if (!hasLocal && hasRemote) return remoteEntry;
  if (!hasLocal && !hasRemote) return localEntry || remoteEntry || {};

  const localTime = Date.parse(localEntry.updatedAt || "") || 0;
  const remoteTime = Date.parse(remoteEntry.updatedAt || "") || 0;
  return remoteTime > localTime ? remoteEntry : localEntry;
}

function newerTimestamp(a, b) {
  const aTime = Date.parse(a || "") || 0;
  const bTime = Date.parse(b || "") || 0;
  return aTime >= bTime ? a || b || "" : b || a || "";
}

function scheduleCloudSave() {
  if (!authSession?.access_token) return;
  setSyncStatus("Alterações pendentes...", "pending");
  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(() => {
    syncNow().catch((error) => console.warn("Falha ao salvar na nuvem.", error));
  }, 650);
}

async function syncNow() {
  if (!authSession?.access_token) return;
  if (syncInFlight) {
    syncAgain = true;
    return;
  }

  syncInFlight = true;
  syncAgain = false;

  try {
    const session = await ensureSession();
    if (!session?.user?.id) return;

    setSyncStatus("Salvando na nuvem...", "pending");
    await supabaseRequest(`/rest/v1/${CLOUD_TABLE}?on_conflict=user_id`, {
      method: "POST",
      token: session.access_token,
      prefer: "resolution=merge-duplicates,return=minimal",
      body: [
        {
          user_id: session.user.id,
          state,
          updated_at: new Date().toISOString(),
        },
      ],
    });
    setSyncStatus("Sincronizado", "ok");
  } catch (error) {
    const tableMissing = error.status === 404 || String(error.message).includes(CLOUD_TABLE);
    setSyncStatus(tableMissing ? "Banco não configurado" : "Falha ao sincronizar", "error");
    throw error;
  } finally {
    syncInFlight = false;
    if (syncAgain) {
      syncAgain = false;
      await syncNow();
    }
  }
}

function toISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromISO(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(isoDate, offset) {
  const date = fromISO(isoDate);
  date.setDate(date.getDate() + offset);
  return toISO(date);
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(fromISO(isoDate));
}

function dayForDate(isoDate) {
  const start = fromISO(state.startDate);
  const date = fromISO(isoDate);
  return Math.floor((date - start) / DAY_MS) + 1;
}

function todayPlanDay() {
  return clampDay(dayForDate(toISO(new Date())));
}

function clampDay(day) {
  const numeric = Number(day) || 1;
  return Math.max(1, Math.min(TOTAL_DAYS, numeric));
}

function currentPhase(day) {
  return phases.find((phase) => day >= phase.start && day <= phase.end) || phases[0];
}

function getEntry(day = state.selectedDay) {
  const key = String(day);
  if (!state.entries[key]) {
    state.entries[key] = {
      checks: {},
      alerts: {},
      weight: "",
      waist: "",
      sleep: "",
      cardioMin: "",
      water: "",
      energy: "",
      notes: "",
      refeed: false,
      updatedAt: "",
    };
  }
  if (!state.entries[key].checks) state.entries[key].checks = {};
  if (!state.entries[key].alerts) state.entries[key].alerts = {};
  return state.entries[key];
}

function touchEntry(entry) {
  const now = new Date().toISOString();
  entry.updatedAt = now;
  state.updatedAt = now;
}

function standardCheckIds() {
  return [
    ...[0, 1, 2, 3, 4].map((index) => `meal-${index}`),
    ...habitChecks.map(([id]) => id),
  ];
}

function adherenceForDay(day) {
  const entry = state.entries[String(day)];
  if (!entry || !entry.checks) return 0;
  const ids = standardCheckIds();
  const done = ids.filter((id) => entry.checks[id]).length;
  return Math.round((done / ids.length) * 100);
}

function render() {
  state.selectedDay = clampDay(state.selectedDay);
  const day = state.selectedDay;
  const phase = currentPhase(day);
  const entry = getEntry(day);
  const selectedDate = addDays(state.startDate, day - 1);
  const percent = Math.round((day / TOTAL_DAYS) * 100);
  const adherence = adherenceForDay(day);

  els.startDate.value = state.startDate;
  els.selectedDateLabel.textContent = formatDate(selectedDate);
  els.dayTitle.textContent = `Dia ${day}`;
  els.progressBar.style.width = `${percent}%`;
  els.progressLabel.textContent = `${day} de ${TOTAL_DAYS} dias - ${TOTAL_DAYS - day} restantes`;
  els.phaseBadge.textContent = `${phase.title} | dias ${phase.start}-${phase.end}`;
  els.phaseTitle.textContent = phaseTitleForDay(phase, day);
  els.phaseGoal.textContent = phase.goal;
  els.scoreNumber.textContent = `${adherence}%`;

  renderMacroCards(phase, day);
  renderChecks(phase, entry);
  renderDailyTotals(phase, day);
  renderFields(entry);
  renderRefeed(day, entry);
  renderAlerts(entry);
  renderTimeline();
  renderWeeklyReview();
  renderSummary();
  drawChart();

  els.prevDayBtn.disabled = day === 1;
  els.nextDayBtn.disabled = day === TOTAL_DAYS;
}

function phaseTitleForDay(phase, day) {
  if (phase.id === 1) return "Entrada controlada";
  if (phase.id === 2) return "Definição acelerada";
  if (day >= 40) return "Reta final";
  return "Carbo concentrado";
}

function renderMacroCards(phase, day) {
  const refeedInfo = nextRefeedInfo(day);
  const cards = [
    ["Proteína", phase.macros.proteina, "base diária"],
    ["Carbo", phase.macros.carbo, "fase atual"],
    ["Carne", phase.totals.carne, "total do dia"],
    ["Batata", phase.totals.batata, "sem refeed"],
    ["Cardio", phase.macros.cardio, "alvo mínimo"],
    ["Refeed", refeedInfo.short, refeedInfo.detail],
  ];

  els.macroCards.innerHTML = cards
    .map(
      ([label, value, detail]) => `
        <article class="target-card">
          <span class="label">${label}</span>
          <span class="value">${value}</span>
          <span class="detail">${detail}</span>
        </article>
      `,
    )
    .join("");
}

function nextRefeedInfo(day) {
  const next = REFEED_DAYS.find((refeedDay) => refeedDay >= day);
  if (REFEED_DAYS.includes(day)) {
    return { short: "Hoje", detail: "+300-400 g batata" };
  }
  if (next) {
    const distance = next - day;
    return {
      short: `D${next}`,
      detail: `em ${distance} dia${distance === 1 ? "" : "s"}`,
    };
  }
  return { short: "Livre", detail: "só se precisar" };
}

function renderChecks(phase, entry) {
  els.mealChecks.innerHTML = phase.meals
    .map(([name, detail], index) => {
      const id = `meal-${index}`;
      return checkRow(id, name, detail, Boolean(entry.checks[id]));
    })
    .join("");

  els.habitChecks.innerHTML = habitChecks
    .map(([id, name, detail]) => checkRow(id, name, detail, Boolean(entry.checks[id])))
    .join("");
}

function checkRow(id, title, detail, checked) {
  return `
    <label class="check-row">
      <input data-check="${id}" type="checkbox" ${checked ? "checked" : ""} />
      <span>
        <span class="check-title">${title}</span>
        <span class="check-detail">${detail}</span>
      </span>
    </label>
  `;
}

function renderDailyTotals(phase, day) {
  const refeedInfo = nextRefeedInfo(day);
  const totals = [
    ["Carne moída", phase.totals.carne],
    ["Batata", phase.totals.batata],
    ["Whey", phase.totals.whey],
    ["Cardio", phase.totals.cardio],
    ["Água", phase.totals.agua],
    ["Sono", phase.totals.sono],
    ["Sódio", "constante"],
    ["Refeed", `${refeedInfo.short} · ${refeedInfo.detail}`],
  ];

  els.focusBox.textContent =
    day >= 31
      ? "Foco: concentrar carbo em pré e pós, manter o resto do dia limpo e não sacrificar o treino."
      : "Foco: cumprir refeições, cardio e água sem mexer no sal. A consistência está fazendo o trabalho.";

  els.dailyTotals.innerHTML = totals
    .map(
      ([name, detail]) => `
        <div class="total-row">
          <strong>${name}</strong>
          <span>${detail}</span>
        </div>
      `,
    )
    .join("");
}

function renderFields(entry) {
  document.querySelectorAll("[data-field]").forEach((field) => {
    const name = field.dataset.field;
    if (field.type === "checkbox") {
      field.checked = Boolean(entry[name]);
      return;
    }
    field.value = entry[name] || "";
  });
}

function renderRefeed(day, entry) {
  const next = REFEED_DAYS.find((refeedDay) => refeedDay >= day);
  const planned = REFEED_DAYS.includes(day);
  const distance = next ? next - day : null;
  const status = entry.refeed
    ? "Refeed registrado. Mantenha gordura baixa e some 300-400 g de batata no dia."
    : planned
      ? "Janela sugerida de refeed. Use carbo alto se performance, pump ou aparência pedirem."
      : next
        ? `Próxima janela sugerida: dia ${next}, em ${distance} dia${distance === 1 ? "" : "s"}.`
        : "Ciclo sem nova janela padrão. Use apenas se sinais de queda justificarem.";

  els.refeedBox.textContent = `${status} Base: +300-400 g de batata extras, gordura baixa, água e sódio consistentes.`;
}

function renderAlerts(entry) {
  els.alertChecks.innerHTML = alertChecks
    .map(
      ([id, label]) => `
        <label class="signal-item">
          <input data-alert="${id}" type="checkbox" ${entry.alerts[id] ? "checked" : ""} />
          <span>${label}</span>
        </label>
      `,
    )
    .join("");

  const activeCount = alertChecks.filter(([id]) => entry.alerts[id]).length;
  els.alertAdvice.className = activeCount ? "callout alert" : "callout quiet";
  els.alertAdvice.textContent = activeCount
    ? "Sinal amarelo: aumente carbo em 50-100 g, preserve o treino e confira sono, água e sódio antes de mexer no resto."
    : "Sem sinais críticos marcados. Mantenha o plano, o cardio e a consistência de sal/água.";
}

function renderTimeline() {
  const current = todayPlanDay();
  const buttons = [];

  for (let day = 1; day <= TOTAL_DAYS; day += 1) {
    const adherence = adherenceForDay(day);
    const phase = currentPhase(day);
    const entry = state.entries[String(day)];
    const classes = [
      `phase-${phase.id}`,
      day === current ? "current" : "",
      day === state.selectedDay ? "selected" : "",
      adherence >= 80 ? "complete" : adherence > 0 ? "partial" : "",
      REFEED_DAYS.includes(day) || entry?.refeed ? "refeed" : "",
    ]
      .filter(Boolean)
      .join(" ");

    buttons.push(
      `<button class="${classes}" type="button" data-day="${day}" aria-label="Dia ${day}, ${adherence}% de aderência">${day}</button>`,
    );
  }

  els.timeline.innerHTML = buttons.join("");
}

function renderWeeklyReview() {
  const weeks = Array.from({ length: Math.ceil(TOTAL_DAYS / 7) }, (_, weekIndex) => {
    const start = weekIndex * 7 + 1;
    const end = Math.min(start + 6, TOTAL_DAYS);
    const days = Array.from({ length: end - start + 1 }, (_, index) => start + index);
    const activeDays = days.filter((day) => entryHasData(state.entries[String(day)]));
    const adherenceValues = activeDays.map(adherenceForDay);
    const avgAdherence = average(adherenceValues);
    const cardioTotal = activeDays.reduce((sum, day) => {
      const value = Number(state.entries[String(day)]?.cardioMin);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);
    const alertCount = activeDays.reduce((sum, day) => {
      const alerts = state.entries[String(day)]?.alerts || {};
      return sum + Object.values(alerts).filter(Boolean).length;
    }, 0);
    const weights = activeDays
      .map((day) => Number(state.entries[String(day)]?.weight))
      .filter((value) => Number.isFinite(value) && value > 0);
    const waists = activeDays
      .map((day) => Number(state.entries[String(day)]?.waist))
      .filter((value) => Number.isFinite(value) && value > 0);

    return {
      label: `${start}-${end}`,
      daysLogged: activeDays.length,
      adherence: avgAdherence === null ? "-" : `${Math.round(avgAdherence)}%`,
      weightDelta: formatDelta(weights),
      waistDelta: formatDelta(waists),
      cardio: cardioTotal ? `${cardioTotal} min` : "-",
      status: weeklyStatus(avgAdherence, alertCount, activeDays.length),
    };
  });

  els.weeklyReview.innerHTML = `
    <div class="weekly-row weekly-head">
      <span>Semana</span>
      <span>Aderência</span>
      <span>Peso</span>
      <span>Cintura</span>
      <span>Cardio</span>
      <span>Status</span>
    </div>
    ${weeks
      .map(
        (week) => `
          <div class="weekly-row">
            <strong>${week.label}</strong>
            <span>${week.adherence}</span>
            <span>${week.weightDelta}</span>
            <span>${week.waistDelta}</span>
            <span>${week.cardio}</span>
            <span>${week.status}</span>
          </div>
        `,
      )
      .join("")}
  `;
}

function entryHasData(entry) {
  if (!entry) return false;
  const hasChecks = Object.values(entry.checks || {}).some(Boolean);
  const hasAlerts = Object.values(entry.alerts || {}).some(Boolean);
  return Boolean(
    hasChecks ||
      hasAlerts ||
      entry.weight ||
      entry.waist ||
      entry.sleep ||
      entry.cardioMin ||
      entry.water ||
      entry.energy ||
      entry.notes ||
      entry.refeed,
  );
}

function average(values) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatDelta(values) {
  if (values.length < 2) return "-";
  const delta = values[values.length - 1] - values[0];
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}`;
}

function weeklyStatus(avgAdherence, alertCount, daysLogged) {
  if (!daysLogged) return "Aguardando";
  if (alertCount >= 2 || avgAdherence < 70) return "Ajustar";
  if (avgAdherence >= 85) return "Forte";
  return "Construindo";
}

function renderSummary() {
  const entries = Object.keys(state.entries);
  const completed = Array.from({ length: TOTAL_DAYS }, (_, index) => index + 1).filter(
    (day) => adherenceForDay(day) >= 80,
  ).length;
  const current = todayPlanDay();
  const lastSeven = Array.from({ length: 7 }, (_, index) => current - index)
    .filter((day) => day >= 1)
    .map(adherenceForDay);
  const avg7 = lastSeven.length
    ? Math.round(lastSeven.reduce((sum, value) => sum + value, 0) / lastSeven.length)
    : 0;

  els.summaryLabel.textContent = `${completed} dias fortes | média 7d ${avg7}%`;

  const points = progressPoints();
  els.chartLabel.textContent = points.length
    ? `${points.length} registro${points.length === 1 ? "" : "s"}`
    : "sem registros";

  if (!entries.length) return;
}

function progressPoints() {
  return Array.from({ length: TOTAL_DAYS }, (_, index) => {
    const day = index + 1;
    const entry = state.entries[String(day)];
    if (!entry) return null;
    const weight = Number(entry.weight);
    const waist = Number(entry.waist);
    if (!weight && !waist) return null;
    return {
      day,
      weight: Number.isFinite(weight) && weight > 0 ? weight : null,
      waist: Number.isFinite(waist) && waist > 0 ? waist : null,
    };
  }).filter(Boolean);
}

function drawChart() {
  const canvas = els.progressChart;
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const pad = 42;
  const points = progressPoints();

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#fbfcfb";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "#dce2df";
  context.lineWidth = 1;

  for (let i = 0; i <= 5; i += 1) {
    const y = pad + ((height - pad * 2) / 5) * i;
    context.beginPath();
    context.moveTo(pad, y);
    context.lineTo(width - pad, y);
    context.stroke();
  }

  context.fillStyle = "#65706b";
  context.font = "700 14px Inter, Segoe UI, sans-serif";
  context.fillText("Dia 1", pad, height - 14);
  context.fillText("Dia 45", width - pad - 48, height - 14);

  if (!points.length) {
    context.fillStyle = "#65706b";
    context.font = "800 18px Inter, Segoe UI, sans-serif";
    context.fillText("Registre peso e cintura para visualizar a evolução.", pad, height / 2);
    return;
  }

  drawSeries(context, points, "weight", "#2e5c88", width, height, pad);
  drawSeries(context, points, "waist", "#2f7d62", width, height, pad);

  context.fillStyle = "#2e5c88";
  context.fillRect(pad, 18, 14, 5);
  context.fillStyle = "#111817";
  context.font = "800 13px Inter, Segoe UI, sans-serif";
  context.fillText("Peso", pad + 20, 24);

  context.fillStyle = "#2f7d62";
  context.fillRect(pad + 90, 18, 14, 5);
  context.fillStyle = "#111817";
  context.fillText("Cintura", pad + 110, 24);
}

function drawSeries(context, points, key, color, width, height, pad) {
  const values = points.filter((point) => point[key]).map((point) => point[key]);
  if (!values.length) return;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const coords = points
    .filter((point) => point[key])
    .map((point) => {
      const x = pad + ((point.day - 1) / (TOTAL_DAYS - 1)) * (width - pad * 2);
      const y = height - pad - ((point[key] - min) / range) * (height - pad * 2);
      return { x, y, value: point[key] };
    });

  context.strokeStyle = color;
  context.lineWidth = 4;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.beginPath();
  coords.forEach((coord, index) => {
    if (index === 0) context.moveTo(coord.x, coord.y);
    else context.lineTo(coord.x, coord.y);
  });
  context.stroke();

  coords.forEach((coord) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(coord.x, coord.y, 5, 0, Math.PI * 2);
    context.fill();
  });
}

function updateField(field) {
  const entry = getEntry();
  const name = field.dataset.field;
  if (field.type === "checkbox") entry[name] = field.checked;
  else entry[name] = field.value;
  touchEntry(entry);
  saveState();
}

document.addEventListener("change", (event) => {
  const target = event.target;

  if (target === els.startDate) {
    state.startDate = target.value || toISO(new Date());
    state.selectedDay = todayPlanDay();
    state.updatedAt = new Date().toISOString();
    saveState();
    render();
    return;
  }

  if (target.matches("[data-check]")) {
    const entry = getEntry();
    entry.checks[target.dataset.check] = target.checked;
    touchEntry(entry);
    saveState();
    render();
    return;
  }

  if (target.matches("[data-alert]")) {
    const entry = getEntry();
    entry.alerts[target.dataset.alert] = target.checked;
    touchEntry(entry);
    saveState();
    render();
    return;
  }

  if (target.matches("[data-field]")) {
    updateField(target);
    render();
  }
});

document.addEventListener("input", (event) => {
  const target = event.target;
  if (!target.matches("[data-field]") || target.type === "checkbox") return;
  updateField(target);
  renderSummary();
  drawChart();
});

els.timeline.addEventListener("click", (event) => {
  const button = event.target.closest("[data-day]");
  if (!button) return;
  state.selectedDay = clampDay(button.dataset.day);
  saveState({ cloud: false });
  render();
});

els.prevDayBtn.addEventListener("click", () => {
  state.selectedDay = clampDay(state.selectedDay - 1);
  saveState({ cloud: false });
  render();
});

els.nextDayBtn.addEventListener("click", () => {
  state.selectedDay = clampDay(state.selectedDay + 1);
  saveState({ cloud: false });
  render();
});

els.todayBtn.addEventListener("click", () => {
  state.selectedDay = todayPlanDay();
  saveState({ cloud: false });
  render();
});

els.authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = els.authEmail.value.trim();
  const password = els.authPassword.value;
  if (!email || !password) return;

  try {
    await signIn(email, password);
    els.authPassword.value = "";
  } catch (error) {
    setSyncStatus("Email ou senha inválidos", "error");
    console.warn("Falha ao entrar.", error);
  }
});

els.signUpBtn.addEventListener("click", async () => {
  const email = els.authEmail.value.trim();
  const password = els.authPassword.value;
  if (!email || !password) {
    setSyncStatus("Informe email e senha", "error");
    return;
  }

  try {
    await signUp(email, password);
    els.authPassword.value = "";
  } catch (error) {
    setSyncStatus("Não foi possível criar conta", "error");
    console.warn("Falha ao criar conta.", error);
  }
});

els.syncNowBtn.addEventListener("click", () => {
  syncNow().catch((error) => console.warn("Falha na sincronização manual.", error));
});

els.signOutBtn.addEventListener("click", async () => {
  try {
    if (authSession?.access_token) {
      await supabaseRequest("/auth/v1/logout", {
        method: "POST",
        token: authSession.access_token,
      });
    }
  } catch (error) {
    console.warn("Falha ao encerrar sessão no Supabase.", error);
  } finally {
    clearAuthSession();
  }
});

els.exportBtn.addEventListener("click", () => {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `plano-45-dias-${toISO(new Date())}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

els.importBtn.addEventListener("click", () => {
  els.importFile.click();
});

els.importFile.addEventListener("change", async (event) => {
  const [file] = event.target.files || [];
  if (!file) return;

  try {
    const imported = normalizeImportedState(JSON.parse(await file.text()));
    const confirmed = window.confirm("Substituir os registros atuais pelo backup importado?");
    if (!confirmed) return;
    state = imported;
    saveState();
    render();
  } catch (error) {
    window.alert("Não foi possível importar este arquivo de backup.");
    console.warn("Falha ao importar backup.", error);
  } finally {
    event.target.value = "";
  }
});

function normalizeImportedState(imported) {
  if (!imported || typeof imported !== "object" || !imported.startDate || !imported.entries) {
    throw new Error("Backup inválido.");
  }

  return {
    startDate: imported.startDate,
    selectedDay: clampDay(imported.selectedDay || 1),
    entries: imported.entries,
    updatedAt: imported.updatedAt || new Date().toISOString(),
  };
}

els.resetBtn.addEventListener("click", () => {
  const confirmed = window.confirm(
    authSession?.access_token
      ? "Limpar registros deste navegador e substituir a nuvem por um plano vazio?"
      : "Limpar todos os registros deste navegador?",
  );
  if (!confirmed) return;
  localStorage.removeItem(STORAGE_KEY);
  state = loadState();
  state.updatedAt = new Date().toISOString();
  saveState();
  render();
});

saveState({ cloud: false });
render();
bootCloudSync();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch((error) => {
      console.warn("Não foi possível ativar o cache offline.", error);
    });
  });
}
