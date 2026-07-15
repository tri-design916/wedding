import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";

document.addEventListener("gesturestart", e => e.preventDefault());

let blockPinchMove = null;
document.addEventListener("touchstart", e => {
  if (e.touches.length > 1 && !blockPinchMove) {
    blockPinchMove = ev => ev.preventDefault();
    document.addEventListener("touchmove", blockPinchMove, { passive: false });
  }
}, { passive: true });
const releasePinchBlock = () => {
  if (blockPinchMove) {
    document.removeEventListener("touchmove", blockPinchMove);
    blockPinchMove = null;
  }
};
document.addEventListener("touchend", e => { if (e.touches.length < 2) releasePinchBlock() }, { passive: true });
document.addEventListener("touchcancel", releasePinchBlock, { passive: true });

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
