import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common'; // Make sure CommonModule is imported

// Angular Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LandingComponent } from './pages/landing/landing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PatientListComponent } from './pages/patients/patient-list/patient-list.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginPageComponent } from './pages/login/login.component';
import { PatientFormComponent } from './pages/patients/patient-form/patient-form.component';
import { MatNativeDateModule } from '@angular/material/core';
import { IllnessListComponent } from './pages/illness/illness-list/illness-list.component';
import { IllnessFormComponent } from './pages/illness/illness-form/illness-form.component';
import { AppointmentFormComponent } from './pages/appointments/appointment-form/appointment-form.component';
import { DoctorListComponent } from './pages/doctors/doctor-list/doctor-list.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { CheckupFormComponent } from './pages/checkups/checkup-form/checkup-form.component';
import { ViewPatientComponent } from './pages/patients/view-patient/view-patient.component';
import { DoctorViewComponent } from './pages/doctors/doctor-view/doctor-view.component';
import { DoctorFormComponent } from './pages/doctors/doctor-form/doctor-form.component';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';
import { ErrorInterceptor } from './services/error.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LandingComponent,
    LoginFormComponent,
    DashboardComponent,
    PatientListComponent,
    LoginPageComponent,
    PatientFormComponent,
    CheckupFormComponent,
    IllnessListComponent,
    IllnessFormComponent,
    AppointmentFormComponent,
    DoctorListComponent,
    FormFieldComponent,
    ViewPatientComponent,
    DoctorViewComponent,
    DoctorFormComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }