/**
 * Les réponses communes à plusieurs simulateurs (famille, renta, études, logement, note) suivent le lecteur d'une
 * page à l'autre (testeurs naïfs du 2026-11-08 : « il faudra tout retaper » ; audit du 2026-11-09).
 *
 * - sessionStorage seulement : rien ne part du navigateur, et tout s'efface quand on ferme l'onglet
 *   (la page de confidentialité et la ligne sous le simulateur le disent).
 * - Écrit seulement après une saisie du lecteur, lu seulement après le montage (RECETTE §17.5) : le premier
 *   rendu reste celui du build, et un lien partagé (paramètres dans l'adresse) passe avant.
 * - La portada en déduit aussi l'umbral (`um`) pour la page des cuantías.
 */
import { umbralDe } from './engine/beca';

const CLE = 'calculobeca-datos';
export const COMPARTIDOS = ['miembros', 'renta', 'estudio', 'curso', 'fuera', 'nota'] as const;
export type Datos = Partial<Record<(typeof COMPARTIDOS)[number] | 'um', string>>;

/* Un même identifiant n'a pas toujours le même sens (« fuera » = oui/non sur la portada, nombre d'enfants sur la page
   de renta) : seules les valeurs du sens commun sont gardées. */
const num = (x: string) => x.trim() !== '' && !isNaN(Number(x));
const VALIDO: Record<(typeof COMPARTIDOS)[number], (x: string) => boolean> = {
  miembros: num, renta: num, nota: num, estudio: (x) => /^[a-z]+$/.test(x),
  curso: (x) => x === 'primero' || x === 'posterior', fuera: (x) => x === 'si' || x === 'no',
};

export function leerDatos(): Datos {
  try { const x = JSON.parse(window.sessionStorage.getItem(CLE) ?? '{}'); return x && typeof x === 'object' ? x as Datos : {}; } catch { return {}; }
}

export function guardarDatos(v: Record<string, string | number>): void {
  try {
    const d: Datos = { ...leerDatos() };
    for (const k of COMPARTIDOS) if (v[k] !== undefined && v[k] !== '' && VALIDO[k](String(v[k]))) d[k] = String(v[k]);
    const m = Number(d.miembros), r = Number(d.renta);
    if (m > 0 && !isNaN(r)) { const u = umbralDe(r, Math.floor(m)); if (u <= 3) d.um = String(u); else delete d.um; }
    window.sessionStorage.setItem(CLE, JSON.stringify(d));
  } catch { /* stockage refusé (navigation privée) : on n'insiste pas */ }
}

export function borrarDatos(): void { try { window.sessionStorage.removeItem(CLE); } catch { /* rien */ } }
