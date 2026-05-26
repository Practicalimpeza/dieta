const STORAGE_KEY = "plano-45-dias:v2";
const PLAN_START_DATE = "2026-05-26";
const SUPABASE_URL = "https://pjmaoqysyspbmdefygxd.supabase.co";
const SUPABASE_KEY = "sb_publishable_nio0RbbeRBusnXhTf-P5hA_Fpv8gA_1";
const CLOUD_TABLE = "dieta";
const CLOUD_STATE_ID = 1;
const TOTAL_DAYS = 45;
const DAY_MS = 24 * 60 * 60 * 1000;
const REFEED_DAYS = [12, 24, 36];
const WATER_STEP_LITERS = 0.5;
const WATER_MIN_UNITS = 8;
const WATER_IDEAL_UNITS = 10;
const WATER_PACE_START_MINUTES = 7 * 60;
const WATER_PACE_END_MINUTES = 22 * 60;
const VALID_TABS = ["today", "training", "control", "review"];

const phases = [
  {
    id: 1,
    start: 1,
    end: 15,
    title: "Fase 1",
    goal: "Entrar em déficit leve, manter performance e controlar pressão, água e digestão.",
    macros: {
      proteina: "180-190 g",
      carbo: "260 g",
      gordura: "60-65 g",
      kcal: "~2.450",
      cardio: "30-35 min",
      agua: "4-5 L",
    },
    meals: [
      ["Refeição 1", "1 dose whey + 250 g batata ou 200 g arroz"],
      ["Refeição 2", "200 g carne moída/frango + 250 g arroz ou 300 g batata"],
      ["Pré-treino", "150 g patinho/frango + 300-350 g batata/arroz"],
      ["Pós-treino", "1 dose whey + 300 g arroz/batata"],
      ["Última", "200 g carne/frango/ovos + 150 g arroz/batata"],
    ],
    totals: {
      proteina: "180-190 g",
      carbo: "260 g",
      gordura: "60-65 g",
      fibra: "psyllium opcional",
      whey: "1 dose",
      cardio: "30-35 min",
      sono: "7,5-9 h",
      agua: "4-5 L",
      calcio: "sem extra",
    },
  },
  {
    id: 2,
    start: 16,
    end: 30,
    title: "Fase 2",
    goal: "Apertar o déficit sem derrubar carga, libido ou sono.",
    macros: {
      proteina: "185-195 g",
      carbo: "225 g",
      gordura: "55-60 g",
      kcal: "~2.300",
      cardio: "35-40 min",
      agua: "4-5 L",
    },
    meals: [
      ["Refeição 1", "1 dose whey + 220 g batata ou 170 g arroz"],
      ["Refeição 2", "200 g carne moída/frango + 220 g arroz ou 260 g batata"],
      ["Pré-treino", "150 g patinho/frango + 280 g batata/arroz"],
      ["Pós-treino", "1 dose whey + 260 g arroz/batata"],
      ["Última", "200 g carne/frango/ovos + 100 g arroz/batata"],
    ],
    totals: {
      proteina: "185-195 g",
      carbo: "225 g",
      gordura: "55-60 g",
      fibra: "psyllium opcional",
      whey: "1 dose",
      cardio: "35-40 min",
      sono: "7,5-9 h",
      agua: "4-5 L",
      calcio: "sem extra",
    },
  },
  {
    id: 3,
    start: 31,
    end: 45,
    title: "Fase 3",
    goal: "Finalizar mais seco, mantendo carbo perto do treino e recuperando o suficiente.",
    macros: {
      proteina: "190 g",
      carbo: "200-210 g",
      gordura: "50-55 g",
      kcal: "~2.150",
      cardio: "40 min",
      agua: "4-5 L",
    },
    meals: [
      ["Refeição 1", "1 dose whey + 200 g batata ou 150 g arroz"],
      ["Refeição 2", "200 g carne moída/frango + 180 g arroz ou 230 g batata"],
      ["Pré-treino", "150 g patinho/frango + 260 g batata/arroz"],
      ["Pós-treino", "1 dose whey + 250 g arroz/batata"],
      ["Última", "200 g carne/frango/ovos sem carbo, ou 80 g arroz se o sono cair"],
    ],
    totals: {
      proteina: "190 g",
      carbo: "200-210 g",
      gordura: "50-55 g",
      fibra: "psyllium opcional",
      whey: "1 dose",
      cardio: "40 min",
      sono: "7,5-9 h",
      agua: "4-5 L",
      calcio: "sem extra",
    },
  },
];

const baseHabitChecks = [
  ["cardio", "Cardio", "Moderado e dentro da meta da fase."],
  ["sono", "Sono", "Meta de 7,5-9 horas."],
];

const alertChecks = [
  ["pressaoAlta", "Pressão alta"],
  ["dorCabeca", "Dor de cabeça forte"],
  ["faltaAr", "Falta de ar/dor no peito"],
  ["forca", "Força despencou"],
  ["libido", "Libido caiu muito"],
  ["cansaco", "Cansaço extremo"],
  ["insonia", "Insônia"],
  ["irritabilidade", "Irritabilidade forte"],
];

const trainingPlanByWeekday = {
  0: {
    title: "Descanso ativo",
    time: "Livre",
    detail: "caminhada leve + mobilidade",
    focus: "Recuperar, manter passos e chegar inteiro na segunda.",
    preWindow: "",
    postWindow: "",
    exercises: [],
  },
  1: {
    title: "Peito + tríceps + lateral",
    time: "10h",
    detail: "push forte",
    focus: "Progredir no supino e preservar articulação. Falha só nos isoladores.",
    preWindow: "08h30-09h30",
    postWindow: "após 11h",
    exercises: [
      ["supino-reto", "Supino reto", "4x6-8", "1-2 RIR"],
      ["supino-inclinado", "Supino inclinado halter", "3x8-10", "controle total"],
      ["crossover", "Crossover/crucifixo", "3x12-15", "alongar sem dor"],
      ["desenvolvimento", "Desenvolvimento", "3x8-10", "sem roubar lombar"],
      ["elevacao-lateral", "Elevação lateral", "4x12-20", "perto da falha"],
      ["triceps-corda", "Tríceps corda", "3x10-15", "cotovelo estável"],
      ["triceps-frances", "Tríceps francês/testa", "3x10-12", "amplitude confortável"],
    ],
  },
  2: {
    title: "Costas + bíceps",
    time: "20h",
    detail: "puxada e remada",
    focus: "Remada pesada, costas cheias e bíceps limpo, sem roubar.",
    preWindow: "18h30-19h30",
    postWindow: "após 21h",
    exercises: [
      ["puxada-alta", "Barra fixa/puxada alta", "4x8-10", "peito alto"],
      ["remada-pesada", "Remada curvada/cavalinho", "4x6-10", "progressão principal"],
      ["remada-baixa", "Remada baixa", "3x10-12", "contrair escápulas"],
      ["pulldown", "Pulldown braço reto", "3x12-15", "latíssimo"],
      ["rosca-direta", "Rosca direta", "3x8-10", "sem balanço"],
      ["rosca-inclinada", "Rosca alternada/inclinada", "3x10-12", "alongar"],
      ["rosca-martelo", "Rosca martelo", "2-3x12", "antebraço junto"],
    ],
  },
  3: {
    title: "Pernas completo",
    time: "10h",
    detail: "quadríceps + posterior",
    focus: "Forte o bastante para progredir, sem destruir a recuperação da semana.",
    preWindow: "08h30-09h30",
    postWindow: "após 11h",
    exercises: [
      ["agachamento-leg", "Agachamento ou leg press", "4x6-10", "base do dia"],
      ["hack-passada", "Hack ou passada", "3x8-12", "amplitude"],
      ["extensora", "Cadeira extensora", "3x12-15", "pico de contração"],
      ["flexora", "Mesa flexora", "4x10-15", "sem pressa"],
      ["stiff", "Stiff/romeno", "3x8-10", "posterior"],
      ["panturrilha", "Panturrilha", "5x10-20", "pausa embaixo"],
    ],
  },
  4: {
    title: "Cardio + abdômen",
    time: "20h",
    detail: "dia de controle",
    focus: "Melhorar condicionamento e HDL sem moer articulação.",
    preWindow: "18h30-19h30",
    postWindow: "após 21h",
    exercises: [
      ["cardio-z2", "Cardio zona 2", "35-45 min", "respiração controlada"],
      ["abdominal-maquina", "Abdominal máquina/crunch", "3x12-20", "sem pressa"],
      ["elevacao-pernas", "Elevação de pernas", "3x10-15", "pelve controlada"],
      ["prancha", "Prancha", "3 séries", "tempo de qualidade"],
      ["mobilidade", "Mobilidade", "8-12 min", "quadril/torácica/ombro"],
    ],
  },
  5: {
    title: "Ombros + braços",
    time: "10h",
    detail: "deltoide e braços",
    focus: "Volume em lateral/posterior de ombro; braços com execução limpa.",
    preWindow: "08h30-09h30",
    postWindow: "após 11h",
    exercises: [
      ["desenvolvimento-ombro", "Desenvolvimento halter/máquina", "4x6-10", "principal"],
      ["lateral-volume", "Elevação lateral", "5x12-20", "controle"],
      ["crucifixo-inverso", "Crucifixo inverso", "4x12-20", "posterior"],
      ["encolhimento", "Encolhimento", "3x10-15", "trapézio"],
      ["rosca-scott", "Rosca Scott", "3x8-12", "cotovelo fixo"],
      ["rosca-cabo", "Rosca cabo", "3x12-15", "tensão constante"],
      ["triceps-pulley", "Tríceps pulley", "3x10-15", "cotovelo firme"],
      ["paralela", "Paralela/tríceps máquina", "3x8-12", "sem dor no ombro"],
    ],
  },
  6: {
    title: "Posterior + costas leve",
    time: "10h",
    detail: "pontos fracos",
    focus: "Posterior, panturrilha e costas com qualidade, sem disputar com o treino pesado.",
    preWindow: "08h30-09h30",
    postWindow: "após 11h",
    exercises: [
      ["romeno", "Terra romeno/stiff", "4x6-10", "posterior pesado"],
      ["flexora-sabado", "Flexora", "4x10-15", "controle"],
      ["hip-thrust", "Hip thrust/glúteo máquina", "3x8-12", "força"],
      ["remada-apoiada", "Remada apoiada", "3x10-12", "sem lombar"],
      ["puxada-neutra", "Puxada neutra", "3x10-12", "amplitude"],
      ["panturrilha-sabado", "Panturrilha", "4x12-20", "volume"],
      ["abdomen-sabado", "Abdômen", "2-3 séries", "rápido e limpo"],
    ],
  },
};

const personalTrainingWeekdays = new Set([1, 3, 5]);
const rotatingPersonalTemplates = [1, 2, 3, 5, 6].map((weekday) => trainingPlanByWeekday[weekday]);
const specialTrainingDates = {
  "2026-05-26": {
    title: "Pré-exame",
    time: "20h",
    detail: "ombro leve ou descanso",
    focus: "Sem treino pesado, sem falha e sem cardio intenso para não sujar o exame de amanhã.",
    preWindow: "",
    postWindow: "",
    exercises: [
      ["mobilidade-ombro", "Mobilidade de ombro", "8-10 min", "leve"],
      ["elevacao-lateral-leve", "Elevação lateral leve", "2-3x15-20", "longe da falha"],
      ["face-pull-leve", "Face pull leve", "2-3x15-20", "técnica"],
      ["caminhada-leve", "Caminhada leve", "15-25 min", "sem cansar"],
    ],
  },
  "2026-05-27": {
    title: "Personal pós-exame",
    time: "após coleta",
    detail: "técnica moderada",
    focus: "Treine só depois da coleta. Nada de PR; use o personal para aprender execução.",
    preWindow: "",
    postWindow: "",
    exercises: [
      ["tecnica-supino", "Técnica de supino", "3x8 leve", "aprendizado"],
      ["tecnica-remada", "Técnica de remada", "3x10 leve", "escápulas"],
      ["tecnica-agacho", "Técnica de agacho/leg", "3x10 leve", "controle"],
      ["mobilidade-pos-exame", "Mobilidade", "8-12 min", "soltar"],
    ],
  },
};

const supportTrainingByWeekday = {
  0: trainingPlanByWeekday[0],
  2: {
    title: "Suporte leve",
    time: "20h",
    detail: "cardio leve + mobilidade",
    focus: "Aumentar gasto e praticar movimento sem atrapalhar os treinos com personal.",
    preWindow: "18h30-19h30",
    postWindow: "após 21h",
    exercises: [
      ["cardio-leve-terca", "Cardio zona 2", "25-35 min", "moderado"],
      ["mobilidade-terca", "Mobilidade", "8-12 min", "quadril/ombro"],
      ["abdomen-terca", "Abdômen leve", "2-3 séries", "sem falha"],
    ],
  },
  4: trainingPlanByWeekday[4],
  6: {
    title: "Recuperação ativa",
    time: "Livre",
    detail: "cardio + pontos fracos leves",
    focus: "Circular sangue, manter condicionamento e chegar bem no próximo treino com personal.",
    preWindow: "",
    postWindow: "",
    exercises: [
      ["cardio-sabado", "Cardio zona 2", "30-45 min", "constante"],
      ["panturrilha-leve", "Panturrilha leve", "3x15-20", "opcional"],
      ["abdomen-sabado-leve", "Abdômen", "2-3 séries", "opcional"],
      ["mobilidade-sabado", "Mobilidade", "8-12 min", "leve"],
    ],
  },
};

let state = loadState();
let syncTimer = null;
let syncInFlight = false;
let syncAgain = false;

cleanVersionParam();

const els = {
  workspace: document.querySelector("#workspace"),
  tabButtons: document.querySelectorAll("[data-tab]"),
  tabPanels: document.querySelectorAll("[data-tab-panel]"),
  startDate: document.querySelector("#startDate"),
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
  trainingPlan: document.querySelector("#trainingPlan"),
  trainingScore: document.querySelector("#trainingScore"),
  focusBox: document.querySelector("#focusBox"),
  dailyTotals: document.querySelector("#dailyTotals"),
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
  cloudStatus: document.querySelector("#cloudStatus"),
};

function cleanVersionParam() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("v")) return;
  url.searchParams.delete("v");
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && parsed.startDate && parsed.entries) {
      return {
        startDate: parsed.startDate,
        selectedDay: clampDay(parsed.selectedDay || 1),
        activeTab: validTab(parsed.activeTab),
        entries: parsed.entries,
      };
    }
  } catch (error) {
    console.warn("Não foi possível carregar os dados salvos.", error);
  }

  return {
    startDate: PLAN_START_DATE,
    selectedDay: 1,
    activeTab: "today",
    entries: {},
  };
}

function saveState(options = {}) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (options.cloud !== false) scheduleCloudSave();
}

async function supabaseRequest(path, options = {}) {
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
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

function setSyncStatus(text, mode = "local") {
  document.documentElement.dataset.syncStatus = mode;
  document.documentElement.dataset.syncLabel = text;
  if (!els.cloudStatus) return;

  if (mode === "error") {
    els.cloudStatus.textContent =
      text === "Banco não configurado"
        ? "Nuvem pendente: rode o SQL do Supabase uma vez."
        : "Nuvem com falha: dados salvos neste aparelho.";
    els.cloudStatus.hidden = false;
    return;
  }

  els.cloudStatus.textContent = "";
  els.cloudStatus.hidden = true;
}

async function bootCloudSync() {
  try {
    await loadCloudState();
  } catch (error) {
    const needsSetup = cloudNeedsSetup(error);
    setSyncStatus(needsSetup ? "Banco não configurado" : "Falha ao sincronizar", "error");
    console.warn("Sincronização inicial falhou.", error);
  }
}

async function loadCloudState() {
  setSyncStatus("Carregando nuvem...", "pending");
  const query = `/rest/v1/${CLOUD_TABLE}?select=state,updated_at&id=eq.${encodeURIComponent(
    CLOUD_STATE_ID,
  )}&limit=1`;
  const rows = await supabaseRequest(query);

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
    activeTab: validTab(localState.activeTab || remoteState?.activeTab),
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
  setSyncStatus("Alterações pendentes...", "pending");
  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(() => {
    syncNow().catch((error) => console.warn("Falha ao salvar na nuvem.", error));
  }, 650);
}

async function syncNow() {
  if (syncInFlight) {
    syncAgain = true;
    return;
  }

  syncInFlight = true;
  syncAgain = false;

  try {
    setSyncStatus("Salvando na nuvem...", "pending");
    await supabaseRequest(`/rest/v1/${CLOUD_TABLE}?on_conflict=id`, {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: [
        {
          id: CLOUD_STATE_ID,
          state,
          updated_at: new Date().toISOString(),
        },
      ],
    });
    setSyncStatus("Sincronizado", "ok");
  } catch (error) {
    setSyncStatus(cloudNeedsSetup(error) ? "Banco não configurado" : "Falha ao sincronizar", "error");
    throw error;
  } finally {
    syncInFlight = false;
    if (syncAgain) {
      syncAgain = false;
      await syncNow();
    }
  }
}

function cloudNeedsSetup(error) {
  const message = String(error?.message || "");
  return error?.status === 404 || message.includes("does not exist") || message.includes(CLOUD_TABLE);
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

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
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

function validTab(tab) {
  return VALID_TABS.includes(tab) ? tab : "today";
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
      waterUnits: 0,
      pressure: "",
      restingPulse: "",
      energy: "",
      notes: "",
      training: {},
      refeed: false,
      updatedAt: "",
    };
  }
  if (!state.entries[key].checks) state.entries[key].checks = {};
  if (!state.entries[key].alerts) state.entries[key].alerts = {};
  ensureTrainingEntry(state.entries[key]);
  return state.entries[key];
}

function ensureTrainingEntry(entry) {
  if (!entry.training) entry.training = {};
  if (!entry.training.done) entry.training.done = {};
  if (!entry.training.load) entry.training.load = {};
  if (!entry.training.reps) entry.training.reps = {};
  if (entry.training.duration === undefined) entry.training.duration = "";
  if (entry.training.rpe === undefined) entry.training.rpe = "";
  if (entry.training.pump === undefined) entry.training.pump = "";
  if (entry.training.strength === undefined) entry.training.strength = "";
  if (entry.training.notes === undefined) entry.training.notes = "";
  return entry.training;
}

function touchEntry(entry) {
  const now = new Date().toISOString();
  entry.updatedAt = now;
  state.updatedAt = now;
}

function standardCheckIds(day = state.selectedDay) {
  const selectedDate = addDays(state.startDate, clampDay(day) - 1);
  return [
    ...[0, 1, 2, 3, 4].map((index) => `meal-${index}`),
    ...habitChecksForDate(selectedDate).map(([id]) => id),
    "water-goal",
  ];
}

function adherenceForDay(day) {
  const entry = state.entries[String(day)];
  if (!entry || !entry.checks) return 0;
  const ids = standardCheckIds(day);
  const done = ids.filter((id) => {
    if (id === "water-goal") return waterUnits(entry) >= WATER_MIN_UNITS;
    return entry.checks[id];
  }).length;
  return Math.round((done / ids.length) * 100);
}

function waterUnits(entry) {
  const units = Number(entry?.waterUnits);
  if (Number.isFinite(units) && units > 0) return Math.min(WATER_IDEAL_UNITS, Math.floor(units));

  const liters = Number(entry?.water);
  if (!Number.isFinite(liters) || liters <= 0) return 0;
  return Math.min(WATER_IDEAL_UNITS, Math.floor(liters / WATER_STEP_LITERS));
}

function render() {
  state.selectedDay = clampDay(state.selectedDay);
  state.activeTab = validTab(state.activeTab);
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

  renderMacroCards(phase, day, selectedDate);
  renderChecks(phase, entry, selectedDate);
  renderTrainingPanel(entry, selectedDate);
  renderDailyTotals(phase, day, selectedDate);
  renderFields(entry);
  renderAlerts(entry);
  renderTimeline();
  renderWeeklyReview();
  renderSummary();
  drawChart();
  renderActiveTab();

  els.prevDayBtn.disabled = day === 1;
  els.nextDayBtn.disabled = day === TOTAL_DAYS;
}

function renderActiveTab() {
  const activeTab = validTab(state.activeTab);
  if (els.workspace) els.workspace.dataset.activeTab = activeTab;

  els.tabButtons.forEach((button) => {
    const selected = button.dataset.tab === activeTab;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });

  els.tabPanels.forEach((panel) => {
    const visible = panel.dataset.tabPanel === activeTab;
    panel.hidden = !visible;
  });
}

function setActiveTab(tab) {
  state.activeTab = validTab(tab);
  saveState({ cloud: false });
  renderActiveTab();
}

function phaseTitleForDay(phase, day) {
  if (phase.id === 1) return "Entrada controlada";
  if (phase.id === 2) return "Definição acelerada";
  if (day >= 40) return "Reta final";
  return "Carbo concentrado";
}

function renderMacroCards(phase, day, selectedDate) {
  const training = trainingForDate(selectedDate);
  const cards = [
    ["Proteína", phase.macros.proteina, "base diária"],
    ["Carbo", phase.macros.carbo, "fase atual"],
    ["Gordura", phase.macros.gordura, "hormônios e saciedade"],
    ["Kcal", phase.macros.kcal, "ponto de partida"],
    ["Cardio", phase.macros.cardio, "alvo mínimo"],
    ["Treino", training.value, training.title],
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
    return { short: "Hoje", detail: "+50-80 g carbo se performance pedir" };
  }
  if (next) {
    const distance = next - day;
    return {
      short: `D${next}`,
      detail: `em ${distance} dia${distance === 1 ? "" : "s"}`,
    };
  }
  return { short: "Livre", detail: "ajuste só por peso/cintura/performance" };
}

function trainingForDate(isoDate) {
  const weekday = fromISO(isoDate).getDay();
  const plan =
    specialTrainingDates[isoDate] ||
    (personalTrainingWeekdays.has(weekday)
      ? personalTrainingForDate(isoDate)
      : supportTrainingByWeekday[weekday] || trainingPlanByWeekday[0]);

  return {
    ...plan,
    hasTraining: plan.exercises.length > 0,
    value: plan.time,
    exercises: plan.exercises.map(([id, name, target, cue]) => ({ id, name, target, cue })),
  };
}

function personalTrainingForDate(isoDate) {
  const index = personalTrainingIndex(isoDate);
  const template = rotatingPersonalTemplates[index % rotatingPersonalTemplates.length];
  return {
    ...template,
    time: "10h",
    detail: "com personal",
    focus: `Com personal: ${template.focus}`,
    preWindow: "08h30-09h30",
    postWindow: "após 11h",
  };
}

function personalTrainingIndex(isoDate) {
  const start = fromISO(state?.startDate || PLAN_START_DATE);
  const target = fromISO(isoDate);
  let count = 0;
  const cursor = new Date(start);

  while (cursor <= target) {
    const cursorIso = toISO(cursor);
    if (personalTrainingWeekdays.has(cursor.getDay()) && !specialTrainingDates[cursorIso]) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }

  return Math.max(0, count - 1);
}

function habitChecksForDate(isoDate) {
  const training = trainingForDate(isoDate);
  const weekday = fromISO(isoDate).getDay();
  const checks = [...baseHabitChecks];

  if (training.hasTraining) {
    checks.unshift([
      "treino",
      `Treino ${training.value}`,
      `${training.title}: progressão com execução limpa.`,
    ]);
  }

  if ([1, 3, 5].includes(weekday)) {
    checks.push(["pressao", "Pressão", "Conferir e anotar se subir."]);
  }

  return checks;
}

function mealsForDate(phase, isoDate) {
  const training = trainingForDate(isoDate);
  const schedule = mealScheduleForTraining(training);

  return schedule.map(({ index, title, time }) => {
    const [baseTitle, detail] = phase.meals[index];

    return {
      id: `meal-${index}`,
      title: title || baseTitle,
      detail,
      time,
    };
  });
}

function mealScheduleForTraining(training) {
  if (training.value === "10h") {
    return [
      { index: 0, time: "07h00" },
      { index: 2, title: "Pré-treino", time: training.preWindow },
      { index: 3, title: "Pós-treino", time: training.postWindow },
      { index: 1, time: "14h00" },
      { index: 4, time: "20h00-21h00" },
    ];
  }

  if (training.value === "20h") {
    return [
      { index: 0, time: "08h00" },
      { index: 1, time: "12h30" },
      { index: 2, title: "Pré-treino", time: training.preWindow },
      { index: 3, title: "Pós-treino", time: training.postWindow },
      { index: 4, time: "22h30" },
    ];
  }

  return [
    { index: 0, time: "08h00" },
    { index: 1, time: "12h00" },
    { index: 2, title: "Refeição 3", time: "15h30" },
    { index: 3, title: "Refeição 4", time: "19h00" },
    { index: 4, time: "21h30" },
  ];
}

function focusTextForDay(day, training) {
  if (!training.hasTraining) {
    return "Sem musculação programada hoje. Mantenha dieta, caminhada leve, água e sono para não perder ritmo.";
  }

  if (day >= 31) {
    return `${training.title} às ${training.value}: concentre carbo no pré e pós, mantenha o resto do dia limpo e preserve a carga.`;
  }

  return `${training.title} às ${training.value}: cumpra pré e pós com calma, faça o cardio da fase e mantenha água alta.`;
}

function renderChecks(phase, entry, selectedDate) {
  els.mealChecks.innerHTML = mealsForDate(phase, selectedDate)
    .map((meal) => checkRow(meal.id, meal.title, meal.detail, Boolean(entry.checks[meal.id]), meal.time))
    .join("");

  els.habitChecks.innerHTML = habitChecksForDate(selectedDate)
    .map(([id, name, detail]) => checkRow(id, name, detail, Boolean(entry.checks[id])))
    .join("") + renderWaterTracker(entry, selectedDate);
}

function renderTrainingPanel(entry, selectedDate) {
  const training = trainingForDate(selectedDate);
  const trainingEntry = ensureTrainingEntry(entry);
  const completion = trainingCompletion(training, trainingEntry);

  els.trainingScore.textContent = training.hasTraining
    ? `${completion.done}/${completion.total} exercícios`
    : "recuperação";

  const exerciseRows = training.exercises.length
    ? training.exercises.map((exercise) => exerciseRow(exercise, trainingEntry)).join("")
    : `<div class="callout quiet training-rest">Caminhada leve, mobilidade e sono. Hoje o treino é chegar melhor amanhã.</div>`;

  els.trainingPlan.innerHTML = `
    <div class="training-brief">
      <div>
        <span>Horário</span>
        <strong>${training.value}</strong>
        <small>${training.detail}</small>
      </div>
      <div>
        <span>Foco</span>
        <strong>${training.title}</strong>
        <small>${training.focus}</small>
      </div>
      <div>
        <span>Janela</span>
        <strong>${training.preWindow || "livre"}</strong>
        <small>${training.postWindow || "sem pré/pós obrigatório"}</small>
      </div>
    </div>
    <div class="exercise-list">${exerciseRows}</div>
    <div class="training-log-grid">
      <label>
        <span>Duração</span>
        <input data-training-field="duration" type="number" min="0" step="1" inputmode="numeric" placeholder="min" value="${escapeHTML(trainingEntry.duration)}" />
      </label>
      <label>
        <span>RPE</span>
        <select data-training-field="rpe">
          <option value="">-</option>
          ${[6, 7, 8, 9, 10]
            .map((value) => `<option value="${value}" ${String(trainingEntry.rpe) === String(value) ? "selected" : ""}>${value}</option>`)
            .join("")}
        </select>
      </label>
      <label>
        <span>Pump</span>
        <select data-training-field="pump">
          <option value="">-</option>
          ${[1, 2, 3, 4, 5]
            .map((value) => `<option value="${value}" ${String(trainingEntry.pump) === String(value) ? "selected" : ""}>${value}</option>`)
            .join("")}
        </select>
      </label>
      <label>
        <span>Força</span>
        <select data-training-field="strength">
          <option value="">-</option>
          ${["subiu", "igual", "caiu"]
            .map((value) => `<option value="${value}" ${trainingEntry.strength === value ? "selected" : ""}>${value}</option>`)
            .join("")}
        </select>
      </label>
    </div>
    <label class="note-field training-note">
      <span>Notas do treino</span>
      <textarea data-training-field="notes" rows="3" placeholder="Carga boa, dor, pump, pressão, algo fora do normal">${escapeHTML(trainingEntry.notes)}</textarea>
    </label>
  `;
}

function exerciseRow(exercise, trainingEntry) {
  return `
    <div class="exercise-row">
      <label class="exercise-check">
        <input data-training-done="${exercise.id}" type="checkbox" ${trainingEntry.done[exercise.id] ? "checked" : ""} />
        <span>
          <span class="check-title">${exercise.name}</span>
          <span class="check-detail">${exercise.target} · ${exercise.cue}</span>
        </span>
      </label>
      <label class="exercise-input">
        <span>Carga</span>
        <input data-training-load="${exercise.id}" type="text" inputmode="decimal" placeholder="kg" value="${escapeHTML(trainingEntry.load[exercise.id])}" />
      </label>
      <label class="exercise-input">
        <span>Reps</span>
        <input data-training-reps="${exercise.id}" type="text" inputmode="numeric" placeholder="última" value="${escapeHTML(trainingEntry.reps[exercise.id])}" />
      </label>
    </div>
  `;
}

function trainingCompletion(training, trainingEntry) {
  if (!training.hasTraining) return { done: 0, total: 0, percent: null };
  const done = training.exercises.filter((exercise) => trainingEntry.done[exercise.id]).length;
  const total = training.exercises.length;
  return {
    done,
    total,
    percent: total ? Math.round((done / total) * 100) : null,
  };
}

function checkRow(id, title, detail, checked, meta = "") {
  return `
    <label class="check-row">
      <input data-check="${id}" type="checkbox" ${checked ? "checked" : ""} />
      <span>
        <span class="check-title">${title}</span>
        ${meta ? `<span class="check-time">${meta}</span>` : ""}
        <span class="check-detail">${detail}</span>
      </span>
    </label>
  `;
}

function renderWaterTracker(entry, selectedDate) {
  const units = waterUnits(entry);
  const liters = (units * WATER_STEP_LITERS).toFixed(1).replace(".", ",");
  const nextLiters = ((units + 1) * WATER_STEP_LITERS).toFixed(1).replace(".", ",");
  const percent = Math.min(100, Math.round((units / WATER_IDEAL_UNITS) * 100));
  const pace = waterPaceForDate(selectedDate);
  const marker = pace
    ? `<span class="water-progress-marker" style="left: ${pace.markerPercent}%" title="Ritmo agora: ${pace.litersLabel}"></span>`
    : "";
  const title = units >= WATER_MIN_UNITS ? "Água mínima completa" : "Água 500 ml";
  const detail =
    units >= WATER_IDEAL_UNITS
      ? "5,0 L registrados. Ideal do dia completo."
      : pace
        ? `${liters} L registrados. Ritmo agora: ~${pace.litersLabel}.`
        : units >= WATER_MIN_UNITS
          ? `${liters} L registrados. Se beber mais 500 ml, vai para ${nextLiters} L.`
          : `${liters} L de 4,0 L mínimos. Marque cada garrafa/copo de 500 ml.`;

  return `
    <label class="check-row water-row">
      <input data-water-step type="checkbox" ${units >= WATER_IDEAL_UNITS ? "checked disabled" : ""} />
      <span>
        <span class="check-title">${title}</span>
        <span class="check-detail">${detail}</span>
        <span class="water-progress" aria-label="Progresso de água">
          <span class="water-progress-fill" style="width: ${percent}%"></span>
          ${marker}
        </span>
      </span>
    </label>
  `;
}

function waterPaceForDate(selectedDate) {
  if (selectedDate !== toISO(new Date())) return null;

  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const progress =
    (minutes - WATER_PACE_START_MINUTES) / (WATER_PACE_END_MINUTES - WATER_PACE_START_MINUTES);
  const expectedUnits = Math.max(0, Math.min(WATER_IDEAL_UNITS, progress * WATER_IDEAL_UNITS));
  const roundedLiters = Math.round(expectedUnits) * WATER_STEP_LITERS;

  return {
    markerPercent: Math.min(98, Math.max(2, Math.round((expectedUnits / WATER_IDEAL_UNITS) * 100))),
    litersLabel: `${roundedLiters.toFixed(1).replace(".", ",")} L`,
  };
}

function renderDailyTotals(phase, day, selectedDate) {
  const refeedInfo = nextRefeedInfo(day);
  const training = trainingForDate(selectedDate);
  const totals = [
    ["Treino", `${training.value} · ${training.title}`],
    ["Proteína", phase.totals.proteina],
    ["Carbo", phase.totals.carbo],
    ["Gordura", phase.totals.gordura],
    ["Cardio", phase.totals.cardio],
    ["Água", phase.totals.agua],
    ["Sono", phase.totals.sono],
    ["Fibra", phase.totals.fibra],
    ["Carbo alto", `${refeedInfo.short} · ${refeedInfo.detail}`],
    ["Cálcio", phase.totals.calcio],
  ];

  els.focusBox.textContent = focusTextForDay(day, training);

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
  const medicalSignal = entry.alerts.pressaoAlta || entry.alerts.dorCabeca || entry.alerts.faltaAr;
  els.alertAdvice.className = activeCount ? "callout alert" : "callout quiet";
  els.alertAdvice.textContent = medicalSignal
    ? "Sinal importante: confira pressão, reduza a intensidade e procure atendimento se houver dor no peito, falta de ar, desmaio ou dor de cabeça forte persistente."
    : activeCount
      ? "Sinal amarelo: confira sono, água, pressão e carga de treino antes de mexer na dieta."
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
    const plannedTrainingDays = days.filter((day) => trainingForDate(addDays(state.startDate, day - 1)).hasTraining);
    const completedTrainingDays = plannedTrainingDays.filter((day) => {
      const entry = state.entries[String(day)];
      if (!entry) return false;
      const training = trainingForDate(addDays(state.startDate, day - 1));
      return trainingCompletion(training, ensureTrainingEntry(entry)).percent >= 80;
    });

    return {
      label: `${start}-${end}`,
      daysLogged: activeDays.length,
      adherence: avgAdherence === null ? "-" : `${Math.round(avgAdherence)}%`,
      weightDelta: formatDelta(weights),
      waistDelta: formatDelta(waists),
      cardio: cardioTotal ? `${cardioTotal} min` : "-",
      training: plannedTrainingDays.length ? `${completedTrainingDays.length}/${plannedTrainingDays.length}` : "-",
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
      <span>Treino</span>
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
            <span>${week.training}</span>
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
  const hasTraining = trainingHasData(entry.training);
  return Boolean(
    hasChecks ||
      hasAlerts ||
      hasTraining ||
      entry.weight ||
      entry.waist ||
      entry.sleep ||
      entry.cardioMin ||
      entry.water ||
      entry.waterUnits ||
      entry.pressure ||
      entry.restingPulse ||
      entry.energy ||
      entry.notes ||
      entry.refeed,
  );
}

function trainingHasData(training) {
  if (!training) return false;
  return Boolean(
    Object.values(training.done || {}).some(Boolean) ||
      Object.values(training.load || {}).some(Boolean) ||
      Object.values(training.reps || {}).some(Boolean) ||
      training.duration ||
      training.rpe ||
      training.pump ||
      training.strength ||
      training.notes,
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
  if (name === "water") {
    const liters = Number(field.value);
    entry.waterUnits = Number.isFinite(liters) && liters > 0 ? Math.floor(liters / WATER_STEP_LITERS) : 0;
  }
  touchEntry(entry);
  saveState();
}

function updateTrainingControl(target) {
  const entry = getEntry();
  const trainingEntry = ensureTrainingEntry(entry);

  if (target.matches("[data-training-done]")) {
    trainingEntry.done[target.dataset.trainingDone] = target.checked;
    const training = trainingForDate(addDays(state.startDate, state.selectedDay - 1));
    const completion = trainingCompletion(training, trainingEntry);
    entry.checks.treino = completion.percent !== null && completion.percent >= 80;
  }

  if (target.matches("[data-training-load]")) {
    trainingEntry.load[target.dataset.trainingLoad] = target.value;
  }

  if (target.matches("[data-training-reps]")) {
    trainingEntry.reps[target.dataset.trainingReps] = target.value;
  }

  if (target.matches("[data-training-field]")) {
    trainingEntry[target.dataset.trainingField] = target.value;
  }

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

  if (target.matches("[data-training-done], [data-training-field]")) {
    updateTrainingControl(target);
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

  if (target.matches("[data-water-step]")) {
    const entry = getEntry();
    const units = Math.min(WATER_IDEAL_UNITS, waterUnits(entry) + 1);
    entry.waterUnits = units;
    entry.water = (units * WATER_STEP_LITERS).toFixed(1);
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
  if (target.matches("[data-training-load], [data-training-reps], [data-training-field]")) {
    updateTrainingControl(target);
    renderWeeklyReview();
    renderSummary();
    return;
  }

  if (!target.matches("[data-field]") || target.type === "checkbox") return;
  updateField(target);
  renderSummary();
  drawChart();
});

els.tabButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tab));
});

document.addEventListener("keydown", (event) => {
  const currentButton = event.target.closest?.("[data-tab]");
  if (!currentButton || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;

  const buttons = Array.from(els.tabButtons);
  const currentIndex = buttons.indexOf(currentButton);
  const direction = event.key === "ArrowRight" ? 1 : -1;
  const nextButton = buttons[(currentIndex + direction + buttons.length) % buttons.length];

  event.preventDefault();
  nextButton.focus();
  setActiveTab(nextButton.dataset.tab);
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
