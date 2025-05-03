import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckupService {
  private apiUrl = `${environment.patientUrl}/api/checkups`;

  constructor(private http: HttpClient) { }

  getAllCheckups(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getCheckupById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  saveCheckup(checkupData: any): Observable<any> {
    return this.http.post(this.apiUrl, checkupData);
  }

  updateCheckup(id: number, checkupData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, checkupData);
  }

  deleteCheckup(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}