import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {
  patientForm: FormGroup;
  patientId?: number;
  isEditing: boolean = false;
  isLoading: boolean = false;
  genders: string[] = ['Male', 'Female', 'Other'];
  bloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  maritalStatuses: string[] = ['Single', 'Married', 'Divorced', 'Widowed'];
  today: string;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private patientService: PatientService
  ) {
    this.patientForm = this.createForm();
    this.today = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id') ? 
      Number(this.route.snapshot.paramMap.get('id')) : undefined;
    
    this.isEditing = this.route.snapshot.url.some(segment => segment.path === 'edit');
    
    if (this.isEditing && this.patientId) {
      this.loadPatientData();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        middleName: [''],
        lastName: ['', [Validators.required, Validators.minLength(3)]]
      }),
      gender: ['', Validators.required],
      birthdate: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.pattern('^[0-9]{10}$')]],
      maritalStatus: ['', Validators.required],
      occupation: [''],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['', Validators.required]
      })
    });
  }

  loadPatientData(): void {
    this.isLoading = true;
    this.patientService.getPatientById(this.patientId!).subscribe({
      next: (response) => {
        if (response.data) {
          this.patientForm.patchValue(response.data);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading patient data:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.patientForm);
      return;
    }

    this.isLoading = true;
    const formData = this.patientForm.value;

    if (this.isEditing && this.patientId) {
      this.patientService.updatePatient(this.patientId, formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard/patients']);
        },
        error: (error) => {
          console.error('Error updating patient:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.patientService.registerPatient(formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard/patients']);
        },
        error: (error) => {
          console.error('Error registering patient:', error);
          this.isLoading = false;
        }
      });
    }
  }

  // Helper method to mark all controls in a form group as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper methods for form validation
  isFieldInvalid(controlName: string): boolean {
    const control = this.patientForm.get(controlName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  isNameFieldInvalid(fieldName: string): boolean {
    const nameGroup = this.patientForm.get('name');
    if (!nameGroup) return false;
    
    const control = nameGroup.get(fieldName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  isAddressFieldInvalid(fieldName: string): boolean {
    const addressGroup = this.patientForm.get('address');
    if (!addressGroup) return false;
    
    const control = addressGroup.get(fieldName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }
}