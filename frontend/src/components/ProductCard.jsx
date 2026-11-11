import { Link } from 'react-router-dom';
import { formatMWK } from '../utils/currency.js';
import { getCategory } from '../data/products.js';

export default function ProductCard({ product }) {
  const category = getCategory(product.category_id);
  return (
    <Link to={`/product/${product.id}`} className="card product-card">
      <div className="product-image">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" />
        ) : (
          <span className="placeholder">&#128717;</span>
        )}
      </div>
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        {category?.name && <div className="product-category">{category.name}</div>}
        <div className="price">{formatMWK(product.price)}</div>
        <span className={`stock-label ${Number(product.stock) > 0 ? '' : 'out'}`}>
          {Number(product.stock) > 0 ? 'In stock' : 'Out of stock'}
        </span>
      </div>
    </Link>
  );
}
