/*
 * =========================================================
 * WHATSAPP MESSAGE BUILDER
 * =========================================================
 *
 * Generates the Isla Mujeres Express
 * WhatsApp reservation request.
 */

export function buildWhatsAppMessage(data) {

  const {
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

    totalPrice

  } = data;


  return `
AGI TOURS & TRANSFERS
ISLA MUJERES EXPRESS
RESERVATION REQUEST

Opportunity ID: ${opportunityId || "Not assigned"}

Request date: ${requestDate}

Service: ${serviceType}
Trip type: ${roundTrip ? "Round Trip" : "One Way"}

Passenger name: ${fullName}
Phone: ${phone}
Email: ${email}

Passengers: ${passengers}
Baby seat: ${babySeat ? "Yes" : "No"}

INBOUND FLIGHT
Date: ${arrivalDate}
ETA: ${arrivalTime}
Airline: ${arrivalAirline}
Flight: ${arrivalFlight}
Origin: ${arrivalOrigin}

WHERE SHOULD WE TAKE YOU IN ISLA MUJERES?
${destination}

${roundTrip ? `
RETURN TRIP
Date: ${departureDate}
ETD: ${departureTime}
Airline: ${departureAirline}
Flight: ${departureFlight}
` : ""}

Estimated total: $${totalPrice} USD
`;
}