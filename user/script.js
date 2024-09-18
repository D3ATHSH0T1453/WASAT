document.addEventListener("DOMContentLoaded", () => {
    loadAndDisplayProducts();
    updateCartCount();
});

function loadAndDisplayProducts() {
    let products = JSON.parse(localStorage.getItem('products'));

    if (!products) {
        fetch('../json/products.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('products', JSON.stringify(data));
                displayProducts(data);
            })
            .catch(error => console.error('Error loading products:', error));
    } else {
        displayProducts(products);
    }
}

function displayProducts(products) {
    const productsContainer = document.getElementById("midden");

    productsContainer.innerHTML = '';

    const displayedProducts = products
        .map((product, originalIndex) => ({ ...product, originalIndex }))
        .filter(product => product.quantity > 0)
        .slice(0, 6);

    displayedProducts.forEach((product) => {
        const productElement = document.createElement("a");
        productElement.href = '#';
        productElement.className = "col-4 border-container";
        productElement.dataset.index = product.originalIndex;

        productElement.innerHTML = `
            <div class="borderfotoss p-3">
                <img src="${product.urlLink}" alt="${product.product}" style="width: 50%; height: auto;">
                <div class="info-text">${product.product}</div>
            </div>
        `;

        productsContainer.appendChild(productElement);
    });

    document.querySelectorAll("#midden .border-container").forEach(item => {
        const infoText = item.querySelector(".info-text");

        item.addEventListener("mouseenter", () => {
            infoText.style.display = "block";
        });

        item.addEventListener("mouseleave", () => {
            infoText.style.display = "none";
        });

        item.addEventListener("click", () => {
            const index = item.dataset.index;
            localStorage.setItem("selectedProductIndex", index);
            window.location.href = "user/productinfo.html";
        });
    });
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');

    if (cartCount > 0) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = 'block';
    } else {
        cartCountElement.style.display = 'none';
    }
}