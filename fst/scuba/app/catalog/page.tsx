import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { addProduct, deleteProduct } from '@/app/actions/product-actions';

// Force dynamic rendering to always fetch fresh catalog data
export const dynamic = 'force-dynamic';

interface SerializedProduct {
  _id: string;
  title: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  createdAt: string;
}

async function getProducts(): Promise<{ products: SerializedProduct[]; error?: string }> {
  try {
    await connectDB();
    const rawProducts = await Product.find({}).sort({ createdAt: -1 }).lean();
    const products: SerializedProduct[] = rawProducts.map((p) => ({
      _id: (p._id as any).toString(),
      title: p.title,
      price: p.price,
      category: p.category,
      stock: p.stock,
      sku: p.sku,
      createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
    }));
    return { products };
  } catch (err: any) {
    console.error('Database connection or query error:', err);
    return {
      products: [],
      error: err?.message || 'Could not connect to MongoDB. Please ensure MongoDB is running and MONGODB_URI is set.',
    };
  }
}

export default async function CatalogPage() {
  const { products, error } = await getProducts();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
        <p className="text-gray-600 mt-1">
          Minimal Next.js + Mongoose catalog with server actions and global connection caching.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          <strong>Database Notice:</strong> {error}
        </div>
      )}

      {/* Add Product Form */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Product</h2>
        <form action={addProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="title" className="block text-xs font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. Scuba Mask Pro"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="sku" className="block text-xs font-medium text-gray-700 mb-1">
              SKU *
            </label>
            <input
              id="sku"
              name="sku"
              type="text"
              required
              placeholder="e.g. MSK-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-xs font-medium text-gray-700 mb-1">
              Category *
            </label>
            <input
              id="category"
              name="category"
              type="text"
              required
              placeholder="e.g. Masks"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-xs font-medium text-gray-700 mb-1">
              Price ($) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="e.g. 49.99"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-xs font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              required
              placeholder="e.g. 15"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-5 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-md text-sm transition-colors cursor-pointer"
            >
              Add Product
            </button>
          </div>
        </form>
      </section>

      {/* Product List */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Catalog Items</h2>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {products.length} {products.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-base font-medium">No products found</p>
            <p className="text-sm text-gray-400 mt-1">Use the form above to add your first product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">SKU</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => {
                  const isInStock = product.stock > 0;
                  const isLowStock = product.stock > 0 && product.stock <= 5;

                  return (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{product.title}</td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{product.sku}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">{product.stock}</td>
                      <td className="px-6 py-4">
                        {isInStock ? (
                          isLowStock ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                              Low Stock ({product.stock})
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                              In Stock
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <form action={deleteProduct.bind(null, product._id)}>
                          <button
                            type="submit"
                            className="text-rose-600 hover:text-rose-800 font-medium text-xs hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
