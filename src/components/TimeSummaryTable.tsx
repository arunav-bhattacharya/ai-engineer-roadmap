import type { TimeSummaryRow } from '../types/roadmap';

export function TimeSummaryTable({ rows }: { rows: TimeSummaryRow[] }) {
  return (
    <div className="gtable">
      <table>
        <thead>
          <tr>
            <th>Wk</th>
            <th>Topic</th>
            <th>Build</th>
            <th>Read</th>
            <th>Deliverable</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.star ? <b>{r.wk}</b> : r.wk}</td>
              <td dangerouslySetInnerHTML={{ __html: r.topic }} />
              <td>{r.build}</td>
              <td>{r.read}</td>
              <td>{r.deliverable}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
