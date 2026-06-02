import { useProgress } from '../lib/ProgressContext';
import type { Resource } from '../types/roadmap';

interface Props {
  id: string;
  resource: Resource;
}

export function RefCheckbox({ id, resource }: Props) {
  const { isChecked, toggleOne } = useProgress();
  const checked = isChecked(id);
  const { typeClass, typeLabel, label, url, trailing } = resource;

  return (
    <label className={`refchk${checked ? ' done' : ''}`}>
      <input type="checkbox" checked={checked} onChange={() => toggleOne(id)} />
      <span>
        <span className={`ty ${typeClass}`}>{typeLabel}</span>
        {url ? (
          <a href={url} target="_blank" rel="noreferrer">
            {label}
          </a>
        ) : (
          <span dangerouslySetInnerHTML={{ __html: label }} />
        )}
        {trailing ? <span>{trailing}</span> : null}
      </span>
    </label>
  );
}
