import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brands';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/product-type';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  @ViewChild('search') searchTerm: ElementRef;

  products: IProduct[];
  brands: IBrand[];
  types: IType[];
  shopParmas = new ShopParams();
  totalCount: number;
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low To High', value: 'priceAsc' },
    { name: 'Price: High To Low', value: 'priceDesc' },
  ];

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    this.shopService.getProducts(this.shopParmas).subscribe((res) => {
      this.products = res.data;
      this.shopParmas.pageNumber = res.pageIndex;
      this.shopParmas.pageSize = res.pageSize;
      this.totalCount = res.count;
    }, error => {
      console.log(error);
    });
  }

  getBrands() {
    this.shopService.getBrands().subscribe((res) => {
      this.brands = [{ id: 0, name: 'All' }, ...res];
    }, error => {
      console.log('Brands Error:' + error);
    });
  }

  getTypes() {
    this.shopService.getTypes().subscribe((res) => {
      this.types = [{ id: 0, name: 'All' }, ...res];
    }, error => {
      console.log('Types Error:' + error);
    });
  }

  onBrandSelected(brandId: number) {
    this.shopParmas.brandId = brandId;
    this.shopParmas.pageNumber = 1;
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    this.shopParmas.typeId = typeId;
    this.shopParmas.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(sort: string) {
    this.shopParmas.sort = sort;
    this.getProducts();
  }

  onPageChange(event: any) {
    if (this.shopParmas.pageNumber !== event) {
      this.shopParmas.pageNumber = event;
      this.getProducts();
    }
  }

  onSearch() {
    this.shopParmas.search = this.searchTerm.nativeElement.value;
    this.shopParmas.pageNumber = 1;
    this.getProducts();
  }

  onReset() {
    this.searchTerm.nativeElement = undefined;
    this.shopParmas = new ShopParams();
    this.getProducts();
  }

}
