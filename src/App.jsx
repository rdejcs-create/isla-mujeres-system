import React, { useState, useEffect } from "react";

import QuoteCalculator from "./components/quote/QuoteCalculator";
import AirportTransferExpress from "./components/airport-transfer/AirportTransferExpress";
import PersonalizedTransportation from "./components/personalized/PersonalizedTransportation";

import "./styles/agi.css";



function PhotoCarousel({ title, imageFolder, description }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const images = [1, 2, 3, 4, 5].map(
    (number) => `${imageFolder}/${number}.png`
  );

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((index) => (index + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoPlay, images.length]);

  const previousImage = () => {
    setAutoPlay(false);
    setCurrentIndex((index) =>
      index === 0 ? images.length - 1 : index - 1
    );
  };

  const nextImage = () => {
    setAutoPlay(false);
    setCurrentIndex((index) => (index + 1) % images.length);
  };

  return (
    <section className="agi-carousel">
      <h2>{title}</h2>

      <p>{description}</p>

      <div className="agi-carousel-frame">
        <button
          type="button"
          className="agi-carousel-arrow agi-carousel-prev"
          onClick={previousImage}
          aria-label="Previous photo"
        >
          &#10094;
        </button>

        <img
          src={images[currentIndex]}
          alt={`${title} — photo ${currentIndex + 1}`}
          className="agi-carousel-image"
        />

        <button
          type="button"
          className="agi-carousel-arrow agi-carousel-next"
          onClick={nextImage}
          aria-label="Next photo"
        >
          &#10095;
        </button>
      </div>

      <p className="agi-carousel-counter">
        {currentIndex + 1} / {images.length}
      </p>
    </section>
  );
}

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
 *   ├── CANCUN AIRPORT TRANSPORTATION EXPRESS
 *   └── PERSONALIZED TRANSPORTATION
 *
 * No router dependency is required at this stage.
 */

function App() {
  const [screen, setScreen] = useState("home");

  // =======================================================
  // MAIN HEADER
  // =======================================================

  const Header = () => (
    <header className="agi-header">
      <img
        src="/images/Logo%20AGI%202026.png"
        alt="AGI TOURS & Transfers"
        className="agi-logo"
        style={{
          width: "500px",
          height: "auto",
          display: "block",
          margin: "0 auto 12px",
        }}
      />

      <h1>AGI TOURS &amp; TRANSFERS</h1>

      <p>
        Reliable transportation, clear communication,
        and respect for our clients’ time.
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
          <h2>Choose your transportation service</h2>

          <p>
            For 29 years, AGI TOURS has provided transportation
            services in Cancun and the Yucatan region, serving
            travelers, families, and groups who value punctuality,
            safety, and personalized attention.
          </p>

          <p>
            Many of our clients come through personal recommendations.
            We value every client and aim to provide a service
            you can confidently recommend.
          </p>
        </div>

        <div className="agi-product-grid">
          {/* ISLA MUJERES EXPRESS */}

          <article className="agi-product-card">
            <div className="agi-product-image agi-isla-image">
              <div className="agi-product-overlay">
                <h2>ISLA MUJERES EXPRESS</h2>
              </div>
            </div>

            <div className="agi-product-content">
              <p className="agi-product-description">
                Quality door-to-door transfer service from Cancun Airport to Isla Mujeres.
              </p>

              <button
                className="agi-primary-button"
                onClick={() => setScreen("isla-mujeres")}
              >
                Instant Quote
              </button>
            </div>
          </article>

          {/* CANCUN AIRPORT TRANSPORTATION EXPRESS */}

          <article className="agi-product-card">
            <div className="agi-product-image agi-airport-transfer-image">
              <div className="agi-product-overlay">
                <h2>CANCUN AIRPORT TRANSPORTATION EXPRESS</h2>
              </div>
            </div>

            <div className="agi-product-content">
              <p className="agi-product-description">
                Cancun Airport transfers across the Mexican Caribbean.
                Excellent rates based on group size and destination!
              </p>

              <button
                className="agi-primary-button"
                onClick={() => setScreen("airport-transfer")}
              >
                Instant Quote
              </button>
            </div>
          </article>

          {/* PERSONALIZED TRANSPORTATION */}

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
                onClick={() => setScreen("personalized")}
              >
                Request a Personalized Quote
              </button>
            </div>
          </article>
        </div>

        
        <PhotoCarousel
          title="Our Services & Experiences"
          imageFolder="/images/services"
          description="Discover transportation services and experiences designed around your journey."
        />

        
        <PhotoCarousel
          title="Our Fleet, People & Operations"
          imageFolder="/images/operations"
          description="Meet the people, vehicles, and coordinated operations behind every reliable journey."
        />


        <section className="agi-values">
          <h2>What We Stand For</h2>

          <p>
            <strong>Reliability:</strong> Punctual service
            and respect for our clients’ time.
          </p>

          <p>
            <strong>Safety and Comfort:</strong> Clean,
            comfortable vehicles and a service focused
            on our passengers’ well-being.
          </p>
          
          <p>
            <strong>Clear Communication:</strong> Direct
            contact, honest information, and no
            unnecessary intermediaries.
          </p>
          
          <p>
            <strong>Personalized Attention:</strong>
            Flexible transportation solutions tailored
            to each client’s needs.
          </p>

          <h2>Built on Trust</h2>

          <p>
            Many of our clients come to us through personal
            recommendations and return because they value
            our service. We work every day to honor that trust.
          </p>

          <p>
            <strong>
              AGI TOURS is here, ready to take you to your destination.
            </strong>
          </p>
        </section>
      </main>
    </>
  );

  // =======================================================
  // SHARED BACK NAVIGATION
  // =======================================================

  const BackNavigation = () => (
    <div className="agi-navigation">
      <button
        className="agi-back-button"
        onClick={() => setScreen("home")}
      >
        ← Back to services
      </button>
    </div>
  );

  // =======================================================
  // ISLA MUJERES EXPRESS
  // =======================================================

  const IslaMujeres = () => (
    <>
      <Header />
      <BackNavigation />

      <main>
        <section className="agi-card">
          <QuoteCalculator />
        </section>
      </main>
    </>
  );

  // =======================================================
  // CANCUN AIRPORT TRANSPORTATION EXPRESS
  // =======================================================

  const AirportTransfer = () => (
    <>
      <Header />
      <BackNavigation />

      <main>
        <section className="agi-card">
          <AirportTransferExpress />
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
      <BackNavigation />

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

  if (screen === "isla-mujeres") {
    return (
      <div className="agi-app">
        <IslaMujeres />

        <footer className="agi-footer">
          AGI Mobility Platform by RdeJCS
        </footer>
      </div>
    );
  }

  if (screen === "airport-transfer") {
    return (
      <div className="agi-app">
        <AirportTransfer />

        <footer className="agi-footer">
          AGI Mobility Platform by RdeJCS
        </footer>
      </div>
    );
  }

  if (screen === "personalized") {
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
  // DEFAULT HOME SCREEN
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
          <div>Follow Us</div>

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