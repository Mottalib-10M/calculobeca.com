/** Pièces communes des simulateurs : carte de résultat, lignes de détail, choix, lien de partage. */
import { useState, type ReactNode } from 'react';

/* Testeurs du 2026-11-10 : l'hypothèse d'un chiffre se lit AVANT lui, en gras (« Si vive fuera de casa »), et la
   ligne « Supone: … » dit dessous ce qu'il suppose et sur quelle période ; le texte se coupe en lignes courtes. */
export function ResultCard({ label, value, hyp, sub, link, pre, children }: { label: string; value: string; hyp?: string; sub?: string; link?: { href: string; text: string }; pre?: ReactNode; children?: ReactNode }) {
  const lignes = (sub ?? '').split('\n').map((x) => x.trim()).filter(Boolean);
  return (
    <div data-resultat aria-live="polite" className="rounded-lg border-t-4 border-accent-500 bg-navy-50 p-4 sm:p-5">
      {pre}
      <p className="text-base font-bold text-navy-900">{label}</p>
      <p className="tabular-nums mt-1 text-[2.3rem] font-bold leading-tight text-navy-900">{value}</p>
      {hyp && <p data-fixe className="mt-1 text-sm text-navy-700">{hyp}</p>}
      {lignes.length > 0 && <ul className="mt-2 space-y-1 text-[0.95rem] text-navy-800">{lignes.map((x, i) => <li key={i} className={i === 0 && lignes.length > 1 ? 'font-semibold text-navy-900' : ''}>{x}</li>)}</ul>}
      {link && <p className="mt-2 text-sm"><a href={link.href} className="font-medium text-accent-700 underline">{link.text} →</a></p>}
      {children}
    </div>
  );
}

/** Lignes de détail. Plus de barre sous le libellé : sans légende, les testeurs du 2026-11-08 ne savaient pas la lire. */
export function Rows({ rows }: { rows: Array<[string, string, number?]> }) {
  return (
    <table className="mt-3 w-full table-fixed text-sm"><tbody className="divide-y divide-navy-200">
      {rows.map(([l, v]) => (
        <tr key={l}><td className="py-1.5 pe-3 text-navy-700 [overflow-wrap:break-word]">{l}</td><td className="w-[42%] tabular-nums py-1.5 text-right align-top text-navy-900 [overflow-wrap:anywhere]">{v}</td></tr>
      ))}
    </tbody></table>
  );
}

/** Deux à quatre options qui remplissent tout le cadre (RECETTE §10.3). */
export function Choice<T extends string>({ id, label, value, options, onChange, help }: { id: string; label: string; value: T; options: Array<{ value: T; label: string }>; onChange: (v: T) => void; help?: string }) {
  return (
    <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
      <span id={`${id}-l`} className="mb-1 block text-sm font-medium text-navy-700">{label}</span>
      <div role="group" aria-labelledby={`${id}-l`} aria-describedby={help ? `${id}-help` : undefined} className="grid h-12 grid-flow-col auto-cols-fr overflow-hidden rounded-lg border border-navy-300">
        {options.map((o) => (
          <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}
            className={`h-full px-2 text-sm font-medium ${value === o.value ? 'bg-accent-700 text-white' : 'bg-white text-navy-700 hover:bg-navy-50'}`}>{o.label}</button>
        ))}
      </div>
      {help && <p id={`${id}-help`} className="mt-1 text-xs text-navy-500">{help}</p>}
    </div>
  );
}

export function ShareRow({ methodHref, labels }: { methodHref?: string; labels: { copyLink: string; copied: string; print: string; howComputed: string } }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { try { navigator.clipboard?.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* pas de presse-papiers */ } };
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy-600">
      <button type="button" onClick={copy} className="underline hover:text-navy-900">{copied ? labels.copied : labels.copyLink}</button>
      <button type="button" onClick={() => window.print()} className="underline hover:text-navy-900">{labels.print}</button>
      {methodHref && <a href={methodHref} className="underline hover:text-navy-900">{labels.howComputed}</a>}
    </div>
  );
}

/** Mention de la trame (MentionExemple, testeurs naïfs du 2026-11-08) tant que le résultat vient des valeurs
 *  d'exemple ; libellés de lib/libelles-trame.ts, tutoyés en espagnol (`ui.trama`). */
export function Exemple({ exemple, aide }: { exemple: string; aide: string }) {
  return (
    <p data-exemple className="mb-2 inline-flex flex-wrap items-baseline gap-x-1 rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs text-amber-900">
      <strong className="font-semibold">{exemple}</strong><span>· {aide}</span>
    </p>
  );
}
