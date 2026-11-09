/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://calculobeca.com";
export const SITE_NAMES: Record<string, string> = {"es": "Cálculo Beca", "en": "Cálculo Beca"};
// Partie du nom affichée en couleur dans l'en-tête (RECETTE §10.3), « » pour aucune.
export const BRAND_ACCENT = "Beca";
export const LANG_TAGS: Record<string, string> = {"es": "es-ES", "en": "en-ES"};
export const OG_LOCALES: Record<string, string> = {"es": "es_ES", "en": "en_GB"};
export const LOCALE_TAG = 'es-ES';
/** Une locale de formatage par langue de page (RECETTE §4) : « 1700 € » en espagnol, « €1,700 » en anglais. */
export const NUM_TAGS: Record<string, string> = {"es": "es-ES", "en": "en-GB"};
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-11-08';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"es": "Editor de calculadoras independientes sobre la beca general del Estado: umbrales de renta y patrimonio, cuantías fijas, requisitos académicos y calendario de cada convocatoria", "en": "Publisher of independent calculators on Spain's general state study grant: income and wealth thresholds, fixed amounts, academic requirements and each call's calendar"};
export const AUTHOR_DESC: Record<string, string> = {"es": "Radif Partners es un editor independiente. Para Cálculo Beca lee en el BOE el Real Decreto 179/2026 de umbrales y cuantías, el Real Decreto 1721/2007 consolidado y la convocatoria general del curso 2026-2027, y convierte sus tablas en calculadoras que funcionan solo en tu navegador. No es el Ministerio de Educación, no gestiona solicitudes y no concede becas.", "en": "Radif Partners is an independent publisher. For Cálculo Beca it reads, in Spain's Official Gazette (BOE), Royal Decree 179/2026 on thresholds and amounts, the consolidated Royal Decree 1721/2007 and the 2026-2027 general call, and turns their tables into calculators that run only in your browser. It is not the Ministry of Education, handles no applications and awards no grants."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"es": ["becas de carácter general del Estado", "umbrales de renta y patrimonio familiar", "cuantías de beca", "requisitos académicos de beca", "Real Decreto 1721/2007"], "en": ["Spain's general state study grants", "family income and wealth thresholds", "grant amounts", "academic requirements for grants", "Royal Decree 1721/2007"]};
export const CONTACT_EMAIL = "contact@calculobeca.com";
export const THEME_COLOR = '#AA151B';
export const LOGO_SYMBOL = 'BC';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = '';
export const INDEXNOW_KEY = 'fbcb5e4745d709b1db493c0b931e54ae';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : comme les autres sites du portefeuille
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "Francia / France",
  phone: '',
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "NIF-IVA",
  vatNumber: '',
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city']; // legalForm vide à dessein, comme les autres sites du portefeuille

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
