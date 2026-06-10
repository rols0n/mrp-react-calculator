export default function BomTree({ items, bom }) {
  const itemMap = new Map(items.map((item) => [item.id, item]));
  const childIds = new Set(bom.map((link) => link.childId));
  const roots = items.filter((item) => !childIds.has(item.id));
  const childrenByParent = new Map();

  bom.forEach((link) => {
    if (!childrenByParent.has(link.parentId)) {
      childrenByParent.set(link.parentId, []);
    }

    childrenByParent.get(link.parentId).push(link);
  });

  function renderNode(item, depth = 0, multiplier = 1, path = new Set()) {
    const children = childrenByParent.get(item.id) ?? [];
    const cycle = path.has(item.id);

    return (
      <div className="tree-node" key={`${item.id}-${depth}-${multiplier}`}>
        <div className="tree-label" style={{ marginLeft: `${depth * 18}px` }}>
          <span className="tree-dot" />
          <strong>{item.name}</strong>
          <span>poziom {depth}</span>
          {multiplier !== 1 && <em>× {multiplier}</em>}
        </div>

        {!cycle && children.map((link) => {
          const child = itemMap.get(link.childId);
          if (!child) return null;

          const nextPath = new Set(path);
          nextPath.add(item.id);
          return renderNode(child, depth + 1, link.qty, nextPath);
        })}
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="muted">Dodaj pozycje, żeby zobaczyć strukturę BOM.</p>;
  }

  return (
    <div className="tree-box">
      {(roots.length ? roots : items).map((item) => renderNode(item))}
    </div>
  );
}
