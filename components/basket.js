import { basketBtn } from "./header";

function createBasket() {
    const containerModalWindow = document.createElement("div");
      containerModalWindow.classList.add("containerModalWindow");
      root.append(containerModalWindow);
      const modalWindow = document.createElement("div");
      modalWindow.classList.add("modalWindow");
      containerModalWindow.append(modalWindow);
      const closeBtn = document.createElement("button");
      closeBtn.classList.add("closeButton");
      closeBtn.textContent = "x";
      modalWindow.append(closeBtn);
    
      const content = document.createElement("div");
      content.setAttribute("id", "modal-content");
      modalWindow.appendChild(content);
    
      basketBtn.addEventListener("click", function () {
        containerModalWindow.style.display = "block";
        modalWindow.style.display = "block";
      });
      closeBtn.addEventListener("click", function () {
        modalWindow.style.display = "none";
        containerModalWindow.style.display = "none";
        productsInTheCart.splice(0, productsInTheCart.length);
      });
    
    
     const ItemContainer = document.getElementById("modal-content");
    
      let totalCost = 0;
      let totalItems = 0;
      basketBtn.addEventListener("click", function createItem(data) {
        productsInTheCart.forEach((item) => {
          let itemId = item.id;
    
          let containerForBasket = document.createElement("div");
          addClass(containerForBasket, "container-for-el-in-basket");
          const imageElement = document.createElement("img");
          addClass(imageElement, "img-for-modal-basket");
          imageElement.src = item.images;
          const nameElement = document.createElement("h3");
          addClass(nameElement, "name-el-basket");
          nameElement.textContent = item.title;
          const priceElement = document.createElement("p");
          addClass(priceElement, "price-el-basket");
          priceElement.textContent = item.price + " p.";
    
          const deleteButton = document.createElement("button");
          deleteButton.classList.add("deleteButton");
          deleteButton.textContent = "удалить из корзины";
    
          deleteButton.addEventListener("click", function (g) {
            containerForBasket.remove();
    
            const indexToRemove = productsInTheCart.findIndex(
              (item) => item.id === itemId
            );
            if (indexToRemove !== -1) {
              totalCost -= Number(item.price);
              totalItems--;
              updateTotalCost();
    
              productsInTheCart.splice(indexToRemove, 1);
            }
    
            console.log(productsInTheCart);
          });
    
          containerForBasket.appendChild(imageElement);
          containerForBasket.appendChild(nameElement);
          containerForBasket.appendChild(priceElement);
          containerForBasket.appendChild(deleteButton);
          ItemContainer.appendChild(containerForBasket);
    
          totalCost += Number(item.price);
          totalItems++;
          updateTotalCost();
        });
      });
    
      function removeItem(itemId) {
        const removedItem = productsInTheCart.find((item) => item.id === itemId);
        if (removedItem) {
          totalCost -= Number(removedItem.price);
          updateTotalCost();
          productsInTheCart = productsInTheCart.filter(
            (item) => item.id !== itemId
          );
          const itemElement = document.getElementById(itemId);
          if (itemElement) {
            itemElement.remove();
          }
        }
      }
      function updateTotalCost() {
        totalCostElement.textContent =
          "К оформлению " + totalItems + "шт., " + totalCost + " р.";
      }
      var totalCostElement = document.querySelector(".totalCostEl");
      if (!totalCostElement) {
        totalCostElement = document.createElement("div");
        totalCostElement.classList.add("totalCostEl");
        ItemContainer.appendChild(totalCostElement);
      }
      var totalItemsElement = document.querySelector(".totalItemsEl");
      if (!totalItemsElement) {
        totalItemsElement = document.createElement("div");
        totalItemsElement.classList.add("totalItemsEl");
        ItemContainer.appendChild(totalItemsElement);
      }
    
      updateTotalCost();
    };
