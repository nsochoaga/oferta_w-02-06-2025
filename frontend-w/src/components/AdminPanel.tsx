// src/components/AdminPanel.tsx
import { useEffect, useState } from "react";

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [products, setProducts] = useState([]);
  const [transactionStatuses, setTransactionStatuses] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, deliveriesRes, productsRes] = await Promise.all([
          fetch("http://localhost:3000/orders"),
          fetch("http://localhost:3000/delivery"),
          fetch("http://localhost:3000/products"),
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
    fetchData();

    const fetchStatuses = async () => {
      try {
        const res = await fetch("http://localhost:3000/payment/all");
        const data = await res.json(); // array de transacciones

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
  }, []);

  return (
    <div>
      <h2>📊 Panel de Administración</h2>

      <section>
        <h3>🧾 Órdenes</h3>
        <ul>
          {orders.map((order: any) => (
            <li key={order.id}>
              <p>
                ID: {order.id} | Email: {order.customerEmail}
              </p>
              <p>
                <strong>Estado de Transacción:</strong>{" "}
                {transactionStatuses[order.reference] ?? "Cargando..."}
              </p>
              <p>
                <strong>Productos comprados:</strong>
              </p>
              <ul>
                {order.items?.map((item: any) => (
                  <li key={item.id}>
                    {item.product?.name || "Producto desconocido"} x{" "}
                    {item.quantity} = ${item.price}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>🚚 Entregas</h3>
        <ul>
          {deliveries.map((delivery: any) => (
            <li key={delivery.id}>
              Pedido #{delivery.order.id} - Dirección: {delivery.address} -
              Estado: {delivery.status}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>📦 Productos</h3>
        <ul>
          {products.map((product: any) => (
            <li key={product.id}>
              {product.name} - Stock: {product.stock}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPanel;
