import { defineGuide } from '../../lib/page-types';
import { eur, U } from './_f';

/* Beca de matrícula: RD 179/2026 art. 4.1.a y DA 4.ª; convocatoria arts. 5 (créditos de primera matrícula, umbral 3), 11.1.a,
   23.2.a (matrícula parcial), 24.2 (solo matrícula tras matrícula parcial), 54 (exención y compensación a las universidades). */
const u4 = U(4);

export default defineGuide({
  id: 'matricula', group: 'dinero', order: 9,
  tool: 'matricula',
  related: ['cuantias', 'master', 'requisitos', 'umbrales'],
  sources: ['convocatoria', 'rd179'],
  es: {
    slug: 'beca-matricula',
    nav: 'Beca de matrícula', card: 'Las asignaturas nuevas gratis hasta el umbral 3: cuánto deja de pagar la familia y qué queda fuera',
    title: 'Beca de matrícula 2026-2027: créditos gratis y umbral 3',
    description: 'Beca de matrícula 2026-2027: créditos de primera matrícula gratis hasta el umbral 3 en grado, máster y artísticas superiores. Calcula tu ahorro con tu precio.',
    h1: 'Beca de matrícula: qué créditos te pagan y cuánto ahorras',
    intro: 'Escribe cuántos créditos (partes de asignatura) nuevos tiene el curso y lo que cuesta cada uno en tu universidad: verás cuánto deja de pagar la familia con la beca de matrícula.',
    resume: `La beca de matrícula, o matrícula gratis, hace que la universidad no cobre las asignaturas nuevas del curso 2026-2027. No es dinero que se ingrese en la cuenta: simplemente no se paga, o se devuelve si ya se pagó. Es para grado, máster y enseñanzas artísticas superiores, y llega hasta el umbral 3 de renta: ${eur(u4.u3, 'es')} para una familia de cuatro. Es la parte de la beca que más familias consiguen, porque no hace falta vivir fuera ni matricular el curso entero: basta con 30 créditos o más. Un crédito es una parte de una asignatura, no un préstamo. No entran las asignaturas que se repiten ni las tasas de secretaría. Cuánto vale depende del precio del crédito, que fija cada comunidad autónoma para sus universidades públicas: por eso la calculadora te pide el de tu universidad. En una universidad privada, la beca cubre solo lo que costaría en la pública.`,
    faqs: [
      { q: '¿Tengo que pagar la matrícula mientras se resuelve la beca?', a: 'En principio, no. Quien ha pedido la beca puede matricularse sin pagar antes las asignaturas nuevas. La secretaría puede pedir el pago si ve que no se cumplen los requisitos. Si al final la beca se deniega, habrá que pagarlas en el plazo que fije la universidad.' },
      { q: '¿Cubre la beca de matrícula una universidad privada?', a: 'Sí, pero solo hasta el precio de la universidad pública. En un centro privado, la beca vale lo que cuestan esos mismos estudios en las universidades públicas de la comunidad. La diferencia hasta el precio del centro privado la paga la familia. Conviene preguntarlo en la secretaría antes de matricularse.' },
      { q: '¿Qué pasa con la beca de matrícula si suspendo mucho?', a: 'La matrícula gratis es la única parte de la beca que no se devuelve si no se aprueba lo suficiente: el resto sí. Pero suspender mucho puede dejar sin beca el curso siguiente, porque no se llegaría al porcentaje de aprobados que se pide, y las asignaturas repetidas ya no entran en la beca.' },
    ],
    body: (h) => `<h2>Qué asignaturas cubre la matrícula gratis</h2>
<p>Solo las que se matriculan por primera vez.</p>
<p>Un ejemplo: 66 créditos, de los que 12 son de una asignatura suspendida el año pasado. La beca cubre los 54 nuevos; los 12 repetidos se pagan.</p>
${h.table(['Situación', 'Matrícula gratis'], [
  ['Grado o máster, curso entero, umbral 1, 2 o 3', 'Sí, asignaturas nuevas'],
  ['Entre 30 y 59 créditos, hasta el umbral 3', 'Sí, asignaturas nuevas'],
  ['Asignaturas que se repiten', 'No'],
  ['Créditos de más, que no hacen falta para el título', 'No'],
  ['Año extra de la carrera (por ejemplo, el quinto de un grado de cuatro)', 'Sí'],
  ['Bachillerato o FP (formación profesional)', 'No existe: hay beca básica'],
  [`Renta por encima del umbral 3 (${h.eur(u4.u3)} con 4 personas)`, 'No'],
], 'Matrícula gratis, curso 2026-2027', ['l', 'l'])}
<h2>Dónde mirar el precio del crédito</h2>
<p>Cada comunidad fija cada año el precio de sus universidades públicas, y cambia según la carrera.</p>
<p>Lo encontrarás en la web de tu universidad, en «precios públicos» o «tasas», o en el recibo de la matrícula. Los 20 € de la calculadora son solo un ejemplo.</p>
<h2>Si la beca es solo la matrícula</h2>
<p>Muchas familias del umbral 3 solo tienen esta parte. En una carrera de cuatro años, el ahorro sumado es grande.</p>
<p>Con un 8 de nota y el curso entero se suma el ${h.a('nota', 'premio por buena nota')}. Las demás partes de la beca están en ${h.a('cuantias', 'cuantías')}, y el máster tiene su propia página: ${h.a('master', 'beca de máster')}.</p>`,
  },

  en: {
    slug: 'tuition-waiver',
    nav: 'Tuition waiver', card: 'First-time credits free up to threshold 3: how much you save and what is left out',
    title: 'Beca MEC tuition waiver 2026-2027: free credits up to U3',
    description: 'Tuition waiver under Spain\'s 2026-2027 grant: first-time credits free up to threshold 3 for degrees, master\'s and higher arts. Work out your own saving.',
    h1: 'Beca MEC (Ministry of Education) tuition waiver',
    intro: 'Enter your first-time credits and the price per credit at your university: you will see how much the beca MEC tuition waiver covers and what you still pay for repeated credits.',
    resume: `The tuition waiver covers the public fee for the credits you enrol in for the first time in 2026-2027. It is only for degrees, official master's degrees and higher arts education, and it reaches threshold 3 of family income: ${eur(u4.u3, 'en')} for a household of four. It is the component most families obtain, because it requires neither living away nor full enrolment: 30 credits or more is enough to apply. It is not money paid into your account. The university does not charge you for those credits, or refunds them if you paid, and the Ministry compensates it, under article 54 of the call. Credits taken for a second or later time, credits beyond the minimum needed for the qualification and administrative fees are left out. The amount depends on the price per credit each region sets for its public universities, which this site has not collected: that is why the calculator asks for yours. At private colleges the waiver covers the region's public fee, not the college's price.`,
    faqs: [
      { q: 'Do I have to pay tuition while the grant is being decided?', a: 'In principle, no. Article 54.1 of the call lets anyone who has applied for the grant enrol without paying first for first-time credits. The registry may still ask for payment as a precaution if it sees you do not meet the requirements. If the grant is finally refused, you will have to pay within the deadline your university sets.' },
      { q: 'Does the tuition waiver cover a private university?', a: 'Yes, but only up to the public fee. The call says that at private or affiliated colleges that do not apply official prices, the waiver equals the lowest price the region sets for the same type of studies at its public centres. You pay the difference up to the private college\'s price.' },
      { q: 'What happens to the tuition waiver if I fail a lot?', a: 'The tuition waiver is the only component that is not paid back if you fall short of the minimum credits passed: article 43.2 demands repayment of every component except tuition. But failing can cost you the grant next year, as you would miss your field\'s percentage, and the credits you repeat are no longer covered.' },
    ],
    body: (h) => `<h2>Which credits the beca tuition waiver covers</h2>
<p>${h.src('convocatoria', 'Article 5 of the call')} limits the waiver to credits you enrol in for the first time in 2026-2027. An example: 66 credits enrolled, 12 of them from a subject failed last year. The waiver covers the 54 new ones; you pay for the 12 repeated ones at the second-enrolment price your region sets. Credits beyond the minimum needed for the qualification are not covered either.</p>
${h.table(['Situation', 'Tuition waiver'], [
  ['Degree or master\'s, full enrolment, threshold 1, 2 or 3', 'Yes, new credits'],
  ['Part-time, 30 to 59 credits, up to threshold 3', 'Yes, new credits'],
  ['Credits taken a second or later time', 'No'],
  ['Credits beyond the minimum needed for the qualification', 'No'],
  ['Allowed extra final year', 'Yes'],
  ['Upper secondary or vocational training', 'None: there is a basic grant'],
  [`Income above threshold 3 (${h.eur(u4.u3)} with 4 members)`, 'No'],
], 'Tuition waiver, 2026-2027 call', ['l', 'l'])}
<h2>The price per credit</h2>
<p>Each region passes a public fees decree for every academic year for its universities, varying by field, type of studies and how many times a subject has been taken. To find your price, look up your region's decree or your university's fee table. The calculator multiplies your credits by that price; the default value is only an example and does not belong to any particular university.</p>
<h2>If tuition is all you get</h2>
<p>Many threshold-3 holders and students coming from part-time enrolment only obtain this component. Even so, over a four-year degree the total saving is large, and it needs nothing extra once the grant is awarded. If your grade reaches 8 with full enrolment, the ${h.a('nota', 'excellence amount')} is added. The other components and their thresholds are under ${h.a('cuantias', 'amounts')}, and master's degrees have their own page, ${h.a('master', 'the master\'s grant')}.</p>
<h3>What the Ministry pays the university</h3>
<p>Nothing in this section changes what you pay: the exemption covers the public fee for each new credit. This is about what the Ministry later pays the university: the call sets caps, such as ${h.eur(18.46, 2)} per degree credit when today's price is above the 2011-2012 one, and the university absorbs the difference, not the student. There is no tuition waiver either when the cost is already covered by public funds (article 13.4). And a student whose last year was part-time and who beat the field percentage gets the tuition waiver as the only component (article 24.2).</p>`,
  },
});
