import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { CheckupRequestDto, Patient, Doctor } from '../../../models/api-types';

@Component({
  selector: 'app-checkup-form',
  templateUrl: './checkup-form.component.html',
  styleUrls: ['./checkup-form.component.scss']
})
export class CheckupFormComponent implements OnInit {
  checkupForm!: FormGroup;
  isLoading = false;
  isEditing = false;
  isReadOnly = false;
  checkupId!: number;
  patients: Patient[] = [];
  doctors: Doctor[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.loadDoctorsAndPatients();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.checkupId = +params['id'];
        this.route.data.subscribe(data => {
          this.isEditing = data['isEditing'] || false;
          this.isReadOnly = data['readonly'] || false;
        });
        
        if (this.isEditing || this.isReadOnly) {
          this.loadCheckup();
        }
      }
    });
  }

  createForm(): void {
    this.checkupForm = this.fb.group({
      patientId: [0, [Validators.required, Validators.min(1)]],
      doctorId: [0, [Validators.required, Validators.min(1)]],
      appointmentDate: ['', Validators.required],
      checkupStatus: ['Scheduled'],
      prescription: ['', Validators.required],
      extraComment: ['', Validators.required]
    });

    if (this.isReadOnly) {
      this.checkupForm.disable();
    }
  }

  loadDoctorsAndPatients(): void {
    // In a real implementation, you would fetch patients and doctors from the API
    // For now, we'll use mock data
    this.patients = [
      {
        id: 1,
        name: { firstName: 'John', lastName: 'Doe' },
        birthdate: '1990-01-01',
        gender: 'Male',
        email: 'john@example.com',
        bloodGroup: 'O+',
        maritalStatus: 'Single',
        occupation: 'Engineer',
        isSmoker: false,
        isAlcoholic: false,
        hasInsurance: true
      },
      {
        id: 2,
        name: { firstName: 'Jane', lastName: 'Smith' },
        birthdate: '1985-05-15',
        gender: 'Female',
        email: 'jane@example.com',
        bloodGroup: 'A+',
        maritalStatus: 'Married',
        occupation: 'Teacher',
        isSmoker: false,
        isAlcoholic: false,
        hasInsurance: true
      }
    ];

    this.doctors = [
      {
        id: 1,
        name: { firstName: 'Dr. Michael', lastName: 'Johnson' },
        specialization: 'Cardiology',
        email: 'michael@example.com',
        available: true
      },
      {
        id: 2,
        name: { firstName: 'Dr. Sarah', lastName: 'Williams' },
        specialization: 'Neurology',
        email: 'sarah@example.com',
        available: true
      }
    ];
  }

  loadCheckup(): void {
    this.isLoading = true;
    // In a real implementation, you would fetch the checkup details from the API
    // For now, we'll use mock data
    setTimeout(() => {
      const mockCheckup: CheckupRequestDto = {
        patientId: 1,
        doctorId: 2,
        appointmentDate: '2023-05-15',
        appointmentId: this.checkupId,
        checkupStatus: 'Completed',
        prescription: 'Paracetamol 500mg, twice daily for 5 days',
        extraComment: 'Patient presented with symptoms of common cold and fever.'
      };
      
      this.checkupForm.patchValue(mockCheckup);
      this.isLoading = false;
    }, 1000);
  }

  onSubmit(): void {
    if (this.checkupForm.invalid) {
      return;
    }

    this.isLoading = true;
    const checkupData: CheckupRequestDto = this.checkupForm.value;
    
    if (this.isEditing) {
      checkupData.appointmentId = this.checkupId;
    }

    this.doctorService.submitPatientCheckup(checkupData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/checkups']);
      },
      error: (error) => {
        console.error('Error submitting checkup:', error);
        this.isLoading = false;
      }
    });
  }
}