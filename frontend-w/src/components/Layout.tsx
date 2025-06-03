import { Link } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 font-sans">
      <nav className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-600">Mi Tienda</h1>
        <ul className="flex gap-4 text-sm font-medium">
          <li>
            <Link to="/" className="hover:text-indigo-500">
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/cart" className="hover:text-indigo-500">
              Carrito
            </Link>
          </li>
          <li>
            <Link to="/checkout" className="hover:text-indigo-500">
              Pago
            </Link>
          </li>
          <li>
            <Link to="/deliveries" className="hover:text-indigo-500">
              Entregas
            </Link>
          </li>
          <li>
            <Link to="/admin" className="hover:text-indigo-500">
              Admin
            </Link>
          </li>
        </ul>
      </nav>
      <main className=" mx-auto p-6">{children}</main>
    </div>
  );
};

export default Layout;
