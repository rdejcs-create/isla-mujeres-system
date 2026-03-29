/*
====================================================
GENERADOR DE MENSAJE DE WHATSAPP
====================================================
Esta función construye el texto que se enviará
al abrir WhatsApp con la reserva.
*/

export function buildWhatsAppMessage(data) {

  const {
    requestDate,
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
RESERVATION REQUEST

Request date: ${requestDate}

Service: ${serviceType}
Round trip: ${roundTrip ? "Yes" : "No"}

Passenger name: ${fullName}
Phone: ${phone}
Email: ${email}

Passengers: ${passengers}
Baby seat: ${babySeat ? "Yes" : "No"}

ARRIVAL
Date: ${arrivalDate}
ETA: ${arrivalTime}
Airline: ${arrivalAirline}
Flight: ${arrivalFlight}
Origin: ${arrivalOrigin}
Destination: ${destination}

${roundTrip ? `

DEPARTURE
Date: ${departureDate}
ETD: ${departureTime}
Airline: ${departureAirline}
Flight: ${departureFlight}

` : ""}

Estimated total: $${totalPrice} USD
`;

}