import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentResult = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
