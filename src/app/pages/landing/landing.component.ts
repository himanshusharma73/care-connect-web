import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  features = [
    {
      title: "Patient Management",
      description: "Easily manage patient profiles, medical history, and appointments in one place.",
      icon: "group"
    },
    {
      title: "Doctor Scheduling",
      description: "Optimize doctor schedules and patient appointments to maximize efficiency.",
      icon: "calendar_today"
    },
    {
      title: "Prescription Management",
      description: "Manage prescriptions, refills, and medication history with ease.",
      icon: "receipt"
    },
    {
      title: "Billing & Payments",
      description: "Streamline billing processes and manage payments efficiently.",
      icon: "credit_card"
    },
    {
      title: "Admin Dashboard",
      description: "Comprehensive dashboard for hospital administrators to manage operations.",
      icon: "dashboard"
    },
    {
      title: "Medical Records",
      description: "Securely store and access patient medical records and history.",
      icon: "description"
    }
  ];

  steps = [
    {
      title: "Register Your Hospital",
      description: "Create an account and set up your hospital profile with all necessary details."
    },
    {
      title: "Add Doctors & Staff",
      description: "Add your medical professionals and administrative staff to the platform."
    },
    {
      title: "Start Managing Patients",
      description: "Begin scheduling appointments, managing patient records, and streamlining operations."
    }
  ];

  pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for small clinics just getting started.",
      features: [
        "Up to 5 doctors",
        "Up to 500 patients",
        "Basic appointment scheduling",
        "Patient records management",
        "Email support"
      ],
      featured: false
    },
    {
      name: "Professional",
      price: "$299",
      description: "Ideal for growing hospitals with more needs.",
      features: [
        "Up to 20 doctors",
        "Unlimited patients",
        "Advanced scheduling",
        "Prescription management",
        "Billing & payments",
        "24/7 priority support"
      ],
      featured: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large hospitals with complex requirements.",
      features: [
        "Unlimited doctors",
        "Unlimited patients",
        "Custom integrations",
        "Advanced analytics",
        "Dedicated account manager",
        "On-site training"
      ],
      featured: false
    }
  ];

  testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Medical Director, City Hospital",
      avatar: "assets/images/placeholder.svg",
      rating: 5,
      quote: "Care-Connect has transformed how we manage our hospital. The efficiency gains have been remarkable."
    },
    {
      name: "James Wilson",
      role: "Hospital Administrator, Metro Health",
      avatar: "assets/images/placeholder.svg",
      rating: 5,
      quote: "The administrative tools have saved our staff countless hours. Highly recommended for any hospital."
    },
    {
      name: "Dr. Michael Chen",
      role: "Chief of Medicine, Regional Medical Center",
      avatar: "assets/images/placeholder.svg",
      rating: 4,
      quote: "The patient management features are intuitive and comprehensive. Our doctors love using it."
    }
  ];
}