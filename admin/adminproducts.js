document.addEventListener("DOMContentLoaded", () => {
    const productListElement = document.getElementById("product-list");
    const productForm = document.getElementById("product-form");
    const productIndexInput = document.getElementById("product-index");

    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        productListElement.innerHTML = '';

        products.forEach((product, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    <input type="text" class="form-control" value="${product.product}" data-index="${index}" data
                    -field="product">
                </td>
                <td>
                    <input type="number" class="form-control" value="${product.price.replace('€ ', '')}" data-index
                    "${index}" data-field="price">
                </td>
                <td class="description-cell">
                    <input type="text" class="form-control" value="${product.description || ''}" data-index="${index}
                    " data-field="description">
                </td>
                <td>
                    <input type="text" class="form-control" value="${product.urlLink || ''}" data-index="${index}
                    " data-field="urlLink">
                </td>
                <td>
                    <input type="number" class="form-control" value="${product.quantity}" data-index="${index}
                    " data-field="quantity">
                </td>
                <td>
                    <button class="btn btn-primary btn-sm view-product-btn" data-index="${index}">View</button>
                    <button class="btn btn-primary btn-sm edit-btn" data-index="${index}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            productListElement.appendChild(row);
        });

        addEventListeners();
    }

    function addEventListeners() {
        document.querySelectorAll(".view-product-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                localStorage.setItem('selectedProductIndex', index);
                window.location.href = '../user/productinfo.html';
            });
        });

        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                const row = this.closest("tr");
                const inputs = row.querySelectorAll("input");

                document.getElementById("product-name").value = inputs[0].value;
                document.getElementById("product-price").value = inputs[1].value;
                document.getElementById("product-description").value = inputs[2].value;
                document.getElementById("product-picture").value = inputs[3].value;
                document.getElementById("product-quantity").value = inputs[4].value;
                productIndexInput.value = index;
            });
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                let products = JSON.parse(localStorage.getItem('products')) || [];
                products.splice(index, 1);
                localStorage.setItem('products', JSON.stringify(products));
                loadProducts();
                window.dispatchEvent(new Event('storage'));
            });
        });
    }

    productForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let products = JSON.parse(localStorage.getItem('products')) || [];
        const index = productIndexInput.value;

        if (index !== '') {
            products[index] = {
                product: document.getElementById("product-name").value,
                price: `€ ${document.getElementById("product-price").value}`,
                description: document.getElementById("product-description").value,
                urlLink: document.getElementById("product-picture").value,
                quantity: document.getElementById("product-quantity").value,
            };
        } else {
            products.push({
                product: document.getElementById("product-name").value,
                price: `€ ${document.getElementById("product-price").value}`,
                description: document.getElementById("product-description").value,
                urlLink: document.getElementById("product-picture").value,
                quantity: document.getElementById("product-quantity").value,
            });
        }

        localStorage.setItem('products', JSON.stringify(products));
        productForm.reset();
        productIndexInput.value = '';
        loadProducts();
        window.dispatchEvent(new Event('storage'));
    });

    window.resetProducts = function () {
        fetch('../json/products.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('products', JSON.stringify(data));
                loadProducts();
                window.dispatchEvent(new Event('storage'));
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    };

    loadProducts();
});