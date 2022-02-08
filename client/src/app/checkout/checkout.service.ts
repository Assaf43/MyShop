import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IOrderToCreate } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  createOrder(order: IOrderToCreate) {
    const url = `${this.baseUrl}orders`;
    return this.http.post(url,order);
  }

  getDeliveryMethod() {
    return this.http.get(this.baseUrl + 'orders/deliveryMethod').pipe(
      map((dm: IDeliveryMethod[]) => {
        return dm.sort((a ,b) => a.price - b.price);
      })
    );
  }
}
