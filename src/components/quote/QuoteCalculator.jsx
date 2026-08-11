import React, { useState, useEffect } from "react";
import {
  VIP_PRICING,
  PLATINUM_PRICING
} from "../../data/pricing";
import {
  buildWhatsAppMessage
} from "../../utils/whatsappMessage";

/*
 * =========================================================
 * AGI MOBILITY PLATFORM
 * ISLA MUJERES EXPRESS
 * =========================================================
 *
 * Automatic quotation product.
 *
 * Pricing:
 *
 * VIP
 *   One Way   = $65 pp
 *   Round Trip = $109 pp
 *
 * PLATINUM
 *   One Way:
 *     1–4 passengers = $500
 *     additional passenger = $60
 *
 *   Round Trip:
 *     1–4 passengers = $950
 *     additional passenger = $100
 *
 * IMPORTANT:
 * Round Trip is NOT calculated by multiplying
 * the One Way price by two.
 */

// =========================================================
// GOOGLE APPS SCRIPT API
// =========================================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbyp9uoH100kAUxfKjx4sI6fOnt38FIjZYl-5OgjThh0Q636CXW3LSKz900kCO8zLzPK/exec";


// =========================================================
// MAIN COMPONENT
// =========================================================

export default function QuoteCalculator() {

  // =======================================================
  // SERVICE
  // =======================================================

  const [serviceType, setServiceType] =
    useState("VIP");

  const [roundTrip, setRoundTrip] =
    useState(false);


  // =======================================================
  // PASSENGER INFORMATION
  // =======================================================

  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [passengers, setPassengers] =
    useState(1);

  const [babySeat, setBabySeat] =
    useState(false);


  // =======================================================
  // OUTBOUND / ARRIVAL
  // =======================================================

  const [arrivalDate, setArrivalDate] =
    useState("");

  const [arrivalTime, setArrivalTime] =
    useState("");

  const [arrivalAirline, setArrivalAirline] =
    useState("");

  const [arrivalFlight, setArrivalFlight] =
    useState("");

  const [arrivalOrigin, setArrivalOrigin] =
    useState("");


  // =======================================================
  // DESTINATION IN ISLA MUJERES
  // =======================================================

  const [destination, setDestination] =
    useState("");


  // =======================================================
  // RETURN TRIP
  // =======================================================

  const [departureDate, setDepartureDate] =
    useState("");

  const [departureTime, setDepartureTime] =
    useState("");

  const [departureAirline, setDepartureAirline] =
    useState("");

  const [departureFlight, setDepartureFlight] =
    useState("");


  // =======================================================
  // PRICE / STATUS
  // =======================================================

  const [totalPrice, setTotalPrice] =
    useState(0);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isSending, setIsSending] =
    useState(false);


  // =======================================================
  // PRICE CALCULATION
  // =======================================================

  useEffect(() => {

    let price = 0;


    // -----------------------------------------------------
    // VIP
    // -----------------------------------------------------

    if (serviceType === "VIP") {

      price = roundTrip
        ? passengers * VIP_PRICING.round
        : passengers * VIP_PRICING.oneway;
    }


    // -----------------------------------------------------
    // PLATINUM
    // -----------------------------------------------------

    if (serviceType === "PLATINUM") {

      if (passengers <= 4) {

        price = roundTrip
          ? PLATINUM_PRICING.base_round
          : PLATINUM_PRICING.base_oneway;

      } else {

        const extra =
          passengers - 4;

        price = roundTrip
          ? PLATINUM_PRICING.base_round +
            extra *
            PLATINUM_PRICING.extra_round

          : PLATINUM_PRICING.base_oneway +
            extra *
            PLATINUM_PRICING.extra_oneway;
      }
    }


    setTotalPrice(price);

  }, [
    serviceType,
    passengers,
    roundTrip
  ]);


  // =======================================================
  // VALIDATION
  // =======================================================

  const validateForm = () => {

    if (!fullName.trim()) {

      setErrorMessage(
        "Please enter passenger name."
      );

      return false;
    }


    if (!arrivalDate) {

      setErrorMessage(
        "Please select arrival date."
      );

      return false;
    }


    if (!arrivalOrigin.trim()) {

      setErrorMessage(
        "Please enter the arrival origin."
      );

      return false;
    }


    if (!destination.trim()) {

      setErrorMessage(
        "Please enter where you should be taken in Isla Mujeres."
      );

      return false;
    }


    if (
      roundTrip &&
      !departureDate
    ) {

      setErrorMessage(
        "Please select return date."
      );

      return false;
    }


    setErrorMessage("");

    return true;
  };


  // =======================================================
  // REGISTER OPPORTUNITY
  // =======================================================

  const registerOpportunity = async () => {

    const requestDate =
      new Date().toLocaleString();


    const opportunity = {

      producto:
        "Isla Mujeres Express",

      modalidad:
        roundTrip
          ? "Round Trip"
          : "One Way",

      nombre:
        fullName.trim(),

      whatsapp:
        phone.trim(),

      email:
        email.trim(),

      estado:
        "Nueva",

      responsable:
        "AGI",

      observaciones:
        [
          `Request date: ${requestDate}`,

          `Service: ${serviceType}`,

          `Trip type: ${
            roundTrip
              ? "Round Trip"
              : "One Way"
          }`,

          `Passengers: ${passengers}`,

          `Baby seat: ${
            babySeat
              ? "Yes"
              : "No"
          }`,

          `Arrival date: ${arrivalDate}`,

          `Arrival time: ${
            arrivalTime ||
            "Not provided"
          }`,

          `Arrival airline: ${
            arrivalAirline ||
            "Not provided"
          }`,

          `Arrival flight: ${
            arrivalFlight ||
            "Not provided"
          }`,

          `Origin: ${arrivalOrigin}`,

          `Isla Mujeres accommodation/destination: ${destination}`,

          roundTrip
            ? `Return date: ${departureDate}`
            : "",

          roundTrip
            ? `Return time: ${
                departureTime ||
                "Not provided"
              }`
            : "",

          roundTrip
            ? `Return airline: ${
                departureAirline ||
                "Not provided"
              }`
            : "",

          roundTrip
            ? `Return flight: ${
                departureFlight ||
                "Not provided"
              }`
            : "",

          `Quoted price: $${totalPrice} USD`
        ]
        .filter(Boolean)
        .join(" | ")
    };


    const response =
      await fetch(
        API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body:
            JSON.stringify(
              opportunity
            )
        }
      );


    const responseText =
      await response.text();


    let result;

    try {

      result =
        JSON.parse(
          responseText
        );

    } catch (error) {

      throw new Error(
        "The API returned an unexpected response."
      );
    }


    if (
      !result.success ||
      !result.opportunityId
    ) {

      throw new Error(
        result.error ||
        "The request could not be registered."
      );
    }


    return result.opportunityId;
  };


  // =======================================================
  // WHATSAPP
  // =======================================================

  const sendToWhatsApp = async () => {

    if (!validateForm()) {
      return;
    }


    if (isSending) {
      return;
    }


    setIsSending(true);
    setErrorMessage("");


    try {

      const opportunityId =
        await registerOpportunity();


      const phoneNumber =
        "529982594817";


      const message =
        buildWhatsAppMessage({

          requestDate:
            new Date().toLocaleString(),

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
        });


      const url =
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          message
        )}`;


      window.open(
        url,
        "_blank"
      );


    } catch (error) {

      console.error(
        "AGI Mobility Platform:",
        error
      );


      setErrorMessage(
        "We could not register your request. Please try again or contact AGI directly via WhatsApp."
      );


    } finally {

      setIsSending(false);
    }
  };


  // =======================================================
  // USER INTERFACE
  // =======================================================

  return (

    <div
      style={{
        maxWidth: "700px",
        margin: "auto"
      }}
    >

      {/* =================================================
          TITLE
      ================================================== */}

      <h2>
        ISLA MUJERES EXPRESS
      </h2>


      <p>
        Please provide the following information
        to generate your quote; if you accept it,
        you will be able to quickly book your
        transfer via WhatsApp.
      </p>


      {/* =================================================
          SERVICE
      ================================================== */}

      <h3>
        Service
      </h3>


      <select
        value={serviceType}
        onChange={(e) =>
          setServiceType(
            e.target.value
          )
        }
      >

        <option value="VIP">
          VIP
        </option>

        <option value="PLATINUM">
          PLATINUM
        </option>

      </select>


      {/* =================================================
          TRIP TYPE
      ================================================== */}

      <h3>
        Trip Type
      </h3>


      <label>

        <input
          type="radio"
          name="islaMujeresTripType"
          checked={!roundTrip}
          onChange={() =>
            setRoundTrip(false)
          }
        />

        {" "}
        One Way

      </label>


      <br />


      <label>

        <input
          type="radio"
          name="islaMujeresTripType"
          checked={roundTrip}
          onChange={() =>
            setRoundTrip(true)
          }
        />

        {" "}
        Round Trip

      </label>


      {/* =================================================
          PASSENGER INFORMATION
      ================================================== */}

      <h3>
        Passenger Information
      </h3>


      <input
        placeholder="Full Name"
        value={fullName}
        onChange={(e) =>
          setFullName(
            e.target.value
          )
        }
      />


      <input
        placeholder="WhatsApp"
        value={phone}
        onChange={(e) =>
          setPhone(
            e.target.value
          )
        }
      />


      <input
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
      />


      {/* =================================================
          PASSENGERS
      ================================================== */}

      <h3>
        Passengers
      </h3>


      <label>
        Number of passengers
      </label>


      <input
        type="number"
        min="1"
        value={passengers}
        onChange={(e) =>
          setPassengers(
            parseInt(
              e.target.value
            ) || 1
          )
        }
      />


      <br />
      <br />


      <label>

        <input
          type="checkbox"
          checked={babySeat}
          onChange={(e) =>
            setBabySeat(
              e.target.checked
            )
          }
        />

        {" "}
        Baby seat required

      </label>


      {/* =================================================
          OUTBOUND TRIP
      ================================================== */}

      <h3>
        Inbound Flight
      </h3>


      <label>
        Arrival date
      </label>


      <input
        type="date"
        value={arrivalDate}
        onChange={(e) =>
          setArrivalDate(
            e.target.value
          )
        }
      />


      <label>
        Arrival time
      </label>


      <input
        type="time"
        value={arrivalTime}
        onChange={(e) =>
          setArrivalTime(
            e.target.value
          )
        }
      />


      <input
        placeholder="Airline"
        value={arrivalAirline}
        onChange={(e) =>
          setArrivalAirline(
            e.target.value
          )
        }
      />


      <input
        placeholder="Flight"
        value={arrivalFlight}
        onChange={(e) =>
          setArrivalFlight(
            e.target.value
          )
        }
      />


      <input
        placeholder="Origin"
        value={arrivalOrigin}
        onChange={(e) =>
          setArrivalOrigin(
            e.target.value
          )
        }
      />


      {/* =================================================
          DESTINATION
      ================================================== */}

      <h3>
        Where should we take you in Isla Mujeres?
      </h3>


      <input
        placeholder="Hotel, accommodation or private address"
        value={destination}
        onChange={(e) =>
          setDestination(
            e.target.value
          )
        }
      />


      {/* =================================================
          RETURN TRIP
      ================================================== */}

      {roundTrip && (

        <>

          <h3>
            Return Trip
          </h3>


          <label>
            Return date
          </label>


          <input
            type="date"
            value={departureDate}
            onChange={(e) =>
              setDepartureDate(
                e.target.value
              )
            }
          />


          <label>
            Return time
          </label>


          <input
            type="time"
            value={departureTime}
            onChange={(e) =>
              setDepartureTime(
                e.target.value
              )
            }
          />


          <input
            placeholder="Return airline"
            value={departureAirline}
            onChange={(e) =>
              setDepartureAirline(
                e.target.value
              )
            }
          />


          <input
            placeholder="Return flight"
            value={departureFlight}
            onChange={(e) =>
              setDepartureFlight(
                e.target.value
              )
            }
          />

        </>

      )}


      {/* =================================================
          QUOTE
      ================================================== */}

      <h2>
        Total: ${totalPrice} USD
      </h2>


      {/* =================================================
          ERROR
      ================================================== */}

      {errorMessage && (

        <p
          style={{
            color: "red",
            fontWeight: "bold"
          }}
        >
          {errorMessage}
        </p>

      )}


      {/* =================================================
          ACTION
      ================================================== */}

      <button
        onClick={
          sendToWhatsApp
        }
        disabled={isSending}
      >

        {isSending
          ? "Registering request..."
          : "Reserve via WhatsApp"}

      </button>

    </div>
  );
}
