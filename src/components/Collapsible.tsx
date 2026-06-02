import { useState, type ReactNode } from 'react';

interface Props {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/** Generic collapsible block for dense Overview sections. Local state, not persisted. */
export function Collapsible({ title, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`block collapsible${open ? ' open' : ''}`}>
      <button
        type="button"
        className="collapsible-head"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="chevron" aria-hidden="true" />
        <h3>{title}</h3>
      </button>
      <div className="collapsible-body" hidden={!open}>
        {children}
      </div>
    </div>
  );
}
