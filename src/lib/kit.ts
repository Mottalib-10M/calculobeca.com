/**
 * Kit de redacción: toda cifra escrita en una página viene de aquí, nunca tecleada a mano.
 *   K.P                         parámetros fechados (params-2026.json)
 *   K.umbrales, K.beca, K.rentaFamiliar, K.patrimonio …   reglas puras (engine/beca.ts)
 *   K.HITOS                     calendario de la convocatoria
 *   K.tool(kind, lang, args, valores)  ejecuta un simulador de tool-specs.ts
 */
import P from '../data/params-2026.json';
import * as R from './engine/beca';
import * as F from './engine/fechas';
import { runTool, HITOS } from './tool-specs';
import { LAST_UPDATED } from '../data/site-config';

export const KIT = { P, ...R, F, HITOS, tool: runTool, LECTURA: LAST_UPDATED };
export type Kit = typeof KIT;
