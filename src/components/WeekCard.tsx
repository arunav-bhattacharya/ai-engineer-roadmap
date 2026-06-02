import { useProgress } from '../lib/ProgressContext';
import { useCollapse } from '../lib/CollapseContext';
import { leavesForWeek } from '../lib/ids';
import type { Week } from '../types/roadmap';
import { CapstoneSpec } from './CapstoneSpec';
import { DayRow } from './DayRow';

interface Props {
  week: Week;
}

const variantClass = {
  default: '',
  moat: ' moatwk',
  claude: ' claudewk',
  elective: ' electivewk',
} as const;

export function WeekCard({ week }: Props) {
  const { pct } = useProgress();
  const { isCollapsed, toggle } = useCollapse();
  const leaves = leavesForWeek(week);
  const summary = pct(leaves);
  const collapsed = isCollapsed(week.id);

  const isCapstone = week.id === 'w9';
  const bodyId = `weekbody-${week.id}`;

  return (
    <section className={`week${variantClass[week.variant]}${collapsed ? ' collapsed' : ''}`} id={week.id}>
      <button
        type="button"
        className="whead"
        onClick={() => toggle(week.id)}
        aria-expanded={!collapsed}
        aria-controls={bodyId}
      >
        <span className="chevron" aria-hidden="true" />
        <div className="whead-main">
          <div className="row1">
            <span className="wtag">{week.tag}</span>
            <h2 className="wtitle">{week.title}</h2>
            <span className="whrs">{week.hours}</span>
          </div>
          {collapsed ? null : (
            <p className="wgoal" dangerouslySetInnerHTML={{ __html: week.goal }} />
          )}
          <div className="wprog" data-week={week.id}>
            <div className="bar">
              <i style={{ width: `${summary.pct}%` }} />
            </div>
            <span className="pct">
              {summary.done}/{summary.total} · {summary.pct}%
            </span>
          </div>
        </div>
      </button>

      <div className="weekbody" id={bodyId} hidden={collapsed}>
        {week.specs?.map((spec, i) => <CapstoneSpec key={i} spec={spec} />)}

        <div className="scroller">
          <table>
            <thead>
              <tr>
                <th style={{ width: isCapstone ? '14%' : '8%' }}>{isCapstone ? 'Phase' : 'Day'}</th>
                <th style={{ width: '24%' }}>Focus</th>
                {isCapstone ? null : <th style={{ width: '34%' }}>Resources</th>}
                <th style={{ width: '7%' }}>Est</th>
                <th style={{ width: isCapstone ? '55%' : '27%' }}>
                  {isCapstone ? 'Tasks' : 'Hands-on / Practice'}
                </th>
              </tr>
            </thead>
            <tbody>
              {week.days.map((day, di) => (
                <DayRow key={di} weekId={week.id} dayIdx={di} day={day} capstone={isCapstone} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="wfoot">
          <span
            className={`udemy${week.udemyNone ? ' none' : ''}`}
            dangerouslySetInnerHTML={{ __html: week.udemy }}
          />
          <span className="deliver" dangerouslySetInnerHTML={{ __html: week.deliverable }} />
        </div>
      </div>
    </section>
  );
}
