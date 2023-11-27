import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40907479-2394c5b81dc7b546eff124c36';

// async function fetchImg(page = 1, info, perPage) {
//   const url = `${BASE_URL}?key=${API_KEY}&q=${info}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
//   const response = await axios.get(url);
//   return response.data;
// }

async function fetchImg(page = 1, info, perPage) {
  const params = new URLSearchParams({
    key: API_KEY,
    page: page,
    q: info,
    per_page: perPage,
    image_type: 'horizontal',
    safesearch: 'true',
  });

  return axios.get(`${BASE_URL}?${params}`).then(({ data }) => data);
}
export { fetchImg };
