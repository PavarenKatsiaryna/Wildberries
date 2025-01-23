function createCarousel() {
  const root = document.getElementById("root");

  const carouselContainer = document.createElement("section");
  carouselContainer.classList.add("carousel-container");
  root.append(carouselContainer);

  const leftCarouselBtn = document.createElement("button");
  leftCarouselBtn.classList.add("carousel-btn", "left");
  const leftArrowImg = document.createElement("img");
  leftCarouselBtn.appendChild(leftArrowImg);
  carouselContainer.append(leftCarouselBtn);

  const carousel = document.createElement("div");
  carousel.classList.add("carousel");
  carouselContainer.append(carousel);

  const carouselLine = document.createElement("div");
  carouselLine.classList.add("carousel-line");
  carousel.append(carouselLine);

  const rightCarouselBtn = document.createElement("button");
  rightCarouselBtn.classList.add("carousel-btn", "right");
  const rightArrowImg = document.createElement("img");
  rightCarouselBtn.appendChild(rightArrowImg);
  carouselContainer.append(rightCarouselBtn);

  fetch("https://67376867aafa2ef22233bb01.mockapi.io/el/carousel")
  .then((response) => {
    // Проверяем, успешен ли ответ (код состояния в диапазоне 200-299)
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    return response.json();
  })
  .then((json) => {
    localStorage.setItem("image", JSON.stringify(json));
    renderCarouselItem(); // Вызов функции рендеринга после получения данных
  })
  .catch((error) => {
    console.error("Ошибка при получении данных:", error);
  });

  const carouselArr = [];

  function renderCarouselItem() {
    const cardsArr = JSON.parse(localStorage.getItem("image"));

    if (cardsArr) {
      // Очистим carouselArr перед новым заполнением
      carouselArr.length = 0;

      cardsArr.forEach((element) => {
        const carouselItem = element.avatar;
        carouselArr.push(carouselItem);
      });

      carouselArr.forEach((element) => {
        const carouselImg = document.createElement("img");
        carouselImg.classList.add("carousel-img");
        carouselImg.src = element;
        carouselLine.append(carouselImg);
      });
      init(); // Вызов функции инициализации после рендеринга изображений
    }
  }

  let count = 0;
  let width;

  function init() {
    width = document.querySelector(".carousel").offsetWidth;
    carouselLine.style.width = width * carouselArr.length + "px"; // Устанавливаем нужную ширину
    const carouselImgs = document.querySelectorAll(".carousel-img");
    carouselImgs.forEach((img) => {
      img.style.width = width + "px";
      img.style.height = "auto";
    });
    rollCarousel(); // Функция смещения при пересчете (фишка!!!)
    updateIndicators(); // Обновляем индикаторы при инициализации
  }
  window.addEventListener("resize", init);

  // Обработчик нажатия кнопки "вправо"
  rightCarouselBtn.addEventListener("click", function () {
    count++;
    if (count >= carouselArr.length) {
      count = 0; // Вернуться к первой картинке, если достигли конца
    }
    rollCarousel();
    updateIndicators(); // Обновляем индикаторы
  });

  // Обработчик нажатия кнопки "влево"
  leftCarouselBtn.addEventListener("click", function () {
    count--;
    if (count < 0) {
      count = carouselArr.length - 1; // Вернуться к последней картинке, если достигли начала
    }
    rollCarousel();
    updateIndicators(); // Обновляем индикаторы
  });

  function rollCarousel() {
    carouselLine.style.transform = "translate(-" + count * width + "px)";
  }

  // Создаем список индикаторов
  const indicators = document.createElement("ol");
  indicators.classList.add("carousel-indicators");

  // Общее количество слайдов
  const totalSlides = 3;

  for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement("li");
    indicator.classList.add(`carousel-indicator-${i + 1}`); // Добавляем соответствующий класс
    indicator.dataset.index = i; // Сохраняем индекс индикатора для навигации
    if (i === 0) {
      // Устанавливаем активный класс для первого индикатора
      indicator.classList.add("active");
    }
    indicators.append(indicator); // Добавляем индикатор в список
  }
  carouselContainer.append(indicators); // Добавляем индикаторы в слайдер

  function updateIndicators() {
    const indicatorElements = indicators.querySelectorAll("li");

    // Удаляем активный класс у всех индикаторов
    indicatorElements.forEach((indicator) => {
      indicator.classList.remove("active");
    });

    // Устанавливаем активный класс для текущего индикатора
    indicatorElements[count].classList.add("active");
  }

  // Обработчик клика на индикаторах
  indicators.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
      count = parseInt(event.target.dataset.index);
      rollCarousel();
      updateIndicators();
    }
  });

 //Swipe 
  carousel.addEventListener("touchstart", handleTouchStart, false);
  carouselLine.addEventListener("touchmove", handleTouchMove, false);

  let axisX = 0;//хранения начального положения касания.

   function handleTouchStart(event) {
   const touches = event.touches[0];
   axisX = touches.clientX;
  }

  function handleTouchMove(event) {
   if (axisX == 0) {
   return false;
  }
  let moveX = event.touches[0].clientX;
  let xDiff = axisX - moveX;
  if (xDiff > 0) { 
  rightMove();// Функция, которая отвечает за движение вправо
  } else {
  leftMove();// Функция, которая отвечает за движение влево
 }
   axisX = 0;// Сброс
  }
}
export default createCarousel;
