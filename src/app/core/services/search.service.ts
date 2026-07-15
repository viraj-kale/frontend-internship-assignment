import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private apiService:ApiService) { }

  private readonly openLibraryBlockedQueries = new Set([
    'a',
    'an',
    'and',
    'are',
    'as',
    'at',
    'be',
    'by',
    'for',
    'from',
    'in',
    'is',
    'it',
    'of',
    'on',
    'or',
    'that',
    'the',
    'to',
    'with',
  ]);

  getSearchedBooks(query:string, limit:any, offset:any): Observable<any>{
    const searchKey = this.shouldUseTitleSearch(query) ? 'title' : 'q';
    const searchParams = this.buildSearchParams(searchKey, query, limit, offset);

    return this.apiService.get('/search.json', { params: searchParams }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 422 && searchKey === 'q' && query?.trim()) {
          return this.apiService.get('/search.json', {
            params: this.buildSearchParams('title', query, limit, offset),
          });
        }

        return throwError(() => error);
      })
    )
  }

  private buildSearchParams(searchKey: 'q' | 'title', query: string, limit: any, offset: any): HttpParams {
    return new HttpParams()
      .set(searchKey, query)
      .set('limit', String(limit))
      .set('offset', String(offset));
  }

  private shouldUseTitleSearch(query: string): boolean {
    return this.openLibraryBlockedQueries.has(query?.trim().toLowerCase());
  }
}
