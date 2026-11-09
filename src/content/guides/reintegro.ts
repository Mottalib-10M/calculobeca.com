import { defineGuide } from '../../lib/page-types';
import { eur, A, C } from './_f';

/* Reintegro: convocatoria art. 43.2 (50 % / 40 % en ciencias y técnicas, salvo matrícula; no universitarios: todo, 80 % asistencia,
   50 % aprobado), art. 45 (procedimiento de reintegro e intereses de demora, Ley 38/2003). */
const pc = (x: number, l: 'es' | 'en') => (l === 'es' ? `${x} %` : `${x}%`);
const ejCobrado = C.renta + C.residencia + C.variableMin;

export default defineGuide({
  id: 'reintegro', group: 'tramite', order: 14,
  tool: 'reintegro',
  related: ['requisitos', 'matricula', 'bachillerato', 'denegada'],
  sources: ['convocatoria', 'rd1721'],
  es: {
    slug: 'devolver-la-beca',
    nav: 'Devolver la beca', card: 'Cuándo hay que devolver la beca: el 50 % de créditos aprobados (40 % en ciencias y técnicas) y la asistencia',
    title: 'Devolver la beca MEC 2026-2027: 50 % aprobado y reintegro',
    description: 'Cuándo hay que devolver la beca 2026-2027: aprobar menos del 50 % de créditos (40 % en ciencias y técnicas), abandonar o faltar a clase. Qué se devuelve.',
    h1: 'Devolver la beca: cuándo se pide el reintegro y cuánto',
    intro: 'Indica tus estudios, la rama, los créditos matriculados y aprobados y lo que cobraste: la calculadora dice si tendrías que devolver la beca y cuánto.',
    resume: `Obtener la beca no es el final: al acabar el curso, la universidad o el centro comprueban que la has destinado a estudiar. Según el artículo 43.2 de la convocatoria 2026-2027, un universitario debe aprobar al menos el ${pc(A.reintegroUniv, 'es')} de los créditos matriculados, contando la convocatoria ordinaria y la extraordinaria, o el ${pc(A.reintegroUnivCienciasTecnicas, 'es')} en las ramas de Ciencias y de enseñanzas técnicas. Si no llega, devuelve todos los componentes de la beca salvo la matrícula. Anular la matrícula o abandonar los estudios tiene el mismo efecto. En bachillerato y formación profesional las condiciones son tres: no causar baja, asistir al ${pc(A.asistenciaNoUniv, 'es')} de las horas lectivas y aprobar el ${pc(A.reintegroNoUniv, 'es')} de las asignaturas, créditos u horas; si falla alguna, se devuelve la beca entera. Un universitario de Derecho del umbral 1 que cobró ${eur(ejCobrado, 'es')} y aprueba 27 de 60 créditos tendría que devolver esos ${eur(ejCobrado, 'es')}, pero no el precio de la matrícula. Los créditos convalidados o reconocidos no cuentan para el porcentaje.`,
    faqs: [
      { q: '¿Tengo que devolver la beca si abandono la carrera a mitad de curso?', a: 'Sí. El artículo 43.2 de la convocatoria considera que no has destinado la beca a su finalidad si anulas la matrícula o abandonas de hecho los estudios. Se te pedirá el reintegro de los componentes cobrados. En la universidad, la beca de matrícula no se devuelve por rendimiento, pero anular la matrícula es un supuesto distinto y conviene preguntar en tu universidad.' },
      { q: '¿Cuenta la convocatoria extraordinaria para no devolver la beca?', a: `Sí. El porcentaje se mide con los créditos superados en la convocatoria ordinaria o en la extraordinaria. Si en junio llevas un 40 % aprobado en una carrera de Ciencias Sociales y en julio subes al 50 %, ya no hay reintegro por rendimiento. En Ciencias y en enseñanzas técnicas basta el ${pc(A.reintegroUnivCienciasTecnicas, 'es')}.` },
      { q: '¿Cómo se devuelve el dinero de la beca?', a: 'Tu comunidad o tu universidad abre un expediente de reintegro, que se notifica en la sede electrónica del Ministerio con un SMS de aviso (artículo 45). Puedes alegar antes de la resolución. Si procede, el Ministerio resuelve el reintegro del principal y, cuando corresponde, de los intereses de demora. También puedes devolver de forma voluntaria pidiendo la carta de pago a tu comunidad o universidad.' },
    ],
    body: (h) => `<h2>Las reglas para devolver la beca</h2>
${h.table(['Estudios', 'Mínimo para no devolver', 'Qué se devuelve si no llegas'], [
  ['Grado o máster, ramas sociales, artes y salud', `${pc(A.reintegroUniv, 'es')} de los créditos matriculados`, 'Todo salvo la beca de matrícula'],
  ['Grado o máster, Ciencias y técnicas', `${pc(A.reintegroUnivCienciasTecnicas, 'es')} de los créditos matriculados`, 'Todo salvo la beca de matrícula'],
  ['Bachillerato y FP', `${pc(A.reintegroNoUniv, 'es')} aprobado y ${pc(A.asistenciaNoUniv, 'es')} de asistencia`, 'Toda la beca'],
  ['Curso de acceso o idiomas', 'Curso completo aprobado', 'Toda la beca'],
], 'Convocatoria 2026-2027, artículo 43.2', ['l', 'l', 'l'])}
${h.mini('reintegro', { p: ['rama', 'mat', 'apr'], t: '¿Tendrías que devolver?' })}
<h2>Qué cuenta y qué no</h2>
<p>El porcentaje se calcula sobre los créditos matriculados en el curso de la beca, sin los convalidados, reconocidos o adaptados. Cuentan los aprobados en cualquiera de las dos convocatorias del curso. No es lo mismo que el requisito para obtener la beca el año siguiente, que es más alto: el ${pc(A.porcentajeRama.sociales, 'es')} en Ciencias Sociales y Jurídicas frente al ${pc(A.reintegroUniv, 'es')} del reintegro. Puedes no devolver nada y aun así quedarte sin beca el curso siguiente; la página de ${h.a('requisitos', 'requisitos académicos')} lo explica.</p>
<h2>Si aprobaste poco por una causa grave</h2>
<p>El reintegro es un expediente con alegaciones: según el artículo 45 de la ${h.src('convocatoria', 'convocatoria')}, si a la vista de lo que alegas se constata que la beca procedía, el expediente se archiva. La convocatoria no da una lista de causas que eximan, así que explica tu caso con detalle y acompáñalo de documentos, por ejemplo un informe médico. El marco general lo fija el ${h.src('rd1721', 'Real Decreto 1721/2007')}.</p>
<p>Recuerda que la ${h.a('matricula', 'beca de matrícula')} no se devuelve por bajo rendimiento universitario. En ${h.a('bachillerato', 'bachillerato y FP')} la regla es más dura: se devuelve todo, también si faltas a clase aunque apruebes.</p>
<h2>Dos ejemplos con la misma nota</h2>
<p>Un estudiante de Física con matrícula de 60 créditos aprueba 24, el 40 %: llega al mínimo de su rama y no devuelve nada, aunque no tendrá beca el curso siguiente, porque allí se exige el ${pc(A.porcentajeRama.ciencias, 'es')}. Un estudiante de Derecho con los mismos 24 aprobados se queda en el 40 %, por debajo del ${pc(A.reintegroUniv, 'es')}, y devuelve lo cobrado salvo la matrícula. También provoca reintegro cobrar a la vez otra beca incompatible, según el artículo 55.6.</p>
<h2>Quién lo comprueba</h2>
<p>Al acabar el curso, las comunidades y las universidades sacan la lista de sus becarios y las secretarías de los centros comprueban, con las actas, quién llegó al mínimo. Si no llegaste, recibirás un acuerdo de inicio del expediente en la sede, con un SMS de aviso al teléfono de la solicitud. Desde ahí puedes alegar y aportar pruebas antes de que se resuelva.</p>`,
  },
  en: {
    slug: 'paying-back',
    nav: 'Paying the grant back', card: 'When the grant must be repaid: passing 50% of credits (40% in sciences and technical fields) and attendance',
    title: 'Paying back Spain\'s beca MEC 2026-2027: the 50% rule',
    description: 'When Spain\'s 2026-2027 study grant must be paid back: passing under 50% of credits (40% in sciences and technical fields), dropping out or missing classes.',
    h1: 'Paying back the beca MEC: when repayment is demanded and how much',
    intro: 'Enter your studies, field, credits enrolled and passed and what you received: the calculator says whether you would have to pay back the beca MEC and how much.',
    resume: `Getting the grant is not the end: when the year finishes, the university or school checks that you used it to study. Under article 43.2 of the 2026-2027 call, a university student must pass at least ${pc(A.reintegroUniv, 'en')} of the credits enrolled, counting both regular and resit exams, or ${pc(A.reintegroUnivCienciasTecnicas, 'en')} in Sciences and technical fields. Falling short means paying back every grant component except tuition. Cancelling enrolment or dropping out has the same effect. In upper secondary and vocational training there are three conditions: not dropping out, attending ${pc(A.asistenciaNoUniv, 'en')} of teaching hours and passing ${pc(A.reintegroNoUniv, 'en')} of subjects, credits or hours; if any fails, the whole grant is paid back. A threshold-1 Law student who received ${eur(ejCobrado, 'en')} and passes 27 of 60 credits would have to repay that ${eur(ejCobrado, 'en')}, but not the tuition fee. Recognised or transferred credits do not count towards the percentage.`,
    faqs: [
      { q: 'Do I have to pay the grant back if I drop out mid-year?', a: 'Yes. Article 43.2 of the call treats cancelling enrolment or actually dropping out as not using the grant for its purpose. You will be asked to repay the components you received. At university the tuition waiver is not repaid for poor results, but cancelling enrolment is a different case and you should ask your university.' },
      { q: 'Do resit exams count towards avoiding repayment?', a: `Yes. The percentage is measured on credits passed in either the regular or the resit sitting. If by June you have passed 40% in a Social Sciences degree and by July you reach 50%, there is no repayment for performance. In Sciences and technical fields ${pc(A.reintegroUnivCienciasTecnicas, 'en')} is enough.` },
      { q: 'How is grant money paid back?', a: 'Your region or university opens a repayment file, notified on the Ministry\'s e-office with a text-message alert (article 45). You can object before the decision. If repayment is due, the Ministry orders repayment of the principal and, where applicable, late-payment interest. You can also repay voluntarily by asking your region or university for a payment slip.' },
    ],
    body: (h) => `<h2>The rules for paying back the beca</h2>
${h.table(['Studies', 'Minimum to avoid repayment', 'What is repaid if you fall short'], [
  ['Degree or master\'s, social, arts and health fields', `${pc(A.reintegroUniv, 'en')} of credits enrolled`, 'Everything except the tuition waiver'],
  ['Degree or master\'s, Sciences and technical', `${pc(A.reintegroUnivCienciasTecnicas, 'en')} of credits enrolled`, 'Everything except the tuition waiver'],
  ['Upper secondary and VET', `${pc(A.reintegroNoUniv, 'en')} passed and ${pc(A.asistenciaNoUniv, 'en')} attendance`, 'The whole grant'],
  ['Access course or languages', 'Whole course passed', 'The whole grant'],
], '2026-2027 call, article 43.2', ['l', 'l', 'l'])}
${h.mini('reintegro', { p: ['rama', 'mat', 'apr'], t: 'Would you have to pay back?' })}
<h2>What counts and what does not</h2>
<p>The percentage is worked out on credits enrolled in the grant year, leaving out recognised, transferred or adapted credits. Passes in either sitting of the year count. It is not the same as the requirement to get the grant the next year, which is higher: ${pc(A.porcentajeRama.sociales, 'en')} in Social Sciences and Law against ${pc(A.reintegroUniv, 'en')} for repayment. You may repay nothing and still lose the grant next year; the ${h.a('requisitos', 'academic requirements')} page explains.</p>
<h2>If you passed little for a serious reason</h2>
<p>Repayment is a file in which you can object: under article 45 of the ${h.src('convocatoria', 'call')}, if your objections show the grant was justified, the file is closed. The call gives no list of excusing reasons, so explain your case in detail with documents, such as a medical report. The general framework is set by ${h.src('rd1721', 'Royal Decree 1721/2007')}.</p>
<p>Remember the ${h.a('matricula', 'tuition waiver')} is not repaid for poor university results. In ${h.a('bachillerato', 'upper secondary and VET')} the rule is harsher: everything is repaid, including if you miss classes even with passes.</p>
<h2>Two examples with the same results</h2>
<p>A Physics student enrolled in 60 credits passes 24, or 40%: that reaches the minimum for the field, so nothing is repaid, although there will be no grant next year, since ${pc(A.porcentajeRama.ciencias, 'en')} is required for that. A Law student with the same 24 passes is also at 40%, below ${pc(A.reintegroUniv, 'en')}, and repays everything received except tuition. Receiving another incompatible grant at the same time also triggers repayment, under article 55.6. Repayment files are opened by your region or university and resolved by the Ministry, which may add late-payment interest where it applies.</p>
<h2>Who checks</h2>
<p>When the year ends, regions and universities draw up the list of their grant holders and each college's registry checks, against the exam records, who reached the minimum. If you did not, you will receive a notice opening the file on the e-office, with a text-message alert to the phone number in your application. From then on you can object and provide evidence before it is decided.</p>`,
  },
});
