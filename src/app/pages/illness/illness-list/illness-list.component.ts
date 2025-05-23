import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../../services/patient.service';

interface Illness {
  illnessId: number;
  illness: string[];
  description: string;
  illnessDate: string;
  patientId: number;
}

interface Patient {
  patientId: number;
  name: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  gender: string;
  birthdate: string;
  bloodGroup: string;
}

@Component({
  selector: 'app-illness-list',
  templateUrl: './illness-list.component.html',
  styleUrls: ['./illness-list.component.scss']
})
export class IllnessListComponent implements OnInit {
  patientId: number = 0;
  patient: Patient | null = null;
  illnesses: Illness[] = [];
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('patientId'));
    this.loadPatientData();
    this.loadIllnessHistory();
  }

  loadPatientData(): void {
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (response) => {
        if (response.data) {
          this.patient = response.data as Patient;
        }
      },
      error: (error) => {
        console.error('Error loading patient data:', error);
      }
    });
  }

  loadIllnessHistory(): void {
    this.isLoading = true;
    this.patientService.getPatientIllnessHistory(this.patientId).subscribe({
      next: (response) => {
        if (response.data) {
          this.illnesses = response.data as Illness[];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading illness history:', error);
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}