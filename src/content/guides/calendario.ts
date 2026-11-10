import { defineGuide } from '../../lib/page-types';
import { CV, P, day } from './_f';

/* Calendario: RD 179/2026 (BOE 12/03/2026); extracto BOE-B-2026-9261; convocatoria arts. 48 (plazo, solicitud tardía),
   51.4, 51.8 y 51.10 (fechas de los órganos de selección), 52 (concesión, notificaciones, variable en seis meses), 53 (pago);
   prórroga: extracto BOE-B-2026-16327. */

export default defineGuide({
  id: 'calendario', group: 'tramite', order: 12,
  tool: 'calendario',
  related: ['denegada', 'variable', 'home', 'reintegro'],
  sources: ['extracto', 'prorroga', 'convocatoria', 'rd179', 'sede'],
  es: {
    slug: 'calendario',
    nav: 'Calendario: qué toca ahora', card: 'Qué fechas ya pasaron, qué toca ahora y qué preparar para la beca 2027-2028',
    title: 'Calendario becas MEC 2026-2027: plazos, resolución y pago',
    description: 'Calendario de la beca 2026-2027: plazo del 7 de abril al 19 de mayo de 2026 tras la prórroga, fechas de comprobación, solicitud tardía y cuantía variable.',
    h1: 'Calendario de la beca general 2026-2027',
    intro: 'La fecha de hoy ya está puesta: la calculadora marca en el calendario de la beca qué fases ya pasaron y qué te toca hacer ahora.',
    resume: `El calendario de la beca general 2026-2027 ya está casi terminado. Las cifras salieron en el BOE en marzo de 2026 y el plazo para pedirla fue del ${day(CV.plazoInicio, 'es')} al ${day(CV.plazoFin, 'es')}. Ese plazo está cerrado. Si los estudios empiezan en septiembre de 2027, la beca que toca es la 2027-2028: su plazo aún no tiene fecha y por ahora no hay nada que pedir. Si ya pedisteis la de 2026-2027, ahora trabajan la comunidad, la universidad y el Ministerio: revisan los datos de la familia, la renta con Hacienda y las notas del centro. Después conceden las piezas fijas por tandas y, más tarde, el extra de final de curso. Todo llega por la sede electrónica del Ministerio, en «Mis notificaciones», con un correo de aviso. Fuera de plazo solo se admite una solicitud, hasta el ${day(CV.solicitudTardiaHasta, 'es')}, si quien más ingresa en casa fallece o se jubila de forma forzosa.`,
    faqs: [
      { open: true, q: '¿Cuándo se abre el plazo de la beca para el curso 2027-2028?', a: `Todavía no hay fecha: depende de un real decreto de umbrales y de una convocatoria que no se han publicado. En el curso 2026-2027, el real decreto salió en marzo y el plazo se abrió el ${day(CV.plazoInicio, 'es')}. No anunciamos fechas que no estén en el BOE; cuando se publique la nueva convocatoria, este calendario cambiará.` },
      { q: '¿Cómo sé en qué fase está mi solicitud?', a: 'En la sede electrónica del Ministerio, en el apartado «Mis expedientes». También puedes preguntar en la oficina de becas de tu universidad o de la consejería de educación de tu comunidad, con tu DNI o tu NIE (el número de identidad de extranjero). Las notificaciones llegan a «Mis notificaciones», con un correo de aviso.' },
      { q: '¿Cuándo se paga la beca después de concederla?', a: 'La convocatoria no fija un día. Las piezas fijas se pagan después de cada tanda de concesiones, por transferencia a la cuenta que se dio en la solicitud, que debe estar a nombre del estudiante. El extra de final de curso llega después, en otro pago. En algunas comunidades paga la propia comunidad.' },
    ],
    body: (h) => `<h2>Antes del próximo plazo</h2>
<ol>
<li>Guarda la declaración de la renta de 2026 cuando esté hecha, en la primavera de 2027: si no cambia la regla, es la que contará.</li>
<li>Contarán las personas que vivan en casa el 31 de diciembre de 2026.</li>
<li>Comprueba con tiempo la ${h.a('renta', 'renta familiar')} y el ${h.a('patrimonio', 'patrimonio')}: otra casa, terrenos o ahorros grandes.</li>
</ol>
<p>Las cifras de 2027-2028 no se conocen hasta que salgan en el BOE. Hasta entonces, el ${h.src('rd179', 'real decreto de 2026')} es el último publicado.</p>
<h2>El calendario de la convocatoria de becas</h2>
<p>La tabla de arriba da cada fecha y quién tiene que actuar ese día. La marca ✓ quiere decir que la fecha ya pasó. Las fechas salen del ${h.src('extracto', 'anuncio de la convocatoria en el BOE')} y de la ${h.src('prorroga', 'ampliación del plazo')}.</p>
<h2>Si ya pediste la beca 2026-2027</h2>
<ol>
<li>La oficina de becas de tu comunidad o universidad revisa los datos de la familia. Si falta algo, te lo pide y tienes diez días para responder.</li>
<li>El Ministerio comprueba la renta y los bienes con Hacienda. Si propone denegarla, te lo notifica y puedes responder.</li>
<li>Se añaden las notas del centro, a veces después de los exámenes de recuperación.</li>
<li>El Ministerio concede las piezas fijas por tandas y las paga en la cuenta a tu nombre.</li>
<li>Más tarde llega el extra de final de curso, en otro pago.</li>
</ol>
<p>Todo llega a «Mis notificaciones», en la ${h.src('sede', 'sede electrónica del Ministerio')}: si no abres una notificación, el plazo corre igual. Si te piden papeles o proponen denegarla, calcula tu plazo para responder en ${h.a('denegada', 'beca denegada')}.</p>`,
  },

  en: {
    slug: 'calendar',
    nav: 'Calendar 2026-2027', card: 'From the royal decree to payment: application window, selection deadlines and the decision',
    title: 'Beca MEC calendar 2026-2027: window, decision and payment',
    description: 'Calendar of Spain\'s 2026-2027 grant: window from 7 April to 19 May 2026 after the extension, checking deadlines, late applications and the variable amount.',
    h1: 'Beca MEC (Ministry of Education) calendar 2026-2027',
    intro: 'Enter today\'s date or any other: the calculator marks on the beca MEC calendar which stages have passed and what the next date in the call is.',
    resume: `The 2026-2027 general grant calendar began with Royal Decree 179/2026, published on ${day(P.rd.boe, 'en')}, and the call of ${day(CV.resolucion, 'en')}, whose summary appeared in the Official Gazette on ${day(CV.extractoBoe, 'en')}. The application window opened on ${day(CV.plazoInicio, 'en')} and was due to close on ${day(CV.plazoFinOriginal, 'en')}, but a resolution of ${day(CV.prorroga, 'en')} extended it to ${day(CV.plazoFin, 'en')} at ${CV.horaFin} mainland time. That window is closed. Outside it, applications are accepted until ${day(CV.solicitudTardiaHasta, 'en')} only if the main earner dies or is forced to retire after the deadline. Regions and universities had to send the Ministry personal and family data by ${day(CV.datosPersonalesHasta, 'en')} and academic data by ${day(CV.ccaaComunicanFijas, 'en')}. Fixed amounts are awarded in partial, successive orders as those proposals arrive; the variable amount in a later decision. The 2027-2028 call does not exist yet: this calendar will be updated when it is published.`,
    faqs: [
      { open: true, q: 'When does the 2027-2028 application window open?', a: 'There is no date yet: it depends on a thresholds decree and a call that have not been published. For 2026-2027, the decree came out in March and the window opened on 7 April. This site does not announce dates that are not in the Official Gazette; when the new call is published, this calendar will change.' },
      { q: 'How do I know what stage my application is at?', a: 'On the Ministry\'s e-office, under «Mis expedientes», under article 52.11 of the call. You can also contact the grants unit of your university or regional education department using your NIF or NIE. Notices arrive in «Mis notificaciones», with an email alert.' },
      { q: 'When is the grant paid once awarded?', a: 'The call sets no day. Fixed amounts are paid after each award order, by transfer to the account you gave in the application, which must be in your name. The variable amount comes later in a separate payment. In some regions with an agreement, the region itself pays, under article 53.' },
      { q: 'Can I apply late if I simply forgot?', a: `No. Article 48.2 only accepts late applications, until ${day(CV.solicitudTardiaHasta, 'en')}, when the main earner dies or is forced to retire after the deadline. In that case you apply directly to the region or university and the new financial situation is assessed, which must be backed by documents.` },
    ],
    body: (h) => `<h2>Before the next window</h2>
<p>If the next call keeps the current rule, which looks at the year before the application, 2026 income will count, with the members living together on 31 December 2026. If you are preparing early, review ${h.a('renta', 'family income')} with the 2026 return once you have it and check ${h.a('patrimonio', 'wealth')}. The 2027-2028 thresholds and amounts are unknown until their decree: until then, ${h.src('rd179', 'Royal Decree 179/2026')} is the latest published.</p>
<h2>The beca MEC calendar, date by date</h2>
<p>The calculator's table, above, gives each date and who has to act that day. The dates come from the ${h.src('extracto', 'summary of the call')}, the ${h.src('prorroga', 'extension resolution')} and the full text of the ${h.src('convocatoria', 'call')}. They leave out regional holidays and each university's internal dates.</p>
<h2>How an application moves forward</h2>
<ol>
<li>The grants office of your region or university checks your personal and family data. If anything is missing, it asks you and you have ten days to reply.</li>
<li>The Ministry checks your income and wealth with the Tax Agency. If that produces a proposed refusal, you are notified and may object.</li>
<li>Your college's grades are added, which are often only complete after the resit exams.</li>
<li>The Ministry awards the fixed amounts in batches as the data arrive. They are paid by transfer to the account in your name given on the application.</li>
<li>Later comes the variable-amount decision, within six months of the Ministry having the regions' data, with its own payment.</li>
</ol>
<p>Everything is notified on the ${h.src('sede', 'Ministry\'s e-office')}. If you receive a request for documents or a proposed refusal, count the deadline with the ${h.a('denegada', 'refused grant')} calculator. On when the variable part is paid, see ${h.a('variable', 'the variable amount')}.</p>
<h3>Notices</h3>
<p>Every step arrives through the e-office: requests for documents, proposed refusals, awards and the variable amount. An email alert comes first. If you do not open the notice, the deadline runs anyway, so check «Mis notificaciones» every few weeks while the application is open. The 15 July date is internal: it is when selection bodies report personal and family checks to the Ministry, not a deadline for you.</p>`,
  },
});
