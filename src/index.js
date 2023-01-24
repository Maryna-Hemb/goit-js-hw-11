import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css";
import { ApiService } from "./fetchImages";


const formEl = document.querySelector(".search-form");
const inputEl = document.querySelector("input")
const buttonEl = document.querySelector("button")
const galleryEl = document.querySelector(".gallery")
const guardEl = document.querySelector(".js-guard")

const newApiService = new ApiService();
let gallery1 = new SimpleLightbox(".photo-card a", { captionDelay: 250 });


inputEl.addEventListener("input", onInputValueNone);
formEl.addEventListener("submit", onGalleryMake);

async function onGalleryMake(evt) {
  evt.preventDefault();
  newApiService.resetPage();  
  newApiService.searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
   if(newApiService.searchQuery.length > 0) {
    try {
      const galleryMake = await newApiService.getImagesAPI();
      console.log(galleryMake);
      if (galleryMake.totalHits === 0) {
        inputEl.value = ""; galleryEl.innerHTML = "";
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
      }
      Notify.info(`Hooray! We found ${galleryMake.totalHits} images.`);
      galleryEl.innerHTML = createMarkupGallary(galleryMake);
      observer.observe(guardEl);
      gallery1.refresh();      
  } catch (error) {console.log(error)}
   }
 }

function createMarkupGallary(data) {
     return data.hits.map(({
         webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
       downloads     
    }) => 
        `<div class="photo-card">
        <a class="gallery__item" href="${largeImageURL}">
  <img src=${webformatURL} alt="${tags}" loading="lazy" />
   </a> 
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
 
</div>`).join('')
}    



// scroll
const options = {
    root: null,
    rootMargin: "400px",
    treshold: 0
}


function onload(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      try {
        console.log("hello")
        newApiService.incrementPage();
        const galleryMake = await newApiService.getImagesAPI(); 
        console.log(galleryMake);
        galleryEl.insertAdjacentHTML('beforeend', createMarkupGallary(galleryMake))
        const amount = newApiService.page* 40
        console.log(amount)
        if (amount >= galleryMake.totalHits) { observer.unobserve(guardEl); Notify.info("We're sorry, but you've reached the end of search results.")}
        onInputValueNone()  
         gallery1.refresh();
      } catch (error) {console.log(error)
      }      
    }
    
  })
}

let observer = new IntersectionObserver(onload, options);

function onInputValueNone() {
  if (inputEl.value.trim().length === 0) { galleryEl.innerHTML = ""}
}


// const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });






