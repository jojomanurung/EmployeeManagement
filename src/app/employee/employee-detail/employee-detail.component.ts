import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/shared/interfaces/employee.type';
import { EmployeeService } from 'src/app/shared/services/employee.service';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  employeeId: string = '';
  employeeData!: Employee;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.setPageTitle('Employee Detail');
    console.log(this.employeeId);
    this.getOneEmployee();
  }

  getOneEmployee() {
    this.subs.sink = this.employeeService
      .getOneEmployee(this.employeeId)
      .subscribe({
        next: (response) => {
          if (response) {
            this.employeeData = response;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
