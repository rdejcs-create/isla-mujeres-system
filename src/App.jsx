import React from "react";
import QuoteCalculator from "./components/quote/QuoteCalculator";

/*
=====================================================
APP PRINCIPAL
=====================================================
Este archivo carga el sistema de cotización
AGI Tours & Transfers.
*/

function App() {

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f2f2f2",
        padding: "20px"
      }}
    >

      {/* Título principal del sistema */}

      <header style={{ textAlign: "center", marginBottom: "30px" }}>

        <h1>
          AGI TOURS & TRANSFERS
        </h1>

        <p>
          ISLA MUJERES EXPRESS AIRPORT TRANSFER REQUEST
        </p>

      </header>

      {/* Cargamos el cotizador */}

      <QuoteCalculator />

    </div>

  );
}

export default App;