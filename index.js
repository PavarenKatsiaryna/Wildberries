import createHeader from "./src/components/header";
import createCarousel from "./src/components/carousel";
import addCards from "./src/components/cards";
import createSearch from "./src/components/search";



document.addEventListener("DOMContentLoaded", function createApp(){
    createHeader();
    createCarousel();
    addCards();
    createSearch();
})
