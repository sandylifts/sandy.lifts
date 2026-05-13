"use client";

interface DualScaleTableProps {
  bmi: number;
  selectedScale: "who" | "indian";
  onScaleChange: (scale: "who" | "indian") => void;
}

interface Category {
  label: string;
  whoRange: string;
  indianRange: string;
  whoMin: number;
  whoMax: number;
  indianMin: number;
  indianMax: number;
  color: string;
}

const CATEGORIES: Category[] = [
  {
    label: "Underweight",
    whoRange: "< 18.5",
    indianRange: "< 18.5",
    whoMin: 0,
    whoMax: 18.49,
    indianMin: 0,
    indianMax: 18.49,
    color: "#60ADC7",
  },
  {
    label: "Normal",
    whoRange: "18.5 – 24.9",
    indianRange: "18.5 – 22.9",
    whoMin: 18.5,
    whoMax: 24.99,
    indianMin: 18.5,
    indianMax: 22.99,
    color: "#4ade80",
  },
  {
    label: "Overweight",
    whoRange: "25.0 – 29.9",
    indianRange: "23.0 – 24.9",
    whoMin: 25.0,
    whoMax: 29.99,
    indianMin: 23.0,
    indianMax: 24.99,
    color: "#fbbf24",
  },
  {
    label: "Obese",
    whoRange: "≥ 30.0",
    indianRange: "≥ 25.0",
    whoMin: 30.0,
    whoMax: Infinity,
    indianMin: 25.0,
    indianMax: Infinity,
    color: "#ef4444",
  },
];

function getCategoryForBMI(bmi: number, scale: "who" | "indian"): string {
  for (const cat of CATEGORIES) {
    const min = scale === "who" ? cat.whoMin : cat.indianMin;
    const max = scale === "who" ? cat.whoMax : cat.indianMax;
    if (bmi >= min && bmi <= max) return cat.label;
  }
  return "Unknown";
}

function getCategoryColor(label: string): string {
  return CATEGORIES.find((c) => c.label === label)?.color ?? "#9A9EC4";
}

export function DualScaleTable({ bmi, selectedScale, onScaleChange }: DualScaleTableProps) {
  const whoCategory = getCategoryForBMI(bmi, "who");
  const indianCategory = getCategoryForBMI(bmi, "indian");
  const showCallout = whoCategory === "Normal" && indianCategory !== "Normal";

  return (
    <div className="flex flex-col gap-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.08)]">
        <table className="w-full min-w-[360px] text-[13px]">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.08)]">
              <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[2px] uppercase text-[#6B6F9A]">
                Category
              </th>
              <th className="text-center px-4 py-3 text-[10px] font-bold tracking-[2px] uppercase text-[#6B6F9A]">
                WHO (Global)
              </th>
              <th className="text-center px-4 py-3 text-[10px] font-bold tracking-[2px] uppercase text-[#C69FF5]">
                Asian Indian
              </th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((cat) => {
              const isWhoMatch = cat.label === whoCategory;
              const isIndianMatch = cat.label === indianCategory;
              const rowHighlight = isWhoMatch || isIndianMatch;

              return (
                <tr
                  key={cat.label}
                  className={`border-b border-[rgba(255,255,255,0.05)] transition-colors duration-200 ${
                    rowHighlight ? "bg-[rgba(255,255,255,0.04)]" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-[#D8DBFC]">{cat.label}</td>

                  {/* WHO */}
                  <td className="px-4 py-3 text-center">
                    {isWhoMatch ? (
                      <span
                        className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.5px]"
                        style={{
                          background: `${cat.color}22`,
                          color: cat.color,
                          border: `1px solid ${cat.color}55`,
                        }}
                      >
                        {cat.whoRange} ← YOU
                      </span>
                    ) : (
                      <span className="text-[#6B6F9A]">{cat.whoRange}</span>
                    )}
                  </td>

                  {/* Indian */}
                  <td className="px-4 py-3 text-center">
                    {isIndianMatch ? (
                      <span
                        className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.5px]"
                        style={{
                          background: `${cat.color}22`,
                          color: cat.color,
                          border: `1px solid ${cat.color}55`,
                        }}
                      >
                        {cat.indianRange} ← YOU
                      </span>
                    ) : (
                      <span className="text-[#6B6F9A]">{cat.indianRange}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Divergence Callout */}
      {showCallout && (
        <div className="rounded-xl border border-[rgba(251,191,36,0.3)] bg-[rgba(251,191,36,0.06)] p-4">
          <div className="flex items-start gap-3">
            <span className="text-[18px] shrink-0">⚠️</span>
            <div>
              <p className="text-[13px] font-semibold text-[#fbbf24] mb-1">
                Your WHO result looks fine — but the data tells a different story.
              </p>
              <p className="text-[13px] text-[#9A9EC4] leading-[1.7]">
                By Indian-specific research, your metabolic risk is already elevated at this BMI. South
                Asians develop type 2 diabetes and cardiovascular disease at significantly lower BMI
                values than the WHO global average suggests.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scale Toggle */}
      <div>
        <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#6B6F9A] mb-2">
          Scale to use for NEAT calculation
        </p>
        <div className="flex gap-2">
          {(["who", "indian"] as const).map((scale) => (
            <button
              key={scale}
              onClick={() => onScaleChange(scale)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-[13px] font-semibold border transition-all duration-200 ${
                selectedScale === scale
                  ? scale === "indian"
                    ? "bg-[rgba(198,159,245,0.15)] border-[rgba(198,159,245,0.5)] text-[#C69FF5]"
                    : "bg-[rgba(195,252,254,0.1)] border-[rgba(195,252,254,0.4)] text-[#C3FCFE]"
                  : "bg-transparent border-[rgba(255,255,255,0.1)] text-[#6B6F9A] hover:border-[rgba(255,255,255,0.2)] hover:text-[#9A9EC4]"
              }`}
            >
              {scale === "who" ? "Use WHO Scale" : "Use Asian Indian Scale"}
            </button>
          ))}
        </div>
      </div>

      {/* BMI Category Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] p-3 text-center">
          <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#6B6F9A] mb-1">
            WHO Result
          </p>
          <p
            className="text-[15px] font-bold"
            style={{ color: getCategoryColor(whoCategory) }}
          >
            {whoCategory}
          </p>
        </div>
        <div className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(198,159,245,0.15)] p-3 text-center">
          <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#C69FF5] mb-1">
            Indian Scale Result
          </p>
          <p
            className="text-[15px] font-bold"
            style={{ color: getCategoryColor(indianCategory) }}
          >
            {indianCategory}
          </p>
        </div>
      </div>
    </div>
  );
}

export { getCategoryForBMI };
