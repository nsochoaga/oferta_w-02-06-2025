import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProceedToPayment = () => {
    if (!address.trim()) {
      alert("Por favor ingresa una dirección de entrega.");
      return;
    }
    localStorage.setItem("deliveryAddress", address);
    window.location.href = "/checkout";
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600">
        <p className="text-xl">🛒 Tu carrito está vacío.</p>
        <Link
          to="/"
          className="inline-block mt-4 text-blue-600 underline hover:text-blue-800"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-blue-700 underline">
        Carrito de Compras
      </h2>

      <ul className="space-y-4">
        {cart.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center bg-white shadow-md p-4 rounded-xl"
          >
            <div>
              <h3 className="font-semibold text-lg text-blue-700">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600">
                ${Number(item.price).toFixed(2)} x {item.quantity} ={" "}
                <strong className="text-green-600">
                  ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                </strong>
              </p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <div className="text-right text-lg font-bold">
        Total: <span className="text-green-700">${total.toFixed(2)}</span>
      </div>

      <div>
        <label className="font-semibold text-lg text-blue-700">
          Dirección de entrega:
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border rounded-md p-2 mb-4"
          placeholder="Ej: Calle 123 #45-67"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={clearCart}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          Vaciar Carrito
        </button>

        <button
          onClick={handleProceedToPayment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Proceder al pago
        </button>
      </div>
    </div>
  );
};

export default Cart;
