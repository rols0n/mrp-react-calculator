export default function NumberInput({ value, onChange, min = 0, max, step = 1, className = '' }) {
  return (
    <input
      className={className}
      type="number"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
