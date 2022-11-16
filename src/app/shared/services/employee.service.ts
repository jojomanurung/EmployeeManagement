import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../interfaces/employee.type';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  API = 'http://localhost:3000/api';
  private pageTitle: BehaviorSubject<string> = new BehaviorSubject<string>('');
  pageTitle$ = this.pageTitle.asObservable();

  GROUP = [
    'Finance',
    'Business',
    'Quality Assurance',
    'Project Manager',
    'Frontend',
    'Backend',
    'Data Science',
    'UI/UX',
    'DevOps',
    'Machine Learning',
  ];

  constructor(private http: HttpClient) {}

  setPageTitle(value: string) {
    this.pageTitle.next(value);
  }

  getAllEmployee() {
    return this.http.get<Employee[]>(this.API + '/employee');
  }

  getOneEmployee(id: string) {
    return this.http.get<Employee>(this.API + '/employee/' + id);
  }

  addNewEmployee(payload: any) {
    return this.http.post<Employee[]>(this.API + '/employee/', payload);
  }

  deleteEmployee(id: number) {
    return this.http.delete<Employee[]>(this.API + '/employee/' + id);
  }
}
