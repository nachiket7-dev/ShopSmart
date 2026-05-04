import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        fetch(`${apiUrl}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setOrders(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching orders:', err);
                setLoading(false);
            });
    }, [token]);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-brand-100 text-brand-800 border-brand-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex justify-center items-center">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-t-2 border-brand-600 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Package className="w-8 h-8 text-brand-600" />
                </div>
                <h1 className="text-4xl font-display font-bold text-gray-900 tracking-tight mb-4">Order History</h1>
                <p className="text-gray-500 text-lg">Track, manage, and review your recent purchases.</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven&apos;t made a purchase yet. Explore our collection to find something you love.</p>
                    <Link to="/" className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-sm font-semibold rounded-xl text-white bg-gray-900 hover:bg-brand-600 hover:shadow-lg transition-all">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={order._id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors"
                        >
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 sm:px-8 sm:py-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 flex-grow">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Order Placed</p>
                                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total</p>
                                        <p className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</p>
                                    </div>
                                    <div className="col-span-2 sm:col-span-2">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
                                        <p className="text-sm font-medium text-gray-900 font-mono">#{order._id.toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 text-right">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border capitalize tracking-wide ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6 sm:p-8">
                                <ul className="divide-y divide-gray-100">
                                    {order.items.map((item, idx) => (
                                        <li key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <Package className="w-8 h-8 text-gray-300" />
                                                </div>
                                                <div>
                                                    <p className="text-base font-semibold text-gray-900 mb-1">{item.name}</p>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {/* Order Footer */}
                            <div className="bg-gray-50 px-6 py-4 sm:px-8 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    Covered by ShopSmart Guarantee
                                </p>
                                <button className="text-sm font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1 group">
                                    View Invoice <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </main>
    );
}
