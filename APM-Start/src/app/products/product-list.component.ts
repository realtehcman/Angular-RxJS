import { Component, OnInit } from '@angular/core';
import { tap } from 'lodash';

import {
  BehaviorSubject,
  catchError,
  combineLatest,
  distinct,
  EMPTY,
  map,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import { ProductCategory } from '../product-categories/product-category';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  pageTitle = 'Product List';
  errorMessage = '';
  categories$!: Observable<ProductCategory[]>;
  categoryNames$!: Observable<string[]>;

  products$!: Observable<Product[]>;
  sub!: Subscription;
  // selectedCategoryId?: number; //hardcoded
  filteredProducts$!: Observable<Product[]>;

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) {}

  ngOnInit(): void {
    this.categories$ = this.productCategoryService.getProductCategories();

    this.products$ = combineLatest([
      this.productService.productsWithCategoryNames$,
      this.categorySelectedAction$,
    ]).pipe(
      map(([products, selectedCategoryId]) =>
        products.filter((product: Product) =>
          selectedCategoryId ? product.categoryId === selectedCategoryId : true
        )
      ),
      catchError((err) => {
      console.log('from product-list');

        this.errorMessage = err;
        return EMPTY;
      })
    );
  }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
    console.log('from onselected ' + categoryId);
  }
}
