import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "./contexts/CartContext";

const PaymentResult = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { cart, clearCart } = useCart();

  useEffect(() => {
    const id = params.get("id");

    if (!id) {
      setError("No se encontró el ID de la transacción.");
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/payment/status?id=${id}`
        );
        const data = await res.json();
        setStatus(data.status);
        console.log("data obtained:", data);
        if (data.status === "APPROVED") {
          const orderRes = await fetch("http://localhost:3000/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reference: data.reference,
              customerEmail: data.email,
              items: cart.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
              })),
            }),
          });

          if (orderRes.ok) {
            console.log("✅ Orden creada exitosamente");
            clearCart();
          } else {
            console.error("❌ Error al crear la orden");
          }
          const order = await orderRes.json();

          await fetch("http://localhost:3000/delivery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: order.id,
              address: "Calle Ficticia #123",
              status: "PENDING",
            }),
          });
        }
      } catch (err) {
        setError("Error al consultar la transacción.");
      }
    };

    fetchStatus();
  }, [params]);

  if (error) return <p>Error: {error}</p>;
  if (!status) return <p>Consultando transacción...</p>;

  return (
    <div>
      <h2>Resultado del pago</h2>
      <p>
        Estado: <strong>{status}</strong>
      </p>
    </div>
  );
};

export default PaymentResult;
