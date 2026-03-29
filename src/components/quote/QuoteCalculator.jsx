import React, { useState } from "react";
import { PRICING } from "../../data/pricing";

/*
====================================================
COMPONENTE VISUAL PARA TARJETAS
====================================================
Se usa para organizar el formulario en bloques
claros tipo aplicación de reservas.
*/

function SectionCard({ title, children }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}
    >
      <h3
        style={{
          marginBottom: "15px",
          borderBottom: "1px solid #eee",
          paddingBottom: "8px"
        }}
      >
        {title}
      </h3>

      {children}
    </div>
  );
}

/*
====================================================
COMPONENTE PRINCIPAL DEL COTIZADOR
====================================================
*/

export default function QuoteCalculator() {

  /*
  ====================================================
  FECHA AUTOMÁTICA DE SOLICITUD
  ====================================================
  */

  const requestDate = new Date().toLocaleString();

  /*
  ====================================================
  DATOS DEL PASAJERO
  ====================================================
  */

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [babySeat, setBabySeat] = useState(false);

  /*
  ====================================================
  TIPO DE SERVICIO
  ====================================================
  VIP o PLATINUM
  */

  const [serviceType, setServiceType] = useState("VIP");

  /*
  ====================================================
  TIPO DE VIAJE
  ====================================================
  */

  const [roundTrip, setRoundTrip] = useState(false);

  /*
  ====================================================
  INFORMACIÓN DE LLEGADA
  ====================================================
  */

  const [arrivalDate, setArrivalDate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [arrivalAirline, setArrivalAirline] = useState("");
  const [arrivalFlight, setArrivalFlight] = useState("");
  const [arrivalOrigin, setArrivalOrigin] = useState("");
  const [destination, setDestination] = useState("");

  /*
  ====================================================
  INFORMACIÓN DE SALIDA
  ====================================================
  SOLO SI EL VIAJE ES REDONDO
  */

  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [departureAirline, setDepartureAirline] = useState("");
  const [departureFlight, setDepartureFlight] = useState("");

  /*
  ====================================================
  FUNCIÓN PRINCIPAL DE CÁLCULO
  ====================================================
  Usa las tarifas definidas en pricing.js
  */

  const calculateTotal = () => {

    if (!passengers || passengers < 1) return 0;

    let total = 0;

    /*
    ==========================================
    SERVICIO VIP
    ==========================================
    */

    if (serviceType === "VIP") {

      if (!roundTrip) {
        total = passengers * PRICING.VIP.oneWay;
      } else {
        total = passengers * PRICING.VIP.roundTrip;
      }

    }

    /*
    ==========================================
    SERVICIO PLATINUM
    ==========================================
    */

    if (serviceType === "PLATINUM") {

      if (!roundTrip) {

        if (passengers <= 4) {
          total = PRICING.PLATINUM.baseOneWay;
        } else {

          const extraPassengers = passengers - 4;

          total =
            PRICING.PLATINUM.baseOneWay +
            extraPassengers * PRICING.PLATINUM.extraPassengerOneWay;

        }

      } else {

        if (passengers <= 4) {
          total = PRICING.PLATINUM.baseRoundTrip;
        } else {

          const extraPassengers = passengers - 4;

          total =
            PRICING.PLATINUM.baseRoundTrip +
            extraPassengers * PRICING.PLATINUM.extraPassengerRoundTrip;

        }

      }

    }

    return total;

  };

  const totalPrice = calculateTotal();

  /*
  ====================================================
  ENVÍO DE RESERVA A WHATSAPP
  ====================================================
  */

  const sendToWhatsApp = () => {

    const phoneNumber = "5219982594817"; // CAMBIAR

    const message = `
AGI TOURS & TRANSFERS
ISLA MUJERES EXPRESS
AIRPORT TRANSFER REQUEST

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

    const encodedMessage = encodeURIComponent(message);

    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(url, "_blank");

  };

  /*
  ====================================================
  INTERFAZ DEL FORMULARIO
  ====================================================
  */

  return (

    <div
      style={{
        maxWidth: "700px",
        margin: "auto",
        padding: "20px",
        fontFamily: "Arial"
      }}
    >

      <SectionCard title="Service Type">

        <label>
          <input
            type="radio"
            value="VIP"
            checked={serviceType === "VIP"}
            onChange={(e) => setServiceType(e.target.value)}
          />
          VIP Transfer
        </label>

        <br /><br />

        <label>
          <input
            type="radio"
            value="PLATINUM"
            checked={serviceType === "PLATINUM"}
            onChange={(e) => setServiceType(e.target.value)}
          />
          PLATINUM Private Transfer
        </label>

      </SectionCard>

      <SectionCard title="Trip Type">

        <label>
          <input
            type="checkbox"
            checked={roundTrip}
            onChange={(e) => setRoundTrip(e.target.checked)}
          />
          Round Trip
        </label>

      </SectionCard>

      <SectionCard title="Passenger Information">

        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <br /><br />

        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <label>Passengers</label>

        <input
          type="number"
          min="1"
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
        />

        <br /><br />

        <label>
          <input
            type="checkbox"
            checked={babySeat}
            onChange={(e) => setBabySeat(e.target.checked)}
          />
          Baby seat required
        </label>

      </SectionCard>

      <SectionCard title="Arrival Information">

        <input
          type="date"
          value={arrivalDate}
          onChange={(e) => setArrivalDate(e.target.value)}
        />

        <br /><br />

        <input
          type="time"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Airline"
          value={arrivalAirline}
          onChange={(e) => setArrivalAirline(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Flight number"
          value={arrivalFlight}
          onChange={(e) => setArrivalFlight(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Origin"
          value={arrivalOrigin}
          onChange={(e) => setArrivalOrigin(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Hotel / Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

      </SectionCard>

      {roundTrip && (

        <SectionCard title="Departure Information">

          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />

          <br /><br />

          <input
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
          />

          <br /><br />

          <input
            type="text"
            placeholder="Airline"
            value={departureAirline}
            onChange={(e) => setDepartureAirline(e.target.value)}
          />

          <br /><br />

          <input
            type="text"
            placeholder="Flight number"
            value={departureFlight}
            onChange={(e) => setDepartureFlight(e.target.value)}
          />

        </SectionCard>

      )}

      <SectionCard title="Estimated Price">

        <h2>${totalPrice} USD</h2>

        <button
          onClick={sendToWhatsApp}
          style={{
            background: "#25D366",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Reserve via WhatsApp
        </button>

      </SectionCard>

    </div>

  );

}