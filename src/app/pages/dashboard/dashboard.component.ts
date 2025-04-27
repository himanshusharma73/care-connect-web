import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  selectedTab = 0;
  
  recentAppointments = [
    {
      patientName: "Emma Thompson",
      time: "9:00 AM",
      doctor: "Johnson",
      status: "Completed"
    },
    {
      patientName: "Michael Chen",
      time: "10:30 AM",
      doctor: "Williams",
      status: "In Progress"
    },
    {
      patientName: "Sarah Rodriguez",
      time: "1:15 PM",
      doctor: "Davis",
      status: "Scheduled"
    },
    {
      patientName: "James Wilson",
      time: "3:00 PM",
      doctor: "Miller",
      status: "Scheduled"
    }
  ];

  doctorAvailability = [
    {
      name: "Johnson",
      department: "Cardiology",
      status: "Available"
    },
    {
      name: "Williams",
      department: "Neurology",
      status: "In Session"
    },
    {
      name: "Davis",
      department: "Pediatrics",
      status: "Available"
    },
    {
      name: "Miller",
      department: "Orthopedics",
      status: "Unavailable"
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  setTab(tab: number): void {
    this.selectedTab = tab;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  }

  getAvailabilityClass(status: string): string {
    switch (status) {
      case 'Available':
        return 'bg-green-500';
      case 'In Session':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  }
}