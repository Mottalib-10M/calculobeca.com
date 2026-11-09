import type { Locale } from './routes';
import type { LibellesTrame } from '../lib/libelles-trame';
const es = {
  updatedOn: 'Actualizado el', editorialPolicy: 'Política editorial', contactLabel: 'Contacto', reviewedBy: 'Preparado por',
  skipToContent: 'Ir al contenido', mainNav: 'Navegación principal', breadcrumbLabel: 'Ruta de navegación', breadcrumbHome: 'Inicio', menuOpen: 'Abrir el menú',
  faqTitle: 'Dudas frecuentes', relatedCalculators: 'Para seguir', sourcesTitle: 'Normas en las que se basa esta página', writtenBy: 'Preparado por',
  asOf: 'Situación', lastUpdated: 'cifras releídas en el BOE el', footerValidated: 'Cifras del Real Decreto 179/2026 (umbrales y cuantías), del Real Decreto 1721/2007 y de la convocatoria general del curso 2026-2027',
  footerBrowser: 'Las calculadoras funcionan en tu navegador · lo que escribes no se envía ni se guarda · sin registro',
  footerDisclaimer: 'Cálculo Beca: sitio independiente, no es el Ministerio de Educación ni gestiona la solicitud. Lo publica Radif Partners, que no concede becas ni tramita nada. Estimación orientativa: solo la resolución del Ministerio fija tu beca.',
  footerReuse: 'Basado en datos de la Agencia Estatal Boletín Oficial del Estado (<a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>), releídos el 8 de noviembre de 2026. Tablas adaptadas: reordenadas por número de miembros y convertidas en calculadoras. No es una publicación oficial.',
  footerPopular: 'Calculadoras',
  notFound: 'En esta dirección no hay ninguna página. En la portada calculas si tienes derecho a la beca general y qué cuantías fijas te tocan.',
  readMore: 'Seguir leyendo',
  // Libellés de la trame (lib/libelles-trame.ts) tutoyés : le site tutoie partout, la trame vouvoie en espagnol.
  trama: { exemple: 'Ejemplo, todavía no es tu resultado', exempleAide: 'cambia una cifra para ver el tuyo', plusDeReglages: 'Más datos de tu caso (opcional, ya rellenos)', faqAide: 'Toca una pregunta para ver la respuesta.' } as Partial<LibellesTrame>,
  privacyLine: 'No pedimos nombre, DNI ni correo: el cálculo se hace en tu navegador y lo que escribes no se envía a ningún sitio.',
  copyLink: 'Copiar el enlace', copied: 'Enlace copiado', print: 'Imprimir', howComputed: 'Cómo se calcula', openFull: 'Abrir la calculadora completa',
  independent: 'Sitio independiente: no es el Ministerio de Educación',
};
const en: typeof es = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Prepared by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Common questions', relatedCalculators: 'Next steps', sourcesTitle: 'Rules this page is based on', writtenBy: 'Prepared by',
  asOf: 'As of', lastUpdated: 'figures re-read in the BOE on', footerValidated: 'Figures from Royal Decree 179/2026 (thresholds and amounts), Royal Decree 1721/2007 and the 2026-2027 general call',
  footerBrowser: 'The calculators run in your browser · nothing you type is sent or stored · no sign-up',
  footerDisclaimer: 'Cálculo Beca is an independent site published by Radif Partners: it is not the Ministry of Education and does not handle applications. It awards no grants. Indicative estimate only: the Ministry\'s decision sets your grant.',
  footerReuse: 'Based on data from the Agencia Estatal Boletín Oficial del Estado (<a href="https://www.boe.es" rel="nofollow noopener" target="_blank">www.boe.es</a>), re-read on 8 November 2026. Tables adapted: sorted by household size and turned into calculators. Not an official publication.',
  footerPopular: 'Calculators',
  notFound: 'Nothing lives at this address. The home page works out whether you qualify for the general state grant and which fixed amounts apply.',
  readMore: 'Read more',
  trama: {} as Partial<LibellesTrame>,
  privacyLine: 'We ask for no name, ID or email: the calculation runs in your browser and nothing you type is sent anywhere.',
  copyLink: 'Copy share link', copied: 'Link copied', print: 'Print', howComputed: 'How this is calculated', openFull: 'Open the full calculator',
  independent: 'Independent site: not the Ministry of Education',
};
const ALL = { es, en };
export function t(lang: Locale) { return ALL[lang] ?? es; }
