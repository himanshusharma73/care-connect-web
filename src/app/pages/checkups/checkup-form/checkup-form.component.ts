import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { DoctorService } from '../../../services/doctor.service';
import { CheckupService } from '../../../services/checkup.service';


interface Patient {
  id: number;
  name: {
    firstName: string;
    lastName: string;
  };
}

interface Doctor {
  id: number;
  name: {
    firstName: string;
    lastName: string;
  };
  specialization: string;
}

@Component({
  selector: 'app-checkup-form',
  templateUrl: './checkup-form.component.html',
  styleUrls: ['./checkup-form.component.scss']
})
export class CheckupFormComponent implements OnInit {
  checkupForm: FormGroup;
  patients: Patient[] = [];
  doctors: Doctor[] = [];
  isLoading: boolean = false;
  checkupStatuses: string[] = ['Completed', 'Pending', 'Cancelled'];
  
  constructor(
    private fb: FormBuilder,
    public router: Router, // Make router public
    private patientService: PatientService,
    private doctorService: DoctorService,
    private checkupService: CheckupService
  ) {
    this.checkupForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
  }

  createForm(): FormGroup {
    return this.fb.group({
      patientId: [null, Validators.required],
      doctorId: [null, Validators.required],
      appointmentDate: [new Date().toISOString().split('T')[0], Validators.required],
      checkupStatus: ['Completed'],
      prescription: ['', Validators.required],
      extraComment: ['', Validators.required]
    });
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (response) => {
        if (response.data) {
          this.patients = response.data as Patient[];
        }
      },
      error: (error) => {
        console.error('Error loading patients:', error);
      }
    });
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (response) => {
        if (response.data) {
          this.doctors = response.data as Doctor[];
        }
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.checkupForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = this.checkupForm.value;

    this.checkupService.saveCheckup(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/checkups']);
      },
      error: (error) => {
        console.error('Error saving checkup:', error);
        this.isLoading = false;
      }
    });
  }

  // Helper method to check if a form control is invalid and touched
  isFieldInvalid(controlName: string): boolean {
    const control = this.checkupForm.get(controlName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }
}