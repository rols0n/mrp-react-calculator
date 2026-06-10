const navItems = [
  ['#items', 'Produkty'],
  ['#bom', 'BOM'],
  ['#demand', 'Zapotrzebowanie'],
  ['#results', 'Wyniki MRP'],
  ['#docs', 'Opis algorytmu']
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">M</span>
        <div>
          <strong>MRP Purple</strong>
          <small>React + Vite</small>
        </div>
      </div>

      <div className="user-card">
        <div className="avatar">PR</div>
        <div>
          <strong>Patryk Rolka</strong>
          <span>Projekt UEK</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Nawigacja po aplikacji">
        {navItems.map(([href, label], index) => (
          <a key={href} href={href} className={index === 0 ? 'active' : undefined}>{label}</a>
        ))}
      </nav>
    </aside>
  );
}
