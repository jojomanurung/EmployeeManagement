import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  signForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    if (this.signForm.invalid) {
      this.signForm.markAllAsTouched();
      return;
    }

    const username = this.signForm.controls['username'].value!;
    const password = this.signForm.controls['password'].value!;

    this.subs.sink = this.auth.login(username, password).subscribe({
      next: (response) => {
        this.auth.setSession(response);
        this.router.navigate(['/']);
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
