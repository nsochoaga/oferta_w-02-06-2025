import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ProductList from "../ProductList";

// Mock global fetch
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            id: 1,
            name: "Producto de prueba",
            description: "Descripción del producto",
            price: 100,
            stock: 5,
          },
        ]),
    })
  ) as unknown as typeof fetch;
});

describe("ProductList", () => {
  it("renderiza título", async () => {
    render(<ProductList />);
    await waitFor(() => {
      expect(screen.getByText(/productos disponibles/i)).toBeInTheDocument();
    });
  });

  it("muestra el producto mockeado", async () => {
    render(<ProductList />);
    await waitFor(() => {
      expect(screen.getByText("Producto de prueba")).toBeInTheDocument();
      expect(screen.getByText("💲100")).toBeInTheDocument();
      expect(screen.getByText(/stock: 5/i)).toBeInTheDocument();
    });
  });
});
