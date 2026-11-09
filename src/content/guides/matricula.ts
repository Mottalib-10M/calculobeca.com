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
    nav: 'Beca de matrícula', card: 'Los créditos de primera matrícula gratis hasta el umbral 3: cuánto te ahorras y qué queda fuera',
    title: 'Beca de matrícula 2026-2027: créditos gratis y umbral 3',
    description: 'Beca de matrícula 2026-2027: créditos de primera matrícula gratis hasta el umbral 3 en grado, máster y artísticas superiores. Calcula tu ahorro con tu precio.',
    h1: 'Beca de matrícula: qué créditos te pagan y cuánto ahorras',
    intro: 'Escribe los créditos de primera matrícula y el precio del crédito en tu universidad: verás cuánto cubre la beca y cuánto sigues pagando por los créditos repetidos.',
    resume: `La beca de matrícula cubre el precio público de los créditos en los que te matriculas por primera vez en el curso 2026-2027. Es exclusiva de grado, máster universitario y enseñanzas artísticas superiores, y llega hasta el umbral 3 de renta familiar: ${eur(u4.u3, 'es')} para una familia de cuatro miembros. Es la pieza que más familias obtienen, porque no exige estudiar fuera ni matrícula completa: con 30 créditos o más ya se puede pedir. No es dinero que se ingresa en tu cuenta. La universidad no te cobra esos créditos, o te los devuelve si los pagaste, y el Ministerio le compensa el importe, según el artículo 54 de la convocatoria. Quedan fuera los créditos en segunda o posteriores matrículas, los que excedan del mínimo necesario para el título y las tasas de secretaría. El importe depende del precio del crédito que fija cada comunidad autónoma para su universidad pública, y este sitio no lo ha recogido: por eso la calculadora te pide el tuyo. En los centros privados, la beca cubre el precio público de la comunidad, no el precio del centro.`,
    faqs: [
      { q: '¿Tengo que pagar la matrícula mientras se resuelve la beca?', a: 'No, en principio. El artículo 54.1 de la convocatoria permite a quien ha solicitado la beca formalizar la matrícula sin pagar antes los créditos de primera matrícula. La secretaría puede exigir el pago de forma cautelar si ve que no cumples los requisitos. Si al final te deniegan la beca, tendrás que abonarlos en el plazo que fije tu universidad.' },
      { q: '¿Cubre la beca de matrícula una universidad privada?', a: 'Sí, pero solo hasta el precio público. La convocatoria dice que en centros privados o adscritos que no aplican los precios oficiales, la beca equivale al precio mínimo que fija la comunidad para estudios del mismo tipo en sus centros públicos. La diferencia hasta el precio del centro privado la pagas tú.' },
      { q: '¿Qué pasa con la beca de matrícula si suspendo mucho?', a: 'La beca de matrícula es la única pieza que no se devuelve si no llegas al mínimo de créditos aprobados: el artículo 43.2 pide reintegrar todos los componentes salvo la matrícula. Pero suspender te puede dejar sin beca el curso siguiente, porque no cumplirías el porcentaje de tu rama, y los créditos que repitas ya no entran en la beca.' },
    ],
    body: (h) => `<h2>Qué créditos cubre</h2>
<p>El ${h.src('convocatoria', 'artículo 5 de la convocatoria')} limita la beca a los créditos en los que te matriculas por primera vez en el curso 2026-2027. Un ejemplo: matrícula de 66 créditos, de los que 12 son de una asignatura suspendida el año pasado. La beca cubre los 54 nuevos; los 12 repetidos los pagas al precio de segunda matrícula que fija tu comunidad. Los créditos que pasen del mínimo necesario para obtener el título tampoco entran.</p>
${h.table(['Situación', 'Beca de matrícula'], [
  ['Grado o máster, matrícula completa, umbral 1, 2 o 3', 'Sí, créditos nuevos'],
  ['Matrícula parcial de 30 a 59 créditos, hasta el umbral 3', 'Sí, créditos nuevos'],
  ['Créditos en segunda o posterior matrícula', 'No'],
  ['Créditos por encima del mínimo necesario para el título', 'No'],
  ['Último curso adicional permitido', 'Sí'],
  ['Bachillerato o formación profesional', 'No existe: hay beca básica'],
  [`Renta por encima del umbral 3 (${h.eur(u4.u3)} con 4 miembros)`, 'No'],
], 'Beca de matrícula, convocatoria 2026-2027', ['l', 'l'])}
${h.mini('umbrales', { p: ['miembros', 'renta'], t: '¿En qué umbral queda tu familia? Del 1 al 3, matrícula gratis' })}
<h2>El precio del crédito</h2>
<p>Cada comunidad aprueba para cada curso un decreto de precios públicos de sus universidades, distinto por rama, por tipo de estudios y por número de matrícula. Para conocer tu precio, busca el decreto de tu comunidad o la tabla de tasas de tu universidad. La calculadora multiplica tus créditos por ese precio; el valor por defecto es solo un ejemplo y no corresponde a ninguna universidad concreta.</p>
<h2>Si cobras solo la matrícula</h2>
<p>Muchos becarios del umbral 3 y quienes vienen de una matrícula parcial solo obtienen esta pieza. Aun así, en una carrera de cuatro años el ahorro acumulado es grande, y la beca abre otras puertas: la exención no exige pedir nada más. Si tu nota llega a 8 con matrícula completa, se suma la ${h.a('nota', 'cuantía de excelencia')}. El resto de piezas y sus umbrales están en ${h.a('cuantias', 'cuantías')}, y el máster tiene su propia página, ${h.a('master', 'beca de máster')}.</p>
<h2>Lo que paga el Ministerio a la universidad</h2>
<p>Nada de esta sección cambia lo que pagas tú: la exención cubre el precio público de cada crédito nuevo. Aquí se trata de lo que el Ministerio compensa después a la universidad: la convocatoria fija topes, por ejemplo ${h.eur(18.46, 2)} por crédito de grado cuando el precio actual supera el del curso 2011-2012, y la diferencia la asume la universidad, no el estudiante. Tampoco hay beca de matrícula cuando el gasto ya lo cubren fondos públicos (artículo 13.4).</p>`,
  },
  en: {
    slug: 'tuition-waiver',
    nav: 'Tuition waiver', card: 'First-time credits free up to threshold 3: how much you save and what is left out',
    title: 'Beca MEC tuition waiver 2026-2027: free credits up to U3',
    description: 'Tuition waiver under Spain\'s 2026-2027 grant: first-time credits free up to threshold 3 for degrees, master\'s and higher arts. Work out your own saving.',
    h1: 'Beca MEC tuition waiver: which credits are covered and how much you save',
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
${h.mini('umbrales', { p: ['miembros', 'renta'], t: 'Which threshold is your household in? From 1 to 3, free tuition' })}
<h2>The price per credit</h2>
<p>Each region passes a public fees decree for every academic year for its universities, varying by field, type of studies and how many times a subject has been taken. To find your price, look up your region's decree or your university's fee table. The calculator multiplies your credits by that price; the default value is only an example and does not belong to any particular university.</p>
<h2>If tuition is all you get</h2>
<p>Many threshold-3 holders and students coming from part-time enrolment only obtain this component. Even so, over a four-year degree the total saving is large, and it needs nothing extra once the grant is awarded. If your grade reaches 8 with full enrolment, the ${h.a('nota', 'excellence amount')} is added. The other components and their thresholds are under ${h.a('cuantias', 'amounts')}, and master's degrees have their own page, ${h.a('master', 'the master\'s grant')}.</p>
<h2>What the Ministry pays the university</h2>
<p>Nothing in this section changes what you pay: the exemption covers the public fee for each new credit. This is about what the Ministry later pays the university: the call sets caps, such as ${h.eur(18.46, 2)} per degree credit when today's price is above the 2011-2012 one, and the university absorbs the difference, not the student. There is no tuition waiver either when the cost is already covered by public funds (article 13.4). And a student whose last year was part-time and who beat the field percentage gets the tuition waiver as the only component (article 24.2).</p>`,
  },
});
