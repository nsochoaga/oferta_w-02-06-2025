import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  console.log("Total del carrito:", cart);
  if (cart.length === 0) {
    return <p>El carrito está vacío.</p>;
  }

  return (
    <div>
      <h2>Carrito de Compras</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} x {item.quantity} = $
            {(item.price * item.quantity).toFixed(2)}
            <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <p>
        Total: <strong>${total.toFixed(2)}</strong>
      </p>
      <button onClick={clearCart}>Vaciar Carrito</button>
      <Link to="/checkout">
        <button>Proceder al pago</button>
      </Link>
    </div>
  );
};

export default Cart;
