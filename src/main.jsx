import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Orden explícito de estilos:
// 1) index.css (reset mínimo, #root)
// 2) agi.css (design system completo)
import "./index.css";
import "./styles/agi.css";

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