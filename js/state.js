const state = {
    currentPage: 'home',
    products: [],
    cart: [],
    selectedProduct: null,
    updateState(key, value) {
        this[key] = value;
        console.log("State update " + key + ": " + value);
        window.dispatchEvent(new CustomEvent("stateUpdated"));
    }
}

export default state;