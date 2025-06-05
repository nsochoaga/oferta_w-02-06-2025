import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "./contexts/CartContext";

const PaymentResult = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { cart, clearCart } = useCart();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const id = params.get("id");

    if (!id) {
      setError("No se encontró el ID de la transacción.");
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await fetch(`${apiUrl}/payment/status?id=${id}`);
        const data = await res.json();
        setStatus(data.status);

        if (data.status === "APPROVED") {
          const orderRes = await fetch(`${apiUrl}/orders`, {
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
            localStorage.removeItem("deliveryAddress");
          } else {
            console.error("❌ Error al crear la orden");
          }

          const order = await orderRes.json();
          const storedAddress =
            localStorage.getItem("deliveryAddress") || "Sin dirección";

          await fetch(`${apiUrl}/delivery`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: order.id,
              address: storedAddress,
              status: "PENDING",
            }),
          });
        }
      } catch (err) {
        console.error(err);
        setError("Error al consultar la transacción.");
      }
    };

    fetchStatus();
  }, [params]);

  if (error)
    return (
      <div className="p-8 text-center text-red-600 font-semibold text-lg">
        ❌ Error: {error}
      </div>
    );

  if (!status)
    return (
      <div className="p-8 text-center text-gray-600 text-lg">
        ⏳ Consultando transacción...
      </div>
    );

  const statusColor =
    status === "APPROVED"
      ? "text-green-600 bg-green-100 border-green-300"
      : status === "DECLINED"
      ? "text-red-600 bg-red-100 border-red-300"
      : status === "PENDING"
      ? "text-yellow-600 bg-yellow-100 border-yellow-300"
      : "text-gray-600 bg-gray-100 border-gray-300";

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-md border text-center">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        🎉 Resultado del Pago
      </h2>
      <div className={`rounded-md p-4 border ${statusColor}`}>
        <p className="text-lg font-medium">
          Estado de la transacción:
          <span className="block text-2xl mt-2 font-bold">{status}</span>
        </p>
      </div>

      {status === "APPROVED" && (
        <p className="mt-4 text-green-700 font-semibold">
          ¡Tu pago fue exitoso! Hemos registrado tu orden y será entregada
          pronto. 🛍️
        </p>
      )}

      {status === "DECLINED" && (
        <p className="mt-4 text-red-600 font-medium">
          Hubo un problema con el pago. Por favor intenta nuevamente.
        </p>
      )}

      {status === "PENDING" && (
        <p className="mt-4 text-yellow-600 font-medium">
          Tu transacción está pendiente. Te notificaremos cuando se actualice.
        </p>
      )}

      <div className="mt-6">
        <a
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default PaymentResult;
