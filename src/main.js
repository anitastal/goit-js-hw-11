import './css/style.css';
import { BASE_URL, getPhoto } from './api/fetch';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  galleryEl: document.querySelector('.gallery'),
  formEl: document.querySelector('#search-form'),
  moreBtn: document.querySelector('.load-more'),
};

let page = 1;

const totalPages = Math.ceil(500 / 40);

refs.formEl.addEventListener('submit', onSubmit);

async function loadMoreCards(searchValue) {
  page += 1;
  const data = await getPhoto(searchValue, page);
  data.hits.forEach(photo => {
    createCardMarkup(photo);
  });
  if (page === totalPages) {
    refs.moreBtn.classList.add('visually-hidden');
  }
  doLightbox();
}

function onSubmit(event) {
  event.preventDefault();

  clearMarkup(refs.galleryEl);

  const searchValue = event.currentTarget[0].value.trim();
  mountData(searchValue);
}

async function mountData(searchValue) {
  try {
    const data = await getPhoto(searchValue, page);

    refs.moreBtn.classList.remove('visually-hidden');
    refs.moreBtn.addEventListener('click', () => {
      loadMoreCards(searchValue);
    });
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
    data.hits.forEach(photo => {
      createCardMarkup(photo);
    });
    doLightbox();
  } catch (error) {
    refs.moreBtn.classList.add('visually-hidden');
    console.log('error', error);
  }
}

function createCardMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  refs.galleryEl.insertAdjacentHTML(
    'beforeend',
    `<div class="photo-card">
    <a class='link-img' href=${largeImageURL}><img src=${webformatURL} alt=${tags} loading="lazy" class="card-img" height="80%"/></a>
  <div class="info">
    <p class="info-item">
      <b class="info-label">Likes </b><span class="info-span">${likes}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Views </b><span class="info-span">${views}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Comments </b><span class="info-span">${comments}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Downloads </b><span class="info-span">${downloads}</span>
    </p>
  </div>
</div>`
  );
}

function doLightbox() {
  const linkImg = document.querySelector('.link-img');
  linkImg.addEventListener('click', openModal);

  function openModal(event) {
    event.preventDefault();
  }

  let lightbox = new SimpleLightbox('.photo-card a', {
    captionDelay: 250,
  });
}

function clearMarkup(element) {
  element.innerHTML = '';
}
