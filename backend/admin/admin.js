// =====================================
// MAKENIMART ADMIN DASHBOARD
// =====================================

const API_BASE_URL = "http://localhost:5000/api";


// =====================================
// ADMIN LOGIN
// =====================================

async function adminLogin(username, password) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/admin/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })
            }
        );


        const data = await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message || "Login failed."
            );

        }


        localStorage.setItem(
            "makeniMartAdminLoggedIn",
            "true"
        );


        return data;

    } catch (error) {

        console.error(
            "ADMIN LOGIN ERROR:",
            error
        );

        throw error;

    }

}


// =====================================
// CHECK ADMIN LOGIN
// =====================================

function isAdminLoggedIn() {

    return (
        localStorage.getItem(
            "makeniMartAdminLoggedIn"
        ) === "true"
    );

}


// =====================================
// ADMIN LOGOUT
// =====================================

function adminLogout() {

    localStorage.removeItem(
        "makeniMartAdminLoggedIn"
    );

    window.location.href = "admin.html";

}


// =====================================
// LOAD PRODUCTS
// =====================================

async function loadProducts() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/products`
        );


        const data = await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Failed to load products."
            );

        }


        return data.products || [];

    } catch (error) {

        console.error(
            "LOAD PRODUCTS ERROR:",
            error
        );

        return [];

    }

}


// =====================================
// ADD PRODUCT
// =====================================

async function addProduct(productData) {

    const response = await fetch(
        `${API_BASE_URL}/products`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(productData)
        }
    );


    const data = await response.json();


    if (!response.ok || !data.success) {

        throw new Error(
            data.message ||
            "Failed to add product."
        );

    }


    return data;

}


// =====================================
// UPDATE PRODUCT
// =====================================

async function updateProduct(
    productId,
    productData
) {

    const response = await fetch(
        `${API_BASE_URL}/products/${productId}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(productData)
        }
    );


    const data = await response.json();


    if (!response.ok || !data.success) {

        throw new Error(
            data.message ||
            "Failed to update product."
        );

    }


    return data;

}


// =====================================
// DELETE PRODUCT
// =====================================

async function deleteProduct(productId) {

    const response = await fetch(
        `${API_BASE_URL}/products/${productId}`,
        {
            method: "DELETE"
        }
    );


    const data = await response.json();


    if (!response.ok || !data.success) {

        throw new Error(
            data.message ||
            "Failed to delete product."
        );

    }


    return data;

}


// =====================================
// LOAD ORDERS
// =====================================

async function loadOrders() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/orders`
        );


        const data = await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Failed to load orders."
            );

        }


        return data.orders || [];

    } catch (error) {

        console.error(
            "LOAD ORDERS ERROR:",
            error
        );

        return [];

    }

}


// =====================================
// UPDATE ORDER STATUS
// =====================================

async function updateOrderStatus(
    orderId,
    status
) {

    const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/status`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status
            })
        }
    );


    const data = await response.json();


    if (!response.ok || !data.success) {

        throw new Error(
            data.message ||
            "Failed to update order status."
        );

    }


    return data;

}


// =====================================
// DELETE ORDER
// =====================================

async function deleteOrder(orderId) {

    const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}`,
        {
            method: "DELETE"
        }
    );


    const data = await response.json();


    if (!response.ok || !data.success) {

        throw new Error(
            data.message ||
            "Failed to delete order."
        );

    }


    return data;

}


// =====================================
// LOAD NOTIFICATIONS
// =====================================

async function loadNotifications() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/orders/notifications`
        );


        const data = await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Failed to load notifications."
            );

        }


        return data.notifications || [];

    } catch (error) {

        console.error(
            "LOAD NOTIFICATIONS ERROR:",
            error
        );

        return [];

    }

}


// =====================================
// LOAD UNREAD NOTIFICATIONS
// =====================================

async function loadUnreadNotifications() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/orders/notifications/unread`
        );


        const data = await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Failed to load unread notifications."
            );

        }


        return data.notifications || [];

    } catch (error) {

        console.error(
            "LOAD UNREAD NOTIFICATIONS ERROR:",
            error
        );

        return [];

    }

}


// =====================================
// MARK NOTIFICATION AS READ
// =====================================

async function markNotificationAsRead(
    notificationId
) {

    const response = await fetch(
        `${API_BASE_URL}/orders/notifications/${notificationId}/read`,
        {
            method: "PUT"
        }
    );


    const data = await response.json();


    if (!response.ok || !data.success) {

        throw new Error(
            data.message ||
            "Failed to mark notification as read."
        );

    }


    return data;

}


// =====================================
// DELETE NOTIFICATION
// =====================================

async function deleteNotification(
    notificationId
) {

    const response = await fetch(
        `${API_BASE_URL}/orders/notifications/${notificationId}`,
        {
            method: "DELETE"
        }
    );


    const data = await response.json();


    if (!response.ok || !data.success) {

        throw new Error(
            data.message ||
            "Failed to delete notification."
        );

    }


    return data;

}


// =====================================
// FORMAT MONEY
// =====================================

function formatMoney(value) {

    const amount =
        Number(value) || 0;


    return amount.toLocaleString(
        "en-SL",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// =====================================
// FORMAT DATE
// =====================================

function formatDate(value) {

    if (!value) {
        return "";
    }


    const date =
        new Date(
            String(value).replace(" ", "T")
        );


    if (Number.isNaN(date.getTime())) {

        return value;

    }


    return date.toLocaleString();

}


// =====================================
// ESCAPE HTML
// =====================================

function escapeHTML(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================
// RENDER PRODUCTS
// =====================================

function renderProducts(products) {

    const tableBody =
        document.getElementById(
            "productsTableBody"
        );


    if (!tableBody) {
        return;
    }


    if (!products.length) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-message"
                >
                    No products found.
                </td>

            </tr>

        `;

        return;

    }


    tableBody.innerHTML =
        products.map(product => {

            return `

                <tr>

                    <td>

                        <strong>
                            ${escapeHTML(product.name)}
                        </strong>

                    </td>

                    <td>
                        ${escapeHTML(product.category)}
                    </td>

                    <td>
                        NLe ${formatMoney(product.price)}
                    </td>

                    <td>
                        ${Number(product.stock) || 0}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="edit-button"
                            data-action="edit-product"
                            data-id="${product.id}"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-button"
                            data-action="delete-product"
                            data-id="${product.id}"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        }).join("");

}


// =====================================
// UPDATE DASHBOARD PRODUCT CARDS
// =====================================

function updateProductCards(products) {

    const totalProducts =
        document.getElementById(
            "totalProducts"
        );


    const totalStock =
        document.getElementById(
            "totalStock"
        );


    const lowStock =
        document.getElementById(
            "lowStock"
        );


    if (totalProducts) {

        totalProducts.textContent =
            products.length;

    }


    const stockTotal =
        products.reduce(
            (total, product) => {

                return total +
                    (Number(product.stock) || 0);

            },
            0
        );


    if (totalStock) {

        totalStock.textContent =
            stockTotal;

    }


    const lowStockTotal =
        products.filter(product => {

            const stock =
                Number(product.stock) || 0;

            return stock <= 5;

        }).length;


    if (lowStock) {

        lowStock.textContent =
            lowStockTotal;

    }

}


// =====================================
// RENDER ORDERS
// =====================================

function renderOrders(orders) {

    const tableBody =
        document.getElementById(
            "ordersTableBody"
        );


    if (!tableBody) {
        return;
    }


    if (!orders.length) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="11"
                    class="empty-message"
                >
                    No customer orders found.
                </td>

            </tr>

        `;

        return;

    }


    tableBody.innerHTML =
        orders.map(order => {

            const productsText =
                Array.isArray(order.items) &&
                order.items.length

                    ? order.items.map(item => {

                        return `${escapeHTML(
                            item.product_name ||
                            "Product"
                        )} × ${Number(item.quantity) || 0}`;

                    }).join("<br>")

                    : "No products";


            return `

                <tr>

                    <td>
                        #${order.id}
                    </td>

                    <td>
                        ${escapeHTML(
                            order.customer_name
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            order.phone
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            order.address
                        )}
                    </td>

                    <td>
                        ${productsText}
                    </td>

                    <td>
                        ${escapeHTML(
                            order.delivery_location || ""
                        )}
                    </td>

                    <td>
                        NLe ${formatMoney(order.total)}
                    </td>

                    <td>
                        ${escapeHTML(
                            order.payment_method || ""
                        )}
                    </td>

                    <td>

                        <select
                            class="status-select"
                            data-action="update-status"
                            data-id="${order.id}"
                        >

                            <option
                                value="Pending"
                                ${order.status === "Pending"
                                    ? "selected"
                                    : ""}
                            >
                                Pending
                            </option>

                            <option
                                value="Processing"
                                ${order.status === "Processing"
                                    ? "selected"
                                    : ""}
                            >
                                Processing
                            </option>

                            <option
                                value="Delivered"
                                ${order.status === "Delivered"
                                    ? "selected"
                                    : ""}
                            >
                                Delivered
                            </option>

                            <option
                                value="Cancelled"
                                ${order.status === "Cancelled"
                                    ? "selected"
                                    : ""}
                            >
                                Cancelled
                            </option>

                        </select>

                    </td>

                    <td>
                        ${formatDate(order.created_at)}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="delete-button"
                            data-action="delete-order"
                            data-id="${order.id}"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        }).join("");

}


// =====================================
// RENDER NOTIFICATIONS
// =====================================

function renderNotifications(
    notifications
) {

    const container =
        document.getElementById(
            "notificationsList"
        );


    if (!container) {
        return;
    }


    if (!notifications.length) {

        container.innerHTML = `

            <div class="empty-notification">

                No notifications.

            </div>

        `;

        return;

    }


    container.innerHTML =
        notifications.map(notification => {

            const unread =
                Number(notification.is_read) === 0;


            return `

                <div
                    class="notification-item
                    ${unread ? "unread" : ""}"
                >

                    <div class="notification-message">

                        ${escapeHTML(
                            notification.message
                        )}

                    </div>

                    <div class="notification-date">

                        Order #${notification.order_id}

                        <br>

                        ${formatDate(
                            notification.created_at
                        )}

                    </div>

                    <div class="notification-actions">

                        <button
                            type="button"
                            class="view-button"
                            data-action="view-notification"
                            data-order-id="${notification.order_id}"
                        >
                            View Order
                        </button>

                        ${
                            unread
                                ? `
                                    <button
                                        type="button"
                                        class="read-button"
                                        data-action="read-notification"
                                        data-id="${notification.id}"
                                    >
                                        Mark Read
                                    </button>
                                  `
                                : ""
                        }

                        <button
                            type="button"
                            class="delete-notification-button"
                            data-action="delete-notification"
                            data-id="${notification.id}"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            `;

        }).join("");

}


// =====================================
// UPDATE NOTIFICATION BADGE
// =====================================

function updateNotificationBadge(
    unreadNotifications
) {

    const badge =
        document.getElementById(
            "notificationBadge"
        );


    if (!badge) {
        return;
    }


    const count =
        unreadNotifications.length;


    badge.textContent =
        count;


    badge.style.display =
        count > 0
            ? "flex"
            : "none";

}


// =====================================
// SHOW NEW ORDER POPUP
// =====================================

function showOrderPopup(
    notification
) {

    const popup =
        document.getElementById(
            "orderNotificationPopup"
        );


    const message =
        document.getElementById(
            "popupMessage"
        );


    if (!popup) {
        return;
    }


    if (message) {

        message.textContent =
            notification.message ||
            "You have received a new customer order.";

    }


    popup.dataset.orderId =
        notification.order_id || "";


    popup.classList.add("show");

}


// =====================================
// CLOSE ORDER POPUP
// =====================================

function closeOrderPopup() {

    const popup =
        document.getElementById(
            "orderNotificationPopup"
        );


    if (popup) {

        popup.classList.remove("show");

    }

}


// =====================================
// REFRESH PRODUCTS
// =====================================

async function refreshProducts() {

    const products =
        await loadProducts();


    renderProducts(products);

    updateProductCards(products);


    return products;

}


// =====================================
// REFRESH ORDERS
// =====================================

async function refreshOrders() {

    const orders =
        await loadOrders();


    renderOrders(orders);


    const totalOrders =
        document.getElementById(
            "totalOrders"
        );


    if (totalOrders) {

        totalOrders.textContent =
            orders.length;

    }


    return orders;

}


// =====================================
// REFRESH NOTIFICATIONS
// =====================================

async function refreshNotifications(
    showPopup = false
) {

    const [
        notifications,
        unreadNotifications
    ] = await Promise.all([

        loadNotifications(),

        loadUnreadNotifications()

    ]);


    renderNotifications(
        notifications
    );


    updateNotificationBadge(
        unreadNotifications
    );


    if (
        showPopup &&
        unreadNotifications.length > 0
    ) {

        showOrderPopup(
            unreadNotifications[0]
        );

    }


    return {
        notifications,
        unreadNotifications
    };

}


// =====================================
// REFRESH ENTIRE DASHBOARD
// =====================================

async function refreshDashboard(
    showPopup = false
) {

    try {

        const [
            products,
            orders,
            notificationData
        ] = await Promise.all([

            loadProducts(),

            loadOrders(),

            refreshNotifications(
                showPopup
            )

        ]);


        renderProducts(products);

        updateProductCards(products);


        renderOrders(orders);


        const totalOrders =
            document.getElementById(
                "totalOrders"
            );


        if (totalOrders) {

            totalOrders.textContent =
                orders.length;

        }


        return {

            products,
            orders,

            notifications:
                notificationData.notifications,

            unreadNotifications:
                notificationData.unreadNotifications

        };

    } catch (error) {

        console.error(
            "REFRESH DASHBOARD ERROR:",
            error
        );

    }

}


// =====================================
// EDIT PRODUCT
// =====================================

async function handleEditProduct(
    productId
) {

    const products =
        await loadProducts();


    const product =
        products.find(
            item =>
                Number(item.id) ===
                Number(productId)
        );


    if (!product) {

        alert("Product not found.");

        return;

    }


    const name =
        prompt(
            "Product name:",
            product.name
        );


    if (name === null) {
        return;
    }


    const category =
        prompt(
            "Category:",
            product.category
        );


    if (category === null) {
        return;
    }


    const price =
        prompt(
            "Price (NLe):",
            product.price
        );


    if (price === null) {
        return;
    }


    const stock =
        prompt(
            "Stock quantity:",
            product.stock
        );


    if (stock === null) {
        return;
    }


    const description =
        prompt(
            "Description:",
            product.description || ""
        );


    if (description === null) {
        return;
    }


    const image =
        prompt(
            "Image URL:",
            product.image || ""
        );


    if (image === null) {
        return;
    }


    try {

        await updateProduct(
            productId,
            {
                name,
                category,
                price: Number(price),
                stock: Number(stock),
                description,
                image
            }
        );


        alert(
            "Product updated successfully."
        );


        await refreshProducts();

    } catch (error) {

        alert(
            error.message
        );

    }

}


// =====================================
// HANDLE DELETE PRODUCT
// =====================================

async function handleDeleteProduct(
    productId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteProduct(
            productId
        );


        alert(
            "Product deleted successfully."
        );


        await refreshProducts();

    } catch (error) {

        alert(
            error.message
        );

    }

}


// =====================================
// HANDLE DELETE ORDER
// =====================================

async function handleDeleteOrder(
    orderId
) {

    const confirmed =
        confirm(
            `Delete order #${orderId}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteOrder(
            orderId
        );


        alert(
            `Order #${orderId} deleted successfully.`
        );


        await refreshDashboard();

    } catch (error) {

        alert(
            error.message
        );

    }

}


// =====================================
// HANDLE ORDER STATUS
// =====================================

async function handleOrderStatusChange(
    orderId,
    status
) {

    try {

        await updateOrderStatus(
            orderId,
            status
        );


        console.log(
            `Order #${orderId} changed to ${status}`
        );


        await refreshOrders();

    } catch (error) {

        alert(
            error.message
        );


        await refreshOrders();

    }

}


// =====================================
// VIEW ORDER
// =====================================

async function viewOrder(
    orderId
) {

    const orders =
        await loadOrders();


    const order =
        orders.find(
            item =>
                Number(item.id) ===
                Number(orderId)
        );


    if (!order) {

        alert(
            `Order #${orderId} not found.`
        );

        return;

    }


    let message =
        `ORDER #${order.id}\n\n`;


    message +=
        `Customer: ${order.customer_name}\n`;

    message +=
        `Phone: ${order.phone}\n`;

    message +=
        `Email: ${order.email || "N/A"}\n`;

    message +=
        `Address: ${order.address}\n`;

    message +=
        `Delivery: ${
            order.delivery_location || "N/A"
        }\n`;

    message +=
        `Payment: ${
            order.payment_method || "N/A"
        }\n`;

    message +=
        `Status: ${order.status}\n\n`;


    message +=
        "PRODUCTS:\n";


    if (
        Array.isArray(order.items) &&
        order.items.length
    ) {

        order.items.forEach(item => {

            message +=
                `- ${item.product_name || "Product"} ` +
                `× ${item.quantity} ` +
                `@ NLe ${formatMoney(item.price)}\n`;

        });

    } else {

        message +=
            "No products listed.\n";

    }


    message += "\n";


    message +=
        `Products Total: NLe ${
            formatMoney(order.products_total)
        }\n`;

    message +=
        `Delivery Fee: NLe ${
            formatMoney(order.delivery_fee)
        }\n`;

    message +=
        `TOTAL: NLe ${
            formatMoney(order.total)
        }`;


    alert(message);

}


// =====================================
// HANDLE NOTIFICATION READ
// =====================================

async function handleReadNotification(
    notificationId
) {

    try {

        await markNotificationAsRead(
            notificationId
        );


        await refreshNotifications();

    } catch (error) {

        alert(
            error.message
        );

    }

}


// =====================================
// HANDLE DELETE NOTIFICATION
// =====================================

async function handleDeleteNotification(
    notificationId
) {

    const confirmed =
        confirm(
            "Delete this notification?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteNotification(
            notificationId
        );


        await refreshNotifications();

    } catch (error) {

        alert(
            error.message
        );

    }

}


// =====================================
// PRODUCT FORM
// =====================================

function setupProductForm() {

    const form =
        document.getElementById(
            "productForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "productName"
                ).value.trim();


            const category =
                document.getElementById(
                    "category"
                ).value;


            const price =
                document.getElementById(
                    "price"
                ).value;


            const stock =
                document.getElementById(
                    "stock"
                ).value;


            const description =
                document.getElementById(
                    "description"
                ).value.trim();


            const image =
                document.getElementById(
                    "image"
                ).value.trim();


            if (!name) {

                alert(
                    "Please enter a product name."
                );

                return;

            }


            try {

                await addProduct({

                    name,

                    category,

                    price: Number(price),

                    stock: Number(stock),

                    description,

                    image

                });


                alert(
                    "Product added successfully."
                );


                form.reset();


                await refreshProducts();

            } catch (error) {

                alert(
                    error.message
                );

            }

        }
    );

}


// =====================================
// EVENT DELEGATION
// =====================================

function setupDashboardEvents() {

    document.addEventListener(
        "click",
        async function(event) {

            const button =
                event.target.closest(
                    "[data-action]"
                );


            if (!button) {
                return;
            }


            const action =
                button.dataset.action;


            const id =
                button.dataset.id;


            if (
                action ===
                "edit-product"
            ) {

                await handleEditProduct(id);

            }


            else if (
                action ===
                "delete-product"
            ) {

                await handleDeleteProduct(id);

            }


            else if (
                action ===
                "delete-order"
            ) {

                await handleDeleteOrder(id);

            }


            else if (
                action ===
                "view-notification"
            ) {

                const orderId =
                    button.dataset.orderId;


                await viewOrder(
                    orderId
                );

            }


            else if (
                action ===
                "read-notification"
            ) {

                await handleReadNotification(
                    id
                );

            }


            else if (
                action ===
                "delete-notification"
            ) {

                await handleDeleteNotification(
                    id
                );

            }

        }
    );


    document.addEventListener(
        "change",
        async function(event) {

            const select =
                event.target.closest(
                    '[data-action="update-status"]'
                );


            if (!select) {
                return;
            }


            const orderId =
                select.dataset.id;


            const status =
                select.value;


            await handleOrderStatusChange(
                orderId,
                status
            );

        }
    );

}


// =====================================
// NOTIFICATION BUTTON
// =====================================

function setupNotificationButton() {

    const button =
        document.getElementById(
            "notificationButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        async function() {

            const section =
                document.getElementById(
                    "notificationsSection"
                );


            if (section) {

                section.scrollIntoView({
                    behavior: "smooth"
                });

            }


            await refreshNotifications();

        }
    );

}


// =====================================
// REFRESH ORDERS BUTTON
// =====================================

function setupRefreshOrdersButton() {

    const button =
        document.getElementById(
            "refreshOrdersButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        async function() {

            button.disabled = true;

            button.textContent =
                "Refreshing...";


            try {

                await refreshDashboard();

            } finally {

                button.disabled = false;

                button.textContent =
                    "Refresh Orders";

            }

        }
    );

}


// =====================================
// POPUP EVENTS
// =====================================

function setupPopupEvents() {

    const closeButton =
        document.getElementById(
            "closeNotificationPopup"
        );


    const viewButton =
        document.getElementById(
            "popupViewOrder"
        );


    const popup =
        document.getElementById(
            "orderNotificationPopup"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function() {

                closeOrderPopup();

            }
        );

    }


    if (viewButton) {

        viewButton.addEventListener(
            "click",
            async function() {

                const orderId =
                    popup
                        ? popup.dataset.orderId
                        : "";


                closeOrderPopup();


                if (orderId) {

                    await viewOrder(
                        orderId
                    );

                }

            }
        );

    }


    if (popup) {

        popup.addEventListener(
            "click",
            function(event) {

                if (
                    event.target === popup
                ) {

                    closeOrderPopup();

                }

            }
        );

    }

}


// =====================================
// CHECK FOR NEW ORDERS
// =====================================

let previousUnreadOrderIds = [];


async function checkForNewOrders() {

    const unread =
        await loadUnreadNotifications();


    const currentIds =
        unread.map(
            notification =>
                Number(notification.id)
        );


    const newNotifications =
        unread.filter(
            notification =>
                !previousUnreadOrderIds.includes(
                    Number(notification.id)
                )
        );


    if (
        previousUnreadOrderIds.length > 0 &&
        newNotifications.length > 0
    ) {

        showOrderPopup(
            newNotifications[0]
        );

    }


    previousUnreadOrderIds =
        currentIds;


    updateNotificationBadge(
        unread
    );

}


// =====================================
// START NOTIFICATION CHECK
// =====================================

function startNotificationPolling() {

    loadUnreadNotifications()
        .then(function(unread) {

            previousUnreadOrderIds =
                unread.map(
                    notification =>
                        Number(notification.id)
                );

            updateNotificationBadge(
                unread
            );

        });


    setInterval(
        checkForNewOrders,
        10000
    );

}


// =====================================
// INITIALIZE ADMIN DASHBOARD
// =====================================

async function initializeAdminDashboard() {

    console.log(
        "MakeniMart Admin Dashboard starting..."
    );


    if (!isAdminLoggedIn()) {

        console.warn(
            "Admin login flag not found."
        );

        /*
         * We do not redirect here because your
         * current admin.html is the dashboard page.
         */

    }


    setupProductForm();

    setupDashboardEvents();

    setupNotificationButton();

    setupRefreshOrdersButton();

    setupPopupEvents();


    await refreshDashboard();


    startNotificationPolling();


    console.log(
        "MakeniMart Admin Dashboard ready."
    );

}


// =====================================
// PAGE READY
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "MakeniMart admin.js loaded successfully."
        );


        initializeAdminDashboard();

    }
);