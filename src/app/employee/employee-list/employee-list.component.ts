import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Employee } from 'src/app/shared/interfaces/employee.type';
import { EmployeeService } from 'src/app/shared/services/employee.service';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  displayedColumns = ['name', 'email', 'birthDate', 'status', 'action'];
  filterColumns = [
    'nameFilter',
    'emailFilter',
    'birthDateFilter',
    'statusFilter',
    'actionFilter',
  ];

  dataSource: MatTableDataSource<Employee> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getEmployee();
  }

  getEmployee() {
    this.subs.sink = this.employeeService.getAllEmployee().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.dataSource.data = response;
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
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
