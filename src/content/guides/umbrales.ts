import { defineGuide } from '../../lib/page-types';
import { eur, U, P, day } from './_f';

/* Umbrales de renta: RD 179/2026 art. 8 (tabla, intervalos y financiación del intervalo, art. 8.2);
   convocatoria art. 19 (extremo inferior). Miembros computables: convocatoria art. 17. */
const T = P.umbrales.tabla, AD = P.umbrales.adicional, u4 = U(4), u3 = U(3);
const tabla = (l: 'es' | 'en') => T.map((t) => [String(t.m), eur(t.u1, l), eur(t.u2, l), eur(t.u3, l)]).concat([[l === 'es' ? 'Cada persona más' : 'Each extra member', `+${eur(AD.u1, l)}`, `+${eur(AD.u2, l)}`, `+${eur(AD.u3, l)}`]]);

export default defineGuide({
  id: 'umbrales', group: 'dinero', order: 1,
  tool: 'umbrales',
  related: ['renta', 'patrimonio', 'cuantias', 'home'],
  sources: ['rd179', 'convocatoria', 'extracto'],
  es: {
    slug: 'umbrales-de-renta',
    nav: 'Umbrales de renta 2026-2027', card: 'Los tres límites de renta de la familia según cuántos sois, y en cuál está la tuya',
    title: 'Umbrales becas MEC 2026-2027: tabla por miembros y cálculo',
    description: 'Umbrales de renta de la beca general 2026-2027 según el Real Decreto 179/2026: tabla de 1 a 8 miembros y más, y calculadora para saber en qué umbral caes.',
    h1: 'Umbrales de renta de la beca general 2026-2027',
    intro: 'Escribe cuántas personas cuentan en tu familia y su renta de un año: la calculadora la compara con los umbrales de la beca (los tres tramos de renta), te dice en cuál está la familia y cuánto margen le queda.',
    resume: `La beca general del Estado, la beca MEC, usa tres umbrales: tres tramos de renta de la familia que cambian según cuántas personas cuentan en ella. Para una familia de cuatro, el umbral 1 llega hasta ${eur(u4.u1, 'es')}, el umbral 2 hasta ${eur(u4.u2, 'es')} y el umbral 3 hasta ${eur(u4.u3, 'es')}. El umbral 1 es el de menos renta y el que más da: matrícula gratis, ${eur(P.cuantias.renta, 'es')} por renta baja, la ayuda por vivir fuera de casa si el estudiante vive fuera, el premio por buena nota y el extra de final de curso. En el umbral 2 se pierden los ${eur(P.cuantias.renta, 'es')} por renta baja y se mantiene lo demás. En el umbral 3 solo quedan la matrícula gratis en la universidad, la beca básica de ${eur(P.cuantias.basica, 'es')} en bachillerato y FP (formación profesional) y el premio por buena nota. Por encima del umbral 3 no hay beca. La renta que se compara es la de toda la familia en un año, ya sin impuestos, con algunas rebajas. Si la renta es justo igual al límite, sigue dentro. Para la beca 2026-2027 cuenta la renta de 2025.`,
    faqs: [
      { q: '¿Qué año de renta cuenta para la beca del curso 2026-2027?', a: 'Cuenta la renta de 2025, la de la declaración que se presentó entre abril y junio de 2026. Si los ingresos bajaron en 2026, por ejemplo por un despido, no cambian esta beca. La excepción es que fallezca o se jubile de forma forzosa quien más ingresa en casa. Para la beca 2027-2028, si no cambia la regla, contará la renta de 2026.' },
      { q: '¿Quién cuenta como persona de la familia para la beca?', a: 'Los padres o tutores, el estudiante, los hermanos solteros menores de 25 años que viven en casa, los mayores de 25 con discapacidad y los abuelos empadronados en la misma casa, todo ello a 31 de diciembre. Si los padres están separados, no cuenta el que no vive con el estudiante, pero sí su nueva pareja si vive en casa.' },
      { q: '¿Por qué los umbrales de 2026-2027 son más altos que los del curso anterior?', a: 'Porque el Gobierno los fija cada año en un real decreto nuevo y los ajusta. Esta página solo usa los del curso 2026-2027. No comparamos con años anteriores ni anunciamos los de 2027-2028, que aún no existen: saldrán en otro real decreto, normalmente en marzo, y entonces cambiaremos la tabla.' },
    ],
    body: (h) => `<h2>La tabla de umbrales de la beca 2026-2027</h2>
<p>Busca la fila de tu familia. Cada cifra es la renta máxima de un año, en euros, para quedarse en ese umbral. Salen del ${h.src('rd179', 'real decreto de umbrales publicado en el BOE')}.</p>
${h.table(['Personas', 'Umbral 1', 'Umbral 2', 'Umbral 3'], tabla('es'), 'Umbrales de renta de la familia, curso 2026-2027', ['l', 'r', 'r', 'r'])}
<p>Con más de ocho personas, cada persona más suma lo que dice la última fila.</p>
<h2>Qué da cada umbral</h2>
<ul>
<li><strong>Umbral 1</strong>: matrícula gratis, ${h.eur(P.cuantias.renta)} por renta baja, la ayuda por vivir fuera de casa, el premio por buena nota y el extra de final de curso.</li>
<li><strong>Umbral 2</strong>: lo mismo, sin los ${h.eur(P.cuantias.renta)} por renta baja.</li>
<li><strong>Umbral 3</strong>: matrícula gratis en la universidad, o la beca básica de ${h.eur(P.cuantias.basica)} en bachillerato y FP, y el premio por buena nota.</li>
</ul>
<p>Un solo euro de más basta para pasar al umbral siguiente. Por eso conviene calcular bien la renta con la ${h.a('renta', 'calculadora de renta familiar')}. Cada ayuda se explica en ${h.a('cuantias', 'cuantías de la beca')}.</p>
<h2>La renta que se compara</h2>
<p>No es el sueldo: es lo que ganó toda la familia en el año, ya sin impuestos.</p>
<p>A esa cifra se le aplican rebajas, por ejemplo por familia numerosa, por discapacidad o por tener dos hijos en la universidad fuera de casa. Muchas familias que creen pasarse quedan dentro después de las rebajas.</p>
<p>La beca mira también los bienes de la familia, el ${h.a('patrimonio', 'patrimonio')}: otra casa, terrenos o ahorros grandes pueden quitarla aunque la renta sea baja.</p>`,
  },

  en: {
    slug: 'income-thresholds',
    nav: 'Income thresholds 2026-2027', card: 'The three family income limits by household size, and which one you fall under',
    title: 'Beca MEC income thresholds 2026-2027: table by household',
    description: 'Income thresholds for Spain\'s 2026-2027 general study grant under Royal Decree 179/2026: table for 1 to 8+ members and a calculator to find your threshold.',
    h1: 'Beca MEC (Ministry of Education) income thresholds',
    intro: 'Enter how many members your household counts and its 2025 income: the calculator shows which beca MEC income threshold you reach and how much room is left before the next one.',
    resume: `Spain's general state study grant for 2026-2027 works with three family income thresholds, set by article 8 of Royal Decree 179/2026 of 11 March, published in the Official Gazette (BOE) on 12 March 2026. For a four-member household they are ${eur(u4.u1, 'en')}, ${eur(u4.u2, 'en')} and ${eur(u4.u3, 'en')} of family income for the year 2025. Staying within threshold 1 opens the fixed income-linked amount of ${eur(P.cuantias.renta, 'en')} on top of everything else; up to threshold 2 you keep the residence amount and the variable amount; up to threshold 3 only the tuition waiver, the basic grant and the excellence amount remain. Above threshold 3 there is no component at all. The figure compared is not a salary or the bottom line of the tax return: it is family income for grant purposes, after its own deductions. Being exactly on a threshold counts as not exceeding it. The full table is below and the calculator checks your case.`,
    faqs: [
      { q: 'Which tax year counts for the 2026-2027 grant?', a: 'The 2025 tax year, meaning the income tax return filed between April and June 2026. Article 9 of Royal Decree 179/2026 and article 16 of the call say so. If your income fell in 2026 after a dismissal, this call does not take it into account, except where the main earner died or was forced to retire.' },
      { q: 'Why does the BOE give two figures for thresholds 1 and 3, and which does the calculator use?', a: `The calculator uses the lower one, which is the one the Ministry's call always applies. The Royal Decree sets thresholds 1 and 3 as a range: for four members, ${eur(u4.u1, 'en')} to ${eur(u4.u1max, 'en')} and ${eur(u4.u3, 'en')} to ${eur(u4.u3max, 'en')}. Only a region with full powers over grants can award within the range, paying half itself.` },
      { q: 'Who counts as a household member for the grant?', a: 'Your parents or guardians, you, unmarried siblings under 25 living at home, older siblings with a disability and grandparents registered at the same address, all as at 31 December 2025. If your parents are separated, the one not living with you does not count, but a new partner living in the home does. Article 17 of the call sets this out.' },
      { q: 'Why are the 2026-2027 thresholds higher than last year?', a: 'Because the Government sets them in a new royal decree every year and adjusts them. This page only uses Royal Decree 179/2026, for 2026-2027. It neither compares with past years nor announces the 2027-2028 figures, which do not exist yet. They will come in another decree, usually in March, and the table will be updated then.' },
    ],
    body: (h) => `<h2>The 2026-2027 beca MEC income threshold table</h2>
<p>These are the limits applied by the Ministry of Education's call in its article 19, taken from ${h.src('rd179', 'article 8 of Royal Decree 179/2026')}. All figures are euros of family income for 2025.</p>
${h.table(['Members', 'Threshold 1', 'Threshold 2', 'Threshold 3'], tabla('en'), 'Family income thresholds, 2026-2027', ['l', 'r', 'r', 'r'])}
<h2>What each threshold gives access to</h2>
<p>The thresholds decide not just whether there is a grant but which parts make it up. Threshold 1 is the only one that gives the fixed income-linked amount of ${h.eur(P.cuantias.renta)}. Up to threshold 2 you can get the residence amount of ${h.eur(P.cuantias.residencia)} if you study far from home, and you share in the variable amount. Up to threshold 3 you keep the tuition waiver for university students, the basic grant of ${h.eur(P.cuantias.basica)} below university level and the academic excellence amount. The breakdown by studies is on the ${h.a('cuantias', 'grant amounts')} page.</p>
<p>An example with three members: a family income of ${h.eur(u3.u1)} sits in threshold 1; one euro more and it moves to threshold 2, losing the income-linked amount. That is why it pays to work out family income for grant purposes properly before writing anything off.</p>
<h2>The income that is compared</h2>
<p>The figure set against the table is family income for grant purposes, not total pay. It starts from each member's general and savings tax base, takes off the tax due on the return and then applies the deductions: half of the income of siblings or grandparents, large family status, disability, siblings at university away from home, orphanhood or single-parent family. Many households who think they are above threshold 2 drop below it after the deductions. The ${h.a('renta', 'family income calculator')} does the sums.</p>
<p>There is a second filter besides income: ${h.a('patrimonio', 'family wealth')}. Even with income inside threshold 1, the grant is refused if the family's property, savings income or business turnover exceed the limits in article 11 of the Royal Decree.</p>
<h3>Households of more than eight</h3>
<p>From the eighth member on, each additional person adds ${h.eur(AD.u1)} to threshold 1, ${h.eur(AD.u2)} to threshold 2 and ${h.eur(AD.u3)} to threshold 3. The calculator applies that increase automatically if you enter nine members or more.</p>`,
  },
});
