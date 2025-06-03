import { useEffect, useState } from "react";

interface Delivery {
  id: number;
  address: string;
  status: string;
  orderId: number;
}

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await fetch("http://localhost:3000/delivery");
        const data = await res.json();
        setDeliveries(data);
      } catch (err) {
        console.error("Error al cargar entregas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:3000/delivery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const updated = await res.json();
      setDeliveries((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: updated.status } : d))
      );
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  if (loading) return <p>Cargando entregas...</p>;

  return (
    <div>
      <h2>Entregas</h2>
      {deliveries.length === 0 ? (
        <p>No hay entregas registradas.</p>
      ) : (
        <ul>
          {deliveries.map((delivery) => (
            <li key={delivery.id}>
              Orden #{delivery.orderId} - {delivery.address} -{" "}
              <strong>{delivery.status}</strong>
              <select
                value={delivery.status}
                onChange={(e) => updateStatus(delivery.id, e.target.value)}
              >
                <option value="PENDING">PENDING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Deliveries;
