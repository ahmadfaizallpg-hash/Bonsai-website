// ================= NAVBAR TOGGLE =================
const navbarNav = document.querySelector('.navbar-nav');
document.querySelector('#special-menu').onclick = (e) => {
    navbarNav.classList.toggle('active');
    e.preventDefault();
};

// ================= SEARCH =================
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');

document.querySelector('#search-button').onclick = (e) => {
    searchForm.classList.toggle('active');
    searchBox.focus();
    e.preventDefault();
};

// ================= CART TOGGLE =================
const shoppingCart = document.querySelector('.shopping-cart');
document.querySelector('#shopping-cart-button').onclick = (e) => {
    shoppingCart.classList.toggle('active');
    e.preventDefault();
};

// ================= CLICK OUTSIDE =================
const hm = document.querySelector('#special-menu');
const sb = document.querySelector('#search-button');
const sc = document.querySelector('#shopping-cart-button');

document.addEventListener('click', function (e) {
    if (!hm.contains(e.target) && !navbarNav.contains(e.target)) {
        navbarNav.classList.remove('active');
    }
    if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
        searchForm.classList.remove('active');
    }
    if (!sc.contains(e.target) && !shoppingCart.contains(e.target)) {
        shoppingCart.classList.remove('active');
    }
});

// ================= MODAL =================
const itemDetailModal = document.querySelector('#item-detail-modal');
const itemDetailButtons = document.querySelectorAll('.item-detail-button');

itemDetailButtons.forEach((btn) => {
    btn.onclick = (e) => {
        itemDetailModal.style.display = 'flex';
        e.preventDefault();
    };
});

document.querySelector('.modal .close-icon').onclick = (e) => {
    itemDetailModal.style.display = 'none';
    e.preventDefault();
};

window.onclick = (e) => {
    if (e.target === itemDetailModal) {
        itemDetailModal.style.display = 'none';
    }
};

// ================= CART =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// tambah ke keranjang (SATU-SATUNYA CARA)
function tambahKeKeranjang(nama, harga) {
    const item = cart.find(i => i.nama === nama);

    if (item) {
        item.qty++;
    } else {
        cart.push({ nama, harga, qty: 1 });
        showToast("✅ " + nama + " ditambahkan");
    }

    renderCart();

    const cartIcon = document.querySelector('#shopping-cart-button');
    cartIcon.classList.add('bounce');

    setTimeout(() => {
    cartIcon.classList.remove('bounce');
    }, 300);
}

// render cart
function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');

    if (!container || !totalEl || !countEl) return;

    container.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p style='text-align:center'>Keranjang kosong 🛒</p>";
    }

    cart.forEach((item, index) => {
        total += item.harga * item.qty;

        container.innerHTML += `
<li onclick="event.stopPropagation()">
    <strong>${item.nama}</strong><br>
    IDR ${formatRupiah(item.harga)} x ${item.qty}<br>
    <button onclick="changeQty(${index}, 1)">+</button>
    <button onclick="changeQty(${index}, -1)">-</button>
    <button onclick="removeItem(${index})">Hapus</button>
</li>
`;
    });

    totalEl.innerText = formatRupiah(total);

    const totalQty = cart.reduce((t, item) => t + item.qty, 0);

    if (totalQty > 0) {
        countEl.style.display = 'block';
        countEl.innerText = totalQty;
    } else {
        countEl.style.display = 'none';
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

// tambah / kurang qty
function changeQty(index, change) {
    cart[index].qty += change;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    renderCart();
}

// hapus item
function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

// checkout WA
function checkoutWA() {
    if (cart.length === 0) {
        alert("Keranjang kosong!");
        return;
    }

    let pesan = "Halo, saya ingin pesan:\n\n";

    cart.forEach(item => {
        pesan += `${item.nama} x${item.qty} = IDR ${formatRupiah(item.harga * item.qty)}\n`;
    });

    let total = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    pesan += `\nTotal: IDR ${formatRupiah(total)}`;

    let url = "https://wa.me/6283809735748?text=" + encodeURIComponent(pesan);
    window.open(url, "_blank");
}

// format rupiah
function formatRupiah(angka) {
    return angka.toLocaleString('id-ID');
}

// ================= PRODUK =================
let defaultProducts = [
    { nama: "Bonsai Beans 1", harga: 30000, gambar: "85315fb2aeee1e66f1423efe800d92bf.jpg" },
    { nama: "Bonsai Anting Putri", harga: 50000, gambar: "Bonsai-Anting-Putri.jpg" },
    { nama: "Bonsai Beringin", harga: 45000, gambar: "cara-bonsai-beringin-putih.jpg" }
];

let products = JSON.parse(localStorage.getItem("products")) || defaultProducts;
localStorage.setItem("products", JSON.stringify(products));

function renderProduk() {
    const container = document.querySelector(".products .row");
    const role = localStorage.getItem("role");

    if (!container) return;

    container.innerHTML = "";

    products.forEach((p, index) => {
        container.innerHTML += `
        <div class="product-card">
            
            <div class="product-image">
                <img src="${p.gambar}">
            </div>

            <div class="product-content">
                <h3>${p.nama}</h3>
                <div class="product-price">IDR ${p.harga}</div>

                <button class="btn-cart" onclick="event.stopPropagation(); tambahKeKeranjang('${p.nama}', ${p.harga})">
    Tambah ke Keranjang
</button>

                ${
                    role === "admin"
                    ? `<button class="btn-delete" onclick="hapusProdukIndex(${index})">Hapus</button>`
                    : ""
                }
            </div>
        </div>
        `;
    });

    feather.replace();
}

function tambahProduk() {
    const nama = document.getElementById("nama-produk").value;
    const harga = document.getElementById("harga-produk").value;
    const gambar = document.getElementById("gambar-produk").value;

    if (!nama || !harga || !gambar) {
        alert("Isi semua field!");
        return;
    }

    products.push({ nama, harga: parseInt(harga), gambar });
    localStorage.setItem("products", JSON.stringify(products));

    renderProduk();
    alert("Produk berhasil ditambahkan!");
}

function hapusProdukIndex(index) {
    if (confirm("Yakin hapus produk?")) {
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        renderProduk();
    }
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", function () {
    const role = localStorage.getItem("role");

    // admin control
    document.querySelectorAll(".admin-only").forEach(el => {
        el.style.display = (role === "admin") ? "block" : "none";
    });

    // login button
    const loginBtn = document.getElementById("login-button");
    if (loginBtn) {
        if (role) {
            loginBtn.innerText = "Logout (" + role + ")";
            loginBtn.onclick = function () {
                localStorage.removeItem("role");
                alert("Logout berhasil");
                window.location.href = "login.html";
            };
        } else {
            loginBtn.innerText = "Login";
            loginBtn.href = "login.html";
        }
    }

    renderProduk();
    renderCart();
});


