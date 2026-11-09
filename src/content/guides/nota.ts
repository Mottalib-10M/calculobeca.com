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
    nav: 'Nota media y excelencia', card: 'La nota de acceso para la beca, la media ponderada por créditos y la cuantía de excelencia que da',
    title: 'Nota media beca MEC 2026-2027: acceso, media y excelencia',
    description: 'Nota media para la beca 2026-2027: 0,6 bachillerato + 0,4 PAU en primero, media ponderada por créditos, 2,5 por no presentado y excelencia de 50 a 125 €.',
    h1: 'Nota media para la beca: acceso, ponderación y excelencia',
    intro: 'Elige tu curso. En primero, escribe tu media de bachillerato y tu nota de la PAU (la selectividad); de segundo en adelante, tu media del curso pasado y tu rama: obtienes la nota que mira la beca y la cuantía de excelencia.',
    resume: `La beca usa tu nota de tres maneras: para saber si cumples el requisito académico, para conceder la cuantía de excelencia y para repartir la cuantía variable. En primero de grado la nota es la de acceso a la universidad, que la convocatoria calcula como ${dec(A.notaAcceso.bachillerato, 'es')} por la nota media de bachillerato más ${dec(A.notaAcceso.pau, 'es')} por la nota de la PAU, contando solo las materias comunes y las específicas obligatorias: con un ${dec(8.4, 'es')} de bachillerato y un ${dec(7.1, 'es')} de PAU salen ${dec(acc, 'es')}. De segundo en adelante es la media del curso anterior, ponderada por créditos y contando los suspensos y los no presentados, que valen ${dec(A.notaNoPresentado, 'es')} puntos (artículo 22). Para la excelencia, desde segundo de grado y en primero de máster, la nota se multiplica por ${dec(C.coefExcelencia.ingenieria, 'es')} en ingeniería y arquitectura, ${dec(C.coefExcelencia.ciencias, 'es')} en ciencias y ${dec(C.coefExcelencia.salud, 'es')} en ciencias de la salud. Con un ${dec(C.excelencia[0].desde, 'es')} empiezan los ${eur(C.excelencia[0].importe, 'es')}; con un ${dec(C.excelencia[C.excelencia.length - 1].desde, 'es')}, ${eur(C.excelencia[C.excelencia.length - 1].importe, 'es')}.`,
    faqs: [
      { q: '¿Cuenta la fase específica de la PAU para la nota de la beca?', a: 'No. La convocatoria solo toma de la PAU las materias comunes y las específicas obligatorias de modalidad de segundo de bachillerato. Las asignaturas que sumas para subir nota y entrar en una carrera con nota de corte alta no cuentan para la beca. Por eso tu nota de beca suele ser más baja que tu nota de admisión.' },
      { q: '¿Cómo cuenta un no presentado en la media de la beca?', a: `Como ${dec(A.notaNoPresentado, 'es')} puntos, igual que un suspenso sin nota numérica, según el artículo 22.1 de la convocatoria. Presentarse a un examen y sacar un 4 te deja mejor media que no presentarte. Las asignaturas convalidadas o reconocidas no entran en la media, y las prácticas y el trabajo de fin de grado cuentan con sus créditos.` },
      { q: '¿Qué nota se usa si mi expediente solo tiene calificaciones en letras?', a: 'El artículo 22.2 da una equivalencia cuando no hay nota numérica: matrícula de honor 10, sobresaliente 9, notable 7,5, aprobado o apto 5,5 y suspenso o no presentado 2,5. Se aplica asignatura por asignatura. Para títulos extranjeros, la comisión de selección convierte cada nota a la escala española.' },
    ],
    body: (h) => `<h2>La media ponderada por créditos</h2>
<p>El ${h.src('convocatoria', 'artículo 22 de la convocatoria')} pondera cada asignatura por sus créditos: se multiplica cada nota por los créditos de la asignatura, se suma y se divide entre el total de créditos computables. Ejemplo con 30 créditos: un 9 en una asignatura de 6 créditos, un 7 en otra de 6, un 6 en una de 12 y un no presentado en una de 6, que cuenta como ${h.n(A.notaNoPresentado, 1)} según la convocatoria. La media es ${h.n(ponderada, 2)}, no la media simple de las cuatro notas.</p>
${h.table(['Asignatura', 'Créditos', 'Nota', 'Puntos'], [['A', 6, h.n(9, 2), h.n(54, 2)], ['B', 6, h.n(7, 2), h.n(42, 2)], ['C', 12, h.n(6, 2), h.n(72, 2)], [`D (no presentado: cuenta ${h.n(A.notaNoPresentado, 1)})`, 6, h.n(A.notaNoPresentado, 2), h.n(6 * A.notaNoPresentado, 2)], ['Total', 30, h.n(ponderada, 2), h.n(ponderada * 30, 2)]], 'Media ponderada por créditos', ['l', 'r', 'r', 'r'])}
${h.mini('requisitos', { p: ['rama', 'mat', 'apr'], t: 'De segundo en adelante: ¿apruebas lo suficiente?' })}
<h2>La cuantía de excelencia</h2>
<p>Se concede con matrícula completa hasta el umbral 3. La tabla de importes es la del ${h.src('rd179', 'Real Decreto 179/2026')}. El coeficiente de rama se aplica desde segundo de grado y en primero de máster: un 7,5 en ingeniería se convierte en ${h.n(7.5 * C.coefExcelencia.ingenieria, 3)} y da ${h.eur(excelencia(7.5 * C.coefExcelencia.ingenieria))}; el mismo 7,5 en Derecho no da nada.</p>
${h.table(['Nota', 'Cuantía'], exc('es'), 'Cuantía ligada a la excelencia', ['l', 'r'])}
<h2>Cada estudio, su nota</h2>
<p>En FP de grado superior, primer curso usa la nota de segundo de bachillerato, de la prueba de acceso o del ciclo de grado medio; en bachillerato y FP de grado medio, la de cuarto de la ESO o la del ciclo anterior. En primero de máster cuenta la media de los estudios que dan acceso; en segundo, la de primero. Para el requisito mínimo, más que la nota importa el porcentaje de créditos aprobados: lo explica la página de ${h.a('requisitos', 'requisitos académicos')}. La nota también pesa en el reparto de la ${h.a('variable', 'cuantía variable')}, pero allí se compara con la nota del diez por ciento de mejores estudiantes de tu rama.</p>
<h2>Tres usos de la misma nota</h2>
<p>La nota cuenta tres veces y con reglas distintas. Para el requisito mínimo basta un ${h.n(A.notaMinima, 2)} en los primeros cursos. Para la excelencia se mira el tramo, desde ${h.n(C.excelencia[0].desde, 2)}, con el coeficiente de rama cuando corresponde. Y en la fórmula de la cuantía variable tu media entra dividida por la nota del diez por ciento de mejores estudiantes de tu rama, contando los suspensos, de modo que cada décima suma algo aunque no cambies de tramo.</p>`,
  },
  en: {
    slug: 'grade-average',
    nav: 'Grade average and excellence', card: 'The entry grade for the grant, the credit-weighted average and the excellence amount it brings',
    title: 'Beca MEC grade average 2026-2027: entry grade, excellence',
    description: 'Grade average for Spain\'s 2026-2027 study grant: 0.6 upper secondary + 0.4 entrance exam in year 1, credit-weighted average, 2.5 for no-shows, excellence.',
    h1: 'Grade average for the grant: entry grade, weighting, excellence',
    intro: 'Pick your year. In year one, enter your upper secondary average and your university entrance exam (PAU) grade; from year two, last year\'s average and your field: you get the grade the grant looks at and the excellence amount.',
    resume: `The grant uses your grade in three ways: to check the academic requirement, to award the excellence amount and to share out the variable amount. In the first year of a degree the grade is the university entry grade, which the call works out as ${dec(A.notaAcceso.bachillerato, 'en')} times the upper secondary average plus ${dec(A.notaAcceso.pau, 'en')} times the entrance exam (PAU) grade, counting only core and compulsory track subjects: an ${dec(8.4, 'en')} upper secondary average and a ${dec(7.1, 'en')} exam give ${dec(acc, 'en')}. From year two it is last year's average, weighted by credits and counting fails and no-shows, which score ${dec(A.notaNoPresentado, 'en')} points (article 22). For excellence, from the second year of a degree and in the first year of a master's, the grade is multiplied by ${dec(C.coefExcelencia.ingenieria, 'en')} in engineering and architecture, ${dec(C.coefExcelencia.ciencias, 'en')} in sciences and ${dec(C.coefExcelencia.salud, 'en')} in health sciences. From ${dec(C.excelencia[0].desde, 'en')} you get ${eur(C.excelencia[0].importe, 'en')}; from ${dec(C.excelencia[C.excelencia.length - 1].desde, 'en')}, ${eur(C.excelencia[C.excelencia.length - 1].importe, 'en')}.`,
    faqs: [
      { q: 'Does the optional part of the entrance exam count for the grant?', a: 'No. The call only takes the core and compulsory track subjects of the second year of upper secondary from the entrance exam. The extra subjects you sit to raise your admission score for a competitive degree do not count for the grant. That is why your grant grade is usually lower than your admission score.' },
      { q: 'How does a no-show count in the grant average?', a: `As ${dec(A.notaNoPresentado, 'en')} points, the same as a fail without a numerical grade, under article 22.1 of the call. Sitting an exam and scoring 4 leaves you a better average than not turning up. Recognised or transferred subjects are left out, while work placements and the final project count with their credits.` },
      { q: 'Which grade is used if my transcript only has letter grades?', a: 'Article 22.2 gives an equivalence when there is no numerical grade: distinction with honours 10, outstanding 9, very good 7.5, pass 5.5 and fail or no-show 2.5. It is applied subject by subject. For foreign qualifications, the selection committee converts each grade to the Spanish scale.' },
    ],
    body: (h) => `<h2>The credit-weighted average</h2>
<p>${h.src('convocatoria', 'Article 22 of the call')} weights each subject by its credits: multiply each grade by the subject's credits, add up and divide by the total countable credits. Example with 30 credits: a 9 in a 6-credit subject, a 7 in another of 6, a 6 in one of 12 and a no-show in one of 6, which counts as ${h.n(A.notaNoPresentado, 1)} under the call. The average is ${h.n(ponderada, 2)}, not the simple mean of the four grades.</p>
${h.table(['Subject', 'Credits', 'Grade', 'Points'], [['A', 6, h.n(9, 2), h.n(54, 2)], ['B', 6, h.n(7, 2), h.n(42, 2)], ['C', 12, h.n(6, 2), h.n(72, 2)], [`D (no-show: counts ${h.n(A.notaNoPresentado, 1)})`, 6, h.n(A.notaNoPresentado, 2), h.n(6 * A.notaNoPresentado, 2)], ['Total', 30, h.n(ponderada, 2), h.n(ponderada * 30, 2)]], 'Credit-weighted average', ['l', 'r', 'r', 'r'])}
${h.mini('requisitos', { p: ['rama', 'mat', 'apr'], t: 'From year two: are you passing enough?' })}
<h2>The excellence amount</h2>
<p>It is awarded with full enrolment up to threshold 3. The amounts come from ${h.src('rd179', 'Royal Decree 179/2026')}. The field coefficient applies from the second year of a degree and in the first year of a master's: a 7.5 in engineering becomes ${h.n(7.5 * C.coefExcelencia.ingenieria, 3)} and earns ${h.eur(excelencia(7.5 * C.coefExcelencia.ingenieria))}; the same 7.5 in Law earns nothing.</p>
${h.table(['Grade', 'Amount'], exc('en'), 'Academic excellence amount', ['l', 'r'])}
<h2>Each course, its grade</h2>
<p>In higher VET, the first year uses the grade from the second year of upper secondary, the access test or the intermediate VET course; in upper secondary and intermediate VET, the last year of compulsory school or the previous course. In the first year of a master's, the average of the qualifying studies counts; in the second, that of the first year. For the minimum requirement, the share of credits passed matters more than the grade: see the ${h.a('requisitos', 'academic requirements')} page. Your grade also weighs in the share-out of the ${h.a('variable', 'variable amount')}, but there it is compared with the top ten per cent of your field.</p>
<h2>Three uses of the same grade</h2>
<p>Your grade counts three times, under different rules. For the minimum requirement, ${h.n(A.notaMinima, 2)} is enough in first years. For excellence, the band matters, from ${h.n(C.excelencia[0].desde, 2)}, with the field coefficient where it applies. And in the variable-amount formula your average is divided by the grade of the top ten per cent of students in your field, fails included, so every tenth of a point adds something even without changing band. That is why sitting every exam pays: a no-show drags the average down to ${h.n(A.notaNoPresentado, 2)} for that subject.</p>`,
  },
});
