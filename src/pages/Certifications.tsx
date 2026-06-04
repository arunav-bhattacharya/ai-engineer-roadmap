import { useNavigate } from 'react-router-dom';
import roadmap from '../data/roadmap.json';
import { CERTIFICATIONS, type Certification } from '../data/certifications';
import { weekColor } from '../lib/colors';
import { Reference } from '../components/Reference';
import type { Roadmap, Week } from '../types/roadmap';

const r = roadmap as Roadmap;
const allWeeks: Week[] = r.weeks;
const weekById = new Map(allWeeks.map((w) => [w.id, w]));

export function Certifications() {
  const recommended = CERTIFICATIONS.filter((c) => c.tier === 'recommended');
  const optional = CERTIFICATIONS.filter((c) => c.tier === 'optional-heavyweight');

  return (
    <>
      <section className="cert-hero">
        <span className="kicker mono">Recommended credentials</span>
        <h1 className="cert-title">
          Certifications<br />
          <em>aligned with this roadmap</em>
        </h1>
        <p className="cert-lede">
          Five recommended certs, ranked by <b>roadmap alignment + low extra effort</b>. Each slots into a
          specific week so net-new study is small — typically a quiz or proctored exam on material you have
          already built. Skip everything not listed; in particular, classical-ML, off-stack-cloud, and
          vendor-vector-DB certs are <b>low signal</b> for the agentic / AWS path this plan targets.
        </p>
      </section>

      <section className="cert-section">
        <div className="section-head">
          <h2 className="sec-title">Do these five</h2>
        </div>
        <div className="certs">
          {recommended.map((c) => (
            <CertCard key={c.id} cert={c} />
          ))}
        </div>
      </section>

      <section className="cert-section">
        <div className="section-head">
          <h2 className="sec-title">Optional heavyweight — after the capstone</h2>
        </div>
        <div className="certs">
          {optional.map((c) => (
            <CertCard key={c.id} cert={c} />
          ))}
        </div>
      </section>

      <section className="cert-section">
        <div className="section-head">
          <h2 className="sec-title">Skip these</h2>
        </div>
        <ul className="cert-skip">
          <li><b>DeepLearning.AI ML / Deep Learning Specializations</b> — Karpathy + Cohen + Huyen in your plan already go deeper and more applied.</li>
          <li><b>Google AI / ML Crash Course</b> — trivial, near-zero resume signal.</li>
          <li><b>AWS ML Specialty (MLS-C01)</b> — being retired; do MLA-C01 above instead.</li>
          <li><b>GCP Pro ML Engineer / Data Engineer / Cloud Architect</b> — off-stack from your AWS path.</li>
          <li><b>Azure AI-102 / Azure Data Scientist</b> — off-stack.</li>
          <li><b>Databricks ML Professional / Data Engineer</b> — off-stack unless your employer runs Databricks.</li>
          <li><b>NVIDIA DLI</b> — niche compute / GPU; only if a target role asks for it.</li>
          <li><b>Pinecone Vector DB</b> — vendor-specific; your plan moves to pgvector and the industry doesn't weight it.</li>
          <li><b>Weights &amp; Biases MLOps</b> — light cert; the W&amp;B Courses material is covered in W13 for free.</li>
          <li><b>CKA (Kubernetes Administrator)</b> — high value but a separate domain; only if a target role explicitly lists k8s.</li>
        </ul>
      </section>

      <Reference roadmap={r} />
    </>
  );
}

function CertCard({ cert }: { cert: Certification }) {
  const navigate = useNavigate();

  return (
    <article className="cert">
      <div className="cert-head">
        <span className="cert-rank mono">#{cert.rank}</span>
        <h3 className="cert-name">{cert.name}</h3>
        <span className="cert-provider mono">{cert.provider}</span>
      </div>

      <div className="cert-meta mono">
        <span><strong>Effort:</strong> {cert.effort}</span>
        <span><strong>Cost:</strong> {cert.cost}</span>
        <span><strong>When:</strong> <span className="cert-when">{cert.when}</span></span>
      </div>

      <p className="cert-why">{cert.why}</p>

      {cert.mapsTo.length > 0 && (
        <div className="cert-chip-row">
          <span className="cert-chip-label mono">Maps to · Complete Plan</span>
          <div className="cert-chips">
            {cert.mapsTo.map((wid) => {
              const w = weekById.get(wid);
              if (!w) return null;
              const color = weekColor(wid);
              return (
                <button
                  key={wid}
                  type="button"
                  className="cert-chip"
                  style={{ '--wk-color': color } as React.CSSProperties}
                  onClick={() => navigate('/complete-plan', { state: { jump: wid } })}
                  aria-label={`Open ${w.tag} ${w.title} in the Complete Plan`}
                  title={w.title}
                >
                  <span className="cert-chip-dot" style={{ background: color }} aria-hidden="true" />
                  {w.tag.replace(/\s*[★◇].*$/, '').trim()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <details className="cert-process-wrap">
        <summary>Process &amp; steps</summary>
        <ol className="cert-process">
          {cert.process.map((step, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </ol>
      </details>

      <div className="cert-links">
        {cert.links.map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
            {l.label} ↗
          </a>
        ))}
      </div>
    </article>
  );
}
