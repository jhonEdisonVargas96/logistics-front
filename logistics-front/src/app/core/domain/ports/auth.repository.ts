import { Observable } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

export interface AuthRepository {
  login(request: LoginRequest): Observable<AuthResponse>;
  register(request: RegisterRequest): Observable<AuthResponse>;
}