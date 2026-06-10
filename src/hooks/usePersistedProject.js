import { useEffect, useMemo, useState } from 'react';
import { exampleProject, STORAGE_KEY } from '../data/exampleProject';

function loadInitialProject() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return exampleProject;

    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed?.items) && Array.isArray(parsed?.bom) && Array.isArray(parsed?.demands)) {
      return {
        horizon: parsed.horizon ?? exampleProject.horizon,
        items: parsed.items,
        bom: parsed.bom,
        demands: parsed.demands
      };
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return exampleProject;
}

export function usePersistedProject() {
  const initialProject = useMemo(loadInitialProject, []);
  const [horizon, setHorizon] = useState(initialProject.horizon);
  const [items, setItems] = useState(initialProject.items);
  const [bom, setBom] = useState(initialProject.bom);
  const [demands, setDemands] = useState(initialProject.demands);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ horizon, items, bom, demands }));
  }, [horizon, items, bom, demands]);

  return {
    horizon,
    setHorizon,
    items,
    setItems,
    bom,
    setBom,
    demands,
    setDemands
  };
}
