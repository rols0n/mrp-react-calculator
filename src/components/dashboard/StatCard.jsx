export default function StatCard({ label, value, helper, icon, variant }) {
  return (
    <article className={`stat-card ${variant}`}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{helper}</small>
      </div>
      <div className="stat-icon">{icon}</div>
      <div className="bubble bubble-one" />
      <div className="bubble bubble-two" />
    </article>
  );
}
