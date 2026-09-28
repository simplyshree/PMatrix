/**
 * PODI MATRIX flavor-engineering model.
 *
 * Deterministic, rule-based mapping from matrix inputs to a hypothesised
 * flavor fingerprint, off-note contributors, a fermentation route and a
 * podi (dry matrix) formulation. All outputs are hypotheses and are labelled
 * as requiring laboratory and sensory validation.
 */

export const PROTEIN_BASES = [
  "Pea Protein",
  "Soy Protein",
  "Wheat Gluten",
  "Chickpea Protein",
  "Lentil Protein",
  "Mycoprotein",
  "Custom Blend",
] as const;

export const TARGET_FOODS = [
  "Plant-Based Mince",
  "Plant-Based Patty",
  "Dairy Alternative",
  "Egg Alternative",
  "Seafood Alternative",
  "Other",
] as const;

export const FLAVOR_DIRECTIONS = [
  "Beef-like savory",
  "Chicken-like savory",
  "Deep roasted savory",
  "Smoky",
  "Egg-like",
  "Cheese-like",
  "Seafood-like",
  "Custom",
] as const;

export const OFF_NOTES = [
  "Beany",
  "Bitter",
  "Green",
  "Astringent",
  "Metallic",
  "Flat",
  "Excessive fermentation",
] as const;

export const ATTRIBUTES = [
  "Umami",
  "Kokumi",
  "Roasted",
  "Fatty",
  "Sulfurous",
  "Smoky",
  "Fermented",
  "Sweet-savory",
  "Fresh",
] as const;

export const COOKING_METHODS = [
  "Pan-fry",
  "Grill",
  "Bake / oven",
  "Steam",
  "Sous-vide",
  "No-cook / cold application",
] as const;

export const PROCESS_CONSTRAINTS = [
  "Clean label only",
  "No added yeast extract",
  "Allergen: no soy",
  "Allergen: no gluten",
  "Low sodium",
  "High-moisture extrusion compatible",
  "Retort stable",
] as const;

export type ProteinBase = (typeof PROTEIN_BASES)[number];
export type TargetFood = (typeof TARGET_FOODS)[number];
export type FlavorDirection = (typeof FLAVOR_DIRECTIONS)[number];
export type CookingMethod = (typeof COOKING_METHODS)[number];

export interface MatrixInput {
  name: string;
  base: ProteinBase;
  target: TargetFood;
  direction: FlavorDirection;
  offNotes: string[];
  attributes: string[];
  cooking: CookingMethod;
  constraints: string[];
  costTarget: number; // USD / kg of finished podi
}

export const AXES = [
  "Umami",
  "Kokumi",
  "Roasted",
  "Sulfurous",
  "Fatty",
  "Smoky",
  "Fermented",
  "Sweet-savory",
  "Green / off-note",
  "Bitter",
] as const;

export type Axis = (typeof AXES)[number];
export type Fingerprint = Record<Axis, number>;

export interface OffNoteEntry {
  note: string;
  mechanism: string;
  confidence: "Low" | "Moderate" | "High";
  mitigation: string;
}

export interface FermentationRoute {
  id: string;
  organism: string;
  kind: string;
  rationale: string;
  capabilities: string[];
  params: { label: string; value: string }[];
  caution: string;
}

export interface PodiComponent {
  component: string;
  role: string;
  percent: number;
  release: "Immediate" | "Thermal" | "Late / finish";
}

export interface MatrixDesign {
  id: string;
  createdAt: string;
  input: MatrixInput;
  baseline: Fingerprint;
  designed: Fingerprint;
  offNoteMap: OffNoteEntry[];
  hypothesis: string;
  routes: FermentationRoute[];
  selectedRouteId: string;
  podi: PodiComponent[];
  costEstimate: number;
  similarityIndex: number;
  precursors: { label: string; before: number; after: number }[];
}

const clamp = (n: number) => Math.max(0, Math.min(10, Math.round(n * 10) / 10));

const BASE_PROFILE: Record<string, Partial<Fingerprint>> = {
  "Pea Protein": { "Green / off-note": 7.6, Bitter: 6.2, Umami: 2.4, Fatty: 3.1 },
  "Soy Protein": { "Green / off-note": 6.4, Bitter: 5.0, Umami: 3.6, Fermented: 2.2 },
  "Wheat Gluten": { "Green / off-note": 3.2, Bitter: 3.4, Umami: 3.0, Roasted: 2.6 },
  "Chickpea Protein": { "Green / off-note": 6.0, Bitter: 4.4, "Sweet-savory": 3.6 },
  "Lentil Protein": { "Green / off-note": 6.8, Bitter: 5.6, Umami: 2.8 },
  Mycoprotein: { "Green / off-note": 3.0, Bitter: 3.0, Umami: 4.6, Kokumi: 3.2 },
  "Custom Blend": { "Green / off-note": 5.5, Bitter: 4.5, Umami: 3.0 },
};

const DIRECTION_TARGET: Record<string, Partial<Fingerprint>> = {
  "Beef-like savory": { Umami: 9.0, Kokumi: 8.4, Roasted: 8.2, Fatty: 7.6, Sulfurous: 6.4 },
  "Chicken-like savory": { Umami: 8.0, Kokumi: 6.8, Fatty: 7.2, Sulfurous: 5.2, Roasted: 6.0 },
  "Deep roasted savory": { Umami: 8.6, Roasted: 9.0, Kokumi: 7.8, Sulfurous: 5.8, Smoky: 5.0 },
  Smoky: { Smoky: 9.0, Roasted: 7.6, Umami: 7.2, Fatty: 5.6 },
  "Egg-like": { Sulfurous: 8.6, Umami: 6.4, Fatty: 6.0, Kokumi: 5.4 },
  "Cheese-like": { Fermented: 8.8, Kokumi: 7.8, Umami: 7.6, Fatty: 6.8 },
  "Seafood-like": { Umami: 7.8, Sulfurous: 5.0, Fermented: 6.4, "Sweet-savory": 5.6 },
  Custom: { Umami: 7.5, Kokumi: 6.5, Roasted: 6.0 },
};

const OFF_NOTE_LIBRARY: Record<string, Omit<OffNoteEntry, "note">> = {
  Beany: {
    mechanism: "Hexanal / nonanal-type volatiles associated with lipoxygenase activity on unsaturated lipids",
    confidence: "Moderate",
    mitigation: "Enzymatic / microbial reduction of aldehyde pool plus masking via Maillard-derived aroma",
  },
  Green: {
    mechanism: "C6 aldehyde and alcohol families associated with lipid oxidation pathways",
    confidence: "Moderate",
    mitigation: "Controlled fermentation to convert aldehydes to less odour-active alcohols/acids",
  },
  Bitter: {
    mechanism: "Hydrophobic peptides, saponins and phenolic matrix contributors",
    confidence: "Moderate",
    mitigation: "Debittering proteolysis profile plus kokumi peptide counterbalance",
  },
  Astringent: {
    mechanism: "Polyphenol–protein interaction at the oral surface",
    confidence: "Low",
    mitigation: "Lipid/hydrocolloid carrier in the podi matrix to reduce mouth-surface binding",
  },
  Metallic: {
    mechanism: "Trace metal-catalysed lipid oxidation products; possible ferrous interaction",
    confidence: "Low",
    mitigation: "Chelation strategy and antioxidant-active fermentation metabolites",
  },
  Flat: {
    mechanism: "Insufficient free amino acid and nucleotide pool for savory perception",
    confidence: "High",
    mitigation: "Proteolytic precursor build-up prior to thermal aroma generation",
  },
  "Excessive fermentation": {
    mechanism: "Over-accumulation of organic acids and short-chain fatty acids",
    confidence: "Moderate",
    mitigation: "Shortened bioconversion window with defined end-point pH control",
  },
};

function buildFingerprint(partial: Partial<Fingerprint>, fill: number): Fingerprint {
  const out = {} as Fingerprint;
  for (const axis of AXES) out[axis] = clamp(partial[axis] ?? fill);
  return out;
}

export function analyzeMatrix(input: MatrixInput, selectedRouteId?: string): MatrixDesign {
  const baseline = buildFingerprint(BASE_PROFILE[input.base] ?? {}, 2.2);
  for (const note of input.offNotes) {
    if (note === "Beany" || note === "Green") baseline["Green / off-note"] = clamp(baseline["Green / off-note"] + 1.2);
    if (note === "Bitter" || note === "Astringent") baseline.Bitter = clamp(baseline.Bitter + 1.2);
    if (note === "Flat") baseline.Umami = clamp(baseline.Umami - 1.0);
    if (note === "Excessive fermentation") baseline.Fermented = clamp(baseline.Fermented + 3.0);
  }

  const target = buildFingerprint(DIRECTION_TARGET[input.direction] ?? {}, 3.0);
  const designed = { ...target };
  for (const attr of input.attributes) {
    const axis = (attr === "Fresh" ? "Sweet-savory" : attr) as Axis;
    if (AXES.includes(axis)) designed[axis] = clamp(designed[axis] + 1.4);
  }
  designed["Green / off-note"] = clamp(baseline["Green / off-note"] * 0.28);
  designed.Bitter = clamp(baseline.Bitter * 0.34);
  if (input.constraints.includes("No added yeast extract")) designed.Umami = clamp(designed.Umami - 0.6);
  if (input.constraints.includes("Low sodium")) designed.Kokumi = clamp(designed.Kokumi + 0.4);
  if (input.cooking === "No-cook / cold application") {
    designed.Roasted = clamp(designed.Roasted * 0.45);
    designed.Fermented = clamp(designed.Fermented + 1.0);
  }
  if (input.cooking === "Grill" || input.cooking === "Pan-fry") designed.Roasted = clamp(designed.Roasted + 0.8);

  const offNoteMap: OffNoteEntry[] = (input.offNotes.length ? input.offNotes : ["Flat"]).map((note) => ({
    note,
    ...(OFF_NOTE_LIBRARY[note] ?? OFF_NOTE_LIBRARY.Flat),
  }));

  const routes = recommendRoutes(input);
  const routeId = selectedRouteId && routes.some((r) => r.id === selectedRouteId) ? selectedRouteId : routes[0].id;

  const hypothesis = `The ${input.base.toLowerCase()} matrix shows a strong ${
    baseline["Green / off-note"] > 5 ? "green / vegetal" : "neutral but flat"
  } signature with limited savory depth (baseline umami ${baseline.Umami.toFixed(1)}/10). The proposed strategy increases precursor availability — free amino acids, reducing sugars and lipid-derived intermediates — so that Maillard and Strecker chemistry during ${input.cooking.toLowerCase()} can express a ${input.direction.toLowerCase()} trajectory, while bioconversion lowers undesirable volatile intensity. This is a hypothesised flavor trajectory and requires laboratory and sensory validation.`;

  const podi = buildPodi(input, routeId);
  const costEstimate = Math.round(podi.reduce((acc, c) => acc + c.percent * 0.17, 0) * 100) / 100;

  const deltaTotal = AXES.reduce((acc, a) => acc + Math.abs(designed[a] - target[a]), 0);
  const similarityIndex = Math.max(52, Math.min(94, Math.round(94 - deltaTotal * 1.6)));

  return {
    id: `matrix_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    input,
    baseline,
    designed,
    offNoteMap,
    hypothesis,
    routes,
    selectedRouteId: routeId,
    podi,
    costEstimate,
    similarityIndex,
    precursors: [
      { label: "Free amino acids", before: 18, after: 74 },
      { label: "Low-MW peptides", before: 22, after: 68 },
      { label: "Reducing sugars", before: 12, after: 55 },
      { label: "Lipid-derived precursors", before: 30, after: 47 },
      { label: "Green volatile load", before: 71, after: 24 },
    ],
  };
}

function recommendRoutes(input: MatrixInput): FermentationRoute[] {
  const cleanLabel = input.constraints.includes("Clean label only");
  const all: FermentationRoute[] = [
    {
      id: "koji",
      organism: "Aspergillus oryzae",
      kind: "Koji-like solid-state fermentation",
      rationale:
        "Enzyme-rich route for generating a broad free amino acid and reducing sugar pool — the precursor base for roasted and umami trajectories.",
      capabilities: ["Proteolysis", "Carbohydrate conversion", "Precursor generation", "Flavor development"],
      params: [
        { label: "Substrate", value: `${input.base} + starch carrier` },
        { label: "Temperature", value: "30 °C" },
        { label: "Duration", value: "44–48 h" },
        { label: "Moisture", value: "38–42 %" },
        { label: "End point", value: "Free amino nitrogen target" },
      ],
      caution: "Requires controlled process development and strain-specific validation.",
    },
    {
      id: "bacillus",
      organism: "Bacillus subtilis",
      kind: "Submerged / solid-state savory bioconversion",
      rationale: "Potential savory and fermented character development with strong proteolytic capacity.",
      capabilities: ["Deep proteolysis", "Peptide generation", "Fermented character"],
      params: [
        { label: "Temperature", value: "37 °C" },
        { label: "Duration", value: "24–36 h" },
        { label: "pH window", value: "6.8 → 7.6" },
        { label: "Aeration", value: "Controlled" },
      ],
      caution: "Requires controlled process development and strain-specific validation; ammoniacal notes possible if over-run.",
    },
    {
      id: "lab",
      organism: "Lactic acid bacteria",
      kind: "Acidification and selected flavor development",
      rationale: "Acidification, off-note reduction and dairy-adjacent fermented character.",
      capabilities: ["Acidification", "Aldehyde reduction", "Fermented notes"],
      params: [
        { label: "Temperature", value: "32 °C" },
        { label: "Duration", value: "18–24 h" },
        { label: "End-point pH", value: "4.8" },
      ],
      caution: "End-point pH control needed to avoid excessive fermented character.",
    },
    {
      id: "rhizopus",
      organism: "Rhizopus spp.",
      kind: "Solid-state substrate transformation",
      rationale: "Enzyme-mediated substrate transformation with textural and mild savory contribution.",
      capabilities: ["Solid-state growth", "Lipase / protease activity", "Substrate restructuring"],
      params: [
        { label: "Temperature", value: "30 °C" },
        { label: "Duration", value: "36 h" },
        { label: "Moisture", value: "45 %" },
      ],
      caution: "Sporulation control required for consistent sensory outcome.",
    },
    {
      id: "enzyme",
      organism: "Enzyme-only route",
      kind: "Non-living enzymatic conversion",
      rationale: "Living-organism-free option where process or regulatory constraints require it.",
      capabilities: ["Endo/exo-protease cascade", "Amylase conversion", "Defined end point"],
      params: [
        { label: "Temperature", value: "55 °C" },
        { label: "Duration", value: "4–6 h" },
        { label: "Inactivation", value: "85 °C / 10 min" },
      ],
      caution: "Narrower aroma outcome than microbial routes; precursor-focused rather than aroma-forming.",
    },
  ];

  const score = (r: FermentationRoute) => {
    let s = 0;
    if (["Deep roasted savory", "Beef-like savory", "Chicken-like savory"].includes(input.direction) && r.id === "koji") s += 5;
    if (input.direction === "Cheese-like" && r.id === "lab") s += 5;
    if (input.direction === "Egg-like" && r.id === "bacillus") s += 4;
    if (input.direction === "Seafood-like" && r.id === "lab") s += 3;
    if (input.offNotes.includes("Excessive fermentation") && r.id === "enzyme") s += 3;
    if (input.constraints.includes("Clean label only") && r.id === "koji") s += 2;
    if (cleanLabel && r.id === "enzyme") s -= 1;
    return s;
  };
  return [...all].sort((a, b) => score(b) - score(a));
}

function buildPodi(input: MatrixInput, routeId: string): PodiComponent[] {
  const fermentName =
    routeId === "koji"
      ? "Koji-fermented protein concentrate"
      : routeId === "bacillus"
        ? "Bacillus-bioconverted protein base"
        : routeId === "lab"
          ? "LAB-fermented protein base"
          : routeId === "rhizopus"
            ? "Rhizopus solid-state ferment"
            : "Enzyme-hydrolysed protein base";

  const rows: PodiComponent[] = [
    { component: fermentName, role: "Precursor pool — amino acids & peptides", percent: 34, release: "Thermal" },
    { component: "Reducing sugar carrier (roasted cereal)", role: "Maillard partner", percent: 14, release: "Thermal" },
    { component: "Toasted legume-lentil podi base", role: "Body, texture, roast character", percent: 16, release: "Immediate" },
    { component: "Allium fraction (roasted)", role: "Sulfurous depth", percent: 8, release: "Thermal" },
    { component: "Lipid micro-carrier", role: "Fat-associated aroma release", percent: 9, release: "Late / finish" },
    { component: "Kokumi peptide fraction", role: "Continuity and long finish", percent: 6, release: "Late / finish" },
    { component: "Spice / aroma top notes", role: "Front-end aroma", percent: 7, release: "Immediate" },
    { component: "Mineral & pH modifier", role: "Matrix control", percent: 6, release: "Immediate" },
  ];

  if (input.attributes.includes("Smoky")) rows.push({ component: "Cold-smoked cereal fraction", role: "Smoky layer", percent: 4, release: "Immediate" });
  if (input.constraints.includes("Low sodium")) rows.push({ component: "Potassium-salt replacer blend", role: "Saltiness without sodium load", percent: 3, release: "Immediate" });

  const total = rows.reduce((a, r) => a + r.percent, 0);
  return rows.map((r) => ({ ...r, percent: Math.round((r.percent / total) * 1000) / 10 }));
}

export const DEMO_INPUT: MatrixInput = {
  name: "Pea mince — deep roasted savory",
  base: "Pea Protein",
  target: "Plant-Based Mince",
  direction: "Deep roasted savory",
  offNotes: ["Green", "Beany", "Bitter"],
  attributes: ["Umami", "Roasted", "Kokumi", "Sulfurous", "Fatty"],
  cooking: "Pan-fry",
  constraints: ["Clean label only"],
  costTarget: 12,
};

export function cookingRelease(cooking: CookingMethod) {
  const curves: Record<string, number[]> = {
    "Pan-fry": [12, 34, 68, 88, 96],
    Grill: [10, 30, 72, 92, 97],
    "Bake / oven": [8, 26, 54, 78, 90],
    Steam: [18, 40, 58, 66, 70],
    "Sous-vide": [20, 38, 50, 58, 62],
    "No-cook / cold application": [42, 52, 58, 60, 61],
  };
  const values = curves[cooking] ?? curves["Pan-fry"];
  return values.map((v, i) => ({ stage: ["0 min", "1 min", "3 min", "6 min", "10 min"][i], release: v }));
}
