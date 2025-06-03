import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from "./hooks/Checkout";
import PaymentResult from "./PaymentResult";
import ProductList from "./ProductList";
import Cart from "./components/Cart";
import Deliveries from "./pages/Deliveries";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/deliveries" element={<Deliveries />} />
      </Routes>
    </Router>
  );
}

export default App;
