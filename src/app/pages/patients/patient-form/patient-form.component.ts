import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { PatientRequest } from '../../../models/api-types';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {
  patientForm!: FormGroup;
  isLoading = false;
  isEditing = false;
  patientId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.createForm();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.patientId = +params['id'];
        this.loadPatient();
      }
    });
  }

  createForm(): void {
    this.patientForm = this.fb.group({
      name: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        middleName: [''],
        lastName: ['', [Validators.required, Validators.minLength(3)]]
      }),
      birthdate: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: [null],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['', Validators.required]
      }),
      bloodGroup: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      occupation: ['', Validators.required],
      emergencyContactNumber: [null],
      isSmoker: [false],
      isAlcoholic: [false],
      preferredLanguage: ['', Validators.required],
      hasInsurance: [false],
      isMedicaidEligible: [false],
      selfPay: [false]
    });
  }

  loadPatient(): void {
    this.isLoading = true;
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (response) => {
        if (response.data) {
          this.patientForm.patchValue(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading patient:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      return;
    }

    this.isLoading = true;
    const patientData: PatientRequest = this.patientForm.value;

    if (this.isEditing) {
      this.patientService.updatePatient(this.patientId, patientData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/patients']);
        },
        error: (error) => {
          console.error('Error updating patient:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.patientService.registerPatient(patientData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/patients']);
        },
        error: (error) => {
          console.error('Error registering patient:', error);
          this.isLoading = false;
        }
      });
    }
  }
}