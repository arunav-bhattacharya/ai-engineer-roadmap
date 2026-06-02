import type { Day } from '../types/roadmap';
import { handsLeafId, leavesForDay, resourceLeafId } from '../lib/ids';
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
  return (
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
                <RefCheckbox
                  key={ri}
                  id={resourceLeafId(weekId, dayIdx, ri)}
                  resource={r}
                />
              ))}
        </td>
      )}
      <td className="est">{day.est}</td>
      <td className="hands">
        {day.hands ? (
          <HandsCheckbox id={handsLeafId(weekId, dayIdx)} html={day.hands} />
        ) : null}
      </td>
    </tr>
  );
}
