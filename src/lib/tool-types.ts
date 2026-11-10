/** Declarative calculators (src/lib/tool-specs.ts), rendered by components/calc/SpecTool.tsx. */
export type V = Record<string, number | string>;
/** `when` : le champ ne s'affiche que si la condition est vraie (ex. la media de 2.º seulement en 2.º). `link` : lien sous l'aide. */
/** `hoy` : rempli après le montage avec la date du jour (jamais au premier rendu, RECETTE §17.5). */
export interface NumIn { kind?: 'num'; id: string; label: string; def: number; hoy?: 'dia' | 'anio'; unit?: string; max?: number; decimals?: number; help?: string; adv?: boolean; wide?: boolean; when?: (v: V) => boolean; link?: { href: string; text: string } }
export interface ChoiceIn { kind: 'choice'; id: string; label: string; def: string; options: Array<{ value: string; label: string }>; help?: string; adv?: boolean; wide?: boolean; when?: (v: V) => boolean }
export type Opt = { value: string; label: string };
/** Options can depend on the other fields (the counties of the chosen state). */
export interface SelectIn { kind: 'select'; id: string; label: string; def: string; hoy?: 'mes'; options: Opt[] | ((v: V) => Opt[]); help?: string; adv?: boolean; wide?: boolean; when?: (v: V) => boolean }
export type Input = NumIn | ChoiceIn | SelectIn;
export interface OutTable { caption?: string; headers: string[]; rows: string[][]; align?: Array<'l' | 'r'> }
export interface ToolOut {
  label: string; value: string;
  /** Ce que suppose le gros chiffre et sur quelle période (testeurs du 2026-11-10 : « 60 €, 1200 € ou 2700 € ? »). */
  hyp?: string;
  /** Lignes courtes séparées par « \n » : une phrase, un chiffre (testeurs du 2026-11-10 : « un mur de texte »). */
  sub?: string;
  /** Lien sous les lignes (« Cuánto vale la matrícula gratis en tu universidad »). */
  link?: { href: string; text: string };
  rows: Array<[string, string, number?]>;
  table?: OutTable;
  /** Tableaux supplémentaires, sous le premier. */
  tables?: OutTable[];
  note?: string;
}
/** `exemple: false` : les valeurs par défaut ne sont pas un exemple (la date du jour du calendrier). */
/** `comparte` : valeurs que ce simulateur transmet aux autres pages (lib/datos-compartidos.ts) en plus des champs communs
 *  (la calculadora de renta familiar transmet la renta calculée). */
export interface ToolSpec { inputs: Input[]; run: (v: V) => ToolOut; exemple?: boolean; comparte?: (v: V) => Record<string, string | number> }
/** The options of a select for the current values, and the value actually in force (the first option
 *  when the stored one is not offered, e.g. a county of the previous state). */
export const optsOf = (i: SelectIn, v: V): Opt[] => (typeof i.options === 'function' ? i.options(v) : i.options);
export function resolve(inputs: Input[], v: V): V {
  const out: V = { ...v };
  for (const i of inputs) if (i.kind === 'select') { const o = optsOf(i, out); if (!o.some((x) => x.value === String(out[i.id]))) out[i.id] = o[0]?.value ?? ''; }
  return out;
}
