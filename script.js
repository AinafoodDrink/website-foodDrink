let cart = JSON.parse(localStorage.getItem("cartData")) || [];
let cartVisible = false;

// Simpan ke localStorage
function saveCart() {
    localStorage.setItem("cartData", JSON.stringify(cart));
}

// Tambah produk
function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    saveCart();
    updateCart();
}

// Ubah jumlah produk (+/-)
function changeQty(index, amount) {
    if (!cart[index]) return; // 🟢 tambahan agar tidak error kalau index tidak ada
    cart[index].qty += amount;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCart();
}

// Update tampilan keranjang
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItems || !cartCount || !cartTotal) return; // 🟢 tambah pengecekan elemen agar tidak error

    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                Rp ${item.price.toLocaleString()} x ${item.qty} = <b>Rp ${subtotal.toLocaleString()}</b>
            </div>
            <div>
                <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
                <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                <button class="remove-btn" onclick="removeItem(${index})">x</button>
            </div>`;
        cartItems.appendChild(li);
        total += subtotal;
        count += item.qty;
    });

    cartCount.textContent = count;
    cartTotal.textContent = total.toLocaleString();
}

// Hapus produk
function removeItem(index) {
    if (!cart[index]) return; // 🟢 tambahan agar aman
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

// Tampilkan / sembunyikan keranjang
document.getElementById('cart-icon')?.addEventListener('click', () => {
    const cartBox = document.getElementById('cart');
    if (!cartBox) return; // 🟢 tambah pengecekan
    cartVisible = !cartVisible;
    cartBox.style.display = cartVisible ? 'block' : 'none';
});

document.getElementById('close-cart')?.addEventListener('click', () => {
    const cartBox = document.getElementById('cart');
    if (!cartBox) return;
    cartBox.style.display = 'none';
    cartVisible = false;
});

// Checkout
document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Keranjang masih kosong!');
        return;
    }
    const message = document.getElementById('checkout-message');
    if (message) message.style.display = 'flex';

    cart = [];
    saveCart();
    updateCart();

    const cartBox = document.getElementById('cart');
    if (cartBox) cartBox.style.display = 'none';
});

function closeMessage() {
    const message = document.getElementById('checkout-message');
    if (message) message.style.display = 'none';
}

// 🔍 Fungsi pencarian produk
function searchProduct() {
    const input = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const name = product.getAttribute('data-name')?.toLowerCase() || '';
        product.style.display = name.includes(input) ? 'block' : 'none';
    });
}

// Tampilkan isi keranjang saat halaman dibuka
window.addEventListener('load', updateCart);
