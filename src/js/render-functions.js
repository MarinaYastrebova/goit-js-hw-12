import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more-btn');

const lightbox = new SimpleLightbox('.gallery a', {
  captionData: 'alt',
  captionDelay: 250,
});

function createMarkup(image) {
  const limitedTags = image.tags.split(',').slice(0, 3).join(',');
  return `
  <li class="gallery-item">
    <a class="gallery-link" href="${image.largeImageURL}" 
    data-alt="${limitedTags}">  
        <img
            class="gallery-image"
            src="${image.webformatURL}"
            alt="${limitedTags}"
            width="360"
            />
        <div class="info">
            <p class="info-item"><b>Likes</b> ${image.likes}</p>
            <p class="info-item"><b>Views</b> ${image.views}</p>
            <p class="info-item"><b>Comments</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
        </div>
    </a>
    </li>`;
}

export function createGallery(images) {
  if (!galleryContainer) {
    console.error('Gallery container not found in DOM!');
    return;
  }

  const markup = images.map(createMarkup).join('');
  galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}
export function clearGallery() {
  if (galleryContainer) {
    galleryContainer.innerHTML = '';
  }
}
export function showLoader() {
  if (loader) {
    loader.classList.remove('is-hidden');
  }
}
export function hideLoader() {
  if (loader) {
    loader.classList.add('is-hidden');
  }
}
export function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('is-hidden');
}
export function hideLoadMoreBtn() {
  loadMoreBtn.classList.add('is-hidden');
}
