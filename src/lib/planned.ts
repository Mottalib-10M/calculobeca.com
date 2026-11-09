/** Todas las páginas previstas (id = nombre del fichero de src/content/guides).
 *  Los tests aceptan un enlace a estos ids durante la redacción; « todas las páginas existen » falla mientras falte alguna. */
export const PLANNED_GUIDES = [
  'umbrales', 'renta', 'patrimonio', 'cuantias', 'variable', 'requisitos', 'nota',
  'residencia', 'matricula', 'bachillerato', 'master', 'calendario', 'denegada', 'reintegro',
];
export const PLANNED_IDS = new Set<string>([...PLANNED_GUIDES, 'home', 'method', 'about', 'widget', 'contact', 'editorial', 'privacy', 'terms', 'cookies']);
