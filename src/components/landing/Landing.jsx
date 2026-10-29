import React from "react";

/*
 * =========================================================
 * AGI MOBILITY PLATFORM
 * LANDING PAGE
 * =========================================================
 *
 * Main entry point for the customer.
 *
 * The customer chooses between:
 *
 * 1. Isla Mujeres Express
 * 2. Personalized Transportation
 *
 * The parent App.jsx controls which product is displayed.
 */

export default function Landing({ onSelectProduct }) {

  return (

    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        textAlign: "center"
      }}
    >

      {/* =================================================
          BRAND
      ================================================== */}

      <header
        style={{
          marginBottom: "45px"
        }}
      >

        <h1>
          AGI MOBILITY PLATFORM
        </h1>

        <p>
          by RdeJCS
        </p>

        <h2>
          How can we help you?
        </h2>

      </header>


      {/* =================================================
          PRODUCT OPTIONS
      ================================================== */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          justifyContent: "center"
        }}
      >

        {/* ===============================================
            ISLA MUJERES EXPRESS
        ================================================ */}

        <section
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "12px",
            width: "320px",
            boxSizing: "border-box",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.10)"
          }}
        >

          <h1>
            ISLA MUJERES EXPRESS
          </h1>

          <p>
            Cancun airport to Isla Mujeres transfer service.
          </p>

          <p>
            Get your quote instantly.
          </p>

          <button
            onClick={() =>
              onSelectProduct(
                "isla-mujeres"
              )
            }
          >
            GET YOUR QUOTE
          </button>

        </section>


        {/* ===============================================
            PERSONALIZED TRANSPORTATION
        ================================================ */}

        <section
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "12px",
            width: "320px",
            boxSizing: "border-box",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.10)"
          }}
        >

          <h2>
            PERSONALIZED TRANSPORTATION
          </h2>

          <p>
            Any origin. Any destination.
          </p>

          <p>
            Request a personalized quote
            with no obligation.
          </p>

          <button
            onClick={() =>
              onSelectProduct(
                "personalized"
              )
            }
          >
            REQUEST A QUOTE
          </button>

        </section>

      </div>

    </div>
  );
}