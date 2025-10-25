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
const endCollectionText = document.querySelector('.end-of-collection-text');

let currentQuery = '';
let currentPage = 1;
let totalPages = 0;
const perPage = 15;

endCollectionText.classList.add('is-hidden');

searchForm.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleClick);

asyns function handleSubmit(event) {
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
  endCollectionText.classList.add('is-hidden');
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
        
        // iziToast.success({
        //     title: 'Success',
        //     message: `Hooray! We found ${data.totalHits} images.`,
        //  position: 'topRight',
        // });

        if (currentPage < totalPages) {
            showLoadMoreButton();
        } else {
            hideLoadMoreButton(); 
            endCollectionText.classList.remove('is-hidden'); 
        }
        
    } catch (error) { 
        hideLoader();
        iziToast.error({
        title: 'Error',
        message:
          'Failed to fetch images. Please check your network connection.',
        position: 'topRight',
      });
       console.error('Error:', error.message);
    } 
    finally {
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
            showLoadMoreButton();
        } else {
            hideLoadMoreButton(); 
            endCollectionText.classList.remove('is-hidden'); 
        }
    } catch (error) { 
         iziToast.error({
        title: 'Error',
        message:
          'Failed to fetch images. Please check your network connection.',
        position: 'topRight',
      });
       console.error('Error:', error.message);
        showLoadMoreButton(); 
    } 
    finally {
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