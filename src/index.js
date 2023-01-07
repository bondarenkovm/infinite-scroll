import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchPixabay } from './fetchPixabayAPI';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
let value = '';
let page = 1;

var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: `alt`,
  captionDelay: 250,
});

const options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
const observer = new IntersectionObserver(onInfinityload, options);

form.addEventListener('submit', onSubmitForm);

function onSubmitForm(evt) {
  evt.preventDefault();
  value = evt.currentTarget.elements.searchQuery.value.trim();
  if (!value) {
    // clearGallery();
    Notify.failure('Enter data to search!');
    return;
  }

  clearGallery();
  //   const { hits, totalHits } = await fetchPixabay(value, page);
  //   //   console.log(hits);
  //   renderMarkup(hits, totalHits);
  renderGallery(value, page);
}

function onInfinityload(entries) {
  //   console.log(entries);

  if (entries[0].isIntersecting) {
    // const { hits, totalHits } = await fetchPixabay(value, page);
    // renderMarkup(hits, totalHits);
    renderGallery(value, page);

    // observer.observe(gallery.lastElementChild);
    // console.log(gallery.children.length);
    // console.log(totalHits);

    // if (gallery.children.length === totalHits) {
    //   observer.disconnect();
    //   //   observer.unobserve(gallery.lastElementChild);
    //   Notify.failure(
    //     "We're sorry, but you've reached the end of search results."
    //   );
    //   return;
    // }
  }
}
async function renderGallery(value, page) {
  const { hits, totalHits } = await fetchPixabay(value, page);

  if (page === 1 && hits.length) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
  if (!hits.length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    // return;
  }

  renderMarkup(hits, totalHits);
  observer.observe(gallery.lastElementChild);

  //   console.log(gallery.children.length);
  //   console.log(totalHits);

  if (gallery.children.length >= totalHits) {
    observer.disconnect();
    //   observer.unobserve(gallery.lastElementChild);
    setTimeout(() => {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }, 1000);
    // return;
  }

  lightbox.refresh();
  smoothScroll();
}

function renderMarkup(hits, totalHits) {
  //   if (page === 1 && hits.length) {
  //     Notify.success(`Hooray! We found ${totalHits} images.`);
  //   }
  //   if (!hits.length) {
  //     Notify.failure(
  //       'Sorry, there are no images matching your search query. Please try again.'
  //     );
  //     return;
  //   }

  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <div class="wraper">
      <a href="${largeImageURL}">
        <img class="card-image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
      </a></div>
      <div class="info">
        <p class="info-item"><b>Likes: </b>${likes}</p>
        <p class="info-item"><b>Views: </b>${views}</p>
        <p class="info-item"><b>Comments: </b>${comments}</p>
        <p class="info-item"><b>Downloads: </b>${downloads}</p>
      </div>
    </div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  page += 1;
  //   observer.observe(gallery.lastElementChild);
  //   lightbox.refresh();
  //   smoothScroll();
}

function clearGallery() {
  gallery.innerHTML = '';
  page = 1;
}

function smoothScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 0.2,
    behavior: 'smooth',
  });
}
