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
    nav: 'Cuantías de la beca', card: 'Las piezas de la beca, cuánto da cada una y hasta qué umbral llega, según los estudios',
    title: 'Cuantías beca MEC 2026-2027: 1700, 2700, 300 € y excelencia',
    description: 'Cuantías de la beca general 2026-2027: 1700 € por renta, 2700 € por residencia, beca básica de 300 €, excelencia de 50 a 125 € y variable con mínimo de 60 €.',
    h1: 'Cuantías de la beca general 2026-2027',
    intro: 'Elige los estudios y el umbral (tramo de renta) de la familia: la calculadora muestra qué cuantías de la beca le tocan y las compara con los otros dos umbrales.',
    resume: `La beca general no es una sola cantidad: es una suma de piezas, y cada una tiene su límite de renta. La matrícula gratis cubre las asignaturas nuevas en la universidad hasta el umbral 3. La ayuda por renta baja (cuantía de renta) da ${eur(C.renta, 'es')}, solo en el umbral 1. La ayuda por vivir fuera de casa (residencia) da ${eur(C.residencia, 'es')} hasta el umbral 2, si se justifica un alquiler. La beca básica da ${eur(C.basica, 'es')} en bachillerato y FP (formación profesional) hasta el umbral 3, y no se suma a la ayuda por renta baja. El premio por buena nota (excelencia) va de ${eur(C.excelencia[0].importe, 'es')} a ${eur(C.excelencia[C.excelencia.length - 1].importe, 'es')}, desde un ${dec(C.excelencia[0].desde, 'es', 0)} de media. Y el extra de final de curso (cuantía variable) se reparte al final, con un mínimo de ${eur(C.variableMin, 'es')}. Las piezas fijas se calculan al euro; el extra no se puede saber de antemano.`,
    faqs: [
      { q: '¿Cuál es la cuantía máxima de la beca general en 2026-2027?', a: `No hay un máximo único, porque el extra de final de curso depende del reparto. Las piezas fijas llegan a ${eur(C.renta + C.residencia + C.excelencia[C.excelencia.length - 1].importe, 'es')} para un universitario del umbral 1 que vive fuera de casa y tiene un 9,5 de media. A eso se suman la matrícula gratis y el extra de final de curso. Con una discapacidad del 65 %, las piezas fijas suben un 50 %.` },
      { q: '¿Se puede cobrar la beca básica y la ayuda por renta baja a la vez?', a: 'No: la convocatoria no deja juntarlas. En la práctica, un estudiante de bachillerato o FP del umbral 1 cobra la ayuda por renta baja, que es mayor, y uno de los umbrales 2 o 3 cobra la beca básica. Los universitarios no tienen beca básica: tienen la matrícula gratis.' },
      { q: '¿Cuánto se suma por vivir en Canarias, Baleares, Ceuta o Melilla?', a: `Entre ${eur(C.insular.mayor, 'es')} y ${eur(C.insular.menorPeninsula, 'es')}, si hace falta barco o avión para llegar al centro de estudios y la renta no pasa del umbral 2. Son ${eur(C.insular.mayor, 'es')} en las islas mayores, Ceuta y Melilla, y ${eur(C.insular.menor, 'es')} en las islas menores. Si se estudia en la Península, ${eur(C.insular.mayorPeninsula, 'es')} o ${eur(C.insular.menorPeninsula, 'es')}. Los canarios de FP suman ${eur(C.insular.canariasFp, 'es')} más.` },
    ],
    body: (h) => `<h2>Las cuantías de la beca y su umbral</h2>
${h.table(['Pieza', 'Importe', 'Hasta', 'Para'], [
  ['Matrícula gratis (beca de matrícula)', 'Lo que cuestan las asignaturas nuevas', 'Umbral 3', 'Grado, máster, enseñanzas artísticas superiores'],
  ['Ayuda por renta baja (cuantía de renta)', h.eur(C.renta), 'Umbral 1', 'Presencial y curso entero'],
  ['Ayuda por vivir fuera de casa (residencia)', h.eur(C.residencia), 'Umbral 2', 'Presencial, curso entero, viviendo fuera de casa'],
  ['Beca básica (estudios no universitarios)', `${h.eur(C.basica)} (${h.eur(C.basicaGradoBasico)} en grado básico)`, 'Umbral 3', 'Bachillerato, FP y otros estudios no universitarios'],
  ['Premio por buena nota (excelencia)', `${h.eur(C.excelencia[0].importe)} a ${h.eur(C.excelencia[C.excelencia.length - 1].importe)}`, 'Umbral 3', 'Curso entero y media de 8 o más'],
  ['Extra de final de curso (cuantía variable)', `${h.eur(C.variableMin)} como mínimo`, 'Umbral 2', 'Un reparto al final del curso'],
], 'Piezas de la beca 2026-2027 y hasta qué umbral llegan', ['l', 'r', 'l', 'l'])}
<p>Con el ejemplo de todo el sitio, 4 personas y ${h.eur(30000)} de renta, la familia está en el umbral 2.</p>
<p>Si el estudiante vive en casa, tiene la matrícula gratis y el extra de final de curso: al menos ${h.eur(C.variableMin)}.</p>
<p>Si vive fuera y justifica el alquiler, se suman ${h.eur(C.residencia)}: lo calcula la página de ${h.a('residencia', 'beca de residencia')}.</p>
<h2>El premio por buena nota</h2>
<p>Se da con el curso entero matriculado, hasta el umbral 3, desde un ${h.n(C.excelencia[0].desde, 0)} de nota. En primero cuenta la nota de acceso; después, la media del curso anterior. La ${h.a('nota', 'calculadora de nota media')} lo hace por ti.</p>
${h.table(['Nota media', 'Premio'], exc('es'), 'Premio por buena nota, curso 2026-2027', ['l', 'r'])}
<h2>Casos que cambian la cuantía</h2>
<p>Con una discapacidad del 65 % o más, las piezas fijas suben un 50 % en la universidad; la matrícula, no.</p>
<p>Vivir en una isla, en Ceuta o en Melilla añade un suplemento, hasta el umbral 2.</p>
<p>Con menos asignaturas (matrícula parcial) o en el año extra de la carrera, algunas piezas bajan a la mitad. El reparto del extra se explica en ${h.a('variable', 'extra de final de curso')}.</p>`,
  },

  en: {
    slug: 'amounts',
    nav: 'Grant amounts', card: 'The parts of the grant, how much each is worth and the threshold each requires, by studies',
    title: 'Beca MEC amounts 2026-2027: €1,700, €2,700, €300 and more',
    description: 'Spain\'s 2026-2027 general study grant amounts: €1,700 income-linked, €2,700 residence, €300 basic grant, €50 to €125 excellence and a variable from €60.',
    h1: 'Beca MEC (Ministry of Education) amounts 2026-2027',
    intro: 'Pick your studies and a threshold: the calculator shows which beca MEC amounts apply and compares them with the other two thresholds.',
    resume: `Spain's general study grant is not a single sum but a set of components fixed by articles 3 and 4 of Royal Decree 179/2026. The fixed income-linked amount is ${eur(C.renta, 'en')} and only reaches threshold 1. The residence amount, for students who live away from home and prove it with a lease or a hall of residence, is ${eur(C.residencia, 'en')} up to threshold 2. The basic grant of ${eur(C.basica, 'en')} (${eur(C.basicaGradoBasico, 'en')} in basic VET) is for studies below university level up to threshold 3 and cannot be combined with the income-linked amount. The excellence amount runs from ${eur(C.excelencia[0].importe, 'en')} to ${eur(C.excelencia[C.excelencia.length - 1].importe, 'en')} for an average grade of ${dec(C.excelencia[0].desde, 'en')} or more. University students also get a tuition waiver up to threshold 3. Finally, the variable amount, with a minimum of ${eur(C.variableMin, 'en')}, is shared out by formula at the end of the year. Every fixed amount is exact; the variable part cannot be forecast to the euro.`,
    faqs: [
      { q: 'What is the most the general grant can pay in 2026-2027?', a: `There is no single ceiling, because the variable part depends on the share-out. Fixed amounts can reach ${eur(C.renta + C.residencia + C.excelencia[C.excelencia.length - 1].importe, 'en')} for a threshold-1 university student living away with a 9.5 average, plus free tuition, the variable amount and, on an island, the island supplement. With a 65% disability the fixed amounts rise by 50%.` },
      { q: 'Can I get the basic grant and the income-linked amount together?', a: 'No. Article 9.3 of the call makes the basic grant incompatible with the income-linked amount. In practice, a threshold-1 student in upper secondary or vocational training gets the income-linked amount, and one in threshold 2 or 3 gets the basic grant. University students have no basic grant: they have the tuition waiver instead.' },
      { q: 'How much does a part-time student receive?', a: `It depends on the credits. With 48 to 59 credits: tuition, the minimum variable amount of ${eur(C.variableMin, 'en')} and, if the threshold is met, ${eur(C.parcialRenta, 'en')} income-linked and up to ${eur(C.parcialResidencia, 'en')} for residence (article 23.2.a). With 30 to 47 credits, only tuition and the minimum variable amount. Below 30 credits there is no grant.` },
      { q: 'How much is added for living in the Canaries, Balearics, Ceuta or Melilla?', a: `Between ${eur(C.insular.mayor, 'en')} and ${eur(C.insular.menorPeninsula, 'en')}, if you need a boat or plane to reach your college and income is within threshold 2. It is ${eur(C.insular.mayor, 'en')} on the main islands, Ceuta and Melilla, ${eur(C.insular.menor, 'en')} on the smaller islands, and ${eur(C.insular.mayorPeninsula, 'en')} or ${eur(C.insular.menorPeninsula, 'en')} if you study on the mainland. Canary Islands VET students add ${eur(C.insular.canariasFp, 'en')}.` },
    ],
    body: (h) => `<h2>The beca MEC amounts and their threshold</h2>
${h.table(['Component', 'Amount', 'Up to', 'For'], [
  ['Tuition waiver', 'Fee for first-time credits', 'Threshold 3', 'Degree, master\'s, higher arts education'],
  ['Income-linked amount', h.eur(C.renta), 'Threshold 1', 'In person, full enrolment'],
  ['Residence amount', h.eur(C.residencia), 'Threshold 2', 'In person, full, living away'],
  ['Basic grant', `${h.eur(C.basica)} (${h.eur(C.basicaGradoBasico)} basic VET)`, 'Threshold 3', 'Below university level'],
  ['Academic excellence', `${h.eur(C.excelencia[0].importe)} to ${h.eur(C.excelencia[C.excelencia.length - 1].importe)}`, 'Threshold 3', 'Full enrolment, average of 8 or more'],
  ['Variable amount', `${h.eur(C.variableMin)} minimum`, 'Threshold 2', 'By formula'],
], 'Royal Decree 179/2026, articles 3 and 4; call, article 11', ['l', 'r', 'l', 'l'])}
<p>What decides is the mix of your studies, your threshold and how you enrol. A threshold-1 degree student living away from home with a 7 average gets ${h.eur(C.renta + C.residencia)} in fixed amounts (${h.eur(C.renta + C.residencia + C.variableMin)} with the variable minimum: what the calculator above gives at threshold 1 if you say you will live away from home), free tuition and the rest of the variable share. If the family moves to threshold 2, the ${h.eur(C.renta)} income-linked amount goes but the residence amount stays. At threshold 3 only tuition remains, plus excellence with an 8.</p>
<h2>Academic excellence</h2>
<p>The excellence component requires full enrolment and is granted up to threshold 3. The grade that counts depends on the year: in the first year of a degree, the university entry grade; in later years, the previous year's average. From the second year of a degree and in the first year of a master's, the grade is multiplied by ${h.n(C.coefExcelencia.ingenieria, 2)} in engineering and architecture, ${h.n(C.coefExcelencia.ciencias, 2)} in sciences and ${h.n(C.coefExcelencia.salud, 2)} in health sciences. The ${h.a('nota', 'grade average calculator')} applies it.</p>
${h.table(['Average grade', 'Amount'], exc('en'), 'Excellence, article 11.1.d of the call', ['l', 'r'])}
<h2>Disability and island supplements</h2>
<p>University and higher arts students with a recognised disability of 65% or more get a 50% rise on every fixed amount except tuition; with a disability of 25 to 64%, 25%, under the ${h.src('rd179', 'first additional provision of Royal Decree 179/2026')}. The island supplement in article 12 of the ${h.src('convocatoria', 'call')} is added for all studies up to threshold 2.</p>
<p>The formula-based part is explained under ${h.a('variable', 'the variable amount')}, and the residence component, with its conditions, under ${h.a('residencia', 'the residence grant')}.</p>
<h3>When the grant is halved</h3>
<p>Two situations cut the amounts. In the extra final year the call allows, such as the fifth year of a four-year degree, you get tuition, the minimum variable amount and half of the other components (article 25.3). And if the university caps credits and you take them in a single semester, the grant is 50%, except tuition and the minimum variable amount, and is topped up if you also enrol for the second semester (article 23.2.b). Neither case changes the thresholds: they only scale the amounts once you qualify.</p>`,
  },
});
