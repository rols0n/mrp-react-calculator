import Panel from '../common/Panel';
import NumberInput from '../common/NumberInput';
import { clampInt } from '../../utils/formatters';

export default function ProjectSettings({ horizon, setHorizon }) {
  return (
    <Panel
      id="settings"
      title="1. Ustawienia ogólne"
      description="Wybierz liczbę dni, dla których ma być wyliczony harmonogram."
    >
      <div className="form-row compact-row">
        <label>
          Horyzont planowania w dniach
          <NumberInput value={horizon} min={1} max={60} onChange={(value) => setHorizon(clampInt(value, 1, 60, 12))} />
        </label>
      </div>
    </Panel>
  );
}
