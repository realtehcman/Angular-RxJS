import { Component, OnInit } from '@angular/core';
import { rawListeners } from 'process';

import {
  catchError,
  EMPTY,
  from,
  map,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { ProductCategory } from '../product-categories/product-category';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  pageTitle = 'Product List';
  errorMessage = '';
  categories: ProductCategory[] = [];

  products$!: Observable<Product[]>;
  sub!: Subscription;
  selectedCategoryId?: number;
  filteredProducts$!: Observable<Product[]>;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.products$ = this.productService.productsWithCategoryNames$.pipe(
      catchError((error) => {
        this.errorMessage = error;
        return EMPTY;
      })
    );
    this.selectedCategoryId = 1;
    this.filteredProducts$ = this.products$.pipe(
      map((arrays) =>
        arrays.filter((product) =>
          this.selectedCategoryId
            ? product.categoryId === this.selectedCategoryId
            : true
        )
      )
    );
  }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    console.log('Not yet implemented');
  }
}
