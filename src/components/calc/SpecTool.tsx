/**
 * Rend un simulateur déclaratif (src/lib/tool-specs.ts) : champs à gauche, carte de résultat à droite
 * (data-resultat), options repliées, lien de partage écrit seulement après une action de l'utilisateur.
 * Premier rendu = valeurs par défaut du build ; un lien partagé est lu après le montage (RECETTE §17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Choice, Exemple, ResultCard, Rows, ShareRow } from './parts';
import { readParams, updateURL } from '../../lib/url-state';
import { getTool } from '../../lib/tool-specs';
import { optsOf, resolve, type Input, type V } from '../../lib/tool-types';
import { t } from '../../i18n/ui';
import { formatNumber, type Lang } from '../../lib/format';
import { attributsTableau } from '../../lib/tableaux';
import { titreFiche } from '../../lib/fiches';
import { libellesTrame, resumeRepli } from '../../lib/libelles-trame';

interface Props { kind: string; lang: Lang; arg?: string; methodHref?: string; idPrefix?: string }

export default function SpecTool({ kind, lang, arg, methodHref, idPrefix = 't' }: Props) {
  const ui = t(lang);
  const lib = { ...libellesTrame(lang), ...ui.trama };
  const spec = useMemo(() => getTool(kind, lang, arg ? JSON.parse(arg) : undefined), [kind, lang, arg]);
  const defaults = useMemo(() => Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])) as V, [spec]);
  const [v, setV] = useState<V>(defaults);
  useEffect(() => {
    const u = readParams(window.location.search);
    if (![...u.keys()].length) return;
    const next: V = { ...defaults };
    for (const i of spec.inputs) {
      const x = u.get(i.id);
      if (x === null) continue;
      if (i.kind === 'choice') { if (i.options.some((o) => o.value === x)) next[i.id] = x; }
      else if (i.kind === 'select') { if (optsOf(i, next).some((o) => o.value === x)) next[i.id] = x; }
      else { const f = parseFloat(x); if (!isNaN(f)) next[i.id] = Math.min(f, i.max ?? Infinity); }
    }
    setV(next);
  }, []);
  const rv = useMemo(() => resolve(spec.inputs, v), [v, spec]);
  useEffect(() => updateURL(rv as Record<string, string | number>), [rv]);
  const out = useMemo(() => spec.run(rv), [rv, spec]);
  const set = (id: string) => (x: number | string) => setV((o) => ({ ...o, [id]: x }));
  const field = (i: Input) => {
    const id = `${idPrefix}-${i.id}`;
    const cls = i.wide ? 'sm:col-span-2' : '';
    if (i.kind === 'choice') return <div key={i.id} className={`grid grid-rows-subgrid row-span-3 ${cls}`}><Choice id={id} label={i.label} value={String(rv[i.id])} options={i.options} onChange={set(i.id)} /></div>;
    if (i.kind === 'select') return <SelectField key={i.id} id={id} label={i.label} value={String(rv[i.id])} onChange={set(i.id)} options={optsOf(i, rv)} help={i.help} className={cls} />;
    return <NumberField key={i.id} id={id} label={i.label} value={Number(rv[i.id])} onChange={set(i.id)} unit={i.unit} max={i.max} decimals={i.decimals} help={i.help} link={i.link} className={cls} lang={lang} />;
  };
  const shown = spec.inputs.filter((i) => !i.when || i.when(rv));
  const main = shown.filter((i) => !i.adv), adv = shown.filter((i) => i.adv);
  // Les valeurs repliées pilotent le résultat : on les montre sous le titre du repli (test naïf du 2026-11-08 : « d'où sort ce umbral 2 ? »).
  const valor = (i: Input) => {
    if (i.kind === 'choice' || i.kind === 'select') return (i.kind === 'select' ? optsOf(i, rv) : i.options).find((o) => o.value === String(rv[i.id]))?.label ?? '';
    return `${formatNumber(Number(rv[i.id]), i.decimals ?? 0, lang)}${i.unit ? (i.unit === '%' && lang === 'en' ? '%' : ` ${i.unit}`) : ''}`;
  };
  // Tant que rien n'a été changé, le résultat est un exemple, et on le dit (test naïf du 2026-11-08 : « 60 €, c'est ma beca ? »).
  const exemple = spec.exemple !== false && spec.inputs.every((i) => String(rv[i.id]) === String(defaults[i.id]));
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          {main.map(field)}
          {adv.length > 0 && (
            <details data-repli className="sm:col-span-2 rounded-lg border border-navy-200 px-3 py-2">
              <summary className="cursor-pointer text-sm font-medium text-navy-700">{lib.plusDeReglages}<span data-actuellement className="mt-0.5 block text-xs font-normal text-navy-600">{resumeRepli(lang, adv.map((i) => ({ label: i.label, valeur: valor(i) })))}</span></summary>
              <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">{adv.map(field)}</div>
            </details>
          )}
        </form>
        <ResultCard label={out.label} value={out.value} sub={out.sub} pre={exemple ? <Exemple exemple={lib.exemple} aide={lib.exempleAide} /> : undefined}>
          <Rows rows={out.rows} />
          {out.note && <p className="mt-2 text-xs text-navy-600">{out.note}</p>}
          <ShareRow methodHref={methodHref} labels={ui} />
        </ResultCard>
      </div>
      {[out.table, ...(out.tables ?? [])].filter((x) => !!x).map((tb, ti) => (
        <div key={ti} className="mt-4 overflow-x-auto">
          <table className={`w-full text-sm ${attributsTableau('auto', tb!.headers.length).classe}`}>
            {tb!.caption && <caption className="mb-2 text-left text-sm text-navy-700">{tb!.caption}</caption>}
            <thead><tr>{tb!.headers.map((h, i) => <th key={h} scope="col" className={`border-b border-navy-300 px-2 py-1.5 font-semibold text-navy-900 ${tb!.align?.[i] === 'r' ? 'text-right' : 'text-left'}`}>{h}</th>)}</tr></thead>
            <tbody>{tb!.rows.map((r, k) => <tr key={k}>{r.map((c, i) => <td key={i} data-label={titreFiche(tb!.headers, r)[i]} className={`tabular-nums border-b border-navy-100 px-2 py-1.5 text-navy-800 ${tb!.align?.[i] === 'r' ? 'text-right' : 'text-left'}`} dangerouslySetInnerHTML={{ __html: c }} />)}</tr>)}</tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
