import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionRoutingModule } from './session-routing.module';
import { SessionComponent } from './session.component';
import { LoginComponent } from './login/login.component';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const Material = [
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatTooltipModule
];

@NgModule({
  declarations: [
    SessionComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    SessionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...Material,
  ]
})
export class SessionModule { }
