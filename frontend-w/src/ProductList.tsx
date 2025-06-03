import { useEffect, useState } from "react";
import { useCart } from "./contexts/CartContext";
import type { Product } from "./types/Product";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/products");
        const data = await res.json();
        setProducts(data);
        console.log("Productos obtenidos:", data);
      } catch (err) {
        console.error("Error al obtener los productos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div>
      <h2>Lista de Productos</h2>
      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <strong>{product.name}</strong> - {product.description} <br />
              Precio: ${product.price} | Stock: {product.stock}
              <button
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                  })
                }
              >
                Agregar al carrito
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
