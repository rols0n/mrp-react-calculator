import { clampInt, toNumber } from './formatters';

function ceilToLot(value, lotSize) {
  const safeLot = Math.max(1, Math.trunc(toNumber(lotSize, 1)));
  return Math.ceil(value / safeLot) * safeLot;
}

function makePeriodArray(horizon) {
  return Array.from({ length: horizon + 1 }, () => 0);
}

export function computeLevels(items, bom) {
  const ids = new Set(items.map((item) => item.id));
  const childrenByParent = new Map();
  const childIds = new Set();

  bom.forEach((link) => {
    if (!ids.has(link.parentId) || !ids.has(link.childId)) return;
    childIds.add(link.childId);

    if (!childrenByParent.has(link.parentId)) {
      childrenByParent.set(link.parentId, []);
    }

    childrenByParent.get(link.parentId).push(link.childId);
  });

  const roots = items.filter((item) => !childIds.has(item.id)).map((item) => item.id);
  const levels = Object.fromEntries(items.map((item) => [item.id, 0]));
  const warnings = [];
  const visiting = new Set();
  const visited = new Set();
  let hasCycle = false;

  function dfs(id, level, path) {
    if (visiting.has(id)) {
      hasCycle = true;
      warnings.push(`Wykryto pętlę w strukturze BOM: ${path.join(' → ')} → ${id}. Usuń pętlę, bo MRP nie może wtedy działać poprawnie.`);
      return;
    }

    levels[id] = Math.max(levels[id] ?? 0, level);
    visiting.add(id);

    const children = childrenByParent.get(id) ?? [];
    children.forEach((childId) => dfs(childId, level + 1, [...path, id]));

    visiting.delete(id);
    visited.add(id);
  }

  roots.forEach((rootId) => dfs(rootId, 0, []));

  items.forEach((item) => {
    if (!visited.has(item.id)) {
      dfs(item.id, levels[item.id] ?? 0, []);
    }
  });

  return { levels, warnings, hasCycle };
}

export function calculateMrp({ items, bom, demands, horizon }) {
  const safeHorizon = clampInt(horizon, 1, 60, 12);
  const days = Array.from({ length: safeHorizon }, (_, index) => index + 1);
  const itemMap = new Map(items.map((item) => [item.id, item]));
  const warnings = [];

  const { levels, warnings: levelWarnings, hasCycle } = computeLevels(items, bom);
  warnings.push(...levelWarnings);

  const results = Object.fromEntries(
    items.map((item) => [
      item.id,
      {
        item,
        level: levels[item.id] ?? 0,
        grossRequirements: makePeriodArray(safeHorizon),
        plannedReceipts: makePeriodArray(safeHorizon),
        projectedAvailable: makePeriodArray(safeHorizon),
        netRequirements: makePeriodArray(safeHorizon),
        plannedReleases: makePeriodArray(safeHorizon),
        overdueRelease: 0
      }
    ])
  );

  demands.forEach((demand) => {
    if (!itemMap.has(demand.itemId)) return;
    const day = clampInt(demand.day, 1, safeHorizon, 1);
    results[demand.itemId].grossRequirements[day] += Math.max(0, toNumber(demand.qty, 0));
  });

  if (hasCycle) {
    return { days, levels, results, warnings, hasCycle };
  }

  const order = [...items].sort((a, b) => {
    const diff = (levels[a.id] ?? 0) - (levels[b.id] ?? 0);
    return diff || a.name.localeCompare(b.name, 'pl');
  });

  order.forEach((item) => {
    const row = results[item.id];
    let available = Math.max(0, toNumber(item.initialStock, 0));
    const safetyStock = Math.max(0, toNumber(item.safetyStock, 0));
    const leadTime = Math.max(0, Math.trunc(toNumber(item.leadTime, 0)));

    days.forEach((day) => {
      const gross = Math.max(0, toNumber(row.grossRequirements[day], 0));
      const projectedWithoutReceipt = available - gross;

      if (projectedWithoutReceipt < safetyStock) {
        const netRequirement = safetyStock - projectedWithoutReceipt;
        const plannedReceipt = ceilToLot(netRequirement, item.lotSize);

        row.netRequirements[day] = netRequirement;
        row.plannedReceipts[day] = plannedReceipt;
        available = projectedWithoutReceipt + plannedReceipt;

        const releaseDay = day - leadTime;
        if (releaseDay >= 1) {
          row.plannedReleases[releaseDay] += plannedReceipt;
        } else {
          row.overdueRelease += plannedReceipt;
          warnings.push(`${item.name}: ${plannedReceipt} szt. trzeba uruchomić/zamówić przed dniem 1, bo czas produkcji/dostawy wynosi ${leadTime} dni.`);
        }
      } else {
        available = projectedWithoutReceipt;
      }

      row.projectedAvailable[day] = available;
    });

    bom
      .filter((link) => link.parentId === item.id && itemMap.has(link.childId))
      .forEach((link) => {
        const childRow = results[link.childId];
        const qty = Math.max(0, toNumber(link.qty, 0));

        days.forEach((day) => {
          const parentRelease = row.plannedReleases[day];
          if (parentRelease > 0) {
            childRow.grossRequirements[day] += parentRelease * qty;
          }
        });

        if (row.overdueRelease > 0) {
          warnings.push(`${itemMap.get(link.childId).name}: część zapotrzebowania wynika z uruchomień produktu „${item.name}” przed dniem 1.`);
        }
      });
  });

  return { days, levels, results, warnings, hasCycle };
}
