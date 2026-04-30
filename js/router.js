import state from "./state.js";

const routes = {
    "home": "Home",
    "store": "Store",
    "details": "Product Details",
    "cart": "Cart",
    "about": "About Us",
    "contact": "Contact Us",
    "login": "Login",
    "register": "Register"
};

const router = {
    init() {
        window.addEventListener("popstate", (e) => {
            const page = e.state?.page || 'home';
            state.updateState("currentPage", page);
        });
    }, 

    navigate(page, params = null) {
        if (params && params.id) {
            state.updateState("selectedProduct", params.id);
        }
        window.history.pushState({ page }, routes[page], "#" + page);
        state.updateState("currentPage", page);
    }
};

export default router;