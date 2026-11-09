/**
 * Rend un simulateur déclaratif (src/lib/tool-specs.ts) : champs à gauche, carte de résultat à droite
 * (data-resultat), options repliées, lien de partage écrit seulement après une action de l'utilisateur.
 * Premier rendu = valeurs par défaut du build ; un lien partagé est lu après le montage (RECETTE §17.5).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Choice, Exemple, ResultCard, Rows, ShareRow } from './parts';
import { readParams, updateURL } from '../../lib/url-state';
import { getTool, resumenCampo } from '../../lib/tool-specs';
import { optsOf, resolve, type Input, type V } from '../../lib/tool-types';
import { t } from '../../i18n/ui';
import { formatNumber, type Lang } from '../../lib/format';
import { attributsTableau } from '../../lib/tableaux';
import { titreFiche } from '../../lib/fiches';
import { libellesTrame } from '../../lib/libelles-trame';
import { leerDatos, guardarDatos, borrarDatos } from '../../lib/datos-compartidos';

interface Props { kind: string; lang: Lang; arg?: string; methodHref?: string; idPrefix?: string }

export default function SpecTool({ kind, lang, arg, methodHref, idPrefix = 't' }: Props) {
  const ui = t(lang);
  const lib = { ...libellesTrame(lang), ...ui.trama };
  const spec = useMemo(() => getTool(kind, lang, arg ? JSON.parse(arg) : undefined), [kind, lang, arg]);
  const defaults = useMemo(() => Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])) as V, [spec]);
  const [v, setV] = useState<V>(defaults);
  // Données reprises d'une autre page (lib/datos-compartidos.ts) : on le dit, avec un retour à l'exemple.
  const [repris, setRepris] = useState(false);
  const escrito = useRef(false);
  useEffect(() => {
    const next: V = { ...defaults };
    const poner = (id: string, x: string | null) => {
      const i = spec.inputs.find((y) => y.id === id); if (!i || x === null) return false;
      if (i.kind === 'choice') { if (i.options.some((o) => o.value === x)) { next[i.id] = x; return true; } return false; }
      if (i.kind === 'select') { if (optsOf(i, next).some((o) => o.value === x)) { next[i.id] = x; return true; } return false; }
      const f = parseFloat(x); if (isNaN(f)) return false; next[i.id] = Math.min(f, i.max ?? Infinity); return true;
    };
    // Calendrier : la date du jour, lue après le montage (RECETTE §17.5), jamais au premier rendu.
    const hoy = new Date();
    for (const i of spec.inputs) if (i.hoy) next[i.id] = i.hoy === 'dia' ? hoy.getDate() : i.hoy === 'anio' ? hoy.getFullYear() : String(hoy.getMonth() + 1);
    const u = readParams(window.location.search);
    if ([...u.keys()].length) { for (const i of spec.inputs) poner(i.id, u.get(i.id)); setV(next); return; }
    // Un cas précis de la page (toolArg : máster, bachillerato) garde ses études et sa note ; la famille, elle, suit.
    const fijos = new Set(Object.keys(arg ? JSON.parse(arg) : {}).flatMap((k) => (k === 'defEstudio' ? ['estudio'] : k === 'miembros' || k === 'renta' ? [] : [k])));
    const d = leerDatos();
    let algo = false;
    for (const [k, x] of Object.entries(d)) if (!fijos.has(k) && String(next[k]) !== x && poner(k, x ?? null)) algo = true;
    if (algo) setRepris(true);
    setV(next);
  }, []);
  const rv = useMemo(() => resolve(spec.inputs, v), [v, spec]);
  useEffect(() => updateURL(rv as Record<string, string | number>), [rv]);
  useEffect(() => { if (escrito.current) guardarDatos({ ...rv, ...(spec.comparte?.(rv) ?? {}) }); }, [rv]);
  const out = useMemo(() => spec.run(rv), [rv, spec]);
  const set = (id: string) => (x: number | string) => { escrito.current = true; setV((o) => ({ ...o, [id]: x })); };
  const alEjemplo = () => { borrarDatos(); escrito.current = false; setRepris(false); setV(defaults); };
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
  // Résumé du repli : « libellé: valeur » en mots simples, sans le « Ahora: » de la trame (testeurs du 2026-11-09 :
  // « Ahora: » ne disait rien, libellés et valeurs se collaient). Le défaut vient de lib/libelles-trame.ts (resumeRepli).
  const resumen = adv.map((i) => resumenCampo(i.id, rv, lang) ?? `${i.label}: ${valor(i)}`).join(' · ');
  // Tant que rien n'a été changé, le résultat est un exemple, et on le dit (test naïf du 2026-11-08 : « 60 €, c'est ma beca ? »).
  const exemple = spec.exemple !== false && spec.inputs.every((i) => String(rv[i.id]) === String(defaults[i.id]));
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          {repris && <p data-repris className="sm:col-span-2 rounded-md bg-navy-50 px-3 py-2 text-sm text-navy-800">{lang === 'es' ? 'Con los datos que escribiste en otra página.' : 'Using the figures you entered on another page.'} <button type="button" onClick={alEjemplo} className="font-medium text-accent-700 underline">{lang === 'es' ? 'Volver al ejemplo' : 'Back to the example'}</button></p>}
          {main.map(field)}
          {adv.length > 0 && (
            <details data-repli className="sm:col-span-2 rounded-lg border border-navy-200 px-3 py-2">
              <summary className="cursor-pointer text-sm font-medium text-navy-700">{lib.plusDeReglages}<span data-actuellement className="mt-0.5 block text-sm font-normal text-navy-700">{resumen}</span></summary>
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
