import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { EmployeeService } from 'src/app/shared/services/employee.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  today = moment().subtract(1, 'day');

  groupList: string[] = [];
  filteredGroupList!: Observable<string[]>;

  statusList: string[] = ['married', 'single'];
  filteredStatusList!: Observable<string[]>;

  employeeForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, CustomValidators.email]),
    birthDate: new FormControl(null, [Validators.required]),
    basicSalary: new FormControl(0, [Validators.required]),
    status: new FormControl('', [Validators.required, CustomValidators.arrayString(this.statusList, 'status')]),
    group: new FormControl('', [Validators.required]),
    description: new FormControl(moment(new Date())),
  });

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.groupList = this.employeeService.GROUP;
    this.initAutoComplete();
  }

  initAutoComplete() {
    // To add validators arrayString to dropdown
    this.employeeForm.controls['group'].addValidators(CustomValidators.arrayString(this.groupList, 'group'));
    this.employeeForm.controls['group'].updateValueAndValidity();

    // For autocomplete group dropdown
    this.filteredGroupList = this.employeeForm.controls['group'].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map((value) => this.dropdownFilter(value || '', 'group'))
    );

    // For autocomplete status dropdown
    this.filteredStatusList = this.employeeForm.controls['status'].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map((value) => this.dropdownFilter(value || '', 'status'))
    );
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
    this.employeeForm.controls['group'].patchValue(value);
  }

  selectStatus(value: string) {
    this.employeeForm.controls['status'].patchValue(value);
  }

  // displayFunction for matAutoComplete Status
  displayFn(option: string): string {
    return option === 'married'
      ? 'Married'
      : option === 'single'
      ? 'Single'
      : '';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
