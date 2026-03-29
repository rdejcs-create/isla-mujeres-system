import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

/*
=====================================================
PUNTO DE ENTRADA DE LA APLICACIÓN
=====================================================
Este archivo monta la aplicación React en el HTML.
*/

ReactDOM.createRoot(document.getElementById("root")).render(

  <React.StrictMode>

    <App />

  </React.StrictMode>

);