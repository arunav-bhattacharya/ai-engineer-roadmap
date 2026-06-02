import { useCollapse } from '../lib/CollapseContext';

interface Props {
  weekIds: string[];
}

export function WeekToolbar({ weekIds }: Props) {
  const { collapsed, collapseAll, expandAll } = useCollapse();
  const expandedCount = weekIds.filter((id) => !collapsed.has(id)).length;

  return (
    <div className="weektoolbar">
      <span className="weektoolbar-count mono">
        {expandedCount} / {weekIds.length} expanded
      </span>
      <div className="weektoolbar-btns">
        <button type="button" onClick={() => expandAll(weekIds)}>
          Expand all
        </button>
        <button type="button" onClick={() => collapseAll(weekIds)}>
          Collapse all
        </button>
      </div>
    </div>
  );
}
