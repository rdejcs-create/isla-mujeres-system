// src/utils/requestId.js
//
// Genera y persiste un requestId por firma de solicitud.
// Si el usuario reintenta con los mismos datos dentro de
// la ventana de 24 h, se reutiliza el mismo requestId.
// Esto, combinado con la deduplicación del backend
// (columna AH de la hoja), evita oportunidades duplicadas.

const REQUEST_WINDOW_MS = 24 * 60 * 60 * 1000;

function generateRawRequestId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return (
    "req-" +
    Date.now() +
    "-" +
    Math.random().toString(36).slice(2)
  );
}

/**
 * Devuelve un requestId estable para la firma dada.
 *
 * @param {string} storageKey  Clave única por producto.
 * @param {string} signature   Firma estable del payload (JSON.stringify).
 * @returns {string}           requestId a enviar al backend.
 */
export function getOrCreateRequestId(storageKey, signature) {
  let requestId = "";

  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      const age = Date.now() - parsed.createdAt;
      if (
        parsed.signature === signature &&
        age >= 0 &&
        age < REQUEST_WINDOW_MS &&
        parsed.requestId
      ) {
        requestId = parsed.requestId;
      }
    }
  } catch (error) {
    console.warn("Could not read the saved request ID.", error);
  }

  if (!requestId) {
    requestId = generateRawRequestId();
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          signature,
          requestId,
          createdAt: Date.now(),
        })
      );
    } catch (error) {
      console.warn("Could not save the request ID.", error);
    }
  }

  return requestId;
}

/**
 * Borra el requestId guardado solo si sigue siendo
 * el mismo que se acaba de confirmar.
 */
export function clearRequestId(storageKey, requestId) {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (parsed.requestId === requestId) {
      localStorage.removeItem(storageKey);
    }
  } catch (error) {
    console.warn("Could not clear the confirmed request ID.", error);
  }
}