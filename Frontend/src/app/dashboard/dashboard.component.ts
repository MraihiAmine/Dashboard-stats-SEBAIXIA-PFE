import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartConfiguration, ChartData, ChartEvent, ChartOptions, TooltipItem, TooltipModel } from 'chart.js';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { AuthService } from '../core/auth.service';
import { CommonModule } from '@angular/common';               
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/user.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgChartsModule, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  email: string = '';
  lastLoginDate: string = new Date().toLocaleDateString();
  isRefreshing: boolean = false;
  viewMode: 'overview' | 'detailed' = 'overview';
  unreadNotifications: number = 3;
  
  // KPI Metrics
  totalRevenue: number = 12500000;
  revenueChange: number = 12.5;
  revenueTrend: number = 5.2;
  totalOrders: number = 15600;
  ordersChange: number = 8.2;
  ordersTrend: number = 3.1;
  averageOrderValue: number = 801;
  aovChange: number = 4.1;
  aovTrend: number = 2.3;
  customerSatisfaction: number = 92;
  satisfactionChange: number = 2.5;
  satisfactionTrend: number = 1.8;

  // Chart Summary Metrics
  ytdGrowth: number = 15.8;
  monthlyAverage: number = 1250000;

  // Chart Types
  salesChartType: ChartType = 'line';
  channelChartType: ChartType = 'bar';

  // Sales Performance Chart
  salesPerformanceData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: '2024 Sales',
        data: [450000, 520000, 480000, 550000, 600000, 580000],
        borderColor: '#9FB0F5',
        backgroundColor: 'rgba(159, 176, 245, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: '2023 Sales',
        data: [400000, 450000, 420000, 480000, 520000, 500000],
        borderColor: '#7B8FD4',
        backgroundColor: 'rgba(123, 143, 212, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Enhanced chart options with animations
  salesPerformanceOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    transitions: {
      active: {
        animation: {
          duration: 400
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(159, 176, 245, 0.9)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#7B8FD4',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(this: TooltipModel<'line'>, tooltipItem: TooltipItem<'line'>) {
            const value = tooltipItem.raw as number;
            return tooltipItem.dataset.label + ': €' + value.toLocaleString();
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(159, 176, 245, 0.1)'
        },
        ticks: {
          callback: function(value: number | string) {
            if (typeof value === 'number') {
              return '€' + value.toLocaleString();
            }
            return value;
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  // Top Products Chart
  topProductsData: ChartData<'bar'> = {
    labels: ['Kitchen Cabinet', 'Bathroom Suite', 'Garden Furniture', 'Lighting Set', 'Storage Solution'],
    datasets: [
      {
        label: 'Revenue',
        data: [1250000, 980000, 850000, 720000, 650000],
        backgroundColor: [
          '#003366',
          '#e30613',
          '#003366',
          '#e30613',
          '#003366'
        ]
      }
    ]
  };

  topProductsOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 51, 102, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#e30613',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function(this: TooltipModel<'bar'>, tooltipItem: TooltipItem<'bar'>) {
            const value = tooltipItem.raw as number;
            return 'Revenue: €' + value.toLocaleString();
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 51, 102, 0.1)'
        },
        ticks: {
          callback: function(value: number | string) {
            if (typeof value === 'number') {
              return '€' + value.toLocaleString();
            }
            return value;
          }
        }
      },
      x: {
        grid: {
        display: false
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      bar: {
        borderRadius: 4
      }
    }
  };

  // Regional Distribution Chart
  regionalData: ChartData<'doughnut'> = {
    labels: ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        '#003366',
        '#e30613',
        '#003366',
        '#e30613',
        '#003366'
      ],
      circumference: 360,
      rotation: 0
    }]
  };

  regionalOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 51, 102, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#e30613',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function(this: TooltipModel<'doughnut'>, tooltipItem: TooltipItem<'doughnut'>) {
            const value = tooltipItem.raw as number;
            const label = tooltipItem.label || '';
            return label + ': ' + value + '%';
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    }
  };

  // Channel Performance Chart
  channelData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Online Sales',
        data: [180000, 220000, 190000, 240000, 260000, 250000],
        backgroundColor: '#003366'
      },
      {
        label: 'Store Sales',
        data: [270000, 300000, 290000, 310000, 340000, 330000],
        backgroundColor: '#e30613'
      }
    ]
  };

  channelOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 51, 102, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#e30613',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function(this: TooltipModel<'bar'>, tooltipItem: TooltipItem<'bar'>) {
            const value = tooltipItem.raw as number;
            return tooltipItem.dataset.label + ': €' + value.toLocaleString();
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 51, 102, 0.1)'
        },
        ticks: {
          callback: function(value: number | string) {
            if (typeof value === 'number') {
              return '€' + value.toLocaleString();
            }
            return value;
          }
        }
      },
      x: {
        grid: {
        display: false
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      bar: {
        borderRadius: 4
      },
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  expandedChart: 'sales' | 'products' | 'regional' | 'channel' | null = null;

  expandedChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(159, 176, 245, 0.9)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#7B8FD4',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  selectedTimeRange: string = 'monthly';
  selectedComparison: string = 'previous';
  startDate: string = new Date().toISOString().split('T')[0];
  endDate: string = new Date().toISOString().split('T')[0];
  autoRefresh: boolean = false;
  refreshInterval: number = 300000; // 5 minutes
  private refreshTimer: any;

  // New KPI metrics
  conversionRate: number = 0;
  customerAcquisitionCost: number = 0;
  customerLifetimeValue: number = 0;
  bounceRate: number = 0;
  averageSessionDuration: number = 0;

  isDarkMode: boolean = false;

  currentDate: Date = new Date();

  showTable: boolean = false;
  isEditModalVisible = false;
  isAddModalVisible = false;
  editingUser: User | null = null;
  newUser: CreateUserRequest = {
    name: '',
    email: '',
    role: 'User',
    status: 'Pending'
  };

  // User data from service
  detailedUsers: User[] = [];
  usersLoading = false;
  userError: string | null = null;

  userStats = {
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0
  };

  userRoleChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Admin', 'User', 'Viewer'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#2a3b8f', '#28a745', '#ffc107'],
      borderWidth: 1
    }]
  };
  userRoleChartType: ChartType = 'pie';
  userRoleChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 14 }
        }
      }
    }
  };

  recentLogins: User[] = [];
  recentRegistrations: User[] = [];

  private destroy$ = new Subject<void>();

  showRoleDistributionTable = false;

  constructor(private authService: AuthService, private router: Router, private userService: UserService) {
    this.authService.getCurrentUser().subscribe(user => {
      this.email = user?.email || '';
    });
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
    }
  }

  ngOnInit(): void {
    this.initializeDates();
    this.loadUsers();
    this.loadUserStats();
    this.loadUserRoleDistribution();
    this.loadRecentActivity();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeDates(): void {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    this.startDate = lastMonth.toISOString().split('T')[0];
    this.endDate = now.toISOString().split('T')[0];
  }

  private loadUsers(): void {
    this.userService.users$
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.detailedUsers = users;
      });

    this.userService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.usersLoading = loading;
      });

    this.userService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.userError = error;
      });

    // Initial load
    this.userService.getUsers().subscribe();
  }

  onPeriodChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    // Handle period change
  }

  onProductMetricChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    // Handle product metric change
  }

  onRegionMetricChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    // Handle region metric change
  }

  toggleChartType(chart: 'sales' | 'channel'): void {
    if (chart === 'sales') {
      this.salesChartType = this.salesChartType === 'line' ? 'bar' : 'line';
    } else {
      this.channelChartType = this.channelChartType === 'bar' ? 'line' : 'bar';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  downloadChart(chartType: string): void {
    // Implement chart download functionality
    console.log(`Downloading ${chartType} chart...`);
  }

  refreshData(): void {
    this.isRefreshing = true;
    // Add your refresh logic here
    setTimeout(() => {
      this.isRefreshing = false;
    }, 1000);
  }

  setViewMode(mode: 'overview' | 'detailed'): void {
    this.viewMode = mode;
    // Implement view mode change logic
  }

  showNotifications(): void {
    // TODO: Implement notifications panel
    console.log('Show notifications');
  }

  showSettings(): void {
    // TODO: Implement settings panel
    console.log('Show settings');
  }

  showChartDetails(chartType: string): void {
    // Implement chart details display logic
    console.log(`Showing details for ${chartType} chart...`);
  }

  expandChart(chartType: 'sales' | 'products' | 'regional' | 'channel'): void {
    this.expandedChart = chartType;
    document.body.style.overflow = 'hidden';
  }

  closeExpandedChart(): void {
    this.expandedChart = null;
    document.body.style.overflow = '';
  }

  getExpandedChartTitle(): string {
    switch (this.expandedChart) {
      case 'sales':
        return 'Sales Performance Overview';
      case 'products':
        return 'Top Performing Products';
      case 'regional':
        return 'Regional Performance';
      case 'channel':
        return 'Channel Performance';
      default:
        return '';
    }
  }

  getDisplayName(): string {
    const emailParts = this.email.split('@');
    return emailParts[0];
  }

  onTimeRangeChange(): void {
    const now = new Date();
    let start = new Date();

    switch (this.selectedTimeRange) {
      case 'monthly':
        start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'quarterly':
        start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case 'yearly':
        start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
    }

    this.startDate = start.toISOString().split('T')[0];
    this.endDate = now.toISOString().split('T')[0];
    this.refreshData();
  }

  onComparisonChange(): void {
    this.refreshData();
  }

  onDateChange(): void {
    this.refreshData();
  }

  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    if (this.autoRefresh) {
      this.refreshTimer = setInterval(() => this.refreshData(), this.refreshInterval);
    } else {
      clearInterval(this.refreshTimer);
    }
  }

  exportData(): void {
    // Add your export logic here
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  navigateDate(direction: 'prev' | 'next'): void {
    const current = new Date(this.currentDate);
    if (direction === 'prev') {
      current.setDate(current.getDate() - 1);
    } else {
      current.setDate(current.getDate() + 1);
    }
    this.currentDate = current;
    this.onDateChange();
  }

  showCustomRange(): void {
    // Implement custom range selection logic
    this.selectedTimeRange = 'custom';
    this.onTimeRangeChange();
  }

  setTimeRange(range: 'today' | 'week' | 'month' | 'quarter' | 'year') {
    this.selectedTimeRange = range;
    // Add any additional logic needed when time range changes
  }

  editUser(id: number): void {
    const userToEdit = this.detailedUsers.find(user => user.id === id);
    if (userToEdit) {
      this.editingUser = { ...userToEdit };
      this.isEditModalVisible = true;
    }
  }

  closeEditModal(): void {
    this.isEditModalVisible = false;
    this.editingUser = null;
  }

  saveUser(): void {
    if (this.editingUser) {
      const updateData: UpdateUserRequest = {
        id: this.editingUser.id,
        name: this.editingUser.name,
        email: this.editingUser.email,
        role: this.editingUser.role,
        status: this.editingUser.status
      };
      
      this.userService.updateUser(updateData).subscribe({
        next: () => {
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Failed to update user:', error);
        }
      });
    }
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          console.log('User deleted successfully');
        },
        error: (error) => {
          console.error('Failed to delete user:', error);
        }
      });
    }
  }

  addUser(): void {
    this.isAddModalVisible = true;
    this.newUser = {
      name: '',
      email: '',
      role: 'User',
      status: 'Pending'
    };
  }

  saveNewUser(): void {
    if (this.newUser.name && this.newUser.email) {
      this.userService.createUser(this.newUser).subscribe({
        next: () => {
          this.closeAddModal();
        },
        error: (error) => {
          console.error('Failed to create user:', error);
        }
      });
    }
  }

  closeAddModal(): void {
    this.isAddModalVisible = false;
    this.newUser = {
      name: '',
      email: '',
      role: 'User',
      status: 'Pending'
    };
  }

  clearUserError(): void {
    this.userService.clearError();
  }

  refreshUsers(): void {
    this.userService.refreshUsers();
  }

  testConnection(): void {
    this.userService.testConnection().subscribe({
      next: (result) => {
        console.log('API Test Result:', result);
        alert('API Connection Successful: ' + result);
      },
      error: (error) => {
        console.error('API Test Error:', error);
        alert('API Connection Failed: ' + error.message);
      }
    });
  }

  loadUserStats(): void {
    this.userService.getUserStatistics().subscribe({
      next: stats => {
        this.userStats = stats;
      },
      error: err => {
        console.error('Failed to load user statistics', err);
      }
    });
  }

  loadUserRoleDistribution(): void {
    this.userService.getUserRoleDistribution().subscribe({
      next: (roleCounts) => {
        // Map backend roles to chart order: Admin, User, Viewer
        this.userRoleChartData.datasets[0].data = [
          roleCounts['ADMIN'] || 0,
          roleCounts['USER'] || 0,
          roleCounts['VIEWER'] || 0
        ];
      },
      error: err => {
        console.error('Failed to load user role distribution', err);
      }
    });
  }

  loadRecentActivity(): void {
    this.userService.getRecentLogins().subscribe({
      next: users => this.recentLogins = users,
      error: err => console.error('Failed to load recent logins', err)
    });
    this.userService.getRecentRegistrations().subscribe({
      next: users => this.recentRegistrations = users,
      error: err => console.error('Failed to load recent registrations', err)
    });
  }

  toggleRoleDistributionTable(): void {
    this.showRoleDistributionTable = !this.showRoleDistributionTable;
  }
}
