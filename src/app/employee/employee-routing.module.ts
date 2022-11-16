import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeComponent } from './employee.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'employee-list',
    pathMatch: 'full',
  },
  {
    path: 'employee-list',
    component: EmployeeListComponent,
  },
  {
    path: 'employee-detail/:id',
    component: EmployeeDetailComponent,
  },
  {
    path: 'add-employee',
    component: AddEmployeeComponent,
  },
];

const mainRoute: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    children: [...routes],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mainRoute)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
