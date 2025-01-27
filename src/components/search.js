import { searchInp } from "./header";

function createSearch() {

  const cardTitles = Array.from(document.querySelectorAll(".product__title"));

  searchInp.oninput = hideNotSearcedCards;

   function showAllCards() {
    cardTitles.forEach(div => {
      const card = div.parentElement;
      card.style.display = 'block';
    });
  }

  function hideNotSearcedCards() {
    const searchedValue = searchInp.value.trim().toLowerCase();
    if (searchedValue === 0) return;
    showAllCards();

    cardTitles.forEach(titleDiv => {
      const card = titleDiv.parentElement;
      const titleName = titleDiv.innerHTML.toLowerCase();
      const indexes = titleName.search(searchedValue);
      if (indexes === -1) {
        card.style.display = 'none';
      }
    });
  }
}
export default createSearch;