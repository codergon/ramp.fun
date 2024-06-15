import "./utils/axios";
import "./scss/index.scss";

import React from "react";
import { Buffer } from "buffer";
import ReactDOM from "react-dom/client";
import Providers from "./contexts/providers.tsx";

globalThis.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers />
  </React.StrictMode>,
);
