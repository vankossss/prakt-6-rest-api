import state from "./state.js";
import router from "./router.js";
import { getProducts } from "./api.js";

const mainContainer = document.querySelector('main');

function render() {
    const page = state.currentPage;
    mainContainer.innerHTML = "";

    if (page === "home") {
        mainContainer.innerHTML = `
            <section class="banner"><div class="main-banner"></div></section>
            <section class="content-section">
                <h2>Welcome to Store</h2>
                <button class="btn" id="go-store">Shop Now</button>
            </section>`;
        document.getElementById("go-store").onclick = () => router.navigate("store");
    } else if (page === "store") {
        mainContainer.innerHTML = `
            <section class="content-section">
                <h2>All Products</h2>
                <div class="items-grid">
                    ${state.products.map(p => `
                        <div class="item-card" data-id="${p.id}">
                            <div class="item-image" style="background-image: url('${p.thumbnail}')"></div>
                            <div class="item-info"><span>${p.title}</span><b>$${p.price}</b></div>
                        </div>
                    `).join('')}
                </div>
            </section>`;
        document.querySelectorAll('.item-card').forEach(card => {
            card.onclick = () => router.navigate("details", { id: parseInt(card.dataset.id) });
        });
    } else if (page === "details") {
        const p = state.products.find(prod => prod.id === state.selectedProduct);
        mainContainer.innerHTML = `
            <section class="content-section">
            <div style="display: flex; gap: 2rem; align-items: center;">
                <img src="${p.thumbnail}" style="width: 300px; border: 1px solid #ddd;">
                <div>
                    <h1>${p.title}</h1>
                    <p style="font-size: 1.5rem; font-weight: bold;">$${p.price}</p>
                    <button class="btn" id="add-to-cart" style="background: #000; color: #fff;">Add to Cart</button>
                    <button class="btn" id="back-catalog">Back to Catalog</button>
                </div>
            </div>
            </section>`;
            document.getElementById("add-to-cart").onclick = () => {
                state.cart.push(p);
                alert(p.title + " added to cart!");
            }
            document.getElementById("back-catalog").onclick = () => {
                router.navigate("store");
            }
        } else if (page === "cart") {
            const total = state.cart.reduce((sum, item) => sum + item.price, 0);
            mainContainer.innerHTML = `
                <section class="content-section">
                    <h2>Your Cart</h2>
                    ${state.cart.length === 0 ? "<p>Your cart is empty</p>" : state.cart.map(item => `<div>${item.title} - $${item.price}</div>`).join('')}
                    <h3>Total: $${total}</h3>
                    <button class="btn" id="checkout">Checkout</button>
                    <button class="btn" id="back-to-store">Continue Shopping</button>
                </section>`;

                document.getElementById("back-to-store").onclick = () => {
                    router.navigate("store");
                }

                document.getElementById("checkout").onclick = () => {
                    alert("Order placed")
                }

        } else if (page === "about") {
            mainContainer.innerHTML = `
                <section class="content-section">
                    <h2>About Us</h2>
                    <p>At our store, we are passionate about bringing you the best of Apple technology. We specialize in offering a wide range of premium devices, from the latest iPhone models to powerful MacBooks, iPads, Apple Watches, and accessories-all carefully selected to meet the highest standards of quality and performance.
                       Our mission is simple: to provide customers with authentic Apple products, expert guidance, and a seamless shopping experience. Whether you're upgrading your everyday tech, enhancing your workspace, or choosing your first Apple device, our team is here to help you find the perfect solution tailored to your needs.
                       We believe technology should be intuitive, reliable, and inspiring. Thats why we focus not only on what we sell, but also on how we support our customers-offering professional advice, transparent service, and ongoing assistance even after your purchase. 
                       Join us and experience the innovation, design, and ecosystem that make Apple products truly exceptional.</p>
                </section>`;
        } else if (page === "contact") {
            mainContainer.innerHTML = `
                <section class="context-section" style="text-align: center;">
                    <h2>Contact Us</h2>
                    <div style = "max-width: 500px; margin: 0 auto; background: #fff; padding: 40px; border: 1px solid #888; border-radius: 8px;">
                    <form id="contact-form" style="display: flex; flex-direction: column; gap: 15px; text-align: left;">
                       <div style="display: flex; flex-direction: column; gap: 5px;">
                            <label style="font-weight: bold;">Full Name</label>
                            <input type="text" id="c-name" placeholder="Enter your name" required
                            style="width: 100%; padding: 12px; border: 1px solid #888; border-radius: 4px;>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <label style="font-weight: bold;">Email</label>
                            <input type="email" id="c-email" placeholder="Your email" required
                            style="width: 100%; padding: 12px; border: 1px solid #888; border-radius: 4px;>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <label style="font-weight: bold";>Your message</label>
                            <textarea id="c-msg" placeholder="How we can help you?" required
                            style="width: 100%; padding: 12px; border: 1px solid #888; border-radius: 4px; min-height: 120px; resize: vertical;"></textarea>
                        </div>
                        <button class="btn" type="submit" style="width: 100%; margin-top: 10px; background: #000; color: #fff; padding: 15px; font-size: 1.1rem;">Send message</button>
                    </form>
                </section>`;
        } else if (page === "login") {
            mainContainer.innerHTML = `
                <section class="content-section" style="text-align: center;">
                    <h2>Login to your account</h2>
                    <div style="max-width: 400px; margin: 0 auto; background: #fff; padding: 40px; border: 1px solid #888; border-radius: 8px;">
                        <form id="login-form" style="display: flex; flex-direction: column; gap: 15px; text-align: left;">
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <label style="font-weight: bold;">Email</label>
                                <input type="email" id="l-email" placeholder="Your email" required
                                style="width: 100%; padding: 12px; border: 1px solid #888; border-radius: 4px;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <label style="font-weight: bold;">Password</label>
                                <input type="password" id="l-pass" placeholder="Your password" required
                                style="width: 100%; padding: 12px; border: 1px solid #888; border-radius: 4px;">
                            </div>
                            <button class="btn" type="submit" style="width: 100%; margin-top: 10px; background: #000; color: #fff; padding: 15px; font-size: 1.1rem;">Sign In</button>
                            <p style="text-align: left; width: 100%; margin-top: -30px;"><a href="#" data-page="register" id="register-link">Don't have an account?</a></p>
                        </form>
                    </div>
                </section>`;

                Navigation();

                document.getElementById("register-link").onclick = (e) => {
                    e.preventDefault();
                    router.navigate("register");
                }
        } else if (page === "register") {
            mainContainer.innerHTML = `
                <section class="content-section" style="text-align: center;">
                    <h2>Register for an account</h2>
                    <div style="max-width: 400px; margin: 0 auto; background: #fff; padding: 40px; border: 1px solid #888; border-radius: 8px;">
                        <form id="register-form" style="display: flex; flex-direction: column; gap: 15px; text-align: left;">
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <label style="font-weight: bold;">Email</label>
                                <input type="email" id="l-email" placeholder="Your email" required
                                style="width: 100%; padding: 12px; border: 1px solid #888; border-radius: 4px;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <label style="font-weight: bold;">Password</label>
                                <input type="password" id="l-pass" placeholder="Your password" required
                                style="width: 100%; padding: 12px; border: 1px solid #888; border-radius: 4px;">
                            </div>
                            <button class="btn" type="submit" style="width: 100%; margin-top: 10px; background: #000; color: #fff; padding: 15px; font-size: 1.1rem;">Register</button>
                        </form>
                    </div>
                </section>`;
        }
                
        const contactForm = document.getElementById("contact-form")
        if (contactForm){
            contactForm.onsubmit = (e) => {
                e.preventDefault();

                const formData = {
                    name: document.getElementById("c-name").value,
                    email: document.getElementById("c-email").value,
                    message: document.getElementById("c-msg").value,
                    date: new Date().toLocaleString()
                };

                alert("Message sent!")
                state.updateState("lastMessageSent", formData)
                router.navigate("home");

            }
        }
        }

window.addEventListener("stateUpdated", render);
router.init();
render();

function Navigation() {
    const navLinks = document.querySelectorAll('nav a, footer a, .user-actions a');
    navLinks.forEach(link => {
        link.onclick = (e) => {
            const page = link.getAttribute('data-page');
            if (page) {
                e.preventDefault();
                router.navigate(page);
            }
        }
    })
}

async function initApp() {
    const catalogContainer = document.querySelector('main');
    catalogContainer.innerHTML= `
    <div class="loading-products">
        <div class="spinner"></div>
        <p>Loading products...</p>
        </div>`;

    try{
        const products = await getProducts();
        state.updateState("products", products);
    }
    catch(error) {
        console.error("Failed to load products: ", error);
        catalogContainer.innerHTML = `
        <div class="error-message">
        <h2>Failed to load products</h2>
        <p>Error: ${error.message}</p>
        <button class="btn" id="tryagain-button">Try again</button>
        </div>`;

        document.getElementById("tryagain-button").onclick = () => {
            location.reload();
        }
    }
}

initApp();
Navigation();