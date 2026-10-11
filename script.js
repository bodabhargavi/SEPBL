// Foodie Express — frontend-only demo.
// Menu items are sample data. Cart and orders are saved in this browser.

const CART_KEY = "foodieExpressCart";
const ORDERS_KEY = "foodieExpressOrders";

const foods = [
    {
        id: "veg-burger",
        name: "Veg Burger",
        description: "Crispy veggie patty with fresh lettuce and our special sauce.",
        price: 99,
        category: "Burgers",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: "cheese-pizza",
        name: "Cheese Pizza",
        description: "Hot pizza topped with rich cheese and a delicious tomato base.",
        price: 249,
        category: "Pizza",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: "french-fries",
        name: "French Fries",
        description: "Golden, crispy fries seasoned to perfection.",
        price: 89,
        category: "Snacks",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: "chicken-burger",
        name: "Chicken Burger",
        description: "Juicy chicken patty with fresh toppings in a soft bun.",
        price: 159,
        category: "Burgers",
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: "chocolate-cake",
        name: "Chocolate Cake",
        description: "A rich, soft chocolate treat for your sweet cravings.",
        price: 129,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: "cold-coffee",
        name: "Cold Coffee",
        description: "Smooth, chilled coffee served refreshingly cold.",
        price: 79,
        category: "Drinks",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: "margherita-pizza",
        name: "Margherita Pizza",
        description: "Classic pizza with tomato, herbs and melted cheese.",
        price: 199,
        category: "Pizza",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: "veg-sandwich",
        name: "Veg Sandwich",
        description: "Toasted bread filled with fresh vegetables.",
        price: 119,
        category: "Snacks",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80"
    }
];

function readStorage(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return Array.isArray(value) ? value : fallback;
    } catch {
        return fallback;
    }
}

let cart = readStorage(CART_KEY, []);
let orders = readStorage(ORDERS_KEY, []);

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function saveOrders() {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function money(value) {
    return Number(value).toLocaleString("en-IN");
}

function createCategories() {
    const select = document.getElementById("categoryFilter");
    const currentValue = select.value || "all";
    const categories = [...new Set(foods.map(food => food.category))].sort();

    select.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Categories";
    select.appendChild(allOption);

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });

    select.value = categories.includes(currentValue) ? currentValue : "all";
}

function displayFoods(foodList) {
    const container = document.getElementById("foodContainer");
    container.replaceChildren();

    if (foodList.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-state";
        message.textContent = "No food items match your search.";
        container.appendChild(message);
        return;
    }

    foodList.forEach(food => {
        const card = document.createElement("article");
        card.className = "food-card";

        const image = document.createElement("img");
        image.src = food.image;
        image.alt = food.name;
        image.loading = "lazy";
        image.onerror = () => {
            image.onerror = null;
            image.src = "https://placehold.co/700x400/f1f1f1/555?text=Food";
        };

        const info = document.createElement("div");
        info.className = "food-info";

        const name = document.createElement("h3");
        name.textContent = food.name;

        const category = document.createElement("p");
        category.className = "category";
        category.textContent = food.category;

        const description = document.createElement("p");
        description.className = "description";
        description.textContent = food.description;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = `₹${money(food.price)}`;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "add-button";
        button.textContent = "Add to Cart";
        button.addEventListener("click", () => addToCart(food.id));

        info.append(name, category, description, price, button);
        card.append(image, info);
        container.appendChild(card);
    });
}

function filterFoods() {
    const search = document.getElementById("searchInput").value.trim().toLowerCase();
    const category = document.getElementById("categoryFilter").value;

    const filtered = foods.filter(food => {
        const matchesSearch =
            food.name.toLowerCase().includes(search) ||
            food.description.toLowerCase().includes(search) ||
            food.category.toLowerCase().includes(search);
        const matchesCategory = category === "all" || food.category === category;
        return matchesSearch && matchesCategory;
    });

    displayFoods(filtered);
}

function addToCart(foodId) {
    const food = foods.find(item => item.id === foodId);
    if (!food) return;

    const existing = cart.find(item => item.foodId === foodId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            foodId: food.id,
            name: food.name,
            price: food.price,
            quantity: 1
        });
    }

    saveCart();
    displayCart();
}

function displayCart() {
    const container = document.getElementById("cartContainer");
    const totalElement = document.getElementById("cartTotal");
    const countElement = document.getElementById("cartCount");
    const checkoutTotal = document.getElementById("checkoutTotal");

    container.replaceChildren();
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "Your cart is empty.";
        container.appendChild(empty);
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        count += item.quantity;

        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("div");
        const name = document.createElement("h3");
        name.textContent = item.name;
        const price = document.createElement("p");
        price.textContent = `₹${money(item.price)} each`;
        details.append(name, price);

        const quantity = document.createElement("div");
        quantity.className = "quantity";

        const minus = document.createElement("button");
        minus.type = "button";
        minus.textContent = "−";
        minus.setAttribute("aria-label", `Decrease ${item.name} quantity`);
        minus.addEventListener("click", () => decreaseQuantity(index));

        const number = document.createElement("span");
        number.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.type = "button";
        plus.textContent = "+";
        plus.setAttribute("aria-label", `Increase ${item.name} quantity`);
        plus.addEventListener("click", () => increaseQuantity(index));

        quantity.append(minus, number, plus);

        const subtotal = document.createElement("strong");
        subtotal.textContent = `₹${money(itemTotal)}`;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-button";
        remove.textContent = "Remove";
        remove.addEventListener("click", () => removeFromCart(index));

        row.append(details, quantity, subtotal, remove);
        container.appendChild(row);
    });

    totalElement.textContent = money(total);
    checkoutTotal.textContent = money(total);
    countElement.textContent = count;
}

function increaseQuantity(index) {
    if (!cart[index]) return;
    cart[index].quantity += 1;
    saveCart();
    displayCart();
}

function decreaseQuantity(index) {
    if (!cart[index]) return;
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
    displayCart();
}

function removeFromCart(index) {
    if (index < 0 || index >= cart.length) return;
    cart.splice(index, 1);
    saveCart();
    displayCart();
}

function goToCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Add an item before checkout.");
        return;
    }
    document.getElementById("checkout").scrollIntoView({ behavior: "smooth" });
}

function showOrderConfirmation(order) {
    const message = document.getElementById("orderMessage");
    message.replaceChildren();

    const card = document.createElement("div");
    card.className = "success-message";

    const heading = document.createElement("h3");
    heading.textContent = "✅ Order placed successfully!";

    const id = document.createElement("p");
    id.textContent = `Order ID: ${order.id}`;

    const thanks = document.createElement("p");
    thanks.textContent = `Thank you, ${order.customerName}. Your order total is ₹${money(order.total)}.`;

    const note = document.createElement("p");
    note.textContent = "This is a demo order; no payment or delivery request was sent.";

    card.append(heading, id, thanks, note);
    message.appendChild(card);
}

document.getElementById("orderForm").addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty. Add an item before placing an order.");
        return;
    }

    const customerName = document.getElementById("customerName").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!customerName || !address) {
        alert("Please enter your name and delivery address.");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = {
        id: `FE-${Date.now().toString().slice(-8)}`,
        customerName,
        address,
        items: cart.map(item => ({ ...item })),
        total,
        status: "Confirmed (Demo)",
        date: new Date().toLocaleString()
    };

    orders.unshift(order);
    saveOrders();

    cart = [];
    saveCart();
    displayCart();
    displayOrderHistory();
    showOrderConfirmation(order);
    event.target.reset();

    document.getElementById("orderMessage").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

function displayOrderHistory() {
    const container = document.getElementById("historyContainer");
    container.replaceChildren();

    if (orders.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "No orders yet. Place your first order!";
        container.appendChild(empty);
        return;
    }

    orders.forEach(order => {
        const card = document.createElement("article");
        card.className = "history-card";

        const heading = document.createElement("h3");
        heading.textContent = `Order ${order.id}`;

        const date = document.createElement("p");
        date.textContent = `Date: ${order.date}`;

        const customer = document.createElement("p");
        customer.textContent = `Customer: ${order.customerName}`;

        const address = document.createElement("p");
        address.textContent = `Delivery address: ${order.address}`;

        const items = document.createElement("p");
        items.textContent = "Items: " + order.items
            .map(item => `${item.name} × ${item.quantity}`)
            .join(", ");

        const total = document.createElement("p");
        total.textContent = `Total: ₹${money(order.total)}`;

        const status = document.createElement("p");
        status.className = "order-status";
        status.textContent = `Status: ${order.status}`;

        card.append(heading, date, customer, address, items, total, status);
        container.appendChild(card);
    });
}

// Start the application.
document.getElementById("searchInput").addEventListener("input", filterFoods);
document.getElementById("categoryFilter").addEventListener("change", filterFoods);

createCategories();
displayFoods(foods);
displayCart();
displayOrderHistory();
