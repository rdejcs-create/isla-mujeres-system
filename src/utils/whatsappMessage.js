/*
 * =========================================================
 * AGI MOBILITY PLATFORM
 * WHATSAPP MESSAGE BUILDER
 * =========================================================
 *
 * Centraliza los mensajes de WhatsApp generados por
 * los diferentes productos de AGI TOURS.
 *
 * Productos:
 *
 * 1. Isla Mujeres Express
 * 2. Personalized Transportation
 *
 * El número de Reference lo genera Google Apps Script
 * y corresponde al registro en Google Sheets.
 */

import { formatNumber } from "./tax";


// =========================================================
// HELPER
// =========================================================

function displayValue(value, fallback = "Not provided") {

  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  ) {

    return fallback;
  }

  return String(value).trim();
}


// =========================================================
// ISLA MUJERES EXPRESS
// =========================================================

export function buildWhatsAppMessage({

  requestDate,

  opportunityId,

  serviceType,

  roundTrip,

  fullName,

  phone,

  email,

  passengers,

  babySeat,

  arrivalDate,

  arrivalTime,

  arrivalAirline,

  arrivalFlight,

  arrivalOrigin,

  destination,

  departureDate,

  departureTime,

  departureAirline,

  departureFlight,

  // legacy: se usa si no llega ivaBreakdown
  totalPrice,

  // NUEVO: { subtotal, iva, total }
  ivaBreakdown

}) {

  const message = [

    "Hello AGI TOURS,",

    "",

    "New transportation request",

    "",

    `Reference: ${displayValue(
      opportunityId
    )}`,

    "",

    "Service: Isla Mujeres Express",

    `Service type: ${displayValue(
      serviceType
    )}`,

    `Trip type: ${
      roundTrip
        ? "Round Trip"
        : "One Way"
    }`,

    "",

    "Passenger Information",

    `Name: ${displayValue(
      fullName
    )}`,

    `WhatsApp: ${displayValue(
      phone
    )}`,

    `Email: ${displayValue(
      email
    )}`,

    "",

    "Transportation Details",

    `Passengers: ${displayValue(
      passengers
    )}`,

    `Baby seat: ${
      babySeat
        ? "Yes"
        : "No"
    }`,

    "",

    "Arrival Flight",

    `Arrival date: ${displayValue(
      arrivalDate
    )}`,

    `Arrival time: ${displayValue(
      arrivalTime
    )}`,

    `Airline: ${displayValue(
      arrivalAirline
    )}`,

    `Flight number: ${displayValue(
      arrivalFlight
    )}`,

    `Origin: ${displayValue(
      arrivalOrigin
    )}`,

    "",

    "Destination in Isla Mujeres",

    `Hotel, accommodation or private address: ${displayValue(
      destination
    )}`

  ];


  // =======================================================
  // RETURN TRIP
  // =======================================================

  if (roundTrip) {

    message.push(

      "",

      "Return Trip",

      `Return date: ${displayValue(
        departureDate
      )}`,

      `Return time: ${displayValue(
        departureTime
      )}`,

      `Return airline: ${displayValue(
        departureAirline
      )}`,

      `Return flight: ${displayValue(
        departureFlight
      )}`

    );

  }


  // =======================================================
  // QUOTE
  // =======================================================

  const quoteLines = ivaBreakdown
    ? [
        `Subtotal: $${formatNumber(ivaBreakdown.subtotal)} USD`,
        `IVA (16%): $${formatNumber(ivaBreakdown.iva)} USD`,
        `Total: $${formatNumber(ivaBreakdown.total)} USD`
      ]
    : [
        `Quoted price: $${displayValue(totalPrice)} USD`
      ];

  message.push(

    "",

    "Your Instant Quote",

    ...quoteLines,

    "",

    "This request is subject to confirmation by AGI TOURS. An AGI TOURS representative will review your request and contact you via WhatsApp with a personalized quote and payment information."

  );


  return message.join("\n");
}


// =========================================================
// PERSONALIZED TRANSPORTATION
// =========================================================

export function buildPersonalizedWhatsAppMessage({

  opportunityId,

  roundTrip,

  fullName,

  phone,

  email,

  passengers,

  babySeat,

  serviceDate,

  serviceTime,

  origin,

  destination,

  returnDate,

  returnTime,

  additionalDetails

}) {

  const message = [

    "Hello AGI TOURS,",

    "",

    "New transportation request",

    "",

    `Reference: ${displayValue(
      opportunityId
    )}`,

    "",

    "Service: Personalized Transportation",

    `Trip type: ${
      roundTrip
        ? "Round Trip"
        : "One Way"
    }`,

    "",

    "Passenger Information",

    `Name: ${displayValue(
      fullName
    )}`,

    `WhatsApp: ${displayValue(
      phone
    )}`,

    `Email: ${displayValue(
      email
    )}`,

    "",

    "Transportation Details",

    `Passengers: ${displayValue(
      passengers
    )}`,

    `Baby seat: ${
      babySeat
        ? "Yes"
        : "No"
    }`,

    "",

    "Service Details",

    `Service date: ${displayValue(
      serviceDate
    )}`,

    `Preferred time: ${displayValue(
      serviceTime
    )}`,

    `Origin: ${displayValue(
      origin
    )}`,

    `Destination: ${displayValue(
      destination
    )}`

  ];


  if (roundTrip) {

    message.push(

      "",

      "Return Trip",

      `Return date: ${displayValue(
        returnDate
      )}`,

      `Return time: ${displayValue(
        returnTime
      )}`

    );

  }


  message.push(

    "",

    "Additional Information",

    displayValue(
      additionalDetails,
      "None"
    ),

    "",

    "This request is subject to confirmation by AGI TOURS. Your personalized quote will include 16% IVA (Mexican VAT). An AGI TOURS representative will review your request and contact you via WhatsApp with a personalized quote and payment information."

  );


  return message.join("\n");
}