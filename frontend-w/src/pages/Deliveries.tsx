import { useEffect, useState } from "react";

interface Order {
  id: number;
  reference: string;
  createdAt: string;
  customerEmail: string;
}

interface Delivery {
  id: number;
  address: string;
  status: string;
  order: Order;
}

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await fetch(`${apiUrl}/delivery`);
        const data = await res.json();
        setDeliveries(data);
        console.log("Entregas cargadas:", data);
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
      const res = await fetch(`${apiUrl}/delivery/${id}`, {
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

  if (loading)
    return <p className="text-center text-gray-500">Cargando entregas...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          🚚 Gestión de Entregas
        </h2>

        {deliveries.length === 0 ? (
          <p className="text-center text-gray-600">
            No hay entregas registradas.
          </p>
        ) : (
          <ul className="space-y-4">
            {deliveries.map((delivery) => (
              <li
                key={delivery.id}
                className="bg-white p-6 rounded-xl shadow flex flex-col sm:flex-row sm:items-center justify-between"
              >
                <div className="mb-2 sm:mb-0">
                  <p className="text-gray-800 font-semibold">
                    Pedido #{delivery.order.reference}
                  </p>
                  <p className="text-gray-600">📍 {delivery.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full
                      ${
                        delivery.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : delivery.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                  >
                    {delivery.status}
                  </span>
                  <select
                    value={delivery.status}
                    onChange={(e) => updateStatus(delivery.id, e.target.value)}
                    className="ml-2 px-3 py-1 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Deliveries;
