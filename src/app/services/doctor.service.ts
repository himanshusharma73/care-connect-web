import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, CheckupRequestDto } from '../models/api-types';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  constructor(private apiService: ApiService) {}

  // Submit patient checkup
  submitPatientCheckup(checkupData: CheckupRequestDto): Observable<ApiResponse> {
    return this.apiService.post<CheckupRequestDto, ApiResponse>('/patient/checkup', checkupData);
  }

  // Get all checkup details
  getAllCheckupDetails(): Observable<ApiResponse> {
    return this.apiService.post<null, ApiResponse>('/checkups', null);
  }

  // Get illness for a specific patient
  getPatientIllness(patientId: number): Observable<ApiResponse> {
    return this.apiService.get<ApiResponse>(`/illnesses/patients/${patientId}`);
  }
}