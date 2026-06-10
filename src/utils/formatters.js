export function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function clampInt(value, min, max, fallback = min) {
  const parsed = Math.trunc(toNumber(value, fallback));
  return Math.min(max, Math.max(min, parsed));
}

export function sumByDays(row, days, metricKey) {
  return days.reduce((sum, day) => sum + (row?.[metricKey]?.[day] ?? 0), 0);
}
