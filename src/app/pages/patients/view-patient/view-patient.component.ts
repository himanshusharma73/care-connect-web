import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { AppointmentService } from '../../../services/appointment.service';
import { CheckupService } from '../../../services/checkup.service';

@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.scss']
})
export class ViewPatientComponent implements OnInit {
  patientId: number;
  patient: any = null;
  illnesses: any[] = [];
  appointments: any[] = [];
  checkups: any[] = [];
  isLoading: boolean = true;
  activeTab: string = 'overview';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private checkupService: CheckupService
  ) {
    this.patientId = 0;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.patientId = +params['id'];
      this.loadPatientData();
    });
  }

  loadPatientData(): void {
    this.isLoading = true;
    
    // Load patient details
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (response) => {
        if (response.data) {
          this.patient = response.data;
          
          // Load related data
          this.loadIllnesses();
          this.loadAppointments();
          this.loadCheckups();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading patient data:', error);
        this.isLoading = false;
      }
    });
  }

  loadIllnesses(): void {
    this.patientService.getPatientIllnessHistory(this.patientId).subscribe({
      next: (response) => {
        if (response.data) {
          this.illnesses = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading illnesses:', error);
      }
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointmentsByPatientId(this.patientId).subscribe({
      next: (response) => {
        if (response.data) {
          this.appointments = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
      }
    });
  }

  loadCheckups(): void {
    this.checkupService.getCheckupsByPatientId(this.patientId).subscribe({
      next: (response) => {
        if (response.data) {
          this.checkups = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading checkups:', error);
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  calculateAge(birthdate: string): number {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}