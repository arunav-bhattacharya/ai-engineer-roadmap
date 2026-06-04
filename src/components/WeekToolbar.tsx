import { useCollapse } from '../lib/CollapseContext';

interface Props {
  weekIds: string[];
  /** Extra collapse keys (e.g. topic-section ids) toggled together with the weeks. */
  extraIds?: string[];
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function WeekToolbar({ weekIds, extraIds = [], sidebarOpen, onToggleSidebar }: Props) {
  const { collapsed, collapseAll, expandAll } = useCollapse();
  const expandedCount = weekIds.filter((id) => !collapsed.has(id)).length;
  const allIds = [...weekIds, ...extraIds];

  return (
    <div className="weektoolbar">
      <div className="weektoolbar-left">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-pressed={!sidebarOpen}
          title={sidebarOpen ? 'Hide week list' : 'Show week list'}
        >
          {sidebarOpen ? '⟨ Weeks' : '☰ Weeks'}
        </button>
        <span className="weektoolbar-count mono">
          {expandedCount} / {weekIds.length} expanded
        </span>
      </div>
      <div className="weektoolbar-btns">
        <button type="button" onClick={() => expandAll(allIds)}>
          Expand all
        </button>
        <button type="button" onClick={() => collapseAll(allIds)}>
          Collapse all
        </button>
      </div>
    </div>
  );
}
