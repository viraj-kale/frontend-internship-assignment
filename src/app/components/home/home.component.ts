import { Component, OnInit, Output, EventEmitter, OnChanges  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter } from 'rxjs';
import { SearchService } from 'src/app/core/services/search.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  bookSearch: FormControl;
  allBooksData:any
  rawBooksData:any
  recordsLength:any
  paramObj:any
  currentPage:number = 0
  tableSize:number= 10
  previousBtn:any
  nextBtn:any
  query: any = "*"
  totalPages:any
  tableSizes:any = [5, 10, 15, 20]
  isLoading:boolean = false
  queryNotFound:boolean = false
  showClearSearchBtn:boolean = false
  displayTrendingSubjectsBook:boolean = false
  showSearchResultsDialogue:boolean = false
  
  constructor(private searchService:SearchService, private uiloader:NgxUiLoaderService, private router:Router) {
    this.bookSearch = new FormControl('');
  }
  

  ngOnInit() {
    this.paramObj = {
      "offset": this.currentPage,
      "limit": this.tableSize,
      "query": this.query
    }
    this.getBooks("*", this.tableSize, this.currentPage)
    
    this.bookSearch.valueChanges
    .pipe(
      debounceTime(500),
    ).
    subscribe((value: string) => {
     const searchValue = value?.trim()
     if(searchValue){
      console.log(searchValue);
      this.query = searchValue
      this.currentPage = 0
      this.showClearSearchBtn = true
      this.showSearchResultsDialogue = true
      this.getBooks(this.query, this.tableSize, 0)
     } else {
      this.query = "*"
      this.currentPage = 0
      this.showClearSearchBtn = false
      this.showSearchResultsDialogue = false
      this.getBooks(this.query, this.tableSize, this.currentPage)
     }
    });
  }
  getBooks(query:any, limit:any, offset:any){
    this.isLoading = true
      this.searchService.getSearchedBooks(query, limit, limit*offset).subscribe({
        next: (result) => {
        if(result.numFound > 0){
          const books = result?.docs || []
          this.allBooksData = this.shouldRandomizeBooks(query) ? this.shuffleBooks(books) : books
          this.recordsLength = result?.numFound
          this.queryNotFound = false
          this.totalPages = Math.ceil(this.recordsLength / this.tableSize)
        } else {
          this.allBooksData = []
          this.recordsLength = 0
          this.totalPages = 0
          this.queryNotFound = true
        }
        this.isLoading = false
        this.previousBtn = this.currentPage <= 0
        this.nextBtn = this.currentPage + 1 >= this.totalPages
      },
      error: () => {
        this.allBooksData = []
        this.recordsLength = 0
        this.totalPages = 0
        this.queryNotFound = true
        this.isLoading = false
        this.previousBtn = true
        this.nextBtn = true
      }
    })
  }

  private shouldRandomizeBooks(query: string): boolean {
    return query === "*"
  }

  private shuffleBooks<T>(books: T[]): T[] {
    const shuffledBooks = [...books]

    for (let index = shuffledBooks.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffledBooks[index], shuffledBooks[randomIndex]] = [shuffledBooks[randomIndex], shuffledBooks[index]]
    }

    return shuffledBooks
  }
  previousPage(){
    if (this.currentPage <= 0) {
      return
    }
    this.currentPage--
    this.paramObj = {
      "offset": this.currentPage,
      "limit": this.tableSize,
      "query": this.query
    }
    this.getBooks(this.query, this.tableSize, this.currentPage)

  }
  nextPage(){
    if (this.currentPage + 1 >= this.totalPages) {
      return
    }
    this.currentPage++
    this.paramObj = {
      "offset": this.currentPage,
      "limit": this.tableSize,
      "query": this.query
    }
    this.getBooks(this.query, this.tableSize, this.currentPage)
  }
  tableSizeChange(event: Event)
  {
    const target = event.target as HTMLSelectElement
    this.tableSize = Number(target.value)
    this.currentPage = 0
    this.paramObj = {
      "offset": this.currentPage,
      "limit": this.tableSize,
      "query": this.query
    }
    this.getBooks(this.query, this.tableSize, this.currentPage)
  }
  clearSearch(){
    this.bookSearch.setValue('')
    this.queryNotFound = false
    this.showClearSearchBtn = false
  }
  
} 