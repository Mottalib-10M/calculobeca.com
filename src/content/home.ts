/** Inicio, español e inglés. Cifras: params-2026.json a través de _f y del motor, nunca tecleadas a mano. */
import type { FAQ } from '../lib/page-types';
import { eur, dec, day, U, P, C, CV, A, PT } from './guides/_f';

type L = 'es' | 'en';
interface HomeLang {
  title: string; description: string; h1: string; intro: string; resume: string; homeCard: string;
  stepsTitle: string; steps: Array<{ id: string; q: string; a: string }>;
  datesTitle: string; datesNote: string; guidesTitle: string; foldTitle: string; faqs: FAQ[];
}
const u4 = U(4);
const fila = (l: L) => P.umbrales.tabla.slice(0, 8).map((t) => [String(t.m), eur(t.u1, l), eur(t.u2, l), eur(t.u3, l)]);
const pc = (x: number, l: L) => (l === 'es' ? `${x} %` : `${x}%`);

const es: HomeLang = {
  title: 'Becas MEC 2026-2027: simulador de umbrales y cuantías',
  description: 'Simulador de la beca general 2026-2027 (becas MEC): umbral de renta, cuantías fijas de 1700 y 2700 €, patrimonio y requisitos académicos según el BOE.',
  h1: 'Beca general 2026-2027: ¿tengo derecho y cuánto?',
  homeCard: 'Si tendrías beca, qué dinero es seguro y en qué umbral está tu familia, en una sola pantalla',
  // Testeurs du 2026-11-10 : la réponse est annoncée tout de suite (elle sort sous les questions).
  intro: 'Escribe cuántos sois en casa, la renta de la familia y lo que se va a estudiar (si eres madre o padre, responde por tu hijo). La respuesta de la beca sale justo debajo de las preguntas: si habría beca y qué dinero es seguro.',
  // Sin artículos ni números de norma en el texto (testeurs del 2026-11-10): las normas están en el bloque de fuentes.
  resume: `La beca general del Estado para el curso 2026-2027, la que se conoce como beca MEC (la del Ministerio de Educación), depende sobre todo de la renta de la familia. Hay tres umbrales, es decir, tres tramos de renta: para una familia de cuatro, ${eur(u4.u1, 'es')}, ${eur(u4.u2, 'es')} y ${eur(u4.u3, 'es')} en un año. En el umbral 1, el de menos renta, se cobran ${eur(C.renta, 'es')} por renta baja. Hasta el umbral 2 se añaden ${eur(C.residencia, 'es')} si el estudiante vive fuera de casa y el extra de final de curso, con un mínimo de ${eur(C.variableMin, 'es')}. Hasta el umbral 3 quedan la matrícula gratis en la universidad, la beca básica de ${eur(C.basica, 'es')} en bachillerato y FP (formación profesional) y el premio por buena nota, desde un ${dec(C.excelencia[0].desde, 'es', 0)}. Además, la familia no puede tener demasiados bienes, como otra casa, terrenos o ahorros grandes, y el estudiante tiene que aprobar lo que se pide. Todo lo fijo se calcula al euro; el extra de final de curso solo se conoce al final. El plazo de este curso terminó el ${day(CV.plazoFin, 'es')}.`,
  stepsTitle: 'Las tres preguntas que mira el Ministerio, en orden',
  steps: [
    { id: 'umbrales', q: '1. ¿En qué umbral (tramo de renta) está la familia?', a: 'Lo que ganó la familia en un año, ya sin impuestos y con algunas rebajas. Por encima del umbral 3 no hay beca.' },
    { id: 'patrimonio', q: '2. ¿Tiene la familia demasiados bienes?', a: 'Cuentan otra casa aparte de la propia, los terrenos y los intereses de los ahorros, cada uno con su límite.' },
    { id: 'requisitos', q: '3. ¿Aprueba el estudiante lo que se pide?', a: `Un ${dec(A.notaMinima, 'es', 0)} de nota en primero. Después, aprobar una parte de las asignaturas: del ${pc(A.porcentajeRama.ciencias, 'es')} al ${pc(A.porcentajeRama.artes, 'es')} según la carrera.` },
  ],
  datesTitle: 'Fechas de la convocatoria 2026-2027',
  datesNote: 'Fechas publicadas en el BOE. Debajo de cada una, quién tiene que actuar; ✓ quiere decir que ya pasó.',
  guidesTitle: 'Cada pieza, con su calculadora',
  foldTitle: 'Para entender la beca a fondo',
  // La recette exige 6 questions sur la page pilier (check-trame) : 6, la plus juridique retirée (testeurs du 2026-11-10).
  faqs: [
    { q: '¿Este sitio es del Ministerio de Educación o tramita la beca?', a: 'No. Cálculo Beca es un sitio independiente: no es el Ministerio de Educación ni gestiona la solicitud. Lo publica Radif Partners, que no concede becas ni ve expedientes. La solicitud se presenta solo en la sede electrónica del Ministerio, y la beca la concede el Ministerio con los datos de Hacienda y de tu centro. Aquí solo calculamos, con las normas del BOE.' },
    { q: '¿Se envía algo de lo que escribo en el simulador?', a: 'No. Las reglas de la beca están dentro de la propia página y el cálculo se hace en tu navegador. No hay cuenta, formulario de contacto ni base de datos. Si usas el enlace para compartir, las cifras van en la dirección y solo las ve quien lo abre. Lo que escribes se recuerda solo en esta pestaña, para pasar de una calculadora a otra sin repetirlo, y se borra al cerrarla.' },
    { q: '¿Por qué el simulador no da la cuantía total exacta de la beca?', a: `Porque una parte, el extra de final de curso (cuantía variable), se reparte cuando el Ministerio sabe cuánto dinero sobra, cuántos becarios hay y qué notas tienen los mejores de cada carrera. Esos datos no se publican antes. El simulador suma las partes fijas, que son exactas, y muestra el mínimo del extra, ${eur(C.variableMin, 'es')}. La página del extra de final de curso explica el reparto.` },
    { q: '¿Qué renta tengo que escribir en el simulador?', a: 'La renta de la familia de un año, ya sin impuestos: la de la última declaración de la renta de cada persona que cuenta, sumada, con rebajas por familia numerosa, discapacidad o hermanos. ¿No la sabes? Pon lo que entra en casa en un año, ya sin impuestos: la cifra oficial suele salir algo más baja. La calculadora de renta familiar la saca de la declaración.' },
    { q: '¿Puedo pedir la beca si soy extranjero?', a: 'Hace falta la nacionalidad española o la de un país de la Unión Europea. Los ciudadanos de la Unión y sus familiares deben vivir en España de forma permanente o trabajar aquí, y los de otros países necesitan, en general, residencia legal. Todo ello a 31 de diciembre de 2025. Para la matrícula gratis sola no se piden estos requisitos.' },
    { open: true, q: '¿Dónde se presenta la solicitud y con qué?', a: 'Por internet, en la sede electrónica del Ministerio de Educación, con una de las firmas electrónicas que acepta la sede. Si el estudiante tiene menos de 18 años, firma su madre, su padre o su tutor, y las demás personas que cuentan en la familia autorizan con su firma que se consulten sus datos. El plazo de 2026-2027 cerró en mayo de 2026; el de 2027-2028 aún no tiene fecha.' },
  ],
};

const en: HomeLang = {
  title: 'Beca MEC 2026-2027: Spain study grant simulator and amounts',
  description: 'Simulator for Spain\'s 2026-2027 study grant (beca MEC): income threshold, fixed amounts of €1,700 and €2,700, wealth limits and academic rules from the BOE.',
  h1: 'Beca MEC (Ministry of Education) 2026-2027: am I eligible, and for how much?',
  homeCard: 'Whether you would get a grant, how much is guaranteed and your household threshold, on one screen',
  intro: 'Enter how many live at home, the family income and what you will study (parents: answer for your child): the simulator tells you whether you would get the beca MEC and how much money is guaranteed, under the rules published in the BOE.',
  resume: `Spain's general state study grant for 2026-2027, widely known as the beca MEC, is awarded on three family income thresholds and a wealth limit set by Royal Decree 179/2026, plus an academic requirement in the call of ${day(CV.resolucion, 'en')}. For a household of four, the thresholds are ${eur(u4.u1, 'en')}, ${eur(u4.u2, 'en')} and ${eur(u4.u3, 'en')} of 2025 income. Up to threshold 1 you get the fixed income-linked amount of ${eur(C.renta, 'en')}; up to threshold 2, the residence amount of ${eur(C.residencia, 'en')} if you study far from home, and the variable amount; up to threshold 3, the tuition waiver at university, the basic grant of ${eur(C.basica, 'en')} below it, and excellence, from ${eur(C.excelencia[0].importe, 'en')} to ${eur(C.excelencia[C.excelencia.length - 1].importe, 'en')}. Every fixed amount can be worked out to the euro. The variable amount cannot: it is shared out at the end with a formula whose inputs only the Ministry holds, so the simulator only shows its guaranteed minimum of ${eur(C.variableMin, 'en')}. This year's application window closed on ${day(CV.plazoFin, 'en')}.`,
  stepsTitle: 'The three questions the Ministry decides, in order',
  steps: [
    { id: 'umbrales', q: '1. Which income threshold does your household reach?', a: '2025 income of the counted members, after deductions. Above threshold 3 there is no grant.' },
    { id: 'patrimonio', q: '2. Is family wealth over the limit?', a: `Flats other than the main home, land and savings income count, each with its own limit. A family business only rules the grant out if it turns over more than ${eur(PT.actividades, 'en')} a year.` },
    { id: 'requisitos', q: '3. Do you meet the academic requirement?', a: `A ${dec(A.notaMinima, 'en')} in year one; from year two, your field's share of credits passed: from ${pc(A.porcentajeRama.ciencias, 'en')} to ${pc(A.porcentajeRama.artes, 'en')}.` },
  ],
  datesTitle: 'Dates of the 2026-2027 call',
  datesNote: 'Dates from the Official Gazette and the text of the call. Under each one, who has to act.',
  guidesTitle: 'Each component, with its calculator',
  foldTitle: 'Understanding the beca MEC in depth',
  faqs: [
    { q: 'Is this site the Ministry of Education, or does it process the grant?', a: 'No. Cálculo Beca is an independent site: it is not the Ministry of Education and does not handle applications. It is published by Radif Partners, which awards no grants and sees no files. Applications are made only on the Ministry\'s e-office, and the Ministry awards the grant using tax and college data. Here we only calculate, with the rules in the Official Gazette.' },
    { q: 'Is anything I type into the simulator sent anywhere?', a: 'No. The rules of the Royal Decree and the call are inside the page itself and the calculation runs in your browser. There is no account, no contact form and no database. If you use the share link, the figures sit in the address and only whoever opens it sees them. What you type is remembered only in this tab, so you can move between calculators without retyping it, and is erased when you close it.' },
    { q: 'Why doesn\'t the simulator give the exact total grant?', a: `Because one part, the variable amount, is shared out once the Ministry knows how much money is left after the fixed amounts, how many holders there are and the grade of the top ten per cent in each field. Those figures are not published in advance. The simulator adds up the fixed amounts, which are exact, and shows the ${eur(C.variableMin, 'en')} variable minimum; the variable-amount page explains the formula.` },
    { q: 'Which income should I enter in the simulator?', a: 'Family income for grant purposes for 2025: for each member who filed a return, general tax base plus savings tax base minus tax due, added together, then the deductions for large families, disability or siblings. If you do not know it, the family income calculator works it out from your parents\' tax return.' },
    { q: 'Can I apply if I am a foreign national?', a: 'The call requires Spanish or EU nationality. EU citizens and their family members must be permanent residents or employed or self-employed, and non-EU nationals follow immigration law, generally with legal residence. All this as at 31 December 2025. For the tuition waiver on its own, these requirements do not apply.' },
    { q: 'Can I combine the general grant with a regional grant?', a: 'It depends on the other grant. Under article 55 of the call, top-up grants that public administrations pay from their own budgets are not incompatible, nor are Erasmus or collaboration grants. Other benefits for the same purpose are, unless their rules declare them compatible and compatibility is requested from the Directorate-General for Educational Planning and Management.' },
    { open: true, q: 'Where is the application made, and with what?', a: 'Online, using the form on the e-office of the Ministry of Education, Vocational Training and Sport, signed with one of the electronic signature systems the e-office accepts. Under-18s are signed for by their legal representative, and the other counted members authorise the data checks with their signature (article 47). The 2026-2027 window closed in May 2026.' },
  ],
};

export const HOME = { es, en, fila, sources: ['rd179', 'convocatoria', 'rd1721', 'extracto', 'prorroga', 'simulador', 'sede', 'boeReutilizacion'] };
