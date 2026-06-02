import type { Course } from '../types/roadmap';

export function CourseBand({ courses }: { courses: Course[] }) {
  return (
    <div className="courses" aria-label="Your courses">
      {courses.map((c) => (
        <a key={c.url} className="cbtn" href={c.url} target="_blank" rel="noreferrer">
          <span className="nm">{c.name}</span>
          <span className="ds">{c.description}</span>
          <span className="lk">{shortLk(c.url)}</span>
        </a>
      ))}
    </div>
  );
}

function shortLk(url: string): string {
  try {
    const u = new URL(url);
    const tail = u.pathname.replace(/\/+$/, '').split('/').filter(Boolean).pop() ?? '';
    return `${u.hostname.replace('www.', '')} → ${tail} ↗`;
  } catch {
    return url;
  }
}
