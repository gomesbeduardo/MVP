import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import UploadPage from "./Upload";
import "./styles.css";

const path = window.location.pathname;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {path === "/upload" ? <UploadPage /> : <App />}
  </React.StrictMode>
);
