import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PatientRequest, IllnessRequest } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getPatients(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/patients`);
  }

  getPatientById(patientId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/patients/${patientId}`);
  }

  registerPatient(patientRequest: PatientRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/patients`, patientRequest);
  }

  getIllnessHistory(patientId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/illness/patients/${patientId}`);
  }

  saveIllness(patientId: number, illnessRequest: IllnessRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/illness/patients/${patientId}`, illnessRequest);
  }
  updatePatient(patient: PatientRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/patients/${patient.patientId}`, patient);
  }

  addPatient(patient: PatientRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/patients`, patient);
  }
}