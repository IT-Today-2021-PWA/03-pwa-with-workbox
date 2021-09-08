import axios from 'axios';

const API_URL = 'https://api.jikan.moe/v3';

export function getApiUrl(path) {
  return API_URL + path;
}

export function getTrendingAnime() {
  return axios.get(getApiUrl('/top/anime/1/airing'));
}

export function getUpcomingAnime() {
  return axios.get(getApiUrl('/top/anime/1/upcoming'));
}

export function getAnimeDetail(id) {
  return axios.get(getApiUrl(`/anime/${id}`));
}
