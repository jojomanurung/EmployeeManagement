import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/shared/services/employee.service';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  displayedColumns = ['name', 'email', 'birthDate', 'status', 'action'];
  filterColumns = ['nameFilter', 'emailFilter', 'birthDateFilter', 'statusFilter', 'actionFilter'];
  dataSource = new MatTableDataSource();

  constructor(private emplyeeService: EmployeeService, private router: Router) { }

  ngOnInit(): void {
  }

  addEmployee() {
    this.router.navigate(['add-employee']);
  }

  editEmployee() {
    // code here
  }

  deleteEmployee() {
    // code here
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
