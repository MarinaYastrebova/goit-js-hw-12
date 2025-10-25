import axios from 'axios';

const API_KEY = '52841982-f1748b7cc828c4a83b5032abb';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1) {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    safesearch: true,
    page: page,
    per_page: 15,
  });

  try {
    const response = await axios.get(`${BASE_URL}?${searchParams}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
}
