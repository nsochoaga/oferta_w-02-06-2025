import { useEffect, useState } from "react";

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [products, setProducts] = useState([]);
  const [transactionStatuses, setTransactionStatuses] = useState<
    Record<string, string>
  >({});
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, deliveriesRes, productsRes] = await Promise.all([
          fetch(`${apiUrl}/orders`),
          fetch(`${apiUrl}/delivery`),
          fetch(`${apiUrl}/products`),
        ]);

        const [ordersData, deliveriesData, productsData] = await Promise.all([
          ordersRes.json(),
          deliveriesRes.json(),
          productsRes.json(),
        ]);

        setOrders(ordersData);
        setDeliveries(deliveriesData);
        setProducts(productsData);

        await fetchStatuses();
      } catch (err) {
        console.error("Error al obtener datos del panel:", err);
      }
    };

    const fetchStatuses = async () => {
      try {
        const res = await fetch(`${apiUrl}/payment/all`);
        const data = await res.json();

        const statusMap: Record<string, string> = {};
        data.forEach((tx: any) => {
          if (tx.reference) {
            statusMap[tx.reference] = tx.status || "SIN ESTADO";
          }
        });

        setTransactionStatuses(statusMap);
      } catch (err) {
        console.error("❌ Error al obtener transacciones:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">
          📊 Panel de Administración
        </h2>

        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            🧾 Órdenes
          </h3>
          <ul className="space-y-4">
            {orders.map((order: any) => (
              <li
                key={order.id}
                className="bg-white p-6 rounded-xl shadow-md space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <p className="font-medium text-gray-800">
                    ID: {order.id} | Email: {order.customerEmail}
                  </p>
                  <p className="text-sm">
                    <strong>Estado Transacción: </strong>
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs font-semibold
                        ${
                          transactionStatuses[order.reference] === "APPROVED"
                            ? "bg-green-500"
                            : transactionStatuses[order.reference] ===
                              "DECLINED"
                            ? "bg-red-500"
                            : transactionStatuses[order.reference] === "PENDING"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                        }`}
                    >
                      {transactionStatuses[order.reference] ?? "Cargando..."}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Productos:</p>
                  <ul className="pl-4 list-disc text-sm text-gray-600">
                    {order.items?.map((item: any) => (
                      <li key={item.id}>
                        {item.product?.name || "Producto desconocido"} x{" "}
                        {item.quantity} = ${item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            🚚 Entregas
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2">
            {deliveries.map((delivery: any) => (
              <li
                key={delivery.id}
                className="bg-white p-4 rounded-lg shadow text-gray-700"
              >
                <p>
                  <strong>Pedido #{delivery.order.id}</strong>
                </p>
                <p>📍 {delivery.address}</p>
                <p>
                  🛈 Estado:{" "}
                  <span className="font-medium">{delivery.status}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            📦 Productos
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product: any) => (
              <li
                key={product.id}
                className="bg-white p-4 rounded-lg shadow text-gray-800"
              >
                <p className="font-bold">{product.name}</p>
                <p className="text-sm text-gray-600">Stock: {product.stock}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;
