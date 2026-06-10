import Panel from '../common/Panel';
import NumberInput from '../common/NumberInput';
import { itemTypes } from '../../constants/mrpLabels';

export default function ItemsSection({ items, sortedItems, mrp, newItem, setNewItem, onAddItem, onUpdateItem, onDeleteItem }) {
  return (
    <Panel
      id="items"
      title="2. Pozycje / produkty"
      description="Tu wpisujesz produkt końcowy, półprodukty i materiały."
    >
      <div className="table-wrap">
        <table className="edit-table">
          <thead>
            <tr>
              <th>Nazwa</th>
              <th>Typ</th>
              <th>Poziom</th>
              <th>Czas prod./dostawy</th>
              <th>Stan startowy</th>
              <th>Safety stock</th>
              <th>Partia</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr key={item.id}>
                <td><input value={item.name} onChange={(event) => onUpdateItem(item.id, 'name', event.target.value)} /></td>
                <td>
                  <select value={item.type} onChange={(event) => onUpdateItem(item.id, 'type', event.target.value)}>
                    {itemTypes.map((type) => <option key={type}>{type}</option>)}
                  </select>
                </td>
                <td><span className="pill">{mrp.levels[item.id] ?? 0}</span></td>
                <td><NumberInput value={item.leadTime} min={0} onChange={(value) => onUpdateItem(item.id, 'leadTime', value)} /></td>
                <td><NumberInput value={item.initialStock} min={0} onChange={(value) => onUpdateItem(item.id, 'initialStock', value)} /></td>
                <td><NumberInput value={item.safetyStock} min={0} onChange={(value) => onUpdateItem(item.id, 'safetyStock', value)} /></td>
                <td><NumberInput value={item.lotSize} min={1} onChange={(value) => onUpdateItem(item.id, 'lotSize', value)} /></td>
                <td><button className="danger" onClick={() => onDeleteItem(item.id)}>Usuń</button></td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan="8" className="empty-row">Brak pozycji. Dodaj pierwszą pozycję poniżej.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddItemForm newItem={newItem} setNewItem={setNewItem} onAddItem={onAddItem} />
    </Panel>
  );
}

function AddItemForm({ newItem, setNewItem, onAddItem }) {
  return (
    <div className="add-card">
      <h3>Dodaj pozycję</h3>
      <div className="form-row product-row">
        <label>
          Nazwa
          <input
            value={newItem.name}
            placeholder="np. Silnik"
            onChange={(event) => setNewItem((current) => ({ ...current, name: event.target.value }))}
          />
        </label>

        <label>
          Typ
          <select value={newItem.type} onChange={(event) => setNewItem((current) => ({ ...current, type: event.target.value }))}>
            {itemTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>

        <label>
          Czas prod./dostawy
          <NumberInput value={newItem.leadTime} min={0} onChange={(value) => setNewItem((current) => ({ ...current, leadTime: value }))} />
        </label>

        <label>
          Stan startowy
          <NumberInput value={newItem.initialStock} min={0} onChange={(value) => setNewItem((current) => ({ ...current, initialStock: value }))} />
        </label>

        <label>
          Safety stock
          <NumberInput value={newItem.safetyStock} min={0} onChange={(value) => setNewItem((current) => ({ ...current, safetyStock: value }))} />
        </label>

        <label>
          Partia
          <NumberInput value={newItem.lotSize} min={1} onChange={(value) => setNewItem((current) => ({ ...current, lotSize: value }))} />
        </label>

        <button onClick={onAddItem}>Dodaj</button>
      </div>
    </div>
  );
}
