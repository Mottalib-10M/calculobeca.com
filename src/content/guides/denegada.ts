import { defineGuide } from '../../lib/page-types';
import { CV, day } from './_f';
import * as F from '../../lib/engine/fechas';

/* Beca denegada: convocatoria arts. 51.1 (subsanación, 10 días), 51.3 y 51.7 (propuesta de denegación y alegaciones),
   51.9 (audiencia, 10 días), 52.4 y 52.7 (notificación en sede, denegación por no aparecer en la relación), 57 (reposición 1 mes,
   contencioso 2 meses ante la Audiencia Nacional). Ley 39/2015 art. 30 para el cómputo. */
const ejN = '2026-11-10', ejA = F.masHabiles(ejN, CV.alegacionesDias), ejR = F.masMeses(ejN, CV.reposicionMeses);

export default defineGuide({
  id: 'denegada', group: 'tramite', order: 13,
  tool: 'recurso',
  related: ['calendario', 'renta', 'patrimonio', 'requisitos'],
  sources: ['convocatoria', 'sede'],
  es: {
    slug: 'beca-denegada',
    nav: 'Beca denegada: plazos', card: 'Subsanar, alegar o recurrir: qué plazo tienes según lo que te han notificado y cómo contarlo',
    title: 'Beca MEC denegada 2026-2027: alegaciones, recurso y plazos',
    description: 'Beca MEC denegada en 2026-2027: plazo de 10 días para subsanar o alegar, recurso de reposición en un mes y contencioso en dos. Calcula tu fecha límite.',
    h1: 'Beca denegada: alegaciones, recurso y plazos',
    intro: 'Si te han denegado la beca MEC, elige qué te han notificado y la fecha: la calculadora cuenta los días hábiles o los meses y te da el último día para responder.',
    resume: `Cuando el Ministerio ve un problema en tu solicitud no la deniega de golpe: primero te avisa. Si falta un documento, te envía un requerimiento y tienes ${CV.subsanacionDias} días desde que lo recibes para subsanarlo, o se te tiene por desistido (artículo 51.1 de la convocatoria). Si el cruce con Hacienda o los datos académicos no cuadran, te notifica una propuesta de denegación con su causa y te da un plazo para alegar; el trámite de audiencia previo a la resolución es de ${CV.alegacionesDias} días (artículo 51.9). Las correcciones de renta o patrimonio solo se aceptan como alegaciones justificadas. Si después se publica la resolución y sigues denegado, puedes presentar un recurso de reposición en el plazo de ${CV.reposicionMeses} mes desde el día siguiente a la publicación o ir directamente al recurso contencioso-administrativo ante la Audiencia Nacional en ${CV.contenciosoMeses} meses (artículo 57). Los días se cuentan hábiles, sin sábados, domingos ni festivos. Todo se notifica en la sede electrónica del Ministerio, en «Mis notificaciones», con un correo de aviso.`,
    faqs: [
      { q: '¿Qué hago si me deniegan la beca por superar umbrales de renta?', a: 'Compara la renta que figura en la notificación con la tuya, calculada con las bases de la declaración de 2025 menos la cuota y las deducciones. Los errores más comunes son un miembro computable que no debería estar, un sueldo de un hermano contado entero en lugar de la mitad o una deducción de familia numerosa que no se aplicó. Si hay error, alégalo con documentos.' },
      { q: '¿Cuánto tarda en resolverse un recurso de reposición de beca?', a: 'La convocatoria no fija un plazo propio, así que rige el general de un mes para resolver la reposición. Si no hay respuesta en ese tiempo, el recurso se entiende desestimado y desde entonces tienes seis meses para el contencioso-administrativo. Si hay respuesta expresa y es negativa, el plazo para el contencioso es de dos meses desde la notificación.' },
      { q: '¿Necesito abogado para recurrir la denegación de la beca?', a: 'Para las alegaciones y el recurso de reposición, no: se presentan por escrito en la sede electrónica con tu identificación. Para el recurso contencioso-administrativo ante la Audiencia Nacional sí hacen falta abogado y procurador, salvo excepciones. Si tus ingresos son bajos, puedes pedir asistencia jurídica gratuita en el colegio de abogados.' },
      { q: '¿Qué significa que mi solicitud no aparece en la lista de concedidas?', a: 'El artículo 52.7 de la convocatoria dice que las solicitudes que no aparecen en las relaciones definitivas publicadas se entienden denegadas por el mismo motivo indicado en la propuesta de denegación. Si recibiste esa propuesta y no alegaste, o tus alegaciones no prosperaron, ese es el motivo. Desde la publicación corre el plazo de recurso.' },
    ],
    body: (h) => `<h2>Tres notificaciones, tres plazos</h2>
${h.table(['Qué recibes', 'Plazo', 'Cómo se cuenta', 'Artículo'], [
  ['Requerimiento de documentos', `${CV.subsanacionDias} días`, 'Hábiles, desde la recepción', 'art. 51.1'],
  ['Propuesta de denegación', `${CV.alegacionesDias} días para alegar`, 'Hábiles, desde la notificación', 'art. 51.3 y 51.9'],
  ['Resolución publicada', `${CV.reposicionMeses} mes (reposición) o ${CV.contenciosoMeses} (contencioso)`, 'Desde el día siguiente a la publicación', 'art. 57'],
], 'Plazos de la convocatoria 2026-2027', ['l', 'l', 'l', 'l'])}
<p>Ejemplo: una propuesta de denegación notificada el ${h.day(ejN)} admite alegaciones hasta el ${h.day(ejA)}, contando solo días laborables; si hay un festivo en medio, un día más. Una resolución publicada ese mismo día admite reposición hasta el ${h.day(ejR)}.</p>
${h.mini('recurso', { p: ['acto', 'dia', 'mes'], t: 'Tu último día' })}
<h2>Las causas más frecuentes y qué revisar</h2>
<p>Por renta: comprueba quién figura como miembro computable y qué deducciones se aplicaron, con la ${h.a('renta', 'calculadora de renta familiar')}. Por patrimonio: revisa cada inmueble, su año de revisión catastral y los rendimientos del ahorro con la de ${h.a('patrimonio', 'patrimonio')}. Por rendimiento: confirma que la universidad envió las notas de la convocatoria extraordinaria y que el porcentaje de tu rama es el correcto, con la de ${h.a('requisitos', 'requisitos académicos')}. Por falta de documentación: a menudo basta con subirla dentro del plazo.</p>
<h2>Cómo presentar alegaciones a una beca denegada</h2>
<p>Entra en la ${h.src('sede', 'sede electrónica del Ministerio')}, abre la notificación en «Mis notificaciones» y sigue el enlace del trámite. Explica en pocas líneas qué dato es erróneo y adjunta el documento que lo prueba: un certificado de convivencia, el título de familia numerosa, una certificación catastral o el certificado de notas. Guarda el justificante de presentación. La ${h.src('convocatoria', 'convocatoria')} recuerda que la rectificación de la solicitud no puede tocar la renta ni el patrimonio: eso solo se cambia por alegación justificada.</p>
<p>Esta web no presenta alegaciones ni recursos por nadie ni tiene acceso a tu expediente. Las fechas del ${h.a('calendario', 'calendario')} ayudan a saber en qué fase está tu solicitud.</p>
<h2>Otras dos causas que se olvidan</h2>
<p>La solicitud lleva la firma de autorización de todos los miembros computables para consultar sus datos en otras administraciones. Si falta, el artículo 47 de la convocatoria ordena denegar, porque no se pueden comprobar la renta ni el patrimonio. Y no solo puede recurrir quien no tiene beca: el artículo 57.2 permite recurrir a quien cree que le corresponde una cuantía mayor.</p>`,
  },
  en: {
    slug: 'refused-grant',
    nav: 'Refused grant: deadlines', card: 'Fix, object or appeal: the deadline you have depending on what you were notified, and how to count it',
    title: 'Beca MEC refused 2026-2027: objections, appeal, deadlines',
    description: 'Spain\'s study grant refused in 2026-2027: 10 days to fix or object, one month for an appeal for reconsideration and two for court. Work out your deadline.',
    h1: 'Beca MEC refused: objections, appeals and deadlines',
    intro: 'If your beca MEC was refused, pick what you were notified and the date: the calculator counts working days or months and gives you the last day to respond.',
    resume: `When the Ministry sees a problem with your application it does not refuse it outright: it warns you first. If a document is missing, it sends a request and you have ${CV.subsanacionDias} days from receipt to fix it, or the application is treated as withdrawn (article 51.1 of the call). If the Tax Agency cross-check or academic data do not add up, it notifies a proposed refusal with its reason and gives you time to object; the hearing before the decision is ${CV.alegacionesDias} days (article 51.9). Corrections to income or wealth are only accepted as substantiated objections. If the decision is then published and you are still refused, you can lodge an appeal for reconsideration within ${CV.reposicionMeses} month from the day after publication, or go straight to a judicial review before the National High Court within ${CV.contenciosoMeses} months (article 57). Days are working days, excluding Saturdays, Sundays and holidays. Everything is notified on the Ministry's e-office, under «Mis notificaciones», with an email alert.`,
    faqs: [
      { q: 'What should I do if I am refused for exceeding the income thresholds?', a: 'Compare the income in the notice with your own, worked out from the 2025 tax bases minus tax due and deductions. The most common errors are a counted member who should not be there, a sibling\'s pay counted in full instead of half, or a large-family deduction that was not applied. If there is an error, object with documents.' },
      { q: 'How long does an appeal for reconsideration take?', a: 'The call sets no specific time, so the general rule of one month to decide applies. If there is no answer within that time, the appeal is deemed rejected and you then have six months for judicial review. If there is an express negative answer, the deadline for judicial review is two months from notification.' },
      { q: 'Do I need a lawyer to appeal a refused grant?', a: 'Not for objections or the appeal for reconsideration: they are filed in writing on the e-office with your ID. For judicial review before the National High Court you do need a lawyer and a court representative, with some exceptions. On a low income you can ask the bar association for free legal aid.' },
      { q: 'What does it mean if I am not on the list of awarded grants?', a: 'Article 52.7 of the call says that applications not appearing in the published final lists are deemed refused for the reason given in the proposed refusal. If you received that proposal and did not object, or your objections failed, that is the reason. The appeal deadline runs from publication.' },
    ],
    body: (h) => `<h2>Three notices, three deadlines</h2>
${h.table(['What you receive', 'Deadline', 'How it is counted', 'Article'], [
  ['Request for documents', `${CV.subsanacionDias} days`, 'Working days from receipt', 'art. 51.1'],
  ['Proposed refusal', `${CV.alegacionesDias} days to object`, 'Working days from notification', 'art. 51.3 and 51.9'],
  ['Published decision', `${CV.reposicionMeses} month (reconsideration) or ${CV.contenciosoMeses} (court)`, 'From the day after publication', 'art. 57'],
], 'Deadlines in the 2026-2027 call', ['l', 'l', 'l', 'l'])}
<p>Example: a proposed refusal notified on ${h.day(ejN)} allows objections until ${h.day(ejA)}, counting working days only; one more day if a holiday falls in between. A decision published that same day allows reconsideration until ${h.day(ejR)}.</p>
${h.mini('recurso', { p: ['acto', 'dia', 'mes'], t: 'Your last day' })}
<h2>The most common reasons and what to check</h2>
<p>Income: check who is listed as a counted member and which deductions were applied, using the ${h.a('renta', 'family income calculator')}. Wealth: review each property, its revaluation year and savings income with the ${h.a('patrimonio', 'wealth')} calculator. Performance: confirm the university sent the resit grades and that your field's percentage is right, with the ${h.a('requisitos', 'academic requirements')} tool. Missing documents: uploading them within the deadline is often enough.</p>
<h2>How to file objections to a refused beca</h2>
<p>Log in to the ${h.src('sede', 'Ministry\'s e-office')}, open the notice in «Mis notificaciones» and follow the procedure link. Explain briefly which figure is wrong and attach the document proving it: a household certificate, the large-family card, a cadastral certificate or your transcript. Keep the filing receipt. The ${h.src('convocatoria', 'call')} points out that amending the application cannot touch income or wealth: those only change through a substantiated objection.</p>
<p>This site files no objections or appeals for anyone and has no access to your file. The ${h.a('calendario', 'calendar')} dates help you see what stage your application has reached.</p>
<h2>Two more reasons people forget</h2>
<p>The application carries every counted member's signed consent to check their data with other administrations. If it is missing, article 47 of the call orders refusal, because income and wealth cannot be verified. And appeals are not only for those refused: article 57.2 lets anyone who believes they are owed a larger amount appeal too. If a recurso succeeds, the extra amount is paid from the same budget lines but does not count towards the overall cap (article 57.3). Keep every notice and receipt: you may need them for a later appeal.</p>`,
  },
});
