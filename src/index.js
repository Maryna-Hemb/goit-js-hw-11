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
let gallery = new SimpleLightbox(".photo-card a", { captionDelay: 250 });

formEl.addEventListener("submit", onGalleryMake);

function onGalleryMake(evt) {
    evt.preventDefault();
    newApiService.searchQuery = evt.currentTarget.elements.searchQuery.value;
    
    newApiService.resetPage();
    newApiService.getImagesAPI()
        .then(data => {
            if (data.totalHits === 0) { inputEl.value = "";  return Notify.failure("Sorry, there are no images matching your search query. Please try again.") }
           console.log(data);
          Notify.info(`Hooray! We found ${data.totalHits} images.`)
            galleryEl.innerHTML = createMarkupGallary(data);
            observer.observe(guardEl);
            gallery.refresh();
        })
    .catch(err => console.log(err))
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
    rootMargin: "600px",
    treshold: 0
}

let observer = new IntersectionObserver(onload, options);

function onload(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log("hello")
            newApiService.incrementPage();
            newApiService.getImagesAPI()                
                .then(data => {
                    galleryEl.insertAdjacentHTML('beforeend', createMarkupGallary(data));
                                     
                })
            .catch(err => Notify.info("We're sorry, but you've reached the end of search results."))
        }
        
    })
    
}



// const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });






