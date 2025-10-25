import { Button } from '../components/ui/button'
import { useStore } from '../lib/store'
import { createOrder } from '../lib/api'

const BUSINESS_PHONE = '254721248369'

export default function Cart() {
  const { cart, removeFromCart, clearCart, user } = useStore()
  const items = cart.map(ci => ({
    name: ci.product.name,
    qty: ci.quantity,
    unit: ci.product.basePrice,
    total: ci.quantity * ci.product.basePrice,
    details: ci.customization ? Object.entries(ci.customization).map(([k,v])=>`${k}:${v}`).join(', ') : '—',
    productId: ci.product._id,
    customizationDetails: ci.customization || {},
  }))
  const subtotal = items.reduce((s, i) => s + i.total, 0)
  const shipping = subtotal > 5000 ? 0 : 300
  const grand = subtotal + shipping

  const handleWhatsApp = async () => {
    // create order record for admin tracking
    try {
      await createOrder({
        userId: user?.id || null,
        customerName: user?.name,
        customerPhone: undefined,
        items: items.map(i => ({ productId: i.productId, name: i.name, quantity: i.qty, unitPrice: i.unit, customizationDetails: i.customizationDetails })),
        subtotal,
        shippingFee: shipping,
        totalAmount: grand,
      })
    } catch {}

    const parts = [
      `New Order from Website`,
      '',
      ...items.map(i => `• ${i.name} (${i.details}) x${i.qty} @ KSh ${i.unit} = KSh ${i.total}`),
      '',
      `Subtotal: KSh ${subtotal}`,
      `Shipping: KSh ${shipping}`,
      `Total: KSh ${grand}`,
      '',
      `Customer Name: ${user?.name ?? ''}`,
      `Customer Phone:`,
    ]
    const text = encodeURIComponent(parts.join('\n'))
    window.location.href = `https://wa.me/${BUSINESS_PHONE}?text=${text}`
  }

  return (
    <section className="container py-12">
      <h1 className="text-3xl font-bold mb-4">Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((i, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-md border border-slate-200 dark:border-slate-800">
              <div>
                <p className="font-medium">{i.name}</p>
                <p className="text-sm text-slate-600">{i.details}</p>
              </div>
              <div className="text-right">
                <p>x{i.qty}</p>
                <p>KSh {i.total}</p>
                <button className="text-xs underline" onClick={()=>removeFromCart(i.productId)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-md border border-slate-200 dark:border-slate-800 h-fit">
          <div className="flex items-center justify-between"><span>Subtotal</span><span>KSh {subtotal}</span></div>
          <div className="flex items-center justify-between"><span>Shipping</span><span>KSh {shipping}</span></div>
          <div className="flex items-center justify-between font-semibold mt-2"><span>Total</span><span>KSh {grand}</span></div>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
            <Button onClick={handleWhatsApp}>Proceed to WhatsApp</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
