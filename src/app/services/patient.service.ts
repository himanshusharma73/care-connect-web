import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, PatientRequest } from '../models/api-types';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private apiService: ApiService) {}

  // Get all patients
  getAllPatients(): Observable<ApiResponse> {
    return this.apiService.get<ApiResponse>('/patients');
  }

  // Get patient by ID
  getPatientById(patientId: number): Observable<ApiResponse> {
    return this.apiService.get<ApiResponse>(`/patients/${patientId}`);
  }

  // Register a new patient
  registerPatient(patientData: PatientRequest): Observable<ApiResponse> {
    return this.apiService.post<PatientRequest, ApiResponse>('/patients', patientData);
  }

  // Update patient information
  updatePatient(patientId: number, patientData: PatientRequest): Observable<ApiResponse> {
    return this.apiService.put<PatientRequest, ApiResponse>(`/patients/${patientId}`, patientData);
  }

  // Get patient illness history
  getPatientIllnessHistory(patientId: number): Observable<ApiResponse> {
    return this.apiService.get<ApiResponse>(`/illness/patients/${patientId}`);
  }

  // Save patient illness
  savePatientIllness(patientId: number, illnessData: any): Observable<ApiResponse> {
    return this.apiService.post<any, ApiResponse>(`/illness/patients/${patientId}`, illnessData);
  }
}