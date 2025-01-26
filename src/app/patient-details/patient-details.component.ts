import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { PatientRequest, IllnessRequest } from '../models/patient.model';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {
  patient: PatientRequest | null = null;
  illnessHistory: IllnessRequest[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      this.loadPatientDetails(+patientId);
      this.loadIllnessHistory(+patientId);
    }
  }

  loadPatientDetails(patientId: number): void {
    this.patientService.getPatientById(patientId).subscribe(
      (response) => {
        if (response.data) {
          this.patient = response.data as PatientRequest;
        }
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load patient details';
        this.loading = false;
      }
    );
  }

  loadIllnessHistory(patientId: number): void {
    this.patientService.getIllnessHistory(patientId).subscribe(
      (response) => {
        if (response.data) {
          this.illnessHistory = response.data as IllnessRequest[];
        }
      },
      (error) => {
        console.error('Failed to load illness history:', error);
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/patients']);
  }

  editPatient(): void {
    if (this.patient && this.patient.patientId) {
      this.router.navigate(['/patients/edit', this.patient.patientId]);
    }
  }
}