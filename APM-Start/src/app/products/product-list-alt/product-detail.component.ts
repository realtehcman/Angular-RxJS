import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { Supplier } from 'src/app/suppliers/supplier';
import { Product } from '../product';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  errorMessage = '';

  constructor(private productService: ProductService) {}

  product$? = this.productService.selectedProduct$.pipe(
    catchError((err) => {
      console.log('from ProductDetailComponent product$');
      this.errorMessage = err;
      return EMPTY;
    })
  );
  pageTitle$ = this.product$?.pipe(
    map((product) =>
      product ? `Selected product ${product.productName}` : null
    )
  );

  productSuppliers$ =
    this.productService.getAllSelectedProductWithSupplier$.pipe(
      catchError((err) => {
        console.log('from ProductDetailComponent productSuppliers$');
        this.errorMessage = err;
        return EMPTY;
      })
    );
}
