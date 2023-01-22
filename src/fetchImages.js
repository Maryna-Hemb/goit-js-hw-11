import axios from "axios";

const KEY_PIXABAY = "32975288-caf6655f638892d6e2855db13"; 
const API_ADRESS = "https://pixabay.com/api/";


export class ApiService{

    constructor() {
        this.query = ""
        this.page = 1;
    }

    async getImagesAPI() {
     const PARAM_SEARCH_API = "image_type=photo&orientation=horizontal&safesearch=true"
    const responce = await axios.get(`${API_ADRESS}?key=${KEY_PIXABAY}&q=${this.query}&${PARAM_SEARCH_API}&page=${this.page}per_page=40`)
        return responce.data;
}
 resetPage() {
    this.page = 1
    }
    incrementPage() {
      this.page += 1  
    }
    get searchQuery() {
        return this.query;
    }
    set searchQuery(newQuery) {
        return this.query = newQuery;
    }

   
}

