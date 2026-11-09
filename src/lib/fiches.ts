import { etiquettes } from './tableaux';

/** Libellés des fiches (trame : `etiquettes`). Une fiche dont le titre n'est qu'un nombre (« 3 », « 4 ») garde le nom
 *  de sa colonne (« Personas que cuentan en la familia: 3 ») : seul, le chiffre ne dit rien (captures du 2026-11-08). */
export function titreFiche(headers: string[], r: Array<string | number>): string[] {
  const l = etiquettes(headers, r.length);
  if (/^[\d\s.,%€+\-–]+$/.test(String(r[0] ?? '').replace(/<[^>]+>/g, '').trim())) l[0] = (headers[0] ?? '').trim();
  return l;
}
