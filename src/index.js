import { fetchImg } from './JS/fetch-info';
import Notiflix from 'notiflix';
import { lightbox } from './JS/lightbox';
import { createMarkup } from './JS/create-markup';

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
  position: 'top-right',
  timeout: 2000,
  width: '400px',
  fontSize: '24px',
};

form.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  page += 1;
  gallery.innerHTML = '';

  textFind = evt.currentTarget.searchQuery.value.trim().toLowerCase();
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
        gallery.innerHTML = createMarkup(results);
        lightbox.refresh();
      }
      if (data.totalHits > perPage) {
        // btn.classList.remove('is-hidden');
        window.addEventListener('scroll', showLoadMorePage);
      }
    })
    .catch(onFetchError);

  btn.addEventListener('click', onClickLoadMore);

  evt.currentTarget.reset();
}

function onClickLoadMore() {
  page += 1;
  fetchImg(page, textFind, perPage)
    .then(data => {
      const searchResults = data.hits;
      const numberOfPage = Math.round(data.totalHits / perPage);

      gallery.insertAdjacentHTML('beforeend', createMarkup(searchResults));
      if (page === numberOfPage) {
        // btnLoadMore.classList.add('is-hidden');
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results.",
          paramsNotif
        );
        btn.removeEventListener('click', onClickLoadMore);
        window.removeEventListener('scroll', showLoadMorePage);
      }
      lightbox.refresh();
    })
    .catch(onFetchError);
}

function onFetchError() {
  Notiflix.Notify.failure(
    'Oops! Something went wrong! Try reloading the page or make another choice!',
    paramsNotif
  );
}

function showLoadMorePage() {
  if (checkIfEndOfPage()) {
    onClickLoadMore();
  }
}
function checkIfEndOfPage() {
  return (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
  );
}
