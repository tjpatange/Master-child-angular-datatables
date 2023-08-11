import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Employee } from './employee.model';
@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private httpClient: HttpClient) { }


  getEmployee() {
    return  this.httpClient.get<Employee[]>("https://jsonplaceholder.typicode.com/users")
  }
}
