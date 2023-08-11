import { Component, Input, OnInit } from '@angular/core';
import { Employee } from 'src/app/employee.model';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  @Input() employee: Employee;
  @Input() rowId: number = 0;
  
  constructor() { }

  ngOnInit(): void {
  }

  explandRow() {

  }

}
