import { defineGuide } from '../../lib/page-types';
import { eur, dec, C } from './_f';

/* Cuantías: RD 179/2026 arts. 3, 4, 6 y DA 1.ª; convocatoria arts. 4-13. */
const exc = (l: 'es' | 'en') => C.excelencia.map((t, i, a) => [i < a.length - 1 ? `${dec(t.desde, l)} – ${dec(a[i + 1].desde - 0.01, l)}`.replace(' – ', l === 'es' ? ' a ' : ' to ') : (l === 'es' ? `${dec(t.desde, l)} o más` : `${dec(t.desde, l)} or more`), eur(t.importe, l)]);

export default defineGuide({
  id: 'cuantias', group: 'dinero', order: 4,
  tool: 'cuantias',
  related: ['variable', 'residencia', 'matricula', 'umbrales'],
  sources: ['rd179', 'convocatoria'],
  es: {
    slug: 'cuantias',
    nav: 'Cuantías de la beca', card: 'Las piezas de la beca, su importe y el umbral que exige cada una, por tipo de estudios',
    title: 'Cuantías beca MEC 2026-2027: 1700, 2700, 300 € y excelencia',
    description: 'Cuantías de la beca general 2026-2027: 1700 € por renta, 2700 € por residencia, beca básica de 300 €, excelencia de 50 a 125 € y variable con mínimo de 60 €.',
    h1: 'Cuantías de la beca general 2026-2027',
    intro: 'Elige tus estudios y un umbral: la calculadora muestra qué piezas de beca corresponden y las compara con los otros dos umbrales.',
    resume: `La beca general no es una cantidad única, sino una suma de piezas que fija el Real Decreto 179/2026 en sus artículos 3 y 4. La cuantía fija ligada a la renta es de ${eur(C.renta, 'es')} y solo llega hasta el umbral 1. La ligada a la residencia, para quien estudia lejos de casa y lo acredita con un alquiler o una residencia, es de ${eur(C.residencia, 'es')} hasta el umbral 2. La beca básica, de ${eur(C.basica, 'es')} (${eur(C.basicaGradoBasico, 'es')} en grado básico), es para estudios no universitarios hasta el umbral 3 y no se suma a la de renta. La cuantía por excelencia va de ${eur(C.excelencia[0].importe, 'es')} a ${eur(C.excelencia[C.excelencia.length - 1].importe, 'es')} con nota media de ${dec(C.excelencia[0].desde, 'es')} o más. Los universitarios tienen además la beca de matrícula hasta el umbral 3. Por último, la cuantía variable, con un mínimo de ${eur(C.variableMin, 'es')}, se reparte con una fórmula al final del curso. Todo lo fijo es exacto; lo variable no se puede prever al euro.`,
    faqs: [
      { q: '¿Cuál es la cuantía máxima de la beca general en 2026-2027?', a: `No hay un máximo único, porque la parte variable depende del reparto. Las cuantías fijas pueden llegar a ${eur(C.renta + C.residencia + C.excelencia[C.excelencia.length - 1].importe, 'es')} para un universitario del umbral 1 que vive fuera y tiene un 9,5 de media, más la matrícula gratis, la cuantía variable y, si vive en una isla, el suplemento insular. Con una discapacidad del 65 % las fijas suben un 50 %.` },
      { q: '¿Se puede cobrar la beca básica y la cuantía ligada a la renta a la vez?', a: 'No. El artículo 9.3 de la convocatoria declara la beca básica incompatible con la cuantía ligada a la renta. En la práctica, un estudiante de bachillerato o FP del umbral 1 cobra la cuantía de renta, y uno de los umbrales 2 o 3 cobra la básica. Los universitarios no tienen beca básica: tienen la beca de matrícula.' },
      { q: '¿Cuánto cobra un estudiante con matrícula parcial?', a: `Depende de los créditos. Con 48 a 59 créditos, la beca de matrícula, la cuantía variable mínima de ${eur(C.variableMin, 'es')} y, si cumple el umbral, ${eur(C.parcialRenta, 'es')} por renta y hasta ${eur(C.parcialResidencia, 'es')} por residencia (artículo 23.2.a). Con 30 a 47 créditos, solo la matrícula y la variable mínima. Por debajo de 30 créditos no hay beca.` },
      { q: '¿Cuánto se suma por vivir en Canarias, Baleares, Ceuta o Melilla?', a: `Entre ${eur(C.insular.mayor, 'es')} y ${eur(C.insular.menorPeninsula, 'es')}, si necesitas barco o avión para llegar al centro y tu renta no pasa del umbral 2. Son ${eur(C.insular.mayor, 'es')} en las islas mayores, Ceuta y Melilla, ${eur(C.insular.menor, 'es')} en las islas menores y ${eur(C.insular.mayorPeninsula, 'es')} o ${eur(C.insular.menorPeninsula, 'es')} si estudias en la Península. Los canarios de FP suman ${eur(C.insular.canariasFp, 'es')} más.` },
    ],
    body: (h) => `<h2>Las piezas y su umbral</h2>
${h.table(['Pieza', 'Importe', 'Hasta', 'Para'], [
  ['Beca de matrícula', 'Precio de los créditos de 1.ª matrícula', 'Umbral 3', 'Grado, máster, enseñanzas artísticas superiores'],
  ['Cuantía ligada a la renta', h.eur(C.renta), 'Umbral 1', 'Presencial y matrícula completa'],
  ['Cuantía ligada a la residencia', h.eur(C.residencia), 'Umbral 2', 'Presencial, completa, viviendo fuera'],
  ['Beca básica', `${h.eur(C.basica)} (${h.eur(C.basicaGradoBasico)} grado básico)`, 'Umbral 3', 'Estudios no universitarios'],
  ['Excelencia académica', `${h.eur(C.excelencia[0].importe)} a ${h.eur(C.excelencia[C.excelencia.length - 1].importe)}`, 'Umbral 3', 'Matrícula completa, media de 8 o más'],
  ['Cuantía variable', `${h.eur(C.variableMin)} como mínimo`, 'Umbral 2', 'Según fórmula'],
], 'Real Decreto 179/2026, artículos 3 y 4; convocatoria, artículo 11', ['l', 'r', 'l', 'l'])}
<p>Lo que manda es la combinación de tus estudios, tu umbral y tu forma de matrícula. Un estudiante de grado del umbral 1 que vive fuera de casa y tiene una media de 7 suma ${h.eur(C.renta + C.residencia)} de cuantías fijas, la matrícula gratis y la parte variable. Si su familia pasa al umbral 2, pierde los ${h.eur(C.renta)} de la renta pero conserva la residencia. En el umbral 3 solo le queda la matrícula y, si saca un 8, la excelencia.</p>
${h.mini('umbrales', { p: ['miembros', 'renta'], t: '¿No sabes tu umbral? Calcúlalo con dos datos' })}
<h2>La excelencia académica</h2>
<p>La pieza de excelencia exige matrícula completa y se concede hasta el umbral 3. La nota que cuenta depende del curso: en primero de grado, la nota de acceso; en los demás cursos, la media del anterior. A partir de segundo de grado y en primero de máster, la nota se multiplica por ${h.n(C.coefExcelencia.ingenieria, 2)} en ingeniería y arquitectura, ${h.n(C.coefExcelencia.ciencias, 2)} en ciencias y ${h.n(C.coefExcelencia.salud, 2)} en ciencias de la salud. La ${h.a('nota', 'calculadora de nota media')} lo aplica.</p>
${h.table(['Nota media', 'Cuantía'], exc('es'), 'Excelencia, artículo 11.1.d de la convocatoria', ['l', 'r'])}
<h2>Discapacidad e insularidad</h2>
<p>Los universitarios y alumnos de enseñanzas artísticas superiores con una discapacidad reconocida del 65 % o más ven subir un 50 % todas sus cuantías fijas, salvo la matrícula; con una discapacidad del 25 al 64 %, un 25 %, según la ${h.src('rd179', 'disposición adicional primera del Real Decreto 179/2026')}. El suplemento insular del artículo 12 de la ${h.src('convocatoria', 'convocatoria')} se suma a todos los estudios hasta el umbral 2.</p>
<p>Las piezas que dependen de una fórmula se explican en ${h.a('variable', 'la cuantía variable')}, y la de residencia, con sus condiciones, en ${h.a('residencia', 'la beca de residencia')}.</p>
<h2>Cuando la beca se reduce a la mitad</h2>
<p>Dos situaciones recortan las cuantías. En el último año adicional que permite la convocatoria, por ejemplo el quinto año de un grado de cuatro, se cobran la matrícula, la variable mínima y la mitad de las demás piezas (artículo 25.3). Y si la universidad limita los créditos y los cursas en un solo cuatrimestre, la beca es del 50 %, salvo la matrícula y la variable mínima, y se completa si te matriculas también del segundo (artículo 23.2.b).</p>`,
  },
  en: {
    slug: 'amounts',
    nav: 'Grant amounts', card: 'The parts of the grant, how much each is worth and the threshold each requires, by studies',
    title: 'Beca MEC amounts 2026-2027: €1,700, €2,700, €300 and more',
    description: 'Spain\'s 2026-2027 general study grant amounts: €1,700 income-linked, €2,700 residence, €300 basic grant, €50 to €125 excellence and a variable from €60.',
    h1: 'Amounts of Spain\'s general study grant 2026-2027',
    intro: 'Pick your studies and a threshold: the calculator shows which grant components apply and compares them with the other two thresholds.',
    resume: `Spain's general study grant is not a single sum but a set of components fixed by articles 3 and 4 of Royal Decree 179/2026. The fixed income-linked amount is ${eur(C.renta, 'en')} and only reaches threshold 1. The residence amount, for students who live away from home and prove it with a lease or a hall of residence, is ${eur(C.residencia, 'en')} up to threshold 2. The basic grant of ${eur(C.basica, 'en')} (${eur(C.basicaGradoBasico, 'en')} in basic VET) is for studies below university level up to threshold 3 and cannot be combined with the income-linked amount. The excellence amount runs from ${eur(C.excelencia[0].importe, 'en')} to ${eur(C.excelencia[C.excelencia.length - 1].importe, 'en')} for an average grade of ${dec(C.excelencia[0].desde, 'en')} or more. University students also get a tuition waiver up to threshold 3. Finally, the variable amount, with a minimum of ${eur(C.variableMin, 'en')}, is shared out by formula at the end of the year. Every fixed amount is exact; the variable part cannot be forecast to the euro.`,
    faqs: [
      { q: 'What is the most the general grant can pay in 2026-2027?', a: `There is no single ceiling, because the variable part depends on the share-out. Fixed amounts can reach ${eur(C.renta + C.residencia + C.excelencia[C.excelencia.length - 1].importe, 'en')} for a threshold-1 university student living away with a 9.5 average, plus free tuition, the variable amount and, on an island, the island supplement. With a 65% disability the fixed amounts rise by 50%.` },
      { q: 'Can I get the basic grant and the income-linked amount together?', a: 'No. Article 9.3 of the call makes the basic grant incompatible with the income-linked amount. In practice, a threshold-1 student in upper secondary or vocational training gets the income-linked amount, and one in threshold 2 or 3 gets the basic grant. University students have no basic grant: they have the tuition waiver instead.' },
      { q: 'How much does a part-time student receive?', a: `It depends on the credits. With 48 to 59 credits: tuition, the minimum variable amount of ${eur(C.variableMin, 'en')} and, if the threshold is met, ${eur(C.parcialRenta, 'en')} income-linked and up to ${eur(C.parcialResidencia, 'en')} for residence (article 23.2.a). With 30 to 47 credits, only tuition and the minimum variable amount. Below 30 credits there is no grant.` },
      { q: 'How much is added for living in the Canaries, Balearics, Ceuta or Melilla?', a: `Between ${eur(C.insular.mayor, 'en')} and ${eur(C.insular.menorPeninsula, 'en')}, if you need a boat or plane to reach your college and income is within threshold 2. It is ${eur(C.insular.mayor, 'en')} on the main islands, Ceuta and Melilla, ${eur(C.insular.menor, 'en')} on the smaller islands, and ${eur(C.insular.mayorPeninsula, 'en')} or ${eur(C.insular.menorPeninsula, 'en')} if you study on the mainland. Canary Islands VET students add ${eur(C.insular.canariasFp, 'en')}.` },
    ],
    body: (h) => `<h2>The components and their threshold</h2>
${h.table(['Component', 'Amount', 'Up to', 'For'], [
  ['Tuition waiver', 'Fee for first-time credits', 'Threshold 3', 'Degree, master\'s, higher arts education'],
  ['Income-linked amount', h.eur(C.renta), 'Threshold 1', 'In person, full enrolment'],
  ['Residence amount', h.eur(C.residencia), 'Threshold 2', 'In person, full, living away'],
  ['Basic grant', `${h.eur(C.basica)} (${h.eur(C.basicaGradoBasico)} basic VET)`, 'Threshold 3', 'Below university level'],
  ['Academic excellence', `${h.eur(C.excelencia[0].importe)} to ${h.eur(C.excelencia[C.excelencia.length - 1].importe)}`, 'Threshold 3', 'Full enrolment, average of 8 or more'],
  ['Variable amount', `${h.eur(C.variableMin)} minimum`, 'Threshold 2', 'By formula'],
], 'Royal Decree 179/2026, articles 3 and 4; call, article 11', ['l', 'r', 'l', 'l'])}
<p>What decides is the mix of your studies, your threshold and how you enrol. A threshold-1 degree student living away from home with a 7 average gets ${h.eur(C.renta + C.residencia)} in fixed amounts, free tuition and the variable share. If the family moves to threshold 2, the ${h.eur(C.renta)} income-linked amount goes but the residence amount stays. At threshold 3 only tuition remains, plus excellence with an 8.</p>
${h.mini('umbrales', { p: ['miembros', 'renta'], t: 'Not sure of your threshold? Two figures are enough' })}
<h2>Academic excellence</h2>
<p>The excellence component requires full enrolment and is granted up to threshold 3. The grade that counts depends on the year: in the first year of a degree, the university entry grade; in later years, the previous year's average. From the second year of a degree and in the first year of a master's, the grade is multiplied by ${h.n(C.coefExcelencia.ingenieria, 2)} in engineering and architecture, ${h.n(C.coefExcelencia.ciencias, 2)} in sciences and ${h.n(C.coefExcelencia.salud, 2)} in health sciences. The ${h.a('nota', 'grade average calculator')} applies it.</p>
${h.table(['Average grade', 'Amount'], exc('en'), 'Excellence, article 11.1.d of the call', ['l', 'r'])}
<h2>Disability and island supplements</h2>
<p>University and higher arts students with a recognised disability of 65% or more get a 50% rise on every fixed amount except tuition; with a disability of 25 to 64%, 25%, under the ${h.src('rd179', 'first additional provision of Royal Decree 179/2026')}. The island supplement in article 12 of the ${h.src('convocatoria', 'call')} is added for all studies up to threshold 2.</p>
<p>The formula-based part is explained under ${h.a('variable', 'the variable amount')}, and the residence component, with its conditions, under ${h.a('residencia', 'the residence grant')}.</p>
<h2>When the grant is halved</h2>
<p>Two situations cut the amounts. In the extra final year the call allows, such as the fifth year of a four-year degree, you get tuition, the minimum variable amount and half of the other components (article 25.3). And if the university caps credits and you take them in a single semester, the grant is 50%, except tuition and the minimum variable amount, and is topped up if you also enrol for the second semester (article 23.2.b). Neither case changes the thresholds: they only scale the amounts once you qualify.</p>`,
  },
});
