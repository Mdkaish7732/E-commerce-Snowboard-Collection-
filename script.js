const API_URL = 'https://interveiw-mock-api.vercel.app/api/getProducts';

const loadBtn = document.getElementById('loadBtn');
const productContainer = document.getElementById('productContainer');
const sortSelect = document.getElementById('sortSelect');
const errorMsg = document.getElementById('errorMsg');

let products = [];

loadBtn.addEventListener('click', async () => {
  errorMsg.textContent = '';
  productContainer.innerHTML = '<p>Loading products...</p>';

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`API returned status ${res.status}`);

    const json = await res.json();
    const items = json.data;

    if (!items || items.length === 0) throw new Error('No products found.');

    // Extract required fields from the nested product structure
    products = items.map(item => {
      const product = item.product;
      const variant = product.variants?.[0] || {};

      return {
        name: product.title || 'No name',
        variantTitle: variant.title || '',
        price: variant.price || '0.00',
        currency: variant.price_currency || 'INR',
       // description: product.product_type || 'No description',
        image: product.image?.src || 'https://source.unsplash.com/300x200/?snowboard' // placeholder
      };
    });

    // Product display
    displayProducts(products);
  } catch (err) {
    productContainer.innerHTML = '';
    errorMsg.textContent = `Error loading products: ${err.message}`;
    console.error('Fetch Error:', err);
  }
});

sortSelect.addEventListener('change', () => {
  if (!products.length) return;

  const type = sortSelect.value;
  const sorted = [...products].sort((a, b) => {
    const aPrice = parseFloat(a.price);
    const bPrice = parseFloat(b.price);
    if (type === 'asc') return aPrice - bPrice;
    if (type === 'desc') return bPrice - aPrice;
    return 0;
  });

  displayProducts(sorted);
});

function displayProducts(list) {
  productContainer.innerHTML = '';

  list.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="product-name">${p.name}</div>
      ${p.variantTitle ? `<div class="product-variant">${p.variantTitle}</div>` : ''}
      <div class="product-price">₹${p.price}</div>
    <!-- <div class="product-description">${p.description}</div> -->
      <button class="add-to-cart-btn">Add to Cart</button>
    `;

    productContainer.appendChild(card);
    setTimeout(() => card.classList.add('show'), i * 100); // animation delay

    card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
    alert(`${p.name} added to cart!`);
});

  });
}
