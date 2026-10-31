// src/utils/tax.js
//
// Desglose de IVA (México, 16%) para precios que
// se muestran ANTES de impuestos (Modelo B).
//
// Modelo B:
//   subtotal = precio base (el que ya tienes hoy)
//   iva      = subtotal * 0.16
//   total    = subtotal + iva  (lo que paga el cliente)
//
// Si en el futuro cambias a Modelo A (precio final
// con IVA incluido), solo se modifica este archivo:
//   iva      = total * 16/116
//   subtotal = total - iva
//
// Si en el futuro el IVA varía por país del comprador,
// breakDownIva puede recibir una tasa como parámetro.

export const IVA_RATE = 0.16;

function round2(n) {
  return Math.round(n * 100) / 100;
}

/**
 * Dado un subtotal (precio base, ANTES de impuestos),
 * devuelve el desglose con IVA sumado.
 *
 * @param {number} subtotal
 * @returns {{ subtotal: number, iva: number, total: number }}
 */
export function breakDownIva(subtotal) {
  const numericSubtotal = Number(subtotal);
  if (!Number.isFinite(numericSubtotal) || numericSubtotal <= 0) {
    return { subtotal: 0, iva: 0, total: 0 };
  }

  const iva = round2(numericSubtotal * IVA_RATE);
  const total = round2(numericSubtotal + iva);

  return { subtotal: numericSubtotal, iva, total };
}

/**
 * Formato de moneda para UI: "$1,234.56 USD".
 */
export function formatUsd(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "$0.00 USD";
  return `$${n.toFixed(2)} USD`;
}

/**
 * Formato numérico sin prefijo, para strings de
 * observaciones y mensajes.
 */
export function formatNumber(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}