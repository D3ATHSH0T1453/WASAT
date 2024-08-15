document.addEventListener("DOMContentLoaded", () => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const displayedProducts = products.slice(0, 6);
    const productsContainer = document.getElementById("midden");

    productsContainer.innerHTML = '';

    displayedProducts.forEach((product, index) => {
        const productElement = document.createElement("a");
        productElement.href = '#';
        productElement.className = "col-4 border-container";
        productElement.dataset.index = index;

        productElement.innerHTML = `
            <div id="borderfotos" class="p-3">
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
            window.location.href = "productinfo.html";
        });
    });
});