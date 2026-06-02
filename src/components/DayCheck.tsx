import { useEffect, useRef } from 'react';
import { useProgress } from '../lib/ProgressContext';

interface Props {
  leafIds: string[];
  label: string;
}

/**
 * Day-level master checkbox. Sits inline next to the day number.
 * Checked when all row leaves are done, indeterminate when partial,
 * toggles all leaves in the row.
 */
export function DayCheck({ leafIds, label }: Props) {
  const ref = useRef<HTMLInputElement | null>(null);
  const { state, toggleMany } = useProgress();
  const done = leafIds.filter((id) => state[id]).length;
  const allChecked = leafIds.length > 0 && done === leafIds.length;
  const indeterminate = done > 0 && done < leafIds.length;

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      className="daycheck"
      checked={allChecked}
      onChange={() => toggleMany(leafIds, !allChecked)}
      aria-label={`Mark all of day ${label} complete`}
      title="Toggle all items in this day"
    />
  );
}
