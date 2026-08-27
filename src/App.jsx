import React, { useState } from "react";

import QuoteCalculator from "./components/quote/QuoteCalculator";
import PersonalizedTransportation from "./components/personalized/PersonalizedTransportation";

import "./styles/agi.css";

/*
 * =========================================================
 * AGI MOBILITY PLATFORM
 * Main Application
 * =========================================================
 *
 * Simple client-side navigation:
 *
 * HOME
 *   ├── ISLA MUJERES EXPRESS
 *   └── PERSONALIZED TRANSPORTATION
 *
 * No router dependency is required at this stage.
 */


function App() {

  // =======================================================
  // CURRENT SCREEN
  // =======================================================

  const [screen, setScreen] =
    useState("home");


  // =======================================================
  // MAIN HEADER
  // =======================================================

  const Header = () => (

    <header className="agi-header">

      <h1>
        AGI TOURS &amp; TRANSFERS
      </h1>

      <p>
       Proudly providing transportation services from Cancún to the entire region for 29 years, serving travelers, families, and groups who value punctuality, safety, and personalized attention.
      </p>

    </header>

  );


  // =======================================================
  // LANDING
  // =======================================================

  const Landing = () => (

    <>

      <Header />


      <main className="agi-landing">

        <div className="agi-landing-intro">

          <h2>
            Choose your transportation service
          </h2>

          <p>
            Most of our work comes from word-of-mouth recommendations. We value every client and aim to provide a service you can confidently recommend.
          </p>

        </div>


        <div className="agi-product-grid">


          {/* =============================================
              ISLA MUJERES EXPRESS
          ============================================== */}

          <article className="agi-product-card">

            <div className="agi-product-image agi-isla-image">

              <div className="agi-product-overlay">

                <h2>
                  ISLA MUJERES EXPRESS
                </h2>

              </div>

            </div>


            <div className="agi-product-content">

              <p className="agi-product-description">

                Cancun airport to Isla Mujeres
                transfer service.

              </p>


              <button
                className="agi-primary-button"
                onClick={() =>
                  setScreen(
                    "isla-mujeres"
                  )
                }
              >

                Instant Quote

              </button>

            </div>

          </article>


          {/* =============================================
              PERSONALIZED TRANSPORTATION
          ============================================== */}

          <article className="agi-product-card">

            <div className="agi-product-image agi-personalized-image">

              <div className="agi-product-overlay">

                <h2>
                  PERSONALIZED
                  <br />
                  TRANSPORTATION
                </h2>

              </div>

            </div>


            <div className="agi-product-content">

              <p className="agi-product-description">

                Any origin. Any destination.                

              </p>


              <button
                className="agi-primary-button"
                onClick={() =>
                  setScreen(
                    "personalized"
                  )
                }
              >

                Request a Personalized Quote

              </button>

            </div>

          </article>


        </div>

      </main>

    </>

  );


  // =======================================================
  // ISLA MUJERES EXPRESS
  // =======================================================

  const IslaMujeres = () => (

    <>

      <Header />


      <div className="agi-navigation">

        <button
          className="agi-back-button"
          onClick={() =>
            setScreen("home")
          }
        >

          ← Back to services

        </button>

      </div>


      <main>

        <section className="agi-card">

          <QuoteCalculator />

        </section>

      </main>

    </>

  );


  // =======================================================
  // PERSONALIZED TRANSPORTATION
  // =======================================================

  const Personalized = () => (

    <>

      <Header />


      <div className="agi-navigation">

        <button
          className="agi-back-button"
          onClick={() =>
            setScreen("home")
          }
        >

          ← Back to services

        </button>

      </div>


      <main>

        <section className="agi-card">

          <PersonalizedTransportation />

        </section>

      </main>

    </>

  );


  // =======================================================
  // SCREEN ROUTING
  // =======================================================

  if (
    screen ===
    "isla-mujeres"
  ) {

    return (

      <div className="agi-app">

        <IslaMujeres />

        <footer className="agi-footer">

          AGI Mobility Platform by RdeJCS

        </footer>

      </div>

    );
  }


  if (
    screen ===
    "personalized"
  ) {

    return (

      <div className="agi-app">

        <Personalized />

        <footer className="agi-footer">

          AGI Mobility Platform by RdeJCS

        </footer>

      </div>

    );
  }


  // =======================================================
  // DEFAULT
  // =======================================================

  return (

    <div className="agi-app">

      <Landing />

      <footer className="agi-footer">
    
        <div className="agi-footer-contact">

        <div>
          Calle Los Olivos, SM 310 MZ 66 Lt. 93,
          Cancún, Quintana Roo, México
        </div>

        <div>
          <a href="mailto:agitours@agitours.com">
            agitours@agitours.com
          </a>
        </div>

        <div>
          +52 998-8872359 / 998-8876967 / 998-8840060
        </div>

      </div>


      <div className="agi-footer-social">

        <div>
          Follow Us
        </div>

        <div>

          <a
            href="https://facebook.com/Agitours"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>

          {" | "}

          <a
            href="https://instagram.com/agitourscancun"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>

          {" | "}

          <a
            href="https://www.tripadvisor.com.mx/Attraction_Review-g150807-d4556297-Reviews-AGI_Tours_Transfers-Cancun_Yucatan_Peninsula.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            TripAdvisor
          </a>

        </div>

      </div>


      <div className="agi-footer-platform">

        AGI Mobility Platform by RdeJCS

      </div>

    </footer>

    </div>

  );
}


export default App;