import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Search, Heart, User, ShieldCheck, PackageSearch, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navLinks = [
        { name: 'NEW ARRIVALS', path: '/' },
        { name: 'COLLECTIONS', path: '/' },
        { name: 'BRANDS', path: '/' },
        { name: 'JOURNAL', path: '/' },
        { name: 'SALE', path: '/' },
    ];

    return (
        <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center">
                        <span className="text-xl font-bold text-black tracking-tight font-sans">
                            ShopSmart
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path}
                                className={`text-xs font-semibold tracking-wide transition-colors ${link.name === 'COLLECTIONS' ? 'text-brand-600 border-b-2 border-brand-600 pb-1' : 'text-gray-500 hover:text-black pt-1'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right side nav items */}
                    <div className="flex items-center space-x-6">
                        
                        {/* Search Bar */}
                        <div className="hidden md:block w-48 lg:w-64">
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const query = new FormData(e.target).get('search');
                                    if (query) window.location.href = `/?search=${encodeURIComponent(query)}`;
                                    else window.location.href = `/`;
                                }}
                                className="relative text-gray-400 focus-within:text-gray-600"
                            >
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search products..."
                                    defaultValue={new URLSearchParams(window.location.search).get('search') || ''}
                                    className="w-full bg-gray-50 text-gray-900 text-xs rounded-full focus:ring-1 focus:ring-gray-200 outline-none block pl-9 pr-4 py-2 hover:bg-gray-100 transition-colors"
                                />
                            </form>
                        </div>

                        <div className="flex items-center space-x-4 text-gray-900">
                            <button className="hover:text-brand-600 transition-colors">
                                <Heart className="w-5 h-5" />
                            </button>
                            
                            {/* Cart Button */}
                            <Link
                                to="/cart"
                                className="relative hover:text-brand-600 transition-colors"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-brand-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* User Profile / Login */}
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="hover:text-brand-600 transition-colors focus:outline-none flex items-center"
                                    >
                                        <User className="w-5 h-5" />
                                    </button>

                                    <AnimatePresence>
                                        {dropdownOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setDropdownOpen(false)}
                                                ></div>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute right-0 mt-4 w-56 bg-white shadow-xl border border-gray-100 z-50"
                                                >
                                                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                                                        <p className="text-sm font-semibold text-black truncate">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {user.email}
                                                        </p>
                                                    </div>

                                                    <div className="py-2">
                                                        {user.isAdmin && (
                                                            <Link
                                                                to="/admin"
                                                                onClick={() => setDropdownOpen(false)}
                                                                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                            >
                                                                <ShieldCheck className="w-4 h-4 text-brand-600" />
                                                                <span className="font-medium text-brand-600">Admin Dashboard</span>
                                                            </Link>
                                                        )}
                                                        <Link
                                                            to="/orders"
                                                            onClick={() => setDropdownOpen(false)}
                                                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <PackageSearch className="w-4 h-4 text-gray-400" />
                                                            <span>My Orders</span>
                                                        </Link>
                                                    </div>

                                                    <div className="py-2 border-t border-gray-100">
                                                        <button
                                                            onClick={() => {
                                                                logout();
                                                                setDropdownOpen(false);
                                                            }}
                                                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <LogOut className="w-4 h-4 text-gray-400" />
                                                            <span>Log out</span>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="hover:text-brand-600 transition-colors"
                                >
                                    <User className="w-5 h-5" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
