import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = environment.patientUrl;

  constructor(private http: HttpClient) {}

  getAllPatients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/patients`);
  }

  getPatientById(patientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/patients/${patientId}`);
  }

  registerPatient(patientData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/patients`, patientData);
  }

  updatePatient(patientId: number, patientData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/patients/${patientId}`, patientData);
  }

  getPatientIllnessHistory(patientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/illness/patients/${patientId}`);
  }

  getIllnessById(patientId: number, illnessId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/illness/patients/${patientId}/${illnessId}`);
  }

  savePatientIllness(patientId: number, illnessData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/illness/patients/${patientId}`, illnessData);
  }
}