import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.scss']
})
export class DoctorFormComponent implements OnInit {
  doctorForm: FormGroup;
  doctorId?: number;
  isEditing: boolean = false;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  genders: string[] = ['Male', 'Female', 'Other'];
  specializations: string[] = [];
  formTitle: string = 'Register New Doctor';
  formSubtitle: string = 'Enter doctor details to register them in the system';
  submitButtonText: string = 'Register Doctor';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private doctorService: DoctorService
  ) {
    this.doctorForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadSpecializations();
    
    this.doctorId = this.route.snapshot.paramMap.get('id') ? 
      Number(this.route.snapshot.paramMap.get('id')) : undefined;
    
    this.isEditing = this.route.snapshot.url.some(segment => segment.path === 'edit');
    
    if (this.isEditing && this.doctorId) {
      this.formTitle = 'Edit Doctor';
      this.formSubtitle = 'Update doctor information in the system';
      this.submitButtonText = 'Update Doctor';
      this.loadDoctorData();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        middleName: [''],
        lastName: ['', [Validators.required, Validators.minLength(2)]]
      }),
      gender: ['', Validators.required],
      specialization: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      joinDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.pattern('^[0-9]{10}$')]],
      availability: [''],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['', Validators.required]
      })
    });
  }

  loadSpecializations(): void {
    this.specializations = [
      'Cardiologist',
      'Dermatologist',
      'Endocrinologist',
      'Gastroenterologist',
      'Neurologist',
      'Oncologist',
      'Ophthalmologist',
      'Orthopedic Surgeon',
      'Pediatrician',
      'Psychiatrist',
      'Radiologist',
      'Urologist',
      'General Physician'
    ];
   
    this.doctorService.getSpecializations().subscribe({
      next: (response) => {
        if (response.data) {
          this.specializations = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading specializations:', error);
      }
    });
    
  }

  loadDoctorData(): void {
    this.isLoading = true;
    
    
    
    this.doctorService.getDoctorById(this.doctorId!).subscribe({
      next: (response) => {
        if (response.data) {
          this.doctorForm.patchValue(response.data);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading doctor data:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.doctorForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.doctorForm);
      return;
    }

    this.isSubmitting = true;
    const formData = this.doctorForm.value;

  
    if (this.isEditing && this.doctorId) {
      this.doctorService.updateDoctor(this.doctorId, formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/dashboard/doctors']);
        },
        error: (error) => {
          console.error('Error updating doctor:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      this.doctorService.registerDoctor(formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/dashboard/doctors']);
        },
        error: (error) => {
          console.error('Error registering doctor:', error);
          this.isSubmitting = false;
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
    const control = this.doctorForm.get(controlName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  isNameFieldInvalid(fieldName: string): boolean {
    const nameGroup = this.doctorForm.get('name');
    if (!nameGroup) return false;
    
    const control = nameGroup.get(fieldName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  isAddressFieldInvalid(fieldName: string): boolean {
    const addressGroup = this.doctorForm.get('address');
    if (!addressGroup) return false;
    
    const control = addressGroup.get(fieldName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }
}