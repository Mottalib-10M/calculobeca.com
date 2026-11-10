import { defineGuide } from '../../lib/page-types';
import { eur, U, C, D } from './_f';

/* Cuantía ligada a la residencia: RD 179/2026 arts. 3.2 y 4.2; convocatoria art. 7 (requisitos, pago con justificante, umbral 2),
   art. 17.3 (independientes), art. 23.2.a (350 € con 48-59 créditos), art. 13 (discapacidad), art. 18.2.d (deducción 1.176 €). */
const u4 = U(4);

export default defineGuide({
  id: 'residencia', group: 'dinero', order: 8,
  tool: 'residencia',
  related: ['cuantias', 'umbrales', 'renta', 'home'],
  sources: ['convocatoria', 'rd179'],
  es: {
    slug: 'beca-residencia',
    nav: 'Beca de residencia', card: 'Los 2700 euros por estudiar fuera de casa: quién los cobra, hasta qué renta y qué hay que justificar',
    title: 'Beca de residencia 2026-2027: 2700 €, requisitos y umbral',
    description: 'Cuantía de residencia de la beca 2026-2027: 2700 € hasta el umbral 2 si estudias fuera de casa, presencial, matrícula completa y con gasto de alojamiento.',
    h1: 'Beca de residencia: 2700 euros por estudiar fuera de casa',
    intro: 'Escribe cuántas personas cuentan en la familia, su renta y los estudios: la calculadora dice si hay beca de residencia (la ayuda por vivir fuera de casa) y cuánto cobraría en total el estudiante si vive fuera.',
    resume: `La beca de residencia es la ayuda por vivir fuera de casa: ${eur(C.residencia, 'es')} en el curso 2026-2027, que se suman al resto de la beca. La cobra quien tiene que vivir fuera de la casa familiar todo el curso porque su centro de estudios está lejos, estudia de forma presencial o semipresencial y matricula el curso entero. Hace falta que la renta de la familia no pase del umbral 2: ${eur(u4.u2, 'es')} para una familia de cuatro. Solo se paga si se justifica un gasto de alquiler, residencia de estudiantes, colegio mayor o pensión, y nunca más que ese gasto. Con una matrícula de 48 a 59 créditos baja a ${eur(C.parcialResidencia, 'es')} como máximo. En bachillerato y FP (formación profesional) se mira además si hay un centro cerca de casa al que se pueda ir y volver en el día. Con una discapacidad del 65 % o más, en la universidad, sube a ${eur(C.residencia * (1 + C.discapacidad.d65), 'es')}.`,
    faqs: [
      { q: '¿Puedo cobrar la beca de residencia si vivo en un piso de mis tíos?', a: 'Solo si pagas un alquiler o un hospedaje y lo puedes demostrar con papeles. La ayuda se paga únicamente cuando hay un gasto de alquiler o de alojamiento en una pensión, una residencia o un sitio parecido. Además, si el piso es de alguien de la familia que cuenta para la beca, o vive en él, se considera casa familiar y no hay ayuda.' },
      { open: true, q: '¿Qué distancia hace falta para tener derecho a la residencia?', a: 'La convocatoria no fija kilómetros. Mira la distancia, los medios de transporte y los horarios de clase. En la universidad basta con que el centro donde te matriculaste esté lejos de casa; en bachillerato y FP se comprueba si existe un centro cercano que imparta tus estudios, con plazas y al que puedas ir y volver en el día.' },
      { q: '¿Se cobra la residencia en una carrera a distancia o semipresencial?', a: `En semipresencial sí, con el curso entero matriculado. A distancia no, porque no hay que mudarse. Quien estudia a distancia y vive en una isla sin centro de su universidad tiene en cambio el suplemento por vivir en una isla: ${eur(C.insular.mayor, 'es')} o ${eur(C.insular.menor, 'es')}, según la isla.` },
    ],
    body: (h) => `<h2>Los cinco requisitos de la residencia</h2>
<ol>
<li>Renta de la familia dentro del umbral 2.</li>
<li>Estudios presenciales o semipresenciales.</li>
<li>Curso entero matriculado, o de 48 a 59 créditos con menos dinero.</li>
<li>Tener que vivir fuera de la casa familiar todo el curso.</li>
<li>Un alquiler o un alojamiento que se pueda demostrar con papeles.</li>
</ol>
<p>Si falla uno, no hay ayuda por vivir fuera de casa, aunque el resto de la beca siga.</p>
${h.table(['Umbral', 'Grado o máster presencial', 'Bachillerato o FP presencial'], [
  ['1', `${h.eur(C.renta)} + ${h.eur(C.residencia)} + extra de final de curso`, `${h.eur(C.renta)} + ${h.eur(C.residencia)} + extra de final de curso`],
  ['2', `${h.eur(C.residencia)} + extra de final de curso`, `${h.eur(C.residencia)} + ${h.eur(C.basica)} + extra de final de curso`],
  ['3', 'Sin ayuda por vivir fuera', 'Sin ayuda por vivir fuera'],
], 'Lo que da la beca a quien vive fuera de casa, curso entero, sin premio por buena nota', ['l', 'r', 'r'])}
<p>En bachillerato y FP, el umbral 1 lleva los ${h.eur(C.renta)} por renta baja en lugar de la beca básica de ${h.eur(C.basica)}: no se suman.</p>
<h2>Qué cuenta como casa familiar</h2>
<p>Es la casa más cercana al centro de estudios en la que vive alguien de la familia que cuenta para la beca.</p>
<p>Si la madre vive en Madrid y el padre, separado, en Salamanca, y el estudiante estudia en Salamanca, no hay ayuda por vivir fuera. Quien vive solo de sus propios ingresos tampoco la tiene: su casa es la del curso.</p>
<h2>Cómo se justifica el gasto</h2>
<p>Guarda el contrato de alquiler, los recibos o el certificado de la residencia o del colegio mayor: te los pueden pedir. La ayuda nunca pasa de lo que cuesta el alojamiento.</p>
<p>Si en casa hay dos o más hijos en la universidad fuera de casa, la renta de la familia se rebaja ${h.eur(D.fueraDomicilio)} por cada uno. Puede bajar de umbral: compruébalo en la ${h.a('renta', 'calculadora de renta familiar')}.</p>`,
  },

  en: {
    slug: 'residence-grant',
    nav: 'Residence grant', card: 'The €2,700 for studying away from home: who gets it, up to which income and what you must prove',
    title: 'Beca MEC residence grant 2026-2027: €2,700 and who gets it',
    description: 'The residence part of Spain\'s 2026-2027 study grant: €2,700 up to threshold 2 if you study away from home, in person, full-time and with real housing costs.',
    h1: 'Beca MEC (Ministry of Education) residence grant: €2,700',
    intro: 'Enter income, household size and your studies: the calculator says whether the beca MEC residence amount applies and how much, and the guaranteed total it adds up to with the rest of the grant.',
    resume: `The fixed residence-linked amount, known as the residence grant, is ${eur(C.residencia, 'en')} in 2026-2027 and is governed by article 7 of the call. It goes to students who need to live away from the family home for the whole year because of distance to college, transport and timetables, and who study in person or blended with full enrolment. The income limit is threshold 2: ${eur(u4.u2, 'en')} for a four-member household. It is only paid if you prove real spending on rent, a student hall, a college residence or lodging, and never above that spending. With part-time enrolment of 48 to 59 credits it drops to at most ${eur(C.parcialResidencia, 'en')}. Below university level the authorities also check whether a suitable college exists near home that you could reach and return from in a day. Independent students cannot get it, since their family home is where they live during the year. With a disability of 65% or more, at university, it rises to ${eur(C.residencia * (1 + C.discapacidad.d65), 'en')}.`,
    faqs: [
      { q: 'Can I get the residence grant if I live in my aunt and uncle\'s flat?', a: 'Only if you pay rent or board and can prove it. The call says payment is made only when rental or lodging costs in a guesthouse, hall or similar are proven. Also, if the flat belongs to a counted member of your family, or one lives there, it counts as the family home and there is no residence amount.' },
      { open: true, q: 'How far from home must I be to qualify for residence?', a: 'The call sets no distance in kilometres. It looks at distance, transport and class times. At university it is enough that the college you enrolled at is far from home; in upper secondary and vocational training they check whether a nearby centre teaches your course, has places and can be reached and left in a day.' },
      { q: 'Is the residence amount paid for distance or blended degrees?', a: `For blended study yes, with full enrolment: article 7 expressly includes it. For distance learning no, because there is no need to move. Distance university students living on an island with no local study centre get the island supplement instead, ${eur(C.insular.mayor, 'en')} or ${eur(C.insular.menor, 'en')} depending on the island.` },
    ],
    body: (h) => `<h2>The five conditions for the beca MEC residence grant</h2>
<p>${h.src('convocatoria', 'Article 7 of the call')} combines five conditions. One: family income within threshold 2. Two: in-person or blended study. Three: full enrolment, or 48 to 59 credits at the reduced amount. Four: a need to live away from the family home all year. Five: rent or lodging costs that can be proven. If any one fails, the residence amount is not paid, though the rest of the grant is.</p>
${h.table(['Threshold', 'Degree or master\'s in person', 'Upper secondary or VET in person'], [
  ['1', `${h.eur(C.renta)} + ${h.eur(C.residencia)} + variable`, `${h.eur(C.renta)} + ${h.eur(C.residencia)} + variable`],
  ['2', `${h.eur(C.residencia)} + variable`, `${h.eur(C.residencia)} + ${h.eur(C.basica)} + variable`],
  ['3', 'No residence', 'No residence'],
], 'What the grant gives with residence, full enrolment, no excellence (variable: the part shared out at the end)', ['l', 'r', 'r'])}
<p>Why does threshold 2 carry ${h.eur(C.basica)} more than threshold 1 in upper secondary and VET? Because the basic grant cannot be combined with the income-linked amount: at threshold 1 it is replaced by the ${h.eur(C.renta)} income-linked amount, which is larger. Lower income still means more in total, not less. And in every column, «variable» is the part shared out at the end of the year, with a ${h.eur(C.variableMin)} minimum.</p>
<h2>What counts as the family home</h2>
<p>It is the home closest to the college that belongs to a counted member or where one usually lives, even if it is not your legal address. If your mother lives in Madrid and your father, separated and a counted member, in Salamanca, and you study in Salamanca, there is no residence amount. For independent students, the family home is where they live during the year, so there is no residence amount either (article 17.3).</p>
<h2>The cost and the proof</h2>
<p>The amount can never exceed the real cost of housing. Keep the lease, the receipts or the certificate from the hall or college residence: you may be asked for them. If two or more siblings at university live away from home, family income also drops by ${h.eur(D.fueraDomicilio)} for each, which can move you down a threshold: check it in the ${h.a('renta', 'family income calculator')}.</p>
<p>With part-time enrolment of 48 to 59 credits, residence is capped at ${h.eur(C.parcialResidencia)}. With a disability of 25 to 64%, a university student gets ${h.eur(C.residencia * (1 + C.discapacidad.d25))}, under ${h.src('rd179', 'Royal Decree 179/2026')}. The other parts of the grant are under ${h.a('cuantias', 'amounts')}.</p>
<h3>Special cases</h3>
<p>In higher arts education nobody checks whether a centre closer to home exists (article 7.5). MUFACE residence grants for civil servants' families can be combined with the general grant, but not with its residence amount (article 55.4). And if housing is already covered by public services or funds, such as a free place in a public hall, the residence amount is not awarded (article 13.4).</p>`,
  },
});
