import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BellComponent } from '../../../notifications/bell/bell';
// import {MatIconModule} from '@angular/material/icon';
// import {MatButtonModule} from '@angular/material/button';
// import {MatToolbarModule} from '@angular/material/toolbar';
// import {MatChipsModule} from '@angular/material/chips';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule,BellComponent],
  templateUrl: './header.html',

})
export class HeaderComponent implements OnInit {
  currentRole: string = '';
  isMenuOpen: boolean = false;
  homeUrl: string = '/';
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
   
    this.currentRole = this.authService.getRoleFromToken();
    this.homeUrl = this.currentRole === "ADMIN"? "/admin":"/manager"
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}