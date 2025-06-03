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

  useEffect(() => {
    const loadScript = async () => {
      if (!formRef.current || cargado || cart.length === 0) return;

      const publicKey = "pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7";
      const currency = "COP";
      const amountInCents = Math.round(totalAmount * 100); // importante: convertir a centavos

      try {
        await fetch("http://localhost:3000/payment/transaction", {
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
          `http://localhost:3000/payment/integrity-hash?reference=${reference}&amount=${amountInCents}&currency=${currency}`
        );
        data = await res.json();
        console.log("Hash recibido:", data.hash);
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
      script.setAttribute(
        "data-redirect-url",
        "http://localhost:5173/payment-result"
      );

      formRef.current.innerHTML = ""; // Limpiar antes de agregar el nuevo botón
      formRef.current.appendChild(script);
      setCargado(true);
    };

    loadScript();
  }, [cart, cargado]);

  return (
    <div>
      <h2>Resumen del carrito</h2>
      {cart.map((item) => (
        <p key={item.id}>
          {item.name} x {item.quantity} = $
          {(item.price * item.quantity).toFixed(2)}
        </p>
      ))}
      <p>
        Total: <strong>${totalAmount.toFixed(2)}</strong>
      </p>
      <form ref={formRef} />
    </div>
  );
};

export default Checkout;
