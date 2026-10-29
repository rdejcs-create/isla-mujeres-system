/*
 * AGI TOURS — Cancun Airport Transportation Express
 * Tarifas aprobadas por vehículo y por trayecto, en USD.
 * R/T se calcula como O/W × 2; no mantener tarifas R/T duplicadas.
 * Grupos de más de 16 pasajeros: requieren cotización especial.
 */

export const PASSENGER_RANGES = [
  { min: 1, max: 3, label: "1–3" },
  { min: 4, max: 6, label: "4–6" },
  { min: 7, max: 9, label: "7–9" },
  { min: 10, max: 12, label: "10–12" },
  { min: 13, max: 16, label: "13–16" }
];

export const AIRPORT_TRANSFER_RATES = {
  "Cancún": [60, 70, 80, 85, 100],
  "Playa Mujeres": [65, 75, 85, 95, 110],
  "Costa Mujeres": [70, 80, 90, 100, 120],
  "Puerto Morelos": [65, 75, 85, 95, 110],
  "Riviera Maya Norte": [70, 80, 90, 110, 140],
  "Playa del Carmen": [75, 85, 95, 120, 150],
  "Riviera Maya Sur 1": [80, 90, 100, 130, 160],
  "Riviera Maya Sur 2": [100, 110, 120, 150, 190],
  "Tulum Pueblo y Zona Hotelera NORTE": [110, 120, 130, 160, 210],
  "Tulum Zona Hotelera SUR": [140, 160, 180, 220, 250],
  "Puerta Reserva de la Biosfera Sian Ka'an al puente Boca Paila": [180, 220, 250, 300, 400],
  "Puente de Boca Paila hasta Javier Rojo Gómez": [200, 250, 300, 400, 500],
};

/**
 * Devuelve la tarifa O/W por vehículo para una zona y cantidad de pasajeros.
 * Retorna null si no existe la zona o si el grupo supera los 16 pasajeros.
 */
export function getOneWayRate(zone, passengers) {
  if (!Number.isInteger(passengers) || passengers < 1 || passengers > 16) return null;
  const zoneRates = AIRPORT_TRANSFER_RATES[zone];
  if (!zoneRates) return null;
  const index = PASSENGER_RANGES.findIndex(
    range => passengers >= range.min && passengers <= range.max
  );
  return index >= 0 ? zoneRates[index] : null;
}

/**
 * Devuelve la tarifa de ida y vuelta, exactamente el doble de O/W.
 */
export function getRoundTripRate(zone, passengers) {
  const oneWayRate = getOneWayRate(zone, passengers);
  return oneWayRate === null ? null : oneWayRate * 2;
}
