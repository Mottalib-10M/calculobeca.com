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
    intro: 'Escribe la renta, los miembros y tus estudios: la calculadora dice si te corresponde la cuantía de residencia y cuánto, y el total seguro que suma con el resto de la beca.',
    resume: `La cuantía fija ligada a la residencia, conocida como beca de residencia, es de ${eur(C.residencia, 'es')} en el curso 2026-2027 y la regula el artículo 7 de la convocatoria. La cobra quien necesita vivir fuera del domicilio familiar todo el curso por la distancia al centro, los transportes y los horarios, y estudia de forma presencial o semipresencial con matrícula completa. El límite de renta es el umbral 2: ${eur(u4.u2, 'es')} para una familia de cuatro miembros. Solo se paga si acreditas un gasto real de alquiler, residencia de estudiantes, colegio mayor o pensión, y nunca por encima de ese gasto. Con matrícula parcial de 48 a 59 créditos baja a un máximo de ${eur(C.parcialResidencia, 'es')}. En estudios no universitarios se comprueba además si hay un centro adecuado cerca de casa al que se pueda ir y volver en el día. Los estudiantes independientes no la cobran, porque su domicilio familiar es el del curso. Con una discapacidad del 65 % o más, en la universidad, sube a ${eur(C.residencia * (1 + C.discapacidad.d65), 'es')}.`,
    faqs: [
      { q: '¿Puedo cobrar la beca de residencia si vivo en un piso de mis tíos?', a: 'Solo si pagas un alquiler o un hospedaje y lo puedes acreditar. La convocatoria dice que el pago procede exclusivamente cuando se justifican gastos de alquiler o de alojamiento en pensión, residencia o establecimiento similar. Además, si el piso es de un miembro computable de tu familia o vive en él alguno, se considera domicilio familiar y no hay residencia.' },
      { open: true, q: '¿Qué distancia hace falta para tener derecho a la residencia?', a: 'La convocatoria no fija kilómetros. Mira la distancia, los medios de transporte y los horarios de clase. En la universidad basta con que el centro donde te matriculaste esté lejos de casa; en bachillerato y FP se comprueba si existe un centro cercano que imparta tus estudios, con plazas y al que puedas ir y volver en el día.' },
      { q: '¿Se cobra la residencia en una carrera a distancia o semipresencial?', a: `En semipresencial sí, con matrícula completa: el artículo 7 la incluye expresamente. En la enseñanza a distancia no, porque no hay que trasladarse. Los alumnos de universidades a distancia que viven en una isla sin centro asociado tienen en cambio el suplemento insular, de ${eur(C.insular.mayor, 'es')} o ${eur(C.insular.menor, 'es')} según la isla.` },
    ],
    body: (h) => `<h2>Los cinco requisitos de la residencia</h2>
<p>El ${h.src('convocatoria', 'artículo 7 de la convocatoria')} junta cinco condiciones. Primera: renta familiar dentro del umbral 2. Segunda: estudios presenciales o semipresenciales. Tercera: matrícula completa, o de 48 a 59 créditos con el importe reducido. Cuarta: necesidad de residir fuera del domicilio familiar durante todo el curso. Quinta: un gasto de alquiler u hospedaje que se pueda justificar. Si falla cualquiera, la residencia no se paga, aunque el resto de la beca sí.</p>
${h.table(['Umbral', 'Grado o máster presencial', 'Bachillerato o FP presencial'], [
  ['1', `${h.eur(C.renta)} + ${h.eur(C.residencia)} + variable`, `${h.eur(C.renta)} + ${h.eur(C.residencia)} + variable`],
  ['2', `${h.eur(C.residencia)} + variable`, `${h.eur(C.residencia)} + ${h.eur(C.basica)} + variable`],
  ['3', 'Sin residencia', 'Sin residencia'],
], 'Lo que da la beca con residencia, matrícula completa, sin excelencia (variable: parte que se reparte al final)', ['l', 'r', 'r'])}
<p>¿Por qué en bachillerato y FP aparece una línea de ${h.eur(C.basica)} en el umbral 2 y no en el 1? Porque la beca básica no se suma a la cuantía ligada a la renta: en el umbral 1 la sustituyen los ${h.eur(C.renta)} de renta, que son más. Con menos renta se cobra más en total, no menos. Y en los tres umbrales, «variable» es la parte que se reparte al final del curso, con un mínimo de ${h.eur(C.variableMin)}.</p>
${h.mini('renta', { p: ['sust', 'fuera'], d: { fuera: 2 }, t: '¿Dos o más hijos en la universidad fuera de casa? Así baja la renta' })}
<h2>Qué cuenta como domicilio familiar</h2>
<p>Es el domicilio más próximo al centro que sea de un miembro computable o en el que viva habitualmente alguno, aunque no sea tu domicilio legal. Si tu madre vive en Madrid y tu padre, separado y miembro computable, en Salamanca, y estudias en Salamanca, no hay residencia. En los estudiantes independientes, el domicilio familiar es el que habitan durante el curso, así que tampoco hay residencia (artículo 17.3).</p>
<h2>El gasto y su justificación</h2>
<p>La cuantía nunca puede superar el coste real del alojamiento. Guarda el contrato de alquiler, los recibos o el certificado de la residencia o del colegio mayor: te los pueden pedir. Si en casa hay dos o más hermanos universitarios fuera, además la renta familiar se rebaja ${h.eur(D.fueraDomicilio)} por cada uno, lo que puede bajarte de umbral: compruébalo en la ${h.a('renta', 'calculadora de renta familiar')}.</p>
<p>Con matrícula parcial de 48 a 59 créditos, la residencia se queda en un máximo de ${h.eur(C.parcialResidencia)}. Con una discapacidad del 25 al 64 %, un universitario cobra ${h.eur(C.residencia * (1 + C.discapacidad.d25))}, según el ${h.src('rd179', 'Real Decreto 179/2026')}. El resto de piezas de la beca están en ${h.a('cuantias', 'cuantías')}.</p>
<h2>Casos particulares</h2>
<p>En las enseñanzas artísticas superiores no se mira si hay un centro más cercano a casa que el tuyo (artículo 7.5). Las becas de residencia de MUFACE son compatibles con la beca general, pero no con su cuantía de residencia (artículo 55.4). Y si el alojamiento ya lo cubren servicios o fondos públicos, como una plaza gratuita en una residencia pública, no se concede (artículo 13.4).</p>`,
  },
  en: {
    slug: 'residence-grant',
    nav: 'Residence grant', card: 'The €2,700 for studying away from home: who gets it, up to which income and what you must prove',
    title: 'Beca MEC residence grant 2026-2027: €2,700 and who gets it',
    description: 'The residence part of Spain\'s 2026-2027 study grant: €2,700 up to threshold 2 if you study away from home, in person, full-time and with real housing costs.',
    h1: 'Beca MEC residence grant: €2,700 for studying away from home',
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
${h.mini('renta', { p: ['sust', 'fuera'], d: { fuera: 2 }, t: 'Two or more children at university away from home? See how income drops' })}
<h2>What counts as the family home</h2>
<p>It is the home closest to the college that belongs to a counted member or where one usually lives, even if it is not your legal address. If your mother lives in Madrid and your father, separated and a counted member, in Salamanca, and you study in Salamanca, there is no residence amount. For independent students, the family home is where they live during the year, so there is no residence amount either (article 17.3).</p>
<h2>The cost and the proof</h2>
<p>The amount can never exceed the real cost of housing. Keep the lease, the receipts or the certificate from the hall or college residence: you may be asked for them. If two or more siblings at university live away from home, family income also drops by ${h.eur(D.fueraDomicilio)} for each, which can move you down a threshold: check it in the ${h.a('renta', 'family income calculator')}.</p>
<p>With part-time enrolment of 48 to 59 credits, residence is capped at ${h.eur(C.parcialResidencia)}. With a disability of 25 to 64%, a university student gets ${h.eur(C.residencia * (1 + C.discapacidad.d25))}, under ${h.src('rd179', 'Royal Decree 179/2026')}. The other parts of the grant are under ${h.a('cuantias', 'amounts')}.</p>
<h2>Special cases</h2>
<p>In higher arts education nobody checks whether a centre closer to home exists (article 7.5). MUFACE residence grants for civil servants' families can be combined with the general grant, but not with its residence amount (article 55.4). And if housing is already covered by public services or funds, such as a free place in a public hall, the residence amount is not awarded (article 13.4).</p>`,
  },
});
