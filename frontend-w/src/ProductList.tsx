import { useEffect, useState } from "react";
import { useCart } from "./contexts/CartContext";
import type { Product } from "./types/Product";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/products`);
        const data = await res.json();
        setProducts(data);
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
      <h2 className="text-3xl font-bold mb-6 underline underline-offset-4 decoration-blue-500">
        Productos disponibles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
        {products.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between w-full"
              >
                <div>
                  <h3 className="text-lg font-bold text-blue-700">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {product.description}
                  </p>
                  <p className="text-gray-800 font-semibold">
                    💲{product.price}
                  </p>
                  <p className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </p>
                </div>
                <button
                  className={`mt-4 text-sm rounded px-4 py-2 transition ${
                    product.stock <= 0
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                    })
                  }
                  disabled={product.stock <= 0}
                >
                  Agregar al carrito
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
