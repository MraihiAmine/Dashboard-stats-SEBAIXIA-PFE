import { Component, OnInit, ViewChild } from '@angular/core';
import { DecompositionComercialService } from './decomposition-comercial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DecompositionComercial } from './decomposition-comercial.model';

@Component({
  selector: 'app-decomposition-comercial',
  templateUrl: './decomposition-comercial.component.html',
  styleUrls: ['./decomposition-comercial.component.scss']
})
export class DecompositionComercialComponent implements OnInit {
  decompositions = new MatTableDataSource<DecompositionComercial>([]);
  selectedDecomposition: DecompositionComercial | null = null;
  displayedColumns: string[] = ['id', 'name', 'category', 'quantity', 'totalPrice', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: DecompositionComercialService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadDecomposition(params['id']);
      } else {
        this.loadAllDecompositions();
      }
    });
  }

  ngAfterViewInit() {
    this.decompositions.paginator = this.paginator;
  }

  loadAllDecompositions() {
    this.service.getAll().subscribe(data => {
      this.decompositions.data = data;
    });
  }

  loadDecomposition(id: number) {
    this.service.getById(id).subscribe(data => {
      this.selectedDecomposition = data;
    });
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.service.delete(id).subscribe(() => {
        this.snackBar.open('Successfully deleted', 'Close', {
          duration: 3000
        });
        this.loadAllDecompositions();
      });
    }
  }
}