import { defineGuide } from '../../lib/page-types';
import { eur, dec, U, C, A, CV, day } from './_f';

/* Máster: RD 179/2026 art. 4; convocatoria arts. 3.2.b, 8.2.e (excelencia), 28 (créditos), 29 (rendimiento: 5,00, coef. 1,17,
   2.º curso todo aprobado), 15 (requisito de título a 30/09 y grado hasta 31/12), 54.3 (compensación de precios). */
const u2 = U(2);

export default defineGuide({
  id: 'master', group: 'estudios', order: 11,
  tool: 'beca', toolArg: { estudio: 'master', curso: 'primero', nota: 7.2, miembros: 3, renta: 28000 },
  related: ['matricula', 'requisitos', 'nota', 'residencia'],
  sources: ['convocatoria', 'rd179'],
  es: {
    slug: 'master',
    nav: 'Beca de máster', card: 'Matrícula, renta, residencia y excelencia en máster universitario: nota de acceso, coeficiente y segundo curso',
    title: 'Beca MEC máster 2026-2027: requisitos, nota y cuantías',
    description: 'Beca general para máster 2026-2027: nota de 5 en los estudios de acceso (×1,17 técnicas), segundo curso con todo aprobado, matrícula, renta y residencia.',
    h1: 'Beca para máster universitario 2026-2027',
    intro: 'El simulador está fijado en máster: indica si es primer o segundo curso, tu nota media de acceso y la renta familiar para ver las piezas de beca.',
    resume: `Los másteres universitarios oficiales entran en la beca general con las mismas piezas que el grado: beca de matrícula hasta el umbral 3, ${eur(C.renta, 'es')} por renta hasta el umbral 1, ${eur(C.residencia, 'es')} por residencia hasta el umbral 2, excelencia y cuantía variable. Lo que cambia es el requisito académico, en el artículo 29 de la convocatoria. En primer curso hace falta una nota media de ${dec(A.notaMinima, 'es')} en los estudios que dan acceso al máster; si vienen de enseñanzas técnicas, esa media se multiplica por ${dec(A.masterCoefTecnicas, 'es')}. En segundo curso se exige un ${dec(A.notaMinima, 'es')} de media en primero y haber aprobado todos los créditos matriculados, sin excepción. Para la excelencia, la nota de acceso se multiplica por el coeficiente de su rama. Si te admiten en el máster con el grado aún sin terminar, puedes tener beca siempre que obtengas el título de grado como tarde el ${day(CV.masterGradoHasta, 'es')} (artículo 28.7). Para una pareja sin hijos, el umbral 2 es ${eur(u2.u2, 'es')}.`,
    faqs: [
      { q: '¿Cubre la beca de matrícula todo el precio de un máster caro?', a: 'Cubre el precio público oficial de los créditos de primera matrícula que fije tu comunidad para ese máster. En una universidad pública, eso es lo que pagarías. En una privada o adscrita que no aplica precios públicos, la beca solo llega al precio mínimo que fija la comunidad para un máster del mismo tipo en la pública, y la diferencia corre de tu cuenta.' },
      { q: '¿Qué pasa si suspendo una asignatura en primero de máster?', a: 'No tendrás beca en segundo curso. El artículo 29.2 exige haber superado la totalidad de los créditos de primero para obtener beca en segundo, además de una media de 5. Es más estricto que en el grado, donde basta un porcentaje. La regla se aplica también a quienes redujeron carga lectiva por discapacidad.' },
      { q: '¿Puedo tener beca para un segundo máster?', a: `No. El artículo 15.a de la convocatoria exige no tener, a ${day(CV.tituloFecha, 'es')}, un título oficial del mismo nivel o superior al de los estudios para los que pides beca. Si ya tienes un máster oficial, uno nuevo no da derecho a beca general. La excepción va al revés: un grado o un título antiguo con nivel MECES 3 sí permite beca para un máster.` },
    ],
    body: (h) => `<h2>Las piezas de la beca en máster</h2>
<p>El ${h.src('rd179', 'artículo 4 del Real Decreto 179/2026')} trata máster y grado igual en cuanto a importes. Con matrícula completa y presencial, el umbral 1 da ${h.eur(C.renta)} por renta; hasta el umbral 2, ${h.eur(C.residencia)} si vives fuera y la cuantía variable; hasta el umbral 3, la matrícula y la excelencia. La matrícula completa en máster es de 60 créditos en el curso (artículo 28.1); de 30 a 59 créditos es parcial y hay que aprobarlos todos para repetir beca.</p>
${h.table(['Umbral (2 miembros)', 'Renta máxima', 'Piezas con matrícula completa'], [
  ['1', h.eur(u2.u1), `Matrícula, ${h.eur(C.renta)}, residencia, excelencia, variable`],
  ['2', h.eur(u2.u2), 'Matrícula, residencia, excelencia, variable'],
  ['3', h.eur(u2.u3), 'Matrícula y excelencia'],
], 'Máster universitario, curso 2026-2027', ['l', 'r', 'l'])}
${h.mini('beca', { p: ['curso', 'nota', 'renta'], d: { estudio: 'master', rama: 'ingenieria', miembros: 2 }, t: 'Máster con acceso desde ingeniería' })}
<h2>La nota de acceso y el coeficiente técnico</h2>
<p>Para primero, la media de los estudios de acceso debe llegar a ${h.n(A.notaMinima, 2)}. Si esos estudios son de enseñanzas técnicas, el ${h.src('convocatoria', 'artículo 29.1 de la convocatoria')} multiplica la media por ${h.n(A.masterCoefTecnicas, 2)}: un ${h.n(4.5, 2)} de un grado de ingeniería se convierte en ${h.n(4.5 * A.masterCoefTecnicas, 3)} y cumple. Para la excelencia de primero de máster se aplica el coeficiente de la rama: ${h.n(C.coefExcelencia.ingenieria, 2)} en ingeniería y arquitectura, ${h.n(C.coefExcelencia.ciencias, 2)} en ciencias y ${h.n(C.coefExcelencia.salud, 2)} en salud. La ${h.a('nota', 'calculadora de nota')} hace la cuenta.</p>
<h2>Segundo curso: todo aprobado</h2>
<p>Si tu máster dura dos años, la beca de segundo exige una media de ${h.n(A.notaMinima, 2)} en primero y todos los créditos de primero superados. No hay porcentaje por rama como en el grado. Planifica la matrícula de primero en consecuencia: mejor matricular lo que puedes aprobar. El detalle de los porcentajes de grado está en ${h.a('requisitos', 'requisitos académicos')}.</p>
<h2>Plazos para quien acaba el grado</h2>
<p>La beca se pide en el plazo general, aunque aún no tengas plaza en el máster. Quien entra en el máster con el grado sin terminar debe tener el título de grado el ${h.day(CV.masterGradoHasta)} como tarde. Y nadie puede tener ya, a ${h.day(CV.tituloFecha)}, un título del mismo nivel que el máster o superior, salvo los grados y títulos antiguos con nivel MECES 3. La ${h.a('matricula', 'beca de matrícula')} explica qué créditos cubre, y la ${h.a('residencia', 'beca de residencia')}, cuándo se paga.</p>`,
  },
  en: {
    slug: 'masters-degree',
    nav: 'Master\'s grant', card: 'Tuition, income, residence and excellence for an official master\'s: entry grade, coefficient and year two',
    title: 'Beca MEC master\'s grant 2026-2027: rules, grade, amounts',
    description: 'Spain\'s 2026-2027 general grant for a master\'s: 5 in the qualifying degree (×1.17 technical), every year-one credit passed for year two, tuition and residence.',
    h1: 'Beca MEC grant for an official master\'s degree 2026-2027',
    intro: 'The simulator is set to master\'s: say whether it is year one or two, enter your qualifying average and family income to see your beca MEC components.',
    resume: `Official university master's degrees are covered by the general grant with the same components as a degree: tuition waiver up to threshold 3, ${eur(C.renta, 'en')} income-linked up to threshold 1, ${eur(C.residencia, 'en')} for residence up to threshold 2, excellence and the variable amount. What changes is the academic requirement, in article 29 of the call. Year one needs an average of ${dec(A.notaMinima, 'en')} in the qualifying studies; if they were technical, that average is multiplied by ${dec(A.masterCoefTecnicas, 'en')}. Year two needs a ${dec(A.notaMinima, 'en')} average in year one and every credit enrolled in passed, with no exception. For excellence, the qualifying grade is multiplied by its field's coefficient. If you are admitted to the master's before finishing your degree, you can still get the grant provided you hold the degree by ${day(CV.masterGradoHasta, 'en')} (article 28.7). For a couple without children, threshold 2 is ${eur(u2.u2, 'en')}.`,
    faqs: [
      { q: 'Does the tuition waiver cover the full price of an expensive master\'s?', a: 'It covers the official public fee for first-time credits that your region sets for that master\'s. At a public university that is what you would pay. At a private or affiliated college that does not apply public fees, the waiver only reaches the lowest price the region sets for a similar master\'s at a public university, and you pay the difference.' },
      { q: 'What if I fail a subject in the first year of a master\'s?', a: 'You will not get the grant in year two. Article 29.2 requires every first-year credit to be passed to get a grant in year two, besides an average of 5. It is stricter than for degrees, where a percentage is enough. The rule also applies to students who took a lighter load because of a disability.' },
      { q: 'Can I get a grant for a second master\'s?', a: `No. Article 15.a of the call requires that on ${day(CV.tituloFecha, 'en')} you do not hold an official qualification of the same or a higher level than the studies applied for. If you already have an official master's, a new one gives no right to the general grant. The exception runs the other way: a degree or older title placed at MECES level 3 still allows a grant for a master's.` },
    ],
    body: (h) => `<h2>The beca MEC components for a master's</h2>
<p>${h.src('rd179', 'Article 4 of Royal Decree 179/2026')} treats master's degrees and degrees alike on amounts. With full, in-person enrolment, threshold 1 gives ${h.eur(C.renta)} income-linked; up to threshold 2, ${h.eur(C.residencia)} if you live away and the variable amount; up to threshold 3, tuition and excellence. Full enrolment for a master's is 60 credits in the year (article 28.1); 30 to 59 credits is part-time, and all must be passed to get the grant again.</p>
${h.table(['Threshold (2 members)', 'Maximum income', 'Components with full enrolment'], [
  ['1', h.eur(u2.u1), `Tuition, ${h.eur(C.renta)}, residence, excellence, variable`],
  ['2', h.eur(u2.u2), 'Tuition, residence, excellence, variable'],
  ['3', h.eur(u2.u3), 'Tuition and excellence'],
], 'Official master\'s degree, 2026-2027', ['l', 'r', 'l'])}
${h.mini('beca', { p: ['curso', 'nota', 'renta'], d: { estudio: 'master', rama: 'ingenieria', miembros: 2 }, t: 'Master\'s after an engineering degree' })}
<h2>The qualifying grade and the technical coefficient</h2>
<p>For year one, the average of the qualifying studies must reach ${h.n(A.notaMinima, 2)}. If those studies were technical, ${h.src('convocatoria', 'article 29.1 of the call')} multiplies the average by ${h.n(A.masterCoefTecnicas, 2)}: a ${h.n(4.5, 2)} from an engineering degree becomes ${h.n(4.5 * A.masterCoefTecnicas, 3)} and passes. For first-year master's excellence, the field coefficient applies: ${h.n(C.coefExcelencia.ingenieria, 2)} in engineering and architecture, ${h.n(C.coefExcelencia.ciencias, 2)} in sciences and ${h.n(C.coefExcelencia.salud, 2)} in health. The ${h.a('nota', 'grade calculator')} does the sum.</p>
<h2>Year two: everything passed</h2>
<p>If your master's lasts two years, the year-two grant needs a ${h.n(A.notaMinima, 2)} average in year one and every first-year credit passed. There is no field percentage as for degrees. Plan your first-year enrolment accordingly: enrol in what you can pass. Degree percentages are under ${h.a('requisitos', 'academic requirements')}.</p>
<h2>Deadlines if you are finishing your degree</h2>
<p>You apply in the general window, even before you have a place on the master's. Anyone entering the master's with the degree unfinished must hold it by ${h.day(CV.masterGradoHasta)} at the latest. And nobody may already hold, on ${h.day(CV.tituloFecha)}, a qualification at the master's level or higher, except degrees and older titles placed at MECES level 3. The ${h.a('matricula', 'tuition waiver')} page explains which credits are covered, and the ${h.a('residencia', 'residence grant')} page when it is paid.</p>
<p>One more rule: if the university caps the credits you can take and you study them in one semester, at weekends or with fewer than 300 teaching hours, you get tuition, the minimum variable amount and half of the other components (article 28.2.b).</p>`,
  },
});
