// =====================================
// MAKENIMART CART
// =====================================

const DELIVERY_FEE = 50;


// =====================================
// GET CART
// =====================================

function getCart() {

    const savedCart =
        localStorage.getItem("makeniMartCart");

    if (!savedCart) {
        return [];
    }

    try {

        return JSON.parse(savedCart);

    } catch (error) {

        console.error(
            "Could not read cart:",
            error
        );

        return [];
    }
}


// =====================================
// SAVE CART
// =====================================

function saveCart(cart) {

    localStorage.setItem(
        "makeniMartCart",
        JSON.stringify(cart)
    );

}


// =====================================
// DISPLAY CART
// =====================================

function displayCart() {

    const cart = getCart();

    const cartItems =
        document.getElementById("cartItems");


    if (!cartItems) {

        console.error(
            "cartItems element not found."
        );

        return;
    }


    cartItems.innerHTML = "";


    // =================================
    // EMPTY CART
    // =================================

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <h2>Your cart is empty</h2>

                <p>
                    You have not added
                    any products yet.
                </p>

                <a
                    href="products.html"
                    class="shop-button"
                >
                    Continue Shopping
                </a>

            </div>

        `;

        updateSummary([]);

        return;
    }


    // =================================
    // DISPLAY CART PRODUCTS
    // =================================

    cart.forEach(function(item, index) {

        const itemPrice =
            Number(item.price) || 0;


        const itemQuantity =
            Number(item.quantity) || 1;


        const itemSubtotal =
            itemPrice * itemQuantity;


        const cartItem =
            document.createElement("div");


        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-info">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    NLe ${itemPrice.toFixed(2)}
                    each
                </p>

            </div>


            <div class="cart-item-price">

                NLe ${itemSubtotal.toFixed(2)}

            </div>


            <div class="quantity-controls">

                <button
                    type="button"
                    onclick="changeQuantity(${index}, -1)"
                >
                    −
                </button>


                <span>
                    ${itemQuantity}
                </span>


                <button
                    type="button"
                    onclick="changeQuantity(${index}, 1)"
                >
                    +
                </button>

            </div>


            <button
                type="button"
                class="remove-button"
                onclick="removeItem(${index})"
            >
                Remove
            </button>

        `;


        cartItems.appendChild(cartItem);

    });


    updateSummary(cart);

}


// =====================================
// UPDATE ORDER SUMMARY
// =====================================

function updateSummary(cart) {

    // Calculate subtotal

    let subtotal = 0;


    cart.forEach(function(item) {

        const price =
            Number(item.price) || 0;


        const quantity =
            Number(item.quantity) || 1;


        subtotal +=
            price * quantity;

    });


    // =================================
    // DELIVERY FEE
    // =================================

    let delivery = 0;


    if (cart.length > 0) {

        delivery = DELIVERY_FEE;

    }


    // =================================
    // FINAL TOTAL
    // =================================

    const total =
        subtotal + delivery;


    // =================================
    // UPDATE SUBTOTAL
    // =================================

    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            `NLe ${subtotal.toFixed(2)}`;

    }


    // =================================
    // UPDATE DELIVERY
    // =================================

    const deliveryElement =
        document.getElementById(
            "deliveryFee"
        );


    if (deliveryElement) {

        deliveryElement.textContent =
            `NLe ${delivery.toFixed(2)}`;

    }


    // =================================
    // UPDATE TOTAL
    // =================================

    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (totalElement) {

        totalElement.textContent =
            `NLe ${total.toFixed(2)}`;

    }


    // Debug information

    console.log(
        "MakeniMart Cart Summary"
    );

    console.log(
        "Subtotal:",
        subtotal
    );

    console.log(
        "Delivery:",
        delivery
    );

    console.log(
        "Total:",
        total
    );

}


// =====================================
// CHANGE QUANTITY
// =====================================

function changeQuantity(index, change) {

    const cart = getCart();


    if (!cart[index]) {
        return;
    }


    const currentQuantity =
        Number(cart[index].quantity) || 1;


    const newQuantity =
        currentQuantity + change;


    if (newQuantity <= 0) {

        cart.splice(index, 1);

    } else {

        cart[index].quantity =
            newQuantity;

    }


    saveCart(cart);

    displayCart();

}


// =====================================
// REMOVE ITEM
// =====================================

function removeItem(index) {

    const cart = getCart();


    if (!cart[index]) {
        return;
    }


    cart.splice(index, 1);


    saveCart(cart);

    displayCart();

}


// =====================================
// CLEAR CART
// =====================================

function clearCart() {

    const cart = getCart();


    if (cart.length === 0) {
        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to clear your cart?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        "makeniMartCart"
    );


    displayCart();

}


// =====================================
// START CART
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayCart();

    }
);