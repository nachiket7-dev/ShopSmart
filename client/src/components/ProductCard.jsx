import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
    return (
        <Link 
            to={`/product/${product._id}`} 
            className="group block"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 rounded-xl mb-4">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    loading="lazy"
                />
                
                {/* Overlay Badge (Optional) */}
                {product.category && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-brand-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            {(parseInt(product._id, 16) % 3 === 0) ? 'NEW' : product.category}
                        </span>
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                    <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                        {product.name}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1 capitalize">
                        {product.category || 'Essential'}
                    </p>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                    ${product.price.toFixed(2)}
                </div>
            </div>
        </Link>
    );
}
