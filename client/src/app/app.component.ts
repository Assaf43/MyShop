import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket/basket.service';
import { IPagination } from './shared/models/pagination';
import { IProduct } from './shared/models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'MyShop';


  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    const baskerId = localStorage.getItem('basket_id');
    if (baskerId) {
      this.basketService.getBasket(baskerId).subscribe(() => {
      }), error => {
        console.log(error);
      }
    }
  }

}
