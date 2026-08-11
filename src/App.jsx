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

                Explore &amp; Quote

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
                Personalized transportation
                solutions prepared by AGI TOURS.

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

        AGI Mobility Platform by RdeJCS

      </footer>

    </div>

  );
}


export default App;