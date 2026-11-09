/**
 * Moteur de la beca general (curso 2026-2027), fonctions pures.
 * Chaque règle cite son article : RD 179/2026 (umbrales y cuantías), RD 1721/2007 consolidé, et la
 * convocatoria du 23/03/2026 (BDNS 894743). Toutes les valeurs viennent de params-2026.json.
 */
import P from '../../data/params-2026.json';

export type Estudio = 'grado' | 'master' | 'bach' | 'fpm' | 'fps' | 'basico' | 'idiomas';
export type Rama = 'artes' | 'ciencias' | 'sociales' | 'salud' | 'ingenieria';
export type Matricula = 'completa' | 'p48' | 'p30';
export type Insular = 'no' | 'mayor' | 'menor' | 'mayorPeninsula' | 'menorPeninsula';
export type Disc = 'no' | 'd25' | 'd65';
export type Umbral = 1 | 2 | 3 | 4;

export const C = P.cuantias;
export const UNIV: Estudio[] = ['grado', 'master'];
export const esUniv = (e: Estudio) => UNIV.includes(e);

/* ---------- Umbrales (RD 179/2026, art. 8.1 ; convocatoria art. 19) ---------- */
export interface Umbrales { u1: number; u2: number; u3: number; u1max: number; u3max: number }
export function umbrales(miembros: number): Umbrales {
  const m = Math.max(1, Math.floor(miembros || 1));
  const T = P.umbrales.tabla, A = P.umbrales.adicional;
  if (m <= 8) { const r = T[m - 1]; return { u1: r.u1, u2: r.u2, u3: r.u3, u1max: r.u1max, u3max: r.u3max }; }
  const r = T[7], k = m - 8;
  return { u1: r.u1 + k * A.u1, u2: r.u2 + k * A.u2, u3: r.u3 + k * A.u3, u1max: r.u1max + k * A.u1max, u3max: r.u3max + k * A.u3max };
}
/** 1, 2, 3 : umbral que no se supera ; 4 : por encima del umbral 3 (sin beca). Igualdad = no supera. */
export function umbralDe(renta: number, miembros: number): Umbral {
  const u = umbrales(miembros);
  if (renta <= u.u1) return 1;
  if (renta <= u.u2) return 2;
  if (renta <= u.u3) return 3;
  return 4;
}

/* ---------- Renta familiar (RD 179/2026, arts. 9 y 10 ; convocatoria arts. 16-18) ---------- */
export interface RentaIn {
  sustentadores: number; otros: number; fn: 'no' | 'general' | 'especial'; hermanosFn: number;
  disc33: number; disc65: number; solicitanteUniv65: boolean; fuera: number; orfandad: boolean; monoparental: boolean;
}
export interface RentaOut { bruta: number; deducciones: Array<[string, number]>; computable: number }
export function rentaFamiliar(x: RentaIn): RentaOut {
  const D = P.deducciones;
  const otrosDed = Math.max(0, x.otros) * D.otrosMiembros;
  const bruta = Math.max(0, x.sustentadores) + Math.max(0, x.otros);
  const ded: Array<[string, number]> = [];
  if (otrosDed > 0) ded.push(['otros', otrosDed]);
  const nFn = Math.max(0, Math.floor(x.hermanosFn));
  if (x.fn !== 'no' && nFn > 0) ded.push(['fn', nFn * (x.fn === 'general' ? D.fnGeneral : D.fnEspecial)]);
  const n33 = Math.max(0, Math.floor(x.disc33)), n65 = Math.max(0, Math.floor(x.disc65));
  // Convocatoria art. 18.2.c : 4.000 € si el propio solicitante universitario tiene una discapacidad ≥ 65 %.
  const d65 = x.solicitanteUniv65 && n65 > 0 ? D.disc65UnivSolicitante + (n65 - 1) * D.disc65 : n65 * D.disc65;
  if (n33 + n65 > 0) ded.push(['disc', n33 * D.disc33 + d65]);
  const nf = Math.max(0, Math.floor(x.fuera));
  if (nf >= 2) ded.push(['fuera', nf * D.fueraDomicilio]);
  if (x.monoparental) ded.push(['mono', D.monoparental]);
  let total = bruta - ded.reduce((s, [, v]) => s + v, 0);
  // Art. 10.e : el 20 % de la renta familiar en caso de orfandad absoluta (aplicado sobre la renta ya deducida).
  if (x.orfandad && total > 0) { const o = total * D.orfandad; ded.push(['orf', o]); total -= o; }
  return { bruta, deducciones: ded, computable: Math.max(0, total) };
}

/* ---------- Patrimonio (RD 179/2026, art. 11 ; convocatoria art. 20) ---------- */
export function coefCatastral(anio: number, navarra = false): number {
  if (navarra) return P.patrimonio.navarra;
  const c = P.patrimonio.coeficientes.find((x) => anio >= x.desde && anio <= x.hasta);
  return c ? c.c : 1;
}
export interface PatrimonioIn { urbanas: number; anioRevision: number; navarra: boolean; construccionesRusticas: number; rusticas: number; capital: number; miembros: number; actividades: number }
export interface PatrimonioOut { partes: Array<[string, number]>; suma: number; actividadesSupera: boolean; deniega: boolean; coef: number }
export function patrimonio(x: PatrimonioIn): PatrimonioOut {
  const T = P.patrimonio, coef = coefCatastral(x.anioRevision, x.navarra);
  const pct = (v: number, lim: number) => (lim > 0 ? (Math.max(0, v) / lim) * 100 : 0);
  const partes: Array<[string, number]> = [
    ['urbanas', pct(x.urbanas * coef, T.urbanas)],
    ['construcciones', pct(x.construccionesRusticas * coef, T.construccionesRusticas)],
    ['rusticas', pct(x.rusticas, T.rusticasPorMiembro * Math.max(1, Math.floor(x.miembros)))],
    ['capital', pct(x.capital, T.capital)],
  ];
  const suma = partes.reduce((s, [, v]) => s + v, 0);
  const actividadesSupera = x.actividades > T.actividades;
  return { partes, suma, actividadesSupera, deniega: suma > 100 || actividadesSupera, coef };
}

/* ---------- Nota y excelencia (RD 179/2026, arts. 3.1.d y 4.1.c ; convocatoria art. 8) ---------- */
export const notaAcceso = (nmb: number, pau: number) => P.academico.notaAcceso.bachillerato * nmb + P.academico.notaAcceso.pau * pau;
/** Coeficiente corrector de la excelencia : 2.º y posteriores de grado y 1.º de máster. */
export const coefExcelencia = (rama: Rama) => (P.cuantias.coefExcelencia as Record<Rama, number>)[rama] ?? 1;
export function excelencia(nota: number): number {
  let imp = 0;
  for (const t of P.cuantias.excelencia) if (nota >= t.desde - 1e-9) imp = t.importe;
  return imp;
}

/* ---------- Requisitos académicos de grado (RD 1721/2007 art. 23 y 25 ; convocatoria arts. 24 y 26) ---------- */
export const porcentajeRama = (rama: Rama) => (P.academico.porcentajeRama as Record<Rama, number>)[rama];
/** Porcentaje exigido con « excepcional rendimiento » : base − Y/10, Y = % de créditos sobre 60. */
export function porcentajeExigido(rama: Rama, matriculados: number): number {
  const base = porcentajeRama(rama), min = P.academico.creditosCompleta;
  const y = matriculados > min ? ((matriculados - min) / min) * 100 : 0;
  return base - y / 10;
}
export function cumpleGrado(rama: Rama, matriculados: number, aprobados: number) {
  const exig = porcentajeExigido(rama, matriculados);
  const hecho = matriculados > 0 ? (aprobados / matriculados) * 100 : 0;
  return { exigido: exig, hecho, ok: matriculados > 0 && hecho + 1e-9 >= exig };
}
/** Reintegro (convocatoria art. 43.2) : aprobar al menos el 50 % (40 % en ciencias y técnicas). */
export function reintegroPct(univ: boolean, rama: Rama): number {
  const A = P.academico;
  if (!univ) return A.reintegroNoUniv;
  return rama === 'ciencias' || rama === 'ingenieria' ? A.reintegroUnivCienciasTecnicas : A.reintegroUniv;
}

/* ---------- Cuantías (RD 179/2026, arts. 3, 4, 5, 6 y DA 1.ª ; convocatoria arts. 4-13) ---------- */
export interface BecaIn {
  miembros: number; renta: number; estudio: Estudio; matricula: Matricula; presencial: boolean;
  fuera: boolean; nota: number; rama: Rama; primero: boolean; academicoOk: boolean;
  patrimonioPct: number; insular: Insular; disc: Disc; canarias?: boolean;
}
export type Comp = 'matricula' | 'renta' | 'residencia' | 'basica' | 'excelencia' | 'variable' | 'variableMin' | 'insular';
export interface BecaOut {
  ok: boolean; motivo?: 'umbral' | 'patrimonio' | 'academico';
  umbral: Umbral; u: Umbrales;
  lineas: Array<{ c: Comp; importe: number }>;
  fijo: number; matricula: boolean; variable: 'formula' | 'minima' | 'no';
}
export function beca(x: BecaIn): BecaOut {
  const u = umbrales(x.miembros), um = umbralDe(x.renta, x.miembros);
  const base: BecaOut = { ok: false, umbral: um, u, lineas: [], fijo: 0, matricula: false, variable: 'no' };
  if (um === 4) return { ...base, motivo: 'umbral' };
  if (x.patrimonioPct > 100) return { ...base, motivo: 'patrimonio' };
  if (!x.academicoOk) return { ...base, motivo: 'academico' };
  const univ = esUniv(x.estudio);
  const L: Array<{ c: Comp; importe: number }> = [];
  const add = (c: Comp, importe: number) => { if (importe > 0) L.push({ c, importe }); };
  let matricula = false, variable: BecaOut['variable'] = 'no';
  // La excelencia se calcula sobre la nota con el coeficiente de rama en 2.º y posteriores de grado y en 1.º de máster.
  const notaEx = x.nota * ((x.estudio === 'grado' && !x.primero) || (x.estudio === 'master' && x.primero) ? coefExcelencia(x.rama) : 1);
  const exc = excelencia(notaEx);
  if (univ) {
    matricula = true; // beca de matrícula hasta el umbral 3
    if (x.matricula === 'completa') {
      // DA 1.ª RD 179/2026 : +50 % (≥ 65 %) o +25 % (25-64 %) de las cuantías fijas salvo la matrícula.
      const k = 1 + (x.disc === 'd65' ? C.discapacidad?.d65 ?? 0 : x.disc === 'd25' ? C.discapacidad?.d25 ?? 0 : 0);
      if (um === 1 && x.presencial) add('renta', C.renta * k);
      if (um <= 2 && x.presencial && x.fuera) add('residencia', C.residencia * k);
      add('excelencia', exc * k);
      if (um <= 2) variable = 'formula';
    } else if (x.matricula === 'p48') {
      if (um === 1 && x.presencial) add('renta', C.parcialRenta);
      if (um <= 2 && x.presencial && x.fuera) add('residencia', C.parcialResidencia);
      if (um <= 2) variable = 'minima';
    } else if (um <= 2) variable = 'minima';
  } else if (x.estudio === 'basico' || x.estudio === 'idiomas') {
    // RD 179/2026 art. 3.4 : beca básica y cuantía variable mínima.
    add('basica', x.estudio === 'basico' ? C.basicaGradoBasico : C.basica);
    if (um <= 2) variable = 'minima';
  } else if (x.matricula !== 'completa') {
    add('basica', C.basica);
    if (um <= 2) variable = 'minima';
  } else if (x.presencial) {
    // Art. 3.2 : la beca básica es incompatible con la cuantía ligada a la renta (convocatoria art. 9.3).
    if (um === 1) add('renta', C.renta); else add('basica', C.basica);
    if (um <= 2 && x.fuera) add('residencia', C.residencia);
    add('excelencia', exc);
    if (um <= 2) variable = 'formula';
  } else {
    // Art. 3.3 : distancia, matrícula completa.
    add('basica', C.basica);
    add('excelencia', exc);
    if (um <= 2) variable = 'minima';
  }
  // Art. 12 : umbral 2 ; +300 € en Canarias para la formación profesional (art. 12.4).
  if (um <= 2 && x.insular !== 'no') add('insular', ((C.insular as Record<string, number>)[x.insular] ?? 0) + (x.canarias && (x.estudio === 'fpm' || x.estudio === 'fps' || x.estudio === 'basico') ? C.insular.canariasFp : 0));
  if (variable !== 'no') add(variable === 'formula' ? 'variable' : 'variableMin', C.variableMin);
  const fijo = L.reduce((s, l) => s + l.importe, 0);
  return { ok: L.length > 0 || matricula, umbral: um, u, lineas: L, fijo, matricula, variable };
}

/** Requisito académico simple para el simulador principal (detalle en la herramienta de requisitos). */
export function academicoBasico(estudio: Estudio, primero: boolean, nota: number, rama: Rama, pctAprobado: number): boolean {
  const min = P.academico.notaMinima;
  if (estudio === 'grado') return primero ? nota >= min : pctAprobado >= porcentajeRama(rama);
  if (estudio === 'master') return primero ? nota * (rama === 'ingenieria' ? P.academico.masterCoefTecnicas : 1) >= min : pctAprobado >= 100;
  if (estudio === 'bach' || estudio === 'fps') return primero ? nota >= min : pctAprobado >= P.academico.noUnivModulosHoras;
  if (estudio === 'fpm') return primero ? true : pctAprobado >= P.academico.noUnivModulosHoras;
  return true;
}

/** Valor de la beca de matrícula : créditos de primera matrícula × precio del crédito. */
export const valorMatricula = (creditos: number, precio: number) => Math.max(0, creditos) * Math.max(0, precio);
