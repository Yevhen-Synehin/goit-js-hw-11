import axios from "axios";

export default class NewsApiService{
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    };
    
    async fetchData() {
    const params = {
        key: '27764934-912ea2237b30db1db94cefc8b',
        image_type :'photo',
        orientation : 'horizontal',
        safesearch : 'true', 
    };
        return await axios.get(`https://pixabay.com/api/?key=27764934-912ea2237b30db1db94cefc8b&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`)
        .then(object => {
            this.pageIncrement();
            return {
                totalHits: object.data.totalHits,
                hits: object.data.hits,
            };
        })
        .catch(error => console.log('error', error));    
    }
    resetpage() {
        this.page = 1;
    };
    pageIncrement() {
        this.page += 1;
    };
    currentPage() {
        return this.page-1;
    };
    get query() {
        return this.searchQuery;
    };
    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}