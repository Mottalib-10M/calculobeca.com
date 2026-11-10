import { defineGuide } from '../../lib/page-types';
import { eur, C, CV, day } from './_f';

/* Cuantía variable: RD 1721/2007 art. 9.2 (fórmula); RD 179/2026 art. 5; convocatoria arts. 2.3, 10 y 52.5-52.6.
   Simulador oficial del Ministerio: último curso configurado 2025-2026 (sources.simulador). */
const mm = (x: number) => Math.round(x / 1e6);

export default defineGuide({
  id: 'variable', group: 'dinero', order: 5,
  tool: 'variable',
  related: ['cuantias', 'nota', 'calendario', 'home'],
  sources: ['rd1721', 'convocatoria', 'rd179', 'simulador'],
  es: {
    slug: 'cuantia-variable',
    nav: 'Extra de final de curso (cuantía variable)', card: 'La fórmula del reparto, qué pesa tu nota y tu renta, y por qué nadie puede darte la cifra exacta',
    title: 'Cuantía variable beca MEC 2026-2027: fórmula y peso',
    description: 'Cuantía variable de la beca 2026-2027: la fórmula del artículo 10, el mínimo de 60 € y tu peso en el reparto por nota y renta. Por qué no se sabe al euro.',
    h1: 'Cuantía variable de la beca: la fórmula y tu peso en el reparto',
    intro: 'Escribe tu nota media, la renta familiar y los miembros: la calculadora aplica la fórmula oficial de la cuantía variable de la beca hasta donde se puede y te da tu peso relativo en el reparto.',
    resume: `La cuantía variable es la única parte de la beca general que no tiene un importe fijado de antemano. El real decreto de umbrales dice que, una vez pagadas todas las cuantías fijas y los mínimos, el dinero que sobre se reparte entre los becarios de los umbrales 1 y 2 según su nota media y su renta, con una fórmula fija. Cada becario recibe al menos ${eur(C.variableMin, 'es')}. El resto depende de tres datos que solo conoce el Ministerio cuando cierra el curso: cuánto dinero sobra, cuántos becarios hay y la nota del mejor diez por ciento de cada rama. Por eso nadie, tampoco esta web, puede decirte cuánto cobrarás de variable. Lo que sí se puede calcular es tu peso en el reparto: cuanto más alta tu nota y más baja tu renta por persona, mayor tu parte. La resolución llega después de las cuantías fijas: la convocatoria da al Ministerio seis meses desde que reúne los datos de las comunidades.`,
    faqs: [
      { q: '¿Por qué la cuantía variable de mi amigo es mayor que la mía?', a: 'Porque la fórmula premia dos cosas: una nota media más alta en relación con la del mejor diez por ciento de tu rama y una renta por persona más baja. Si tu amigo tiene mejor nota o menos renta por miembro de la familia, su peso en el reparto es mayor. Además, cada rama tiene su propia nota de referencia, de modo que comparar entre carreras distintas confunde.' },
      { q: '¿Cuándo se cobra la cuantía variable?', a: `Después de las fijas. El Ministerio necesita conocer el coste de todas las cuantías fijas, que las comunidades le comunican como tarde el ${day(CV.ccaaComunicanFijas, 'es')}, y luego dicta la resolución en un plazo de seis meses. Por eso la variable se cobra bien entrado el curso, en un pago separado de las fijas.` },
      { q: '¿Sirve el simulador del Ministerio para el curso 2026-2027?', a: 'El Ministerio tiene un simulador de la cuantía variable en su web. Al leerlo el 8 de noviembre de 2026, el último curso configurado era el 2025-2026: aplica los datos de reparto de ese curso, no los del actual. Sirve para hacerse una idea del orden de magnitud, sabiendo que las cifras de 2026-2027 serán otras.' },
    ],
    body: (h) => `<h2>La fórmula de la cuantía variable de la beca, término a término</h2>
<p>El ${h.src('rd1721', 'real decreto de becas de 2007')} y la ${h.src('convocatoria', 'convocatoria 2026-2027')} reparten la cuantía variable así: la cuantía de cada becario es el mínimo de ${h.eur(C.variableMin)} más una parte del dinero restante proporcional a su peso. El peso multiplica dos factores. El factor de nota es tu nota media dividida por la del mejor decil de becarios de tu rama (Nmax). El factor de renta es uno menos tu renta per cápita dividida por la renta per cápita máxima para entrar en la variable (Rmax).</p>
${h.table(['Término', 'Qué es', 'Quién lo conoce'], [
  ['Cmin', `Cuantía variable mínima: ${h.eur(C.variableMin)}`, 'Real decreto de umbrales'],
  ['Nj', 'Tu nota media, contando los suspensos', 'Tú'],
  ['Rj', 'Tu renta familiar dividida por los miembros', 'Tú'],
  ['Nmax', 'Nota media del mejor 10 % de becarios de tu rama', 'Ministerio, al final'],
  ['Rmax', 'Renta per cápita máxima para la variable', 'Ministerio'],
  ['Ctotal y S', 'Dinero a repartir y número de becarios', 'Ministerio, al final'],
], 'Términos de la fórmula', ['l', 'l', 'l'])}
<p>El presupuesto total de la convocatoria es de ${h.n(mm(CV.presupuesto))} millones de euros, más ${h.n(mm(CV.presupuestoAdicional))} millones adicionales si se necesitan, pero lo que queda para la variable solo se sabe al restar todo lo fijo. El reparto se hace por separado para universitarios y no universitarios, y de forma conjunta con los becarios de Cataluña.</p>
<h2>Qué hace la calculadora y qué no</h2>
<p>La calculadora pone tu nota y tu renta per cápita en la fórmula. Como el Ministerio no publica Nmax ni Rmax antes del reparto, usa dos hipótesis visibles en «Lo que hemos supuesto por ti»: una nota de referencia de 10 y una renta máxima igual al umbral 2 dividido entre los miembros. Puedes cambiarlas. El resultado es un índice entre cero y algo más de uno, útil para comparar dos situaciones, por ejemplo cuánto gana tu peso si subes un punto la media. No lo convierte en euros: eso exigiría Ctotal, S y la suma de los pesos de todos los becarios.</p>
<p>Para una cifra orientativa en euros, el Ministerio ofrece su ${h.src('simulador', 'simulador oficial de la cuantía variable')}, que al leerlo seguía configurado con los datos del curso 2025-2026. Las cuantías fijas, en cambio, sí son exactas: están en ${h.a('cuantias', 'cuantías de la beca')} y en el ${h.a('home', 'simulador completo')}.</p>`,
  },
  en: {
    slug: 'variable-amount',
    nav: 'Variable amount', card: 'The share-out formula, how your grade and income weigh in, and why nobody can give you the exact figure',
    title: 'Beca MEC variable amount 2026-2027: formula and weighting',
    description: 'The 2026-2027 grant\'s variable amount: the article 10 formula, the €60 minimum and your weight in the share-out by grade and income. Why no one can predict it.',
    h1: 'The beca MEC (Ministry of Education) variable amount',
    intro: 'Enter your average grade, family income and household size: the calculator applies the official beca MEC variable amount formula as far as it can and gives your relative weight in the share-out.',
    resume: `The variable amount is the only part of Spain's general study grant without a figure set in advance. Article 5 of Royal Decree 179/2026 says that, once every fixed amount and minimum has been paid, whatever money is left is shared among threshold 1 and 2 grant holders according to their average grade and their income, using the formula in article 9.2 of Royal Decree 1721/2007, which the call copies in its article 10. Each holder receives at least ${eur(C.variableMin, 'en')}. The rest depends on three figures only the Ministry knows when the year closes: how much money is left, how many holders there are and the grade of the top ten per cent in each field. So nobody, this site included, can tell you what your variable amount will be. What can be worked out is your weight in the share-out: the higher your grade and the lower your income per person, the bigger your share. The decision comes after the fixed amounts: the call gives the Ministry six months from the date it has the regions' data.`,
    faqs: [
      { q: 'Why is my friend\'s variable amount larger than mine?', a: 'Because the formula rewards two things: a higher average grade relative to the top ten per cent in your field, and lower income per person. If your friend has better grades or less income per household member, their weight in the share-out is larger. Each field also has its own reference grade, so comparing across different degrees is misleading.' },
      { q: 'When is the variable amount paid?', a: `After the fixed amounts. The Ministry needs the cost of all fixed amounts, which regions report by ${day(CV.ccaaComunicanFijas, 'en')} at the latest, and then issues its decision within six months (article 52.6 of the call). That is why the variable amount is paid well into the year, separately from the fixed amounts.` },
      { q: 'Does the Ministry\'s official simulator work for 2026-2027?', a: 'The Ministry has a variable-amount simulator on its website. When read on 8 November 2026, the latest year set up was 2025-2026: it uses that year\'s share-out data, not the current one. It gives an idea of the order of magnitude, bearing in mind that the 2026-2027 figures will differ.' },
      { q: 'Who receives only the minimum variable amount?', a: `Part-time students, non-university distance learners, basic VET, language school and access course students receive only the ${eur(C.variableMin, 'en')} minimum, without joining the share-out. So does anyone in the extra final year of their degree. Their grades are left out when the reference grade for everyone else is worked out.` },
    ],
    body: (h) => `<h2>The beca's variable amount formula, term by term</h2>
<p>${h.src('rd1721', 'Article 9.2 of Royal Decree 1721/2007')} and ${h.src('convocatoria', 'article 10 of the 2026-2027 call')} share out the variable amount like this: each holder's amount is the ${h.eur(C.variableMin)} minimum plus a slice of the remaining money proportional to their weight. The weight multiplies two factors. The grade factor is your average divided by that of the top decile of holders in your field (Nmax). The income factor is one minus your per-capita income divided by the maximum per-capita income for the variable amount (Rmax).</p>
${h.table(['Term', 'What it is', 'Who knows it'], [
  ['Cmin', `Minimum variable amount: ${h.eur(C.variableMin)}`, 'Royal Decree 179/2026'],
  ['Nj', 'Your average grade, fails included', 'You'],
  ['Rj', 'Your family income divided by members', 'You'],
  ['Nmax', 'Average of the top 10% of holders in your field', 'Ministry, at the end'],
  ['Rmax', 'Maximum per-capita income for the variable', 'Ministry'],
  ['Ctotal and S', 'Money to share and number of holders', 'Ministry, at the end'],
], 'Terms of the formula', ['l', 'l', 'l'])}
<p>The call's total budget is ${h.n(mm(CV.presupuesto))} million euros, plus a further ${h.n(mm(CV.presupuestoAdicional))} million if needed, but what is left for the variable part is only known once all fixed amounts are taken off. University and non-university students are shared out separately, and jointly with Catalonia's grant holders.</p>
<h2>What the calculator does and does not do</h2>
<p>The calculator puts your grade and per-capita income into the formula. As the Ministry does not publish Nmax or Rmax before the share-out, it uses two assumptions you can see under "What we assumed for you": a reference grade of 10 and a maximum income equal to threshold 2 divided by members. You can change them. The result is an index between zero and a little over one, useful to compare two situations, such as how much your weight rises if your average goes up a point. It does not turn it into euros: that would need Ctotal, S and the sum of every holder's weight.</p>
<p>For a rough euro figure, the Ministry offers its ${h.src('simulador', 'official variable-amount simulator')}, which when read was still set up with 2025-2026 data. Fixed amounts, on the other hand, are exact: see ${h.a('cuantias', 'grant amounts')} and the ${h.a('home', 'full simulator')}.</p>
<p>One more detail affects the share-out: students who only receive the minimum, such as part-time or distance students, are left out when Nmax is calculated, so the reference grade reflects full-time holders only.</p>`,
  },
});
