import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AdminService {
  _isAdmin: boolean = false;

  constructor(private authService: AuthService) {
  }

  isAdmin(): boolean {
    return this._isAdmin;  
  }
}
