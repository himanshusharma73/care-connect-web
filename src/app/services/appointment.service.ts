import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.patientUrl}/api/appointments`;

  constructor(private http: HttpClient) { }

  getAllAppointments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getAppointmentById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
 getAppointmentsByPatientId(patientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient/${patientId}`);
  }

  getAppointmentsByDoctorId(doctorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctor/${doctorId}`);
  }

  bookAppointment(appointmentData: any): Observable<any> {
    return this.http.post(this.apiUrl, appointmentData);
  }

  updateAppointment(id: number, appointmentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, appointmentData);
  }

  cancelAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAvailableSlots(doctorId: number, date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/available-slots?doctorId=${doctorId}&date=${date}`);
  }
}