import React, { useState, useEffect } from "react";

import {
  VIP_PRICING,
  PLATINUM_PRICING
} from "../../data/pricing";

import {
  buildWhatsAppMessage
} from "../../utils/whatsappMessage";

import {
  getOrCreateRequestId,
  clearRequestId
} from "../../utils/requestId";

// <-- NUEVO
import {
  breakDownIva,
  formatUsd,
  formatNumber
} from "../../utils/tax";


/*
 * =========================================================
 * AGI MOBILITY PLATFORM
 * ISLA MUJERES EXPRESS
 * =========================================================
 *
 * Precios base ANTES de impuestos (Modelo B).
 * El IVA (16%) se suma y se muestra el desglose.
 */

const API_URL =
  "https://script.google.com/macros/s/AKfycbyp9uoH100kAUxfKjx4sI6fOnt38FIjZYl-5OgjThh0Q636CXW3LSKz900kCO8zLzPK/exec";

const REQUEST_STORAGE_KEY =
  "agiIslaMujeresExpress.lastRequest";


export default function QuoteCalculator() {

  // =======================================================
  // STATE
  // =======================================================

  const [serviceType, setServiceType] = useState("VIP");
  const [roundTrip, setRoundTrip] = useState(true);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [babySeat, setBabySeat] = useState(false);

  const [arrivalDate, setArrivalDate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [arrivalAirline, setArrivalAirline] = useState("");
  const [arrivalFlight, setArrivalFlight] = useState("");
  const [arrivalOrigin, setArrivalOrigin] = useState("");

  const [destination, setDestination] = useState("");

  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [departureAirline, setDepartureAirline] = useState("");
  const [departureFlight, setDepartureFlight] = useState("");

  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [opportunityReference, setOpportunityReference] = useState("");
  const [registeredQuoteKey, setRegisteredQuoteKey] = useState("");

  const [showAssistance, setShowAssistance] = useState(false);
  const [assistanceMethod, setAssistanceMethod] = useState("");
  const [assistanceEmail, setAssistanceEmail] = useState("");
  const [preferredCallWindow, setPreferredCallWindow] = useState("");
  const [assistanceDetails, setAssistanceDetails] = useState("");
  const [isRequestingAssistance, setIsRequestingAssistance] = useState(false);
  const [assistanceMessage, setAssistanceMessage] = useState("");
  const [assistanceSubmitted, setAssistanceSubmitted] = useState(false);


  // =======================================================
  // PRICE CALCULATION (subtotal, sin IVA)
  // =======================================================

  useEffect(() => {

    let price = 0;

    if (serviceType === "VIP") {
      price = roundTrip
        ? passengers * VIP_PRICING.round
        : passengers * VIP_PRICING.oneway;
    }

    if (serviceType === "PLATINUM") {
      if (passengers <= 4) {
        price = roundTrip
          ? PLATINUM_PRICING.base_round
          : PLATINUM_PRICING.base_oneway;
      } else {
        const extra = passengers - 4;
        price = roundTrip
          ? PLATINUM_PRICING.base_round + extra * PLATINUM_PRICING.extra_round
          : PLATINUM_PRICING.base_oneway + extra * PLATINUM_PRICING.extra_oneway;
      }
    }

    setTotalPrice(price);

  }, [serviceType, passengers, roundTrip]);


  // <-- NUEVO
  // Desglose IVA (Modelo B: se suma encima del subtotal)
  const ivaBreakdown = breakDownIva(totalPrice);


  // =======================================================
  // VALIDATION
  // =======================================================

  const validateForm = () => {

    if (!fullName.trim()) {
      setErrorMessage("Please enter passenger name.");
      return false;
    }

    if (!arrivalDate) {
      setErrorMessage("Please select arrival date.");
      return false;
    }

    if (!arrivalOrigin.trim()) {
      setErrorMessage("Please enter the arrival origin.");
      return false;
    }

    if (!destination.trim()) {
      setErrorMessage("Please enter where you should be taken in Isla Mujeres.");
      return false;
    }

    if (roundTrip && !departureDate) {
      setErrorMessage("Please select return date.");
      return false;
    }

    setErrorMessage("");
    return true;
  };


  // =======================================================
  // QUOTE KEY
  // =======================================================

  const getQuoteKey = () => {
    return JSON.stringify({
      serviceType,
      roundTrip,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      passengers,
      babySeat,
      arrivalDate,
      arrivalTime,
      arrivalAirline: arrivalAirline.trim(),
      arrivalFlight: arrivalFlight.trim(),
      arrivalOrigin: arrivalOrigin.trim(),
      destination: destination.trim(),
      departureDate,
      departureTime,
      departureAirline: departureAirline.trim(),
      departureFlight: departureFlight.trim(),
      totalPrice
    });
  };


  // =======================================================
  // REGISTER OPPORTUNITY
  // =======================================================

  const registerOpportunity = async () => {

    const currentQuoteKey = getQuoteKey();

    if (opportunityReference && registeredQuoteKey === currentQuoteKey) {
      return opportunityReference;
    }

    const requestDate = new Date().toLocaleString();

    const opportunity = {

      producto: "Isla Mujeres Express",

      modalidad: roundTrip ? "Round Trip" : "One Way",

      nombre: fullName.trim(),

      whatsapp: phone.trim(),

      email: email.trim(),

      pasajeros: passengers,

      estado: "Nueva",

      responsable: "AGI",

      observaciones: [
        `Request date: ${requestDate}`,
        `Service: ${serviceType}`,
        `Trip type: ${roundTrip ? "Round Trip" : "One Way"}`,
        `Baby seat: ${babySeat ? "Yes" : "No"}`,
        `Arrival date: ${arrivalDate}`,
        `Arrival time: ${arrivalTime || "Not provided"}`,
        `Arrival airline: ${arrivalAirline || "Not provided"}`,
        `Arrival flight: ${arrivalFlight || "Not provided"}`,
        `Origin: ${arrivalOrigin}`,
        `Isla Mujeres accommodation/destination: ${destination}`,
        roundTrip ? `Return date: ${departureDate}` : "",
        roundTrip ? `Return time: ${departureTime || "Not provided"}` : "",
        roundTrip ? `Return airline: ${departureAirline || "Not provided"}` : "",
        roundTrip ? `Return flight: ${departureFlight || "Not provided"}` : "",
        // <-- NUEVO: desglose con IVA
        `Subtotal: $${formatNumber(ivaBreakdown.subtotal)} USD`,
        `IVA (16%): $${formatNumber(ivaBreakdown.iva)} USD`,
        `Total: $${formatNumber(ivaBreakdown.total)} USD`
      ]
        .filter(Boolean)
        .join(" | ")
    };

    // Request ID estable por firma
    const requestSignature = JSON.stringify(opportunity);
    const requestId = getOrCreateRequestId(
      REQUEST_STORAGE_KEY,
      requestSignature
    );
    opportunity.requestId = requestId;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(opportunity)
    });

    const responseText = await response.text();

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (error) {
      throw new Error("The API returned an unexpected response.");
    }

    if (!result.success || !result.opportunityId) {
      throw new Error(
        result.error || "The request could not be registered."
      );
    }

    clearRequestId(REQUEST_STORAGE_KEY, requestId);

    setOpportunityReference(result.opportunityId);
    setRegisteredQuoteKey(currentQuoteKey);

    return result.opportunityId;
  };


  // =======================================================
  // WHATSAPP
  // =======================================================

  const sendToWhatsApp = async () => {

    if (!validateForm()) return;
    if (isSending) return;

    setIsSending(true);
    setErrorMessage("");

    try {

      const opportunityId = await registerOpportunity();

      const phoneNumber =
        import.meta.env.VITE_WHATSAPP_NUMBER || "529982594817";

      const message = buildWhatsAppMessage({
        requestDate: new Date().toLocaleString(),
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
        totalPrice,        // legacy
        ivaBreakdown       // <-- NUEVO
      });

      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank");

      setAssistanceMessage("");

    } catch (error) {

      console.error("AGI Mobility Platform:", error);

      setErrorMessage(
        "We could not register your request. Please try again or contact AGI directly via WhatsApp."
      );

    } finally {
      setIsSending(false);
    }
  };


  // =======================================================
  // ASSISTANCE
  // =======================================================

  const openAssistance = () => {
    setAssistanceMessage("");
    setErrorMessage("");
    setAssistanceEmail(email.trim());
    setAssistanceMethod("");
    setPreferredCallWindow("");
    setAssistanceDetails("");
    setAssistanceSubmitted(false);
    setShowAssistance(true);
  };


  const validateAssistance = () => {

    if (!opportunityReference) {
      setAssistanceMessage(
        "Your request does not have a valid Reference yet. Please complete the quote request first."
      );
      return false;
    }

    if (!assistanceMethod) {
      setAssistanceMessage(
        "Please select how you would like us to assist you."
      );
      return false;
    }

    if (assistanceMethod === "Email" && !assistanceEmail.trim()) {
      setAssistanceMessage(
        "Please enter the email address where we should contact you."
      );
      return false;
    }

    if (assistanceMethod === "Phone call" && !preferredCallWindow) {
      setAssistanceMessage(
        "Please select your preferred call time."
      );
      return false;
    }

    setAssistanceMessage("");
    return true;
  };


  const requestAssistance = async () => {

    if (!validateAssistance()) return;
    if (isRequestingAssistance) return;

    setIsRequestingAssistance(true);
    setAssistanceMessage("");

    try {

      const customerTimeZone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";

      const assistanceDateTime = new Date().toISOString();

      const assistanceRequest = {
        action: "updateAssistance",
        reference: opportunityReference,
        assistanceRequested: "Yes",
        assistanceMethod: assistanceMethod,
        preferredCallWindow:
          assistanceMethod === "Phone call" ? preferredCallWindow : "",
        customerTimeZone: customerTimeZone,
        assistanceDetails: assistanceDetails.trim() || "",
        assistanceStatus: "Requested",
        assistanceDateTime: assistanceDateTime,
        agiCallWindow: "",
        customerCallWindow: "",
        assistanceEmail:
          assistanceMethod === "Email" ? assistanceEmail.trim() : ""
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(assistanceRequest)
      });

      const responseText = await response.text();
      let result;

      try {
        result = JSON.parse(responseText);
      } catch (error) {
        throw new Error("The API returned an unexpected response.");
      }

      if (!result.success || !result.reference) {
        throw new Error(
          result.error || "The assistance request could not be registered."
        );
      }

      setOpportunityReference(result.reference);

      if (assistanceMethod === "Email") {
        setEmail(assistanceEmail.trim());
      }

      setAssistanceSubmitted(true);
      setAssistanceMessage("");

    } catch (error) {

      console.error("AGI Mobility Platform - Assistance:", error);

      setAssistanceMessage(
        error.message ||
        "We could not register your assistance request. Please try again or contact AGI directly via WhatsApp."
      );

    } finally {
      setIsRequestingAssistance(false);
    }
  };


  // =======================================================
  // UI
  // =======================================================

  return (
    <div>

      <h2>ISLA MUJERES EXPRESS</h2>

      <p>
        Please provide the following information
        to generate your quote; if you accept it,
        you will be able to quickly book your
        transfer via WhatsApp.
      </p>

      <h3>Service</h3>

      <select
        value={serviceType}
        onChange={(e) => setServiceType(e.target.value)}
      >
        <option value="VIP">VIP</option>
        <option value="PLATINUM">PLATINUM</option>
      </select>

      <h3>Trip Type</h3>

      <div className="agi-trip-type">
        <label className="agi-trip-option">
          <input
            type="radio"
            name="islaMujeresTripType"
            checked={!roundTrip}
            onChange={() => setRoundTrip(false)}
          />
          {" "}One Way
        </label>
        <label className="agi-trip-option">
          <input
            type="radio"
            name="islaMujeresTripType"
            checked={roundTrip}
            onChange={() => setRoundTrip(true)}
          />
          {" "}Round Trip
        </label>
      </div>

      <h3>Passenger Information</h3>

      <input
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        placeholder="WhatsApp"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <h3>Passengers</h3>

      <label>Number of passengers</label>

      <input
        type="number"
        min="1"
        value={passengers}
        onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
      />

      <br /><br />

      <label>
        <input
          type="checkbox"
          checked={babySeat}
          onChange={(e) => setBabySeat(e.target.checked)}
        />
        {" "}Baby seat required
      </label>

      <h3>Arrival Information</h3>
      <p className="agi-section-description">
        Please provide your arrival information so we can coordinate your transfer from Cancún Airport.
      </p>

      <label>Arrival date</label>
      <input
        type="date"
        value={arrivalDate}
        onChange={(e) => setArrivalDate(e.target.value)}
      />

      <label>Arrival time</label>
      <input
        type="time"
        value={arrivalTime}
        onChange={(e) => setArrivalTime(e.target.value)}
      />

      <input
        placeholder="Airline name"
        value={arrivalAirline}
        onChange={(e) => setArrivalAirline(e.target.value)}
      />

      <input
        placeholder="Flight number"
        value={arrivalFlight}
        onChange={(e) => setArrivalFlight(e.target.value)}
      />

      <input
        placeholder="City or airport of departure"
        value={arrivalOrigin}
        onChange={(e) => setArrivalOrigin(e.target.value)}
      />

      <h3>Destination in Isla Mujeres</h3>

      <p className="agi-section-description">
        Please tell us where you would like to be taken in Isla Mujeres.
      </p>

      <input
        placeholder="Hotel, accommodation or private address"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      {roundTrip && (
        <>
          <h3>Return Trip</h3>

          <p className="agi-section-description">
            If you are booking a Round Trip service, please provide your return travel information.
          </p>

          <label>Return date</label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />

          <label>Return time</label>
          <input
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
          />

          <input
            placeholder="Airline name"
            value={departureAirline}
            onChange={(e) => setDepartureAirline(e.target.value)}
          />

          <input
            placeholder="Flight number"
            value={departureFlight}
            onChange={(e) => setDepartureFlight(e.target.value)}
          />
        </>
      )}

      {/* =================================================
          QUOTE (con desglose IVA)  <-- NUEVO
      ================================================== */}

      <div className="agi-total">

        <span className="agi-total-label">
          Your Instant Quote
        </span>

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

        <p className="agi-note">
          Prices shown as subtotal are before taxes. IVA (16%)
          is added to calculate the total.
        </p>

        <p className="agi-note">
          This request is subject to confirmation
          by AGI TOURS. An AGI TOURS representative
          will review your request and contact you
          via WhatsApp with a personalized quote
          and payment information.
        </p>

      </div>

      {errorMessage && (
        <p className="agi-error">{errorMessage}</p>
      )}

      <button
        className="agi-primary-button"
        onClick={sendToWhatsApp}
        disabled={isSending}
      >
        {isSending ? "Registering request..." : "Reserve via WhatsApp"}
      </button>

      {/* =================================================
          ASSISTANCE
      ================================================== */}

      {opportunityReference && (
        <>
          {!showAssistance && (
            <button
              type="button"
              className="agi-primary-button"
              onClick={openAssistance}
            >
              Request Assistance
            </button>
          )}

          {showAssistance && (
            <section>

              {!assistanceSubmitted ? (
                <>
                  <h3>Request Assistance</h3>

                  <p>How would you like us to assist you?</p>

                  <div className="agi-trip-type">
                    <label className="agi-trip-option">
                      <input
                        type="radio"
                        name="assistanceMethod"
                        value="Phone call"
                        checked={assistanceMethod === "Phone call"}
                        onChange={() => setAssistanceMethod("Phone call")}
                      />
                      {" "}Phone call
                    </label>
                    <label className="agi-trip-option">
                      <input
                        type="radio"
                        name="assistanceMethod"
                        value="Email"
                        checked={assistanceMethod === "Email"}
                        onChange={() => setAssistanceMethod("Email")}
                      />
                      {" "}Email
                    </label>
                  </div>

                  {assistanceMethod === "Email" && (
                    <>
                      <label>Email address</label>
                      <input
                        type="email"
                        value={assistanceEmail}
                        onChange={(e) => setAssistanceEmail(e.target.value)}
                      />
                    </>
                  )}

                  {assistanceMethod === "Phone call" && (
                    <>
                      <label>Preferred call time</label>
                      <select
                        value={preferredCallWindow}
                        onChange={(e) => setPreferredCallWindow(e.target.value)}
                      >
                        <option value="">Select a preferred time</option>
                        <option value="Morning">Morning — 8:00 AM–12:00 PM</option>
                        <option value="Afternoon">Afternoon — 12:00 PM–5:00 PM</option>
                        <option value="Evening">Evening — 5:00 PM–8:00 PM</option>
                      </select>
                      <p className="agi-note">
                        All times are based on Cancún local time (EST, UTC−5).
                      </p>
                    </>
                  )}

                  <label>
                    Is there anything specific you would like us to assist you with?
                  </label>
                  <textarea
                    rows="5"
                    value={assistanceDetails}
                    onChange={(e) => setAssistanceDetails(e.target.value)}
                  />

                  {assistanceMessage && (
                    <p className="agi-note">{assistanceMessage}</p>
                  )}

                  <button
                    type="button"
                    className="agi-primary-button"
                    onClick={requestAssistance}
                    disabled={isRequestingAssistance}
                  >
                    {isRequestingAssistance
                      ? "Sending assistance request..."
                      : "Send Assistance Request"}
                  </button>
                </>
              ) : (
                <div className="agi-assistance-confirmation">
                  <h3>Assistance request received</h3>
                  <p>
                    Thank you. Your assistance request has been received.
                    An AGI TOURS representative will contact you using your
                    preferred method.
                  </p>
                  <p>
                    <strong>Reference: {opportunityReference}</strong>
                  </p>
                </div>
              )}

            </section>
          )}
        </>
      )}

    </div>
  );
}