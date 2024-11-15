function createCarousel(){
    const root = document.getElementById("root");

    const carouselContainer = document.createElement("div");
    carouselContainer.classList.add("carousel-container");
    root.append(carouselContainer);
    const leftCarouselBtn = document.createElement("button");
    leftCarouselBtn.classList.add("carousel-btn");
    leftCarouselBtn.textContent = "<";
    carouselContainer.append(leftCarouselBtn);
    const carousel = document.createElement("div");
    carousel.classList.add("carousel");
    carouselContainer.append(carousel);
    const carouselLine = document.createElement("div");
    carouselLine.classList.add("carousel-line");
    carousel.append(carouselLine);
    const rightCarouselBtn = document.createElement("button");
    rightCarouselBtn.classList.add("carousel-btn");
    rightCarouselBtn.textContent = ">";
    carouselContainer.append(rightCarouselBtn);

    fetch("https://67376867aafa2ef22233bb01.mockapi.io/el/carousel")
        .then(response => response.json())
        .then(json => localStorage.setItem("image", JSON.stringify(json)))

    const cardsArr = JSON.parse(localStorage.getItem("image"));
    const carouselArr = [];

    cardsArr.forEach(element => {
        const carouselItem = element.avatar;
        carouselArr.push(carouselItem);
    });

    function renderCarouselItem(){
        carouselArr.forEach(element => {
            const carouselImg = document.createElement("img");
            carouselImg.classList.add("carousel-img");
            carouselImg.src = element;
            carouselLine.append(carouselImg);
        })
    }
    renderCarouselItem()

    let offset = 0;

    function rightMove() {
        offset += 100;
        if(offset > 200){
            offset = 0;
        }
        carouselLine.style.left = -offset + "%";
    }

    function leftMove() {
        offset -= 100;
        if(offset < 0){
            offset = 200;
        }
        carouselLine.style.left = -offset + "%";
    }
    rightCarouselBtn.addEventListener("click", rightMove)
    leftCarouselBtn.addEventListener("click", leftMove)

    carousel.addEventListener("touchstart", handleTouchStart, false);
    carouselLine.addEventListener("touchmove", handleTouchMove, false);

    let axisX = 0;

    function handleTouchStart(event) {
        const touches = event.touches[0];
        axisX = touches.clientX;
    }

    function handleTouchMove(event) {
        if(axisX == 0){
            return false
        }
        let moveX = event.touches[0].clientX;
        let xDiff = axisX - moveX;
        if(xDiff > 0){
            rightMove()
        }else leftMove()
        axisX = 0;
    }
}
export default createCarousel;