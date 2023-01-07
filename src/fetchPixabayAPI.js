export { fetchPixabay };
import axios from 'axios';
const API_KEY = '32537245-4f388be37c0f6e70af9a9106a';
const BASE_URL = 'https://pixabay.com/api/';

async function fetchPixabay(value, page) {
  //   const URL = `${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=21&page=${page}`;
  try {
    const option = {
      params: {
        key: API_KEY,
        q: `${value}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${page}`,
        per_page: 21,
      },
    };
    const response = await axios.get(BASE_URL, option);
    //   console.log(response);
    return response.data;
  } catch {
    console.log(error);
  }
}
