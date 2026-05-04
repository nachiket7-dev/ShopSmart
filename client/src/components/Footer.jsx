import { Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-20 pb-10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-1 lg:col-span-2">
                        <Link to="/" className="text-xl font-bold text-black tracking-tight mb-4 inline-block font-sans">
                            ShopSmart
                        </Link>
                        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                        Curating the world&apos;s most exceptional objects for the modern home and wardrobe. Quality first, always.
                        </p>
                    </div>

                    {/* Columns */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-900 tracking-wider uppercase mb-5">Shop</h4>
                        <ul className="space-y-3">
                            {['New Arrivals', 'Featured Collections', 'Best Sellers', 'Sale'].map(link => (
                                <li key={link}>
                                    <Link to="/" className="text-sm text-gray-500 hover:text-black transition-colors">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="text-xs font-semibold text-gray-900 tracking-wider uppercase mb-5">Support</h4>
                        <ul className="space-y-3">
                            {['Shipping & Returns', 'Size Guide', 'Contact Us'].map(link => (
                                <li key={link}>
                                    <Link to="/" className="text-sm text-gray-500 hover:text-black transition-colors">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-gray-900 tracking-wider uppercase mb-5">Company</h4>
                        <ul className="space-y-3">
                            {['Sustainability', 'Privacy Policy', 'Terms of Service'].map(link => (
                                <li key={link}>
                                    <Link to="/" className="text-sm text-gray-500 hover:text-black transition-colors">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter (hidden on lg, can be put in a different row if strict matching, but grid works well) */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-5 lg:w-1/3 lg:ml-auto lg:-mt-[150px]">
                        <h4 className="text-xs font-semibold text-gray-900 tracking-wider uppercase mb-5">Editorial</h4>
                        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                            Join our journal for exclusive drops and narratives.
                        </p>
                        <form className="flex" onSubmit={e => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                className="bg-white border border-gray-200 text-sm px-4 py-2.5 outline-none focus:border-brand-600 transition-colors flex-1 w-full"
                            />
                            <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-5 transition-colors flex items-center justify-center">
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">
                        &copy; 2026 ShopSmart Editorial. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-gray-400">
                        <span className="text-xs uppercase tracking-wider font-semibold cursor-pointer hover:text-black transition-colors">Instagram</span>
                        <span className="text-xs uppercase tracking-wider font-semibold cursor-pointer hover:text-black transition-colors">X</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
