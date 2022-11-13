import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../interfaces/employee.type';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  API = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getAllEmployee() {
    return this.http.get<Employee[]>(this.API + '/employee');
  }
}
