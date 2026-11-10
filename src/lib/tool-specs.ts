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
const RENTA_LINK = (l: Lang) => ({ href: l === 'es' ? '/es/renta-familiar/' : '/en/family-income/', text: T(l, 'Calcúlala con la declaración', 'Work it out from the tax return') });
/* Test naïf du 2026-11-08 : « base imponible… » = mots de Hacienda. D'abord à qui demander et une approximation, puis l'année ; la formule exacte vit sur la page de renta familiar. */
/* Testeurs du 2026-11-09 : « (2025) » contredisait le bandeau (« contará la renta de 2026 ») pour qui commence en 2027,
   et l'aide de 8 lignes parlait à l'étudiant (« pide a tus padres ») alors que c'est souvent le parent qui remplit. */
/* Testeurs du 2026-11-10 : une règle simple et une issue « je ne sais pas » ; l'année dans l'aide, pas dans le libellé. */
const RENTA_HELP = (l: Lang) => T(l, 'Pon la de 2025, la de la última declaración (si empieza en septiembre de 2027 contará la de 2026, que suele parecerse). ¿No la sabes? Pon lo que entra en casa en un año, ya sin impuestos: el resultado queda del lado prudente.', 'Enter 2025, from the latest tax return (for a September 2027 start, 2026 will count, which is usually similar). Not sure? Enter what the household takes home in a year after tax: the result errs on the safe side.');
const RENTA_LABEL = (l: Lang) => T(l, 'Renta de la familia en un año, ya sin impuestos', 'Family income for one year, after tax');
const MIEMBROS = (l: Lang) => T(l, 'Personas que cuentan en la familia', 'People counted in the household');
/* « Tengo 24 años: ¿cuenta la renta de mis padres? » (testeuse de 24 ans, 2026-11-10) : la réponse sous le champ. Règle : página de renta familiar. */
const MIEMBROS_HELP = (l: Lang) => T(l, 'El estudiante, sus padres, sus hermanos solteros menores de 25 que viven en casa y los abuelos empadronados con vosotros. ¿Vive solo? Siguen contando sus padres, salvo que viva de sus propios ingresos.', 'The student, their parents, unmarried siblings under 25 living at home and grandparents registered there. Living alone? The parents still count, unless the student lives on their own income.');
const notaTxt = (x: number, l: Lang) => (Number.isInteger(x) ? int(x, l) : num(x, l));
const ESTUDIO_HELP = (l: Lang) => T(l, 'El grado incluye las enseñanzas artísticas superiores.', 'Degree includes higher arts education.');
/** Lo que se pierde al pasar al umbral siguiente (cuantías del RD 179/2026). */
const pierde = (u: number, l: Lang) => [
  '',
  T(l, `pasaría al umbral 2 y perdería los ${eur(CU.renta, l)} por renta baja`, `the family would move to threshold 2 and lose the ${eur(CU.renta, l)} low-income amount`),
  T(l, 'pasaría al umbral 3 y perdería la ayuda por vivir fuera de casa y el extra de final de curso', 'the family would move to threshold 3 and lose the living-away amount and the end-of-year extra'),
  T(l, 'se quedaría sin beca', 'there would be no grant at all'),
][u] ?? '';

/* ------------------------------------------------------------------ opciones comunes */
export const estudioOpts = (l: Lang) => [
  { value: 'grado', label: T(l, 'Grado universitario', 'University degree') },
  { value: 'master', label: T(l, 'Máster universitario', "Master's degree") },
  { value: 'bach', label: T(l, 'Bachillerato', 'Bachillerato (upper secondary)') },
  { value: 'fpm', label: T(l, 'FP (formación profesional) de grado medio', 'Intermediate VET (FP grado medio)') },
  { value: 'fps', label: T(l, 'FP (formación profesional) de grado superior', 'Higher VET (FP grado superior)') },
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
/** Résumé du repli « Lo que hemos supuesto por ti » : « libellé: valeur », en mots simples (testeurs du 2026-11-09 :
 *  « Ahora: » et libellés collés aux valeurs). */
const RES = (l: Lang): Record<string, (v: V) => string> => ({
  mat: (v) => ({ completa: T(l, 'Curso entero (60 créditos)', 'Whole year (60 credits)'), p48: T(l, 'De 48 a 59 créditos', '48 to 59 credits'), p30: T(l, 'De 30 a 47 créditos', '30 to 47 credits') }[s(v, 'mat')] ?? ''),
  mod: (v) => (s(v, 'mod') === 'distancia' ? T(l, 'A distancia', 'Distance learning') : T(l, 'Presencial', 'In person')),
  rama: (v) => `${T(l, 'Rama', 'Field')}: ${ramaName(s(v, 'rama') || 'sociales', l)}`,
  aprob: (v) => `${T(l, 'Aprobado el curso pasado', 'Passed last year')}: ${pct(n(v, 'aprob'), l, 0)}`,
  ins: (v) => (s(v, 'ins') === 'no' || !s(v, 'ins') ? T(l, 'No vive en una isla, Ceuta ni Melilla', 'Not on an island, Ceuta or Melilla') : T(l, 'Vive en una isla, Ceuta o Melilla', 'Lives on an island, Ceuta or Melilla')),
  can: (v) => (s(v, 'can') === 'si' ? T(l, 'En Canarias', 'In the Canary Islands') : T(l, 'No en Canarias', 'Not in the Canary Islands')),
  disc: (v) => (s(v, 'disc') === 'no' || !s(v, 'disc') ? T(l, 'Sin discapacidad', 'No disability') : `${T(l, 'Discapacidad', 'Disability')}: ${s(v, 'disc') === 'd65' ? T(l, '65 % o más', '65% or more') : T(l, 'del 25 % al 64 %', '25% to 64%')}`),
  miembros: (v) => T(l, `Familia de ${int(n(v, 'miembros'), l)} personas`, `Household of ${int(n(v, 'miembros'), l)}`),
  renta: (v) => `${T(l, 'Renta', 'Income')}: ${eur(n(v, 'renta'), l)}`,
});
export const resumenCampo = (id: string, v: V, l: Lang): string | undefined => RES(l)[id]?.(v);
/** Le gros chiffre de la beca, le même sur la portada et sur les cuantías (testeurs du 2026-11-09 : « 60 € » ici, « Matrícula gratis + 60 € » là). */
const grande = (r: B.BecaOut, l: Lang) => (!r.ok ? T(l, 'Sin beca', 'No grant') : r.matricula ? (r.fijo > 0 ? T(l, `Matrícula gratis + ${eur(r.fijo, l)}`, `Free tuition + ${eur(r.fijo, l)}`) : T(l, 'Matrícula gratis', 'Free tuition')) : eur(r.fijo, l));
/** Ce que donne chaque umbral, pour les seules études choisies (testeurs du 2026-11-09 : « je fais un grado, j'ai la básica ou pas ? »). */
const UNIV = (e: string) => e === 'grado' || e === 'master';
export const queDa = (u: number, e: string, l: Lang) => e === 'basico' || e === 'idiomas' ? [
  T(l, `Beca básica de ${eur(e === 'basico' ? CU.basicaGradoBasico : CU.basica, l)} y extra de final de curso`, `Basic grant of ${eur(e === 'basico' ? CU.basicaGradoBasico : CU.basica, l)} and end-of-year extra`),
  T(l, `Beca básica de ${eur(e === 'basico' ? CU.basicaGradoBasico : CU.basica, l)} y extra de final de curso`, `Basic grant of ${eur(e === 'basico' ? CU.basicaGradoBasico : CU.basica, l)} and end-of-year extra`),
  T(l, `Beca básica de ${eur(e === 'basico' ? CU.basicaGradoBasico : CU.basica, l)}`, `Basic grant of ${eur(e === 'basico' ? CU.basicaGradoBasico : CU.basica, l)}`),
][u - 1] : UNIV(e) ? [
  T(l, `Todo: matrícula gratis, ${eur(CU.renta, l)} por renta baja, ayuda por vivir fuera de casa (si vive fuera), premio por buena nota y extra de final de curso`, `Everything: free tuition, ${eur(CU.renta, l)} low-income amount, living-away amount (if away), good-grade award and end-of-year extra`),
  T(l, 'Matrícula gratis, ayuda por vivir fuera de casa (si vive fuera), premio por buena nota y extra de final de curso', 'Free tuition, living-away amount (if away), good-grade award and end-of-year extra'),
  T(l, `Matrícula gratis y premio por buena nota (desde un ${num(CU.excelencia[0].desde, l, 0)})`, `Free tuition and good-grade award (from ${num(CU.excelencia[0].desde, l, 0)})`),
][u - 1] : [
  T(l, `Todo: ${eur(CU.renta, l)} por renta baja, ayuda por vivir fuera de casa (si vive fuera), premio por buena nota y extra de final de curso`, `Everything: ${eur(CU.renta, l)} low-income amount, living-away amount (if away), good-grade award and end-of-year extra`),
  T(l, `Beca básica de ${eur(CU.basica, l)}, ayuda por vivir fuera de casa (si vive fuera), premio por buena nota y extra de final de curso`, `Basic grant of ${eur(CU.basica, l)}, living-away amount (if away), good-grade award and end-of-year extra`),
  T(l, `Beca básica de ${eur(CU.basica, l)} y premio por buena nota (desde un ${num(CU.excelencia[0].desde, l, 0)})`, `Basic grant of ${eur(CU.basica, l)} and good-grade award (from ${num(CU.excelencia[0].desde, l, 0)})`),
][u - 1];
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
/** « Umbral 2 de 3 » : le chiffre seul ne disait pas si c'était bien (test naïf du 2026-11-08). */
const umbralName = (u: number, l: Lang) => (u === 4 ? T(l, 'Por encima del umbral 3: sin beca', 'Above threshold 3: no grant') : T(l, `Umbral ${u} de 3`, `Threshold ${u} of 3`));
const UMBRAL_ROW = (l: Lang) => T(l, 'Tramo de renta de la familia (umbral; el 1 es el de menos renta y el que más da)', 'Household income band (threshold; 1 is the lowest income and gives the most)');
export const compName = (c: B.Comp, l: Lang) => ({
  // Noms de tous les jours, terme officiel entre parenthèses (test naïf du 2026-11-08 : « cuantía fija ligada a… »).
  matricula: T(l, 'Matrícula gratis (beca de matrícula)', 'Free tuition (tuition waiver)'),
  renta: T(l, 'Ayuda por renta baja (cuantía de renta)', 'Low-income amount (income-linked)'),
  residencia: T(l, 'Ayuda por vivir fuera de casa (residencia)', 'Living-away amount (residence)'),
  basica: T(l, 'Beca básica (estudios no universitarios)', 'Basic grant (below university)'),
  excelencia: T(l, 'Premio por buena nota (excelencia)', 'Good-grade award (excellence)'),
  // Un seul nom partout (testeurs du 2026-11-10 : « extra », « cuantía variable », « parte variable » pour la même chose).
  variable: T(l, 'Extra de final de curso (cuantía variable)', 'End-of-year extra (variable amount)'),
  variableMin: T(l, 'Extra de final de curso (cuantía variable, mínimo)', 'End-of-year extra (variable amount, minimum)'),
  insular: T(l, 'Suplemento por vivir en una isla, Ceuta o Melilla', 'Island, Ceuta or Melilla supplement'),
}[c]);
const motivo = (m: string | undefined, l: Lang) => ({
  umbral: T(l, 'La renta familiar supera el umbral 3: no hay ningún componente de beca.', 'Family income is above threshold 3: no grant component at all.'),
  patrimonio: T(l, 'Los bienes de la familia (otras casas, terrenos, ahorros) pasan del límite: el resultado de patrimonio supera el 100 %, y la beca se deniega sea cual sea la renta.', 'Family wealth (other homes, land, savings) is over the limit: the wealth result is above 100%, and the grant is refused whatever the income.'),
  academico: T(l, 'Con estos datos no se cumple el requisito académico de la convocatoria.', 'With these figures the academic requirement of the call is not met.'),
}[m ?? ''] ?? '');

/* ------------------------------------------------------------------ simulador completo */
function becaInputs(l: Lang, a?: Args): Input[] {
  const out: Input[] = [
    { id: 'miembros', label: MIEMBROS(l), def: Number(a?.miembros ?? 4), max: 20, help: MIEMBROS_HELP(l) },
    { id: 'renta', label: RENTA_LABEL(l), def: Number(a?.renta ?? 30000), unit: '€', max: 1e7, help: RENTA_HELP(l), link: RENTA_LINK(l) },
  ];
  if (!a?.estudio) out.push({ kind: 'select', id: 'estudio', label: T(l, 'Qué va a estudiar', 'What the student will study'), def: String(a?.defEstudio ?? 'grado'), options: estudioOpts(l), help: ESTUDIO_HELP(l), wide: true });
  out.push(
    { kind: 'choice', id: 'curso', label: T(l, 'Curso', 'Year'), def: String(a?.curso ?? 'primero'), options: cursoOpts(l) },
    { id: 'nota', label: T(l, 'Nota de acceso en 1.º, o media del curso pasado', 'Entry grade in year 1, or last year\'s average'), def: Number(a?.nota ?? 7), max: 10, decimals: 2, help: T(l, 'En primero: 0,6 × media de bachillerato + 0,4 × PAU (selectividad). ¿Aún no la sabes? Deja un 7 o pon la que esperas.', 'Year 1: 0.6 × upper secondary average + 0.4 × university entrance exam (PAU). Not known yet? Leave 7 or enter the expected one.') },
    { kind: 'choice', id: 'fuera', label: T(l, '¿Vivirá fuera de casa durante el curso?', 'Will the student live away from home for the year?'), def: String(a?.fuera ?? 'no'), options: ny(l), wide: true },
    // Patrimoine : une question visible (testeurs du 2026-11-09 : supposé nul dans un repli que personne n'ouvrait).
    // « Ahorros importantes, c'est combien ? » (testeurs du 2026-11-10) : le seuil du capital (RD 179/2026, art. 11), lu dans params.
    { kind: 'choice', id: 'bienes', label: T(l, `¿La familia tiene otra casa aparte de la suya, terrenos, o ahorros que dan más de ${eur(P.patrimonio.capital, l)} al año de intereses?`, `Does the family own another home besides its own, land, or savings earning over ${eur(P.patrimonio.capital, l)} a year in interest?`), def: 'no', options: ny(l), wide: true, help: T(l, '¿No lo sabes? Si solo tenéis la casa donde vivís y cuentas de ahorro normales, contesta No.', 'Not sure? If you only have the home you live in and ordinary savings accounts, answer No.') },
    { id: 'pat', label: T(l, 'Resultado de la calculadora de patrimonio (en %)', 'Result of the wealth calculator (in %)'), def: 0, unit: '%', max: 1000, when: (v) => s(v, 'bienes') === 'si', help: T(l, 'Por encima de 100 % no hay beca, sea cual sea la renta. Un piso alquilado o una casa en el pueblo pueden quedar por debajo.', 'Above 100% there is no grant, whatever the income. A rented flat or a house in the village may stay below it.'), link: { href: l === 'es' ? '/es/patrimonio/' : '/en/family-wealth/', text: T(l, 'Calcúlalo aquí', 'Work it out here') }, wide: true },
    { kind: 'select', id: 'mat', label: T(l, 'Matrícula', 'Enrolment'), def: 'completa', options: matOpts(l), adv: true, wide: true },
    { kind: 'choice', id: 'mod', label: T(l, 'Modalidad', 'Mode'), def: 'presencial', options: modOpts(l), help: T(l, 'Presencial incluye semipresencial (artículo 7).', 'In person includes blended study (article 7).'), adv: true, wide: true },
    // En primero, rama y aprobado no cuentan : on les masque (testeurs du 2026-11-10 : « aprobado el curso pasado » en 1.º).
    { kind: 'select', id: 'rama', label: T(l, 'Tipo de carrera (rama)', 'Type of degree (field)'), def: String(a?.rama ?? 'sociales'), options: ramaOpts(l), when: (v) => s(v, 'curso') === 'posterior', help: T(l, 'Ciencias Sociales y Jurídicas es Derecho, Economía, Magisterio… Cambia si estudia Medicina, Ingeniería u otra cosa.', 'Social Sciences and Law covers Law, Economics, Teaching… Change it for Medicine, Engineering or anything else.') },
    { id: 'aprob', label: T(l, 'Parte del curso pasado que aprobó', 'Share of last year passed'), def: 100, unit: '%', max: 100, when: (v) => s(v, 'curso') === 'posterior', help: T(l, 'En % de las asignaturas (créditos) en que se matriculó. Si aprobó todo, deja 100.', 'As a % of the subjects (credits) taken. If everything was passed, leave 100.') },
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
    patrimonioPct: s(v, 'bienes') === 'si' ? n(v, 'pat') : 0, insular: (s(v, 'ins') || 'no') as B.Insular, disc: (s(v, 'disc') || 'no') as B.Disc, canarias: s(v, 'can') === 'si',
  };
}
function lineRows(r: B.BecaOut, l: Lang): Array<[string, string, number?]> {
  const rows: Array<[string, string, number?]> = [];
  // « créditos » se lisait « prêts » (testeurs du 2026-11-09) : on dit « asignaturas ».
  if (r.matricula) rows.push([compName('matricula', l), T(l, 'Sí (asignaturas nuevas)', 'Yes (first-time subjects)')]);
  for (const x of r.lineas) rows.push([compName(x.c, l), x.c === 'variable' ? T(l, `al menos ${eur(x.importe, l)} (suele ser más)`, `at least ${eur(x.importe, l)} (usually more)`) : eur(x.importe, l), x.importe]);
  return rows;
}
function becaSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: becaInputs(l, a),
    run: (v) => {
      const x = becaIn(v, a), r = B.beca(x);
      const u = r.u;
      const rows: Array<[string, string, number?]> = r.ok ? lineRows(r, l) : [[T(l, 'Motivo', 'Reason'), motivo(r.motivo, l)]];
      rows.push([UMBRAL_ROW(l), umbralName(r.umbral, l)]);
      // Une seule phrase-réponse : oui ou non, puis le dinero seguro et ce que le umbral fait perdre. Voix neutre (« tendría ») :
      // c'est souvent le parent qui remplit (testeurs du 2026-11-09). Les 60 € sont dits « mínimo », avec « suele llegar más ».
      // Lignes courtes, une idée et un chiffre chacune (testeuse de 61 ans, 2026-11-10 : « à la troisième phrase j'ai perdu le fil »).
      const lineas = !r.ok ? [motivo(r.motivo, l)] : [
        T(l, 'Sí, tendría beca.', 'Yes, the student would get a grant.'),
        r.matricula ? T(l, 'Matrícula gratis: la universidad no le cobra las asignaturas nuevas. No es dinero que se cobre.', 'Free tuition: the university does not charge for new subjects. It is not money paid out.') : '',
        r.variable === 'formula' ? T(l, `Los ${eur(CU.variableMin, l)} son el mínimo del extra de final de curso: suele llegar más, pero nadie puede saberlo al euro.`, `The ${eur(CU.variableMin, l)} is the minimum end-of-year extra: more usually arrives, but nobody can say how much.`) : '',
        r.umbral === 2 || r.umbral === 3 ? T(l, `Los ${eur(CU.renta, l)} por renta baja solo llegan con menos renta: hasta ${eur(u.u1, l)} con ${int(x.miembros, l)} personas.`, `The ${eur(CU.renta, l)} low-income amount needs a lower income: up to ${eur(u.u1, l)} for ${int(x.miembros, l)} people.`) : '',
        s(v, 'bienes') === 'si' && n(v, 'pat') === 0 ? T(l, 'Con otra casa, terrenos o ahorros, la beca depende de su valor: calcúlalo en la página de patrimonio y escribe aquí el resultado.', 'With another home, land or savings, the grant depends on their value: work it out on the wealth page and enter the result here.') : '',
      ].filter(Boolean);
      const curso = x.primero ? T(l, 'primer curso', 'first year') : T(l, 'segundo curso o más', 'second year or later');
      return {
        label: T(l, 'Beca estimada para el curso entero (cifras de 2026-2027)', 'Estimated grant for the whole year (2026-2027 figures)'),
        value: grande(r, l),
        hyp: T(l, `Supone: ${int(x.miembros, l)} personas, ${eur(x.renta, l)} de renta, ${estudioName(x.estudio, l).toLowerCase()}, ${curso}, nota ${notaTxt(x.nota, l)}, ${x.fuera ? 'vive fuera de casa' : 'vive en casa'}.`, `Assumes: ${int(x.miembros, l)} people, ${eur(x.renta, l)} income, ${estudioName(x.estudio, l)}, ${curso}, grade ${notaTxt(x.nota, l)}, ${x.fuera ? 'living away from home' : 'living at home'}.`),
        sub: lineas.join('\n'), rows,
        link: r.ok && r.matricula ? { href: l === 'es' ? '/es/beca-matricula/' : '/en/tuition-waiver/', text: T(l, 'Cuánto vale la matrícula gratis en tu universidad', 'What free tuition is worth at your university') } : undefined,
        table: {
          caption: T(l, `Umbrales de renta para ${int(x.miembros, l)} personas en la familia, en ${estudioName(x.estudio, l).toLowerCase()}`, `Income thresholds for a household of ${int(x.miembros, l)}, ${estudioName(x.estudio, l)}`),
          headers: [T(l, 'Umbral', 'Threshold'), T(l, 'Renta máxima', 'Maximum income'), T(l, 'Qué da', 'What it gives')],
          rows: [1, 2, 3].map((k) => [String(k), eur(k === 1 ? u.u1 : k === 2 ? u.u2 : u.u3, l), queDa(k, x.estudio, l)]), align: ['l', 'r', 'l'],
        },
        note: T(l, 'Estimación orientativa con las normas publicadas en el BOE (Boletín Oficial del Estado). Solo el Ministerio concede la beca.', 'Indicative estimate under the rules published in the Official Gazette (BOE). Only the Ministry awards the grant.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ umbrales */
function umbralesSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { id: 'miembros', label: MIEMBROS(l), def: Number(a?.miembros ?? 4), max: 20, help: MIEMBROS_HELP(l) },
      { id: 'renta', label: RENTA_LABEL(l), def: Number(a?.renta ?? 30000), unit: '€', max: 1e7, help: RENTA_HELP(l), link: RENTA_LINK(l) },
    ],
    run: (v) => {
      const m = Math.max(1, Math.floor(n(v, 'miembros'))), r = n(v, 'renta'), u = B.umbrales(m), um = B.umbralDe(r, m);
      // « Umbral 2 de 3 » traduit en euros, sans affirmer « tienes beca » : la page ne demande ni la note ni le patrimoine (testeurs du 2026-11-09).
      const que = [
        '',
        T(l, `Por renta, la familia entra en el umbral más favorable: matrícula gratis, ${eur(CU.renta, l)} por renta baja y, si vive fuera de casa, ${eur(CU.residencia, l)} más.`, `On income, the family is in the best threshold: free tuition, the ${eur(CU.renta, l)} low-income amount and, if living away, ${eur(CU.residencia, l)} more.`),
        T(l, `Por renta, la familia entra en la beca: matrícula gratis y, si vive fuera de casa, ${eur(CU.residencia, l)}; sin los ${eur(CU.renta, l)} por renta baja, que son solo del umbral 1.`, `On income, the family qualifies: free tuition and, if living away, ${eur(CU.residencia, l)}; without the ${eur(CU.renta, l)} low-income amount, which is for threshold 1 only.`),
        T(l, `Por renta, solo quedan la matrícula gratis en la universidad (o la beca básica de ${eur(CU.basica, l)} en FP y bachillerato) y el premio por buena nota.`, `On income, only free university tuition (or the ${eur(CU.basica, l)} basic grant in VET and bachillerato) and the good-grade award remain.`),
      ][um] ?? '';
      const lim = um === 1 ? u.u1 : um === 2 ? u.u2 : um === 3 ? u.u3 : 0;
      const sub = um === 4
        ? T(l, `Superas el umbral 3 en ${eur(r - u.u3, l)}: no hay beca general en 2026-2027.`, `You are ${eur(r - u.u3, l)} over threshold 3: no general grant in 2026-2027.`)
        : [que, T(l, `Quedan ${eur(lim - r, l)} de margen: con más renta, la familia ${pierde(um, l)}.`, `There is ${eur(lim - r, l)} of headroom: with more income, ${pierde(um, l)}.`), T(l, 'Aquí no se miran la nota ni el patrimonio: el simulador completo sí.', 'Grades and wealth are not checked here: the full simulator checks them.')].join('\n');
      const rows: Array<[string, string, number?]> = [
        [T(l, 'Límite del umbral 1', 'Threshold 1 limit'), eur(u.u1, l)], [T(l, 'Límite del umbral 2', 'Threshold 2 limit'), eur(u.u2, l)], [T(l, 'Límite del umbral 3', 'Threshold 3 limit'), eur(u.u3, l)],
      ];
      // La table de 1 à 8 personnes vit une seule fois, dans le corps de la page (test naïf : « deux fois le même tableau »).
      return {
        label: T(l, 'Umbral (tramo de renta) de la familia: hay 3, y el 1 es el de menos renta y el que más da', 'Household threshold (income band): there are 3, and 1 is the lowest income and gives the most'), value: umbralName(um, l),
        hyp: T(l, `Supone: ${int(m, l)} personas y ${eur(r, l)} de renta en un año. Límites del curso 2026-2027.`, `Assumes: ${int(m, l)} people and ${eur(r, l)} income for one year. 2026-2027 limits.`), sub, rows,
        note: T(l, 'Si la renta es justo igual al límite, sigue dentro.', 'If income is exactly on the limit, you are still within it.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ renta familiar */
const fnOpts = (l: Lang) => [{ value: 'no', label: T(l, 'No', 'No') }, { value: 'general', label: T(l, 'General', 'General') }, { value: 'especial', label: T(l, 'Especial', 'Special') }];
function rentaSpec(l: Lang, a?: Args): ToolSpec {
  return {
    // La renta calculée ici remplit le champ « Renta de la familia » des autres pages (« ¿No la sabes? Calcúlala aquí »).
    comparte: (v) => ({ miembros: n(v, 'miembros'), renta: B.rentaFamiliar({ sustentadores: n(v, 'sust'), otros: n(v, 'otros'), fn: s(v, 'fn') as 'no', hermanosFn: n(v, 'hfn'), disc33: n(v, 'd33'), disc65: n(v, 'd65'), solicitanteUniv65: s(v, 'sol65') === 'si', fuera: n(v, 'fuera'), orfandad: s(v, 'orf') === 'si', monoparental: s(v, 'mono') === 'si' }).computable }),
    inputs: [
      { id: 'sust', label: T(l, 'Renta de los padres', "Parents' income"), def: 30000, unit: '€', max: 1e7, help: T(l, 'Base imponible general + del ahorro − cuota resultante de la autoliquidación, de 2025', '2025 general + savings tax base − resulting tax due') },
      { id: 'otros', label: T(l, 'Renta del resto de miembros', 'Income of the other members'), def: 0, unit: '€', max: 1e7, help: T(l, 'Hermanos, abuelos o el propio estudiante: cuenta la mitad', 'Siblings, grandparents or the student: half counts') },
      { id: 'miembros', label: T(l, 'Miembros computables', 'Members counted'), def: 4, max: 20 },
      { kind: 'select', id: 'fn', label: T(l, 'Familia numerosa', 'Large family'), def: 'no', options: fnOpts(l), adv: true },
      { id: 'hfn', label: T(l, 'Hermanos que cuentan (familia numerosa)', 'Siblings counted (large family)'), def: 0, max: 20, adv: true, help: T(l, 'Hijos que dan derecho al título, contando al estudiante', 'Children giving the right to the title, counting the student') },
      { id: 'd33', label: T(l, 'Miembros con discapacidad del 33 al 64 %', 'Members with 33-64% disability'), def: 0, max: 20, adv: true },
      { id: 'd65', label: T(l, 'Miembros con discapacidad del 65 % o más', 'Members with 65%+ disability'), def: 0, max: 20, adv: true },
      { kind: 'choice', id: 'sol65', label: T(l, '¿Es el estudiante, universitario, uno de ellos?', 'Is the student, at university, one of them?'), def: 'no', options: ny(l), adv: true },
      // « tú incluido » valait 0 (testeurs du 2026-11-09) : on compte l'étudiant s'il part, et la page de la residencia montre le cas de deux.
      { id: 'fuera', label: T(l, 'Hijos que estudian en la universidad fuera de casa (contando al estudiante, si se va)', 'Children at university away from home (counting the student, if leaving)'), def: Number(a?.fuera ?? 0), max: 20, adv: true, help: T(l, 'Solo baja la renta si son dos o más', 'Only lowers income with two or more') },
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
      rows.push([T(l, `Umbral con ${int(n(v, 'miembros'), l)} personas`, `Threshold for ${int(n(v, 'miembros'), l)} people`), umbralName(um, l)]);
      // Une rebaja qui ne s'applique pas le dit (test naïf : « 32.000 €, la même chose que ce que j'ai tapé »).
      const sinRebaja = r.deducciones.length === 0
        ? (n(v, 'fuera') === 1 ? T(l, ' Con un solo hijo fuera de casa no hay rebaja: hacen falta dos o más.', ' With only one child away from home there is no deduction: two or more are needed.') : T(l, ' Sin rebajas en este caso: la renta que cuenta es la que has escrito.', ' No deductions in your case: the income that counts is the one you entered.'))
        : '';
      return {
        label: T(l, 'Renta familiar que cuenta para la beca', 'Family income that counts for the grant'), value: eur(r.computable, l),
        sub: T(l, `Renta de 2025 después de las rebajas por familia numerosa, discapacidad, hermanos fuera de casa y otras.${sinRebaja}`, `2025 income after the deductions for large families, disability, siblings away from home and others.${sinRebaja}`), rows,
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
      { kind: 'select', id: 'um', label: T(l, 'Umbral de renta de la familia (el 1 es el que más da)', 'Household income threshold (1 gives the most)'), def: '2', options: [1, 2, 3].map((u) => ({ value: String(u), label: umbralName(u, l) })), help: T(l, '¿No lo sabes? Con 4 personas y 30.000 € de renta es el 2, el del ejemplo de todo el sitio. Si lo calculaste en otra página, aparece aquí.', 'Not sure? With 4 people and €30,000 income it is 2, the example used across the site. If you worked it out on another page it appears here.'), wide: true },
      // Mêmes réponses par défaut que la portada (« No », 7) : la même famille donne le même chiffre (test naïf du 2026-11-08).
      { kind: 'choice', id: 'fuera', label: T(l, '¿Vivirá fuera de casa durante el curso?', 'Will the student live away from home for the year?'), def: 'no', options: ny(l) },
      { id: 'nota', label: T(l, 'Nota de acceso en 1.º, o media del curso pasado', 'Entry grade in year 1, or last year\'s average'), def: 7, max: 10, decimals: 2 },
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
        // L'hypothèse « en casa / fuera » est dans le titre du résultat : 60 € et 2760 € ne se contredisent plus.
        label: s(v, 'fuera') === 'si'
          ? T(l, `${umbralName(k, l)}, viviendo fuera de casa: lo que cobraría si justifica el alquiler`, `${umbralName(k, l)}, living away from home: what the student would get with proof of rent`)
          : T(l, `${umbralName(k, l)}, viviendo en casa`, `${umbralName(k, l)}, living at home`),
        // Même gros chiffre que la portada pour la même famille (testeurs du 2026-11-09).
        value: grande(r, l),
        hyp: T(l, `Supone: ${estudioName(e, l).toLowerCase()}, primer curso, nota ${notaTxt(n(v, 'nota'), l)}, curso entero 2026-2027.`, `Assumes: ${estudioName(e, l)}, first year, grade ${notaTxt(n(v, 'nota'), l)}, whole year 2026-2027.`),
        sub: [r.fijo > 0 ? T(l, `Dinero que se cobra: ${eur(r.fijo, l)}, la suma de las líneas de abajo.`, `Money paid out: ${eur(r.fijo, l)}, the sum of the lines below.`) : '', r.matricula ? T(l, 'La matrícula gratis va aparte: no es dinero que se cobre, es lo que la universidad deja de cobrar.', 'Free tuition comes on top: it is not money paid out, it is what the university stops charging.') : ''].filter(Boolean).join('\n'),
        rows: lineRows(r, l),
        table: {
          caption: T(l, 'Los tres umbrales, mismos estudios', 'All three thresholds, same studies'),
          headers: [T(l, 'Pieza', 'Component'), T(l, 'Umbral 1', 'Threshold 1'), T(l, 'Umbral 2', 'Threshold 2'), T(l, 'Umbral 3', 'Threshold 3')],
          rows: [
            ...(all[0].matricula || all[2].matricula ? [[compName('matricula', l), ...all.map((b) => (b.matricula ? T(l, 'sí', 'yes') : '–'))]] : []),
            ...comps.filter((c) => all.some((b) => b.lineas.some((x) => x.c === c))).map((c) => [compName(c, l), ...all.map((b) => cell(b, c))]),
            [T(l, 'Total que se cobra (fijas + mínimo del extra)', 'Total paid out (fixed + minimum extra)'), ...all.map((b) => (b.fijo === 0 && b.matricula ? T(l, 'solo matrícula gratis', 'free tuition only') : eur(b.fijo, l)))],
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
        // Un seul « 90 % » par sens : ce que tu as fait (le chiffre en grand), ce qu'on demande (test naïf du 2026-11-08).
        rows.push([T(l, `Lo que se pide en ${ramaName(rama, l)}`, `Required in ${ramaName(rama, l)}`), pct(c.exigido, l)]);
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
      const porNota = nv !== 'grado2' && nv !== 'master2' && nv !== 'nu2';
      return { label: porNota ? T(l, 'Tu nota para el requisito', 'Your grade for the requirement') : T(l, 'Lo que aprobaste el curso pasado', 'What you passed last year'), value, sub, rows };
    },
  };
}

/* ------------------------------------------------------------------ nota media y excelencia */
function notaSpec(l: Lang): ToolSpec {
  const pri = (v: V) => s(v, 'curso') !== 'posterior';
  const exTxt = (nota: number, imp: number) => imp > 0 ? eur(imp, l)
    : T(l, `Sin premio por buena nota: ${Math.abs(CU.excelencia[0].desde - nota - 1) < 1e-9 ? 'te falta 1 punto' : `te faltan ${num(CU.excelencia[0].desde - nota, l)} puntos`} para ${eur(CU.excelencia[0].importe, l)}`, `No excellence: ${num(CU.excelencia[0].desde - nota, l)} points short of ${eur(CU.excelencia[0].importe, l)}`);
  return {
    inputs: [
      { kind: 'choice', id: 'curso', label: T(l, '¿En qué curso estarás?', 'Which year will you be in?'), def: 'primero', options: [{ value: 'primero', label: T(l, 'Primero de grado', 'First year') }, { value: 'posterior', label: T(l, 'Segundo o más', 'Second or later') }], wide: true },
      // Même nota 7 que le reste du site (testeurs du 2026-11-10 : 7 sur la portada, 7,6 ici).
      { id: 'nmb', label: T(l, 'Nota media de bachillerato', 'Upper secondary average'), def: 7, max: 10, decimals: 2, when: pri },
      { id: 'pau', label: T(l, 'Nota de la PAU (selectividad), parte obligatoria', 'University entrance exam (PAU), compulsory part'), def: 7, max: 10, decimals: 2, when: pri, help: T(l, 'Materias comunes y de modalidad; no la fase para subir nota', 'Core and track subjects; not the optional part for raising your score') },
      { id: 'media2', label: T(l, 'Tu nota media del curso pasado', 'Your average last year'), def: 7, max: 10, decimals: 2, when: (v) => !pri(v) },
      { kind: 'select', id: 'rama', label: T(l, 'Rama de tu grado', 'Your degree field'), def: 'sociales', options: ramaOpts(l), when: (v) => !pri(v) },
    ],
    run: (v) => {
      const acc = B.notaAcceso(n(v, 'nmb'), n(v, 'pau')), rama = (s(v, 'rama') || 'sociales') as B.Rama;
      const caption = T(l, 'Premio por buena nota (excelencia) según la nota', 'Excellence amount by grade');
      const table = {
        caption, headers: [T(l, 'Nota', 'Grade'), T(l, 'Premio', 'Amount')],
        rows: CU.excelencia.map((t, i, arr) => [i < arr.length - 1 ? `${num(t.desde, l)} – ${num(arr[i + 1].desde - 0.01, l)}` : T(l, `${num(t.desde, l)} o más`, `${num(t.desde, l)} or more`), eur(t.importe, l)]),
        align: ['l', 'r'] as Array<'l' | 'r'>,
      };
      if (pri(v)) {
        const ex1 = B.excelencia(acc);
        return {
          label: T(l, 'Tu nota de acceso para la beca', 'Your entry grade for the grant'), value: num(acc, l),
          hyp: T(l, `Supone: media de bachillerato ${notaTxt(n(v, 'nmb'), l)} y PAU ${notaTxt(n(v, 'pau'), l)}. Para primero, curso 2026-2027.`, `Assumes: upper secondary average ${notaTxt(n(v, 'nmb'), l)} and PAU ${notaTxt(n(v, 'pau'), l)}. For year one, 2026-2027.`),
          sub: acc >= A.notaMinima ? T(l, `Llega al ${num(A.notaMinima, l)} que pide la convocatoria para tener beca en primero.`, `It reaches the ${num(A.notaMinima, l)} the call requires for a grant in year one.`) : T(l, `No llega al ${num(A.notaMinima, l)}: sin beca en 1.º de grado.`, `Below ${num(A.notaMinima, l)}: no grant in year 1 of a degree.`),
          rows: [
            [T(l, 'Cálculo', 'Working'), `${num(A.notaAcceso.bachillerato, l, 1)} × ${num(n(v, 'nmb'), l)} + ${num(A.notaAcceso.pau, l, 1)} × ${num(n(v, 'pau'), l)}`],
            [T(l, 'Premio por buena nota (excelencia)', 'Good-grade award (excellence)'), exTxt(acc, ex1), ex1],
          ],
          table,
        };
      }
      const c = B.coefExcelencia(rama), m2 = n(v, 'media2') * c, ex2 = B.excelencia(m2);
      return {
        label: T(l, 'Tu media para el premio por buena nota (excelencia)', 'Your average for the good-grade award (excellence)'), value: num(m2, l),
        hyp: T(l, `Supone: media de ${notaTxt(n(v, 'media2'), l)} el curso pasado en ${ramaName(rama, l)}. Curso 2026-2027.`, `Assumes: ${notaTxt(n(v, 'media2'), l)} average last year in ${ramaName(rama, l)}. 2026-2027.`),
        sub: T(l, `Tu media × ${num(c, l)}, el coeficiente de ${ramaName(rama, l)}. Desde segundo, el requisito para tener beca es aprobar un porcentaje de créditos: la nota sirve para la excelencia.`, `Your average × ${num(c, l)}, the coefficient for ${ramaName(rama, l)}. From year two, the grant requirement is passing a share of credits: the grade counts for excellence.`),
        rows: [
          [T(l, 'Cálculo', 'Working'), `${num(n(v, 'media2'), l)} × ${num(c, l)}`],
          [T(l, 'Premio por buena nota (excelencia)', 'Good-grade award (excellence)'), exTxt(m2, ex2), ex2],
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
      { id: 'miembros', label: MIEMBROS(l), def: 4, max: 20, help: MIEMBROS_HELP(l) },
      { id: 'renta', label: RENTA_LABEL(l), def: 30000, unit: '€', max: 1e7, help: RENTA_HELP(l), link: RENTA_LINK(l) },
      { kind: 'select', id: 'estudio', label: T(l, 'Estudios', 'Studies'), def: 'grado', options: estudioOpts(l), help: ESTUDIO_HELP(l), wide: true },
      { kind: 'select', id: 'mat', label: T(l, 'Matrícula', 'Enrolment'), def: 'completa', options: matOpts(l), adv: true, wide: true },
      { kind: 'choice', id: 'mod', label: T(l, 'Modalidad', 'Mode'), def: 'presencial', options: modOpts(l), help: T(l, 'Presencial incluye semipresencial (artículo 7).', 'In person includes blended study (article 7).'), adv: true, wide: true },
      { kind: 'select', id: 'disc', label: T(l, 'Discapacidad del estudiante', "Student's disability"), def: 'no', options: discOpts(l), adv: true },
    ],
    run: (v) => {
      const base = { miembros: n(v, 'miembros'), renta: n(v, 'renta'), estudio: s(v, 'estudio') as B.Estudio, matricula: (s(v, 'mat') || 'completa') as B.Matricula, presencial: s(v, 'mod') !== 'distancia', nota: 0, rama: 'sociales' as B.Rama, primero: false, academicoOk: true, patrimonioPct: 0, insular: 'no' as B.Insular, disc: (s(v, 'disc') || 'no') as B.Disc };
      const r = B.beca({ ...base, fuera: true }), enCasa = B.beca({ ...base, fuera: false });
      const res = r.lineas.find((x) => x.c === 'residencia')?.importe ?? 0;
      const why = res > 0 ? T(l, 'La ayuda por vivir fuera de casa se paga solo si justifica alquiler, residencia o pensión, y nunca más que el gasto real.\nSi estudia en su ciudad, normalmente no hay.', 'The living-away amount is paid only with proof of rent, a hall or lodging, and never above the real cost.\nStudying in the home town, there is usually none.')
        : r.umbral > 2 ? T(l, `Renta por encima del umbral 2 (${eur(r.u.u2, l)}): no hay ayuda por vivir fuera de casa.`, `Income above threshold 2 (${eur(r.u.u2, l)}): no living-away amount.`)
          : T(l, 'Estos estudios o esta matrícula no dan derecho a la ayuda por vivir fuera de casa.', 'These studies or this enrolment do not qualify for the living-away amount.');
      return {
        // Un seul chiffre par cas (testeurs du 2026-11-10) : le total, au même format que la portada, et l'hypothèse
        // « fuera de casa » en tête, en gras ; la ligne dessous donne le chiffre « en casa » de la portada.
        label: T(l, 'Si vive fuera de casa y justifica el alquiler', 'If living away from home with proof of rent'), value: grande(r, l),
        hyp: T(l, `Supone: ${int(n(v, 'miembros'), l)} personas, ${eur(n(v, 'renta'), l)} de renta, ${estudioName(s(v, 'estudio'), l).toLowerCase()}, curso entero 2026-2027. Viviendo en casa: ${grande(enCasa, l)}, como en la portada.`, `Assumes: ${int(n(v, 'miembros'), l)} people, ${eur(n(v, 'renta'), l)} income, ${estudioName(s(v, 'estudio'), l)}, whole year 2026-2027. Living at home: ${grande(enCasa, l)}, as on the home page.`),
        sub: why,
        rows: [
          ...(res > 0 ? [[T(l, 'De ellos, ayuda por vivir fuera de casa (residencia)', 'Of which, living-away amount (residence)'), eur(res, l), res] as [string, string, number]] : []),
          ...r.lineas.filter((x) => x.c !== 'residencia').map((x) => [compName(x.c, l), eur(x.importe, l), x.importe] as [string, string, number]),
          [UMBRAL_ROW(l), umbralName(r.umbral, l)], [T(l, 'Hasta qué renta hay ayuda por vivir fuera (umbral 2)', 'Income limit for the living-away amount (threshold 2)'), eur(r.u.u2, l)],
        ],
        note: T(l, 'Sin el premio por buena nota: esta página no pide la nota.', 'Without the good-grade award: this page does not ask for the grade.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ beca de matrícula */
function matriculaSpec(l: Lang): ToolSpec {
  return {
    inputs: [
      // « crédito » = prêt pour la lectrice de 61 ans (testeurs du 2026-11-09) : défini là où on le lit.
      { id: 'cred', label: T(l, 'Créditos (asignaturas) que se matriculan por primera vez', 'Credits (subjects) taken for the first time'), def: 60, max: 120, help: T(l, 'Un crédito es una parte de una asignatura, no un préstamo: un curso entero suele tener 60.', 'A credit is a unit of a subject, not a loan: a whole year usually has 60.') },
      { id: 'precio', label: T(l, 'Precio del crédito en tu universidad', 'Price per credit at your university'), def: 20, unit: '€', max: 500, decimals: 2, help: T(l, 'Está en la web de tu universidad («precios públicos» o «tasas») o en el recibo de la matrícula. ¿No lo sabes? Deja los 20 € del ejemplo.', 'It is on your university\'s website (public fees) or on your enrolment bill. Not sure? Leave the €20 example.') },
      { id: 'seg', label: T(l, 'Créditos que repite (segunda matrícula o más)', 'Credits repeated (second time or more)'), def: 0, max: 120 },
      // Le prix du crédit repassé ne paraît que s'il y en a (testeurs du 2026-11-09 : « 30,00 € » avec 0 crédit repassé).
      { id: 'precio2', label: T(l, 'Precio del crédito repetido', 'Price per repeated credit'), def: 30, unit: '€', max: 500, decimals: 2, when: (v) => n(v, 'seg') > 0 },
      { id: 'miembros', label: MIEMBROS(l), def: 4, max: 20, adv: true, help: MIEMBROS_HELP(l) },
      { id: 'renta', label: RENTA_LABEL(l), def: 30000, unit: '€', max: 1e7, adv: true, help: RENTA_HELP(l) },
    ],
    run: (v) => {
      const um = B.umbralDe(n(v, 'renta'), n(v, 'miembros')), cubre = um <= 3;
      const val = cubre ? B.valorMatricula(n(v, 'cred'), n(v, 'precio')) : 0, pagas = B.valorMatricula(n(v, 'seg'), n(v, 'precio2')) + (cubre ? 0 : B.valorMatricula(n(v, 'cred'), n(v, 'precio')));
      return {
        // Le prix d'exemple passe dans le titre, avant le chiffre (testeurs du 2026-11-10 : « 1200 € » retenu sur un prix inventé).
        label: n(v, 'precio') === 20 ? T(l, `Con un precio de ejemplo de ${eur(20, l)} el crédito: lo que la familia deja de pagar`, `With an example price of ${eur(20, l)} per credit: what the family no longer pays`) : T(l, 'Lo que la familia deja de pagar con la matrícula gratis', 'What the family no longer pays with free tuition'), value: eur(val, l),
        hyp: T(l, `Supone: ${int(n(v, 'cred'), l)} créditos nuevos × ${eur(n(v, 'precio'), l)}, curso entero 2026-2027. No es dinero que se cobre: la universidad no lo cobra.`, `Assumes: ${int(n(v, 'cred'), l)} new credits × ${eur(n(v, 'precio'), l)}, whole year 2026-2027. It is not money paid out: the university does not charge it.`),
        sub: cubre ? T(l, 'Hasta el umbral 3 las asignaturas nuevas son gratis; las que se repiten, no.', 'Up to threshold 3 new subjects are free; repeated ones are not.') : T(l, 'Por encima del umbral 3 no hay matrícula gratis.', 'Above threshold 3 there is no free tuition.'),
        rows: [[T(l, 'Paga la familia', 'The family pays'), eur(pagas, l), pagas], [T(l, `Umbral con ${int(n(v, 'miembros'), l)} personas y ${eur(n(v, 'renta'), l)} de renta`, `Threshold for ${int(n(v, 'miembros'), l)} people and ${eur(n(v, 'renta'), l)} income`), umbralName(um, l)]],
        note: T(l, 'El precio del crédito lo fija cada comunidad: por eso te pedimos el de tu universidad.', 'Each region sets the credit price: that is why we ask for your university\'s.'),
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
  { iso: CV.ccaaComunicanFijas, es: 'Las comunidades y universidades envían al Ministerio las notas y lo que cobra cada estudiante', en: 'Regions and universities send grades and fixed amounts to the Ministry', art: 'art. 51.8 y 51.10', quien: 'admin' },
  { iso: CV.solicitudTardiaHasta, es: 'Último día para pedirla tarde: solo si quien más ingresa en casa fallece o se jubila a la fuerza', en: 'Last day for a late application, only if the main earner dies or is forced to retire', art: 'art. 48.2', quien: 'tardia' },
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
      { id: 'dia', label: T(l, 'Día de hoy (ya puesto: cámbialo para ver otra fecha)', 'Today (already filled in: change it to see another date)'), def: Number(LAST_UPDATED.slice(8, 10)), max: 31, hoy: 'dia', wide: true },
      { kind: 'select', id: 'mes', hoy: 'mes', label: T(l, 'Mes', 'Month'), def: String(Number(LAST_UPDATED.slice(5, 7))), options: Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: new Date(Date.UTC(2026, i, 15)).toLocaleDateString(l === 'es' ? 'es-ES' : 'en-GB', { month: 'long', timeZone: 'UTC' }) })) },
      { id: 'anio', label: T(l, 'Año', 'Year'), def: Number(LAST_UPDATED.slice(0, 4)), max: 2030, hoy: 'anio' },
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
      // Plazo cerrado : en grand, la prochaine action de l'étudiant (beca 2027-2028), et la date administrative en ligne
      // (test naïf du 2026-11-08 : « 4 de diciembre » en vedette, alors qu'elle n'y fait rien).
      if (cerrado) {
        const ini = day(CV.plazoInicio, l), fin = day(CV.plazoFin, l);
        const filas: Array<[string, string, number?]> = [
          [T(l, 'Plazo de la beca 2026-2027', '2026-2027 application window'), T(l, `Cerrado el ${fin}`, `Closed on ${fin}`)],
          ...(prox ? [[T(l, 'Si ya la pediste: próxima fecha', 'If you already applied: next date'), `${day(prox.iso, l)} · ${quienTxt(prox.quien, l)}`] as [string, string]] : []),
        ];
        return {
          // « Pedir la beca 2027-2028 » faisait chercher un formulaire (testeurs du 2026-11-09) : rien n'est ouvert, on prépare.
          label: T(l, 'Ahora no hay ningún plazo abierto. Tu próximo paso', 'No window is open now. Your next step'), value: T(l, 'Preparar la beca 2027-2028', 'Prepare for the 2027-2028 grant'),
          // « Préparer, mais quoi ? » (testeuse de 61 ans, 2026-11-10) : trois gestes concrets, sans date inventée.
          sub: T(l, `Es la beca de los estudios que empiezan en septiembre de 2027. Aún no hay nada que pedir: su plazo no tiene fecha (este año fue del ${ini} al ${fin}).\nQué puedes hacer ya: 1) Guardar la declaración de la renta de 2026 cuando la hagáis, en la primavera de 2027: es la que contará.\n2) Tener una firma electrónica para pedir la beca por internet: la web del Ministerio (su sede electrónica) dice cuáles acepta.\n3) Volver aquí cuando salgan las cifras nuevas en el BOE, normalmente en marzo.`, `It is the grant for studies starting in September 2027. There is nothing to apply for yet: its window has no date (this year's ran from ${ini} to ${fin}).\nWhat you can do now: 1) Keep the 2026 tax return once filed, in spring 2027: it is the one that will count.\n2) Get an electronic signature to apply online: the Ministry's e-office lists the ones it accepts.\n3) Come back when the new figures appear in the BOE, usually in March.`),
          rows: filas,
          table: {
            caption: T(l, 'Convocatoria general 2026-2027', '2026-2027 general call'),
            headers: [T(l, 'Fecha', 'Date'), T(l, 'Qué pasa', 'What happens'), T(l, 'Quién actúa', 'Who acts')],
            rows: HITOS.map((h) => [day(h.iso, l), (h.iso < hoy ? '✓ ' : '') + (l === 'es' ? h.es : h.en), quienTxt(h.quien, l)]), align: ['l', 'l', 'l'],
          },
        };
      }
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
      // Exemple dans le passé (test naïf : « une notification du 10 novembre, alors qu'on est le 8 »).
      { id: 'dia', label: T(l, 'Día de la notificación', 'Notification day'), def: 3, max: 31 },
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
