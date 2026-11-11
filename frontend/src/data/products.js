// Static product catalog (no backend). Prices in Malawi Kwacha (MWK).
export const CATEGORIES = [
  { id: '1', name: 'Electronics', icon: '⚡', color: '#1565c0' },
  { id: '2', name: 'Home & Kitchen', icon: '🏠', color: '#2e7d32' },
  { id: '3', name: 'Clothing', icon: '👕', color: '#6a1b9a' },
  { id: '4', name: 'Groceries', icon: '🛒', color: '#e65100' },
  { id: '5', name: 'Beauty & Care', icon: '✨', color: '#ad1457' },
];

export const PRODUCTS = [
  {
    id: '1',
    name: 'Wireless Bluetooth Earbuds',
    description: 'Crystal-clear sound with deep bass and a comfortable in-ear fit. 20-hour battery life with charging case. Bluetooth 5.0 for seamless connectivity with any device.',
    price: 28500,
    category_id: '1',
    stock: 12,
    image_url: '/img/products/p1.svg',
    badge: 'Popular',
  },
  {
    id: '2',
    name: 'Smartphone Charger (Fast Charge)',
    description: '25W fast charging adapter with USB-C cable. Compatible with most Android devices. Charges your phone from 0 to 50% in just 30 minutes.',
    price: 12000,
    category_id: '1',
    stock: 25,
    image_url: '/img/products/p2.svg',
  },
  {
    id: '3',
    name: 'LED Desk Lamp',
    description: 'Adjustable brightness with 3 colour modes. USB powered, energy efficient and eye-friendly. Perfect for studying, reading, and working from home.',
    price: 18500,
    category_id: '2',
    stock: 8,
    image_url: '/img/products/p3.svg',
  },
  {
    id: '4',
    name: 'Non-Stick Frying Pan 28cm',
    description: 'Durable non-stick coating, suitable for all cooktops including induction. Easy to clean. Professional-grade aluminium body with heat-resistant handle.',
    price: 22000,
    category_id: '2',
    stock: 15,
    image_url: '/img/products/p4.svg',
  },
  {
    id: '5',
    name: 'Stainless Steel Water Bottle 1L',
    description: 'Keeps drinks cold for 24 hours or hot for 12 hours. Leak-proof lid, BPA free. Double-wall vacuum insulation technology.',
    price: 9500,
    category_id: '2',
    stock: 30,
    image_url: '/img/products/p5.svg',
    badge: 'Best Value',
  },
  {
    id: '6',
    name: "Men's Cotton T-Shirt",
    description: '100% cotton, breathable and comfortable for everyday wear. Available in multiple sizes. Pre-shrunk fabric with reinforced seams for lasting quality.',
    price: 7500,
    category_id: '3',
    stock: 40,
    image_url: '/img/products/p6.svg',
  },
  {
    id: '7',
    name: "Women's Wrap Dress",
    description: 'Lightweight floral wrap dress, perfect for warm weather. Flattering fit for all body types. Made from soft, breathable polyester blend.',
    price: 32000,
    category_id: '3',
    stock: 14,
    image_url: '/img/products/p7.svg',
    badge: 'New',
  },
  {
    id: '8',
    name: 'Denim Jeans (Slim Fit)',
    description: 'Classic slim-fit denim jeans with stretch for comfort. Durable stitching. Five-pocket design with zip fly and button closure.',
    price: 26000,
    category_id: '3',
    stock: 18,
    image_url: '/img/products/p8.svg',
  },
  {
    id: '9',
    name: 'Maize Flour (25kg)',
    description: 'Premium white maize flour, finely milled. Ideal for nsima and baking. Sourced from quality Malawian maize, tested for purity.',
    price: 24000,
    category_id: '4',
    stock: 50,
    image_url: '/img/products/p9.svg',
    badge: 'Staple',
  },
  {
    id: '10',
    name: 'Cooking Oil 5L',
    description: 'Refined vegetable cooking oil. Light taste, suitable for frying and everyday cooking. Cholesterol-free with no artificial additives.',
    price: 19500,
    category_id: '4',
    stock: 35,
    image_url: '/img/products/p10.svg',
  },
  {
    id: '11',
    name: 'Rice 5kg (Long Grain)',
    description: 'Clean, long-grain rice. Cooks fluffy and separate. Great for everyday meals. Carefully sorted and polished for premium quality.',
    price: 16000,
    category_id: '4',
    stock: 40,
    image_url: '/img/products/p11.svg',
  },
  {
    id: '12',
    name: 'Bar Soap (Pack of 6)',
    description: 'Gentle cleansing bar soap for the whole family. Long-lasting and moisturising. Enriched with natural ingredients for soft, clean skin.',
    price: 5500,
    category_id: '5',
    stock: 60,
    image_url: '/img/products/p12.svg',
    badge: 'Value Pack',
  },
  {
    id: '13',
    name: 'Body Lotion 500ml',
    description: 'Nourishing body lotion with shea butter. Keeps skin soft and hydrated all day. Fast-absorbing formula, non-greasy finish.',
    price: 8500,
    category_id: '5',
    stock: 22,
    image_url: '/img/products/p13.svg',
  },
  {
    id: '14',
    name: 'Shampoo 400ml',
    description: 'Gentle daily shampoo for all hair types. Leaves hair clean, soft and shiny. pH balanced formula with keratin for stronger hair.',
    price: 6800,
    category_id: '5',
    stock: 28,
    image_url: '/img/products/p14.svg',
  },
  {
    id: '15',
    name: 'USB Flash Drive 32GB',
    description: 'Compact and fast USB 3.0 flash drive. Plug and play, no drivers needed. Read speeds up to 100MB/s with durable metal casing.',
    price: 14500,
    category_id: '1',
    stock: 20,
    image_url: '/img/products/p15.svg',
  },
  {
    id: '16',
    name: 'Electric Kettle 1.7L',
    description: 'Fast-boiling stainless steel kettle with auto shut-off and boil-dry protection. 1500W element for rapid heating. Cordless design with 360° base.',
    price: 34000,
    category_id: '2',
    stock: 10,
    image_url: '/img/products/p16.svg',
    badge: 'Top Seller',
  },
];

const CATEGORY_IMAGE = {
  '1': '/img/electronics.svg',
  '2': '/img/home.svg',
  '3': '/img/clothing.svg',
  '4': '/img/groceries.svg',
  '5': '/img/beauty.svg',
};

PRODUCTS.forEach((p) => {
  if (!p.image_url) {
    p.image_url = CATEGORY_IMAGE[p.category_id] || '/img/electronics.svg';
  }
});

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === String(id)) || null;
}

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === String(id)) || null;
}

export function filterProducts({ category, search } = {}) {
  let list = PRODUCTS.filter((p) => p.stock >= 0);
  if (category) list = list.filter((p) => p.category_id === String(category));
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
    );
  }
  return list;
}
