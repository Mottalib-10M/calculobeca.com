/** Formats partagés par les fichiers de contenu (non chargé comme page : préfixe _). */
import P from '../../data/params-2026.json';
import { formatMoney, formatDecimal, displayDate } from '../../lib/format';
import { umbrales } from '../../lib/engine/beca';
export type L = 'es' | 'en';
export const eur = (x: number, l: L) => formatMoney(x, Number.isInteger(x) ? 0 : 2, l);
export const dec = (x: number, l: L, d = 2) => formatDecimal(x, d, l);
export const day = (iso: string, l: L) => displayDate(iso, l === 'es' ? 'es-ES' : 'en-GB');
export const U = umbrales;
export { P };
export const C = P.cuantias, CV = P.convocatoria, A = P.academico, D = P.deducciones, PT = P.patrimonio;
