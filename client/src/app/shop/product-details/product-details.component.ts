import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: IProduct;

  constructor(
    private shopService: ShopService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    let productId = +this.activatedRoute.snapshot.paramMap.get('id');
    this.shopService.getProduct(productId).subscribe(res => {
      this.product = res;
    }, error => {
      console.log(error);
    });
  }

}
