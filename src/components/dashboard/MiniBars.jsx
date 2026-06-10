function sumByDay(results, day, fieldName) {
  return Object.values(results ?? {}).reduce((sum, row) => {
    return sum + Number(row?.[fieldName]?.[day] ?? 0);
  }, 0);
}

export default function MiniBars({ mrp }) {
  const days = mrp?.days ?? [];
  const results = mrp?.results ?? {};

  const points = days.map((day) => {
    const gross = sumByDay(results, day, 'grossRequirements');
    const releases = sumByDay(results, day, 'plannedReleases');
    const receipts = sumByDay(results, day, 'plannedReceipts');

    return {
      day,
      gross,
      releases,
      receipts
    };
  });

  const maxValue = Math.max(
    1,
    ...points.map((point) => Math.max(point.gross, point.releases, point.receipts))
  );

  const totalGross = points.reduce((sum, point) => sum + point.gross, 0);
  const totalReleases = points.reduce((sum, point) => sum + point.releases, 0);
  const totalReceipts = points.reduce((sum, point) => sum + point.receipts, 0);

  if (!days.length) {
    return (
      <div className="chart-empty">
        Brak danych do wyświetlenia. Dodaj horyzont planowania oraz zapotrzebowanie.
      </div>
    );
  }

  return (
    <div className="chart-box">
      <div className="chart-summary">
        <div>
          <span>Zapotrzebowanie brutto</span>
          <strong>{totalGross}</strong>
        </div>

        <div>
          <span>Uruchomienia</span>
          <strong>{totalReleases}</strong>
        </div>

        <div>
          <span>Przyjęcia</span>
          <strong>{totalReceipts}</strong>
        </div>
      </div>

      <div className="mini-chart" aria-label="Mini wykres zapotrzebowania brutto">
        {points.map((point) => {
          const height = point.gross > 0
            ? Math.max(18, Math.round((point.gross / maxValue) * 112))
            : 6;

          return (
            <div
              className={`bar-column ${point.gross === 0 ? 'is-empty' : ''}`}
              key={point.day}
              title={`Dzień ${point.day}: brutto ${point.gross}, uruchomienia ${point.releases}, przyjęcia ${point.receipts}`}
            >
              <span className="bar-value">{point.gross}</span>

              <div className="bar-track">
                <div className="bar" style={{ height: `${height}px` }} />
              </div>

              <span className="bar-label">D{point.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}