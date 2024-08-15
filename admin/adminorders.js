document.addEventListener('DOMContentLoaded', () => {
    displayOrders();

    document.getElementById('clear-orders').addEventListener('click', () => {
        if (confirm('Weet je zeker dat je alle orders wilt wissen?')) {
            localStorage.removeItem('orders');
            displayOrders();
        }
    });
});

function displayOrders() {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    orders.forEach(order => {
        const row = document.createElement('tr');

        const itemsHtml = order.items.map(item => {
            const price = parseFloat(item.price);
            return isNaN(price) ? '' : `${item.product} (${item.quantity}x) - €${price.toFixed(2)}<br>`;
        }).join('');

        const formattedDate = new Date(order.date).toLocaleString();

        row.innerHTML = `
            <td>${order.id}</td>
            <td>€${parseFloat(order.total).toFixed(2)}</td>
            <td>${formattedDate}</td>
            <td>${itemsHtml}</td>
        `;
        orderList.appendChild(row);
    });
}