import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./employee/employee.module').then((m) => m.EmployeeModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'session',
    loadChildren: () =>
      import('./session/session.module').then((m) => m.SessionModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
