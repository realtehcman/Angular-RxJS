import { Component, OnInit } from '@angular/core';

import {
  catchError,
  distinct,
  EMPTY,
  map,
  Observable,
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
  selectedCategoryId?: number;
  filteredProducts$!: Observable<Product[]>;

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) {}

  ngOnInit(): void {
    this.products$ = this.productService.productsWithCategoryNames$.pipe(
      catchError((error) => {
        this.errorMessage = error;
        return EMPTY;
      })
    );

    this.filteredProducts$ = this.products$.pipe(
      map((arrays: Product[]) =>
        arrays.filter((product: Product) =>
          this.selectedCategoryId
            ? product.categoryId === this.selectedCategoryId
            : true
        )
      )
    );

    this.categories$ = this.productCategoryService.getProductCategories().pipe(
      map((categories: ProductCategory[]) =>
        categories.map((category: ProductCategory) => ({
          id: category.id,
          name: category.name,
          description: category.description,
        }))
      )
    );
  }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.selectedCategoryId = +categoryId;
  }
}
