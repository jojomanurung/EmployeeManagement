import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink2';
import { AuthService } from '../shared/services/auth.service';
import { EmployeeService } from '../shared/services/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  title!: Observable<string>;

  constructor(
    private router: Router,
    private auth: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.title = this.employeeService.pageTitle$;
  }

  logout() {
    this.subs.sink = this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/session/login']);
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
