import Modal from "react-modal";
import "tailwindcss/tailwind.css";

// This is required to run before any modals are displayed to ensure the main
// content can be hidden from screen readers when a modal is active.
Modal.setAppElement("#__next");

function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default App;
