import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
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


  constructor(private basketService: BasketService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadBasket();
    this.loadCurrentUser();
  }

  loadCurrentUser(){
    const token = localStorage.getItem('token');    
    this.accountService.loadCurrentUser(token).subscribe(
      () => {
        console.log('user In');          
      },
      error => {
        console.log(error);          
      }
    );
  }

  loadBasket() {
    const baskerId = localStorage.getItem('basket_id');
    if (baskerId) {
      this.basketService.getBasket(baskerId).subscribe(() => {
        console.log('In Basket');
      }), error => {
        console.log(error);
      }
    }
  }

}
