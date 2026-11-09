/** Casos tomados del texto del BOE (RD 179/2026, convocatoria 2026-2027) : chaque règle du moteur. */
import { describe, expect, it } from 'vitest';
import * as B from '../src/lib/engine/beca';
import * as F from '../src/lib/engine/fechas';
import { runTool, TOOL_KINDS } from '../src/lib/tool-specs';

const base: B.BecaIn = { miembros: 4, renta: 20000, estudio: 'grado', matricula: 'completa', presencial: true, fuera: true, nota: 7, rama: 'sociales', primero: false, academicoOk: true, patrimonioPct: 0, insular: 'no', disc: 'no' };
const imp = (r: B.BecaOut, c: B.Comp) => r.lineas.find((x) => x.c === c)?.importe ?? 0;

describe('umbrales (RD 179/2026, art. 8.1)', () => {
  it('tabla y miembro adicional', () => {
    expect(B.umbrales(1)).toMatchObject({ u1: 8843, u2: 13898, u3: 14818 });
    expect(B.umbrales(4)).toMatchObject({ u1: 22107, u2: 38242, u3: 40773 });
    expect(B.umbrales(5).u1).toBe(25644); // xataka publicó 25.664
    expect(B.umbrales(9)).toMatchObject({ u1: 36255 + 3536, u2: 52850 + 3340, u3: 56348 + 3561 });
  });
  it('igual al umbral = no lo supera', () => {
    expect(B.umbralDe(22107, 4)).toBe(1); expect(B.umbralDe(22108, 4)).toBe(2);
    expect(B.umbralDe(40773, 4)).toBe(3); expect(B.umbralDe(40774, 4)).toBe(4);
  });
});

describe('cuantías (RD 179/2026, arts. 3 y 4 ; convocatoria arts. 5-13)', () => {
  it('grado, umbral 1, fuera de casa: renta + residencia + variable', () => {
    const r = B.beca(base);
    expect(imp(r, 'renta')).toBe(1700); expect(imp(r, 'residencia')).toBe(2700); expect(r.matricula).toBe(true); expect(r.variable).toBe('formula');
    expect(r.fijo).toBe(1700 + 2700 + 60);
  });
  it('umbral 2: sin renta, con residencia', () => { const r = B.beca({ ...base, renta: 30000 }); expect(imp(r, 'renta')).toBe(0); expect(imp(r, 'residencia')).toBe(2700); });
  it('umbral 3: solo matrícula y excelencia', () => {
    const r = B.beca({ ...base, renta: 40000, nota: 8.6 });
    expect(r.lineas.map((x) => x.c)).toEqual(['excelencia']); expect(imp(r, 'excelencia')).toBe(75); expect(r.matricula).toBe(true); expect(r.variable).toBe('no');
  });
  it('excelencia: tramos y coeficiente de rama en 2.º de grado', () => {
    expect(B.excelencia(7.99)).toBe(0); expect(B.excelencia(8)).toBe(50); expect(B.excelencia(9.49)).toBe(100); expect(B.excelencia(9.5)).toBe(125);
    expect(imp(B.beca({ ...base, nota: 7.5, rama: 'ingenieria' }), 'excelencia')).toBe(75); // 7,5 × 1,17 = 8,775
    expect(imp(B.beca({ ...base, nota: 7.5, rama: 'ingenieria', primero: true }), 'excelencia')).toBe(0);
  });
  it('no universitario presencial: básica incompatible con renta', () => {
    const u1 = B.beca({ ...base, estudio: 'bach' }), u2 = B.beca({ ...base, estudio: 'bach', renta: 30000 });
    expect(imp(u1, 'basica')).toBe(0); expect(imp(u1, 'renta')).toBe(1700);
    expect(imp(u2, 'basica')).toBe(300); expect(u2.matricula).toBe(false);
  });
  it('grado básico: 350 € y variable mínima', () => { const r = B.beca({ ...base, estudio: 'basico' }); expect(imp(r, 'basica')).toBe(350); expect(r.variable).toBe('minima'); });
  it('matrícula parcial 48-59: 350 + 350 + variable mínima', () => {
    const r = B.beca({ ...base, matricula: 'p48' });
    expect(imp(r, 'renta')).toBe(350); expect(imp(r, 'residencia')).toBe(350); expect(r.variable).toBe('minima');
  });
  it('matrícula parcial 30-47: matrícula y variable mínima', () => { const r = B.beca({ ...base, matricula: 'p30' }); expect(r.fijo).toBe(60); expect(r.matricula).toBe(true); });
  it('distancia: sin renta ni residencia', () => { const r = B.beca({ ...base, presencial: false }); expect(imp(r, 'renta') + imp(r, 'residencia')).toBe(0); });
  it('discapacidad del 65 %: +50 % salvo matrícula', () => { const r = B.beca({ ...base, disc: 'd65' }); expect(imp(r, 'renta')).toBe(2550); expect(imp(r, 'residencia')).toBe(4050); });
  it('insularidad hasta el umbral 2, Canarias FP +300', () => {
    expect(imp(B.beca({ ...base, insular: 'menor' }), 'insular')).toBe(623);
    expect(imp(B.beca({ ...base, renta: 40000, insular: 'menor' }), 'insular')).toBe(0);
    expect(imp(B.beca({ ...base, estudio: 'fps', insular: 'mayorPeninsula', canarias: true }), 'insular')).toBe(888 + 300);
  });
  it('denegaciones', () => {
    expect(B.beca({ ...base, renta: 50000 }).motivo).toBe('umbral');
    expect(B.beca({ ...base, patrimonioPct: 100.5 }).motivo).toBe('patrimonio');
    expect(B.beca({ ...base, academicoOk: false }).motivo).toBe('academico');
  });
});

describe('renta y patrimonio (RD 179/2026, arts. 9-11 ; convocatoria arts. 18 y 20)', () => {
  it('deducciones', () => {
    const r = B.rentaFamiliar({ sustentadores: 40000, otros: 4000, fn: 'general', hermanosFn: 3, disc33: 0, disc65: 0, solicitanteUniv65: false, fuera: 2, orfandad: false, monoparental: false });
    expect(r.computable).toBe(44000 - 2000 - 3 * 525 - 2 * 1176);
  });
  it('un solo universitario fuera no deduce', () => {
    expect(B.rentaFamiliar({ sustentadores: 30000, otros: 0, fn: 'no', hermanosFn: 0, disc33: 0, disc65: 0, solicitanteUniv65: false, fuera: 1, orfandad: false, monoparental: true }).computable).toBe(29500);
  });
  it('patrimonio: coeficiente catastral y suma de porcentajes', () => {
    expect(B.coefCatastral(2010)).toBe(0.28); expect(B.coefCatastral(1995)).toBe(0.49); expect(B.coefCatastral(2025)).toBe(0.29); expect(B.coefCatastral(2010, true)).toBe(0.5);
    const p = B.patrimonio({ urbanas: 100000, anioRevision: 2010, navarra: false, construccionesRusticas: 0, rusticas: 0, capital: 1900, miembros: 4, actividades: 0 });
    expect(p.suma).toBeCloseTo((28000 / 47200) * 100 + 100, 6); expect(p.deniega).toBe(true);
    expect(B.patrimonio({ urbanas: 0, anioRevision: 2010, navarra: false, construccionesRusticas: 0, rusticas: 0, capital: 0, miembros: 4, actividades: 172001 }).deniega).toBe(true);
  });
});

describe('requisitos académicos (convocatoria arts. 24, 26, 43)', () => {
  it('porcentaje por rama y excepcional rendimiento', () => {
    expect(B.cumpleGrado('sociales', 60, 54).ok).toBe(true); expect(B.cumpleGrado('sociales', 60, 53).ok).toBe(false);
    expect(B.porcentajeExigido('ingenieria', 72)).toBeCloseTo(63, 6); // Y = 20 % → 65 − 2
    expect(B.cumpleGrado('ciencias', 60, 39).ok).toBe(true);
  });
  it('nota de acceso 0,6 NMB + 0,4 PAU', () => { expect(B.notaAcceso(6, 3.5)).toBeCloseTo(5, 6); });
  it('reintegro 50 % o 40 %', () => { expect(B.reintegroPct(true, 'ciencias')).toBe(40); expect(B.reintegroPct(true, 'salud')).toBe(50); expect(B.reintegroPct(false, 'salud')).toBe(50); });
});

describe('plazos (Ley 39/2015, art. 30)', () => {
  it('días hábiles sin fines de semana', () => { expect(F.masHabiles('2026-11-06', 10)).toBe('2026-11-20'); });
  it('meses: mismo día o último del mes, siguiente hábil', () => {
    expect(F.masMeses('2026-01-31', 1)).toBe('2026-03-02'); // 28/02/2026 es sábado
    expect(F.masMeses('2026-11-10', 1)).toBe('2026-12-10');
  });
  it('contencioso: agosto no cuenta', () => { expect(F.contencioso('2026-07-10', 2)).toBe('2026-10-12'); }); // 10/10/2026 es sábado
});

describe('simuladores', () => {
  it('todos devuelven un resultado limpio en es y en', () => {
    for (const k of TOOL_KINDS) for (const l of ['es', 'en'] as const) {
      const o = runTool(k, l); expect(JSON.stringify(o), `${k}/${l}`).not.toMatch(/undefined|NaN|Infinity|\[object/);
    }
  });
});

/* Test naïf du 2026-11-08 : textes réparés, verrouillés (RECETTE §15.8). */
describe('test naïf 2026-11-08', () => {
  const eurN = (x: string) => Number(x.replace(/[^\d]/g, ''));
  const sp = (x: unknown) => JSON.parse(JSON.stringify(x).replace(/[\u00a0\u202f]/g, ' '));
  it('portada: el resultado dice sí, pone la matrícula delante y el total incluye el mínimo variable', () => {
    const o = runTool('beca', 'es');
    expect(sp(o.value)).toBe('Matrícula gratis + 60 €');
    expect(sp(o.sub)).toMatch(/^Sí, tendrías beca\. Dinero seguro: 60 €, el mínimo de la parte variable\./);
    expect(o.sub).not.toMatch(/RD 179|art\./);
    expect(o.table!.rows[1][2]).toMatch(/beca básica solo fuera de la universidad/);
  });
  it('cuantías: el total seguro es la suma de las líneas mostradas', () => {
    for (const um of ['1', '2', '3']) {
      const o = runTool('cuantias', 'es', undefined, { um });
      const suma = o.rows.filter((r) => r[2] !== undefined).reduce((s, r) => s + (r[2] as number), 0);
      if (o.value !== 'Solo matrícula') expect(eurN(o.value), um).toBe(suma);
      expect(o.table!.rows.at(-1)![0]).toBe('Total seguro (fijas + mínimo variable)');
    }
  });
  it('residencia: 2700 € y un total seguro que lista sus 60 €', () => {
    const o = runTool('residencia', 'es');
    expect(sp(o.value)).toBe('2700 €');
    expect(o.rows.map((r) => r[0])).toContain('Parte variable (mínimo seguro)');
    expect(sp(o.rows.at(-1))).toEqual(['Total seguro con residencia', '2760 €', 2760]);
  });
  it('umbrales: dice qué se pierde al pasar al siguiente', () => {
    expect(runTool('umbrales', 'es').sub).toMatch(/pasarías al umbral 3 y perderías la residencia y la parte variable/);
  });
  it('matrícula: el umbral dice con qué familia y renta se calcula', () => {
    expect(sp(runTool('matricula', 'es').rows[1][0])).toBe('Umbral con 4 personas y 30.000 € de renta');
  });
  it('nota: en primero no aparece la media de segundo; la excelencia dice cuánto falta', () => {
    const o = runTool('nota', 'es');
    expect(JSON.stringify(o.rows)).not.toMatch(/7,8/);
    expect(sp(o.rows[1][1])).toBe('Sin excelencia: te faltan 0,4 puntos para 50 €');
  });
  it('calendario: una fecha de la administración dice que no hay nada que hacer', () => {
    const o = runTool('calendario', 'es', undefined, { dia: 8, mes: '11', anio: 2026 });
    expect(o.sub).toMatch(/Tú no tienes que hacer nada ese día/);
    expect(o.table!.headers[2]).toBe('Quién actúa');
  });
});
