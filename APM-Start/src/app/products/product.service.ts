import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';

import { Product } from './product';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = 'api/suppliers';

  private selectedRowSubject = new BehaviorSubject<number>(0);
  selectedProductAction$ = this.selectedRowSubject.asObservable();

  constructor(
    private http: HttpClient,
    private productCategoryService: ProductCategoryService
  ) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      tap((data) => console.log('Products: ', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  productsWithCategoryNames$ = combineLatest([
    this.getProducts(),
    this.productCategoryService.getProductCategories(),
  ]).pipe(
    map(([products, categories]) => {
      return products.map(
        (product) =>
          ({
            ...product,
            price: product.price ? product.price * 1.5 : 0,
            categoryName: categories.find((c) => product.id === c.id)?.name,
            searchKey: [product.productName],
          } as Product)
      );
    })
  );

  selectedProduct$ = combineLatest([
    this.productsWithCategoryNames$,
    this.selectedProductAction$,
  ]).pipe(
    map(([productsData, selectedAction]) =>
      productsData.find((product) => {
        return product.id === selectedAction;
      })
    )
  );

  selectedProductChanged(id: number){
    this.selectedRowSubject.next(id);
  }

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      // category: 'Toolbox',
      quantityInStock: 30,
    };
  }

  onSelected(categoryId: string): void {
    this.selectedRowSubject.next(+categoryId);
    console.log('from onselected ' + categoryId);
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }
}
