import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { AuthService } from '../../../core/services/auth.service';
import { ViewService, ViewMode } from '../../../core/services/view.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  userEmail: string = '';
  activeView: ViewMode = 'list';

  constructor(
    private tokenStorage: TokenStorageService,
    private authService: AuthService,
    private viewService: ViewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.decodeUserFromToken();
    this.viewService.viewMode$.subscribe(mode => {
      this.activeView = mode;
    });
  }

  decodeUserFromToken(): void {
    const token = this.tokenStorage.getToken();
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadDecoded = atob(payloadBase64);
        const payloadJson = JSON.parse(payloadDecoded);
        this.userEmail = payloadJson.sub || 'Usuario';
      } catch (e) {
        console.error('Error decoding token', e);
        this.userEmail = 'Usuario';
      }
    }
  }

  setViewMode(mode: ViewMode): void {
    this.viewService.setViewMode(mode);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
