import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'tc_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const count = items.reduce((sum, it) => sum + it.quantity, 0);
  const total = items.reduce((sum, it) => sum + it.quantity * Number(it.price || 0), 0);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.id);
      if (existing) {
        return prev.map((it) =>
          it.id === product.id ? { ...it, quantity: it.quantity + quantity } : it
        );
      }
      return [
        ...prev,
        { id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url, quantity },
      ];
    });
  };

  const setQuantity = (id, quantity) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((it) => it.id !== id)
        : prev.map((it) => (it.id === id ? { ...it, quantity } : it))
    );
  };

  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id));
  const clearCart = () => setItems([]);

  const value = useMemo(
    () => ({ items, count, total, addToCart, setQuantity, removeItem, clearCart }),
    [items, count, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}