document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let totalPrice = 0;

    function getProductQuantity(productName) {
        const product = products.find(p => p.product === productName);
        return product ? product.quantity : 0;
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        totalPrice = 0;
        cart.forEach(product => {
            const productPrice = parseFloat(product.price.replace('€', '').trim());
            if (isNaN(productPrice)) {
                console.error(`Invalid price for product ${product.product}`);
                return;
            }

            const productHTML = `
                <div class="cart-item row">
                    <div class="product-details col-md-8">
                        <img class="product-image" src="${product.urlLink}" alt="${product.product}">
                        <div>
                            <>${product.product}</h4>
                            <p>Prijs: €${productPrice.toFixed(2)}</p>
                            <div class="d-flex align-items-center">
                                <button class="btn btn-secondary decrease-quantity" data-name="${product.product}">-</button>
                                <input type="text" class="form-control quantity" value="${product.quantity}" readonly>
                                <button class="btn btn-secondary increase-quantity" data-name="${product.product}">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 d-flex justify-content-end">
                        <button class="btn btn-danger remove-btn" data-name="${product.product}">Verwijderen</button>
                    </div>
                </div>`;
            cartItemsContainer.insertAdjacentHTML('beforeend', productHTML);
            totalPrice += productPrice * product.quantity;
        });
        totalPriceElement.textContent = `Totaal: €${totalPrice.toFixed(2)}`;
        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productName = event.target.dataset.name;
                cart = cart.filter(item => item.product !== productName);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', (event) => {
                const productName = event.target.dataset.name;
                const input = event.target.previousElementSibling;
                const quantity = parseInt(input.value);
                const product = cart.find(item => item.product === productName);
                const maxQuantity = getProductQuantity(productName);

                if (product) {
                    if (quantity < maxQuantity) {
                        input.value = quantity + 1;
                        product.quantity++;
                        localStorage.setItem('cart', JSON.stringify(cart));
                        renderCart();
                    } else {
                        alert(`De maximale voorraad van de ${productName} is bereikt.`);
                    }
                }
            });
        });

        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', (event) => {
                const productName = event.target.dataset.name;
                const input = event.target.nextElementSibling;
                const quantity = parseInt(input.value);
                const product = cart.find(item => item.product === productName);

                if (product && quantity > 1) {
                    input.value = quantity - 1;
                    product.quantity--;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                }
            });
        });
    }

    function validateCartQuantities() {
        for (const item of cart) {
            const maxQuantity = getProductQuantity(item.product);
            if (item.quantity > maxQuantity) {
                return {
                    valid: false,
                    productName: item.product,
                    maxQuantity: maxQuantity
                };
            }
        }
        return { valid: true };
    }

    document.getElementById('checkout').addEventListener('click', () => {
        const validation = validateCartQuantities();
        if (!validation.valid) {
            alert(`De hoeveelheid van ${validation.productName} in je winkelwagen overschrijdt de beschikbare voorraad. Maximaal beschikbare hoeveelheid is ${validation.maxQuantity}.`);
            return;
        }

        if (cart.length === 0) {
            alert('Je winkelwagen is leeg.');
            return;
        }

        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderID = Math.floor(Math.random() * 90000) + 10000;
        const order = {
            id: `#${orderID}`,
            items: cart.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: parseFloat(item.price.replace('€', '').trim())
            })),
            total: totalPrice,
            date: new Date().toISOString()
        };
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        localStorage.removeItem('cart');
        cart = [];
        renderCart();

        alert(`Bestelling geplaatst! Je bestelling ID is ${order.id}`);
    });

    renderCart();
});
