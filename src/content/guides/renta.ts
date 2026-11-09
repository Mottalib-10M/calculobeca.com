import { defineGuide } from '../../lib/page-types';
import { eur, U, D } from './_f';
import { rentaFamiliar } from '../../lib/engine/beca';

/* Renta familiar a efectos de beca: RD 179/2026 arts. 9 y 10; convocatoria arts. 16 (cálculo), 17 (miembros) y 18 (deducciones). */
const ej = rentaFamiliar({ sustentadores: 41000, otros: 6000, fn: 'general', hermanosFn: 3, disc33: 0, disc65: 0, solicitanteUniv65: false, fuera: 0, orfandad: false, monoparental: false });
const u5 = U(5);
const pct = (x: number, l: 'es' | 'en') => (l === 'es' ? `${x * 100} %` : `${x * 100}%`);
const filas = (l: 'es' | 'en') => {
  const T = (es: string, en: string) => (l === 'es' ? es : en);
  return [
    [T('Ingresos de miembros que no son los padres', 'Income of members other than the parents'), T(`${pct(D.otrosMiembros, l)} de esos ingresos`, `${pct(D.otrosMiembros, l)} of that income`), '18.2.a'],
    [T('Familia numerosa general, por hermano', 'Large family (general), per sibling'), eur(D.fnGeneral, l), '18.2.b'],
    [T('Familia numerosa especial, por hermano', 'Large family (special), per sibling'), eur(D.fnEspecial, l), '18.2.b'],
    [T('Discapacidad del 33 % o más', 'Disability of 33% or more'), eur(D.disc33, l), '18.2.c'],
    [T('Discapacidad del 65 % o más', 'Disability of 65% or more'), eur(D.disc65, l), '18.2.c'],
    [T('Solicitante universitario con discapacidad del 65 % o más', 'University applicant with 65%+ disability'), eur(D.disc65UnivSolicitante, l), '18.2.c'],
    [T('Cada universitario fuera de casa, si son dos o más', 'Each university student away from home, if two or more'), eur(D.fueraDomicilio, l), '18.2.d'],
    [T('Orfandad absoluta, menor de 25 años', 'Full orphan under 25'), T(`${pct(D.orfandad, l)} de la renta`, `${pct(D.orfandad, l)} of income`), '18.2.e'],
    [T('Familia monoparental', 'Single-parent family'), eur(D.monoparental, l), '18.2.f'],
  ];
};

export default defineGuide({
  id: 'renta', group: 'dinero', order: 2,
  tool: 'renta',
  related: ['umbrales', 'patrimonio', 'home', 'denegada'],
  sources: ['rd179', 'convocatoria'],
  es: {
    slug: 'renta-familiar',
    nav: 'Renta familiar y deducciones', card: 'De la declaración de la renta a la cifra que se compara con los umbrales, deducción por deducción',
    title: 'Renta familiar beca MEC 2026-2027: cálculo y deducciones',
    description: 'Cómo se calcula la renta familiar de la beca 2026-2027: bases de la declaración de 2025, cuota, y las deducciones por familia numerosa o discapacidad.',
    h1: 'Renta familiar a efectos de beca: cálculo y deducciones',
    intro: 'Escribe la renta de tus padres y la del resto de la familia, marca las situaciones que dan deducción y obtén la renta familiar de la beca, la cifra que el Ministerio compara con los umbrales.',
    resume: `La renta familiar a efectos de beca se calcula con la declaración del IRPF de 2025 de cada miembro computable. Para quien declaró se suman la base imponible general y la del ahorro, sin los saldos negativos de años anteriores, y se resta la cuota resultante de la autoliquidación (artículo 9 del Real Decreto 179/2026 y artículo 16 de la convocatoria). Para quien no declaró se resta lo retenido. Después se aplican las deducciones del artículo 18: el ${pct(D.otrosMiembros, 'es')} de lo que ganan los miembros que no son los padres, ${eur(D.fnGeneral, 'es')} por hermano en familia numerosa general y ${eur(D.fnEspecial, 'es')} en la especial, ${eur(D.disc33, 'es')} o ${eur(D.disc65, 'es')} por discapacidad, ${eur(D.fueraDomicilio, 'es')} por universitario fuera de casa cuando son dos o más, el ${pct(D.orfandad, 'es')} en orfandad absoluta y ${eur(D.monoparental, 'es')} en familia monoparental. Con unos padres que suman ${eur(41000, 'es')}, un hermano que gana ${eur(6000, 'es')} y familia numerosa general de tres hijos, la renta queda en ${eur(ej.computable, 'es')}.`,
    faqs: [
      { q: '¿Qué casillas de la declaración de la renta se usan para la beca?', a: 'La base imponible general y la base imponible del ahorro, sumadas, y la cuota resultante de la autoliquidación, que se resta. No se usan los ingresos brutos ni el resultado a pagar o devolver. El Ministerio no te pide copiar las casillas: obtiene los datos de la Agencia Tributaria si autorizas la consulta en la solicitud.' },
      { q: '¿Cuentan los ingresos de mi hermano o los míos para la renta familiar?', a: `Sí, pero solo la mitad. El artículo 18.2.a de la convocatoria deduce el ${pct(D.otrosMiembros, 'es')} de los ingresos de cualquier miembro computable distinto de los sustentadores principales. Si trabajaste en verano y ganaste ${eur(3000, 'es')}, a la renta familiar se suman ${eur(3000 * D.otrosMiembros, 'es')}. Lo mismo vale para hermanos y abuelos con pensión.` },
      { q: '¿Qué pasa si vivo solo y digo que soy independiente?', a: 'Debes demostrar ingresos propios suficientes y la titularidad o el alquiler de tu vivienda, según el artículo 17.3 de la convocatoria. Si tus ingresos no cubren la vivienda y los gastos básicos, la independencia no se da por probada y se cuenta la renta de tus padres. Además, un estudiante independiente no cobra la cuantía de residencia.' },
      { q: '¿La deducción por familia numerosa se aplica si el título está caducado?', a: 'Hace falta tener derecho a la condición de familia numerosa a 31 de diciembre de 2025, que es la fecha a la que se miran todas las deducciones según el artículo 18.1. Si el título estaba vigente ese día o lo renovaste con efectos anteriores, se aplica. Si caducó antes y no se renovó, la deducción no entra.' },
    ],
    body: (h) => `<h2>Primer paso: la renta de cada miembro</h2>
<p>El ${h.src('convocatoria', 'artículo 16 de la convocatoria')} suma la renta de todos los miembros computables que tuvieron ingresos en 2025. Para quien presentó la declaración: base imponible general más base imponible del ahorro, sin restar los saldos negativos de ganancias o del capital mobiliario de 2021 a 2024, y menos la cuota resultante de la autoliquidación. Para quien no declaró, el mismo cálculo menos los pagos a cuenta que le retuvieron. El resultado no es lo que cobraste ni lo que te devolvieron, sino una cifra intermedia de la declaración.</p>
<h2>Segundo paso: las deducciones</h2>
<p>Sobre esa suma se aplican las deducciones del ${h.src('rd179', 'artículo 10 del Real Decreto 179/2026')}, que la convocatoria repite en su artículo 18. Solo cuentan las situaciones que existían a 31 de diciembre de 2025.</p>
${h.table(['Situación', 'Deducción', 'Art.'], filas('es'), 'Deducciones de la renta familiar, curso 2026-2027', ['l', 'r', 'l'])}
<p>Ejemplo: los padres suman ${h.eur(41000)} después de la cuota, un hermano mayor ganó ${h.eur(6000)} y son familia numerosa general con tres hijos. Se resta la mitad del sueldo del hermano y ${h.eur(D.fnGeneral)} por cada uno de los tres hijos: la renta familiar queda en ${h.eur(ej.computable)}. Con cinco miembros, eso está ${ej.computable <= u5.u2 ? 'por debajo' : 'por encima'} del umbral 2, de ${h.eur(u5.u2)}.</p>
${h.mini('renta', { p: ['sust', 'otros', 'miembros'], t: 'Tu renta familiar en tres datos' })}
<h2>Qué no cambia la renta familiar de la beca</h2>
<p>La beca no tiene en cuenta los ingresos de 2026, aunque hayan caído, salvo la solicitud fuera de plazo por fallecimiento o jubilación forzosa del sustentador principal. Tampoco mira el número de hijos de forma directa: el tamaño de la familia ya está en la tabla de ${h.a('umbrales', 'umbrales por miembros')}. Y la renta no lo es todo: la beca se deniega también si el ${h.a('patrimonio', 'patrimonio familiar')} supera sus límites.</p>
<h2>Cuando la cifra del Ministerio no coincide</h2>
<p>El Ministerio cruza los datos con la Agencia Tributaria. Si en la propuesta de denegación aparece una renta distinta de la tuya, revisa quién figura como miembro computable y si faltó una deducción. Las correcciones de renta y patrimonio solo se aceptan como alegaciones justificadas, en el plazo que indique la notificación: la página de ${h.a('denegada', 'beca denegada')} explica cómo.</p>`,
  },
  en: {
    slug: 'family-income',
    nav: 'Family income and deductions', card: 'From the tax return to the figure compared with the thresholds, deduction by deduction',
    title: 'Beca MEC family income 2026-2027: calculation, deductions',
    description: 'How family income is calculated for Spain\'s 2026-2027 study grant: 2025 tax bases, tax due, then deductions for large families, disability or siblings.',
    h1: 'Family income for the beca MEC: calculation and deductions',
    intro: 'Enter your parents\' income and the rest of the household\'s, tick the situations that give a deduction and get the beca MEC family income, the figure the Ministry sets against the thresholds.',
    resume: `Family income for grant purposes is worked out from each counted member's 2025 Spanish income tax return. For anyone who filed, the general tax base and the savings tax base are added, ignoring negative balances carried from earlier years, and the tax due on the return is taken off (article 9 of Royal Decree 179/2026 and article 16 of the call). For anyone who did not file, tax withheld is taken off instead. Then the deductions of article 18 apply: ${pct(D.otrosMiembros, 'en')} of what members other than the parents earn, ${eur(D.fnGeneral, 'en')} per sibling in a general large family and ${eur(D.fnEspecial, 'en')} in a special one, ${eur(D.disc33, 'en')} or ${eur(D.disc65, 'en')} for disability, ${eur(D.fueraDomicilio, 'en')} per university student away from home when there are two or more, ${pct(D.orfandad, 'en')} for full orphans and ${eur(D.monoparental, 'en')} for single-parent families. With parents on ${eur(41000, 'en')}, a sibling earning ${eur(6000, 'en')} and a general large family of three children, income comes to ${eur(ej.computable, 'en')}.`,
    faqs: [
      { q: 'Which boxes of the tax return are used for the grant?', a: 'The general tax base and the savings tax base, added together, and the resulting tax due, which is subtracted. Gross pay and the final amount payable or refundable are not used. The Ministry does not ask you to copy the boxes: it gets the data from the Tax Agency if you authorise the check in the application.' },
      { q: 'Does my sibling\'s or my own income count towards family income?', a: `Yes, but only half of it. Article 18.2.a of the call deducts ${pct(D.otrosMiembros, 'en')} of the income of any counted member other than the main earners. If you worked over the summer and earned ${eur(3000, 'en')}, ${eur(3000 * D.otrosMiembros, 'en')} goes into family income. The same applies to siblings and to grandparents with a pension.` },
      { q: 'What if I live alone and claim to be independent?', a: 'You must prove enough income of your own and that you own or rent your home, under article 17.3 of the call. If your income does not cover housing and basic costs, independence is not accepted and your parents\' income counts. An independent student also cannot get the residence amount.' },
      { q: 'Does the large-family deduction apply if the certificate has expired?', a: 'You need to have been entitled to large-family status on 31 December 2025, the date all deductions are checked against under article 18.1. If the certificate was valid that day, or you renewed it with earlier effect, the deduction applies. If it lapsed before and was not renewed, it does not.' },
    ],
    body: (h) => `<h2>Step one: each member's income</h2>
<p>${h.src('convocatoria', 'Article 16 of the call')} adds up the income of every counted member who had income in 2025. For anyone who filed a return: general tax base plus savings tax base, without subtracting negative balances of gains or investment income from 2021 to 2024, minus the tax due on the return. For anyone who did not file, the same calculation minus the tax withheld. The result is neither what you were paid nor what you got back, but a midway figure from the return.</p>
<h2>Step two: the deductions</h2>
<p>The deductions of ${h.src('rd179', 'article 10 of Royal Decree 179/2026')}, repeated in article 18 of the call, are applied to that total. Only situations that existed on 31 December 2025 count.</p>
${h.table(['Situation', 'Deduction', 'Art.'], filas('en'), 'Family income deductions, 2026-2027', ['l', 'r', 'l'])}
<p>Example: the parents come to ${h.eur(41000)} after tax due, an older sibling earned ${h.eur(6000)} and they are a general large family with three children. Half of the sibling's pay comes off, plus ${h.eur(D.fnGeneral)} for each of the three children: family income ends up at ${h.eur(ej.computable)}. With five members, that is ${ej.computable <= u5.u2 ? 'below' : 'above'} threshold 2 of ${h.eur(u5.u2)}.</p>
${h.mini('renta', { p: ['sust', 'otros', 'miembros'], t: 'Your family income in three figures' })}
<h2>What does not change your family income for the beca</h2>
<p>The grant ignores 2026 income, even if it fell, except for late applications after the main earner's death or forced retirement. It does not look at the number of children directly either: household size is already built into the ${h.a('umbrales', 'threshold table by members')}. And income is not everything: the grant is also refused if ${h.a('patrimonio', 'family wealth')} is over its limits.</p>
<h2>When the Ministry's figure differs from yours</h2>
<p>The Ministry cross-checks with the Tax Agency. If a proposed refusal shows a different income from yours, check who is listed as a counted member and whether a deduction was missed. Corrections to income and wealth are only accepted as substantiated objections, within the deadline stated in the notice: the ${h.a('denegada', 'refused grant')} page explains how.</p>`,
  },
});
