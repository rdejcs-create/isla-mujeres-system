import React, { useState } from "react";

import {
  buildPersonalizedWhatsAppMessage
} from "../../utils/whatsappMessage";

// <-- NUEVO
import {
  getOrCreateRequestId,
  clearRequestId
} from "../../utils/requestId";

/*
 * =========================================================
 * AGI MOBILITY PLATFORM
 * PERSONALIZED TRANSPORTATION
 * =========================================================
 *
 * Any Origin / Any Destination
 *
 * No automatic price calculation.
 * Personalized quote prepared by AGI TOURS.
 */

// =========================================================
// GOOGLE APPS SCRIPT API
// =========================================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbyp9uoH100kAUxfKjx4sI6fOnt38FIjZYl-5OgjThh0Q636CXW3LSKz900kCO8zLzPK/exec";

// <-- NUEVO
const REQUEST_STORAGE_KEY =
  "agiPersonalizedTransportation.lastRequest";


// =========================================================
// MAIN COMPONENT
// =========================================================

export default function PersonalizedTransportation() {

  // =======================================================
  // SERVICE
  // =======================================================

  const [roundTrip, setRoundTrip] =
    useState(true);


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
  // OUTBOUND TRIP
  // =======================================================

  const [serviceDate, setServiceDate] =
    useState("");

  const [serviceTime, setServiceTime] =
    useState("");

  const [origin, setOrigin] =
    useState("");

  const [destination, setDestination] =
    useState("");


  // =======================================================
  // RETURN TRIP
  // =======================================================

  const [returnDate, setReturnDate] =
    useState("");

  const [returnTime, setReturnTime] =
    useState("");


  // =======================================================
  // ADDITIONAL INFORMATION
  // =======================================================

  const [additionalDetails, setAdditionalDetails] =
    useState("");


  // =======================================================
  // STATUS
  // =======================================================

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isSending, setIsSending] =
    useState(false);


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


    if (!serviceDate) {

      setErrorMessage(
        "Please select service date."
      );

      return false;
    }


    if (!origin.trim()) {

      setErrorMessage(
        "Please enter the origin."
      );

      return false;
    }


    if (!destination.trim()) {

      setErrorMessage(
        "Please enter the destination."
      );

      return false;
    }


    if (
      roundTrip &&
      !returnDate
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
        "Personalized Transportation",

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

      pasajeros:
        passengers,

      estado:
        "Nueva",

      responsable:
        "AGI",

      observaciones:
        [
          `Request date: ${requestDate}`,

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

          `Service date: ${serviceDate}`,

          `Service time: ${
            serviceTime ||
            "Not provided"
          }`,

          `Origin: ${origin}`,

          `Destination: ${destination}`,

          roundTrip
            ? `Return date: ${returnDate}`
            : "",

          roundTrip
            ? `Return time: ${
                returnTime ||
                "Not provided"
              }`
            : "",

          `Additional details: ${
            additionalDetails.trim() ||
            "None"
          }`
        ]
        .filter(Boolean)
        .join(" | ")
    };


    // -----------------------------------------------------
    // Request ID estable por firma de la solicitud.
    // El backend deduplica por esta columna (AH).
    // <-- NUEVO
    // -----------------------------------------------------

    const requestSignature =
      JSON.stringify(opportunity);

    const requestId =
      getOrCreateRequestId(
        REQUEST_STORAGE_KEY,
        requestSignature
      );

    opportunity.requestId = requestId;


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


    // <-- NUEVO
    // Limpiar el requestId guardado solo si es el
    // que se acaba de confirmar.
    clearRequestId(
      REQUEST_STORAGE_KEY,
      requestId
    );


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

      // ---------------------------------------------------
      // Register request first.
      // ---------------------------------------------------

      const opportunityId =
        await registerOpportunity();


      // ---------------------------------------------------
      // Build WhatsApp message.
      // ---------------------------------------------------

      const message =
        buildPersonalizedWhatsAppMessage({

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

        });


      // ---------------------------------------------------
      // AGI TOURS WhatsApp number.
      // ---------------------------------------------------

      const phoneNumber =
        "529988457161";


      // ---------------------------------------------------
      // WhatsApp URL.
      // ---------------------------------------------------

      const url =
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          message
        )}`;


      // ---------------------------------------------------
      // Open WhatsApp.
      // ---------------------------------------------------

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
        PERSONALIZED TRANSPORTATION
      </h2>


      <p>
        Any origin. Any destination.
      </p>


      <p>
        Tell us what you need, and AGI TOURS
        will prepare a personalized transportation
        quote for you — with no obligation.
      </p>


      {/* =================================================
          TRIP TYPE
      ================================================== */}

      <h3>
        Trip Type
      </h3>


      <label>

        <input
          type="radio"
          name="personalizedTripType"
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
          name="personalizedTripType"
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
        placeholder="WhatsApp Number"
        value={phone}
        onChange={(e) =>
          setPhone(
            e.target.value
          )
        }
      />


      <input
        placeholder="Email Address"
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
          SERVICE DETAILS
      ================================================== */}

      <h3>
        Service Details
      </h3>


      <label>
        Service date
      </label>


      <input
        type="date"
        value={serviceDate}
        onChange={(e) =>
          setServiceDate(
            e.target.value
          )
        }
      />


      <label>
        Preferred time
      </label>


      <input
        type="time"
        value={serviceTime}
        onChange={(e) =>
          setServiceTime(
            e.target.value
          )
        }
      />


      <input
        placeholder="Origin"
        value={origin}
        onChange={(e) =>
          setOrigin(
            e.target.value
          )
        }
      />


      <input
        placeholder="Destination"
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
            value={returnDate}
            onChange={(e) =>
              setReturnDate(
                e.target.value
              )
            }
          />


          <label>
            Return time
          </label>


          <input
            type="time"
            value={returnTime}
            onChange={(e) =>
              setReturnTime(
                e.target.value
              )
            }
          />

        </>

      )}


      {/* =================================================
          ADDITIONAL INFORMATION
      ================================================== */}

      <h3>
        Additional Information
      </h3>


      <textarea
        placeholder="Anything else we should know?"
        value={additionalDetails}
        onChange={(e) =>
          setAdditionalDetails(
            e.target.value
          )
        }
        rows="5"
        style={{
          width: "100%"
        }}
      />


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
          : "Request a Personalized Quote"}

      </button>


      {/* =================================================
          DISCLAIMER
      ================================================== */}

      <p>
         This request is subject to confirmation
         by AGI TOURS. An AGI TOURS representative
         will review your request and contact you
         via WhatsApp with a personalized quote
         and payment information.
      </p>

    </div>
  );
}