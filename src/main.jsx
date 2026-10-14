import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/newsreader/latin-400.css";
import "@fontsource/newsreader/latin-500.css";
import "@fontsource/bodoni-moda/latin-400.css";
import "@fontsource/bodoni-moda/latin-500.css";
import "@fontsource/bodoni-moda/latin-500-italic.css";
import "@fontsource/bodoni-moda/latin-600.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import { App } from "./App.jsx";
import "./styles.css";
import "./mobile.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
