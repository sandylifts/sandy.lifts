// Pure function — no hooks, no "use client" — runs on server or client
// Replaces useHandoffParams hook for server-side usage

export interface HandoffPrefilled {
  weight:   string;
  height:   string;
  age:      string;
  gender:   "male" | "female";
  activity: string;
}

export interface HandoffState {
  isHandoff: boolean;
  prefilled: Partial<HandoffPrefilled>;
  neatScore: number;
}

type RawParams = { [key: string]: string | string[] | undefined };

function get(params: RawParams, key: string): string {
  const v = params[key];
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

function validWeight(v: number) { return v >= 30 && v <= 250; }
function validHeight(v: number) { return v >= 100 && v <= 250; }
function validAge(v: number)    { return v >= 10 && v <= 100; }
function validGender(v: string): v is "male" | "female" {
  return v === "male" || v === "female";
}
const VALID_ACTIVITY = new Set(["sedentary", "light", "moderate", "active", "very"]);

export function parseHandoffParams(params: RawParams): HandoffState {
  const from = get(params, "from");
  if (from !== "neat") return { isHandoff: false, prefilled: {}, neatScore: 0 };

  const w   = parseFloat(get(params, "w"));
  const h   = parseFloat(get(params, "h"));
  const a   = parseInt(get(params, "a"));
  const g   = get(params, "g");
  const act = get(params, "act") || "moderate";
  const neat = parseInt(get(params, "neat") || "0");

  if (!validWeight(w) || !validHeight(h) || !validAge(a) || !validGender(g)) {
    return { isHandoff: false, prefilled: {}, neatScore: 0 };
  }

  return {
    isHandoff: true,
    prefilled: {
      weight:   String(Math.round(w)),
      height:   String(Math.round(h)),
      age:      String(a),
      gender:   g,
      activity: VALID_ACTIVITY.has(act) ? act : "moderate",
    },
    neatScore: isNaN(neat) || neat < 0 ? 0 : neat,
  };
}
