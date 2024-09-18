document.addEventListener("DOMContentLoaded", () => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    console.log('Products loaded from localStorage:', products);

    const productsContainer = document.getElementById("midden");
    if (!productsContainer) {
        console.error('Element with id "midden" not found.');
        return;
    }

    productsContainer.innerHTML = '';

    const displayedProducts = products
        .map((product, originalIndex) => ({ ...product, originalIndex }))
        .filter(product => product.quantity > 0)
        .slice(0, 6);

    console.log('Displayed Products:', displayedProducts);

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

    updateCartCount();
});