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
    nav: 'Calendario 2026-2027', card: 'Del real decreto al pago: plazo de solicitud, fechas de los órganos de selección y resolución',
    title: 'Calendario becas MEC 2026-2027: plazos, resolución y pago',
    description: 'Calendario de la beca 2026-2027: plazo del 7 de abril al 19 de mayo de 2026 tras la prórroga, fechas de comprobación, solicitud tardía y cuantía variable.',
    h1: 'Calendario de la beca general 2026-2027',
    intro: 'Escribe la fecha de hoy o la que quieras: la calculadora marca qué fases ya pasaron y cuál es la siguiente fecha de la convocatoria.',
    resume: `El calendario de la beca general 2026-2027 empezó con el Real Decreto 179/2026, publicado el ${day(P.rd.boe, 'es')}, y con la convocatoria del ${day(CV.resolucion, 'es')}, cuyo extracto salió en el BOE el ${day(CV.extractoBoe, 'es')}. El plazo de solicitud se abrió el ${day(CV.plazoInicio, 'es')} y debía cerrar el ${day(CV.plazoFinOriginal, 'es')}, pero una resolución del ${day(CV.prorroga, 'es')} lo prorrogó hasta el ${day(CV.plazoFin, 'es')} a las ${CV.horaFin}, hora peninsular. Ese plazo está cerrado. Fuera de él solo se admiten solicitudes hasta el ${day(CV.solicitudTardiaHasta, 'es')} si el sustentador principal fallece o se jubila de forma forzosa después del plazo. Las comunidades y universidades debían enviar al Ministerio los datos personales y familiares antes del ${day(CV.datosPersonalesHasta, 'es')} y los académicos antes del ${day(CV.ccaaComunicanFijas, 'es')}. Las cuantías fijas se conceden en órdenes parciales y sucesivas a medida que llegan esas propuestas; la variable, en una resolución posterior. La convocatoria del curso 2027-2028 aún no existe: este calendario se actualizará cuando se publique.`,
    faqs: [
      { open: true, q: '¿Cuándo se abre el plazo de la beca para el curso 2027-2028?', a: 'Todavía no hay fecha: depende de un real decreto de umbrales y de una convocatoria que no se han publicado. En el curso 2026-2027, el real decreto salió en marzo y el plazo se abrió el 7 de abril. No anunciamos fechas que no estén en el BOE; cuando se publique la nueva convocatoria, este calendario cambiará.' },
      { q: '¿Cómo sé en qué fase está mi solicitud?', a: 'En la sede electrónica del Ministerio, apartado «Mis expedientes», según el artículo 52.11 de la convocatoria. También puedes dirigirte a la unidad de becas de tu universidad o de tu consejería de educación identificándote con tu NIF o NIE. Las notificaciones llegan a «Mis notificaciones», con un correo de aviso.' },
      { q: '¿Cuándo se paga la beca después de concederla?', a: 'La convocatoria no fija un día. Las cuantías fijas se pagan tras cada orden de concesión, por transferencia a la cuenta que diste en la solicitud, que debe estar a tu nombre. La cuantía variable llega después, en otro pago. En algunas comunidades con convenio el pago lo hace la propia comunidad, según el artículo 53.' },
      { q: '¿Puedo presentar la solicitud fuera de plazo si me olvidé?', a: `No. El artículo 48.2 solo admite solicitudes tardías, hasta el ${day(CV.solicitudTardiaHasta, 'es')}, cuando el sustentador principal fallece o se jubila de forma forzosa después del plazo. En ese caso la solicitud se presenta directamente en la comunidad o la universidad y se valora la nueva situación económica, que hay que acreditar con documentos.` },
    ],
    body: (h) => `<h2>Antes del próximo plazo</h2>
<p>Si la próxima convocatoria mantiene la regla actual, que mira el año anterior al de la solicitud, contará la renta de 2026 y los miembros que convivan a 31 de diciembre de 2026. Si preparas la solicitud con tiempo, revisa ya la ${h.a('renta', 'renta familiar')} con la declaración de 2026 cuando la tengas y comprueba el ${h.a('patrimonio', 'patrimonio')}. Los umbrales y cuantías de 2027-2028 no se conocen hasta su real decreto: hasta entonces, el ${h.src('rd179', 'Real Decreto 179/2026')} es el último publicado.</p>
<h2>Las fechas de la convocatoria</h2>
<p>La tabla de la calculadora, arriba, da cada fecha y quién tiene que actuar ese día. Las fechas salen del ${h.src('extracto', 'extracto de la convocatoria')}, de la ${h.src('prorroga', 'resolución de prórroga')} y del texto completo de la ${h.src('convocatoria', 'convocatoria')}. No incluyen festivos autonómicos ni fechas internas de cada universidad.</p>
<h2>Cómo avanza una solicitud</h2>
<ol>
<li>La oficina de becas de tu comunidad o universidad revisa tus datos personales y familiares. Si falta algo, te lo pide y tienes diez días para responder.</li>
<li>El Ministerio comprueba tu renta y tu patrimonio con Hacienda. Si de ahí sale una propuesta de denegación, te la notifica y puedes alegar.</li>
<li>Se añaden las notas de tu centro, que muchas veces solo están completas tras los exámenes de recuperación.</li>
<li>El Ministerio concede las cuantías fijas por tandas, a medida que llegan los datos. Se pagan por transferencia a la cuenta a tu nombre que diste en la solicitud.</li>
<li>Más tarde llega la resolución de la parte variable, en un plazo de seis meses desde que el Ministerio reúne los datos de las comunidades, con su propio pago.</li>
</ol>
<p>Todo se notifica en la ${h.src('sede', 'sede electrónica del Ministerio')}. Si recibes un requerimiento o una propuesta de denegación, cuenta el plazo con la calculadora de ${h.a('denegada', 'beca denegada')}. Sobre el momento del pago de la parte variable, mira ${h.a('variable', 'la cuantía variable')}.</p>
<h2>Las notificaciones</h2>
<p>Cada paso llega por la sede: requerimientos, propuestas de denegación, concesiones y la cuantía variable. Recibes antes un correo de aviso. Si no abres la notificación, el plazo corre igual, así que conviene revisar «Mis notificaciones» cada pocas semanas mientras la solicitud está viva.</p>
${h.mini('recurso', { p: ['acto', 'dia', 'mes'], t: '¿Te ha llegado una notificación? Tu plazo para responder' })}`,
  },
  en: {
    slug: 'calendar',
    nav: 'Calendar 2026-2027', card: 'From the royal decree to payment: application window, selection deadlines and the decision',
    title: 'Beca MEC calendar 2026-2027: window, decision and payment',
    description: 'Calendar of Spain\'s 2026-2027 grant: window from 7 April to 19 May 2026 after the extension, checking deadlines, late applications and the variable amount.',
    h1: 'Calendar of Spain\'s general study grant 2026-2027',
    intro: 'Enter today\'s date or any other: the calculator marks which stages have passed and what the next date in the call is.',
    resume: `The 2026-2027 general grant calendar began with Royal Decree 179/2026, published on ${day(P.rd.boe, 'en')}, and the call of ${day(CV.resolucion, 'en')}, whose summary appeared in the Official Gazette on ${day(CV.extractoBoe, 'en')}. The application window opened on ${day(CV.plazoInicio, 'en')} and was due to close on ${day(CV.plazoFinOriginal, 'en')}, but a resolution of ${day(CV.prorroga, 'en')} extended it to ${day(CV.plazoFin, 'en')} at ${CV.horaFin} mainland time. That window is closed. Outside it, applications are accepted until ${day(CV.solicitudTardiaHasta, 'en')} only if the main earner dies or is forced to retire after the deadline. Regions and universities had to send the Ministry personal and family data by ${day(CV.datosPersonalesHasta, 'en')} and academic data by ${day(CV.ccaaComunicanFijas, 'en')}. Fixed amounts are awarded in partial, successive orders as those proposals arrive; the variable amount in a later decision. The 2027-2028 call does not exist yet: this calendar will be updated when it is published.`,
    faqs: [
      { open: true, q: 'When does the 2027-2028 application window open?', a: 'There is no date yet: it depends on a thresholds decree and a call that have not been published. For 2026-2027, the decree came out in March and the window opened on 7 April. This site does not announce dates that are not in the Official Gazette; when the new call is published, this calendar will change.' },
      { q: 'How do I know what stage my application is at?', a: 'On the Ministry\'s e-office, under «Mis expedientes», under article 52.11 of the call. You can also contact the grants unit of your university or regional education department using your NIF or NIE. Notices arrive in «Mis notificaciones», with an email alert.' },
      { q: 'When is the grant paid once awarded?', a: 'The call sets no day. Fixed amounts are paid after each award order, by transfer to the account you gave in the application, which must be in your name. The variable amount comes later in a separate payment. In some regions with an agreement, the region itself pays, under article 53.' },
      { q: 'Can I apply late if I simply forgot?', a: `No. Article 48.2 only accepts late applications, until ${day(CV.solicitudTardiaHasta, 'en')}, when the main earner dies or is forced to retire after the deadline. In that case you apply directly to the region or university and the new financial situation is assessed, which must be backed by documents.` },
    ],
    body: (h) => `<h2>Before the next window</h2>
<p>If the next call keeps the current rule, which looks at the year before the application, 2026 income will count, with the members living together on 31 December 2026. If you are preparing early, review ${h.a('renta', 'family income')} with the 2026 return once you have it and check ${h.a('patrimonio', 'wealth')}. The 2027-2028 thresholds and amounts are unknown until their decree: until then, ${h.src('rd179', 'Royal Decree 179/2026')} is the latest published.</p>
<h2>The dates of the call</h2>
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
<h2>Notices</h2>
<p>Every step arrives through the e-office: requests for documents, proposed refusals, awards and the variable amount. An email alert comes first. If you do not open the notice, the deadline runs anyway, so check «Mis notificaciones» every few weeks while the application is open. The 15 July date is internal: it is when selection bodies report personal and family checks to the Ministry, not a deadline for you.</p>
${h.mini('recurso', { p: ['acto', 'dia', 'mes'], t: 'Received a notice? Your deadline to reply' })}`,
  },
});
