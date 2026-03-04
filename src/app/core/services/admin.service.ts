import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomJSONResponse, UserResponseDto, UserActivationDto } from '../../shared/models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}


 getAllUsers(): Observable<CustomJSONResponse<UserResponseDto[]>> {
    return this.http.get<CustomJSONResponse<UserResponseDto[]>>(`${this.apiUrl}/all`);
  }

  updateUser(id: number, userData: any): Observable<CustomJSONResponse<UserResponseDto>> {
    return this.http.put<CustomJSONResponse<UserResponseDto>>(`${this.apiUrl}/user/${id}`, userData);
  }

  
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

 
  activateUser(id: number, activationDto: UserActivationDto): Observable<CustomJSONResponse<UserResponseDto>> {
    return this.http.put<CustomJSONResponse<UserResponseDto>>(`${this.apiUrl}/activate/${id}`, activationDto);
  }


    getUserById(id:number): Observable<CustomJSONResponse<UserResponseDto>>{
    return this.http.get<CustomJSONResponse<UserResponseDto>>(`${this.apiUrl}/user/${id}`)
  }

 
}