import { basketBtn } from "./header";

const btn = basketBtn;

const CartState = {
  productsInTheCart: [],
  counters: [],
  totalCost: 0,
  totalItems: 0,
};

btn.setAttribute("data-product-count", "0");

//функция принимает элемент и набор классов, и добавляет эти классы к элементу
function addClass(element, ...elemClasses) {
  elemClasses.forEach((elemClass) => element.classList.add(elemClass));
}

const containerModalWindow = document.createElement("div");
containerModalWindow.classList.add("basket__modal");
root.append(containerModalWindow);
const modalWindow = document.createElement("div");
modalWindow.classList.add("basket__modal-container");
containerModalWindow.append(modalWindow);
const closeBtn = document.createElement("button");
closeBtn.classList.add("products__btn--closemodal");
modalWindow.append(closeBtn);

const content = document.createElement("div");
content.setAttribute("id", "basket__modal-content");
modalWindow.appendChild(content);

btn.addEventListener("click", function () {
  containerModalWindow.style.display = "block";
  modalWindow.style.display = "block";
});

closeBtn.addEventListener("click", function () {
  modalWindow.style.display = "none";
  containerModalWindow.style.display = "none";
  var cont = containerModalWindow.querySelector("#basket__modal-content");
  if (cont) {
    for (const child of cont.querySelectorAll(".basket__main-container")) {
      cont.removeChild(child);
    }
  }
});

const ItemContainer = document.getElementById("basket__modal-content");

btn.addEventListener("click", function createItem() {
  if (CartState.productsInTheCart.length === 0) {
    updateTotalCost()
    const wrapBasket = document.createElement("div");
    addClass(wrapBasket, "basket__wrap");
    wrapBasket.style.display = "flex";
    const emptyBasket = document.createElement("div");
    addClass(emptyBasket, "basket__empty-basket");
    emptyBasket.textContent = "Корзина пуста";
    emptyBasket.style.display = "block";
    modalWindow.appendChild(wrapBasket);
    wrapBasket.appendChild(emptyBasket);
  }
  CartState.productsInTheCart.forEach((item, idx) => {
    const wrapBasket = document.querySelector(".basket__wrap");
    wrapBasket.style.display = "none";
    const emptyBasket = document.querySelector(".basket__empty-basket");
    emptyBasket.style.display = "none";
    let itemId = item.id;
    const containerForBasket = document.createElement("div");
    addClass(containerForBasket, "basket__main-container");
    const containerImg = document.createElement("div");
    addClass(containerImg, "basket__img-wrapper");
    const imageElement = document.createElement("img");
    addClass(imageElement, "basket__modal-img");
    imageElement.src = item.images;
    containerImg.appendChild(imageElement);
    const containerInfo = document.createElement("div");
    addClass(containerInfo, "basket__modal-description");
    const nameElement = document.createElement("h3");
    addClass(nameElement, "basket__modal-title");
    nameElement.textContent = item.title;
    const priceElement = document.createElement("p");
    addClass(priceElement, "basket__modal-price");
    priceElement.textContent = item.price + " p.";
    const buyButton = document.createElement("button");
    buyButton.classList.add("basket__btn-buy");
    buyButton.textContent = "Купить";
    //создаем контейнер для счетчика
    const counterContainer = document.createElement("div");
    addClass(counterContainer, "counter");
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("basket__btn-delete");
    containerInfo.appendChild(nameElement);
    containerInfo.appendChild(priceElement);
    containerInfo.appendChild(buyButton);
    containerInfo.appendChild(counterContainer);
    containerInfo.appendChild(deleteButton);

    //кнопка для увеличения
    const buttonCounterOne = document.createElement("button");
    buttonCounterOne.classList.add("button-count-plus");
    buttonCounterOne.textContent = "+";

    //элемент для отображения текущего количества
    const count = document.createElement("input");
    count.classList.add("button-count-number");
    count.type = "number";
    count.value = CartState.counters[idx]; //начальное значение
    count.min = "1"; //минимальное значение (можно изменить по умолчанию)

    //кнопка для уменьшения
    const buttonCounterTwo = document.createElement("button");
    buttonCounterTwo.classList.add("button-count-minus");
    buttonCounterTwo.textContent = "-";

    // Добавление кнопок и счетчика в контейнер
    counterContainer.appendChild(buttonCounterTwo);
    counterContainer.appendChild(count);
    counterContainer.appendChild(buttonCounterOne);

    // Функция обновления цены
    function updatePrice() {
      const quantity = parseInt(count.value) || 0;
      const totalPrice = item.price * quantity;
      priceElement.textContent = totalPrice + " p.";
    }
    // Функция обновления состояния кнопки
    const updateButtonState = () => {
      const currentCount = parseInt(count.value) || 0;
      buttonCounterTwo.disabled = currentCount <= 1;
      buttonCounterTwo.style.opacity = currentCount <= 1 ? "0.5" : "1";
    };
    // Обработчик нажатия на кнопку увеличения количества
    buttonCounterOne.addEventListener("click", () => {
      const index = CartState.productsInTheCart.findIndex(
        (item) => item.id === itemId
      );
      count.value = parseInt(count.value) + 1;
      CartState.counters[index]++; // Обновляем счетчик
      CartState.totalItems++;
      CartState.totalCost += Number(item.price);
      btn.setAttribute("data-product-count", CartState.totalItems);
      updatePrice();
      updateButtonState();
      updateTotalCost();
    });
    // Обработчик нажатия на кнопку уменьшения количества
    buttonCounterTwo.addEventListener("click", () => {
      const index = CartState.productsInTheCart.findIndex(
        (item) => item.id === itemId
      );
      if (parseInt(count.value) > 1) {
        count.value = parseInt(count.value) - 1;
        CartState.counters[index]--; // Обновляем счетчик
        CartState.totalItems--;
        CartState.totalCost -= Number(item.price);
        btn.setAttribute("data-product-count", CartState.totalItems);
        updatePrice();
        updateButtonState();
        updateTotalCost();
      }
    });

    // Обработчик нажатия на кнопку удаления товара
    deleteButton.addEventListener("click", function () {
      const quantityToRemove = parseInt(count.value) || 1; // Получаем количество товаров для удаления
      removeItem(itemId, quantityToRemove); // Вызываем функцию удаления
      containerForBasket.remove(); // Удаляем визуальный элемент
    });

    // Функция удаления товара
    function removeItem(itemId, quantityToRemove) {
      const indexToRemove = CartState.productsInTheCart.findIndex(
        (item) => item.id === itemId
      );
      // Проверяем, существует ли товар в корзине
      if (indexToRemove !== -1) {
        const itemToRemove = CartState.productsInTheCart[indexToRemove];
        CartState.counters[indexToRemove] -= quantityToRemove;
        if (CartState.counters[indexToRemove] <= 0) {
          CartState.totalCost -= itemToRemove.price * quantityToRemove; // Уменьшаем общую стоимость (если удаляем все)
          CartState.productsInTheCart.splice(indexToRemove, 1); // Удаляем товар из корзины (если удаляем все)
          CartState.counters.splice(indexToRemove, 1);
        } else {
          CartState.totalCost -= quantityToRemove * itemToRemove.price; // Уменьшаем общую стоимость
        }

        CartState.totalItems -= quantityToRemove; // Уменьшаем общее количество товаров в корзине
        CartState.totalItems = Math.max(CartState.totalItems, 0); // Не позволяем отрицательные значения
        // Устанавливаем общую стоимость в ноль, если общее количество товаров стало равным нулю
        if (CartState.totalItems === 0) {
          CartState.totalCost = 0;
        }
        updateTotalCost(); // Обновляем отображение общей стоимости
        updateBasketButton(); // Вызываем, чтобы обновить кнопки
        updatePrice(); // Обновляем цену элемента

        // Обновляем стоимость товара в визуальной корзине
        const itemElement = document.getElementById(itemId);
        if (itemElement) {
          const priceElement = itemElement.querySelector(
            ".basket__modal-price"
          );
          const quantity = itemToRemove.quantity;

          if (quantity > 0) {
            priceElement.textContent = (quantity * price).toFixed(2) + " p."; // Обновляем цену товара
          } else {
            itemElement.remove(); // Удаляем элемент из визуальной корзины, если количество 0
          }
        }
        // Проверяем, остались ли товары в корзине
        if (CartState.productsInTheCart.length === 0) {
          wrapBasket.style.display = "flex";
          emptyBasket.style.display = "block";
          // Устанавливаем таймер для закрытия модального окна через 4 секунды
          setTimeout(() => {
            containerModalWindow.style.display = "none";
          }, 4000);
        } else {
          showPopupMessage("Товары удалены из корзины");
        }
      }
    }

    // Обработчик нажатия на кнопку "Купить"
    buyButton.addEventListener("click", function () {
      const currentQuantity = parseInt(count.value);

      if (currentQuantity > 0) {
        // Уменьшаем общее количество и стоимость на количество выбранного товара
        CartState.totalItems -= currentQuantity;
        CartState.totalCost -= currentQuantity * item.price;
        updateTotalCost();
        updateBasketButton(CartState.totalItems); // Вызываем, чтобы обновить кнопку
        const indexToRemove = CartState.productsInTheCart.findIndex(
          // Удаляем товар из корзины
          (product) => product.id === itemId
        );
        if (indexToRemove !== -1) {
          CartState.productsInTheCart.splice(indexToRemove, 1);
        }
        // Удаляем товар из визуальной корзины
        containerForBasket.remove();
        showPopupMessage("Ваш товар заказан");
        if (CartState.productsInTheCart.length === 0) {
          // Проверяем остались ли товары в корзине
          // Устанавливаем таймер для закрытия модального окна через 4 секунды после отображения сообщения
          setTimeout(() => {
            containerModalWindow.style.display = "none";
          }, 4000);
        }
      }
    });

    function showPopupMessage(message) {
      const containerModalWindow = document.querySelector(".basket__modal");
      // Создаем элемент для всплывающего сообщения
      const popupMessage = document.createElement("div");
      popupMessage.classList.add("basket__popup-message");
      popupMessage.textContent = message;

      // Добавляем сообщение в модальное окно
      containerModalWindow.appendChild(popupMessage);

      // Устанавливаем таймер для автоматического удаления сообщения через 3 секунды
      setTimeout(() => {
        popupMessage.remove();
      }, 3000);
    }
    containerForBasket.appendChild(containerImg);
    containerForBasket.appendChild(containerInfo);
    ItemContainer.appendChild(containerForBasket);
    updateTotalCost();
  });

});

let totalCostElement = document.querySelector(".basket__result");
if (!totalCostElement) {
  totalCostElement = document.createElement("div");
  totalCostElement.classList.add("basket__result");
  ItemContainer.appendChild(totalCostElement);
}
// Функция обновления общей стоимости
function updateTotalCost() {
  totalCostElement.textContent =
    "К оформлению " +
    CartState.totalItems +
    "шт., " +
    CartState.totalCost +
    " р.";
}

// Функция обновления кнопки корзины
function updateBasketButton() {
  btn.classList.add("basket-btn");
  btn.setAttribute("data-product-count", CartState.totalItems.toString()); // Обновляем количество товаров
}

export { updateTotalCost, CartState, OpenBasket };
