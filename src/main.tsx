import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import ZakatProvider daripada Context anda
// Pastikan path ini tepat mengikut struktur folder anda
import { ZakatProvider } from "@/components/Context/ZakatContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* ZakatProvider diletakkan di sini supaya SEMUA komponen di dalam <App />, 
      termasuk App.tsx itu sendiri, boleh mengakses data Context tanpa ralat.
    */}
    <ZakatProvider>
      <App />
    </ZakatProvider>
  </React.StrictMode>,
);
