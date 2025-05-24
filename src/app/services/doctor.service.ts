import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = `${environment.adminUrl}/doctors`;

  constructor(private http: HttpClient) { }

  getAllDoctors(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getDoctorById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  registerDoctor(doctorData: any): Observable<any> {
    return this.http.post(this.apiUrl, doctorData);
  }

  updateDoctor(id: number, doctorData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, doctorData);
  }

  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getSpecializations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/specializations`);
  }

  getDoctorsBySpecialization(specialization: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/specialization/${specialization}`);
  }
}