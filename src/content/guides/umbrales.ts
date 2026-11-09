import { defineGuide } from '../../lib/page-types';
import { eur, U, P, day } from './_f';

/* Umbrales de renta: RD 179/2026 art. 8 (tabla, intervalos y financiación del intervalo, art. 8.2);
   convocatoria art. 19 (extremo inferior). Miembros computables: convocatoria art. 17. */
const T = P.umbrales.tabla, AD = P.umbrales.adicional, u4 = U(4), u3 = U(3), u5 = U(5);
const tabla = (l: 'es' | 'en') => T.map((t) => [String(t.m), eur(t.u1, l), eur(t.u2, l), eur(t.u3, l)]).concat([[l === 'es' ? 'Cada miembro más' : 'Each extra member', `+${eur(AD.u1, l)}`, `+${eur(AD.u2, l)}`, `+${eur(AD.u3, l)}`]]);

export default defineGuide({
  id: 'umbrales', group: 'dinero', order: 1,
  tool: 'umbrales',
  related: ['renta', 'patrimonio', 'cuantias', 'home'],
  sources: ['rd179', 'convocatoria', 'extracto'],
  es: {
    slug: 'umbrales-de-renta',
    nav: 'Umbrales de renta 2026-2027', card: 'Los tres límites de renta familiar según el número de miembros, y en cuál caes tú',
    title: 'Umbrales becas MEC 2026-2027: tabla por miembros y cálculo',
    description: 'Umbrales de renta de la beca general 2026-2027 según el Real Decreto 179/2026: tabla de 1 a 8 miembros y más, y calculadora para saber en qué umbral caes.',
    h1: 'Umbrales de renta de la beca general 2026-2027',
    intro: 'Indica cuántos miembros computables tiene tu familia y su renta de 2025: la calculadora compara esa renta con los umbrales de la beca, te dice cuál alcanzas y cuánto margen te queda hasta el siguiente.',
    resume: `La beca general del Estado para el curso 2026-2027 usa tres umbrales de renta familiar, fijados por el artículo 8 del Real Decreto 179/2026, de 11 de marzo, publicado en el BOE el ${day(P.rd.boe, 'es')}. Para una familia de cuatro miembros son ${eur(u4.u1, 'es')}, ${eur(u4.u2, 'es')} y ${eur(u4.u3, 'es')} de renta familiar del año 2025. Quien no pasa del umbral 1 puede cobrar la cuantía fija ligada a la renta, de ${eur(P.cuantias.renta, 'es')}, junto a las demás piezas; hasta el umbral 2 se mantienen la cuantía de residencia y la cuantía variable; hasta el umbral 3 solo quedan la beca de matrícula, la beca básica y la cuantía por excelencia. Por encima del umbral 3 no hay ningún componente. La renta que se compara no es tu sueldo ni la casilla final de la declaración: es la renta familiar a efectos de beca, con sus deducciones. Igualar el umbral cuenta como no superarlo. La tabla completa está debajo y la calculadora lo comprueba para tu caso.`,
    faqs: [
      { q: '¿Qué año de renta cuenta para la beca del curso 2026-2027?', a: 'Cuenta el ejercicio 2025, es decir, la declaración de la renta que se presentó entre abril y junio de 2026. Lo dicen el artículo 9 del Real Decreto 179/2026 y el artículo 16 de la convocatoria. Si tus ingresos bajaron en 2026 por un despido, no se tienen en cuenta en esta convocatoria, salvo los casos de fallecimiento o jubilación forzosa del sustentador principal.' },
      { q: '¿Qué cifra de los umbrales 1 y 3 se aplica a mi familia?', a: `La de la tabla de esta página, que es la más baja: la que aplica siempre la convocatoria del Ministerio, y la que usa la calculadora. El Real Decreto da los umbrales 1 y 3 como un intervalo: para cuatro miembros, de ${eur(u4.u1, 'es')} a ${eur(u4.u1max, 'es')} y de ${eur(u4.u3, 'es')} a ${eur(u4.u3max, 'es')}. Solo una comunidad con competencias plenas en becas puede conceder dentro del intervalo, pagando ella la mitad.` },
      { q: '¿Quién cuenta como miembro computable de la familia?', a: 'Los padres o tutores, tú, tus hermanos solteros menores de 25 años que vivan en casa, los mayores de 25 con discapacidad y los abuelos empadronados en el mismo domicilio, todo ello a 31 de diciembre de 2025. Si tus padres están separados, no cuenta el que no vive contigo, pero sí su nueva pareja si convive en casa. Lo regula el artículo 17 de la convocatoria.' },
      { q: '¿Por qué los umbrales de 2026-2027 son más altos que los del curso anterior?', a: 'Porque cada año el Gobierno los fija en un real decreto nuevo y los ajusta. Esta página solo usa los del Real Decreto 179/2026, para el curso 2026-2027. No comparamos con años anteriores ni anunciamos los del curso 2027-2028: aún no existen. Saldrán en otro real decreto, normalmente en marzo, y entonces se actualizará la tabla.' },
    ],
    body: (h) => `<h2>La tabla de umbrales de la beca 2026-2027</h2>
<p>Estos son los límites que aplica la convocatoria del Ministerio de Educación, Formación Profesional y Deportes en su artículo 19, tomados del ${h.src('rd179', 'artículo 8 del Real Decreto 179/2026')}. Todas las cifras son euros de renta familiar del año 2025.</p>
${h.table(['Miembros', 'Umbral 1', 'Umbral 2', 'Umbral 3'], tabla('es'), 'Umbrales de renta familiar, curso 2026-2027', ['l', 'r', 'r', 'r'])}
<h2>Qué abre cada umbral</h2>
<p>Los umbrales no deciden solo si hay beca, sino qué piezas la forman. El umbral 1 es el único que da la cuantía fija ligada a la renta, de ${h.eur(P.cuantias.renta)}. Hasta el umbral 2 se puede cobrar la cuantía de residencia, de ${h.eur(P.cuantias.residencia)}, si estudias lejos de casa, y entrar en el reparto de la cuantía variable. Hasta el umbral 3 quedan la beca de matrícula para universitarios, la beca básica de ${h.eur(P.cuantias.basica)} en estudios no universitarios y la cuantía por excelencia académica. El detalle por estudios está en la página de ${h.a('cuantias', 'cuantías de la beca')}.</p>
<p>Un ejemplo con tres miembros: una renta familiar de ${h.eur(u3.u1)} queda en el umbral 1; con un euro más ya está en el umbral 2 y pierde la cuantía de renta. Por eso conviene calcular bien la renta a efectos de beca antes de dar nada por perdido.</p>
${h.mini('umbrales', { p: ['miembros', 'renta'], d: { miembros: 5, renta: u5.u2 - 500 }, t: 'Otro caso: familia de cinco, 500 € por debajo del umbral 2' })}
<h2>La renta que se compara</h2>
<p>La cifra que se pone frente a la tabla es la renta familiar a efectos de beca, no la suma de nóminas. Se parte de la base imponible general y del ahorro de cada miembro, se resta la cuota de la declaración y después se aplican las deducciones: la mitad de los ingresos de los hermanos o abuelos, la familia numerosa, la discapacidad, los hermanos universitarios fuera de casa, la orfandad o la familia monoparental. Muchas familias que creen pasarse del umbral 2 quedan por debajo tras las deducciones. La ${h.a('renta', 'calculadora de renta familiar')} hace las cuentas.</p>
<p>Además de la renta hay un segundo filtro: el ${h.a('patrimonio', 'patrimonio familiar')}. Aunque la renta quede en el umbral 1, la beca se deniega si los inmuebles, el capital o los negocios de la familia superan los límites del artículo 11 del Real Decreto.</p>
<h2>Familias de más de ocho miembros</h2>
<p>A partir del octavo miembro, cada persona adicional suma ${h.eur(AD.u1)} al umbral 1, ${h.eur(AD.u2)} al umbral 2 y ${h.eur(AD.u3)} al umbral 3. La calculadora aplica ese incremento automáticamente si escribes nueve miembros o más.</p>`,
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
${h.mini('umbrales', { p: ['miembros', 'renta'], d: { miembros: 5, renta: u5.u2 - 500 }, t: 'Another case: a household of five, €500 under threshold 2' })}
<h2>The income that is compared</h2>
<p>The figure set against the table is family income for grant purposes, not total pay. It starts from each member's general and savings tax base, takes off the tax due on the return and then applies the deductions: half of the income of siblings or grandparents, large family status, disability, siblings at university away from home, orphanhood or single-parent family. Many households who think they are above threshold 2 drop below it after the deductions. The ${h.a('renta', 'family income calculator')} does the sums.</p>
<p>There is a second filter besides income: ${h.a('patrimonio', 'family wealth')}. Even with income inside threshold 1, the grant is refused if the family's property, savings income or business turnover exceed the limits in article 11 of the Royal Decree.</p>
<h2>Households of more than eight</h2>
<p>From the eighth member on, each additional person adds ${h.eur(AD.u1)} to threshold 1, ${h.eur(AD.u2)} to threshold 2 and ${h.eur(AD.u3)} to threshold 3. The calculator applies that increase automatically if you enter nine members or more.</p>`,
  },
});
