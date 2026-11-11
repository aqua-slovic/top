import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { CATEGORIES, PRODUCTS, filterProducts } from '../data/products.js';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const search = params.get('search') || '';
  const [sort, setSort] = useState('default');

  const products = useMemo(() => {
    let list = filterProducts({ category, search });
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [category, search, sort]);

  const activeCat = CATEGORIES.find((c) => c.id === category);

  const setCategory = (id) => {
    const newParams = new URLSearchParams(params);
    if (id) {
      newParams.set('category', id);
    } else {
      newParams.delete('category');
    }
    setParams(newParams);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <span>{activeCat ? activeCat.name : search ? `"${search}"` : 'All products'}</span>
        </nav>

        <div className="shop-layout">
          {/* Sidebar filters */}
          <aside className="shop-sidebar">
            <div className="panel">
              <h3 className="sidebar-title">Categories</h3>
              <ul className="filter-list">
                <li>
                  <button
                    className={`filter-btn ${!category ? 'active' : ''}`}
                    onClick={() => setCategory('')}
                  >
                    All Products
                    <span className="filter-count">{PRODUCTS.length}</span>
                  </button>
                </li>
                {CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <button
                      className={`filter-btn ${category === c.id ? 'active' : ''}`}
                      onClick={() => setCategory(c.id)}
                    >
                      {c.icon} {c.name}
                      <span className="filter-count">
                        {PRODUCTS.filter(p => p.category_id === c.id).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <div className="shop-main">
            <div className="shop-toolbar">
              <h2 className="shop-title">
                {search ? `Results for "${search}"` : activeCat ? activeCat.name : 'All Products'}
                <span className="results-count"> ({products.length} {products.length === 1 ? 'item' : 'items'})</span>
              </h2>
              <select
                className="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="default">Sort by: Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {products.length === 0 && (
              <div className="empty-state">
                <h2>No products found</h2>
                <p className="muted">Try a different search term or browse our categories.</p>
                <Link to="/shop" className="btn btn-accent">View all products</Link>
              </div>
            )}

            <div className="grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
