import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';

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
  {
    path: '**',
    redirectTo: 'employee-list'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
