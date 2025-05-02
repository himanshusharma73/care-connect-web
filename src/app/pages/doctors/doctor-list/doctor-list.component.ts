import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';

interface Doctor {
  doctorId: number;
  name: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  email: string;
  mobileNo?: number;
  gender: string;
  specialization: string;
  bloodGroup: string;
  maritalStatus: string;
}

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss']
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';
  specializations: string[] = [
    'CARDIOLOGIST',
    'DERMATOLOGIST',
    'NEUROLOGIST',
    'OPHTHALMOLOGIST',
    'ORTHOPEDIC_SURGEON'
  ];
  selectedSpecialization: string = '';

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.doctorService.getAllDoctors().subscribe({
      next: (response) => {
        if (response.data) {
          this.doctors = response.data as Doctor[];
          this.applyFilters();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.doctors];
    
    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(doctor => 
        doctor.name.firstName.toLowerCase().includes(term) ||
        doctor.name.lastName.toLowerCase().includes(term) ||
        doctor.email.toLowerCase().includes(term) ||
        doctor.specialization.toLowerCase().includes(term)
      );
    }
    
    // Apply specialization filter
    if (this.selectedSpecialization) {
      filtered = filtered.filter(doctor => 
        doctor.specialization === this.selectedSpecialization
      );
    }
    
    this.filteredDoctors = filtered;
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  onSpecializationChange(specialization: string): void {
    this.selectedSpecialization = specialization;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedSpecialization = '';
    this.applyFilters();
  }
  
}