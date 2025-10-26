import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  hideLoadMoreBtn,
  showLoadMoreBtn,
} from './js/render-functions.js';

const searchForm = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more-btn');
const gallery = document.querySelector('.gallery');

let currentQuery = '';
let currentPage = 1;
let totalPages = 0;
const perPage = 15;

searchForm.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleClick);

async function handleSubmit(event) {
  event.preventDefault();
  const query = event.currentTarget.elements['search-text'].value
    .toLowerCase()
    .trim();

  if (query === '') {
    iziToast.error({
      title: 'Error',
      message: 'Enter a search term',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    hideLoader();
    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    totalPages = Math.ceil(data.totalHits / perPage);
    createGallery(data.hits);

    iziToast.success({
      title: 'Success',
      message: `We found ${data.totalHits} images.`,
      position: 'topRight',
    });

    if (currentPage < totalPages) {
      showLoadMoreBtn();
    } else {
      hideLoadMoreBtn();
      iziToast.info({
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
        timeout: 5000,
      });
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please check your network connection.',
      position: 'topRight',
    });
    console.error('Error:', error.message);
  } finally {
    hideLoader();
    searchForm.reset();
  }
}

async function handleClick() {
  currentPage += 1;
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    createGallery(data.hits);
    smoothScroll();

    if (currentPage < totalPages) {
      showLoadMoreBtn();
    } else {
      hideLoadMoreBtn();
      iziToast.info({
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
        timeout: 5000,
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please check your network connection.',
      position: 'topRight',
    });
    console.error('Error:', error.message);
    showLoadMoreBtn();
  } finally {
    hideLoader();
  }
}

function smoothScroll() {
  const firstCard = gallery.querySelector('.gallery-item');
  if (!firstCard) return;

  const { height: cardHeight } = firstCard.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
