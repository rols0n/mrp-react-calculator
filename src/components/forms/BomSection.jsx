import Panel from '../common/Panel';
import NumberInput from '../common/NumberInput';
import BomTree from '../bom/BomTree';

export default function BomSection({ items, bom, onAddBomLink, onUpdateBomLink, onDeleteBomLink }) {
  return (
    <Panel
      id="bom"
      className="two-column"
      title="3. Zależności BOM"
      description="Określ, ile elementów niższego poziomu potrzeba do zrobienia produktu wyższego poziomu."
      action={<button onClick={onAddBomLink} disabled={items.length < 2}>Dodaj zależność</button>}
    >
      <div className="table-wrap">
        <table className="edit-table">
          <thead>
            <tr>
              <th>Produkt nadrzędny</th>
              <th>Element podrzędny</th>
              <th>Ilość</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bom.map((link) => (
              <tr key={link.id}>
                <td>
                  <select value={link.parentId} onChange={(event) => onUpdateBomLink(link.id, 'parentId', event.target.value)}>
                    {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                </td>

                <td>
                  <select value={link.childId} onChange={(event) => onUpdateBomLink(link.id, 'childId', event.target.value)}>
                    {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                </td>

                <td><NumberInput value={link.qty} min={0} step={0.01} onChange={(value) => onUpdateBomLink(link.id, 'qty', value)} /></td>
                <td><button className="danger" onClick={() => onDeleteBomLink(link.id)}>Usuń</button></td>
              </tr>
            ))}

            {bom.length === 0 && (
              <tr><td colSpan="4" className="empty-row">Brak zależności BOM.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="tree-panel">
        <div className="panel-subtitle">
          <h2>Podgląd struktury</h2>
          <p>Drzewo pokazuje poziomy produktu i ilość elementów podrzędnych.</p>
        </div>
        <BomTree items={items} bom={bom} />
      </div>
    </Panel>
  );
}
