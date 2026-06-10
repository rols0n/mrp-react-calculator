export default function Topbar({ onResetExample, onClearAll, onExportJson, onExportCsv, onImportJson }) {
  return (
    <header className="topbar">


      <div className="topbar-actions">
        <button className="ghost" onClick={onResetExample}>Przykład</button>
        <button className="ghost" onClick={onClearAll}>Wyczyść</button>
        <button onClick={onExportJson}>JSON</button>
        <button onClick={onExportCsv}>CSV</button>
        <label className="file-button compact-file">
          Import
          <input type="file" accept="application/json" onChange={onImportJson} />
        </label>
      </div>
    </header>
  );
}
