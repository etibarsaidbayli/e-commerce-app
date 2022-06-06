const productsContainer = document.getElementById("productsContainer");
const loadMoreButton = document.getElementById("loadMoreButton");
const searchInput = document.getElementById("searchInput");
const basketBtn = document.getElementById("basketBtn");
let basketSpan = document.getElementById("basketSpan");
let modalBasket = document.getElementById("modal-basket");
const closerBasketModal = document.getElementById("closerBasketModal");
const afterFlex = document.getElementById("afterFlex");
const LIMIT = 8;
let total = 0;
let currentSkip = 0;
// basketSpan.textContent
fetchProductList(currentSkip);

loadMoreButton.addEventListener("click", () => {
  currentSkip += LIMIT;
  if (currentSkip >= total) {
    loadMoreButton.hidden = true;
  } else {
    fetchProductList(currentSkip);
  }
});

const debouncedSearch = _.debounce(handleSearch, 500);

searchInput.addEventListener("input", debouncedSearch);

function handleSearch() {
  currentSkip = 0;
  fetchProductList(currentSkip, searchInput.value);
  productsContainer.innerHTML = "";
}

basketBtn.addEventListener("click", getShowBasket);
closerBasketModal.addEventListener("click", getCloserBasket);

function getShowBasket() {
  modalBasket.classList.remove("translate-x-full");
  modalBasket.classList.add("translate-x-0");
}

function getCloserBasket() {
  modalBasket.classList.remove("translate-x-0");
  modalBasket.classList.add("translate-x-full");
}

function disableButton() {
  loadMoreButton.disabled = true;
  loadMoreButton.textContent = "Loading...";
}

function enableButton() {
  loadMoreButton.disabled = false;
  loadMoreButton.textContent = "Load more";
}

function fetchProductList(skip, q = "") {
  disableButton();
  fetch(
    `https://dummyjson.com/products/search?limit=${LIMIT}&skip=${skip}&q=${q}`
  )
    .then((res) => res.json())
    .then((data) => {
      total = data.total;
      let html = "";
      for (let product of data.products) {
        html += getProductHTML(product);
      }
      productsContainer.insertAdjacentHTML("beforeend", html);
    })
    .finally(() => {
      enableButton();
      searchInput.value=""
    });
}

function getProductHTML({ title, price, thumbnail }) {
  return `
    <div
      class="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden"
    >
      <div
        class="flex items-end justify-end h-56 w-full bg-cover"
        style="background-image: url('${thumbnail}');"
      >
        <button
          data-title="${title}"
          data-price="${price}"
          data-thumbnail="${thumbnail}"
          class="basket-plusBtn p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
        >
          <svg
            class="basket-plusSvg h-5 w-5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
        </button>
      </div>
      <div class="px-5 py-3">
        <h3 class="text-gray-700 uppercase">${title}</h3>
        <span class="text-gray-500 mt-2">$${price}</span>
      </div>
    </div>
  `;
}

productsContainer.addEventListener("click", addProductToBasket);

function addProductToBasket(event) {
  let downList = [];
  if (event.target.matches(".basket-plusSvg") || event.target.matches('.basket-plusBtn')) {
    if (event.target.tagName === "svg") {
      const button = event.target.parentElement;
      const { price, thumbnail, title } = button.dataset;
      basketSpan.classList.remove('basket-nonActive')
      basketSpan.textContent++
      
      afterFlex.insertAdjacentHTML(
        "afterend",
        `<div class="myFlex flex justify-between mt-6">
      <div class="flex">
        <img
          class="h-20 w-20 object-cover rounded"
          src="${thumbnail}"
          alt=""  
        />
        <div class="mx-3">
          <h3 class="text-sm text-gray-600">${title}</h3>
          <div class="flex items-center mt-2">
            <button
              class="text-gray-500 focus:outline-none focus:text-gray-600"
            >
              <svg
            
                id="plusSpan"
                class="h-5 w-5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </button>
            <span id="countSpan" class="text-gray-700 mx-2"></span>
            <button
              class="text-gray-500 focus:outline-none focus:text-gray-600"
            >
              <svg
                id="minusSpan"
                class="h-5 w-5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <span id="priceSpan" class="text-gray-600">${price}</span><span>$</span>
    </div>`
        
      );
      
      // let flexs=document.querySelectorAll('.myFlex')
      // // // downList.push(flexs)
      // // let incFlex=flexs.childNode()
      // // console.log(inflex)
      
      // // let nodes=flexs.childNodes;

      // // console.log(nodes)
        let countSpan = document.getElementById("countSpan")
        let minusSpan=document.getElementById("minusSpan")
        let plusSpan=document.getElementById("plusSpan")
        let priceSpan=document.getElementById("priceSpan")
        
        minusSpan.onclick=function () {
          const oldPrice=`${price}`
          countSpan.textContent--
          if(countSpan.textContent<=0) {
            countSpan.closest('.myFlex').remove()

          }
          priceSpan.textContent=priceSpan.textContent-oldPrice;
          basketSpan.textContent--
          if(basketSpan.textContent<=0) {
            basketSpan.textContent=""
            basketSpan.classList.add('basket-nonActive')
          }
        }

        plusSpan.onclick=function () {
          const oldPrice=Number(`${price}`)
          countSpan.textContent++
          priceSpan.textContent=Number(priceSpan.textContent)+oldPrice
  
        }
        countSpan.textContent++
       

    
   
    }
      
  } 


}
