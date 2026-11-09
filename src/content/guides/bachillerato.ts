import { defineGuide } from '../../lib/page-types';
import { eur, U, C, A } from './_f';

/* Bachillerato y FP: RD 179/2026 art. 3; convocatoria arts. 3.1, 6-9, 12.4, 33 (FP superior), 34 (bachillerato y FP medio),
   35 (idiomas), 36 (grado básico y cursos de acceso), 43.2 (reintegro no universitario). */
const u3 = U(3);
const pc = (x: number, l: 'es' | 'en') => (l === 'es' ? `${x} %` : `${x}%`);

export default defineGuide({
  id: 'bachillerato', group: 'estudios', order: 10,
  tool: 'beca', toolArg: { defEstudio: 'bach', curso: 'primero', nota: 6.5 },
  related: ['requisitos', 'residencia', 'reintegro', 'cuantias'],
  sources: ['convocatoria', 'rd179'],
  es: {
    slug: 'bachillerato-fp',
    nav: 'Bachillerato y FP', card: 'Beca básica, cuantía de renta y residencia en bachillerato, FP de grado medio, superior y básico',
    title: 'Beca MEC bachillerato y FP 2026-2027: cuantías y requisitos',
    description: 'Beca 2026-2027 en bachillerato y FP: beca básica de 300 €, 1700 € por renta, 2700 € por residencia, grado básico de 350 € y requisitos de nota y asistencia.',
    h1: 'Beca para bachillerato y formación profesional 2026-2027',
    intro: 'El simulador ya está en bachillerato: cambia a FP de grado medio, superior o básico, escribe la renta y los miembros y mira qué piezas de beca te tocan.',
    resume: `En bachillerato y formación profesional la beca general no incluye matrícula, porque estas enseñanzas son gratuitas en los centros públicos, pero sí dinero. Con matrícula completa y presencial, el artículo 3 del Real Decreto 179/2026 da ${eur(C.renta, 'es')} por renta a quien está en el umbral 1, o la beca básica de ${eur(C.basica, 'es')} a quien está en los umbrales 2 o 3, ya que las dos no se suman. Hasta el umbral 2 se añaden la cuantía de residencia, ${eur(C.residencia, 'es')}, si no hay un centro adecuado cerca de casa, y la cuantía variable. Con un 8 de media se suma la excelencia. En FP de grado básico, idiomas y cursos de acceso solo hay beca básica, ${eur(C.basicaGradoBasico, 'es')} en grado básico, y la variable mínima de ${eur(C.variableMin, 'es')}. Para una familia de tres miembros, el umbral 1 es ${eur(u3.u1, 'es')} y el umbral 3, ${eur(u3.u3, 'es')}. Para conservar la beca hay que asistir al ${pc(A.asistenciaNoUniv, 'es')} de las clases y aprobar al menos la mitad: si no, se devuelve entera.`,
    faqs: [
      { q: '¿Puedo pedir la beca si repito curso de bachillerato?', a: 'No, salvo una excepción. El artículo 34 de la convocatoria no concede beca a quien repite curso total o parcialmente. La excepción es quien repitió en el pasado pero tiene aprobadas todas las materias de los cursos anteriores al que solicita. En FP de grado superior la regla del artículo 33 es la misma.' },
      { q: '¿Hay beca para FP a distancia o para la oferta de adultos?', a: `Sí, pero menor. A distancia, con matrícula completa, se cobran la beca básica, la excelencia si llegas al 8 y la variable mínima. En la oferta parcial o de adultos hace falta matricularse de módulos que sumen ${A.noUnivHorasParcial} horas o más, o de cuatro asignaturas en bachillerato nocturno, y solo hay beca básica y variable mínima. Hay que aprobarlo todo para repetir beca.` },
      { q: '¿Qué pasa si dejo de ir a clase después de cobrar la beca?', a: `El artículo 43.2 considera que no has destinado la beca a su fin si causas baja de hecho, no asistes al ${pc(A.asistenciaNoUniv, 'es')} de las horas lectivas o no apruebas el ${pc(A.reintegroNoUniv, 'es')} de las asignaturas, créditos u horas. En niveles no universitarios se devuelve toda la beca, no solo una parte. Lo calcula la página de reintegro.` },
      { q: '¿Las prácticas de FP en otra isla tienen ayuda extra?', a: `Sí, en Canarias. Los becarios de FP con domicilio en Canarias que deben ir a otra isla solo para las prácticas o un programa de movilidad presencial de al menos un cuatrimestre reciben ${eur(300, 'es')}; ${eur(500, 'es')} si van a la Península y ${eur(800, 'es')} si es a otro país de la Unión Europea (artículo 12.5).` },
    ],
    body: (h) => `<h2>Qué cobra cada estudiante no universitario</h2>
${h.table(['Estudios', 'Umbral 1', 'Umbral 2', 'Umbral 3'], [
  ['Bachillerato, FP medio o superior, presencial completa', `${h.eur(C.renta)} + residencia + variable`, `${h.eur(C.basica)} + residencia + variable`, h.eur(C.basica)],
  ['Los mismos, a distancia', `${h.eur(C.basica)} + ${h.eur(C.variableMin)}`, `${h.eur(C.basica)} + ${h.eur(C.variableMin)}`, h.eur(C.basica)],
  ['FP de grado básico', `${h.eur(C.basicaGradoBasico)} + ${h.eur(C.variableMin)}`, `${h.eur(C.basicaGradoBasico)} + ${h.eur(C.variableMin)}`, h.eur(C.basicaGradoBasico)],
  ['Idiomas, cursos de acceso, matrícula parcial', `${h.eur(C.basica)} + ${h.eur(C.variableMin)}`, `${h.eur(C.basica)} + ${h.eur(C.variableMin)}`, h.eur(C.basica)],
], 'Real Decreto 179/2026, artículo 3; la excelencia se suma con matrícula completa', ['l', 'r', 'r', 'r'])}
<p>La residencia, de ${h.eur(C.residencia)}, exige en estos niveles algo más que en la universidad: el ${h.src('convocatoria', 'artículo 7.3 de la convocatoria')} comprueba si en tu localidad o en otra cercana hay un centro con tus estudios, con plazas y al que puedas ir y volver en el día en transporte público. Si existe, no hay residencia aunque prefieras otro centro.</p>
${h.mini('beca', { p: ['estudio', 'renta', 'miembros'], d: { defEstudio: 'fps', curso: 'primero' }, t: 'Prueba con FP de grado superior' })}
<h2>La nota que piden en primero</h2>
<p>En primero de bachillerato, un ${h.n(A.notaMinima, 2)} de media en cuarto de la ESO, en la prueba de acceso o en el ciclo de grado medio o básico, y no estar repitiendo. En primero de FP de grado medio, solo no repetir. En primero de FP de grado superior, un ${h.n(A.notaMinima, 2)} en segundo de bachillerato, en la prueba o curso de acceso o en el ciclo de grado medio. De segundo en adelante, todas las asignaturas aprobadas menos una, o el ${pc(A.noUnivModulosHoras, 'es')} de las horas si el ciclo va por módulos. Lo comprueba la calculadora de ${h.a('requisitos', 'requisitos académicos')}.</p>
<h2>La excelencia en estos estudios</h2>
<p>Se concede con matrícula completa hasta el umbral 3 y sin coeficientes de rama. En primero de bachillerato y de grado medio, la nota es la de cuarto de la ESO o del ciclo anterior; en primero de grado superior, la de segundo de bachillerato, la prueba o el ciclo medio; de segundo en adelante, la media del curso anterior. Con un 8 son ${h.eur(C.excelencia[0].importe)} y con un 9,5, ${h.eur(C.excelencia[C.excelencia.length - 1].importe)}.</p>
<h2>Cuántos años dura la beca de bachillerato</h2>
<p>Los del plan de estudios. A distancia o en oferta de adultos, un año más. Quien hace un proyecto de fin de estudios que no es una asignatura ordinaria puede obtener beca básica y variable mínima una sola vez, si fue becario el curso anterior. Al terminar, el centro comprueba asistencia y aprobados: si no llegas, toca el ${h.a('reintegro', 'reintegro')}. El ${h.src('rd179', 'Real Decreto 179/2026')} fija todas las cuantías.</p>`,
  },
  en: {
    slug: 'upper-secondary-and-vet',
    nav: 'Upper secondary and VET', card: 'Basic grant, income-linked and residence amounts in bachillerato and intermediate, higher and basic VET',
    title: 'Beca MEC upper secondary and VET 2026-2027: amounts, rules',
    description: 'Spain\'s 2026-2027 study grant for bachillerato and VET: €300 basic grant, €1,700 income-linked, €2,700 residence, €350 basic VET, grade and attendance rules.',
    h1: 'Beca MEC (Ministry of Education) in upper secondary',
    intro: 'The simulator is already set to bachillerato: switch to intermediate, higher or basic VET, enter income and household size and see which beca MEC components apply.',
    resume: `In upper secondary (bachillerato) and vocational training the general grant includes no tuition, because these courses are free at public centres, but it does pay money. With full, in-person enrolment, article 3 of Royal Decree 179/2026 gives ${eur(C.renta, 'en')} income-linked to students in threshold 1, or the basic grant of ${eur(C.basica, 'en')} to those in thresholds 2 or 3, since the two cannot be combined. Up to threshold 2 the residence amount of ${eur(C.residencia, 'en')} is added if there is no suitable centre near home, together with the variable amount. An 8 average adds excellence. In basic VET, language schools and access courses there is only the basic grant, ${eur(C.basicaGradoBasico, 'en')} in basic VET, and the minimum variable amount of ${eur(C.variableMin, 'en')}. For a household of three, threshold 1 is ${eur(u3.u1, 'en')} and threshold 3 is ${eur(u3.u3, 'en')}. To keep the grant you must attend ${pc(A.asistenciaNoUniv, 'en')} of classes and pass at least half: otherwise it is paid back in full.`,
    faqs: [
      { q: 'Can I apply if I am repeating a year of bachillerato?', a: 'No, with one exception. Article 34 of the call gives no grant to anyone repeating a year in whole or in part. The exception is a student who repeated in the past but has passed every subject of the years before the one applied for. In higher VET, article 33 applies the same rule.' },
      { q: 'Is there a grant for distance VET or adult courses?', a: `Yes, but smaller. At a distance, with full enrolment, you get the basic grant, excellence if you reach 8 and the minimum variable amount. On part-time or adult provision you must enrol in modules totalling ${A.noUnivHorasParcial} hours or more, or four subjects in evening bachillerato, and you only get the basic grant and minimum variable amount. Everything must be passed to get it again.` },
      { q: 'What happens if I stop attending after receiving the grant?', a: `Article 43.2 treats the grant as not used for its purpose if you drop out, miss more than ${pc(100 - A.asistenciaNoUniv, 'en')} of teaching hours or fail to pass ${pc(A.reintegroNoUniv, 'en')} of subjects, credits or hours. Below university level the whole grant is paid back, not just part of it. The repayment page works it out.` },
      { q: 'Is there extra help for VET work placements on another island?', a: `Yes, in the Canary Islands. VET grant holders living in the Canaries who must go to another island only for placements or an in-person mobility programme of at least one term get ${eur(300, 'en')}; ${eur(500, 'en')} for the mainland and ${eur(800, 'en')} for another EU country (article 12.5).` },
    ],
    body: (h) => `<h2>What each non-university student gets</h2>
${h.table(['Studies', 'Threshold 1', 'Threshold 2', 'Threshold 3'], [
  ['Bachillerato, intermediate or higher VET, in person, full', `${h.eur(C.renta)} + residence + variable`, `${h.eur(C.basica)} + residence + variable`, h.eur(C.basica)],
  ['The same, at a distance', `${h.eur(C.basica)} + ${h.eur(C.variableMin)}`, `${h.eur(C.basica)} + ${h.eur(C.variableMin)}`, h.eur(C.basica)],
  ['Basic VET', `${h.eur(C.basicaGradoBasico)} + ${h.eur(C.variableMin)}`, `${h.eur(C.basicaGradoBasico)} + ${h.eur(C.variableMin)}`, h.eur(C.basicaGradoBasico)],
  ['Languages, access courses, part-time', `${h.eur(C.basica)} + ${h.eur(C.variableMin)}`, `${h.eur(C.basica)} + ${h.eur(C.variableMin)}`, h.eur(C.basica)],
], 'Royal Decree 179/2026, article 3; excellence is added with full enrolment', ['l', 'r', 'r', 'r'])}
<p>The residence amount of ${h.eur(C.residencia)} asks for more at these levels than at university: ${h.src('convocatoria', 'article 7.3 of the call')} checks whether your town or a nearby one has a centre teaching your course, with places, that you can reach and return from in a day by public transport. If one exists, there is no residence amount even if you prefer another centre.</p>
${h.mini('beca', { p: ['estudio', 'renta', 'miembros'], d: { defEstudio: 'fps', curso: 'primero' }, t: 'Try it with higher VET' })}
<h2>The grade needed in year one</h2>
<p>In the first year of bachillerato, an average of ${h.n(A.notaMinima, 2)} in the last year of compulsory secondary, the access test or the intermediate or basic VET course, and not repeating. In the first year of intermediate VET, only not repeating. In the first year of higher VET, ${h.n(A.notaMinima, 2)} in the second year of bachillerato, the access test or course, or intermediate VET. From year two, every subject passed but one, or ${pc(A.noUnivModulosHoras, 'en')} of the hours if the course runs by modules. The ${h.a('requisitos', 'academic requirements')} calculator checks it.</p>
<h2>Excellence at these levels</h2>
<p>It is given with full enrolment up to threshold 3 and without field coefficients. In the first year of bachillerato and intermediate VET, the grade is from the last year of compulsory school or the previous course; in the first year of higher VET, from the second year of bachillerato, the test or intermediate VET; from year two, last year's average. An 8 gives ${h.eur(C.excelencia[0].importe)} and a 9.5 gives ${h.eur(C.excelencia[C.excelencia.length - 1].importe)}.</p>
<h2>How many years the beca lasts in upper secondary</h2>
<p>The years of the study plan. At a distance or on adult provision, one more. A student doing a final project that is not an ordinary subject can get the basic grant and minimum variable amount once, if they held a grant the year before. At the end, the centre checks attendance and passes: falling short means ${h.a('reintegro', 'repayment')}. ${h.src('rd179', 'Royal Decree 179/2026')} sets every amount.</p>`,
  },
});
