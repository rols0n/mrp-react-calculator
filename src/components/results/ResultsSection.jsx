import Panel from '../common/Panel';
import { metricLabels } from '../../constants/mrpLabels';

export default function ResultsSection({ mrp, sortedItems }) {
  const uniqueWarnings = [...new Set(mrp.warnings)];

  return (
    <Panel
      id="results"
      title="5. Wyniki MRP"
      description="Algorytm liczy potrzeby od najwyższego poziomu do materiałów najniższego poziomu."
    >
      {uniqueWarnings.length > 0 && (
        <div className="warnings">
          <strong>Uwagi:</strong>
          <ul>
            {uniqueWarnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
        </div>
      )}

      {sortedItems.length === 0 && <p className="muted">Dodaj pozycje i zapotrzebowanie, żeby zobaczyć obliczenia.</p>}

      {sortedItems.map((item) => {
        const row = mrp.results[item.id];

        return (
          <article className="result-card" key={item.id}>
            <div className="result-header">
              <div>
                <h3>{item.name}</h3>
                <p>
                  Poziom {row.level} · {item.type} · czas: {item.leadTime} dni · partia: {item.lotSize} · safety stock: {item.safetyStock}
                </p>
              </div>
              {row.overdueRelease > 0 && <span className="warning-pill">{row.overdueRelease} szt. przed dniem 1</span>}
            </div>

            <div className="table-wrap result-wrap">
              <table className="result-table">
                <thead>
                  <tr>
                    <th>Wiersz MRP</th>
                    {mrp.days.map((day) => <th key={day}>D{day}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(metricLabels).map(([metricKey, label]) => (
                    <tr key={metricKey}>
                      <td>{label}</td>
                      {mrp.days.map((day) => {
                        const value = row[metricKey][day] ?? 0;
                        return <td key={day} className={value > 0 ? 'has-value' : ''}>{value}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        );
      })}
    </Panel>
  );
}
