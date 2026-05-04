import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, ShieldCheck, Truck, ShieldAlert, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

export default function ProductPage() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description');
    const [selectedSize, setSelectedSize] = useState('M');
    
    // Placeholder similar items
    const [similar, setSimilar] = useState([]);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        fetch(`${apiUrl}/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setLoading(false);
                
                // Fetch similar (just fetching first 4 for visual)
                fetch(`${apiUrl}/api/products?limit=4`)
                    .then(res => res.json())
                    .then(simData => setSimilar(simData.products || []));
            })
            .catch((err) => {
                console.error('Error fetching product:', err);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        toast.success(`Added ${product.name} to cart`);
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex justify-center items-center">
                <div className="w-8 h-8 rounded-full border-t-2 border-brand-600 animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
                <ShieldAlert className="w-16 h-16 text-gray-300 mb-6" />
                <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Product Not Found</h2>
                <Link to="/" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-brand-600 transition-colors">
                    Return to Shop
                </Link>
            </div>
        );
    }

    return (
        <main className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="text-xs text-gray-500 mb-8 font-medium">
                    <Link to="/" className="hover:text-gray-900">Shop</Link>
                    <span className="mx-2">&rsaquo;</span>
                    <Link to="/" className="hover:text-gray-900">Collections</Link>
                    <span className="mx-2">&rsaquo;</span>
                    <span className="text-gray-900">{product.name}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-24">
                    
                    {/* Image Gallery */}
                    <div className="w-full lg:w-[60%] flex gap-4">
                        {/* Thumbnails */}
                        <div className="hidden md:flex flex-col gap-4 w-20 flex-shrink-0">
                            {[...Array(4)].map((_, i) => (
                                <button key={i} className={`aspect-square rounded-lg overflow-hidden border-2 ${i === 0 ? 'border-brand-600' : 'border-transparent hover:border-gray-200'} transition-colors`}>
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center p-2">
                                        <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover mix-blend-multiply" />
                                    </div>
                                </button>
                            ))}
                        </div>
                        
                        {/* Main Image */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="flex-1 bg-[#1a1c1d] rounded-2xl overflow-hidden aspect-[4/5] md:aspect-auto md:h-[700px] flex items-center justify-center relative shadow-sm"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-[80%] h-[80%] object-contain"
                            />
                        </motion.div>
                    </div>

                    {/* Details Column */}
                    <div className="w-full lg:w-[40%] flex flex-col pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-bold tracking-widest text-brand-600 uppercase">
                                {product.category || 'Limited Edition'}
                            </span>
                            <div className="flex flex-col items-end">
                                <div className="flex text-red-600">
                                    {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-3 h-3" />)}
                                </div>
                                <span className="text-[10px] text-gray-500 font-medium mt-1">(124 Reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 leading-tight mb-4">
                            {product.name}
                        </h1>
                        <p className="text-2xl font-semibold text-gray-900 mb-8">
                            ${product.price.toFixed(2)}
                        </p>

                        {/* Color Selector placeholder */}
                        <div className="mb-6">
                            <p className="text-xs font-bold text-gray-900 tracking-wider mb-3">COLOR: <span className="text-gray-500 font-medium ml-1">OBSIDIAN GREY</span></p>
                            <div className="flex gap-3">
                                <button className="w-8 h-8 rounded-full bg-gray-800 ring-2 ring-offset-2 ring-brand-600 focus:outline-none"></button>
                                <button className="w-8 h-8 rounded-full bg-blue-800 ring-2 ring-offset-2 ring-transparent hover:ring-gray-300 focus:outline-none"></button>
                                <button className="w-8 h-8 rounded-full bg-emerald-800 ring-2 ring-offset-2 ring-transparent hover:ring-gray-300 focus:outline-none"></button>
                            </div>
                        </div>

                        {/* Size Selector */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-xs font-bold text-gray-900 tracking-wider">SIZE</p>
                                <button className="text-xs text-brand-600 font-semibold hover:underline">Size Guide</button>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {['S', 'M', 'L', 'XL'].map(size => (
                                    <button 
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-3 text-sm font-semibold border ${selectedSize === size ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-900 border-transparent hover:border-gray-200'} transition-colors text-center`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3 mb-8 mt-auto">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-4 px-8 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span>Add to Cart</span>
                            </button>
                            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 px-8 transition-colors">
                                Wishlist
                            </button>
                        </div>

                        {/* Features List */}
                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                            <div className="flex items-center text-xs font-medium text-gray-600">
                                <Truck className="w-4 h-4 text-brand-600 mr-2" /> Free Express Shipping
                            </div>
                            <div className="flex items-center text-xs font-medium text-gray-600">
                                <ShieldCheck className="w-4 h-4 text-brand-600 mr-2" /> 2 Year Warranty
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lower Tabs Section */}
                <div className="max-w-4xl mx-auto mb-24">
                    <div className="flex justify-center border-b border-gray-200 mb-12">
                        {['DESCRIPTION', 'SPECIFICATIONS', 'SHIPPING', 'REVIEWS (124)'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                                className={`px-8 py-4 text-xs font-bold tracking-wider transition-colors border-b-2 -mb-[2px] ${activeTab === tab.toLowerCase().split(' ')[0] ? 'text-brand-600 border-brand-600' : 'text-gray-500 border-transparent hover:text-gray-900'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-600 text-sm leading-relaxed">
                        <div>
                            <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">Designed for the Modern Explorer</h3>
                            <p className="mb-6">{product.description}</p>
                            <p>Every detail is precise and measured. We designed this to integrate seamlessly into your daily rotation without compromise.</p>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1"><ShieldCheck className="w-5 h-5 text-brand-600" fill="currentColor" stroke="white" /></div>
                                <div className="ml-4">
                                    <h4 className="text-gray-900 font-semibold mb-1">Premium Materials</h4>
                                    <p className="text-xs">Engineered from the finest source material guarantees longevity and comfort.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1"><ShieldCheck className="w-5 h-5 text-brand-600" fill="currentColor" stroke="white" /></div>
                                <div className="ml-4">
                                    <h4 className="text-gray-900 font-semibold mb-1">Waterproof & Breathable</h4>
                                    <p className="text-xs">Advanced technology rating ensures protection against elements.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1"><ShieldCheck className="w-5 h-5 text-brand-600" fill="currentColor" stroke="white" /></div>
                                <div className="ml-4">
                                    <h4 className="text-gray-900 font-semibold mb-1">Secure Storage</h4>
                                    <p className="text-xs">Hidden zippered compartments including an RFID-shielded wallet sleeve.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* You Might Also Like */}
                <div className="border-t border-gray-100 pt-16">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <p className="text-[10px] font-bold tracking-widest text-brand-600 uppercase mb-2">CURATED FOR YOU</p>
                            <h2 className="text-2xl font-display font-bold text-gray-900">You Might Also Like</h2>
                        </div>
                        <Link to="/" className="text-sm font-semibold text-brand-600 hover:underline flex items-center">
                            View Entire Collection <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {similar.map(prod => (
                            <ProductCard key={prod._id} product={prod} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
