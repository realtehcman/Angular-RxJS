import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';

import {
  throwError,
  Observable,
  map,
  tap,
  catchError,
  shareReplay,
} from 'rxjs';
import { ProductCategory } from './product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  private productCategoriesUrl = 'api/productCategories';

  constructor(private http: HttpClient) {}

  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get(this.productCategoriesUrl).pipe(
      map((response: any) => response as ProductCategory[]),
      tap((value) => 'Data from category1: ' + JSON.stringify(value)),
      tap((value) =>
        console.log('Data from category2: ' + JSON.stringify(value))
      ),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    console.log('from ProductCategoryService handleError ');
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
