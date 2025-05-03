import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { AppointmentService } from '../../../services/appointment.service';
import { CheckupService } from '../../../services/checkup.service';

@Component({
  selector: 'app-doctor-view',
  templateUrl: './doctor-view.component.html',
  styleUrls: ['./doctor-view.component.scss']
})
export class DoctorViewComponent implements OnInit {
  doctorId: number;
  doctor: any = null;
  appointments: any[] = [];
  checkups: any[] = [];
  isLoading: boolean = true;
  activeTab: string = 'overview';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private checkupService: CheckupService
  ) {
    this.doctorId = 0;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.doctorId = +params['id'];
      this.loadDoctorData();
    });
  }

  loadDoctorData(): void {
    this.isLoading = true;
    
    // Load doctor details
    this.doctorService.getDoctorById(this.doctorId).subscribe({
      next: (response) => {
        if (response.data) {
          this.doctor = response.data;
          
          // Load related data
          this.loadAppointments();
          this.loadCheckups();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading doctor data:', error);
        this.isLoading = false;
      }
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointmentsByDoctorId(this.doctorId).subscribe({
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
    this.checkupService.getCheckupsByDoctorId(this.doctorId).subscribe({
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

  calculateExperience(joinDate: string): number {
    const today = new Date();
    const startDate = new Date(joinDate);
    return today.getFullYear() - startDate.getFullYear();
  }
}