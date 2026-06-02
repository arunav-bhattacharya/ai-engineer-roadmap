#!/usr/bin/env node
// Parses the single-file roadmap HTML into src/data/roadmap.json.
// Usage: node scripts/parse-html.mjs [path/to/source.html]
// Defaults to scripts/source.html if no arg given.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const sourcePath = resolve(process.argv[2] ?? join(__dirname, 'source.html'));
const outPath = join(repoRoot, 'src/data/roadmap.json');

const html = readFileSync(sourcePath, 'utf8');
const $ = cheerio.load(html, { decodeEntities: false });

const text = (el) => $(el).text().trim().replace(/\s+/g, ' ');
const innerHtml = (el) => ($(el).html() ?? '').trim();

// ---------- header ----------
const kicker = text($('header .kicker').first());
const titleHtml = innerHtml($('header h1').first()).replace(/\n/g, '');
const lede = innerHtml($('header .lede').first());

const meta = {};
$('header .meta > div').each((_, div) => {
  const k = text($(div).find('span'));
  const v = text($(div).find('strong'));
  if (!k) return;
  const slug = k.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  meta[slug] = v;
});

const courses = [];
$('header .courses a.cbtn').each((_, a) => {
  courses.push({
    name: text($(a).find('.nm')),
    description: text($(a).find('.ds')),
    url: $(a).attr('href') ?? '',
  });
});

// ---------- key topics ----------
const keyTopics = [];
$('.keytopics .chip').each((_, c) => {
  const label = text(c).replace(/[★◇]\s*$/, '').trim();
  keyTopics.push({
    label,
    star: $(c).hasClass('star'),
    raw: text(c),
  });
});

// ---------- moat callout ----------
const moat = innerHtml($('.moat p').first());

// ---------- resource map ----------
const resourceMap = [];
$('#resources .gtable table tbody tr').each((_, tr) => {
  const tds = $(tr).find('td');
  const $name = $(tds[0]).find('b').first();
  const $a = $name.find('a').first();
  resourceMap.push({
    name: text($name),
    url: $a.attr('href') ?? undefined,
    bestFor: text(tds[1]),
    drives: text(tds[2]),
  });
});

// ---------- how to study ----------
const howToStudyBlock = $('#how');
const howToStudy = {
  paragraphs: [],
  bullets: [],
};
howToStudyBlock.children('p').each((_, p) => howToStudy.paragraphs.push(innerHtml(p)));
howToStudyBlock.children('ul').first().children('li').each((_, li) => {
  howToStudy.bullets.push(innerHtml(li));
});

// ---------- setup ----------
const setupBlock = $('#setup');
const setup = { items: [] };
setupBlock.children('ul').first().children('li').each((_, li) => {
  setup.items.push(innerHtml(li));
});

// ---------- weeks ----------
function parseResource(segHtml) {
  const $$ = cheerio.load(`<div>${segHtml}</div>`, { decodeEntities: false });
  const $seg = $$('div').first();
  const $chip = $seg.find('span.ty').first();
  const typeClass = ($chip.attr('class') ?? '')
    .split(/\s+/)
    .find((c) => c !== 'ty') ?? 'read';
  const typeLabel = $chip.text().trim() || 'read';
  $chip.remove();

  const $a = $seg.find('a').first();
  if ($a.length) {
    return {
      typeClass,
      typeLabel,
      label: $a.text().trim(),
      url: $a.attr('href') ?? undefined,
      // Extra text after the link (rare) is kept inline for fidelity.
      trailing: $seg
        .contents()
        .toArray()
        .filter((n) => !(n.type === 'tag' && n.name === 'a'))
        .map((n) => $$(n).text())
        .join('')
        .trim() || undefined,
    };
  }
  return {
    typeClass,
    typeLabel,
    label: $seg.text().trim().replace(/\s+/g, ' '),
  };
}

function parseDay(tr, idx) {
  const $tr = $(tr);
  const dayN = text($tr.find('td.day .daynum').first()) || String(idx + 1);
  const $focus = $tr.find('td.focus').first();
  const focusTitle = text($focus.find('b').first());
  const focusSub = text($focus.find('span').first()) || undefined;

  const resourcesHtml = innerHtml($tr.find('td.res').first());
  const segments = resourcesHtml
    ? resourcesHtml.split(/<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean)
    : [];
  const resources = segments.map(parseResource);

  const est = text($tr.find('td.est').first());
  const handsHtml = innerHtml($tr.find('td.hands').first());

  return {
    n: dayN,
    focusTitle,
    focusSub,
    resources,
    est,
    hands: handsHtml || undefined,
  };
}

function parsePhaseRow(tr) {
  // Capstone W9 has phase|focus|est|tasks layout.
  const $tr = $(tr);
  const tds = $tr.find('td');
  const phase = text($(tds[0]).find('.daynum')) || text($(tds[0]));
  const $focus = $(tds[1]);
  const focusTitle = text($focus.find('b').first());
  const focusSub = text($focus.find('span').first()) || undefined;
  const est = text($(tds[2]));
  const tasksHtml = innerHtml($(tds[3]));
  return {
    n: phase,
    focusTitle,
    focusSub,
    resources: [],
    est,
    hands: tasksHtml || undefined,
  };
}

function variantOf($week) {
  if ($week.hasClass('moatwk')) return 'moat';
  if ($week.hasClass('claudewk')) return 'claude';
  if (($week.attr('style') ?? '').includes('dashed')) return 'elective';
  return 'default';
}

function detectStar($week) {
  const tag = text($week.find('.wtag').first());
  return tag.includes('★');
}

function parseSpecs($week) {
  const specs = [];
  $week.find('.spec').each((_, spec) => {
    const $s = $(spec);
    const heading = text($s.find('h4').first());
    const kind = $s.hasClass('pick') ? 'pick' : 'alt';
    const bullets = $s.find('ul li').map((_, li) => innerHtml(li)).get();
    const body = innerHtml($s.find('p').first()) || undefined;
    specs.push({ kind, heading, body, bullets: bullets.length ? bullets : undefined });
  });
  return specs;
}

// Determine which weeks belong to Part I vs II.
// Walk DOM in order; track current part based on .partbar occurrences.
const parts = [
  {
    id: 'part1',
    pn: text($('.partbar').eq(0).find('.pn')),
    title: text($('.partbar').eq(0).find('h2')),
    sub: text($('.partbar').eq(0).find('.sub')),
    weeks: [],
  },
  {
    id: 'part2',
    pn: text($('.partbar').eq(1).find('.pn')),
    title: text($('.partbar').eq(1).find('h2')),
    sub: text($('.partbar').eq(1).find('.sub')),
    weeks: [],
  },
];

const part2Bar = $('.partbar').get(1);
function partOfWeek(weekEl) {
  if (!part2Bar) return 0;
  const cmp = part2Bar.compareDocumentPosition?.(weekEl);
  // If part2Bar precedes weekEl: weekEl is part 2.
  // Cheerio nodes lack compareDocumentPosition; use index walk instead.
  if (cmp !== undefined) {
    return (cmp & 4) ? 1 : 0; // 4 = DOCUMENT_POSITION_FOLLOWING
  }
  // Fallback: compare positions in document order.
  const all = $('.partbar, section.week').toArray();
  const wIdx = all.indexOf(weekEl);
  const p2Idx = all.indexOf(part2Bar);
  return wIdx > p2Idx ? 1 : 0;
}

$('section.week').each((_, week) => {
  const $week = $(week);
  const id = $week.attr('id') ?? '';
  const tag = text($week.find('.wtag').first());
  const title = text($week.find('.wtitle').first());
  const hours = text($week.find('.whrs').first());
  const goal = innerHtml($week.find('.wgoal').first());
  const variant = variantOf($week);
  const star = detectStar($week);

  const isCapstone = id === 'w9';
  const rows = $week.find('tbody tr').toArray();
  const days = rows.map((tr, idx) => (isCapstone ? parsePhaseRow(tr) : parseDay(tr, idx)));

  const $foot = $week.find('.wfoot').first();
  const $udemy = $foot.find('.udemy').first();
  const udemy = innerHtml($udemy);
  const udemyNone = $udemy.hasClass('none');
  const deliverable = innerHtml($foot.find('.deliver').first());

  const specs = isCapstone ? parseSpecs($week) : undefined;

  const weekObj = {
    id,
    tag,
    title,
    hours,
    goal,
    variant,
    star,
    days,
    udemy,
    udemyNone,
    deliverable,
    ...(specs && specs.length ? { specs } : {}),
  };

  parts[partOfWeek(week)].weeks.push(weekObj);
});

// ---------- electives block ----------
const electives = [];
$('#electives ul').first().children('li').each((_, li) => {
  electives.push(innerHtml(li));
});

// ---------- time allocation summary ----------
const timeSummary = [];
// The time table is the .block right after #electives, identified by its first <th> being "Wk".
$('.block').each((_, blk) => {
  const $blk = $(blk);
  if (text($blk.find('h3').first()) === 'Time allocation summary') {
    $blk.find('table tbody tr').each((_, tr) => {
      const tds = $(tr).find('td');
      const wkCell = $(tds[0]);
      const star = wkCell.find('b').length > 0;
      const wk = text(wkCell);
      const topicCell = $(tds[1]);
      const topic = innerHtml(topicCell);
      const build = Number(text($(tds[2]))) || 0;
      const read = Number(text($(tds[3]))) || 0;
      const deliverable = text($(tds[4]));
      timeSummary.push({ wk, topic, build, read, deliverable, star });
    });
  }
});

// ---------- notes ----------
const notesBlock = $('.notes').first();
const noteSections = [];
let cur = null;
notesBlock.children().each((_, el) => {
  const tag = el.tagName?.toLowerCase();
  if (tag === 'h3') {
    if (cur) noteSections.push(cur);
    cur = { heading: text(el), paragraphs: [], bullets: [] };
  } else if (cur && tag === 'ul') {
    $(el).children('li').each((_, li) => cur.bullets.push(innerHtml(li)));
  } else if (cur && tag === 'p') {
    if ($(el).hasClass('sig')) cur.sig = innerHtml(el);
    else cur.paragraphs.push(innerHtml(el));
  }
});
if (cur) noteSections.push(cur);

const paidCourses = noteSections[0]?.bullets ?? [];
const buyingTip = noteSections[0]?.paragraphs?.[0] ?? '';
const pitfalls = noteSections[1]?.bullets ?? [];
const sig = noteSections[1]?.sig ?? '';

// ---------- assemble ----------
const roadmap = {
  meta,
  kicker,
  titleHtml,
  lede,
  courses,
  keyTopics,
  moat,
  resourceMap,
  howToStudy,
  setup,
  parts,
  electives,
  timeSummary,
  notes: { paidCourses, buyingTip, pitfalls, sig },
};

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(roadmap, null, 2) + '\n');

// ---------- audit ----------
let leafCount = 0;
let masterCount = 0;
for (const part of parts) {
  for (const wk of part.weeks) {
    for (const day of wk.days) {
      leafCount += day.resources.length;
      if (day.hands) leafCount += 1;
      masterCount += 1;
    }
  }
}
console.log(`✓ Parsed ${parts[0].weeks.length + parts[1].weeks.length} weeks across 2 parts.`);
console.log(`  Days/rows: ${masterCount}`);
console.log(`  Total leaves (resources + hands): ${leafCount}`);
console.log(`  Key topics: ${keyTopics.length}`);
console.log(`  Courses: ${courses.length}`);
console.log(`  Resource map rows: ${resourceMap.length}`);
console.log(`  Electives: ${electives.length}`);
console.log(`  Time summary rows: ${timeSummary.length}`);
console.log(`  Wrote ${outPath}`);
