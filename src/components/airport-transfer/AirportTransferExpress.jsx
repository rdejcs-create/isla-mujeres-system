import { useMemo, useState } from "react";
import {
  PASSENGER_RANGES,
  getOneWayRate,
  getRoundTripRate,
} from "../../data/airportTransferRates";
import {
  AIRPORT_HOTELS,
  findAirportHotel,
} from "../../data/airportHotels";
import { AIRPORT_TRANSFER_WHATSAPP } from "../../data/airportTransferConfig";

import {
  breakDownIva,
  formatUsd,
  formatNumber,
} from "../../utils/tax";

const initialFlight = {
  date: "",
  time: "",
  airline: "",
  flightNumber: "",
};

const fieldStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px",
  border: "1px solid #cbd5e1",
  borderRadius: "7px",
  fontSize: "15px",
  background: "#fff",
};

const labelStyle = {
  display: "block",
  fontWeight: 600,
  marginBottom: "6px",
  color: "#334155",
};

const API_URL =
  "https://script.google.com/macros/s/AKfycbyp9uoH100kAUxfKjx4sI6fOnt38FIjZYl-5OgjThh0Q636CXW3LSKz900kCO8zLzPK/exec";

function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: "16px" }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
}

// FIX: helper puro para construir el string de observaciones.
// Al estar fuera del componente, es fácil de testear y no puede
// "olvidarse" de una variable en el scope del handler.
function buildObservaciones({
  requestDate,
  finalHotel,
  zone,
  tripLabel,
  passengerCount,
  babySeat,
  quotedRateLines,
  arrival,
  departure,
  tripType,
}) {
  return [
    `Request date: ${requestDate}`,
    `Hotel: ${finalHotel}`,
    `Zone: ${zone ?? "To be confirmed"}`,
    `Trip type: ${tripLabel}`,
    `Passengers: ${passengerCount}`,
    `Baby seat: ${babySeat ? "Yes" : "No"}`,
    `Quoted rate: ${quotedRateLines}`,
    `Arrival date: ${arrival.date}`,
    `Arrival time: ${arrival.time}`,
    `Arrival airline: ${arrival.airline.trim()}`,
    `Arrival flight number: ${arrival.flightNumber.trim()}`,
    ...(tripType === "round"
      ? [
          `Return date: ${departure.date}`,
          `Return time: ${departure.time}`,
          `Return airline: ${departure.airline.trim()}`,
          `Return flight number: ${departure.flightNumber.trim()}`,
        ]
      : []),
  ].join(" | ");
}

export default function AirportTransferExpress() {
  const [hotelName, setHotelName] = useState("");
  const [customHotel, setCustomHotel] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [babySeat, setBabySeat] = useState(false);
  const [tripType, setTripType] = useState("round");
  const [arrival, setArrival] = useState(initialFlight);
  const [departure, setDeparture] = useState(initialFlight);
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedHotel = useMemo(
    () => findAirportHotel(hotelName),
    [hotelName]
  );

  const isCustomHotel = hotelName === "__other__";
  const passengerCount = Number(passengers);
  const validPassengerCount =
    Number.isInteger(passengerCount) && passengerCount >= 1;

  const zone = selectedHotel?.zone ?? null;

  const oneWayRate =
    zone && validPassengerCount && passengerCount <= 16
      ? getOneWayRate(zone, passengerCount)
      : null;

  const roundTripRate =
    zone && validPassengerCount && passengerCount <= 16
      ? getRoundTripRate(zone, passengerCount)
      : null;

  const price =
    tripType === "round" ? roundTripRate : oneWayRate;

  const canShowPrice =
    !isCustomHotel &&
    Boolean(selectedHotel) &&
    validPassengerCount &&
    passengerCount <= 16 &&
    price !== null;

  // Desglose IVA (Modelo B: se suma encima del subtotal)
  const ivaBreakdown = breakDownIva(canShowPrice ? price : 0);

  function updateArrival(field, value) {
    setArrival((previous) => ({ ...previous, [field]: value }));
  }

  function updateDeparture(field, value) {
    setDeparture((previous) => ({ ...previous, [field]: value }));
  }

  function updateContact(field, value) {
    setContact((previous) => ({ ...previous, [field]: value }));
  }

  function handleHotelChange(value) {
    setHotelName(value);
    setCustomHotel("");
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    // FIX: marcar como enviando desde el inicio, para que cualquier
    // error (validación, construcción, fetch) deshabilite el botón
    // y no quede habilitado para reintentos accidentales.
    setIsSubmitting(true);

    // FIX: try/catch/finally externo que envuelve TODO el handler.
    // Antes, los errores de validación/construcción quedaban fuera
    // del try y se convertían en "el botón no hace nada".
    try {
      const finalHotel = isCustomHotel
        ? customHotel.trim()
        : selectedHotel?.name;

      if (!finalHotel) {
        alert("Please enter or select your hotel.");
        return;
      }

      if (!validPassengerCount) {
        alert("Please enter a valid number of passengers.");
        return;
      }

      if (
        !arrival.date ||
        !arrival.time ||
        !arrival.airline.trim() ||
        !arrival.flightNumber.trim()
      ) {
        alert("Please complete all arrival flight details.");
        return;
      }

      if (
        tripType === "round" &&
        (!departure.date ||
          !departure.time ||
          !departure.airline.trim() ||
          !departure.flightNumber.trim())
      ) {
        alert("Please complete all return flight details.");
        return;
      }

      if (!contact.name.trim() || !contact.phone.trim()) {
        alert("Please enter your name and contact phone number.");
        return;
      }

      const configuredPhone =
        import.meta.env.VITE_WHATSAPP_NUMBER ||
        AIRPORT_TRANSFER_WHATSAPP;

      const phoneNumber = String(configuredPhone || "").replace(/\D/g, "");

      if (!phoneNumber) {
        alert(
          "The WhatsApp number has not been configured yet. Please contact the website administrator."
        );
        return;
      }

      const requestDate = new Date().toISOString();

      const tripLabel =
        tripType === "round" ? "Round Trip" : "One Way";

      const quotedRateLines = canShowPrice
        ? [
            `Subtotal: $${formatNumber(ivaBreakdown.subtotal)} USD`,
            `IVA (16%): $${formatNumber(ivaBreakdown.iva)} USD`,
            `Total: $${formatNumber(ivaBreakdown.total)} USD`,
          ].join(" | ")
        : "Special quote requested; price not automatically available";

      // FIX: renombrado a `observaciones` (antes `observations`).
      // Ese era el ReferenceError de la línea 234.
      const observaciones = buildObservaciones({
        requestDate,
        finalHotel,
        zone,
        tripLabel,
        passengerCount,
        babySeat,
        quotedRateLines,
        arrival,
        departure,
        tripType,
      });

      const opportunity = {
        producto: "Cancun Airport Transportation Express",
        modalidad: tripLabel,
        nombre: contact.name.trim(),
        whatsapp: contact.phone.trim(),
        email: contact.email.trim(),
        pasajeros: passengerCount,
        estado: "Nueva",
        responsable: "AGI",
        observaciones, // FIX: ahora sí existe la variable
      };

      // Reuse the same request ID for identical submissions
      // during a 24-hour window.
      const requestStorageKey =
        "agiAirportTransferExpress.lastRequest";

      const requestSignature = JSON.stringify(opportunity);

      const requestWindowMs = 24 * 60 * 60 * 1000;

      let requestId = "";

      try {
        const storedRequest =
          localStorage.getItem(requestStorageKey);

        if (storedRequest) {
          const parsedRequest = JSON.parse(storedRequest);

          const age = Date.now() - parsedRequest.createdAt;

          if (
            parsedRequest.signature === requestSignature &&
            age >= 0 &&
            age < requestWindowMs &&
            parsedRequest.requestId
          ) {
            requestId = parsedRequest.requestId;
          }
        }
      } catch (error) {
        console.warn("Could not read the saved request ID.", error);
      }

      if (!requestId) {
        requestId =
          typeof crypto !== "undefined" &&
          typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : "req-" +
              Date.now() +
              "-" +
              Math.random().toString(36).slice(2);

        try {
          localStorage.setItem(
            requestStorageKey,
            JSON.stringify({
              signature: requestSignature,
              requestId: requestId,
              createdAt: Date.now(),
            })
          );
        } catch (error) {
          console.warn("Could not save the request ID.", error);
        }
      }

      opportunity.requestId = requestId;

      const quoteMessageLines = canShowPrice
        ? [
            `Subtotal: ${formatUsd(ivaBreakdown.subtotal)}`,
            `IVA (16%): ${formatUsd(ivaBreakdown.iva)}`,
            `Total: ${formatUsd(ivaBreakdown.total)}`,
          ]
        : [
            "Quoted rate: Special quote requested; price not automatically available",
          ];

      const message = [
        "CANCUN AIRPORT TRANSPORTATION EXPRESS",
        "",
        `Opportunity reference: PENDING`,
        `Hotel: ${finalHotel}`,
        `Zone: ${zone ?? "To be confirmed"}`,
        `Passengers: ${passengerCount}`,
        `Baby seat: ${babySeat ? "REQUIRED" : "Not requested"}`,
        `Trip: ${tripLabel === "Round Trip" ? "Round trip (R/T)" : "One way (O/W)"}`,
        "",
        ...quoteMessageLines,
        "",
        "ARRIVAL FLIGHT",
        `Date: ${arrival.date}`,
        `Time: ${arrival.time}`,
        `Airline: ${arrival.airline.trim()}`,
        `Flight number: ${arrival.flightNumber.trim()}`,
        ...(tripType === "round"
          ? [
              "",
              "RETURN FLIGHT",
              `Date: ${departure.date}`,
              `Time: ${departure.time}`,
              `Airline: ${departure.airline.trim()}`,
              `Flight number: ${departure.flightNumber.trim()}`,
            ]
          : []),
        "",
        "CONTACT",
        `Name: ${contact.name.trim()}`,
        `Phone: ${contact.phone.trim()}`,
        `Email: ${contact.email.trim() || "Not provided"}`,
        "",
        "Please confirm availability and final service details.",
      ];

      // Reserve a browser tab before the asynchronous request.
      // This helps prevent the browser from blocking WhatsApp afterward.
      const whatsappWindow = window.open("about:blank", "_blank");

      // FIX: el fetch ya no tiene su propio try/finally; el try/catch
      // externo lo cubre. La limpieza de `isSubmitting` va en el
      // finally externo.
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(opportunity),
      });

      const responseText = await response.text();

      let result;

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(
          "The API returned an unexpected response. Please verify the registration before retrying."
        );
      }

      if (!response.ok || !result.success || !result.opportunityId) {
        throw new Error(
          result.error ||
            "The request could not be registered. Please verify the registration before retrying."
        );
      }

      // Clear the saved request only if it still belongs
      // to the request that was just confirmed.
      try {
        const storedRequest =
          localStorage.getItem(requestStorageKey);

        if (storedRequest) {
          const parsedRequest = JSON.parse(storedRequest);

          if (parsedRequest.requestId === requestId) {
            localStorage.removeItem(requestStorageKey);
          }
        }
      } catch (error) {
        console.warn("Could not clear the confirmed request ID.", error);
      }

      const confirmedMessage = [
        message[0],
        "",
        `Opportunity reference: ${result.opportunityId}`,
        ...message.slice(2),
      ].join("\n");

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        confirmedMessage
      )}`;

      if (whatsappWindow && !whatsappWindow.closed) {
        whatsappWindow.location.href = whatsappUrl;
      } else {
        alert(
          `Opportunity registered successfully. Reference: ${result.opportunityId}. Your browser blocked the WhatsApp tab; open WhatsApp manually to continue.`
        );
      }
    } catch (error) {
      console.error("Airport Express registration error:", error);
      alert(
        `${error.message || "An unexpected error occurred."}\n\nDo not submit again until you verify whether the opportunity was registered.`
      );
    } finally {
      // FIX: siempre liberar el botón, pase lo que pase.
      setIsSubmitting(false);
    }
  }

  const selectStyle = fieldStyle;

  return (
    <main
      style={{
        maxWidth: "850px",
        margin: "0 auto",
        padding: "24px 16px 40px",
        color: "#0f172a",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header style={{ marginBottom: "26px" }}>
        <h2>CANCUN AIRPORT TRANSPORTATION EXPRESS</h2>
        <p style={{ color: "#475569", lineHeight: 1.6 }}>
          Request your airport transfer quote. Rates are in USD per vehicle
          and depend on your destination and total number of passengers.
        </p>
      </header>

      <form onSubmit={(e) => e.preventDefault()}>
        <section
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "20px", marginTop: 0 }}>
            1. Destination and passengers
          </h2>

          <Field label="Hotel or destination">
            <select
              value={hotelName}
              onChange={(event) => handleHotelChange(event.target.value)}
              style={selectStyle}
              required
            >
              <option value="">Select your hotel</option>
              {AIRPORT_HOTELS.slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((hotel) => (
                  <option key={hotel.name} value={hotel.name}>
                    {hotel.name}
                  </option>
                ))}
              <option value="__other__">My hotel is not listed</option>
            </select>
          </Field>

          {isCustomHotel && (
            <Field label="Enter your hotel name">
              <input
                value={customHotel}
                onChange={(event) => setCustomHotel(event.target.value)}
                placeholder="Hotel or accommodation name"
                style={fieldStyle}
                required
              />
            </Field>
          )}

          {selectedHotel && (
            <p style={{ color: "#475569", marginTop: "-6px" }}>
              Destination zone: <strong>{selectedHotel.zone}</strong>
            </p>
          )}

          <Field label="Total passengers">
            <input
              type="number"
              min="1"
              max="99"
              step="1"
              value={passengers}
              onChange={(event) => setPassengers(event.target.value)}
              style={fieldStyle}
              required
            />
          </Field>

          <Field label="Baby seat">
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#334155",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={babySeat}
                onChange={(event) => setBabySeat(event.target.checked)}
              />
              Baby seat required
            </label>
          </Field>

          <Field label="Trip type">
            <select
              value={tripType}
              onChange={(event) => setTripType(event.target.value)}
              style={selectStyle}
            >
              <option value="round">Round trip (R/T)</option>
              <option value="oneway">One way (O/W)</option>
            </select>
          </Field>

          <div
            style={{
              background: "#f8fafc",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            {canShowPrice ? (
              <>
                <p style={{ margin: "0 0 6px", color: "#475569" }}>
                  Estimated price per vehicle
                </p>

                <div className="agi-iva-breakdown">
                  <div className="agi-iva-row">
                    <span>Subtotal</span>
                    <span>{formatUsd(ivaBreakdown.subtotal)}</span>
                  </div>
                  <div className="agi-iva-row">
                    <span>IVA (16%)</span>
                    <span>{formatUsd(ivaBreakdown.iva)}</span>
                  </div>
                  <div className="agi-iva-row agi-iva-total">
                    <span>Total</span>
                    <span>{formatUsd(ivaBreakdown.total)}</span>
                  </div>
                </div>

                <p
                  style={{
                    marginBottom: 0,
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  {tripType === "round"
                    ? "Round trip"
                    : "One-way trip."}{" "}
                  Prices shown as subtotal are before taxes. IVA (16%)
                  is added to calculate the total.
                </p>
              </>
            ) : (
              <>
                <strong>
                  {!validPassengerCount
                    ? "Enter a valid passenger count"
                    : passengerCount > 16
                    ? "Special quote required"
                    : isCustomHotel
                    ? "Hotel verification required"
                    : "Select a listed hotel to view the rate"}
                </strong>
                <p style={{ marginBottom: 0, color: "#64748b" }}>
                  No automatic price will be assigned until the destination
                  and applicable rate are confirmed. The final quote will
                  include 16% IVA.
                </p>
              </>
            )}
          </div>

          <p
            style={{
              fontSize: "13px",
              color: "#64748b",
              lineHeight: 1.5,
            }}
          >
            Maximum vehicle passenger capacity ranges:{" "}
            {PASSENGER_RANGES.map((range) => range.label).join(", ")}. Groups
            larger than 16 passengers require a custom quote.
          </p>
        </section>

        <section
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "20px", marginTop: 0 }}>
            2. Arrival flight
          </h2>

          <Field label="Arrival date">
            <input
              type="date"
              value={arrival.date}
              onChange={(event) => updateArrival("date", event.target.value)}
              style={fieldStyle}
              required
            />
          </Field>

          <Field label="Arrival time">
            <input
              type="time"
              value={arrival.time}
              onChange={(event) => updateArrival("time", event.target.value)}
              style={fieldStyle}
              required
            />
          </Field>

          <Field label="Airline">
            <input
              value={arrival.airline}
              onChange={(event) =>
                updateArrival("airline", event.target.value)
              }
              placeholder="Airline name"
              style={fieldStyle}
              required
            />
          </Field>

          <Field label="Arrival flight number">
            <input
              value={arrival.flightNumber}
              onChange={(event) =>
                updateArrival("flightNumber", event.target.value)
              }
              placeholder="e.g. AA1234"
              style={fieldStyle}
              required
            />
          </Field>

          {tripType === "round" && (
            <>
              <h2 style={{ fontSize: "20px", marginTop: "28px" }}>
                Return flight
              </h2>

              <Field label="Return date">
                <input
                  type="date"
                  value={departure.date}
                  onChange={(event) =>
                    updateDeparture("date", event.target.value)
                  }
                  style={fieldStyle}
                  required
                />
              </Field>

              <Field label="Return time">
                <input
                  type="time"
                  value={departure.time}
                  onChange={(event) =>
                    updateDeparture("time", event.target.value)
                  }
                  style={fieldStyle}
                  required
                />
              </Field>

              <Field label="Return airline">
                <input
                  value={departure.airline}
                  onChange={(event) =>
                    updateDeparture("airline", event.target.value)
                  }
                  placeholder="Airline name"
                  style={fieldStyle}
                  required
                />
              </Field>

              <Field label="Return flight number">
                <input
                  value={departure.flightNumber}
                  onChange={(event) =>
                    updateDeparture("flightNumber", event.target.value)
                  }
                  placeholder="e.g. AA1235"
                  style={fieldStyle}
                  required
                />
              </Field>
            </>
          )}
        </section>

        <section
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "20px", marginTop: 0 }}>
            3. Contact information
          </h2>

          <Field label="Full name">
            <input
              value={contact.name}
              onChange={(event) => updateContact("name", event.target.value)}
              autoComplete="name"
              style={fieldStyle}
              required
            />
          </Field>

          <Field label="Phone number with country code">
            <input
              type="tel"
              value={contact.phone}
              onChange={(event) => updateContact("phone", event.target.value)}
              autoComplete="tel"
              placeholder="+1 555 123 4567"
              style={fieldStyle}
              required
            />
          </Field>

          <Field label="Email (optional)">
            <input
              type="email"
              value={contact.email}
              onChange={(event) => updateContact("email", event.target.value)}
              autoComplete="email"
              style={fieldStyle}
            />
          </Field>
        </section>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "15px 20px",
            border: 0,
            borderRadius: "8px",
            background: isSubmitting ? "#64748b" : "#0f766e",
            color: "#fff",
            fontSize: "16px",
            fontWeight: 700,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.8 : 1,
          }}
        >
          {isSubmitting ? "Registering request..." : "Reserve via WhatsApp"}
        </button>

        <p
          style={{
            fontSize: "13px",
            color: "#64748b",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          This request is subject to confirmation by AGI TOURS. An AGI TOURS
          representative will review your request and contact you via WhatsApp
          with a personalized quote and payment information.
        </p>
      </form>
    </main>
  );
}