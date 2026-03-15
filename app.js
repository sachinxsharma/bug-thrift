// --- Theme Toggling ---
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', newTheme);
    
    // Update icon
    const icon = themeToggleBtn.querySelector('i');
    if (newTheme === 'light') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});


// --- Product Data ---
const products = [
    {
        id: 1,
        title: "Neon Exoskeleton Glasses",
        description: "Enhance your multi-faceted vision with 360-degree ultraviolet targeting.",
        priceDrops: 50,
        icon: '<i class="fa-solid fa-glasses"></i>'
    },
    {
        id: 2,
        title: "Titanium Honeycomb Wings",
        description: "Lightweight, unbreakable thrust. Increases flight speed by 40%.",
        priceDrops: 120,
        icon: '<i class="fa-solid fa-feather-pointed"></i>'
    },
    {
        id: 3,
        title: "Synthetic Sweet Blood Vials",
        description: "Premium grade A+ synthetic nectar. Perfect for late-night hive energy.",
        priceDrops: 30,
        icon: '<i class="fa-solid fa-vial"></i>'
    },
    {
        id: 4,
        title: "Cybernetic Antennae",
        description: "Receive frequencies from the Queen up to 50 miles away.",
        priceDrops: 80,
        icon: '<i class="fa-solid fa-satellite-dish"></i>'
    },
    {
        id: 5,
        title: "Acid-Spitting Mandibles",
        description: "Defend the colony. Melts through organic matter in seconds.",
        priceDrops: 150,
        icon: '<i class="fa-solid fa-teeth"></i>'
    },
    {
        id: 6,
        title: "Pure Human Blood Reserve",
        description: "The rarest delicacy. Harvested carefully. High energy yield.",
        priceDrops: 500,
        icon: '<i class="fa-solid fa-droplet" style="color:red"></i>'
    }
];

// --- Rendering Products ---
const productGrid = document.getElementById('product-grid');

function renderProducts() {
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                ${product.icon}
            </div>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-desc">${product.description}</p>
            <div class="product-footer">
                <div class="product-price">
                    <i class="fa-solid fa-droplet"></i> ${product.priceDrops}
                </div>
                <button class="add-btn" onclick="addToCart(${product.id})">ADD TO TRIBUTE</button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}


// --- Cart Logic ---
let cart = [];
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.getElementById('cart-icon');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');

function updateCartUI() {
    // Update badge count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
    
    // Animate badge
    cartCount.style.transform = 'scale(1.5)';
    setTimeout(() => cartCount.style.transform = 'scale(1)', 200);

    // Render Modal contents
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color: var(--text-secondary); margin: 2rem 0;">Your tribute is empty.</p>';
    } else {
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-title">${item.title}</span>
                    <span class="cart-item-price"><i class="fa-solid fa-droplet"></i> ${item.priceDrops} drops/ea</span>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})" aria-label="Remove item">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }

    // Update total cost
    const totalCost = cart.reduce((sum, item) => sum + (item.priceDrops * item.quantity), 0);
    cartTotalEl.innerText = totalCost;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Modal open/close
cartIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
});

closeCartBtn.addEventListener('click', () => {
    cartModal.classList.remove('active');
    // Reset success message when closing
    document.getElementById('payment-success').classList.add('hidden');
    document.querySelector('.cart-items').classList.remove('hidden');
    document.querySelector('.cart-summary').classList.remove('hidden');
});

// Close modal on click outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
    }
});


// --- Checkout Mechanism ---
const checkoutBtn = document.getElementById('checkout-btn');
const paymentSuccessDiv = document.getElementById('payment-success');
const continueShoppingBtn = document.getElementById('continue-shopping');

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your tribute is empty! The swarm requires blood.");
        return;
    }
    
    // Simulate payment mechanism UI change
    checkoutBtn.innerText = "EXTRACTING BLOOD...";
    checkoutBtn.style.opacity = '0.7';
    checkoutBtn.style.pointerEvents = 'none';

    // Fake API / Blood extraction delay
    setTimeout(() => {
        // Clear cart
        cart = [];
        updateCartUI();
        
        // Hide summary and items, show success message
        document.querySelector('.cart-items').classList.add('hidden');
        document.querySelector('.cart-summary').classList.add('hidden');
        paymentSuccessDiv.classList.remove('hidden');
        
        // Reset button for next time
        checkoutBtn.innerText = "EXTRACT BLOOD & PLACE ORDER";
        checkoutBtn.style.opacity = '1';
        checkoutBtn.style.pointerEvents = 'all';
    }, 2000);
});

continueShoppingBtn.addEventListener('click', () => {
    cartModal.classList.remove('active');
    setTimeout(() => {
        paymentSuccessDiv.classList.add('hidden');
        document.querySelector('.cart-items').classList.remove('hidden');
        document.querySelector('.cart-summary').classList.remove('hidden');
    }, 300); // Wait for transition
});


// Initialize the application
renderProducts();
 updateCartUI();
