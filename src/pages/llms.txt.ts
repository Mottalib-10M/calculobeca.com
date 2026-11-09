/** llms.txt (RECETTE §21), generado a partir del registro de páginas. */
import { GUIDES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
import { KIT as K } from '../lib/kit';
export function GET() {
  const P = K.P, C = P.cuantias, u4 = K.umbrales(4), CV = P.convocatoria;
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> Calculators and guides on Spain's general state study grant (beca general, often called "beca MEC") for ${P.curso}, in Spanish and English. Figures re-read on ${P.retrieved_at} in Royal Decree ${P.rd.numero} (BOE ${P.rd.boe}), the consolidated Royal Decree 1721/2007 and the call of ${CV.resolucion} (BDNS ${CV.bdns}). Fixed amounts: income-linked ${C.renta} EUR (threshold 1), residence ${C.residencia} EUR (threshold 2, full-time in-person, living away), basic grant ${C.basica} EUR (${C.basicaGradoBasico} EUR in basic VET), excellence ${C.excelencia[0].importe}-${C.excelencia[C.excelencia.length - 1].importe} EUR from an average of ${C.excelencia[0].desde}, minimum variable amount ${C.variableMin} EUR; tuition waiver up to threshold 3 for university students. Thresholds for a 4-member household: ${u4.u1} / ${u4.u2} / ${u4.u3} EUR of 2025 family income. The variable amount is shared out by the Ministry with a formula (call, art. 10) and cannot be predicted to the euro. Application window ${CV.plazoInicio} to ${CV.plazoFin}. Browser-only tools, nothing sent or stored. Independent site published by Radif Partners: not the Ministry of Education, handles no applications. Based on data from the Agencia Estatal Boletín Oficial del Estado (www.boe.es). Last updated ${LAST_UPDATED}.`, '',
    `- [Simulador de beca](${SITE_URL}${route('home', 'es')})`, `- [Grant simulator](${SITE_URL}${route('home', 'en')})`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label.en} / ${g.label.es}`, ...GUIDES.filter((p) => p.group === g.id).flatMap((p) => [
      `- [${p.es.nav}](${SITE_URL}${route(p.id, 'es')}): ${p.es.card}`,
      `- [${p.en.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.en.card}`,
    ]), '']),
    '## About', `- [Método](${SITE_URL}${route('method', 'es')})`, `- [Method](${SITE_URL}${route('method', 'en')})`, `- [Quiénes somos](${SITE_URL}${route('about', 'es')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
