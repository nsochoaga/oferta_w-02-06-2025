import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CardPayment from "./CardPayment";
import PaymentResult from "./PaymentResult";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CardPayment />} />
        <Route path="/payment-result" element={<PaymentResult />} />
      </Routes>
    </Router>
  );
}

export default App;
