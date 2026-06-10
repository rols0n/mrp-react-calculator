import { useMemo, useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

import StatCard from './components/dashboard/StatCard';
import MiniBars from './components/dashboard/MiniBars';

import Panel from './components/common/Panel';
import ProjectSettings from './components/forms/ProjectSettings';
import ItemsSection from './components/forms/ItemsSection';
import BomSection from './components/forms/BomSection';
import DemandSection from './components/forms/DemandSection';
import ResultsSection from './components/results/ResultsSection';
import Explanation from './components/docs/Explanation';
import { blankItem, exampleProject } from './data/exampleProject';
import { calculateMrp } from './utils/mrpCalculator';
import { buildCsv, downloadTextFile } from './utils/fileExport';
import { clampInt, sumByDays, toNumber, uid } from './utils/formatters';
import { usePersistedProject } from './hooks/usePersistedProject';

export default function App() {
  const {
    horizon,
    setHorizon,
    items,
    setItems,
    bom,
    setBom,
    demands,
    setDemands
  } = usePersistedProject();

  const [newItem, setNewItem] = useState(blankItem);

  const mrp = useMemo(
    () => calculateMrp({ items, bom, demands, horizon }),
    [items, bom, demands, horizon]
  );

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const levelDiff = (mrp.levels[a.id] ?? 0) - (mrp.levels[b.id] ?? 0);
      return levelDiff || a.name.localeCompare(b.name, 'pl');
    });
  }, [items, mrp.levels]);

  const maxLevel = sortedItems.reduce((max, item) => Math.max(max, mrp.levels[item.id] ?? 0), 0);

  const totalNet = sortedItems.reduce((sum, item) => {
    const row = mrp.results[item.id];
    return sum + sumByDays(row, mrp.days, 'netRequirements');
  }, 0);

  const totalPlannedReceipts = sortedItems.reduce((sum, item) => {
    const row = mrp.results[item.id];
    return sum + sumByDays(row, mrp.days, 'plannedReceipts');
  }, 0);

  function updateItem(id, field, value) {
    setItems((current) => current.map((item) => {
      if (item.id !== id) return item;

      const numericFields = new Set(['leadTime', 'initialStock', 'safetyStock', 'lotSize']);
      return { ...item, [field]: numericFields.has(field) ? toNumber(value, 0) : value };
    }));
  }

  function deleteItem(id) {
    setItems((current) => current.filter((item) => item.id !== id));
    setBom((current) => current.filter((link) => link.parentId !== id && link.childId !== id));
    setDemands((current) => current.filter((demand) => demand.itemId !== id));
  }

  function addItem() {
    const trimmedName = newItem.name.trim();
    if (!trimmedName) return;

    setItems((current) => [
      ...current,
      {
        id: uid('item'),
        name: trimmedName,
        type: newItem.type || 'Półprodukt',
        leadTime: Math.max(0, Math.trunc(toNumber(newItem.leadTime, 0))),
        initialStock: Math.max(0, toNumber(newItem.initialStock, 0)),
        safetyStock: Math.max(0, toNumber(newItem.safetyStock, 0)),
        lotSize: Math.max(1, Math.trunc(toNumber(newItem.lotSize, 1)))
      }
    ]);
    setNewItem(blankItem);
  }

  function addBomLink() {
    if (items.length < 2) return;

    const parentId = items[0].id;
    const childId = items.find((item) => item.id !== parentId)?.id;
    if (!childId) return;

    setBom((current) => [...current, { id: uid('bom'), parentId, childId, qty: 1 }]);
  }

  function updateBomLink(id, field, value) {
    setBom((current) => current.map((link) => {
      if (link.id !== id) return link;
      return {
        ...link,
        [field]: field === 'qty' ? Math.max(0, toNumber(value, 0)) : value
      };
    }));
  }

  function deleteBomLink(id) {
    setBom((current) => current.filter((link) => link.id !== id));
  }

  function addDemand() {
    if (items.length === 0) return;
    setDemands((current) => [...current, { id: uid('demand'), itemId: items[0].id, day: 1, qty: 1 }]);
  }

  function updateDemand(id, field, value) {
    setDemands((current) => current.map((demand) => {
      if (demand.id !== id) return demand;
      return {
        ...demand,
        [field]: field === 'itemId' ? value : Math.max(field === 'day' ? 1 : 0, toNumber(value, 0))
      };
    }));
  }

  function deleteDemand(id) {
    setDemands((current) => current.filter((demand) => demand.id !== id));
  }

  function resetExample() {
    setHorizon(exampleProject.horizon);
    setItems(exampleProject.items);
    setBom(exampleProject.bom);
    setDemands(exampleProject.demands);
  }

  function clearAll() {
    setHorizon(10);
    setItems([]);
    setBom([]);
    setDemands([]);
  }

  function exportJson() {
    downloadTextFile('mrp-dane.json', JSON.stringify({ horizon, items, bom, demands }, null, 2), 'application/json');
  }

  function exportCsv() {
    downloadTextFile('mrp-wyniki.csv', buildCsv(mrp, sortedItems), 'text/csv;charset=utf-8');
  }

  function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed.items) || !Array.isArray(parsed.bom) || !Array.isArray(parsed.demands)) {
          alert('Nieprawidłowy plik JSON.');
          return;
        }

        setHorizon(clampInt(parsed.horizon ?? 12, 1, 60, 12));
        setItems(parsed.items);
        setBom(parsed.bom);
        setDemands(parsed.demands);
      } catch {
        alert('Nie udało się wczytać pliku JSON.');
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="content-shell">
        <Topbar
          onResetExample={resetExample}
          onClearAll={clearAll}
          onExportJson={exportJson}
          onExportCsv={exportCsv}
          onImportJson={importJson}
        />

        

        <section className="stat-grid">
          <StatCard label="Horyzont" value={`${mrp.days.length} dni`} helper="Zakres planowania" icon="◷" variant="pink" />
          <StatCard label="Pozycje" value={items.length} helper={`Najniższy poziom BOM: ${maxLevel}`} icon="▣" variant="blue" />
          <StatCard label="Netto razem" value={totalNet} helper="Suma brakujących ilości" icon="◆" variant="green" />
          <StatCard label="Przyjęcia" value={totalPlannedReceipts} helper="Po zaokrągleniu do partii" icon="⇣" variant="violet" />
        </section>

        <section className="dashboard-grid">
          <Panel
            className="chart-panel"
            title="Podgląd obciążenia"
            description="Suma zapotrzebowania brutto w dniach dla wszystkich pozycji."
          >
            <MiniBars mrp={mrp} />
          </Panel>

        
       
        </section>

        <ProjectSettings horizon={horizon} setHorizon={setHorizon} />

        <ItemsSection
          items={items}
          sortedItems={sortedItems}
          mrp={mrp}
          newItem={newItem}
          setNewItem={setNewItem}
          onAddItem={addItem}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
        />

        <BomSection
          items={items}
          bom={bom}
          onAddBomLink={addBomLink}
          onUpdateBomLink={updateBomLink}
          onDeleteBomLink={deleteBomLink}
        />

        <DemandSection
          items={items}
          demands={demands}
          horizon={horizon}
          onAddDemand={addDemand}
          onUpdateDemand={updateDemand}
          onDeleteDemand={deleteDemand}
        />

        <ResultsSection mrp={mrp} sortedItems={sortedItems} />
        <Explanation />
      </main>
    </div>
  );
}
