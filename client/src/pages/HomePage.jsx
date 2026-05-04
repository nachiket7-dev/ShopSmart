import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, SearchX, CheckCircle2 } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

export default function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);

    const searchQuery = searchParams.get('search') || '';
    const selectedCategory = searchParams.get('category') || 'All';

    // Initial Fetch (when search/category changes)
    useEffect(() => {
        setLoading(true);
        setPage(1);
        fetchProducts(1, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, selectedCategory]);

    const fetchProducts = async (pageNum, isNewSearch = false) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const query = new URLSearchParams({
                page: pageNum,
                limit: 12,
                ...(searchQuery && { search: searchQuery }),
                ...(selectedCategory && { category: selectedCategory })
            });

            const res = await fetch(`${apiUrl}/api/products?${query.toString()}`);
            const data = await res.json();

            if (isNewSearch) {
                setProducts(data.products || []);
            } else {
                setProducts(prev => [...prev, ...(data.products || [])]);
            }
            
            setTotalPages(data.totalPages);
            setTotalProducts(data.totalProducts);
            if (data.categories) {
                // Remove duplicates and sort, ensuring "All" is manually handled
                setCategories(['All', ...data.categories.filter(c => c && c !== 'All').sort()]);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (page < totalPages) {
            setLoadingMore(true);
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProducts(nextPage, false);
        }
    };

    const handleCategoryClick = (category) => {
        const newParams = new URLSearchParams(searchParams);
        if (category === 'All') {
            newParams.delete('category');
        } else {
            newParams.set('category', category);
        }
        setSearchParams(newParams);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <div className="bg-white">
            {/* Hero Section */}
            {!searchQuery && selectedCategory === 'All' && (
                <div className="relative overflow-hidden bg-[#f0ede6]">
                    {/* Placeholder image representation */}
                    <div className="absolute inset-0 z-0 flex justify-end">
                        <img 
                            src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
                            alt="Fashion model showcasing the new standard collection" 
                            className="h-full w-4/5 lg:w-3/5 object-cover object-[70%_top]"
                        />
                        {/* Gradient fade from left to match reference text area */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#f0ede6] via-[#f0ede6] lg:via-[#f0ede6]/80 to-transparent w-full lg:w-3/4"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-48 relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="max-w-xl"
                        >
                            <p className="text-xs font-bold tracking-[0.2em] text-brand-600 mb-6 uppercase">Spring / Summer 2026</p>
                            
                            <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-8 text-black leading-[0.9]">
                                The New <br /> Standard.
                            </h1>
                            
                            <p className="text-gray-600 mb-10 text-lg leading-relaxed max-w-sm">
                                A curated selection of essentials designed for the modern architectural lifestyle. Quality meets intentionality.
                            </p>
                            
                            <button
                                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors flex items-center gap-2 group text-sm"
                            >
                                Shop the New Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Featured Collections Section */}
            {!searchQuery && selectedCategory === 'All' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex justify-between items-end mb-8">
                        <h2 className="text-2xl font-display font-bold text-gray-900">Featured Collections</h2>
                        <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="text-brand-600 text-sm font-semibold hover:underline">Explore all categories</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[600px]">
                        {/* Huge block */}
                        <Link to="/?category=mens-watches" className="relative bg-[#1A1A1A] group overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" alt="Modern Minimal" className="absolute inset-0 w-full h-full object-cover object-center opacity-60 group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent"></div>
                            <div className="absolute bottom-10 left-8">
                                <h3 className="text-3xl font-display font-bold text-white mb-2">Modern Minimalist</h3>
                                <p className="text-gray-300 text-sm">Elevated basics for every day</p>
                            </div>
                        </Link>
                        
                        {/* Two stacked blocks */}
                        <div className="grid grid-rows-2 gap-4">
                            <Link to="/?category=womens-bags" className="relative bg-[#EAE8E4] group overflow-hidden flex items-center justify-center p-8">
                                <img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=600&q=80" alt="Accessories" className="w-[60%] object-contain mix-blend-multiply group-hover:-translate-y-2 transition-transform duration-500" />
                                <div className="absolute bottom-8 left-8">
                                    <h3 className="text-xl font-display font-bold text-gray-900 mb-1">Accessories</h3>
                                    <p className="text-gray-500 text-xs">Finishing touches</p>
                                </div>
                            </Link>

                            <Link to="/?category=mens-shoes" className="relative bg-[#0F0F0F] group overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" alt="Footwear" className="absolute inset-0 w-full h-full object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent"></div>
                                <div className="absolute bottom-8 left-8">
                                    <h3 className="text-xl font-display font-bold text-white mb-1">Footwear</h3>
                                    <p className="text-gray-300 text-xs">Form meets function</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content (Products Grid) */}
            <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-16">
                
                {/* Header & Categories */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                        <div>
                            {searchQuery ? (
                                <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
                                    Search Results for &quot;{searchQuery}&quot;
                                </h2>
                            ) : (
                                <h2 className="text-4xl font-display font-bold text-gray-900 mb-2">
                                    {selectedCategory !== 'All' ? selectedCategory : 'New Arrivals'}
                                </h2>
                            )}
                            <p className="text-gray-500 font-medium text-sm">
                                Showing {products.length} of {totalProducts} items
                            </p>
                        </div>
                        
                        {!loading && categories.length > 1 && (
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto hide-scrollbar">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => handleCategoryClick(category)}
                                        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                                            selectedCategory === category 
                                                ? 'bg-gray-900 text-white shadow-sm' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/5] bg-gray-100 rounded-xl mb-4" />
                                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-100 rounded w-1/4 mb-1" />
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <motion.div 
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
                        >
                            <AnimatePresence>
                                {products.map((product) => (
                                    <motion.div 
                                        key={product._id} 
                                        variants={item}
                                        layout
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Load More Button */}
                        {page < totalPages && (
                            <div className="mt-16 flex justify-center">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="px-8 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl text-sm font-semibold hover:border-gray-900 transition-all duration-300 disabled:opacity-50"
                                >
                                    {loadingMore ? 'Loading...' : 'Load More Products'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    // Empty State
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-32 flex flex-col items-center justify-center text-center bg-gray-50 rounded-xl border border-dashed border-gray-200"
                    >
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <SearchX className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-display font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8">
                            We couldn&apos;t find anything matching &quot;{searchQuery}&quot; in {selectedCategory}.
                        </p>
                        <button
                            onClick={() => {
                                const newParams = new URLSearchParams();
                                setSearchParams(newParams);
                            }}
                            className="bg-brand-600 text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-brand-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                )}
            </main>

            {/* Conscious Design Section */}
            {!searchQuery && selectedCategory === 'All' && (
                <div className="bg-gray-50 py-24 mb-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center gap-16">
                            <div className="w-full md:w-1/2">
                                <div className="aspect-square bg-[#0c1827] rounded-xl overflow-hidden relative shadow-lg">
                                    <img src="https://images.unsplash.com/photo-1507676184212-d03305a527e4?auto=format&fit=crop&w=800&q=80" alt="Conscious Design" className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40 hover:opacity-70 transition-opacity duration-700 cursor-pointer" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-t from-black/80 to-transparent">
                                        <div className="w-32 h-32 mb-6 opacity-80">
                                            {/* Abstract triangle placeholder */}
                                            <svg viewBox="0 0 100 100" className="w-full h-full text-brand-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polygon points="50,10 90,90 10,90" />
                                                <circle cx="50" cy="55" r="15" />
                                            </svg>
                                        </div>
                                        <h2 className="text-3xl font-display font-bold text-white mb-2 leading-tight">SUSTAINABLE</h2>
                                        <p className="text-brand-300 font-medium">Safe for the planet</p>
                                    </div>
                                    <div className="absolute -bottom-4 right-8 w-48 h-32 bg-brand-600 rounded-xl shadow-2xl flex flex-col items-start justify-center p-6 text-white transform -translate-y-12 translate-x-12">
                                        <span className="text-3xl font-display font-bold leading-none mb-1">100%</span>
                                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Traceable supply chain and recycled materials in every collection.</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-full md:w-1/2">
                                <p className="text-[10px] font-bold tracking-[0.2em] text-brand-600 mb-4 uppercase">Our Mission</p>
                                <h2 className="text-4xl font-display font-bold text-gray-900 mb-6 leading-tight">Conscious Design for a Better Future.</h2>
                                <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                                    We believe that quality clothing shouldn&apos;t come at the cost of the planet. Every piece in our collection is crafted with durability and circularity in mind. We&apos;re not just selling products; we&apos;re advocating for a slower, more intentional way of living.
                                </p>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center mt-1">
                                            <CheckCircle2 className="w-5 h-5 text-brand-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-base font-bold text-gray-900">Ethical Sourcing</h4>
                                            <p className="text-sm text-gray-500 mt-1">Direct partnerships with farmers who prioritize regenerative practices.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center mt-1">
                                            <CheckCircle2 className="w-5 h-5 text-brand-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-base font-bold text-gray-900">Circular Lifecycle</h4>
                                            <p className="text-sm text-gray-500 mt-1">Free repairs and a dedicated resale platform for our archive pieces.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
