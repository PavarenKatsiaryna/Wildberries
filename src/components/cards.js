import { basketBtn } from "./header";
import { updateTotalCost, CartState } from "./basket";

function addCards() {
  const body = document.querySelector("body");
  const root = document.getElementById("root");
  
  basketBtn.setAttribute("data-product-count", "0");

  //функция принимает элемент и набор классов, и добавляет эти классы к элементу
  function addClass(element, ...elemClasses) {
    elemClasses.forEach((elemClass) => element.classList.add(elemClass));
  }
  // Создание секции для продуктов
  const section = document.createElement("section");
  addClass(section, "products");
  root.appendChild(section);
  //Создание контейнера
  const container = document.createElement("div");
  addClass(container, "container");
  section.appendChild(container);
  const sectionTitle = document.createElement("h2");
  addClass(sectionTitle, "products__title");
  sectionTitle.textContent = "Хиты продаж";
  container.appendChild(sectionTitle);
  //Создание модального окна
  const modalData = createModal();
  section.appendChild(modalData.modal);
  //Создание контейнера для карточек продуктов
  const cardsContainer = document.createElement("div");
  addClass(cardsContainer, "products__container");
  container.appendChild(cardsContainer);
  //Рендеринг карточек продуктов
  if (!localStorage.getItem("Products")) {
    fetchDataAndRenderCards();
  } else {
    renderCardsFromLocalStorage();
  }
  //асинхронная функция для получения данных о товарах с API
  function fetchDataAndRenderCards() {
    //метод fetch для выполнения HTTP-запроса на указанный URL, чтобы получить список продуктов
    fetch("https://api.escuelajs.co/api/v1/products")
      //обработка ответа в формате json
      .then((response) => response.json())
      //получаем массив товаров
      .then((products) => {
        //методом slice берем только первые 25 товаров из полученного списка
        products = products.slice(0, 25);
        //в цикле происходит модификация каждого продукта, где добавляются новые свойства
        products.forEach((product) => {
          product.discount = Math.floor(Math.random() * 80) + 5;
          product.discount_price = Math.ceil(
            product.price - (product.price * product.discount) / 100
          );
          product.rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
          product.evaluation = Math.floor(
            Math.random() * (47000 - 5000) + 5000
          );
          product.article = Math.floor(10000000 + Math.random() * 90000000);
        });
        //сохранение данных в локальное хранилище в виде строки JSON,удобно для повторного переиспользования
        localStorage.setItem("Products", JSON.stringify(products));
        //отображение карточек на стр
        renderCards(products);
      })
      //обработка ошибок
      .catch((error) => {
        console.error("Ошибка при получении данных:", error);
      });
  }
  //получение данных из localStorage(извлечение строки, которая была
  //сохранена под ключом "Products" и преобразование ее обратно в объект JS(в массив объектов продуктов)
  function renderCardsFromLocalStorage() {
    const products = JSON.parse(localStorage.getItem("Products"));
    renderCards(products);
  }
  //вызов функции для рендеринга (берёт массив продуктов и отвечает за их отображение на странице)
  function renderCards(products) {
    products.forEach((product) => {
      const card = createCard(product);
      cardsContainer.appendChild(card);
    });
  }
  //функция для создания карточки продукта
  function createCard(product) {
    const card = document.createElement("div");
    addClass(card, "product__card");
    // Создаем основной контейнер для изображения продукта
    const imgWrapper = document.createElement("div");
    addClass(imgWrapper, "product__img-wrapper");
    const productImg = document.createElement("img");
    // Используем то же изображение
    productImg.src = `${product.images[0]}`;
    addClass(productImg, "product__img");

    const quickViewBtn = document.createElement("button");
    quickViewBtn.textContent = "Быстрый просмотр";
    addClass(quickViewBtn, "product__btn--quickview");

    const showQuickBtn = () => {
      quickViewBtn.classList.toggle("show");
    };

    productImg.addEventListener("mouseover", showQuickBtn);
    productImg.addEventListener("mouseleave", showQuickBtn);
    quickViewBtn.addEventListener("mouseenter", showQuickBtn);
    quickViewBtn.addEventListener("mouseleave", showQuickBtn);

    const productTitle = document.createElement("h2");
    productTitle.textContent =  `${product.title}`;
    productImg.alt = product.title;
    addClass(productTitle, "product__title");

    productTitle.append(name);

    const rating = document.createElement("div");
    addClass(rating, "product__rating");
    rating.textContent = product.rating;

    let evaluationCase;
    let evaluationLastSymbol = product.evaluation % 10;
    let evaluationLastTwoSymbols = product.evaluation % 100;
    //логика для определения формы слова "оценка"
    if (
      (evaluationLastTwoSymbols >= 11 && evaluationLastTwoSymbols <= 14) ||
      evaluationLastSymbol === 0 ||
      (evaluationLastSymbol >= 5 && evaluationLastSymbol <= 9)
    ) {
      evaluationCase = "оценок";
    } else if (evaluationLastSymbol == 1) {
      evaluationCase = "оценка";
    } else {
      evaluationCase = "оценки";
    }

    const evaluation = document.createElement("div");
    addClass(evaluation, "product__evaluation");
    evaluation.textContent = `${product.evaluation} ${evaluationCase}`;

    const review = document.createElement("div");
    addClass(review, "product__review");
    review.append(rating, evaluation);

    const price = document.createElement("div");
    price.textContent = `${product.price} р`;
    addClass(price, "product__price");

    const discountPrice = document.createElement("div");
    discountPrice.textContent = `${product.discount_price} p`;
    addClass(discountPrice, "product__discount-price");

    const discountSignature = document.createElement("p");
    addClass(discountSignature, "product__discount-signature");
    discountSignature.textContent = "с WB кошельком";

    const discount = document.createElement("span");
    discount.textContent = `-${product.discount}%`;
    addClass(discount, "product__discount");

    const addBtn = document.createElement("button");
    addClass(addBtn, "icon-cart", "add-to-cart");

    imgWrapper.append(productImg, quickViewBtn, discount);

    card.append(
      imgWrapper,
      discountPrice,
      price,
      discountSignature,
      productTitle,
      review,
      addBtn
    );

    addBtn.addEventListener("click", () => {
      const productCopy = Object.assign({}, product);
      const idx = CartState.productsInTheCart.findIndex((v) => v.id === product.id);
      if (idx !== -1) {
        CartState.counters[idx]++;
      } else {
        CartState.productsInTheCart.push(productCopy);
        CartState.counters.push(1);
      }
      CartState.totalCost += Number(productCopy.price);
      CartState.totalItems++;
      updateTotalCost();
      basketBtn.setAttribute("data-product-count", CartState.totalItems);

    });
    quickViewBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      body.style.overflow = "hidden";
      modalData.modal.style.display = "block";
      modalData.modalImg.src = product.images[0];
      modalData.modalTitle.textContent = `${product.category.name} / ${product.title}`;
      modalData.modalRating.textContent = product.rating;
      modalData.modalDiscountPrice.textContent = `${product.discount_price} p`;
      modalData.modalPrice.textContent = `${product.price} p`;
      modalData.modalArticle.textContent = `Арт: ${product.article}`;
      modalData.modalWbWallet.textContent = "с WB кошельком";
      modalData.modalEvaluation.textContent = `${product.evaluation} ${evaluationCase}`;
      modalData.modalPhotosItem.src = product.images[1];
      modalData.modalPhotosItemTwo.src = product.images[0];
      if (product.images[2]) {
        modalData.modalPhotosItemThree.src = product.images[2];
        modalData.modalPhotosItemThree.style.display = "block";
      } else {
        modalData.modalPhotosItemThree.src = "";
        modalData.modalPhotosItemThree.style.display = "none";
      }
    });

    return card; // Возвращаем элемент карточки
  }

  function createModalPhotosItem() {
    const modalPhotosItem = document.createElement("img");
    addClass(modalPhotosItem, "products__modal-photos--item");
    return modalPhotosItem;
  }

  function createModal() {
    const modal = document.createElement("div");
    addClass(modal, "products__modal");

    const modalContent = document.createElement("div");
    addClass(modalContent, "products__modal-content");
    modal.appendChild(modalContent);

    const modalCloseBtn = document.createElement("button");
    addClass(modalCloseBtn, "products__btn--closemodal");
    modalContent.appendChild(modalCloseBtn);

    const modalImgWrapper = document.createElement("div");
    addClass(modalImgWrapper, "products__img-wrapper");

    const modalImg = document.createElement("img");
    addClass(modalImg, "products__modal-img");
    modalImgWrapper.appendChild(modalImg);
    modalContent.appendChild(modalImgWrapper);

    const modalDescrip = document.createElement("div");
    addClass(modalDescrip, "products__modal-description");
    modalContent.appendChild(modalDescrip);

    const modalTitle = document.createElement("p");
    addClass(modalTitle, "products__modal-title");

    const modalReview = document.createElement("div");
    addClass(modalReview, "products__modal-review");

    const modalRating = document.createElement("span");
    addClass(modalRating, "products__modal-rating");

    const modalEvaluation = document.createElement("span");
    addClass(modalEvaluation, "products__modal-evaluation");

    const modalArticle = document.createElement("span");
    addClass(modalArticle, "products__modal-article");

    modalReview.append(modalRating, modalEvaluation, modalArticle);

    const modalDiscountPrice = document.createElement("div");
    addClass(modalDiscountPrice, "products__modal-discountprice");

    const modalPrice = document.createElement("div");
    addClass(modalPrice, "products__modal-price");

    const modalWbWallet = document.createElement("p");
    addClass(modalWbWallet, "products__modal-wbwallet");

    const modalQuickView = document.createElement("div");
    addClass(modalQuickView, "products__modal-quickview");

    const modalPhotos = document.createElement("div");
    addClass(modalPhotos, "products__modal-photos");

    const modalPhotosItem = createModalPhotosItem();
    const modalPhotosItemTwo = createModalPhotosItem();
    const modalPhotosItemThree = createModalPhotosItem();

    modalPhotos.append(
      modalPhotosItem,
      modalPhotosItemTwo,
      modalPhotosItemThree
    );
    modalQuickView.append(modalPhotos);

    modalDescrip.append(
      modalTitle,
      modalReview,
      modalDiscountPrice,
      modalPrice,
      modalWbWallet,
      modalQuickView
    );
    modalImgWrapper.addEventListener("mousemove", (event) => {
      const rect = modalImgWrapper.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      modalImg.style.transformOrigin = `${x}px ${y}px`;
      modalImg.style.transform = "scale(1.7)";
    });
    modalImgWrapper.addEventListener("mouseleave", () => {
      modalImg.style.transformOrigin = "center";
      modalImg.style.transform = "scale(1)";
    });

    modalPhotos.addEventListener("click", function (e) {
      if (e.target.matches(".products__modal-photos--item")) {
        const src = e.target.src;
        modalData.modalImg.src = src;
      }
    });

    modal.addEventListener("click", function (event) {
      if (event.target.classList.contains("products__btn--closemodal")) {
        modal.style.display = "none";
        body.style.overflow = "visible";
        modalPhotosItem.classList.remove("active");
      }
    });

    window.addEventListener("click", function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
        body.style.overflow = "visible";
      }
    });

    return {
      modal,
      modalImg,
      modalTitle,
      modalRating,
      modalDiscountPrice,
      modalPrice,
      modalArticle,
      modalEvaluation,
      modalWbWallet,
      modalQuickView,
      modalPhotos,
      modalPhotosItem,
      modalPhotosItemTwo,
      modalPhotosItemThree,
    };
  }
}
export default addCards;