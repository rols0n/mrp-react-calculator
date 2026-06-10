export const STORAGE_KEY = 'mrp-react-uek-project-v3';

export const blankItem = {
  name: '',
  type: 'Półprodukt',
  leadTime: 1,
  initialStock: 0,
  safetyStock: 0,
  lotSize: 1
};

export const exampleProject = {
  horizon: 12,
  items: [
    { id: 'bike', name: 'Rower MTB', type: 'Produkt końcowy', leadTime: 1, initialStock: 0, safetyStock: 0, lotSize: 1 },
    { id: 'frame', name: 'Rama', type: 'Półprodukt', leadTime: 2, initialStock: 5, safetyStock: 2, lotSize: 5 },
    { id: 'wheel', name: 'Koło', type: 'Półprodukt', leadTime: 1, initialStock: 8, safetyStock: 4, lotSize: 10 },
    { id: 'rim', name: 'Obręcz', type: 'Materiał', leadTime: 2, initialStock: 20, safetyStock: 5, lotSize: 10 },
    { id: 'tire', name: 'Opona', type: 'Materiał', leadTime: 1, initialStock: 12, safetyStock: 6, lotSize: 10 }
  ],
  bom: [
    { id: 'bom-1', parentId: 'bike', childId: 'frame', qty: 1 },
    { id: 'bom-2', parentId: 'bike', childId: 'wheel', qty: 2 },
    { id: 'bom-3', parentId: 'wheel', childId: 'rim', qty: 1 },
    { id: 'bom-4', parentId: 'wheel', childId: 'tire', qty: 1 }
  ],
  demands: [
    { id: 'demand-1', itemId: 'bike', day: 6, qty: 10 },
    { id: 'demand-2', itemId: 'bike', day: 9, qty: 5 }
  ]
};
