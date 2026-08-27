import React, { createContext, useContext, useMemo, useState } from 'react'
import type { OrderType, Product } from '@/types'

export interface CartItem {
  product: Product
  quantity: number
  variant_id: string
}

interface CartContextType {
  items: CartItem[]
  orderType: OrderType
  tableNumber: string
  peopleCount: number
  discountAmount: number
  donationAmount: number
  taxRate: number
  subtotal: number
  taxAmount: number
  totalAmount: number
  addToCart: (product: Product) => void
  removeFromCart: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  setOrderType: (type: OrderType) => void
  setTableNumber: (table: string) => void
  setPeopleCount: (count: number) => void
  setDiscountAmount: (discount: number) => void
  setDonationAmount: (donation: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [orderType, setOrderType] = useState<OrderType>('dine_in')
  const [tableNumber, setTableNumber] = useState<string>('03')
  const [peopleCount, setPeopleCount] = useState<number>(2)
  const [discountAmount, setDiscountAmount] = useState<number>(0)
  const [donationAmount, setDonationAmount] = useState<number>(1.0)
  const taxRate = 0.06 // 6% standard tax

  const addToCart = (product: Product) => {
    const variantId = product.variant_id || product.id
    setItems((prevItems) => {
      const existing = prevItems.find((i) => i.variant_id === variantId)
      if (existing) {
        return prevItems.map((i) =>
          i.variant_id === variantId ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prevItems, { product, quantity: 1, variant_id: variantId }]
    })
  }

  const removeFromCart = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variant_id !== variantId))
  }

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.variant_id === variantId ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  }, [items])

  const taxAmount = useMemo(() => {
    return Math.round(subtotal * taxRate * 100) / 100
  }, [subtotal, taxRate])

  const totalAmount = useMemo(() => {
    const total = subtotal + taxAmount + donationAmount - discountAmount
    return Math.max(0, Math.round(total * 100) / 100)
  }, [subtotal, taxAmount, donationAmount, discountAmount])

  return (
    <CartContext.Provider
      value={{
        items,
        orderType,
        tableNumber,
        peopleCount,
        discountAmount,
        donationAmount,
        taxRate,
        subtotal,
        taxAmount,
        totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setOrderType,
        setTableNumber,
        setPeopleCount,
        setDiscountAmount,
        setDonationAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
