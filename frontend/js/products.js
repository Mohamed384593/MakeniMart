// =====================================
// MAKENIMART PRODUCTS
// =====================================

const API_URL = "http://localhost:5000/api/products";


// =====================================
// LOAD PRODUCTS
// =====================================

async function loadProducts() {

    try {

        const response = await fetch(API_URL);

        const data = await response.json();

        console.log("Products received:", data);

        if (!data.success) {

            console.error("Could not load products.");

            return;
        }

        displayProducts(data.products);

    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );

    }

}


// =====================================
// DISPLAY PRODUCTS
// =====================================

function displayProducts(products) {

    const productGrid =
        document.getElementById("productGrid");


    if (!productGrid) {

        console.error(
            "productGrid was not found in products.html"
        );

        return;
    }


    productGrid.innerHTML = "";


    if (!products || products.length === 0) {

        productGrid.innerHTML = `
            <p>
                No products available.
            </p>
        `;

        return;
    }


    products.forEach(function(product) {

        const card =
            document.createElement("div");


        card.className =
            "product-card";


        card.innerHTML = `

            <div class="product-info">

                <h2>
                    ${product.name}
                </h2>

                <p>
                    ${product.description || ""}
                </p>

                <p>
                    <strong>
                        Category:
                    </strong>

                    ${product.category}
                </p>

                <p>
                    <strong>
                        Price:
                    </strong>

                    NLe ${Number(product.price).toFixed(2)}
                </p>

                <p>
                    <strong>
                        Stock:
                    </strong>

                    ${product.stock}
                </p>

                <button
                    type="button"
                    onclick="addToCart(${product.id})"
                    ${Number(product.stock) <= 0 ? "disabled" : ""}
                >

                    ${
                        Number(product.stock) <= 0
                        ? "Out of Stock"
                        : "Add to Cart"
                    }

                </button>

            </div>

        `;


        productGrid.appendChild(card);

    });

}


// =====================================
// ADD TO CART
// =====================================

async function addToCart(productId) {

    try {

        const response =
            await fetch(API_URL);


        const data =
            await response.json();


        if (!data.success) {

            alert(
                "Could not load products."
            );

            return;
        }


        const product =
            data.products.find(
                function(item) {

                    return Number(item.id) ===
                        Number(productId);

                }
            );


        if (!product) {

            alert(
                "Product not found."
            );

            return;
        }


        if (Number(product.stock) <= 0) {

            alert(
                "This product is out of stock."
            );

            return;
        }


        let cart =
            JSON.parse(
                localStorage.getItem(
                    "makeniMartCart"
                )
            ) || [];


        const existing =
            cart.find(
                function(item) {

                    return Number(item.id) ===
                        Number(product.id);

                }
            );


        if (existing) {

            if (
                Number(existing.quantity) >=
                Number(product.stock)
            ) {

                alert(
                    "You have reached the available stock."
                );

                return;
            }


            existing.quantity =
                Number(existing.quantity) + 1;

        } else {

            cart.push({

                id: product.id,

                name: product.name,

                price: Number(product.price),

                quantity: 1

            });

        }


        localStorage.setItem(
            "makeniMartCart",
            JSON.stringify(cart)
        );


        alert(
            product.name +
            " added to cart!"
        );


        updateCartCount();


    } catch (error) {

        console.error(
            "Add to cart error:",
            error
        );

        alert(
            "Could not add product to cart."
        );

    }

}


// =====================================
// CART COUNT
// =====================================

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem(
                "makeniMartCart"
            )
        ) || [];


    let count = 0;


    cart.forEach(function(item) {

        count += Number(item.quantity);

    });


    const cartCount =
        document.getElementById(
            "cartCount"
        );


    if (cartCount) {

        cartCount.textContent = count;

    }

}


// =====================================
// START
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadProducts();

        updateCartCount();

    }
);