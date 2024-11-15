import createHeader from "./components/header";
import createCarousel from "./components/carousel";
import addCards from "./components/cards";
import createSearch from "./components/search";



document.addEventListener("DOMContentLoaded", function createApp(){
    createHeader();
    createCarousel();
    addCards();
    createSearch();
})
