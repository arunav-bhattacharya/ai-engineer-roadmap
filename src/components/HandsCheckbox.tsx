import { useProgress } from '../lib/ProgressContext';

interface Props {
  id: string;
  html: string;
}

export function HandsCheckbox({ id, html }: Props) {
  const { isChecked, toggleOne } = useProgress();
  const checked = isChecked(id);
  return (
    <label className={`handschk${checked ? ' done' : ''}`}>
      <input type="checkbox" checked={checked} onChange={() => toggleOne(id)} />
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </label>
  );
}
