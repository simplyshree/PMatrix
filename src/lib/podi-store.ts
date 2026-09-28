import { useCallback, useEffect, useState } from "react";
import { analyzeMatrix, DEMO_INPUT, type MatrixDesign } from "./podi-engine";

const KEY = "podi-matrix:designs";

function read(): MatrixDesign[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MatrixDesign[];
  } catch {
    return [];
  }
}

function write(list: MatrixDesign[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("podi-store"));
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

  useEffect(() => {
    const sync = () => {
      let list = read();
      if (list.length === 0) {
        list = seed();
        window.localStorage.setItem(KEY, JSON.stringify(list));
      }
      setDesigns(list);
      setReady(true);
    };
    sync();
    window.addEventListener("podi-store", sync);
    return () => window.removeEventListener("podi-store", sync);
  }, []);

  const save = useCallback((design: MatrixDesign) => {
    const list = read();
    const next = [design, ...list.filter((d) => d.id !== design.id)];
    write(next);
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((d) => d.id !== id));
  }, []);

  return { designs, ready, save, remove };
}
