export default function MiniBars({ mrp }) {
  const maxGross = Math.max(
    1,
    ...Object.values(mrp.results).flatMap((row) => mrp.days.map((day) => row.grossRequirements[day] ?? 0))
  );

  return (
    <div className="mini-chart" aria-label="Mini wykres zapotrzebowania brutto">
      {mrp.days.map((day) => {
        const value = Object.values(mrp.results).reduce((sum, row) => sum + (row.grossRequirements[day] ?? 0), 0);
        const height = Math.max(7, Math.round((value / maxGross) * 112));

        return (
          <div className="bar-column" key={day} title={`Dzień ${day}: ${value}`}>
            <div className="bar" style={{ height: `${height}px` }} />
            <span>D{day}</span>
          </div>
        );
      })}
    </div>
  );
}
