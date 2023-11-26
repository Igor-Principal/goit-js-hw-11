import { fetchImg } from './JS/fetch-info';
import Notiflix from 'notiflix';
import lightbox from 'simplelightbox';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btn: document.querySelector('.more'),
};
const { form, gallery, btn } = refs;

let page = 0;
const perPage = 40;
let textFind = '';

const paramsNotif = {
  position: 'center-center',
  timeout: 4000,
  width: '400px',
  fontSize: '24px',
};

form.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  page += 1;
  gallery.innerHTML = '';

  textFind = evt.currentTarget.searchQuery.value
    .trim()
    .toLowerCase()
    .split(' ');
  if (textFind === '') {
    Notiflix.Notify.info('Enter your request, please!', paramsNotif);
    return;
  }

  fetchImg(page, textFind, perPage)
    .then(data => {
      const results = data.hits;
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          paramsNotif
        );
      } else {
        Notiflix.Notify.info(
          `Hooray! We found ${data.totalHits} images.`,
          paramsNotif
        );
        createMarkup(results);
        lightbox.refresh();
      }
      if (data.totalHits > perPage) {
        btn.classList.remove('is-hidden');
      }
    })
    .catch(onFetchError);

  btn.addEventListener('click', onClickLoadMore);

  evt.currentTarget.reset();
}

function onFetchError() {
  Notiflix.Notify.failure(
    'Oops! Something went wrong! Try reloading the page or make another choice!',
    paramsNotif
  );
}

function onClickLoadMore() {
  page += 1;
  fetchImg(page, textFind, perPage)
    .then(data => {
      const searchResults = data.hits;
      const numberOfPage = Math.ceil(data.totalHits / perPage);

      createMarkup(searchResults);
      if (page === numberOfPage) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results.",
          paramsNotif
        );
        btn.removeEventListener('click', onClickLoadMore);
      }
      lightbox.refresh();
    })
    .catch(onFetchError);
}

function createMarkup(searchResults) {
  const arrPhotos = searchResults.map(
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
        <div class="img_wrap">
            <a class="gallery_link" href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" width="300" loading="lazy" />
            </a>
        </div>
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
        </div>`;
    }
  );
  gallery.insertAdjacentHTML('beforeend', arrPhotos.join(''));
}
