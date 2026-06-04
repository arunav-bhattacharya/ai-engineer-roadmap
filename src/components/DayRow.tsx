import { useState } from 'react';
import type { Day } from '../types/roadmap';
import { handsLeafId, leavesForDay, resourceLeafId } from '../lib/ids';
import { exerciseCode, exerciseNumber } from '../lib/exercises';
import { DayCheck } from './DayCheck';
import { HandsCheckbox } from './HandsCheckbox';
import { RefCheckbox } from './RefCheckbox';

interface Props {
  weekId: string;
  dayIdx: number;
  day: Day;
  capstone?: boolean;
}

export function DayRow({ weekId, dayIdx, day, capstone }: Props) {
  const leafIds = leavesForDay(weekId, dayIdx, day);
  const [open, setOpen] = useState(false);

  const ex = day.exercise;
  const num = ex ? exerciseNumber(handsLeafId(weekId, dayIdx)) : undefined;
  const code = num ? exerciseCode(num) : undefined;
  const detailId = `ex-detail-${weekId}-${dayIdx}`;
  const colSpan = capstone ? 4 : 5;

  return (
    <>
      <tr>
        <td className="day">
          <span className="daycell">
            {leafIds.length > 0 ? <DayCheck leafIds={leafIds} label={day.n} /> : null}
            <span className="daynum" style={capstone ? { fontSize: 13 } : undefined}>
              {day.n}
            </span>
          </span>
        </td>
        <td className="focus">
          <b>{day.focusTitle}</b>
          {day.focusSub ? <span>{day.focusSub}</span> : null}
        </td>
        {capstone ? null : (
          <td className="res">
            {day.resources.length === 0
              ? null
              : day.resources.map((r, ri) => (
                  <RefCheckbox key={ri} id={resourceLeafId(weekId, dayIdx, ri)} resource={r} />
                ))}
          </td>
        )}
        <td className="est">{day.est}</td>
        <td className="hands">
          {day.hands ? <HandsCheckbox id={handsLeafId(weekId, dayIdx)} html={day.hands} /> : null}
          {ex && code ? (
            <button
              type="button"
              className={`ex-chip${open ? ' open' : ''}`}
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls={detailId}
              title={open ? 'Hide exercise detail' : 'Show exercise detail'}
            >
              <span className="ex-code mono">{code}</span>
              <span className="ex-caret" aria-hidden="true" />
            </button>
          ) : null}
        </td>
      </tr>

      {ex && open ? (
        <tr className="exercise-detail-row">
          <td colSpan={colSpan}>
            <div className="exercise-detail">
              <div className="ex-detail-head">
                <span className="ex-code mono">{code}</span>
                <b dangerouslySetInnerHTML={{ __html: ex.goal }} />
              </div>
              <div className="ex-block">
                <span className="ex-label mono">Build steps</span>
                <ol>
                  {ex.steps.map((s, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: s }} />
                  ))}
                </ol>
              </div>
              <div className="ex-block">
                <span className="ex-label mono">Done when</span>
                <ul>
                  {ex.acceptance.map((a, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: a }} />
                  ))}
                </ul>
              </div>
              {ex.stretch ? (
                <div className="ex-block ex-stretch">
                  <span className="ex-label mono">Stretch</span>
                  <p dangerouslySetInnerHTML={{ __html: ex.stretch }} />
                </div>
              ) : null}
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}
