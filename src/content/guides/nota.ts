import { defineGuide } from '../../lib/page-types';
import { dec, eur, A, C } from './_f';
import { notaAcceso, excelencia } from '../../lib/engine/beca';

/* Nota media: convocatoria art. 22 (reglas de cálculo, 2,5 por no presentado, baremo sin nota numérica, ponderación por créditos),
   art. 8 (excelencia, coeficientes), art. 24.1 (0,6 NMB + 0,4 PAU). */
const acc = notaAcceso(8.4, 7.1);
const ponderada = (6 * 9 + 6 * 7 + 12 * 6 + 6 * A.notaNoPresentado) / 30;
const exc = (l: 'es' | 'en') => C.excelencia.map((t, i, a) => [i < a.length - 1 ? `${dec(t.desde, l)} ${l === 'es' ? 'a' : 'to'} ${dec(a[i + 1].desde - 0.01, l)}` : `${dec(t.desde, l)}+`, eur(t.importe, l)]);

export default defineGuide({
  id: 'nota', group: 'estudios', order: 7,
  tool: 'nota',
  related: ['requisitos', 'cuantias', 'variable', 'master'],
  sources: ['convocatoria', 'rd179'],
  es: {
    slug: 'nota-media',
    nav: 'Nota media y premio por buena nota', card: 'La nota que mira la beca, cómo se hace la media y el premio por buena nota que da',
    title: 'Nota media beca MEC 2026-2027: acceso, media y excelencia',
    description: 'Nota media para la beca 2026-2027: 0,6 bachillerato + 0,4 PAU en primero, media ponderada por créditos, 2,5 por no presentado y excelencia de 50 a 125 €.',
    h1: 'Nota media para la beca: acceso, ponderación y excelencia',
    intro: 'Elige el curso. En primero, escribe la nota media de bachillerato y la de la PAU (selectividad); de segundo en adelante, la nota media del curso pasado: verás la nota que mira la beca y si da premio por buena nota.',
    resume: `La beca mira la nota de tres maneras: para saber si hay beca, para dar el premio por buena nota (excelencia) y para repartir el extra de final de curso. En primero de carrera cuenta la nota de acceso: ${dec(A.notaAcceso.bachillerato, 'es', 1)} por la media de bachillerato más ${dec(A.notaAcceso.pau, 'es', 1)} por la nota de la PAU (selectividad), sin la parte para subir nota. Con un 7 en las dos salen ${dec(notaAcceso(7, 7), 'es', 0)} puntos, más que el ${dec(A.notaMinima, 'es', 0)} que se pide. De segundo en adelante cuenta la media del curso anterior, con los suspensos, y un no presentado vale ${dec(A.notaNoPresentado, 'es', 1)} puntos. Para el premio por buena nota, desde segundo, la media se multiplica por un número que depende del tipo de carrera: es más alto en ingeniería, en ciencias y en salud. El premio empieza en ${eur(C.excelencia[0].importe, 'es')} con un ${dec(C.excelencia[0].desde, 'es', 0)} y llega a ${eur(C.excelencia[C.excelencia.length - 1].importe, 'es')} con un ${dec(C.excelencia[C.excelencia.length - 1].desde, 'es', 1)}.`,
    faqs: [
      { q: '¿Cuenta la fase específica de la PAU para la nota de la beca?', a: 'No. De la PAU (selectividad) solo cuentan las materias comunes y las obligatorias de segundo de bachillerato. Las asignaturas que se hacen para subir nota y entrar en una carrera con nota de corte alta no cuentan para la beca. Por eso la nota de la beca suele ser más baja que la nota de admisión.' },
      { q: '¿Cómo cuenta un no presentado en la media de la beca?', a: `Como ${dec(A.notaNoPresentado, 'es', 1)} puntos, igual que un suspenso sin nota. Presentarse a un examen y sacar un 4 deja mejor media que no presentarse. Las asignaturas convalidadas no entran en la media, y las prácticas y el trabajo de fin de grado cuentan con sus créditos, como cualquier otra asignatura.` },
      { q: '¿Qué nota se usa si mi expediente solo tiene calificaciones en letras?', a: 'Hay una equivalencia para cada asignatura: matrícula de honor 10, sobresaliente 9, notable 7,5, aprobado o apto 5,5, y suspenso o no presentado 2,5. Para títulos de otros países, la comisión que revisa las becas pasa cada nota a la escala española antes de hacer la media.' },
    ],
    body: (h) => `<h2>El premio por buena nota</h2>
<p>Se da con el curso entero matriculado, hasta el umbral 3 de renta. Desde segundo, la nota se multiplica por un número según la carrera: un 7,5 en ingeniería se convierte en ${h.n(7.5 * C.coefExcelencia.ingenieria, 2)} y ya da ${h.eur(excelencia(7.5 * C.coefExcelencia.ingenieria))}.</p>
<p>La tabla del premio según la nota está en la calculadora de arriba.</p>
<h2>Qué nota cuenta en cada estudio</h2>
<p>En primero de FP de grado superior cuenta la nota de bachillerato, de la prueba de acceso o del ciclo de grado medio.</p>
<p>En bachillerato y en FP de grado medio, la de cuarto de la ESO (la secundaria obligatoria) o la del ciclo anterior.</p>
<p>En primero de máster, la media de la carrera que da acceso; en segundo, la de primero.</p>
<h2>La nota media de la beca, ponderada por créditos</h2>
<p>De segundo en adelante, cada asignatura pesa según sus créditos, es decir, según su tamaño.</p>
<p>Ejemplo con 30 créditos y un no presentado, que cuenta como ${h.n(A.notaNoPresentado, 1)}: la media sale ${h.n(ponderada, 2)}, no la media simple de las cuatro notas.</p>
${h.table(['Asignatura', 'Créditos', 'Nota', 'Puntos'], [['A', 6, h.n(9, 2), h.n(54, 2)], ['B', 6, h.n(7, 2), h.n(42, 2)], ['C', 12, h.n(6, 2), h.n(72, 2)], [`D (no presentado: cuenta ${h.n(A.notaNoPresentado, 1)})`, 6, h.n(A.notaNoPresentado, 2), h.n(6 * A.notaNoPresentado, 2)], ['Total', 30, h.n(ponderada, 2), h.n(ponderada * 30, 2)]], 'Media ponderada por créditos', ['l', 'r', 'r', 'r'])}
<p>¿Ya está en segundo o más? Lo que hay que aprobar para seguir con beca está en ${h.a('requisitos', 'requisitos académicos')}.</p>`,
  },

  en: {
    slug: 'grade-average',
    nav: 'Grade average and excellence', card: 'The entry grade for the grant, the credit-weighted average and the excellence amount it brings',
    title: 'Beca MEC grade average 2026-2027: entry grade, excellence',
    description: 'Grade average for Spain\'s 2026-2027 study grant: 0.6 upper secondary + 0.4 entrance exam in year 1, credit-weighted average, 2.5 for no-shows, excellence.',
    h1: 'Grade average for the beca MEC (Ministry of Education)',
    intro: 'Pick your year. In year one, enter your upper secondary average and your university entrance exam (PAU) grade; from year two, last year\'s average and your field: you get the grade average the beca MEC looks at and the excellence amount.',
    resume: `The grant uses your grade in three ways: to check the academic requirement, to award the excellence amount and to share out the variable amount. In the first year of a degree the grade is the university entry grade, which the call works out as ${dec(A.notaAcceso.bachillerato, 'en')} times the upper secondary average plus ${dec(A.notaAcceso.pau, 'en')} times the entrance exam (PAU) grade, counting only core and compulsory track subjects: an ${dec(8.4, 'en')} upper secondary average and a ${dec(7.1, 'en')} exam give ${dec(acc, 'en')}. From year two it is last year's average, weighted by credits and counting fails and no-shows, which score ${dec(A.notaNoPresentado, 'en')} points (article 22). For excellence, from the second year of a degree and in the first year of a master's, the grade is multiplied by ${dec(C.coefExcelencia.ingenieria, 'en')} in engineering and architecture, ${dec(C.coefExcelencia.ciencias, 'en')} in sciences and ${dec(C.coefExcelencia.salud, 'en')} in health sciences. From ${dec(C.excelencia[0].desde, 'en')} you get ${eur(C.excelencia[0].importe, 'en')}; from ${dec(C.excelencia[C.excelencia.length - 1].desde, 'en')}, ${eur(C.excelencia[C.excelencia.length - 1].importe, 'en')}.`,
    faqs: [
      { q: 'Does the optional part of the entrance exam count for the grant?', a: 'No. The call only takes the core and compulsory track subjects of the second year of upper secondary from the entrance exam. The extra subjects you sit to raise your admission score for a competitive degree do not count for the grant. That is why your grant grade is usually lower than your admission score.' },
      { q: 'How does a no-show count in the grant average?', a: `As ${dec(A.notaNoPresentado, 'en')} points, the same as a fail without a numerical grade, under article 22.1 of the call. Sitting an exam and scoring 4 leaves you a better average than not turning up. Recognised or transferred subjects are left out, while work placements and the final project count with their credits.` },
      { q: 'Which grade is used if my transcript only has letter grades?', a: 'Article 22.2 gives an equivalence when there is no numerical grade: distinction with honours 10, outstanding 9, very good 7.5, pass 5.5 and fail or no-show 2.5. It is applied subject by subject. For foreign qualifications, the selection committee converts each grade to the Spanish scale.' },
    ],
    body: (h) => `<h2>The beca grade average, weighted by credits</h2>
<p>${h.src('convocatoria', 'Article 22 of the call')} weights each subject by its credits: multiply each grade by the subject's credits, add up and divide by the total countable credits. Example with 30 credits: a 9 in a 6-credit subject, a 7 in another of 6, a 6 in one of 12 and a no-show in one of 6, which counts as ${h.n(A.notaNoPresentado, 1)} under the call. The average is ${h.n(ponderada, 2)}, not the simple mean of the four grades.</p>
${h.table(['Subject', 'Credits', 'Grade', 'Points'], [['A', 6, h.n(9, 2), h.n(54, 2)], ['B', 6, h.n(7, 2), h.n(42, 2)], ['C', 12, h.n(6, 2), h.n(72, 2)], [`D (no-show: counts ${h.n(A.notaNoPresentado, 1)})`, 6, h.n(A.notaNoPresentado, 2), h.n(6 * A.notaNoPresentado, 2)], ['Total', 30, h.n(ponderada, 2), h.n(ponderada * 30, 2)]], 'Credit-weighted average', ['l', 'r', 'r', 'r'])}
<h2>The excellence amount</h2>
<p>It is awarded with full enrolment up to threshold 3. The amounts come from ${h.src('rd179', 'Royal Decree 179/2026')}. The field coefficient applies from the second year of a degree and in the first year of a master's: a 7.5 in engineering becomes ${h.n(7.5 * C.coefExcelencia.ingenieria, 3)} and earns ${h.eur(excelencia(7.5 * C.coefExcelencia.ingenieria))}; the same 7.5 in Law earns nothing.</p>
${h.table(['Grade', 'Amount'], exc('en'), 'Academic excellence amount', ['l', 'r'])}
<h2>Each course, its grade</h2>
<p>In higher VET, the first year uses the grade from the second year of upper secondary, the access test or the intermediate VET course; in upper secondary and intermediate VET, the last year of compulsory school or the previous course. In the first year of a master's, the average of the qualifying studies counts; in the second, that of the first year. For the minimum requirement, the share of credits passed matters more than the grade: see the ${h.a('requisitos', 'academic requirements')} page. Your grade also weighs in the share-out of the ${h.a('variable', 'variable amount')}, but there it is compared with the top ten per cent of your field.</p>
<h3>Three uses of the same grade</h3>
<p>Your grade counts three times, under different rules. For the minimum requirement, ${h.n(A.notaMinima, 2)} is enough in first years. For excellence, the band matters, from ${h.n(C.excelencia[0].desde, 2)}, with the field coefficient where it applies. And in the variable-amount formula your average is divided by the grade of the top ten per cent of students in your field, fails included, so every tenth of a point adds something even without changing band. That is why sitting every exam pays: a no-show drags the average down to ${h.n(A.notaNoPresentado, 2)} for that subject.</p>`,
  },
});
