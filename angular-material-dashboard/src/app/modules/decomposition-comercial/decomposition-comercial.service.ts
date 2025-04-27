import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DecompositionComercial } from './decomposition-comercial.model';

@Injectable({
  providedIn: 'root'
})
export class DecompositionComercialService {
  private apiUrl = '/api/DecompositionComercial';

  constructor(private http: HttpClient) { }

  getAll(): Observable<DecompositionComercial[]> {
    return this.http.get<DecompositionComercial[]>(this.apiUrl);
  }

  getById(id: number): Observable<DecompositionComercial> {
    return this.http.get<DecompositionComercial>(`${this.apiUrl}/${id}`);
  }

  create(decomposition: DecompositionComercial): Observable<DecompositionComercial> {
    return this.http.post<DecompositionComercial>(this.apiUrl, decomposition);
  }

  update(id: number, decomposition: DecompositionComercial): Observable<DecompositionComercial> {
    return this.http.put<DecompositionComercial>(`${this.apiUrl}/${id}`, decomposition);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}