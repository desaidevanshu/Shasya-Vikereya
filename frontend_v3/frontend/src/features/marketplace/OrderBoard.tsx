import React, { useEffect, useState } from 'react';
import { CheckCircle2, CreditCard, Package, RefreshCw, Save, ThumbsDown, ThumbsUp, Truck } from 'lucide-react';
import { api } from '../../api.ts';
import { useAuth } from '../../components/AuthContext.tsx';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface OrderBoardProps {
  role?: 'buyer' | 'farmer' | 'fpo' | 'transporter';
  title?: string;
}

export const OrderBoard: React.FC<OrderBoardProps> = ({ role, title = 'Orders & payment status' }) => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [draft, setDraft] = useState({ commodity: 'Red Onion Export Bulbs', grade: 'Grade A', quantity_kg: 1000, price_per_kg: 25.5, delivery_address: 'Vashi Direct Bulk Dock, Navi Mumbai' });

  const refresh = async () => {
    setLoading(true);
    const result = await api.getOrders(role, currentUser?.uid);
    setOrders(result.orders || []);
    setLoading(false);
  };

  useEffect(() => { void refresh(); }, [role, currentUser?.uid]);

  const createAndPay = async () => {
    setMessage('Creating a secure order...');
    const created = await api.createOrder({
      buyer_uid: currentUser?.uid,
      buyer_name: currentUser?.displayName || currentUser?.email || 'Verified Buyer',
      ...draft,
    }) as any;
    if (!created?.order_id) {
      setMessage('Order service is unavailable. Start the backend and try again.');
      return;
    }
    const payment = await api.initiateOrderPayment(created.order_id) as any;
    if (payment?.mode === 'razorpay' && payment.order?.gateway_order_id) {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise<void>((resolve) => { script.onload = () => resolve(); script.onerror = () => resolve(); });
      }
      if (!window.Razorpay) {
        setMessage('Payment gateway could not load. Please try again.');
      } else {
        const gatewayOrder = payment.order;
        new window.Razorpay({
          key: payment.key_id,
          amount: Math.round(Number(gatewayOrder.produce_value_rs) * 100),
          currency: 'INR',
          name: 'Shasya Vikreya',
          description: `${gatewayOrder.quantity_kg} kg ${gatewayOrder.commodity}`,
          order_id: gatewayOrder.gateway_order_id,
          handler: async (response: Record<string, string>) => {
            await api.verifyOrderPayment(created.order_id, response);
            setMessage('Payment verified. Order released for smart-route dispatch.');
            await refresh();
          },
          theme: { color: '#10b981' },
        }).open();
      }
    } else {
      setMessage(payment?.mode === 'demo' ? 'Demo payment recorded and order released for dispatch.' : 'Payment could not be started.');
    }
    await refresh();
  };

  const updateOrder = async (orderId: string, updates: Record<string, unknown>, successMessage: string) => {
    try {
      const result = await api.updateOrder(orderId, updates) as any;
      setMessage(result?.order_id ? successMessage : 'Order update failed.');
      await refresh();
    } catch {
      setMessage('Order update failed. Check that the backend and Firestore are running.');
    }
  };

  return (
    <section className="bg-surface-container-low dark:bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-headline-sm text-base font-bold text-primary flex items-center gap-2"><Package className="w-4 h-4 text-secondary-fixed" />{title}</h2>
          <p className="text-xs text-on-surface-variant mt-1">Every order stores quantity, agreed price, payment, delivery, and dispatch state.</p>
        </div>
        <button onClick={() => void refresh()} className="p-2 rounded-xl border border-outline-variant/40 text-on-surface-variant hover:text-primary" title="Refresh orders"><RefreshCw className="w-4 h-4" /></button>
      </div>
      {message && <div className="text-xs text-secondary-fixed bg-secondary-fixed/10 border border-secondary-fixed/30 rounded-xl p-3">{message}</div>}
      {role === 'buyer' && <div className="rounded-2xl bg-surface-container p-4 border border-outline-variant/20 space-y-3">
        <div className="text-xs font-bold text-primary">Create or edit buyer requirement</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 text-xs" value={draft.commodity} onChange={(event) => setDraft({ ...draft, commodity: event.target.value })} placeholder="Commodity" />
          <input className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 text-xs" value={draft.grade} onChange={(event) => setDraft({ ...draft, grade: event.target.value })} placeholder="Grade" />
          <input className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 text-xs" type="number" min="1" value={draft.quantity_kg} onChange={(event) => setDraft({ ...draft, quantity_kg: Number(event.target.value) })} placeholder="Quantity (kg)" />
          <input className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 text-xs" type="number" min="1" step="0.5" value={draft.price_per_kg} onChange={(event) => setDraft({ ...draft, price_per_kg: Number(event.target.value) })} placeholder="Price / kg" />
        </div>
        <input className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 text-xs" value={draft.delivery_address} onChange={(event) => setDraft({ ...draft, delivery_address: event.target.value })} placeholder="Delivery address" />
        <button onClick={() => void createAndPay()} className="w-full rounded-xl bg-secondary-fixed text-on-secondary-fixed py-2.5 text-xs font-bold flex items-center justify-center gap-2"><CreditCard className="w-4 h-4" />Create order and start demo payment</button>
      </div>}
      {loading ? <p className="text-xs text-on-surface-variant">Loading orders...</p> : orders.length === 0 ? <p className="text-xs text-on-surface-variant">No Firestore orders yet.</p> : (
        <div className="space-y-2">
          {orders.map((order) => <div key={order.order_id} className="rounded-xl bg-surface-container p-3 border border-outline-variant/20 text-xs">
            <div className="flex items-center justify-between gap-2"><strong className="text-primary">{order.order_id}</strong><span className="text-secondary-fixed font-bold">{order.payment_status}</span></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-on-surface-variant"><span>{order.commodity}</span><span>{Number(order.quantity_kg).toLocaleString()} kg</span><span>₹{Number(order.produce_value_rs).toLocaleString()}</span><span>{order.route_status}</span></div>
            <div className="mt-2 flex items-center gap-1 text-secondary-fixed"><CheckCircle2 className="w-3.5 h-3.5" /> Farmer/FPO can see this requirement</div>
            <div className="flex flex-wrap gap-2 mt-3">
              {(role === 'farmer' || role === 'fpo') && order.status !== 'SUPPLY_REJECTED' && <>
                <button onClick={() => void updateOrder(order.order_id, { status: 'SUPPLY_ACCEPTED', route_status: order.payment_status === 'PAID_DEMO' || order.payment_status === 'PAID' ? 'READY_FOR_ROUTE' : 'AWAITING_PAYMENT' }, 'Supply accepted by farmer/FPO.')} className="rounded-lg bg-secondary-fixed text-on-secondary-fixed px-3 py-2 text-[11px] font-bold flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" />Accept requirement</button>
                <button onClick={() => void updateOrder(order.order_id, { status: 'SUPPLY_REJECTED', route_status: 'RELIST_REQUIRED' }, 'Requirement declined and returned to the marketplace.')} className="rounded-lg border border-error/40 text-error px-3 py-2 text-[11px] font-bold flex items-center gap-1"><ThumbsDown className="w-3.5 h-3.5" />Decline</button>
              </>}
              {role === 'transporter' && (order.payment_status === 'PAID_DEMO' || order.payment_status === 'PAID') && order.status !== 'DISPATCH_ACCEPTED' && order.route_status !== 'IN_TRANSIT' && <button onClick={() => void updateOrder(order.order_id, { status: 'DISPATCH_ACCEPTED', route_status: 'IN_TRANSIT' }, 'Transporter accepted the paid order for smart-route dispatch.')} className="rounded-lg bg-primary text-on-primary px-3 py-2 text-[11px] font-bold flex items-center gap-1"><Truck className="w-3.5 h-3.5" />Accept dispatch</button>}
              {role === 'transporter' && order.status === 'DISPATCH_ACCEPTED' && <span className="rounded-lg bg-secondary-fixed/15 text-secondary-fixed px-3 py-2 text-[11px] font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />Dispatch accepted</span>}
              {role === 'buyer' && order.payment_status === 'CREATED' && <button onClick={() => void updateOrder(order.order_id, { ...draft }, 'Order details updated.')} className="rounded-lg border border-outline-variant/50 text-primary px-3 py-2 text-[11px] font-bold flex items-center gap-1"><Save className="w-3.5 h-3.5" />Save edits</button>}
            </div>
          </div>)}
        </div>
      )}
    </section>
  );
};
