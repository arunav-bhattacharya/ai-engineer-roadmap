import type { Notes as NotesT } from '../types/roadmap';

export function Notes({ notes }: { notes: NotesT }) {
  return (
    <div className="notes notes-embedded">
      <h3>Paid courses worth the money (ROI order, if reimbursed)</h3>
      <ul>
        {notes.paidCourses.map((html, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: html }} />
        ))}
      </ul>
      {notes.buyingTip ? (
        <p style={{ marginTop: 8 }} dangerouslySetInnerHTML={{ __html: notes.buyingTip }} />
      ) : null}
      <h3 style={{ marginTop: 22 }}>Pitfalls specific to senior backend engineers (you)</h3>
      <ul>
        {notes.pitfalls.map((html, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: html }} />
        ))}
      </ul>
    </div>
  );
}
