import type { ResourceMapRow } from '../types/roadmap';

export function ResourceMap({ rows }: { rows: ResourceMapRow[] }) {
  return (
    <div className="block" id="resources">
      <h3>Your resource stack — what drives each week</h3>
      <p>
        You own all of these. Don't watch them linearly — they overlap heavily. Use one primary per week (below)
        and treat the rest as reference. The book is the Part II spine.
      </p>
      <div className="gtable">
        <table>
          <thead>
            <tr>
              <th>Resource</th>
              <th>What it's best for</th>
              <th>Drives</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>
                  <b>
                    {r.url ? (
                      <a href={r.url} target="_blank" rel="noreferrer">
                        {r.name}
                      </a>
                    ) : (
                      r.name
                    )}
                  </b>
                </td>
                <td>{r.bestFor}</td>
                <td>{r.drives}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
