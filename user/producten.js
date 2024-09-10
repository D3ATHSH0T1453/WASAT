document.addEventListener("DOMContentLoaded", () => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    console.log("Producten geladen:", products);

    const productsContainer = document.getElementById("midden");
    productsContainer.innerHTML = '';

    products.forEach((product, index) => {
        const productElement = document.createElement("a");
        productElement.href = '#';
        productElement.className = "col-4 border-container";
        productElement.setAttribute("data-index", index);

        productElement.innerHTML = `
            <div id="borderfotos" class="p-3">
                <img src="../${product.urlLink}" alt="${product.product}" style="width: 50%; height: auto;">
                <div class="info-text">${product.product}</div>
            </div>
        `;

        productsContainer.appendChild(productElement);
    });

    const items = document.querySelectorAll(".border-container");
    items.forEach(item => {
        const infoText = item.querySelector(".info-text");

        item.addEventListener("mouseenter", () => {
            infoText.style.display = "block";
        });

        item.addEventListener("mouseleave", () => {
            infoText.style.display = "none";
        });

        item.addEventListener("click", () => {
            const index = item.getAttribute("data-index");
            localStorage.setItem("selectedProductIndex", index);
            window.location.href = "productinfo.html";
        });
    });
});