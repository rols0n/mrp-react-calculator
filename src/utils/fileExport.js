import { metricLabels } from '../constants/mrpLabels';

export function downloadTextFile(filename, content, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function buildCsv(mrp, items) {
  const separator = ';';
  const lines = [];

  lines.push(['Pozycja', 'Poziom', 'Wiersz', ...mrp.days.map((day) => `Dzień ${day}`)].join(separator));

  items
    .sort((a, b) => (mrp.levels[a.id] ?? 0) - (mrp.levels[b.id] ?? 0) || a.name.localeCompare(b.name, 'pl'))
    .forEach((item) => {
      const row = mrp.results[item.id];

      Object.entries(metricLabels).forEach(([metricKey, label]) => {
        lines.push([
          item.name,
          row.level,
          label,
          ...mrp.days.map((day) => row[metricKey][day] ?? 0)
        ].join(separator));
      });
    });

  return lines.join('\n');
}
