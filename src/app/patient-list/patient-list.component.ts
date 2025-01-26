import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { PatientRequest } from '../models/patient.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients: PatientRequest[] = [];
  filteredPatients: PatientRequest[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private patientService: PatientService,
    private router: Router
  ) {
    // Setup the search observable with debounce
    this.searchSubject.pipe(
      debounceTime(300), // Wait 300ms after the user stops typing
      distinctUntilChanged() // Only emit if the value has changed
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.error = null;
    this.patientService.getPatients().subscribe(
      (response) => {
        if (response.data) {
          this.patients = response.data as PatientRequest[];
          this.filteredPatients = [...this.patients];
        } else {
          this.error = 'No patient data received';
        }
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load patients. Please try again later.';
        this.loading = false;
        console.error('Error loading patients:', error);
      }
    );
  }

  // Method called on input change
  onSearchChange(event: any): void {
    const searchValue = event.target.value;
    this.searchTerm = searchValue;
    this.searchSubject.next(searchValue);
  }

  // Actual search implementation
  private performSearch(searchTerm: string): void {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredPatients = [...this.patients];
      return;
    }

    this.filteredPatients = this.patients.filter(patient => 
      patient.name.firstName.toLowerCase().includes(term) ||
      patient.name.lastName.toLowerCase().includes(term) ||
      patient.email.toLowerCase().includes(term)
    );
  }

  viewDetails(patientId: number | undefined): void {
    if (patientId) {
      this.router.navigate(['/patients', patientId]);
    }
  }

  editPatient(patientId: number | undefined): void {
    if (patientId) {
      this.router.navigate(['/patients/edit', patientId]);
    }
  }
  // Clean up subscription
  ngOnDestroy() {
    this.searchSubject.complete();
  }
}