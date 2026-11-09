/**
 * Plazos administrativos (Ley 39/2015, art. 30 ; convocatoria 2026-2027, arts. 51 y 57), fonctions pures, en UTC.
 * Días hábiles : on retire samedis et dimanches. Les jours fériés nationaux, autonómicos et locaux ne sont pas
 * connus ici : la page le dit, ils allongent le plazo.
 */
export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const fromIso = (s: string) => new Date(`${s}T00:00:00Z`);
const finde = (d: Date) => d.getUTCDay() === 0 || d.getUTCDay() === 6;
const sig = (d: Date) => new Date(d.getTime() + 86400000);

/** N días hábiles contados desde el día siguiente a la notificación (art. 30.2 y 30.3). */
export function masHabiles(desde: string, n: number): string {
  let d = fromIso(desde), k = 0;
  while (k < n) { d = sig(d); if (!finde(d)) k++; }
  return iso(d);
}
/** Plazo en meses (art. 30.4) : el mismo día del mes de vencimiento, o el último si no existe ; si es inhábil, el siguiente hábil. */
export function masMeses(desde: string, meses: number): string {
  const d = fromIso(desde);
  const y = d.getUTCFullYear(), m = d.getUTCMonth() + meses;
  const ultimo = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  let r = new Date(Date.UTC(y, m, Math.min(d.getUTCDate(), ultimo)));
  while (finde(r)) r = sig(r);
  return iso(r);
}
/** ¿El intervalo cruza agosto? (inhábil para el recurso contencioso-administrativo, Ley 29/1998, art. 128.2). */
export function cruzaAgosto(desde: string, hasta: string): boolean {
  const a = fromIso(desde), b = fromIso(hasta);
  for (let y = a.getUTCFullYear(); y <= b.getUTCFullYear(); y++) {
    const ini = Date.UTC(y, 7, 1), fin = Date.UTC(y, 7, 31);
    if (b.getTime() >= ini && a.getTime() <= fin) return true;
  }
  return false;
}
export function contencioso(desde: string, meses: number): string {
  const f = masMeses(desde, meses);
  return cruzaAgosto(desde, f) ? masMeses(desde, meses + 1) : f;
}
export const diasEntre = (a: string, b: string) => Math.round((fromIso(b).getTime() - fromIso(a).getTime()) / 86400000);
/** Fecha válida a partir de día, mes y año (el día se recorta al último del mes). */
export function fecha(dia: number, mes: number, anio: number): string {
  const m = Math.min(12, Math.max(1, Math.floor(mes) || 1)), y = Math.floor(anio) || 2026;
  const ultimo = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return iso(new Date(Date.UTC(y, m - 1, Math.min(ultimo, Math.max(1, Math.floor(dia) || 1)))));
}
