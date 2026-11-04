import { useCallback, useEffect, useState } from "react";
import { analyzeMatrix, DEMO_INPUT, type MatrixDesign } from "./podi-engine";

const KEY = "podi-matrix:designs";
const STORE_EVENT = "podi-store";
const STORAGE_VERSION = 1 as const;
const EXPORT_FORMAT = "podi-matrix-design" as const;

type StoredSnapshot = {
  version: typeof STORAGE_VERSION;
  designs: MatrixDesign[];
};

type ReadResult = {
  designs: MatrixDesign[];
  error: string | null;
  hasStoredValue: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMatrixDesign(value: unknown): value is MatrixDesign {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.createdAt === "string" &&
    isRecord(value.input) &&
    isRecord(value.baseline) &&
    isRecord(value.designed) &&
    Array.isArray(value.offNoteMap) &&
    Array.isArray(value.routes) &&
    Array.isArray(value.podi)
  );
}

function parseDesigns(value: unknown): MatrixDesign[] {
  if (!Array.isArray(value) || !value.every(isMatrixDesign)) {
    throw new Error("Saved matrix data has an unsupported shape.");
  }
  return value;
}

function read(): ReadResult {
  if (typeof window === "undefined") {
    return { designs: [], error: null, hasStoredValue: false };
  }

  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { designs: [], error: null, hasStoredValue: false };

    const parsed: unknown = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return { designs: parseDesigns(parsed), error: null, hasStoredValue: true };
    }

    if (!isRecord(parsed) || parsed.version !== STORAGE_VERSION) {
      throw new Error("Saved matrix data uses an unsupported storage version.");
    }

    return {
      designs: parseDesigns(parsed.designs),
      error: null,
      hasStoredValue: true,
    };
  } catch {
    return {
      designs: [],
      error: "Saved matrix data could not be read. Exported backups can be imported after the store is repaired.",
      hasStoredValue: true,
    };
  }
}

function write(list: MatrixDesign[]): string | null {
  if (typeof window === "undefined") return null;

  try {
    const snapshot: StoredSnapshot = { version: STORAGE_VERSION, designs: list };
    window.localStorage.setItem(KEY, JSON.stringify(snapshot));
    window.dispatchEvent(new Event(STORE_EVENT));
    return null;
  } catch {
    return "Matrix changes could not be saved. Check available browser storage and export your work as a backup.";
  }
}

export function exportMatrixDesign(design: MatrixDesign): string {
  return JSON.stringify(
    {
      format: EXPORT_FORMAT,
      version: STORAGE_VERSION,
      design,
    },
    null,
    2,
  );
}

export function importMatrixDesign(serialized: string): MatrixDesign {
  const parsed: unknown = JSON.parse(serialized);

  if (
    !isRecord(parsed) ||
    parsed.format !== EXPORT_FORMAT ||
    parsed.version !== STORAGE_VERSION ||
    !isMatrixDesign(parsed.design)
  ) {
    throw new Error("This file is not a compatible PMatrix design export.");
  }

  return parsed.design;
}

function seed(): MatrixDesign[] {
  return [
    analyzeMatrix(DEMO_INPUT, "koji"),
    analyzeMatrix(
      {
        ...DEMO_INPUT,
        name: "Soy patty — beef-like savory",
        base: "Soy Protein",
        target: "Plant-Based Patty",
        direction: "Beef-like savory",
        attributes: ["Umami", "Kokumi", "Fatty", "Smoky"],
        cooking: "Grill",
      },
      "bacillus",
    ),
    analyzeMatrix(
      {
        ...DEMO_INPUT,
        name: "Oat-base cheese alternative",
        base: "Chickpea Protein",
        target: "Dairy Alternative",
        direction: "Cheese-like",
        offNotes: ["Bitter", "Flat"],
        attributes: ["Fermented", "Kokumi", "Umami"],
        cooking: "No-cook / cold application",
      },
      "lab",
    ),
  ];
}

export function useMatrixStore() {
  const [designs, setDesigns] = useState<MatrixDesign[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const result = read();

      if (result.error) {
        setDesigns([]);
        setError(result.error);
        setReady(true);
        return;
      }

      let list = result.designs;
      let writeError: string | null = null;

      if (!result.hasStoredValue) {
        list = seed();
        writeError = write(list);
      }

      setDesigns(list);
      setError(writeError);
      setReady(true);
    };

    sync();
    window.addEventListener(STORE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(STORE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const save = useCallback((design: MatrixDesign) => {
    const result = read();
    if (result.error) {
      setError(result.error);
      return false;
    }

    const next = [design, ...result.designs.filter((item) => item.id !== design.id)];
    const writeError = write(next);
    setError(writeError);
    return writeError === null;
  }, []);

  const remove = useCallback((id: string) => {
    const result = read();
    if (result.error) {
      setError(result.error);
      return false;
    }

    const writeError = write(result.designs.filter((item) => item.id !== id));
    setError(writeError);
    return writeError === null;
  }, []);

  return { designs, ready, error, save, remove };
}
