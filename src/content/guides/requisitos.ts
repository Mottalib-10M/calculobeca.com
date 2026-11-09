import { defineGuide } from '../../lib/page-types';
import { dec, A, CV, day } from './_f';
import { porcentajeExigido } from '../../lib/engine/beca';

/* Requisitos académicos: convocatoria arts. 21-26 (grado), 28-29 (máster), 33-36 (no universitarios). Duración: art. 25. */
const R = A.porcentajeRama;
const pc = (x: number, l: 'es' | 'en') => (l === 'es' ? `${dec(x, l, 1)} %` : `${dec(x, l, 1)}%`);
const ramas = (l: 'es' | 'en') => {
  const n: Record<string, [string, string]> = { artes: ['Artes y Humanidades', 'Arts and Humanities'], ciencias: ['Ciencias', 'Sciences'], sociales: ['Ciencias Sociales y Jurídicas', 'Social Sciences and Law'], salud: ['Ciencias de la Salud', 'Health Sciences'], ingenieria: ['Ingeniería y Arquitectura', 'Engineering and Architecture'] };
  return (Object.keys(R) as Array<keyof typeof R>).map((k) => [n[k][l === 'es' ? 0 : 1], pc(R[k], l), pc(porcentajeExigido(k as 'artes', 72), l)]);
};

export default defineGuide({
  id: 'requisitos', group: 'estudios', order: 6,
  tool: 'requisitos',
  related: ['nota', 'reintegro', 'master', 'bachillerato'],
  sources: ['convocatoria', 'rd1721'],
  es: {
    slug: 'requisitos-academicos',
    nav: 'Requisitos académicos', card: 'Qué porcentaje de créditos hay que aprobar en cada rama, qué nota piden en primero y en máster',
    title: 'Requisitos becas MEC 2026-2027: créditos aprobados y nota',
    description: 'Requisitos de la beca 2026-2027: nota de 5 en primero, porcentaje de créditos aprobados por rama (65, 80 o 90 %) y fórmula del rendimiento excepcional.',
    h1: 'Requisitos académicos de la beca general 2026-2027',
    intro: 'Elige tu caso, tu rama y los créditos que te matriculaste y aprobaste: la calculadora dice si cumples el requisito académico de la beca y qué porcentaje te exigen.',
    resume: `Además de la renta y el patrimonio, la beca general pide un rendimiento académico mínimo, que fija la convocatoria del ${day(CV.resolucion, 'es')} en sus artículos 21 a 36. En primero de grado se exige una nota de acceso de ${dec(A.notaMinima, 'es')}, calculada como ${dec(A.notaAcceso.bachillerato, 'es')} por la media de bachillerato más ${dec(A.notaAcceso.pau, 'es')} por la nota de la PAU. De segundo en adelante cuenta el porcentaje de créditos aprobados sobre los matriculados el curso anterior: el ${pc(R.artes, 'es')} en Artes y Humanidades y en Ciencias Sociales y Jurídicas, el ${pc(R.salud, 'es')} en Ciencias de la Salud y el ${pc(R.ciencias, 'es')} en Ciencias y en Ingeniería y Arquitectura. Quien se matricula de más de 60 créditos tiene una rebaja por rendimiento excepcional. En máster, primer curso pide un ${dec(A.notaMinima, 'es')} en los estudios de acceso y segundo curso exige haber aprobado todo. En bachillerato y FP, de segundo en adelante, hay que aprobar todas las asignaturas menos una o el ${pc(A.noUnivModulosHoras, 'es')} de las horas. Los créditos convalidados no cuentan.`,
    faqs: [
      { q: '¿Cuentan los créditos de la convocatoria extraordinaria para la beca?', a: 'Sí. El porcentaje de créditos aprobados se mide sobre todo el curso anterior, incluida la convocatoria extraordinaria de junio o julio. Si en la solicitud aún no tenías las notas definitivas, la universidad envía los datos académicos al Ministerio más tarde, como muy tarde el 4 de diciembre de 2026, y es entonces cuando se comprueba el requisito.' },
      { q: '¿Qué pasa si cambio de carrera?', a: 'Si los estudios abandonados los cursaste con beca, no puedes tener beca en los nuevos hasta que te hayas matriculado de al menos treinta créditos más de los que cursaste becado en los anteriores (artículo 25.7). Si nunca tuviste beca, se mira el rendimiento del último curso realizado, aunque fuera en otra carrera.' },
      { q: '¿Cuántos años puedo tener beca en un grado?', a: 'Los años del plan de estudios más uno, o más dos en Ingeniería y Arquitectura (artículo 25). En ese último año adicional solo se cobran la matrícula, la variable mínima y la mitad de las demás cuantías. Con matrícula parcial o estudios no presenciales hay un año más, solo con matrícula. Las personas con discapacidad tienen años añadidos.' },
      { q: '¿Cómo se calcula el rendimiento excepcional del artículo 26?', a: `Se calcula cuánto superan tus créditos matriculados los 60 obligatorios, en porcentaje (Y), y al porcentaje de tu rama se le resta Y dividido por 10. Con 72 créditos, Y vale 20 y en Ingeniería te piden el ${pc(porcentajeExigido('ingenieria', 72), 'es')} en lugar del ${pc(R.ingenieria, 'es')}. La calculadora lo aplica si escribes más de 60 créditos matriculados.` },
    ],
    body: (h) => `<h2>Grado: el porcentaje de cada rama</h2>
<p>Para segundo y posteriores cursos de grado, el ${h.src('convocatoria', 'artículo 24 de la convocatoria')} pide haber aprobado un porcentaje de los créditos matriculados en los últimos estudios cursados. El artículo 26 lo rebaja a quien se matricula de más de 60: la tercera columna muestra el caso de 72 créditos.</p>
${h.table(['Rama', 'Con 60 créditos', 'Con 72 créditos'], ramas('es'), 'Porcentaje de créditos a aprobar, convocatoria 2026-2027', ['l', 'r', 'r'])}
<p>Ejemplo: en Derecho, de 60 créditos matriculados hay que aprobar ${h.n(60 * R.sociales / 100)}. Con ${h.n(60 * R.sociales / 100 - 6)} aprobados no se cumple el requisito y la beca se deniega por motivo académico, aunque la renta esté en el umbral 1. Quien estuvo con matrícula parcial y supera el porcentaje solo puede obtener la beca de matrícula.</p>
${h.mini('requisitos', { p: ['rama', 'mat', 'apr'], t: '¿Cumples el porcentaje?' })}
<h2>Requisitos de la beca en primer curso y máster</h2>
<p>En primero de grado no hay créditos anteriores: se mira la nota de acceso, que debe llegar a ${h.n(A.notaMinima, 2)}. Por la vía del bachillerato es ${h.n(A.notaAcceso.bachillerato, 1)} por la media de bachillerato más ${h.n(A.notaAcceso.pau, 1)} por la PAU, contando solo las materias comunes y las específicas obligatorias de modalidad. Por otras vías, la nota de la prueba o enseñanza que da acceso. La ${h.a('nota', 'calculadora de nota media')} hace la cuenta. En máster, el primer curso pide un ${h.n(A.notaMinima, 2)} de media en los estudios que dan acceso, multiplicado por ${h.n(A.masterCoefTecnicas, 2)} si vienen de enseñanzas técnicas, y el segundo curso exige todos los créditos de primero aprobados: los detalles están en ${h.a('master', 'la beca de máster')}.</p>
<h2>Bachillerato y formación profesional</h2>
<p>En primero de bachillerato se pide un ${h.n(A.notaMinima, 2)} en cuarto de la ESO y no repetir; en primero de FP de grado superior, un ${h.n(A.notaMinima, 2)} en segundo de bachillerato o en la prueba de acceso. De segundo en adelante hay que aprobar todo menos una asignatura, o el ${pc(A.noUnivModulosHoras, 'es')} de las horas si el ciclo va por módulos. Quien repite curso no tiene beca, salvo que tenga aprobados todos los cursos anteriores. La página de ${h.a('bachillerato', 'bachillerato y FP')} lo desarrolla.</p>
<p>Cumplir el requisito para obtener la beca no basta para conservarla: al acabar el curso hay que aprobar un mínimo, o se pide el ${h.a('reintegro', 'reintegro de la beca')}.</p>`,
  },
  en: {
    slug: 'academic-requirements',
    nav: 'Academic requirements', card: 'What share of credits you must pass in each field, and what grade is needed in year 1 and for a master\'s',
    title: 'Beca MEC academic requirements 2026-2027: credits passed',
    description: 'Academic rules for Spain\'s 2026-2027 study grant: 5 out of 10 in year 1, share of credits passed by field (65, 80 or 90%) and the exceptional performance rule.',
    h1: 'Beca MEC (Ministry of Education): academic requirements',
    intro: 'Pick your case, your field and the credits you enrolled in and passed: the calculator says whether you meet the beca MEC academic requirement and which percentage applies to you.',
    resume: `Besides income and wealth, Spain's general study grant requires a minimum academic performance, set by the call of ${day(CV.resolucion, 'en')} in its articles 21 to 36. In the first year of a degree you need a university entry grade of ${dec(A.notaMinima, 'en')}, worked out as ${dec(A.notaAcceso.bachillerato, 'en')} times the upper secondary average plus ${dec(A.notaAcceso.pau, 'en')} times the entrance exam grade. From the second year on, what counts is the share of credits passed out of those enrolled the year before: ${pc(R.artes, 'en')} in Arts and Humanities and in Social Sciences and Law, ${pc(R.salud, 'en')} in Health Sciences and ${pc(R.ciencias, 'en')} in Sciences and in Engineering and Architecture. Students enrolling in more than 60 credits get a reduction for exceptional performance. For a master's, the first year needs ${dec(A.notaMinima, 'en')} in the qualifying studies and the second year requires everything passed. In upper secondary and vocational training, from year two you must pass all subjects but one or ${pc(A.noUnivModulosHoras, 'en')} of the hours. Recognised credits do not count.`,
    faqs: [
      { q: 'Do resit exam credits count for the grant?', a: 'Yes. The share of credits passed is measured over the whole previous year, including the June or July resits. If you did not have final grades when you applied, the university sends the academic data to the Ministry later, by 4 December 2026 at the latest, and the requirement is checked then.' },
      { q: 'What happens if I switch degrees?', a: 'If you studied the abandoned degree on a grant, you cannot get a grant for the new one until you have enrolled in at least thirty more credits than you took with a grant in the old one (article 25.7). If you never had a grant, performance in the last year you studied is checked, even if it was another degree.' },
      { q: 'For how many years can I hold a grant on a degree?', a: 'The years of the study plan plus one, or plus two in Engineering and Architecture (article 25). In that extra final year you only get tuition, the minimum variable amount and half of the other amounts. Part-time or fully remote students get one more year, tuition only. Students with a disability get extra years.' },
      { q: 'How is the exceptional performance rule in article 26 worked out?', a: `Take how far your enrolled credits exceed the compulsory 60, as a percentage (Y), and subtract Y divided by 10 from your field's percentage. With 72 credits, Y is 20, so Engineering requires ${pc(porcentajeExigido('ingenieria', 72), 'en')} instead of ${pc(R.ingenieria, 'en')}. The calculator applies it when you enter more than 60 credits enrolled.` },
    ],
    body: (h) => `<h2>Degrees: each field's percentage</h2>
<p>For the second and later years of a degree, ${h.src('convocatoria', 'article 24 of the call')} requires a share of the credits enrolled in your last studies to have been passed. Article 26 lowers it for anyone enrolled in more than 60: the third column shows the 72-credit case.</p>
${h.table(['Field', 'With 60 credits', 'With 72 credits'], ramas('en'), 'Share of credits to pass, 2026-2027 call', ['l', 'r', 'r'])}
<p>Example: in Law, out of 60 credits enrolled you must pass ${h.n(60 * R.sociales / 100)}. With ${h.n(60 * R.sociales / 100 - 6)} passed, the requirement is not met and the grant is refused on academic grounds, even with income in threshold 1. A student who was part-time and beats the percentage can only get the tuition waiver.</p>
${h.mini('requisitos', { p: ['rama', 'mat', 'apr'], t: 'Do you meet the percentage?' })}
<h2>Beca MEC requirements in first year and master's degrees</h2>
<p>In the first year of a degree there are no previous credits: the entry grade is checked and must reach ${h.n(A.notaMinima, 2)}. Through upper secondary it is ${h.n(A.notaAcceso.bachillerato, 1)} times the upper secondary average plus ${h.n(A.notaAcceso.pau, 1)} times the entrance exam, counting only the core and compulsory track subjects. Through other routes, the grade of the qualifying test or course. The ${h.a('nota', 'grade calculator')} does the sum. For a master's, the first year needs an average of ${h.n(A.notaMinima, 2)} in the qualifying studies, multiplied by ${h.n(A.masterCoefTecnicas, 2)} if they were technical, and the second year requires every first-year credit passed: details under ${h.a('master', 'the master\'s grant')}.</p>
<h2>Upper secondary and vocational training</h2>
<p>The first year of bachillerato needs a ${h.n(A.notaMinima, 2)} in the last year of compulsory secondary school and no repeating; the first year of higher VET needs ${h.n(A.notaMinima, 2)} in the second year of bachillerato or the access test. From year two you must pass all subjects but one, or ${pc(A.noUnivModulosHoras, 'en')} of the hours if the course runs by modules. Repeating a year means no grant unless every earlier year is fully passed. The ${h.a('bachillerato', 'upper secondary and VET')} page goes into it.</p>
<p>Meeting the requirement to get the grant is not enough to keep it: at the end of the year you must pass a minimum, or ${h.a('reintegro', 'repayment')} is demanded.</p>`,
  },
});
