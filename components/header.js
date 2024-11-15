const root = document.getElementById("root");
export const searchInp = document.createElement("input");
export const basketBtn = document.createElement("button");

function createHeader(){
    const header = document.createElement("header");
    header.classList.add("header");
    root.append(header);
    const headerContainer = document.createElement("div");
    headerContainer.classList.add("header-container");
    header.append(headerContainer);
    const headerIcon = document.getElementById("header-icon");
    headerContainer.append(headerIcon);
    searchInp.placeholder = "Найти на Wildberries"
    searchInp.classList.add("search-inp");
    headerContainer.append(searchInp);
    basketBtn.classList.add("basket-btn");
    basketBtn.textContent = "Корзина";
    headerContainer.append(basketBtn);
    const basketImg = document.getElementById("basket-img");
    basketBtn.append(basketImg);
}
export default createHeader;