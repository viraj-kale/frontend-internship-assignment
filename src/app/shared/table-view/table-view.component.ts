import { Component, Input, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { Book } from 'src/app/core/models/book-response.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'front-end-internship-assignment-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
})
export class TableViewComponent implements OnChanges {
  @Input() booksList: Book[] = [];
  @Input() subjectName: string = '';
  @Input() totalRecords:number = 0 
  @Input() parametersData:any
  @Input() currentPage:any


  @Output() emitterObj = new EventEmitter() 
  private _booksList:any
  query:any = "*"
  property:any = "author_name"
  booksTable:any
  books:any
  tableSize:any
  tableSizes:any = [5, 10, 15, 20]
  totalPages:number = 0
  paramObj:any
  displayTrendingSubjectsBook:boolean = false
  previousBtn:boolean = false
  nextBtn:boolean = false
  isTrendingSubjectsPage:boolean = false


  constructor(private uiloader:NgxUiLoaderService){}

  ngOnChanges() {
    this.totalPages = Math.ceil(this.totalRecords / this.tableSize)
    if(this.booksList?.length){
      this.displayData()
      console.log(this.booksList);
      
    } 
  }
displayData(){  
      this.booksList[0]?.hasOwnProperty(this.property) 
      ? this.displayTrendingSubjectsBook = false 
      : this.displayTrendingSubjectsBook = true  
  }
}
