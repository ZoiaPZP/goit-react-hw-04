import axios from "axios";
import Notiflix from "notiflix";

const BASE_URL = 'https://api.unsplash.com/search/photos';  
const ACCESS_KEY = 'LUc31lLdvRYDBf8B8NiRCL_BisMnXkORYJacKJlcgC8'; 

export async function fetchImages(q, page = 1) {
  if (!q || q.trim() === "") {
    Notiflix.Notify.failure('Please enter a valid search query.');
    return;
  }

  
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&page=${page}&client_id=${ACCESS_KEY}&per_page=12`;

  console.log('Request URL:', url); 

  try {
    const { data } = await axios.get(url);
    return data.results; 
  } catch (error) {
    onFetchError();
    console.error("Error fetching images: ", error); 
    throw error;
  }
}

export function onFetchError() {
  Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page or make another choice!');
};






