import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  concat,
  concatMap,
  debounceTime,
  map,
  Observable,
  startWith,
} from 'rxjs';
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
  displayedColumns = [
    'name',
    'email',
    'birthDate',
    'group',
    'status',
    'action',
  ];
  filterColumns = [
    'nameFilter',
    'emailFilter',
    'birthDateFilter',
    'groupFilter',
    'statusFilter',
    'actionFilter',
  ];

  dataSource: MatTableDataSource<Employee> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  nameFilter = new FormControl('');
  emailFilter = new FormControl('');
  groupFilter = new FormControl('');
  statusFilter = new FormControl('');

  filterValue = {
    name: '',
    email: '',
    group: '',
    status: '',
  };

  groupList: string[] = [];
  filteredGroupList!: Observable<string[]>;

  statusList: string[] = ['active', 'deleted'];
  filteredStatusList!: Observable<string[]>;

  snackBarDuration = 2;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.groupList = this.employeeService.GROUP;
    this.getEmployee();
    this.initFilter();
  }

  getEmployee() {
    this.subs.sink = this.employeeService.getAllEmployee().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.dataSource.data = response;
          this.dataSource.paginator = this.paginator;
          this.dataSource.filterPredicate = this.employeeFilterPredicate;
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  employeeFilterPredicate(data: Employee, filter: string) {
    const { name, email, group, status } = JSON.parse(filter);
    const filterName = `${data.firstName} ${data.lastName}`
      .toLowerCase()
      .includes(name);
    const filterEmail = data.email.toLowerCase().includes(email);
    const filterGroup = data.group.toLowerCase().includes(group);
    const filterStatus = data.status.toLowerCase().includes(status);
    const result = filterName && filterEmail && filterGroup && filterStatus;
    return result;
  }

  initFilter() {
    this.subs.sink = this.nameFilter.valueChanges.subscribe((search) => {
      this.filterValue.name = search ? search.toLowerCase() : '';
      this.dataSource.filter = JSON.stringify(this.filterValue);
    });

    this.subs.sink = this.emailFilter.valueChanges.subscribe((search) => {
      console.log(search);
      this.filterValue.email = search ? search.toLowerCase() : '';
      this.dataSource.filter = JSON.stringify(this.filterValue);
    });

    // For autocomplete group dropdown
    this.filteredGroupList = this.groupFilter.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map((value) => this.dropdownFilter(value || '', 'group'))
    );

    // For autocomplete status dropdown
    this.filteredStatusList = this.statusFilter.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map((value) => this.dropdownFilter(value || '', 'status'))
    );

    // Listen if filter field is empty then reset filter group
    this.subs.sink = this.groupFilter.valueChanges
      .pipe(debounceTime(200))
      .subscribe((search) => {
        if (!search) {
          this.filterValue.group = '';
          this.dataSource.filter = JSON.stringify(this.filterValue);
        }
      });

    // Listen if filter field is empty then reset filter status
    this.subs.sink = this.statusFilter.valueChanges
      .pipe(debounceTime(200))
      .subscribe((search) => {
        if (!search) {
          this.filterValue.status = '';
          this.dataSource.filter = JSON.stringify(this.filterValue);
        }
      });
  }

  private dropdownFilter(value: string, type: string) {
    const filterVal = value.toLowerCase();
    if (type === 'group') {
      return this.groupList.filter((option) =>
        option.toLowerCase().includes(filterVal)
      );
    } else if (type === 'status') {
      return this.statusList.filter((option) =>
        option.toLowerCase().includes(filterVal)
      );
    } else {
      return [];
    }
  }

  selectGroup(value: string) {
    this.filterValue.group = value.toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filterValue);
  }

  selectStatus(value: string) {
    this.filterValue.status = value.toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filterValue);
  }

  // displayFunction for matAutoComplete Status
  displayFn(option: string): string {
    return option === 'active'
      ? 'Active'
      : option === 'deleted'
      ? 'Deleted'
      : '';
  }

  addEmployee() {
    this.router.navigate(['add-employee']);
  }

  editEmployee(id: number) {
    const snackBar = this._snackBar.open('Edit Successfully', undefined, {
      duration: this.snackBarDuration * 1000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: 'edit',
    });

    this.subs.sink = snackBar.afterDismissed().subscribe(() => {
      this.router.navigate(['add-employee']);
    });
  }

  deleteEmployee(id: number) {
    const snackBar = this._snackBar.open('Delete Successfully', undefined, {
      duration: this.snackBarDuration * 1000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: 'delete',
    });

    this.subs.sink = snackBar
      .afterDismissed()
      .pipe(
        debounceTime(500),
        concatMap(() => {
          return this.employeeService.deleteEmployee(id);
        })
      )
      .subscribe(() => {
        this.getEmployee();
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
