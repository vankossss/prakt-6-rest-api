const url = "https://dummyjson.com";

export async function getProducts() {
    try{
        const response = await fetch(`${url}/products/category/smartphones?limit=9`);
    
    if (!response.ok){
        throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.products;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}