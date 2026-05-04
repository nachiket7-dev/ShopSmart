import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, X, Plus, Minus, Lock } from 'lucide-react';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${apiUrl}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: cartItems.map((item) => ({
                        product: item._id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                    total: cartTotal,
                }),
            });

            if (!res.ok) throw new Error('Order failed');

            clearCart();
            navigate('/orders');
        } catch (err) {
            console.error('Checkout error:', err);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-white">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Your Bag is Empty</h2>
                <p className="text-gray-500 mb-8 max-w-sm text-center text-sm">Looks like you haven&apos;t added anything yet. Discover our premium collection to get started.</p>
                <Link
                    to="/"
                    className="bg-brand-600 text-white font-medium py-3 px-8 rounded flex items-center gap-2 hover:bg-brand-700 transition-colors text-sm"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-white min-h-screen">
            <div className="mb-12 border-b border-gray-100 pb-6 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Your Bag</h1>
                    <p className="text-gray-500 mt-2 text-sm">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your bag.</p>
                </div>
                <Link to="/" className="text-sm font-semibold text-brand-600 hover:underline">Continue Shopping</Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                
                {/* Cart Items List */}
                <div className="lg:col-span-8 flex flex-col space-y-8">
                    <AnimatePresence>
                        {cartItems.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-gray-100 relative group"
                            >
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="absolute top-0 right-0 p-2 text-gray-400 hover:text-red-500 transition-colors bg-white z-10"
                                    title="Remove Item"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                
                                <div className="w-full sm:w-32 h-32 bg-gray-50 rounded flex items-center justify-center p-4 flex-shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-contain mix-blend-multiply"
                                    />
                                </div>
                                
                                <div className="flex-grow flex flex-col justify-between h-full w-full pr-8">
                                    <div className="mb-4">
                                        <Link to={`/product/${item._id}`} className="font-display font-semibold text-lg text-gray-900 hover:text-brand-600 transition-colors line-clamp-1 mb-1">
                                            {item.name}
                                        </Link>
                                        <p className="text-xs text-gray-500 font-medium">COLOR: <span className="text-gray-900">OBSIDIAN GREY</span> | SIZE: <span className="text-gray-900">M</span></p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center border border-gray-200 p-1 w-28 justify-between">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-sm font-medium text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        
                                        <p className="text-lg font-semibold text-gray-900">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4 sticky top-28">
                    <div className="bg-gray-50 p-8">
                        <h3 className="text-lg font-display font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">Order Summary</h3>
                        
                        <div className="space-y-4 font-medium text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="text-gray-900">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping Estimate</span>
                                <span className="text-gray-900">Free</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax Estimate</span>
                                <span className="text-gray-900">Calculated at checkout</span>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between items-end">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full mt-8 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-4 px-6 transition-colors flex items-center justify-center gap-2 items-center text-sm tracking-wider"
                        >
                            {user ? 'CHECKOUT' : 'SIGN IN TO CHECKOUT'}
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                        
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <p className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Lock className="w-3 h-3" /> SECURE CHECKOUT
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                We accept all major credit cards. Your payment information is encrypted and secure.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
