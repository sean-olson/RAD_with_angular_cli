import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class YelpService {

  searchResults: any[] = [];
  updateResults = new Subject<void>();
  selectedRestaurant = new Subject<void>();

  getApiKey ()  {
    return window.localStorage.getItem('apiKey') || '';
  }
  saveApiKey(key: string) {
    window.localStorage.setItem('apiKey', key);
  }
  deleteApiKey ()  {
    window.localStorage.removeItem('apiKey');
  }

  getSearchResults ()  {
    return this.searchResults;
  }

  clearSearchResults ()  {
    this.searchResults = [];
    this.updateResults.next();
  }

  searchYelp(params) {
    const url =  'http://localhost:3000/yelp?apikey=' + this.getApiKey() + '&categories=' + params.type + '&location=' + params.location;

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((resp) => {
        const results = JSON.parse(String(resp));
         if (results.errors.length) {
            reject(results.errors[0].error);
            this.searchResults = [];
            this.updateResults.next();
            return;
         }
         this.searchResults = results.data.businesses.map((business) => {
           return {
             id: business.id,
             name: business.name,
             rating: business.rating,
             address: business.location.display_address,
             phone: business.display_phone,
             url: business.url,
             closed: business.is_closed,
             coordinates: business.coordinates
           };
         });
        resolve();
        this.updateResults.next();
      });
    });
  }

  loadRestaurant(id) {
    this.selectedRestaurant.next(id);
  }
  getRestaurant(id) {
    return(id);
  }

  constructor(private http: HttpClient) {
  }
}
