import Panel from '../common/Panel';
import NumberInput from '../common/NumberInput';

export default function DemandSection({ items, demands, horizon, onAddDemand, onUpdateDemand, onDeleteDemand }) {
  return (
    <Panel
      id="demand"
      title="4. Zapotrzebowanie zewnętrzne"
      description="Wpisz, ile sztuk danego produktu trzeba mieć gotowe we wskazanym dniu."
      action={<button onClick={onAddDemand} disabled={items.length === 0}>Dodaj zapotrzebowanie</button>}
    >
      <div className="table-wrap">
        <table className="edit-table">
          <thead>
            <tr>
              <th>Pozycja</th>
              <th>Dzień</th>
              <th>Ilość</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {demands.map((demand) => (
              <tr key={demand.id}>
                <td>
                  <select value={demand.itemId} onChange={(event) => onUpdateDemand(demand.id, 'itemId', event.target.value)}>
                    {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                </td>
                <td><NumberInput value={demand.day} min={1} max={horizon} onChange={(value) => onUpdateDemand(demand.id, 'day', value)} /></td>
                <td><NumberInput value={demand.qty} min={0} onChange={(value) => onUpdateDemand(demand.id, 'qty', value)} /></td>
                <td><button className="danger" onClick={() => onDeleteDemand(demand.id)}>Usuń</button></td>
              </tr>
            ))}

            {demands.length === 0 && (
              <tr><td colSpan="4" className="empty-row">Brak zapotrzebowania.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
