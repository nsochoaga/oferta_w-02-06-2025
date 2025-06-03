import { useCart } from "../contexts/CartContext";
import { useRef, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Checkout = () => {
  const { cart } = useCart();
  const formRef = useRef<HTMLFormElement>(null);
  const [cargado, setCargado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const referenceRef = useRef("REF_" + uuidv4());
  const reference = referenceRef.current;

  const publicKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
  const apiUrl = import.meta.env.VITE_API_URL;
  const redirectUrl = import.meta.env.VITE_REDIRECT_URL;

  useEffect(() => {
    const loadScript = async () => {
      if (!formRef.current || cargado || cart.length === 0) return;

      const currency = "COP";
      const amountInCents = Math.round(totalAmount * 100); // importante: convertir a centavos

      try {
        await fetch(`${apiUrl}/payment/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference, amount: amountInCents, currency }),
        });
      } catch (err) {
        console.error("❌ Error creando transacción pending", err);
        setError("No se pudo iniciar la transacción.");
        return error;
      }

      let data;
      try {
        const res = await fetch(
          `${apiUrl}/payment/integrity-hash?reference=${reference}&amount=${amountInCents}&currency=COP`
        );
        data = await res.json();
      } catch (err) {
        console.error("Error obteniendo firma:", err);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.co.uat.wompi.dev/widget.js";
      script.async = true;
      script.setAttribute("data-render", "button");
      script.setAttribute("data-public-key", publicKey);
      script.setAttribute("data-currency", currency);
      script.setAttribute("data-amount-in-cents", amountInCents.toString());
      script.setAttribute("data-reference", reference);
      script.setAttribute("data-signature:integrity", data.hash);
      script.setAttribute("data-redirect-url", redirectUrl);

      formRef.current.innerHTML = ""; // Limpiar antes de agregar el nuevo botón
      formRef.current.appendChild(script);
      setCargado(true);
    };

    loadScript();
  }, [cart, cargado]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">
          🧾 Resumen del Carrito
        </h2>

        {cart.map((item) => (
          <div key={item.id} className="mb-3 border-b pb-2">
            <p className="text-lg font-medium text-gray-800">{item.name}</p>
            <p className="text-sm text-gray-600">
              {item.quantity} x ${item.price} = $
              {(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}

        <div className="mt-6 text-lg font-semibold text-gray-900">
          Total:{" "}
          <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
        </div>

        {error && <p className="text-red-600 font-medium mt-4">{error}</p>}

        <form ref={formRef} className="mt-6 flex justify-center" />
      </div>
    </div>
  );
};
export default Checkout;
