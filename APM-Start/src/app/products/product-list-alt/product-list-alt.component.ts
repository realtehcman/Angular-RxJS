import { getLocaleFirstDayOfWeek } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MaxLengthValidator } from '@angular/forms';
import { writer } from 'repl';
import { catchError, EMPTY, Observable, Subject,  } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  products$ = this.productService.productsWithCategoryNames$;

  constructor(private productService: ProductService) {}

  product$ = this.productService.selectedProduct$.pipe(
    catchError((err) => {
      console.log('from ProductListAltComponent');
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
