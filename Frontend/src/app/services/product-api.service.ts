import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Product {
  id: number;
  productName: string;
  quantity: number;
  totalPrice: number;
  totalPriceCharges: number;
  artCode: string;
}

export interface ProductStatistics {
  totalProducts: number;
  totalRevenue: number;
  totalCharges: number;
  totalQuantity: number;
  averagePrice: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface InventoryStatus {
  labels: string[];
  data: number[];
  colors: string[];
  summary: {
    totalProducts: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  };
}

export interface SalesTrends {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }>;
}

export interface CategoryPerformance {
  datasets: Array<{
    label: string;
    data: Array<{ x: number; y: number }>;
    backgroundColor: string;
  }>;
}

export interface ProductLifecycle {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }>;
}

export interface ProfitabilityMatrix {
  datasets: Array<{
    label: string;
    data: Array<{ x: number; y: number; r: number }>;
    backgroundColor: string;
  }>;
}

export interface SeasonalityAnalysis {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) { }

  // Test API connection
  testConnection(): Observable<string> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/test`).pipe(
      map(response => response.message)
    );
  }

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Get product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new product
  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      catchError(this.handleError)
    );
  }

  // Update product
  updateProduct(id: number, product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      catchError(this.handleError)
    );
  }

  // Delete product
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Search products
  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get low stock products
  getLowStockProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/low-stock`).pipe(
      catchError(this.handleError)
    );
  }

  // Get out of stock products
  getOutOfStockProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/out-of-stock`).pipe(
      catchError(this.handleError)
    );
  }

  // Analytics endpoints

  // Get inventory status
  getInventoryStatus(): Observable<InventoryStatus> {
    return this.http.get<InventoryStatus>(`${this.apiUrl}/analytics/inventory-status`).pipe(
      catchError(this.handleError)
    );
  }

  // Get sales trends
  getSalesTrends(): Observable<SalesTrends> {
    return this.http.get<SalesTrends>(`${this.apiUrl}/analytics/sales-trends`).pipe(
      catchError(this.handleError)
    );
  }

  // Get category performance
  getCategoryPerformance(): Observable<CategoryPerformance> {
    return this.http.get<CategoryPerformance>(`${this.apiUrl}/analytics/category-performance`).pipe(
      catchError(this.handleError)
    );
  }

  // Get product lifecycle
  getProductLifecycle(): Observable<ProductLifecycle> {
    return this.http.get<ProductLifecycle>(`${this.apiUrl}/analytics/lifecycle`).pipe(
      catchError(this.handleError)
    );
  }

  // Get profitability matrix
  getProfitabilityMatrix(): Observable<ProfitabilityMatrix> {
    return this.http.get<ProfitabilityMatrix>(`${this.apiUrl}/analytics/profitability`).pipe(
      catchError(this.handleError)
    );
  }

  // Get seasonality analysis
  getSeasonalityAnalysis(): Observable<SeasonalityAnalysis> {
    return this.http.get<SeasonalityAnalysis>(`${this.apiUrl}/analytics/seasonality`).pipe(
      catchError(this.handleError)
    );
  }

  // Get product statistics
  getProductStatistics(): Observable<ProductStatistics> {
    return this.http.get<ProductStatistics>(`${this.apiUrl}/analytics/statistics`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 