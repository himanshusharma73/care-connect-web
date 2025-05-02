import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-illness-form',
  templateUrl: './illness-form.component.html',
  styleUrls: ['./illness-form.component.scss']
})
export class IllnessFormComponent implements OnInit {
  patientId: number = 0;
  illnessId?: number;
  isEditing: boolean = false;
  isLoading: boolean = false;
  illnessForm: FormGroup;
  today: string = new Date().toISOString().split('T')[0]; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService
  ) {
    this.illnessForm = this.createForm();
  }

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.illnessId = this.route.snapshot.paramMap.get('illnessId') ? 
      Number(this.route.snapshot.paramMap.get('illnessId')) : undefined;
    
    this.isEditing = this.route.snapshot.url.some(segment => segment.path === 'edit');
    
    if (this.isEditing && this.illnessId) {
      this.loadIllnessData();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      illnessId: [null],
      illness: this.fb.array([
        this.fb.control('', Validators.required)
      ]),
      description: ['', Validators.required],
      illnessDate: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  get illnessArray(): FormArray {
    return this.illnessForm.get('illness') as FormArray;
  }

  addIllness(): void {
    this.illnessArray.push(this.fb.control('', Validators.required));
  }

  removeIllness(index: number): void {
    if (this.illnessArray.length > 1) {
      this.illnessArray.removeAt(index);
    }
  }

  loadIllnessData(): void {
    this.isLoading = true;
    this.patientService.getIllnessById(this.patientId, this.illnessId!).subscribe({
      next: (response) => {
        if (response.data) {
          const illnessData = response.data;
          
          // Clear existing illness array and add new controls
          while (this.illnessArray.length) {
            this.illnessArray.removeAt(0);
          }
          
          illnessData.illness.forEach((item: string) => {
            this.illnessArray.push(this.fb.control(item, Validators.required));
          });
          
          this.illnessForm.patchValue({
            illnessId: illnessData.illnessId,
            description: illnessData.description,
            illnessDate: illnessData.illnessDate
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading illness data:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.illnessForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = this.illnessForm.value;

    this.patientService.savePatientIllness(this.patientId, formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/patients', this.patientId, 'illnesses']);
      },
      error: (error) => {
        console.error('Error saving illness:', error);
        this.isLoading = false;
      }
    });
  }

  onCancel() {
  this.router.navigate(['/dashboard/patients', this.patientId, 'illnesses']);
}
}