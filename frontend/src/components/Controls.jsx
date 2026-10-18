import { useEffect, useRef, useState } from 'react';

const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Pill selector that replaces a <select>. */
export function Segmented({ label, name, value, options, onChange, cols = 'flex flex-wrap' }) {
  return (
    <div>
      <span className="mb-2 block text-sm text-cream/60">{label}</span>
      <div role="radiogroup" aria-label={label} className={`${cols} gap-2`}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={value === o}
            onClick={() => onChange(name, o)}
            className="seg-btn"
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function NumberField({ label, unit, name, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-cream/60">
        {label} <span className="text-cream/35">{unit}</span>
      </span>
      <input type="number" name={name} value={value} onChange={onChange} className="field" />
    </label>
  );
}

/** Counts up to a number when it first appears or changes. */
export function Num({ value }) {
  const [val, setVal] = useState(reduced ? value : 0);
  const from = useRef(0);

  useEffect(() => {
    if (reduced) { setVal(value); return; }
    const start = performance.now();
    const a = from.current;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1000);
      const v = a + (value - a) * (1 - Math.pow(1 - t, 3));
      from.current = v;
      setVal(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{Math.round(val)}</>;
}
