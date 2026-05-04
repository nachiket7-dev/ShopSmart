import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { PackageSearch, Plus, Pencil, Trash2, Tag, Box, DollarSign, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminPage() {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', price: '', description: '', image: '', category: '', stock: '' });

    const apiUrl = import.meta.env.VITE_API_URL || '';

    const fetchProducts = useCallback(() => {
        fetch(`${apiUrl}/api/products`)
            .then((res) => res.json())
            .then((data) => { setProducts(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [apiUrl]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const resetForm = () => {
        setForm({ name: '', price: '', description: '', image: '', category: '', stock: '' });
        setEditing(null);
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editing ? `${apiUrl}/api/products/${editing}` : `${apiUrl}/api/products`;
        const method = editing ? 'PUT' : 'POST';
        const loadingToast = toast.loading(editing ? 'Updating product...' : 'Adding product...');

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) }),
            });
            if (!res.ok) throw new Error('Failed');
            
            toast.success(editing ? 'Product updated successfully!' : 'Product added successfully!', { id: loadingToast });
            resetForm();
            fetchProducts();
        } catch {
            toast.error('Operation failed. Please try again.', { id: loadingToast });
        }
    };

    const handleEdit = (product) => {
        setEditing(product._id);
        setForm({
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            category: product.category || '',
            stock: product.stock || 0,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;
        const loadingToast = toast.loading('Deleting product...');
        try {
            await fetch(`${apiUrl}/api/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Product deleted', { id: loadingToast });
            fetchProducts();
        } catch {
            toast.error('Failed to delete product', { id: loadingToast });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-600"></div>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
                        <PackageSearch className="w-8 h-8 text-brand-600" />
                        Inventory Management
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your store&apos;s products, pricing, and stock levels.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-brand-500/30 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 p-1 flex-shrink-0">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">{product.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                            {product.category || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900 whitespace-nowrap">
                                        ${product.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                product.stock > 10 ? 'bg-green-100 text-green-800' :
                                                product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.stock}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors inline-block"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id, product.name)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={resetForm}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="text-2xl font-display font-bold text-gray-900">
                                    {editing ? 'Edit Product' : 'Add New Product'}
                                </h3>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                    <Trash2 className="w-5 h-5 rotate-45" /> {/* Close icon using rotated trash for simplicity if no X icon imported */}
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Product Name</label>
                                        <div className="relative">
                                            <PackageSearch className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Sony MX1000" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Price ($)</label>
                                        <div className="relative">
                                            <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                            <input type="number" required step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="299.99" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Stock Quantity</label>
                                        <div className="relative">
                                            <Box className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                            <input type="number" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="50" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Category</label>
                                        <div className="relative">
                                            <Tag className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                            <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Audio" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Image URL</label>
                                        <div className="relative">
                                            <ImageIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                            <input type="url" required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="https://..." />
                                        </div>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Description</label>
                                        <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none resize-none" placeholder="Product details..." />
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3 justify-end">
                                    <button type="button" onClick={resetForm} className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all active:scale-[0.98]">
                                        {editing ? 'Save Changes' : 'Create Product'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
