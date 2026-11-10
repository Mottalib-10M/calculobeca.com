import { defineGuide } from '../../lib/page-types';
import { eur, dec, PT } from './_f';
import { patrimonio } from '../../lib/engine/beca';

/* Patrimonio: RD 179/2026 art. 11; convocatoria art. 20 (límites, coeficientes, suma de porcentajes, 50 % de otros miembros, 172.000 € de actividades). */
const ej = patrimonio({ urbanas: 120000, anioRevision: 2008, navarra: false, construccionesRusticas: 0, rusticas: 0, capital: 600, miembros: 4, actividades: 0 });
const coefs = (l: 'es' | 'en') => PT.coeficientes.map((c) => [c.desde === c.hasta ? String(c.desde) : `${c.desde}-${c.hasta}`, dec(c.c, l)]);
const pc = (x: number, l: 'es' | 'en') => (l === 'es' ? `${dec(x, l, 1)} %` : `${dec(x, l, 1)}%`);

export default defineGuide({
  id: 'patrimonio', group: 'dinero', order: 3,
  tool: 'patrimonio',
  related: ['renta', 'umbrales', 'denegada', 'home'],
  sources: ['rd179', 'convocatoria', 'catastro'],
  es: {
    slug: 'patrimonio',
    nav: 'Patrimonio familiar', card: 'Pisos, fincas, ahorros y negocios: cuándo el patrimonio hace perder la beca aunque la renta sea baja',
    title: 'Patrimonio beca MEC 2026-2027: límites y coeficientes',
    description: 'Límites de patrimonio de la beca 2026-2027: 47.200 € en inmuebles, coeficientes catastrales por año de revisión, 1.900 € de capital y suma de porcentajes.',
    h1: 'Patrimonio familiar: cuándo deniega la beca',
    intro: 'Para saber si el patrimonio te deja sin beca, escribe el valor catastral de los inmuebles que no son tu vivienda, el año de su última revisión y los rendimientos del ahorro: verás la suma de porcentajes que mira el Ministerio.',
    resume: `La beca general se deniega, sea cual sea la renta, cuando los bienes de la familia (el patrimonio) pasan de los límites del real decreto de umbrales. Los límites son ${eur(PT.urbanas, 'es')} en valor catastral de inmuebles urbanos sin contar la vivienda habitual, otros ${eur(PT.construccionesRusticas, 'es')} en construcciones de fincas rústicas, ${eur(PT.rusticasPorMiembro, 'es')} por cada persona que cuenta en la familia en fincas rústicas y ${eur(PT.capital, 'es')} en rendimientos del capital mobiliario más ganancias patrimoniales. El valor catastral de los urbanos no se toma tal cual: se multiplica por un coeficiente según el año de la última revisión catastral, de ${dec(PT.coeficientes[0].c, 'es')} para las revisiones de 1990 a 2002 a ${dec(PT.coeficientes[PT.coeficientes.length - 1].c, 'es')} para las de 2025. Cuando hay varios elementos, se calcula qué porcentaje de su límite usa cada uno y se suman: si la suma pasa de 100, no hay beca. Además, se deniega si los negocios familiares facturan más de ${eur(PT.actividades, 'es')}. Los bienes de quien no es el padre o la madre, como un abuelo que vive en casa, cuentan solo la mitad.`,
    faqs: [
      { q: '¿La vivienda en la que vive la familia cuenta para el patrimonio?', a: 'No. Los límites de inmuebles urbanos y de construcciones rústicas excluyen expresamente la vivienda habitual, según la convocatoria. Cuentan la segunda residencia, el piso alquilado a terceros, los locales, los garajes sueltos y las plazas o trasteros que no estén vinculados a la vivienda habitual.' },
      { q: '¿Dónde encuentro el año de la última revisión catastral?', a: 'En el recibo del IBI suele figurar el año de efecto del valor catastral, y en la Sede Electrónica del Catastro puedes consultar la referencia de cada inmueble con tu certificado o cl@ve. Si dudas entre dos años, prueba ambos en la calculadora: el coeficiente cambia de un año a otro y puede mover la suma varios puntos.' },
      { q: '¿Una cuenta de ahorro con 20.000 euros me hace perder la beca?', a: `No por el saldo, que no se mira. Lo que cuenta son los rendimientos: intereses, dividendos y ganancias patrimoniales netas de 2025 de todos los miembros, con un límite de ${eur(PT.capital, 'es')}. Un depósito que dio ${eur(400, 'es')} de intereses usa algo más del 21 % de ese límite. Los premios exentos hasta ${eur(PT.premiosExentos, 'es')} y las ayudas al alquiler no cuentan.` },
    ],
    body: (h) => `<h2>Los cuatro límites del patrimonio para la beca</h2>
<p>El ${h.src('rd179', 'real decreto de umbrales')} fija cuatro umbrales de patrimonio, valorados a 31 de diciembre de 2025 y sumando a todas las personas que cuentan en la familia. Cada elemento se convierte en un porcentaje de su límite y los porcentajes se suman. Con un piso heredado de ${h.eur(120000)} de valor catastral revisado en 2008 y ${h.eur(600)} de intereses, la suma queda en ${pc(ej.suma, 'es')}: ${ej.deniega ? 'se pasa del 100 % y la beca se deniega' : 'por debajo del 100 %, el patrimonio no impide la beca'}.</p>
${h.table(['Elemento', 'Límite'], [['Inmuebles urbanos, sin vivienda habitual (tras el coeficiente)', h.eur(PT.urbanas)], ['Construcciones en fincas rústicas (tras el coeficiente)', h.eur(PT.construccionesRusticas)], ['Fincas rústicas, por cada persona que cuenta en la familia', h.eur(PT.rusticasPorMiembro)], ['Capital mobiliario y ganancias patrimoniales', h.eur(PT.capital)], ['Volumen de actividades económicas (aparte de la suma)', h.eur(PT.actividades)]], 'Umbrales de patrimonio familiar, curso 2026-2027', ['l', 'r'])}
<h2>El coeficiente catastral</h2>
<p>El valor catastral de un piso depende de cuándo se revisó en su municipio. Para igualar municipios revisados en años distintos, la convocatoria multiplica ese valor por un coeficiente antes de compararlo con los ${h.eur(PT.urbanas)}. En la Comunidad Foral de Navarra el coeficiente es siempre ${h.n(PT.navarra, 2)}. El año de la revisión lo da la ${h.src('catastro', 'Sede Electrónica del Catastro')}.</p>
${h.table(['Año de la última revisión', 'Coeficiente'], coefs('es'), 'Coeficientes según el año de la última revisión', ['l', 'r'])}
<h2>Los negocios familiares</h2>
<p>Hay un límite aparte que no entra en la suma: si los ingresos de actividades económicas de la familia, en estimación directa u objetiva, o la parte que corresponde a los miembros en sociedades sin personalidad jurídica, pasan de ${h.eur(PT.actividades)}, la beca se deniega aunque el negocio dé pérdidas. Es una cifra de facturación, no de beneficio.</p>`,
  },
  en: {
    slug: 'family-wealth',
    nav: 'Family wealth', card: 'Flats, land, savings and businesses: when wealth costs you the grant even on a low income',
    title: 'Beca MEC wealth limits 2026-2027: property and savings',
    description: 'Wealth limits for Spain\'s 2026-2027 study grant: €47,200 in property, cadastral coefficients by revaluation year, €1,900 of savings income and the 100% rule.',
    h1: 'Beca MEC (Ministry of Education) wealth limits',
    intro: 'Enter the cadastral value of property other than your home, the year it was last revalued and your savings income: you will see the sum of percentages the Ministry checks against the beca MEC wealth limits.',
    resume: `Spain's general study grant is refused, whatever the income, when family wealth exceeds the limits in article 11 of Royal Decree 179/2026, repeated in article 20 of the call. The limits are ${eur(PT.urbanas, 'en')} of cadastral value in urban property excluding the main home, a further ${eur(PT.construccionesRusticas, 'en')} in buildings on rural land, ${eur(PT.rusticasPorMiembro, 'en')} of rural land per counted member and ${eur(PT.capital, 'en')} of investment income plus capital gains. The cadastral value of urban property is not taken as it stands: it is multiplied by a coefficient based on the year of the last cadastral revaluation, from ${dec(PT.coeficientes[0].c, 'en')} for revaluations between 1990 and 2002 to ${dec(PT.coeficientes[PT.coeficientes.length - 1].c, 'en')} for 2025. When the family holds several items, the share of its limit each one uses is worked out and the shares are added: above 100 there is no grant. The grant is also refused if family businesses turn over more than ${eur(PT.actividades, 'en')}. Assets of members who are not main earners count at half value.`,
    faqs: [
      { q: 'Does the family home count towards wealth?', a: 'No. The urban property and rural building limits expressly leave out the main home, under article 20.1 of the call. What counts is a second home, a flat let to tenants, commercial premises, and separate garages, parking spaces or storage rooms not attached to the main home.' },
      { q: 'Where do I find the year of the last cadastral revaluation?', a: 'The local property tax bill usually shows the year the cadastral value took effect, and the Cadastre e-office lets you look up each property with a digital certificate or Cl@ve. If you are torn between two years, try both in the calculator: the coefficient changes from year to year and can move the total by several points.' },
      { q: 'Will a savings account with 20,000 euros cost me the grant?', a: `Not because of the balance, which is not checked. What counts is the return: 2025 interest, dividends and net capital gains of all members, capped at ${eur(PT.capital, 'en')}. A deposit paying ${eur(400, 'en')} in interest uses just over 21% of that limit. Exempt prizes up to ${eur(PT.premiosExentos, 'en')} and rent aid are left out.` },
      { q: 'What if the property belongs to grandparents who live with us?', a: 'If your grandparents are counted members because they are registered at your address, their property counts, but only at half its value: article 20.4 of the call takes off 50% of items held by any member who is not a main earner. The same applies to a flat in a sibling\'s name.' },
    ],
    body: (h) => `<h2>The four beca wealth limits and the sum of percentages</h2>
<p>${h.src('rd179', 'Article 11 of Royal Decree 179/2026')} sets four wealth limits, valued at 31 December 2025 across all counted members. Each item becomes a percentage of its limit and the percentages are added up. With an inherited flat of ${h.eur(120000)} cadastral value revalued in 2008 and ${h.eur(600)} of interest, the total is ${pc(ej.suma, 'en')}: ${ej.deniega ? 'over 100%, so the grant is refused' : 'below 100%, so wealth does not block the grant'}.</p>
${h.table(['Item', 'Limit'], [['Urban property excluding the main home (after the coefficient)', h.eur(PT.urbanas)], ['Buildings on rural land (after the coefficient)', h.eur(PT.construccionesRusticas)], ['Rural land, per counted member', h.eur(PT.rusticasPorMiembro)], ['Investment income and capital gains', h.eur(PT.capital)], ['Business turnover (outside the sum)', h.eur(PT.actividades)]], 'Family wealth limits, 2026-2027', ['l', 'r'])}
<h2>The cadastral coefficient</h2>
<p>A flat's cadastral value depends on when its municipality was last revalued. To even out towns revalued in different years, the call multiplies that value by a coefficient before comparing it with ${h.eur(PT.urbanas)}. In Navarre the coefficient is always ${h.n(PT.navarra, 2)}. The year is shown on the ${h.src('catastro', 'Cadastre e-office')}.</p>
${h.table(['Year of last revaluation', 'Coefficient'], coefs('en'), 'Coefficients in article 20.1.a of the call', ['l', 'r'])}
<h2>Family businesses</h2>
<p>There is a separate limit outside the sum: if the family's business income, under direct or simplified assessment, or members' shares in entities without legal personality, exceed ${h.eur(PT.actividades)}, the grant is refused even if the business makes a loss. It is a turnover figure, not a profit figure.</p>
<h3>If you are refused on wealth grounds</h3>
<p>It is one of the most common reasons for refusal and usually comes from a property the family had forgotten, an undivided inheritance or a wrongly applied coefficient. The notice states the reason; if the data is wrong, it is corrected through a substantiated objection. The steps are on the ${h.a('denegada', 'refused grant')} page, and ${h.a('renta', 'family income')} has its own calculator.</p>
<h3>What is left out, and the reference date</h3>
<p>Everything is valued at 31 December 2025. The investment income limit leaves out grants to buy, renovate or rent the main home, cash prizes up to ${h.eur(PT.premiosExentos)}, the Youth Culture Voucher and aid for the La Palma eruption or the 2024 floods. For rural land the limit grows with the household: with four members it is ${h.eur(PT.rusticasPorMiembro * 4)}, so a plot with a cadastral value of ${h.eur(20000)} uses ${h.n((20000 / (PT.rusticasPorMiembro * 4)) * 100, 1)}% of that limit. Assets held by a sibling or grandparent who is a counted member enter at half their value, as with income.</p>`,
  },
});
