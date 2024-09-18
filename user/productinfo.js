document.addEventListener("DOMContentLoaded", () => {
    const productIndex = localStorage.getItem('selectedProductIndex');
    const productDetails = document.getElementById('product-details');

    if (productIndex !== null) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products[parseInt(productIndex)];

        if (product) {
            productDetails.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <img src="../${product.urlLink}" class="img-fluid" alt="${product.product}">
                    </div>
                    <div class="col-md-6 img-fluid-twee">
                        <h2>${product.product}</h2>
                        <p>Price: ${product.price}</p>
                        <p>${product.description}</p>
                        <div class="d-flex align-items-center">
                            <button id="decrease-quantity" class="btn btn-secondary">-</button>
                            <input id="quantity" type="text" class="form-control mx-2" value="1" readonly>
                            <button id="increase-quantity" class="btn btn-secondary">+</button>
                        </div>
                        <button id="add-to-cart" class="btn btn-primary mt-2 mx-4">Add to Cart</button>
                    </div>
                </div>
            `;

            const quantityInput = document.getElementById('quantity');
            const decreaseButton = document.getElementById('decrease-quantity');
            const increaseButton = document.getElementById('increase-quantity');

            let quantity = 1;

            decreaseButton.addEventListener('click', () => {
                if (quantity > 1) {
                    quantity--;
                    quantityInput.value = quantity;
                }
            });

            increaseButton.addEventListener('click', () => {
                if (quantity < product.quantity) {
                    quantity++;
                    quantityInput.value = quantity;
                }
            });

            document.getElementById('add-to-cart').addEventListener('click', () => {
                addToCart(product, quantity);
            });
        } else {
            productDetails.innerHTML = `<p>Sorry, this product could not be found.</p>`;
        }
    } else {
        productDetails.innerHTML = `<p>No product selected. Please go back and select a product.</p>`;
    }

    updateCartCount();
});

function addToCart(product, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.product === product.product);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
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