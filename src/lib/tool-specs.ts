/**
 * Simuladores declarativos del sitio. Cada cifra viene de params-2026.json a través de las funciones puras
 * de engine/beca.ts y engine/fechas.ts. Una spec lista sus campos (visibles primero, `adv` plegados) y una
 * función `run` que da la tarjeta de resultado. Nada sale del navegador.
 */
import type { ToolSpec, V, ToolOut, Input } from './tool-types';
import { resolve } from './tool-types';
import { formatMoney, formatNumber, formatDecimal, displayDate, type Lang } from './format';
import * as B from './engine/beca';
import * as F from './engine/fechas';
import P from '../data/params-2026.json';
import { LAST_UPDATED } from '../data/site-config';

export type Args = Record<string, number | string>;
const T = (l: Lang, es: string, en: string) => (l === 'es' ? es : en);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k] ?? '');
const eur = (x: number, l: Lang) => formatMoney(x, Number.isInteger(Math.round(x * 100) / 100) ? 0 : 2, l);
const num = (x: number, l: Lang, d = 2) => formatDecimal(x, d, l);
const int = (x: number, l: Lang) => formatNumber(x, 0, l);
const day = (iso: string, l: Lang) => displayDate(iso, l === 'es' ? 'es-ES' : 'en-GB');
const pct = (x: number, l: Lang, d = 1) => (l === 'es' ? `${num(x, l, d)} %` : `${num(x, l, d)}%`);
const yn = (l: Lang) => [{ value: 'si', label: T(l, 'Sí', 'Yes') }, { value: 'no', label: T(l, 'No', 'No') }];
const ny = (l: Lang) => [{ value: 'no', label: T(l, 'No', 'No') }, { value: 'si', label: T(l, 'Sí', 'Yes') }];
const A = P.academico, CU = P.cuantias, CV = P.convocatoria;
const RD = 'RD 179/2026';
/* Liens écrits en dur (importer i18n/routes ferait une boucle : routes → pages → guides → tool-specs). check-liens les vérifie. */
const RENTA_LINK = (l: Lang) => ({ href: l === 'es' ? '/es/renta-familiar/' : '/en/family-income/', text: T(l, '¿No la sabes? Calcúlala aquí', 'Not sure? Work it out here') });
const RENTA_HELP = (l: Lang) => T(l, 'Para el curso 2026-2027 cuenta la renta de 2025. No es el sueldo: en la declaración de la renta de 2025 de cada miembro, base imponible general + base del ahorro − cuota resultante, y se suman.', 'For 2026-2027 the 2025 income counts. Not your pay: on each member\'s 2025 tax return, general tax base + savings tax base − tax due, added together.');
const MIEMBROS = (l: Lang) => T(l, 'Personas que cuentan en la familia', 'People counted in the household');
const ESTUDIO_HELP = (l: Lang) => T(l, 'El grado incluye las enseñanzas artísticas superiores.', 'Degree includes higher arts education.');
/** Lo que se pierde al pasar al umbral siguiente (cuantías del RD 179/2026). */
const pierde = (u: number, l: Lang) => [
  '',
  T(l, `pasarías al umbral 2 y perderías los ${eur(CU.renta, l)} ligados a la renta`, `you would move to threshold 2 and lose the ${eur(CU.renta, l)} income-linked amount`),
  T(l, 'pasarías al umbral 3 y perderías la residencia y la parte variable', 'you would move to threshold 3 and lose the residence amount and the variable amount'),
  T(l, 'te quedarías sin beca', 'you would get no grant at all'),
][u] ?? '';

/* ------------------------------------------------------------------ opciones comunes */
export const estudioOpts = (l: Lang) => [
  { value: 'grado', label: T(l, 'Grado universitario', 'University degree') },
  { value: 'master', label: T(l, 'Máster universitario', "Master's degree") },
  { value: 'bach', label: T(l, 'Bachillerato', 'Bachillerato (upper secondary)') },
  { value: 'fpm', label: T(l, 'FP de grado medio', 'Intermediate VET (FP grado medio)') },
  { value: 'fps', label: T(l, 'FP de grado superior', 'Higher VET (FP grado superior)') },
  { value: 'basico', label: T(l, 'Ciclo formativo de grado básico', 'Basic VET cycle (grado básico)') },
  { value: 'idiomas', label: T(l, 'Escuela oficial de idiomas', 'Official language school') },
];
export const estudioName = (e: string, l: Lang) => estudioOpts(l).find((o) => o.value === e)?.label ?? e;
export const ramaOpts = (l: Lang) => [
  { value: 'sociales', label: T(l, 'Ciencias Sociales y Jurídicas', 'Social Sciences and Law') },
  { value: 'artes', label: T(l, 'Artes y Humanidades', 'Arts and Humanities') },
  { value: 'salud', label: T(l, 'Ciencias de la Salud', 'Health Sciences') },
  { value: 'ciencias', label: T(l, 'Ciencias', 'Sciences') },
  { value: 'ingenieria', label: T(l, 'Ingeniería y Arquitectura', 'Engineering and Architecture') },
];
export const ramaName = (r: string, l: Lang) => ramaOpts(l).find((o) => o.value === r)?.label ?? r;
const cursoOpts = (l: Lang) => [{ value: 'primero', label: T(l, 'Primer curso', 'First year') }, { value: 'posterior', label: T(l, 'Segundo o posterior', 'Second year or later') }];
const matOpts = (l: Lang) => [
  { value: 'completa', label: T(l, 'Completa (60 créditos o curso entero)', 'Full (60 credits or whole year)') },
  { value: 'p48', label: T(l, 'Parcial de 48 a 59 créditos', 'Part-time, 48 to 59 credits') },
  { value: 'p30', label: T(l, 'Parcial de 30 a 47 créditos (o media FP)', 'Part-time, 30 to 47 credits (or half VET)') },
];
const modOpts = (l: Lang) => [{ value: 'presencial', label: T(l, 'Presencial', 'In person') }, { value: 'distancia', label: T(l, 'A distancia', 'Distance learning') }];
const insOpts = (l: Lang) => [
  { value: 'no', label: T(l, 'No vivo en una isla, Ceuta ni Melilla', 'Not on an island, Ceuta or Melilla') },
  { value: 'mayor', label: T(l, 'Isla mayor, Ceuta o Melilla: barco o avión dentro de la región', 'Main island, Ceuta or Melilla: boat or plane within the region') },
  { value: 'menor', label: T(l, 'Lanzarote, Fuerteventura, La Gomera, El Hierro, La Palma, Menorca, Ibiza o Formentera', 'Lanzarote, Fuerteventura, La Gomera, El Hierro, La Palma, Menorca, Ibiza or Formentera') },
  { value: 'mayorPeninsula', label: T(l, 'Isla mayor, Ceuta o Melilla, y estudio en la Península', 'Main island, Ceuta or Melilla, studying on the mainland') },
  { value: 'menorPeninsula', label: T(l, 'Isla menor citada arriba, y estudio en la Península', 'One of the smaller islands above, studying on the mainland') },
];
const discOpts = (l: Lang) => [{ value: 'no', label: T(l, 'Sin discapacidad o menos del 25 %', 'None, or under 25%') }, { value: 'd25', label: T(l, 'Del 25 % al 64 %', '25% to 64%') }, { value: 'd65', label: T(l, '65 % o más', '65% or more') }];
const umbralName = (u: number, l: Lang) => (u === 4 ? T(l, 'Por encima del umbral 3', 'Above threshold 3') : T(l, `Umbral ${u}`, `Threshold ${u}`));
export const compName = (c: B.Comp, l: Lang) => ({
  matricula: T(l, 'Beca de matrícula', 'Tuition waiver'),
  renta: T(l, 'Cuantía fija ligada a la renta', 'Fixed income-linked amount'),
  residencia: T(l, 'Cuantía fija ligada a la residencia', 'Fixed residence amount'),
  basica: T(l, 'Beca básica', 'Basic grant'),
  excelencia: T(l, 'Cuantía ligada a la excelencia', 'Academic excellence amount'),
  variable: T(l, 'Parte variable (mínimo seguro)', 'Variable amount (guaranteed minimum)'),
  variableMin: T(l, 'Parte variable mínima', 'Minimum variable amount'),
  insular: T(l, 'Cuantía adicional por insularidad', 'Island supplement'),
}[c]);
const motivo = (m: string | undefined, l: Lang) => ({
  umbral: T(l, 'La renta familiar supera el umbral 3: no hay ningún componente de beca.', 'Family income is above threshold 3: no grant component at all.'),
  patrimonio: T(l, 'El patrimonio familiar supera los umbrales (la suma de porcentajes pasa del 100 %): la beca se deniega sea cual sea la renta.', 'Family wealth is over the limits (the percentages add up to more than 100%): the grant is refused whatever the income.'),
  academico: T(l, 'Con estos datos no se cumple el requisito académico de la convocatoria.', 'With these figures the academic requirement of the call is not met.'),
}[m ?? ''] ?? '');

/* ------------------------------------------------------------------ simulador completo */
function becaInputs(l: Lang, a?: Args): Input[] {
  const out: Input[] = [
    { id: 'miembros', label: MIEMBROS(l), def: Number(a?.miembros ?? 4), max: 20, help: T(l, 'Tú, tus padres, tus hermanos solteros menores de 25 que viven en casa y los abuelos empadronados', 'You, your parents, unmarried siblings under 25 living at home and registered grandparents') },
    { id: 'renta', label: T(l, 'Renta de la familia en 2025, la que cuenta para la beca', 'Family income for 2025, as counted for the grant'), def: Number(a?.renta ?? 30000), unit: '€', max: 1e7, help: RENTA_HELP(l), link: RENTA_LINK(l) },
  ];
  if (!a?.estudio) out.push({ kind: 'select', id: 'estudio', label: T(l, 'Qué vas a estudiar en 2026-2027', 'What you will study in 2026-2027'), def: String(a?.defEstudio ?? 'grado'), options: estudioOpts(l), help: ESTUDIO_HELP(l), wide: true });
  out.push(
    { kind: 'choice', id: 'curso', label: T(l, 'Curso', 'Year'), def: String(a?.curso ?? 'primero'), options: cursoOpts(l) },
    { id: 'nota', label: T(l, 'Nota de acceso en 1.º, o media del curso pasado', 'Entry grade in year 1, or last year\'s average'), def: Number(a?.nota ?? 7), max: 10, decimals: 2, help: T(l, 'En 1.º de grado: 0,6 × media de bachillerato + 0,4 × PAU (selectividad)', 'Year 1 of a degree: 0.6 × upper secondary average + 0.4 × university entrance exam (PAU)') },
    { kind: 'choice', id: 'fuera', label: T(l, '¿Vivirás fuera de casa por el curso?', 'Will you live away from home for the year?'), def: String(a?.fuera ?? 'no'), options: ny(l), wide: true },
    { kind: 'select', id: 'mat', label: T(l, 'Matrícula', 'Enrolment'), def: 'completa', options: matOpts(l), adv: true, wide: true },
    { kind: 'choice', id: 'mod', label: T(l, 'Modalidad', 'Mode'), def: 'presencial', options: modOpts(l), help: T(l, 'Presencial incluye semipresencial (artículo 7).', 'In person includes blended study (article 7).'), adv: true, wide: true },
    { kind: 'select', id: 'rama', label: T(l, 'Rama de conocimiento', 'Field of study'), def: String(a?.rama ?? 'sociales'), options: ramaOpts(l), adv: true },
    { id: 'aprob', label: T(l, 'Créditos o módulos aprobados el curso pasado', 'Credits or modules passed last year'), def: 100, unit: '%', max: 100, adv: true, help: T(l, 'Sobre los matriculados; solo cuenta de 2.º en adelante', 'Out of those enrolled; only counts from year 2') },
    { id: 'pat', label: T(l, 'Patrimonio: suma de porcentajes', 'Wealth: sum of percentages'), def: 0, unit: '%', max: 1000, adv: true, help: T(l, 'Lo da la calculadora de patrimonio; por encima de 100 se deniega', 'From the wealth calculator; above 100 means refusal') },
    { kind: 'select', id: 'ins', label: T(l, 'Domicilio insular, Ceuta o Melilla', 'Island home, Ceuta or Melilla'), def: 'no', options: insOpts(l), adv: true, wide: true },
    { kind: 'choice', id: 'can', label: T(l, '¿Domicilio en Canarias?', 'Home in the Canary Islands?'), def: 'no', options: ny(l), adv: true },
    { kind: 'select', id: 'disc', label: T(l, 'Discapacidad del estudiante', "Student's disability"), def: 'no', options: discOpts(l), adv: true },
  );
  return out;
}
export function becaIn(v: V, a?: Args): B.BecaIn & { primero: boolean } {
  const estudio = String(a?.estudio ?? s(v, 'estudio') ?? 'grado') as B.Estudio;
  const primero = s(v, 'curso') === 'primero', rama = (s(v, 'rama') || 'sociales') as B.Rama;
  return {
    miembros: n(v, 'miembros'), renta: n(v, 'renta'), estudio, matricula: (s(v, 'mat') || 'completa') as B.Matricula,
    presencial: s(v, 'mod') !== 'distancia', fuera: s(v, 'fuera') === 'si', nota: n(v, 'nota'), rama, primero,
    academicoOk: B.academicoBasico(estudio, primero, n(v, 'nota'), rama, n(v, 'aprob')),
    patrimonioPct: n(v, 'pat'), insular: (s(v, 'ins') || 'no') as B.Insular, disc: (s(v, 'disc') || 'no') as B.Disc, canarias: s(v, 'can') === 'si',
  };
}
function lineRows(r: B.BecaOut, l: Lang): Array<[string, string, number?]> {
  const rows: Array<[string, string, number?]> = [];
  if (r.matricula) rows.push([compName('matricula', l), T(l, 'Créditos de 1.ª matrícula gratis', 'First-time credits free')]);
  for (const x of r.lineas) rows.push([compName(x.c, l), x.c === 'variable' ? `${eur(x.importe, l)} + ${T(l, 'reparto', 'share-out')}` : eur(x.importe, l), x.importe]);
  return rows;
}
function becaSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: becaInputs(l, a),
    run: (v) => {
      const x = becaIn(v, a), r = B.beca(x);
      const u = r.u;
      const rows: Array<[string, string, number?]> = r.ok ? lineRows(r, l) : [[T(l, 'Motivo', 'Reason'), motivo(r.motivo, l)]];
      rows.push([T(l, 'Umbral alcanzado (el 1 es el más favorable)', 'Threshold reached (1 is the best)'), umbralName(r.umbral, l)]);
      // Une seule phrase-réponse : oui ou non, puis le dinero seguro (fixes + minimum variable) et ce que le umbral fait perdre.
      const seguro = r.fijo > 0 ? T(l, ` Dinero seguro: ${eur(r.fijo, l)}`, ` Guaranteed money: ${eur(r.fijo, l)}`) : '';
      const incl = r.variable === 'no' ? '' : r.fijo === CU.variableMin ? T(l, ', el mínimo de la parte variable', ', the minimum of the variable amount') : T(l, `, que incluye el mínimo de ${eur(CU.variableMin, l)} de la parte variable`, `, including the ${eur(CU.variableMin, l)} minimum of the variable amount`);
      const resto = r.variable === 'formula' ? T(l, '. El resto de la parte variable se reparte al final del curso y nadie puede predecirlo al euro.', '. The rest of the variable amount is shared out at the end of the year and nobody can predict it to the euro.') : r.fijo > 0 ? '.' : '';
      const sinRenta = r.umbral === 2 || r.umbral === 3 ? T(l, ` En el umbral ${r.umbral} no hay los ${eur(CU.renta, l)} ligados a la renta: solo llegan al umbral 1.`, ` At threshold ${r.umbral} there is no ${eur(CU.renta, l)} income-linked amount: it only reaches threshold 1.`) : '';
      const mat = r.matricula ? T(l, ' La matrícula gratis no es dinero en tu cuenta: la universidad no te cobra los créditos nuevos.', ' Free tuition is not money in your account: the university does not charge you for first-time credits.') : '';
      const sub = r.ok ? `${T(l, 'Sí, tendrías beca.', 'Yes, you would get a grant.')}${seguro}${incl}${resto}${sinRenta}${mat}` : motivo(r.motivo, l);
      const basicaFuera = T(l, 'beca básica solo fuera de la universidad', 'basic grant only below university level');
      return {
        label: T(l, 'Tu beca estimada 2026-2027', 'Your estimated grant 2026-2027'),
        value: !r.ok ? T(l, 'Sin beca', 'No grant') : r.matricula ? (r.fijo > 0 ? T(l, `Matrícula gratis + ${eur(r.fijo, l)}`, `Free tuition + ${eur(r.fijo, l)}`) : T(l, 'Matrícula gratis', 'Free tuition')) : eur(r.fijo, l),
        sub, rows,
        table: {
          caption: T(l, `Umbrales de renta para ${int(x.miembros, l)} personas en la familia`, `Income thresholds for a household of ${int(x.miembros, l)}`),
          headers: [T(l, 'Umbral', 'Threshold'), T(l, 'Renta máxima', 'Maximum income'), T(l, 'Qué da', 'What it gives')],
          rows: [
            ['1', eur(u.u1, l), T(l, `Todo: ${eur(CU.renta, l)} por renta, residencia, excelencia, parte variable y matrícula gratis`, `Everything: ${eur(CU.renta, l)} income-linked, residence, excellence, variable amount and free tuition`)],
            ['2', eur(u.u2, l), T(l, `Residencia, excelencia, parte variable y matrícula gratis (${basicaFuera})`, `Residence, excellence, variable amount and free tuition (${basicaFuera})`)],
            ['3', eur(u.u3, l), T(l, `Matrícula gratis y excelencia (${basicaFuera})`, `Free tuition and excellence (${basicaFuera})`)],
          ], align: ['l', 'r', 'l'],
        },
        note: T(l, `Estimación orientativa con las cifras del BOE del ${day(P.rd.boe, l)}. Solo la resolución del Ministerio concede la beca.`, `Indicative estimate using the BOE figures of ${day(P.rd.boe, l)}. Only the Ministry's decision awards the grant.`),
      };
    },
  };
}

/* ------------------------------------------------------------------ umbrales */
function umbralesSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { id: 'miembros', label: MIEMBROS(l), def: Number(a?.miembros ?? 4), max: 20 },
      { id: 'renta', label: T(l, 'Renta de la familia en 2025, la que cuenta para la beca', 'Family income for 2025, as counted for the grant'), def: Number(a?.renta ?? 30000), unit: '€', max: 1e7, help: RENTA_HELP(l), link: RENTA_LINK(l) },
    ],
    run: (v) => {
      const m = Math.max(1, Math.floor(n(v, 'miembros'))), r = n(v, 'renta'), u = B.umbrales(m), um = B.umbralDe(r, m);
      const que = [
        '',
        T(l, 'Umbral 1, el más favorable: tienes todas las piezas de la beca.', 'Threshold 1, the best one: every part of the grant is open to you.'),
        T(l, `Tienes beca, pero sin los ${eur(CU.renta, l)} ligados a la renta, que solo llegan al umbral 1.`, `You get a grant, but without the ${eur(CU.renta, l)} income-linked amount, which only reaches threshold 1.`),
        T(l, 'Te quedan la matrícula gratis, la beca básica fuera de la universidad y la excelencia.', 'You keep free tuition, the basic grant below university level and excellence.'),
      ][um] ?? '';
      const lim = um === 1 ? u.u1 : um === 2 ? u.u2 : um === 3 ? u.u3 : 0;
      const sub = um === 4
        ? T(l, `Superas el umbral 3 en ${eur(r - u.u3, l)}: no hay beca general en 2026-2027.`, `You are ${eur(r - u.u3, l)} over threshold 3: no general grant in 2026-2027.`)
        : `${que} ${T(l, `Te quedan ${eur(lim - r, l)} de margen: con más renta ${pierde(um, l)}.`, `You have ${eur(lim - r, l)} of headroom: with more income ${pierde(um, l)}.`)}`;
      const rows: Array<[string, string, number?]> = [
        [T(l, 'Umbral 1', 'Threshold 1'), eur(u.u1, l), u.u1], [T(l, 'Umbral 2', 'Threshold 2'), eur(u.u2, l), u.u2], [T(l, 'Umbral 3', 'Threshold 3'), eur(u.u3, l), u.u3],
      ];
      return {
        label: T(l, `Tu umbral con ${int(m, l)} personas en la familia`, `Your threshold for a household of ${int(m, l)}`), value: umbralName(um, l), sub, rows,
        table: {
          caption: T(l, 'Umbrales de renta 2026-2027, en euros', 'Income thresholds 2026-2027, in euros'),
          headers: [T(l, 'Personas', 'People'), T(l, 'Umbral 1', 'Threshold 1'), T(l, 'Umbral 2', 'Threshold 2'), T(l, 'Umbral 3', 'Threshold 3')],
          rows: P.umbrales.tabla.map((t) => [int(t.m, l), eur(t.u1, l), eur(t.u2, l), eur(t.u3, l)]).concat([[T(l, 'Cada miembro más', 'Each extra member'), `+${eur(P.umbrales.adicional.u1, l)}`, `+${eur(P.umbrales.adicional.u2, l)}`, `+${eur(P.umbrales.adicional.u3, l)}`]]),
          align: ['l', 'r', 'r', 'r'],
        },
        note: T(l, 'Igual al umbral cuenta como no superarlo. La renta es la de 2025, no la de este año.', 'Being exactly on the threshold counts as not exceeding it. The income is 2025 income, not this year\'s.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ renta familiar */
const fnOpts = (l: Lang) => [{ value: 'no', label: T(l, 'No', 'No') }, { value: 'general', label: T(l, 'General', 'General') }, { value: 'especial', label: T(l, 'Especial', 'Special') }];
function rentaSpec(l: Lang): ToolSpec {
  return {
    inputs: [
      { id: 'sust', label: T(l, 'Renta de los padres (sustentadores)', "Parents' income (main earners)"), def: 32000, unit: '€', max: 1e7, help: T(l, 'Base imponible general + del ahorro − cuota resultante de la autoliquidación, de 2025', '2025 general + savings tax base − resulting tax due') },
      { id: 'otros', label: T(l, 'Renta del resto de miembros', 'Income of the other members'), def: 0, unit: '€', max: 1e7, help: T(l, 'Hermanos, abuelos o tú mismo: cuenta la mitad', 'Siblings, grandparents or yourself: half counts') },
      { id: 'miembros', label: T(l, 'Miembros computables', 'Members counted'), def: 4, max: 20 },
      { kind: 'select', id: 'fn', label: T(l, 'Familia numerosa', 'Large family'), def: 'no', options: fnOpts(l), adv: true },
      { id: 'hfn', label: T(l, 'Hermanos que cuentan (familia numerosa)', 'Siblings counted (large family)'), def: 0, max: 20, adv: true, help: T(l, 'Hijos que dan derecho al título, incluido tú', 'Children giving the right to the title, including you') },
      { id: 'd33', label: T(l, 'Miembros con discapacidad del 33 al 64 %', 'Members with 33-64% disability'), def: 0, max: 20, adv: true },
      { id: 'd65', label: T(l, 'Miembros con discapacidad del 65 % o más', 'Members with 65%+ disability'), def: 0, max: 20, adv: true },
      { kind: 'choice', id: 'sol65', label: T(l, '¿Eres tú, universitario, uno de ellos?', 'Are you, a university student, one of them?'), def: 'no', options: ny(l), adv: true },
      { id: 'fuera', label: T(l, 'Hijos estudiando fuera de casa (universidad)', 'Children studying away from home (university)'), def: 0, max: 20, adv: true, help: T(l, 'Solo deduce si son dos o más, tú incluido', 'Only deducted with two or more, including you') },
      { kind: 'choice', id: 'orf', label: T(l, '¿Orfandad absoluta?', 'Full orphan?'), def: 'no', options: ny(l), adv: true },
      { kind: 'choice', id: 'mono', label: T(l, '¿Familia monoparental?', 'Single-parent family?'), def: 'no', options: ny(l), adv: true },
    ],
    run: (v) => {
      const r = B.rentaFamiliar({ sustentadores: n(v, 'sust'), otros: n(v, 'otros'), fn: s(v, 'fn') as 'no', hermanosFn: n(v, 'hfn'), disc33: n(v, 'd33'), disc65: n(v, 'd65'), solicitanteUniv65: s(v, 'sol65') === 'si', fuera: n(v, 'fuera'), orfandad: s(v, 'orf') === 'si', monoparental: s(v, 'mono') === 'si' });
      const lab: Record<string, string> = {
        otros: T(l, 'Mitad de la renta del resto de miembros', 'Half of the other members\' income'), fn: T(l, 'Familia numerosa', 'Large family'), disc: T(l, 'Discapacidad', 'Disability'),
        fuera: T(l, 'Hijos universitarios fuera de casa', 'University children away from home'), mono: T(l, 'Familia monoparental', 'Single-parent family'), orf: T(l, 'Orfandad absoluta (20 %)', 'Full orphan (20%)'),
      };
      const um = B.umbralDe(r.computable, n(v, 'miembros'));
      const rows: Array<[string, string, number?]> = [[T(l, 'Renta sumada', 'Income added up'), eur(r.bruta, l)]];
      for (const [k, x] of r.deducciones) rows.push([`− ${lab[k]}`, eur(x, l), x]);
      rows.push([T(l, 'Umbral con esta renta', 'Threshold with this income'), umbralName(um, l)]);
      return {
        label: T(l, 'Renta familiar a efectos de beca', 'Family income for the grant'), value: eur(r.computable, l),
        sub: T(l, `${RD}, arts. 9 y 10: deducciones aplicadas a la renta de 2025.`, `${RD}, arts. 9 and 10: deductions applied to 2025 income.`), rows,
        note: T(l, 'El Ministerio cruza los datos con la Agencia Tributaria: la cifra exacta es la suya.', 'The Ministry cross-checks with the Tax Agency: its figure is the one that counts.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ patrimonio */
function patrimonioSpec(l: Lang): ToolSpec {
  return {
    inputs: [
      { id: 'urb', label: T(l, 'Valor catastral de inmuebles urbanos (sin la vivienda habitual)', 'Cadastral value of urban property (excluding the main home)'), def: 60000, unit: '€', max: 1e8, wide: true },
      { id: 'anio', label: T(l, 'Año de la última revisión catastral', 'Year of the last cadastral revaluation'), def: 2010, max: 2025, help: T(l, 'Figura en el recibo del IBI o en la Sede del Catastro', 'Shown on the property-tax bill or the Cadastre e-office') },
      { id: 'cap', label: T(l, 'Rendimientos del capital mobiliario y ganancias', 'Investment income and gains'), def: 300, unit: '€', max: 1e8, help: T(l, 'Intereses, dividendos y ganancias patrimoniales de 2025, menos las pérdidas', '2025 interest, dividends and gains, net of losses') },
      { id: 'rus', label: T(l, 'Valor catastral de fincas rústicas', 'Cadastral value of rural land'), def: 0, unit: '€', max: 1e8, adv: true },
      { id: 'cons', label: T(l, 'Construcciones en fincas rústicas', 'Buildings on rural land'), def: 0, unit: '€', max: 1e8, adv: true },
      { id: 'miembros', label: T(l, 'Miembros computables', 'Members counted'), def: 4, max: 20, adv: true },
      { id: 'act', label: T(l, 'Volumen de negocio de actividades', 'Business turnover'), def: 0, unit: '€', max: 1e9, adv: true },
      { kind: 'choice', id: 'nav', label: T(l, '¿Inmuebles en Navarra?', 'Property in Navarre?'), def: 'no', options: ny(l), adv: true },
    ],
    run: (v) => {
      const r = B.patrimonio({ urbanas: n(v, 'urb'), anioRevision: n(v, 'anio'), navarra: s(v, 'nav') === 'si', construccionesRusticas: n(v, 'cons'), rusticas: n(v, 'rus'), capital: n(v, 'cap'), miembros: n(v, 'miembros'), actividades: n(v, 'act') });
      const lab: Record<string, string> = { urbanas: T(l, 'Inmuebles urbanos', 'Urban property'), construcciones: T(l, 'Construcciones rústicas', 'Rural buildings'), rusticas: T(l, 'Fincas rústicas', 'Rural land'), capital: T(l, 'Capital mobiliario', 'Investment income') };
      const rows: Array<[string, string, number?]> = r.partes.filter(([, x]) => x > 0).map(([k, x]) => [lab[k], pct(x, l), x]);
      rows.push([T(l, 'Coeficiente catastral aplicado', 'Cadastral coefficient applied'), num(r.coef, l)]);
      if (r.actividadesSupera) rows.push([T(l, 'Actividades', 'Business'), T(l, `más de ${eur(P.patrimonio.actividades, l)}`, `over ${eur(P.patrimonio.actividades, l)}`)]);
      return {
        label: T(l, 'Suma de porcentajes del patrimonio', 'Sum of wealth percentages'), value: pct(r.suma, l),
        sub: r.deniega
          ? T(l, `Se deniega la beca (${RD}, art. 11): la suma supera el 100 % o el volumen de negocio pasa de ${eur(P.patrimonio.actividades, l)}.`, `The grant is refused (${RD}, art. 11): the sum is over 100% or turnover exceeds ${eur(P.patrimonio.actividades, l)}.`)
          : T(l, 'Por debajo del 100 %: el patrimonio no impide la beca.', 'Below 100%: wealth does not block the grant.'),
        rows,
        note: T(l, `Límites del ${RD}: ${eur(P.patrimonio.urbanas, l)} en urbanos (tras el coeficiente), ${eur(P.patrimonio.rusticasPorMiembro, l)} de rústicas por miembro, ${eur(P.patrimonio.capital, l)} de capital mobiliario.`, `${RD} limits: ${eur(P.patrimonio.urbanas, l)} for urban property (after the coefficient), ${eur(P.patrimonio.rusticasPorMiembro, l)} of rural land per member, ${eur(P.patrimonio.capital, l)} of investment income.`),
      };
    },
  };
}

/* ------------------------------------------------------------------ cuantías por umbral */
function cuantiasSpec(l: Lang): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'estudio', label: T(l, 'Estudios', 'Studies'), def: 'grado', options: estudioOpts(l), help: ESTUDIO_HELP(l), wide: true },
      { kind: 'select', id: 'um', label: T(l, 'Umbral de tu familia', 'Your household threshold'), def: '2', options: [1, 2, 3].map((u) => ({ value: String(u), label: umbralName(u, l) })), help: T(l, '¿No lo sabes? Lo calcula la portada o la calculadora de abajo; la tabla compara los tres.', 'Not sure? The home page or the calculator below works it out; the table compares all three.'), wide: true },
      { kind: 'choice', id: 'fuera', label: T(l, '¿Fuera de casa?', 'Away from home?'), def: 'si', options: yn(l) },
      { id: 'nota', label: T(l, 'Nota media', 'Average grade'), def: 7, max: 10, decimals: 2 },
      { kind: 'select', id: 'mat', label: T(l, 'Matrícula', 'Enrolment'), def: 'completa', options: matOpts(l), adv: true, wide: true },
      { kind: 'choice', id: 'mod', label: T(l, 'Modalidad', 'Mode'), def: 'presencial', options: modOpts(l), help: T(l, 'Presencial incluye semipresencial (artículo 7).', 'In person includes blended study (article 7).'), adv: true, wide: true },
    ],
    run: (v) => {
      const e = s(v, 'estudio') as B.Estudio, u = B.umbrales(4);
      const calc = (k: number) => B.beca({ miembros: 4, renta: k === 1 ? u.u1 : k === 2 ? u.u2 : u.u3, estudio: e, matricula: (s(v, 'mat') || 'completa') as B.Matricula, presencial: s(v, 'mod') !== 'distancia', fuera: s(v, 'fuera') === 'si', nota: n(v, 'nota'), rama: 'sociales', primero: true, academicoOk: true, patrimonioPct: 0, insular: 'no', disc: 'no' });
      const k = Number(s(v, 'um')) || 1, r = calc(k);
      const all = [1, 2, 3].map(calc);
      const comps: B.Comp[] = ['renta', 'residencia', 'basica', 'excelencia', 'variable', 'variableMin'];
      const cell = (b: B.BecaOut, c: B.Comp) => { const x = b.lineas.find((y) => y.c === c); return x ? eur(x.importe, l) : '–'; };
      return {
        label: T(l, `${umbralName(k, l)}: dinero seguro`, `${umbralName(k, l)}: guaranteed money`), value: r.fijo > 0 ? eur(r.fijo, l) : T(l, 'Solo matrícula', 'Tuition only'),
        sub: T(l, `${estudioName(e, l)}, curso 2026-2027. Es la suma de las líneas de abajo: cuantías fijas más el mínimo de la parte variable${r.matricula ? '; la matrícula gratis va aparte' : ''}.`, `${estudioName(e, l)}, 2026-2027. It is the sum of the lines below: fixed amounts plus the minimum of the variable amount${r.matricula ? '; free tuition comes on top' : ''}.`),
        rows: lineRows(r, l),
        table: {
          caption: T(l, 'Los tres umbrales, mismos estudios', 'All three thresholds, same studies'),
          headers: [T(l, 'Pieza', 'Component'), T(l, 'Umbral 1', 'Threshold 1'), T(l, 'Umbral 2', 'Threshold 2'), T(l, 'Umbral 3', 'Threshold 3')],
          rows: [
            ...(all[0].matricula || all[2].matricula ? [[compName('matricula', l), ...all.map((b) => (b.matricula ? T(l, 'sí', 'yes') : '–'))]] : []),
            ...comps.filter((c) => all.some((b) => b.lineas.some((x) => x.c === c))).map((c) => [compName(c, l), ...all.map((b) => cell(b, c))]),
            [T(l, 'Total seguro (fijas + mínimo variable)', 'Guaranteed total (fixed + variable minimum)'), ...all.map((b) => (b.fijo === 0 && b.matricula ? T(l, 'solo matrícula', 'tuition only') : eur(b.fijo, l)))],
          ], align: ['l', 'r', 'r', 'r'],
        },
      };
    },
  };
}

/* ------------------------------------------------------------------ cuantía variable */
function variableSpec(l: Lang): ToolSpec {
  return {
    inputs: [
      { id: 'nota', label: T(l, 'Tu nota media (Nj)', 'Your average grade (Nj)'), def: 7.5, max: 10, decimals: 2 },
      { id: 'renta', label: T(l, 'Renta familiar', 'Family income'), def: 20000, unit: '€', max: 1e7 },
      { id: 'miembros', label: T(l, 'Miembros computables', 'Members counted'), def: 4, max: 20 },
      { id: 'nmax', label: T(l, 'Nota del mejor decil (Nmax), hipótesis', 'Top-decile grade (Nmax), assumption'), def: 10, max: 10, decimals: 2, adv: true, help: T(l, 'El Ministerio no la publica antes del reparto', 'The Ministry does not publish it before the share-out') },
      { id: 'rmax', label: T(l, 'Renta per cápita máxima (Rmax), hipótesis', 'Maximum per-capita income (Rmax), assumption'), def: 0, unit: '€', max: 1e7, adv: true, help: T(l, '0 = umbral 2 dividido entre los miembros', '0 = threshold 2 divided by members') },
    ],
    run: (v) => {
      const m = Math.max(1, Math.floor(n(v, 'miembros'))), u = B.umbrales(m);
      const rj = Math.max(0, n(v, 'renta') / m), rmax = n(v, 'rmax') > 0 ? n(v, 'rmax') : u.u2 / m;
      const nmax = Math.max(0.01, n(v, 'nmax')), fn = Math.min(1.5, n(v, 'nota') / nmax), fr = Math.max(0, 1 - rj / rmax);
      const idx = fn * fr, fuera = B.umbralDe(n(v, 'renta'), m) > 2;
      return {
        label: T(l, 'Tu peso en el reparto (Nj/Nmax) × (1 − Rj/Rmax)', 'Your weight in the share-out (Nj/Nmax) × (1 − Rj/Rmax)'),
        value: fuera ? T(l, 'Sin variable', 'No variable') : num(idx, l, 3),
        sub: fuera
          ? T(l, 'Por encima del umbral 2 no hay cuantía variable.', 'Above threshold 2 there is no variable amount.')
          : T(l, `Mínimo garantizado: ${eur(CU.variableMin, l)}. El resto depende del crédito sobrante y de todos los becarios: el importe en euros no se puede prever.`, `Guaranteed minimum: ${eur(CU.variableMin, l)}. The rest depends on leftover funds and all other grant holders: the euro amount cannot be forecast.`),
        rows: [
          [T(l, 'Factor nota Nj/Nmax', 'Grade factor Nj/Nmax'), num(fn, l, 3), fn],
          [T(l, 'Renta per cápita Rj', 'Per-capita income Rj'), eur(rj, l)],
          [T(l, 'Factor renta 1 − Rj/Rmax', 'Income factor 1 − Rj/Rmax'), num(fr, l, 3), fr],
          [T(l, 'Umbral alcanzado', 'Threshold reached'), umbralName(B.umbralDe(n(v, 'renta'), m), l)],
        ],
        note: T(l, 'Convocatoria, art. 10: Cj = Cmin + (Ctotal − S·Cmin) × peso / suma de pesos. Ctotal, S y la suma solo los conoce el Ministerio.', 'Call, art. 10: Cj = Cmin + (Ctotal − S·Cmin) × weight / sum of weights. Ctotal, S and the sum are known only to the Ministry.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ requisitos académicos */
const nivelOpts = (l: Lang) => [
  { value: 'grado2', label: T(l, 'Grado, 2.º curso o posterior', 'Degree, year 2 or later') },
  { value: 'grado1', label: T(l, 'Grado, primer curso', 'Degree, first year') },
  { value: 'master1', label: T(l, 'Máster, primer curso', "Master's, first year") },
  { value: 'master2', label: T(l, 'Máster, segundo curso', "Master's, second year") },
  { value: 'nu1', label: T(l, 'Bachillerato o FP superior, primer curso', 'Bachillerato or higher VET, first year') },
  { value: 'nu2', label: T(l, 'Bachillerato o FP, 2.º curso o posterior', 'Bachillerato or VET, year 2 or later') },
];
function requisitosSpec(l: Lang): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'nivel', label: T(l, 'Tu caso', 'Your case'), def: 'grado2', options: nivelOpts(l), wide: true },
      { kind: 'select', id: 'rama', label: T(l, 'Rama', 'Field'), def: 'sociales', options: ramaOpts(l) },
      { id: 'mat', label: T(l, 'Créditos matriculados el curso pasado', 'Credits enrolled last year'), def: 60, max: 120 },
      { id: 'apr', label: T(l, 'Créditos aprobados', 'Credits passed'), def: 54, max: 120 },
      { id: 'nota', label: T(l, 'Nota (acceso, media previa o del curso)', 'Grade (entry, previous or year average)'), def: 6.5, max: 14, decimals: 2, help: T(l, 'Solo cuenta en primeros cursos y en máster', 'Only counts for first years and master\'s') },
    ],
    run: (v) => {
      const nv = s(v, 'nivel'), rama = (s(v, 'rama') || 'sociales') as B.Rama, nota = n(v, 'nota');
      let ok = false, value = '', sub = '';
      const rows: Array<[string, string, number?]> = [];
      if (nv === 'grado2') {
        const c = B.cumpleGrado(rama, n(v, 'mat'), n(v, 'apr'));
        ok = c.ok; value = pct(c.hecho, l);
        rows.push([T(l, 'Porcentaje exigido', 'Percentage required'), pct(c.exigido, l)], [T(l, 'Base de la rama', 'Field base'), pct(B.porcentajeRama(rama), l)]);
        sub = T(l, `Convocatoria, arts. 24 y 26: ${ramaName(rama, l)} exige el ${pct(c.exigido, l)} de lo matriculado${n(v, 'mat') > A.creditosCompleta ? ' (rebajado por matricular más de 60 créditos)' : ''}.`, `Call, arts. 24 and 26: ${ramaName(rama, l)} requires ${pct(c.exigido, l)} of credits enrolled${n(v, 'mat') > A.creditosCompleta ? ' (lowered for enrolling over 60 credits)' : ''}.`);
      } else if (nv === 'master2') {
        const hecho = n(v, 'mat') > 0 ? (n(v, 'apr') / n(v, 'mat')) * 100 : 0;
        ok = hecho >= 100 - 1e-9 && nota >= A.notaMinima; value = pct(hecho, l);
        sub = T(l, 'Convocatoria, art. 29: todos los créditos de 1.º aprobados y media de 5.', 'Call, art. 29: every first-year credit passed and an average of 5.');
      } else {
        const coef = nv === 'master1' && rama === 'ingenieria' ? A.masterCoefTecnicas : 1;
        const nc = nota * coef; ok = nv === 'nu2' ? (n(v, 'mat') > 0 && n(v, 'apr') / n(v, 'mat') * 100 >= A.noUnivModulosHoras) : nc >= A.notaMinima;
        value = nv === 'nu2' ? pct(n(v, 'mat') > 0 ? (n(v, 'apr') / n(v, 'mat')) * 100 : 0, l) : num(nc, l);
        if (coef !== 1) rows.push([T(l, 'Coeficiente de enseñanzas técnicas', 'Technical studies coefficient'), num(coef, l)]);
        sub = nv === 'nu2'
          ? T(l, `Convocatoria, arts. 33 y 34: por módulos, el ${pct(A.noUnivModulosHoras, l, 0)} de las horas; por asignaturas, todas menos una.`, `Call, arts. 33 and 34: by modules, ${pct(A.noUnivModulosHoras, l, 0)} of the hours; by subjects, all but one.`)
          : T(l, `Nota mínima de ${num(A.notaMinima, l)} (convocatoria, arts. 24, 29 y 33).`, `Minimum grade ${num(A.notaMinima, l)} (call, arts. 24, 29 and 33).`);
      }
      rows.unshift([T(l, 'Resultado', 'Result'), ok ? T(l, 'Cumple', 'Meets it') : T(l, 'No cumple', 'Does not meet it')]);
      return { label: T(l, 'Tu requisito académico', 'Your academic requirement'), value, sub, rows };
    },
  };
}

/* ------------------------------------------------------------------ nota media y excelencia */
function notaSpec(l: Lang): ToolSpec {
  const pri = (v: V) => s(v, 'curso') !== 'posterior';
  const exTxt = (nota: number, imp: number) => imp > 0 ? eur(imp, l)
    : T(l, `Sin excelencia: te faltan ${num(CU.excelencia[0].desde - nota, l)} puntos para ${eur(CU.excelencia[0].importe, l)}`, `No excellence: ${num(CU.excelencia[0].desde - nota, l)} points short of ${eur(CU.excelencia[0].importe, l)}`);
  return {
    inputs: [
      { kind: 'choice', id: 'curso', label: T(l, '¿En qué curso estarás?', 'Which year will you be in?'), def: 'primero', options: [{ value: 'primero', label: T(l, 'Primero de grado', 'First year') }, { value: 'posterior', label: T(l, 'Segundo o más', 'Second or later') }], wide: true },
      { id: 'nmb', label: T(l, 'Nota media de bachillerato', 'Upper secondary average'), def: 8, max: 10, decimals: 2, when: pri },
      { id: 'pau', label: T(l, 'Nota de la PAU (selectividad), parte obligatoria', 'University entrance exam (PAU), compulsory part'), def: 7, max: 10, decimals: 2, when: pri, help: T(l, 'Materias comunes y de modalidad; no la fase para subir nota', 'Core and track subjects; not the optional part for raising your score') },
      { id: 'media2', label: T(l, 'Tu nota media del curso pasado', 'Your average last year'), def: 7.8, max: 10, decimals: 2, when: (v) => !pri(v) },
      { kind: 'select', id: 'rama', label: T(l, 'Rama de tu grado', 'Your degree field'), def: 'sociales', options: ramaOpts(l), when: (v) => !pri(v) },
    ],
    run: (v) => {
      const acc = B.notaAcceso(n(v, 'nmb'), n(v, 'pau')), rama = (s(v, 'rama') || 'sociales') as B.Rama;
      const caption = T(l, 'Cuantía de excelencia según la nota', 'Excellence amount by grade');
      const table = {
        caption, headers: [T(l, 'Nota', 'Grade'), T(l, 'Cuantía', 'Amount')],
        rows: CU.excelencia.map((t, i, arr) => [i < arr.length - 1 ? `${num(t.desde, l)} – ${num(arr[i + 1].desde - 0.01, l)}` : T(l, `${num(t.desde, l)} o más`, `${num(t.desde, l)} or more`), eur(t.importe, l)]),
        align: ['l', 'r'] as Array<'l' | 'r'>,
      };
      if (pri(v)) {
        const ex1 = B.excelencia(acc);
        return {
          label: T(l, 'Tu nota de acceso para la beca', 'Your entry grade for the grant'), value: num(acc, l),
          sub: acc >= A.notaMinima ? T(l, `Llega al ${num(A.notaMinima, l)} que pide la convocatoria para tener beca en primero.`, `It reaches the ${num(A.notaMinima, l)} the call requires for a grant in year one.`) : T(l, `No llega al ${num(A.notaMinima, l)}: sin beca en 1.º de grado.`, `Below ${num(A.notaMinima, l)}: no grant in year 1 of a degree.`),
          rows: [
            [T(l, 'Cálculo', 'Working'), `${num(A.notaAcceso.bachillerato, l, 1)} × ${num(n(v, 'nmb'), l)} + ${num(A.notaAcceso.pau, l, 1)} × ${num(n(v, 'pau'), l)}`],
            [T(l, 'Excelencia', 'Excellence'), exTxt(acc, ex1), ex1],
          ],
          table,
          note: T(l, 'En primero no se aplica ningún coeficiente de rama.', 'No field coefficient applies in year one.'),
        };
      }
      const c = B.coefExcelencia(rama), m2 = n(v, 'media2') * c, ex2 = B.excelencia(m2);
      return {
        label: T(l, 'Tu media para la excelencia', 'Your average for excellence'), value: num(m2, l),
        sub: T(l, `Tu media × ${num(c, l)}, el coeficiente de ${ramaName(rama, l)}. Desde segundo, el requisito para tener beca es aprobar un porcentaje de créditos: la nota sirve para la excelencia.`, `Your average × ${num(c, l)}, the coefficient for ${ramaName(rama, l)}. From year two, the grant requirement is passing a share of credits: the grade counts for excellence.`),
        rows: [
          [T(l, 'Cálculo', 'Working'), `${num(n(v, 'media2'), l)} × ${num(c, l)}`],
          [T(l, 'Excelencia', 'Excellence'), exTxt(m2, ex2), ex2],
        ],
        table,
        note: T(l, 'Coeficientes de la convocatoria: 1,17 ingeniería y arquitectura, 1,11 ciencias, 1,05 salud; 1 en las demás ramas.', 'Call coefficients: 1.17 engineering and architecture, 1.11 sciences, 1.05 health; 1 in other fields.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ residencia */
function residenciaSpec(l: Lang): ToolSpec {
  return {
    inputs: [
      { id: 'miembros', label: MIEMBROS(l), def: 4, max: 20 },
      { id: 'renta', label: T(l, 'Renta de la familia en 2025, la que cuenta para la beca', 'Family income for 2025, as counted for the grant'), def: 30000, unit: '€', max: 1e7, help: RENTA_HELP(l), link: RENTA_LINK(l) },
      { kind: 'select', id: 'estudio', label: T(l, 'Estudios', 'Studies'), def: 'grado', options: estudioOpts(l), help: ESTUDIO_HELP(l), wide: true },
      { kind: 'select', id: 'mat', label: T(l, 'Matrícula', 'Enrolment'), def: 'completa', options: matOpts(l), adv: true, wide: true },
      { kind: 'choice', id: 'mod', label: T(l, 'Modalidad', 'Mode'), def: 'presencial', options: modOpts(l), help: T(l, 'Presencial incluye semipresencial (artículo 7).', 'In person includes blended study (article 7).'), adv: true, wide: true },
      { kind: 'select', id: 'disc', label: T(l, 'Discapacidad del estudiante', "Student's disability"), def: 'no', options: discOpts(l), adv: true },
    ],
    run: (v) => {
      const r = B.beca({ miembros: n(v, 'miembros'), renta: n(v, 'renta'), estudio: s(v, 'estudio') as B.Estudio, matricula: (s(v, 'mat') || 'completa') as B.Matricula, presencial: s(v, 'mod') !== 'distancia', fuera: true, nota: 0, rama: 'sociales', primero: false, academicoOk: true, patrimonioPct: 0, insular: 'no', disc: (s(v, 'disc') || 'no') as B.Disc });
      const res = r.lineas.find((x) => x.c === 'residencia')?.importe ?? 0;
      const why = res > 0 ? T(l, 'Sí. Se paga solo si acreditas alquiler, residencia o pensión, y nunca más que el gasto real.', 'Yes. Paid only if you prove rent, a hall or lodging, and never above the real cost.')
        : r.umbral > 2 ? T(l, `Renta por encima del umbral 2 (${eur(r.u.u2, l)}).`, `Income above threshold 2 (${eur(r.u.u2, l)}).`)
          : T(l, 'Estos estudios o esta matrícula no dan derecho a la residencia.', 'These studies or this enrolment do not qualify for the residence amount.');
      return {
        label: T(l, 'Cuantía ligada a la residencia', 'Residence amount'), value: eur(res, l), sub: why,
        rows: [
          [T(l, 'Umbral alcanzado (el 1 es el más favorable)', 'Threshold reached (1 is the best)'), umbralName(r.umbral, l)], [T(l, 'Límite del umbral 2', 'Threshold 2 limit'), eur(r.u.u2, l)],
          ...r.lineas.filter((x) => x.c !== 'residencia').map((x) => [compName(x.c, l), eur(x.importe, l), x.importe] as [string, string, number]),
          [T(l, 'Total seguro con residencia', 'Guaranteed total with residence'), eur(r.fijo, l), r.fijo],
        ],
        note: T(l, 'Sin excelencia: esta calculadora no pide la nota.', 'Excellence not included: this calculator does not ask for your grade.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ beca de matrícula */
function matriculaSpec(l: Lang): ToolSpec {
  return {
    inputs: [
      { id: 'cred', label: T(l, 'Créditos de primera matrícula', 'First-time credits'), def: 60, max: 120 },
      { id: 'precio', label: T(l, 'Precio del crédito en tu universidad', 'Price per credit at your university'), def: 20, unit: '€', max: 500, decimals: 2, help: T(l, 'Está en la web de tu universidad (precios públicos o tasas) o en el recibo de la matrícula; 20 € es solo un ejemplo', 'It is on your university\'s website (public fees) or on your enrolment bill; €20 is only an example') },
      { id: 'seg', label: T(l, 'Créditos en segunda o más matrícula', 'Credits taken a second time or more'), def: 0, max: 120 },
      { id: 'precio2', label: T(l, 'Precio del crédito repetido', 'Price per repeated credit'), def: 30, unit: '€', max: 500, decimals: 2, adv: true },
      { id: 'miembros', label: MIEMBROS(l), def: 4, max: 20, adv: true },
      { id: 'renta', label: T(l, 'Renta de la familia en 2025, la que cuenta para la beca', 'Family income for 2025, as counted for the grant'), def: 30000, unit: '€', max: 1e7, adv: true, help: RENTA_HELP(l) },
    ],
    run: (v) => {
      const um = B.umbralDe(n(v, 'renta'), n(v, 'miembros')), cubre = um <= 3;
      const val = cubre ? B.valorMatricula(n(v, 'cred'), n(v, 'precio')) : 0, pagas = B.valorMatricula(n(v, 'seg'), n(v, 'precio2')) + (cubre ? 0 : B.valorMatricula(n(v, 'cred'), n(v, 'precio')));
      return {
        label: T(l, 'Lo que cubre la beca de matrícula', 'What the tuition waiver covers'), value: eur(val, l),
        sub: cubre ? T(l, 'Hasta el umbral 3, los créditos de primera matrícula son gratis. Los créditos repetidos no.', 'Up to threshold 3, first-time credits are free. Repeated credits are not.') : T(l, 'Por encima del umbral 3 no hay beca de matrícula.', 'Above threshold 3 there is no tuition waiver.'),
        rows: [[T(l, 'Pagas tú', 'You pay'), eur(pagas, l), pagas], [T(l, `Umbral con ${int(n(v, 'miembros'), l)} personas y ${eur(n(v, 'renta'), l)} de renta`, `Threshold for ${int(n(v, 'miembros'), l)} people and ${eur(n(v, 'renta'), l)} income`), umbralName(um, l)]],
        note: T(l, 'La familia y la renta se cambian en «Más datos de tu caso». El precio del crédito lo fija cada comunidad: este sitio no lo ha recogido y te pide el tuyo.', 'Household and income can be changed under «More about your case». Each region sets the credit price: this site has not collected them and asks for yours.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ calendario */
/** `quien` : qui agit ce jour-là (test naïf du 2026-11-08 : « 26 jours, je dois faire quoi ? »). `art` reste dans le code, pas à l'écran. */
export type Quien = 'boe' | 'tu' | 'admin' | 'tardia';
export interface Hito { iso: string; es: string; en: string; art: string; quien: Quien }
export const HITOS: Hito[] = [
  { iso: P.rd.boe, es: 'Se publican los umbrales y cuantías en el BOE', en: 'Thresholds and amounts published in the Official Gazette (BOE)', art: 'BOE', quien: 'boe' },
  { iso: CV.extractoBoe, es: 'Se publica la convocatoria en el BOE', en: 'The call is published in the BOE', art: 'BOE', quien: 'boe' },
  { iso: CV.plazoInicio, es: 'Se abre el plazo para pedir la beca (8:00)', en: 'Application window opens (8:00)', art: 'art. 48.1', quien: 'tu' },
  { iso: CV.plazoFin, es: 'Cierra el plazo, ya prorrogado (15:00, hora peninsular)', en: 'Window closes, after extension (15:00 mainland time)', art: 'prórroga BOE', quien: 'tu' },
  { iso: CV.datosPersonalesHasta, es: 'Las comunidades y universidades terminan de revisar los datos personales y familiares', en: 'Regions and universities finish checking personal and family data', art: 'art. 51.4', quien: 'admin' },
  { iso: CV.ccaaComunicanFijas, es: 'Las comunidades y universidades envían al Ministerio las notas y las cuantías fijas', en: 'Regions and universities send grades and fixed amounts to the Ministry', art: 'art. 51.8 y 51.10', quien: 'admin' },
  { iso: CV.solicitudTardiaHasta, es: 'Último día de solicitud tardía, solo si el sustentador principal fallece o se jubila de forma forzosa', en: 'Last day for a late application, only if the main earner dies or is forced to retire', art: 'art. 48.2', quien: 'tardia' },
];
export const quienTxt = (q: Quien, l: Lang) => ({
  boe: T(l, 'Publicación oficial', 'Official publication'),
  tu: T(l, 'Tú: pedir la beca', 'You: apply'),
  admin: T(l, 'La administración: tú no haces nada', 'The authorities: nothing for you to do'),
  tardia: T(l, 'Solo casos excepcionales', 'Exceptional cases only'),
}[q]);
function calendarioSpec(l: Lang): ToolSpec {
  return {
    exemple: false,
    inputs: [
      { id: 'dia', label: T(l, 'Día de hoy', 'Today: day'), def: Number(LAST_UPDATED.slice(8, 10)), max: 31 },
      { kind: 'select', id: 'mes', label: T(l, 'Mes', 'Month'), def: String(Number(LAST_UPDATED.slice(5, 7))), options: Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: new Date(Date.UTC(2026, i, 15)).toLocaleDateString(l === 'es' ? 'es-ES' : 'en-GB', { month: 'long', timeZone: 'UTC' }) })) },
      { id: 'anio', label: T(l, 'Año', 'Year'), def: Number(LAST_UPDATED.slice(0, 4)), max: 2030 },
    ],
    run: (v) => {
      const hoy = F.fecha(n(v, 'dia'), Number(s(v, 'mes')), n(v, 'anio'));
      const prox = HITOS.find((h) => h.iso >= hoy);
      const cerrado = hoy > CV.plazoFin;
      const tuParte = !prox ? '' : prox.quien === 'admin'
        ? T(l, ' Tú no tienes que hacer nada ese día: es un trámite entre administraciones.', ' You have nothing to do that day: it is a step between authorities.')
        : prox.quien === 'tardia' ? T(l, ' Si no es tu caso, no tienes que hacer nada.', ' If this is not your case, you have nothing to do.') : '';
      // Compte à rebours seulement pour une date où l'on agit soi-même : sinon il fait croire à une échéance ouverte.
      const rows: Array<[string, string, number?]> = prox ? [...(prox.quien === 'tu' ? [[T(l, 'Días que faltan', 'Days left'), int(F.diasEntre(hoy, prox.iso), l)] as [string, string]] : []), [T(l, '¿Tienes que hacer algo?', 'Anything to do?'), quienTxt(prox.quien, l)]] : [];
      if (cerrado) rows.push([T(l, 'Plazo para pedir la beca 2026-2027', '2026-2027 application window'), T(l, `Cerrado el ${day(CV.plazoFin, l)}`, `Closed on ${day(CV.plazoFin, l)}`)], [T(l, 'Si aún no has pedido la beca', 'If you have not applied yet'), T(l, 'La próxima es la de 2027-2028: aún sin fecha publicada', 'The next one is 2027-2028: no date published yet')]);
      return {
        label: T(l, 'Próxima fecha de la convocatoria 2026-2027', 'Next date of the 2026-2027 call'), value: prox ? day(prox.iso, l) : T(l, 'Convocatoria cerrada', 'Call closed'),
        sub: prox ? `${l === 'es' ? prox.es : prox.en}.${tuParte}` : T(l, 'Queda la resolución de la cuantía variable, hasta seis meses después de que el Ministerio reúna los datos. La convocatoria 2027-2028 aún no tiene fecha publicada.', 'Only the variable-amount decision remains, up to six months after the Ministry has all data. The 2027-2028 call has no published date yet.'),
        rows,
        table: {
          caption: T(l, 'Convocatoria general 2026-2027', '2026-2027 general call'),
          headers: [T(l, 'Fecha', 'Date'), T(l, 'Qué pasa', 'What happens'), T(l, 'Quién actúa', 'Who acts')],
          rows: HITOS.map((h) => [day(h.iso, l), (h.iso < hoy ? '✓ ' : '') + (l === 'es' ? h.es : h.en), quienTxt(h.quien, l)]), align: ['l', 'l', 'l'],
        },
      };
    },
  };
}

/* ------------------------------------------------------------------ recursos y plazos */
const actoOpts = (l: Lang) => [
  { value: 'propuesta', label: T(l, 'Propuesta de denegación', 'Proposed refusal') },
  { value: 'requerimiento', label: T(l, 'Requerimiento de documentos', 'Request for documents') },
  { value: 'resolucion', label: T(l, 'Resolución de denegación publicada', 'Published refusal decision') },
];
function recursoSpec(l: Lang): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'acto', label: T(l, 'Qué has recibido', 'What you received'), def: 'propuesta', options: actoOpts(l), wide: true },
      { id: 'dia', label: T(l, 'Día de la notificación', 'Notification day'), def: 10, max: 31 },
      { kind: 'select', id: 'mes', label: T(l, 'Mes', 'Month'), def: '11', options: Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: new Date(Date.UTC(2026, i, 15)).toLocaleDateString(l === 'es' ? 'es-ES' : 'en-GB', { month: 'long', timeZone: 'UTC' }) })) },
      { id: 'anio', label: T(l, 'Año', 'Year'), def: 2026, max: 2030 },
    ],
    run: (v) => {
      const f = F.fecha(n(v, 'dia'), Number(s(v, 'mes')), n(v, 'anio')), acto = s(v, 'acto');
      if (acto === 'resolucion') {
        const rep = F.masMeses(f, CV.reposicionMeses), con = F.contencioso(f, CV.contenciosoMeses);
        return {
          label: T(l, 'Recurso de reposición hasta', 'Appeal for reconsideration until'), value: day(rep, l),
          sub: T(l, 'Un mes desde el día siguiente a la publicación (convocatoria, art. 57.1). Es potestativo: puedes ir directamente al contencioso.', 'One month from the day after publication (call, art. 57.1). It is optional: you can go straight to court.'),
          rows: [[T(l, 'Contencioso directo hasta', 'Direct court appeal until'), day(con, l)], [T(l, 'Ante', 'Before'), T(l, 'Audiencia Nacional', 'National High Court')]],
          note: T(l, 'Fechas sin festivos nacionales, autonómicos ni locales; agosto no cuenta para el contencioso.', 'Dates ignore national, regional and local holidays; August does not count for the court appeal.'),
        };
      }
      const dias = acto === 'requerimiento' ? CV.subsanacionDias : CV.alegacionesDias, fin = F.masHabiles(f, dias);
      return {
        label: acto === 'requerimiento' ? T(l, 'Subsanar o aportar documentos hasta', 'Fix or send documents by') : T(l, 'Presentar alegaciones hasta', 'Submit objections by'), value: day(fin, l),
        sub: acto === 'requerimiento'
          ? T(l, `${int(dias, l)} días hábiles desde la recepción (art. 51.1). Si no respondes, se te tiene por desistido.`, `${int(dias, l)} working days from receipt (art. 51.1). No answer means the application is treated as withdrawn.`)
          : T(l, `${int(dias, l)} días hábiles (art. 51.9), en la sede electrónica del Ministerio. Si la notificación indica otro plazo, manda el suyo.`, `${int(dias, l)} working days (art. 51.9), on the Ministry's e-office. If the notice states another deadline, that one prevails.`),
        rows: [[T(l, 'Notificación', 'Notification'), day(f, l)], [T(l, 'Días hábiles', 'Working days'), int(dias, l)]],
        note: T(l, 'Se quitan sábados y domingos; un festivo en medio alarga el plazo un día.', 'Saturdays and Sundays are skipped; a holiday in between adds a day.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ reintegro */
function reintegroSpec(l: Lang): ToolSpec {
  return {
    inputs: [
      { kind: 'choice', id: 'nivel', label: T(l, 'Estudios', 'Studies'), def: 'univ', options: [{ value: 'univ', label: T(l, 'Universitarios', 'University') }, { value: 'nu', label: T(l, 'No universitarios', 'Non-university') }], wide: true },
      { kind: 'select', id: 'rama', label: T(l, 'Rama', 'Field'), def: 'sociales', options: ramaOpts(l) },
      { id: 'mat', label: T(l, 'Créditos o asignaturas matriculados', 'Credits or subjects enrolled'), def: 60, max: 120 },
      { id: 'apr', label: T(l, 'Aprobados (ordinaria o extraordinaria)', 'Passed (either sitting)'), def: 27, max: 120 },
      { id: 'cobrado', label: T(l, 'Cuantías cobradas, sin la matrícula', 'Amounts received, excluding tuition'), def: 4460, unit: '€', max: 50000 },
      { id: 'asis', label: T(l, 'Asistencia a clase (no universitarios)', 'Class attendance (non-university)'), def: 100, unit: '%', max: 100, adv: true },
    ],
    run: (v) => {
      const univ = s(v, 'nivel') === 'univ', rama = (s(v, 'rama') || 'sociales') as B.Rama;
      const exig = B.reintegroPct(univ, rama), hecho = n(v, 'mat') > 0 ? (n(v, 'apr') / n(v, 'mat')) * 100 : 0;
      const falta = hecho + 1e-9 < exig || (!univ && n(v, 'asis') < A.asistenciaNoUniv);
      const dev = falta ? n(v, 'cobrado') : 0;
      return {
        label: T(l, 'A devolver', 'To pay back'), value: eur(dev, l),
        sub: falta
          ? (univ ? T(l, 'Se devuelven todos los componentes salvo la matrícula (convocatoria, art. 43.2).', 'All components except tuition are paid back (call, art. 43.2).') : T(l, 'En niveles no universitarios se devuelve toda la beca (art. 43.2).', 'Below university level the whole grant is paid back (art. 43.2).'))
          : T(l, 'Has aprobado lo bastante: no hay reintegro por rendimiento.', 'You passed enough: no repayment for performance.'),
        rows: [[T(l, 'Aprobado', 'Passed'), pct(hecho, l)], [T(l, 'Mínimo exigido', 'Minimum required'), pct(exig, l, 0)], ...(!univ ? [[T(l, 'Asistencia mínima', 'Minimum attendance'), pct(A.asistenciaNoUniv, l, 0)] as [string, string]] : [])],
        note: T(l, 'Anular la matrícula o abandonar de hecho también obliga a devolver.', 'Cancelling enrolment or dropping out also means paying back.'),
      };
    },
  };
}

export const SPECS: Record<string, (l: Lang, arg?: Args) => ToolSpec> = {
  beca: becaSpec, umbrales: umbralesSpec, renta: rentaSpec, patrimonio: patrimonioSpec, cuantias: cuantiasSpec, variable: variableSpec,
  requisitos: requisitosSpec, nota: notaSpec, residencia: residenciaSpec, matricula: matriculaSpec, calendario: calendarioSpec,
  recurso: recursoSpec, reintegro: reintegroSpec,
};
export const TOOL_KINDS = Object.keys(SPECS);
export function getTool(kind: string, l: Lang, arg?: Args): ToolSpec {
  const f = SPECS[kind]; if (!f) throw new Error(`simulador desconocido: ${kind}`);
  return f(l, arg);
}
/** Ejecuta un simulador con sus valores por defecto (o los dados): sirve a las páginas y a los tests. */
export function runTool(kind: string, l: Lang, arg?: Args, values?: V): ToolOut {
  const spec = getTool(kind, l, arg);
  const v = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])) as V;
  return spec.run(resolve(spec.inputs, { ...v, ...(values ?? {}) }));
}
export { formatNumber };
