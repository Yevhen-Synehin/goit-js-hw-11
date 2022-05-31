import './css/styles.css';
import NewsApiService from './fetchingData';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import throttle from 'lodash.throttle';
import { renderHTML } from './renderHTML';

const newsApiService = new NewsApiService();

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('[data-action="load-more"]');
let bottomMessageRef = document.querySelector('.bottomMessage');
let pages;

loadMoreBtn.classList.add('is-hidden');

formRef.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

function onFormSubmit(e) {
    e.preventDefault();
    clearHTML();
    loadMoreBtn.classList.add('is-hidden');
    newsApiService.resetpage();
    newsApiService.query = e.currentTarget.elements.searchQuery.value;

    if (bottomMessage) {
        bottomMessage.remove();
    };

    if (newsApiService.query.trim() === "") {
        Notiflix.Notify.failure('Please fill in the field');
        return;
    };

    newsApiService.fetchData()
    .then(({ totalHits, hits }) => {
        pages = Math.ceil(totalHits / hits.length);
        if (hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');
            return;
        };
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images!`);
        renderHTML(hits);
        loadMoreBtn.classList.remove('is-hidden');
        if (pages === 1) {
            loadMoreBtn.classList.add('is-hidden');
            addBottomMsg();
        }
    })
    .catch(error => console.log(error));
};

function clearHTML() {
    galleryRef.innerHTML = '';
};

function onLoadMore() {
    newsApiService.fetchData().then(({ hits }) => {
        if (pages === newsApiService.currentPage()) {
            loadMoreBtn.classList.add('is-hidden');
            addBottomMessage();
        };
        renderHTML(hits);
    });
};

function addBottomMessage() {
    bottomMessageRef = document.createElement("p");
    bottomMessageRef.textContent = "We're sorry, but you've reached the end of search results.";
    bottomMessageRef.classList.add('bottomMessage');
    galleryRef.after(bottomMessage);
};