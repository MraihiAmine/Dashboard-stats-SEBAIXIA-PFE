import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartConfiguration, ChartData, ChartEvent, ChartOptions, TooltipItem, TooltipModel } from 'chart.js';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { AuthService } from '../core/auth.service';
import { CommonModule } from '@angular/common';               
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ProductApiService, ProductStatistics, InventoryStatus, SalesTrends, CategoryPerformance, ProductLifecycle, ProfitabilityMatrix, SeasonalityAnalysis } from '../services/product-api.service';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/user.interface';
import { Subject, takeUntil } from 'rxjs';
import { TranslationService } from '../services/translation.service';
import { TranslatePipe } from '../pipes/translate.pipe';

interface DashboardSettings {
  defaultChartType: 'line' | 'bar' | 'pie';
  autoRefreshInterval: number;
  exportFormat: 'csv' | 'excel' | 'pdf';
  decimalPlaces: number;
  defaultView: 'overview' | 'detailed' | 'productAnalytics';
  enableNotifications: boolean;
  enableAnimations: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgChartsModule, CommonModule, FormsModule, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  email: string = '';
  userName: string = '';
  lastLoginDate: string = new Date().toLocaleDateString();
  lastLoginTime: string = '';
  isRefreshing: boolean = false;
  viewMode: 'overview' | 'detailed' | 'productAnalytics' = 'overview';
  unreadNotifications: number = 3;
  
  // KPI Metrics
  totalRevenue: number = 12500000;
  revenueChange: number = 12.5;
  revenueTrend: number = 5.2;
  totalOrders: number = 15600;
  ordersChange: number = 8.2;
  ordersTrend: number = 3.1;
  totalCustomers: number = 8500;
  customersChange: number = 15.3;
  customersTrend: number = 7.8;
  conversionRate: number = 3.2;
  conversionChange: number = 2.1;
  conversionTrend: number = 1.5;
  averageOrderValue: number = 801;
  aovChange: number = 4.1;
  aovTrend: number = 2.3;
  returnRate: number = 2.8;
  returnChange: number = -1.2;
  returnTrend: number = -0.8;
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

  expandedChart: string | null = null;
  isChartLoading = false;
  showModal = false;

  expandedChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
      easing: 'easeInOutQuad'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#333',
        borderWidth: 1,
        padding: 8,
        boxPadding: 4,
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

  // Performance Chart Data
  performanceData: ChartData<'bar'> = {
    labels: ['API Response', 'Database Query', 'Memory Usage', 'CPU Usage', 'Disk I/O', 'Network Latency'],
    datasets: [
      {
        label: 'Response Time (ms)',
        data: [45, 120, 78, 65, 95, 32],
        backgroundColor: [
          '#003366',
          '#e30613',
          '#003366',
          '#e30613',
          '#003366',
          '#e30613'
        ]
      }
    ]
  };

  performanceOptions: ChartConfiguration['options'] = {
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
            return 'Response Time: ' + value + ' ms';
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
              return value + ' ms';
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

  recentLogins: User[] = [];
  recentRegistrations: User[] = [];

  private destroy$ = new Subject<void>();

  showRoleDistributionTable = false;

  showUserDistributionChart = false;

  // New toggle properties
  showSystemHealth = false;
  showEnhancedActivity = false;
  showTestChart = false;

  // System Health Data
  systemHealth = {
    api: {
      status: 'healthy',
      responseTime: 45
    },
    database: {
      status: 'healthy',
      connections: 12
    },
    server: {
      status: 'healthy',
      cpu: 23
    }
  };

  // Enhanced Activity Feed
  activityFilter = 'all';
  activityDate = '';
  allActivities = [
    {
      type: 'login',
      title: 'User Login',
      description: 'John Doe logged in successfully',
      user: 'John Doe',
      timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
    },
    {
      type: 'registration',
      title: 'New User Registration',
      description: 'Jane Smith created a new account',
      user: 'Jane Smith',
      timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
    },
    {
      type: 'update',
      title: 'Profile Updated',
      description: 'Mike Johnson updated their profile information',
      user: 'Mike Johnson',
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      type: 'delete',
      title: 'User Deleted',
      description: 'Admin deleted user account',
      user: 'Admin',
      timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
    },
    {
      type: 'login',
      title: 'User Login',
      description: 'Sarah Wilson logged in successfully',
      user: 'Sarah Wilson',
      timestamp: new Date(Date.now() - 1000 * 60 * 90) // 1.5 hours ago
    },
    {
      type: 'update',
      title: 'Settings Changed',
      description: 'David Brown updated system settings',
      user: 'David Brown',
      timestamp: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
    },
    {
      type: 'registration',
      title: 'New User Registration',
      description: 'Emily Davis created a new account',
      user: 'Emily Davis',
      timestamp: new Date(Date.now() - 1000 * 60 * 180) // 3 hours ago
    },
    {
      type: 'login',
      title: 'User Login',
      description: 'Robert Taylor logged in successfully',
      user: 'Robert Taylor',
      timestamp: new Date(Date.now() - 1000 * 60 * 240) // 4 hours ago
    },
    {
      type: 'update',
      title: 'Profile Updated',
      description: 'Lisa Anderson updated their profile information',
      user: 'Lisa Anderson',
      timestamp: new Date(Date.now() - 1000 * 60 * 300) // 5 hours ago
    },
    {
      type: 'delete',
      title: 'User Deleted',
      description: 'Admin deleted inactive user account',
      user: 'Admin',
      timestamp: new Date(Date.now() - 1000 * 60 * 360) // 6 hours ago
    },
    {
      type: 'login',
      title: 'User Login',
      description: 'Michael Clark logged in successfully',
      user: 'Michael Clark',
      timestamp: new Date(Date.now() - 1000 * 60 * 420) // 7 hours ago
    },
    {
      type: 'registration',
      title: 'New User Registration',
      description: 'Amanda White created a new account',
      user: 'Amanda White',
      timestamp: new Date(Date.now() - 1000 * 60 * 480) // 8 hours ago
    },
    {
      type: 'update',
      title: 'Settings Changed',
      description: 'Kevin Martinez updated system preferences',
      user: 'Kevin Martinez',
      timestamp: new Date(Date.now() - 1000 * 60 * 540) // 9 hours ago
    },
    {
      type: 'login',
      title: 'User Login',
      description: 'Jennifer Lee logged in successfully',
      user: 'Jennifer Lee',
      timestamp: new Date(Date.now() - 1000 * 60 * 600) // 10 hours ago
    },
    {
      type: 'update',
      title: 'Profile Updated',
      description: 'Thomas Garcia updated their profile information',
      user: 'Thomas Garcia',
      timestamp: new Date(Date.now() - 1000 * 60 * 660) // 11 hours ago
    }
  ];

  filteredActivities = [...this.allActivities];

  // New product analytics data
  totalProducts: number = 0;
  productRevenue: number = 0;
  lowStockCount: number = 0;
  outOfStockCount: number = 0;
  productGrowth: number = 8.5;
  productRevenueGrowth: number = 12.3;
  lowStockChange: number = -5.2;
  outOfStockChange: number = -15.8;
  productTrendsChartType: ChartType = 'line';
  inventoryData: ChartData<'doughnut'> = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#28a745', '#ffc107', '#e30613'],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };
  productTrendsData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales Trend',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: '#003366',
        backgroundColor: 'rgba(0, 51, 102, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };
  categoryPerformanceData: ChartData<'scatter'> = {
    datasets: [
      {
        label: 'Category Performance',
        data: [{ x: 0, y: 0 }],
        backgroundColor: '#003366',
        pointRadius: 8,
        pointHoverRadius: 12
      }
    ]
  };
  productLifecycleData: ChartData<'radar'> = {
    labels: ['Introduction', 'Growth', 'Maturity', 'Decline', 'Innovation', 'Market Share'],
    datasets: [
      {
        label: 'Product Lifecycle',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: '#003366',
        backgroundColor: 'rgba(0, 51, 102, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: '#003366',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#003366'
      }
    ]
  };
  profitabilityMatrixData: ChartData<'bubble'> = {
    datasets: [
      {
        label: 'Profitability Matrix',
        data: [{ x: 0, y: 0, r: 0 }],
        backgroundColor: '#003366',
        borderColor: '#003366',
        borderWidth: 1
      }
    ]
  };
  seasonalityData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Seasonality',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: '#003366',
        backgroundColor: 'rgba(0, 51, 102, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Chart options for product analytics
  inventoryOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 12,
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  productTrendsOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 12
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  categoryPerformanceOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 12,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: Revenue €${context.parsed.x.toLocaleString()}, Growth ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Revenue (€)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Growth Rate (%)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  productLifecycleOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 12
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  };

  profitabilityMatrixOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 12,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: Revenue €${context.parsed.x.toLocaleString()}, Margin ${context.parsed.y}%, Size ${context.parsed.r}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Revenue (€)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Margin (%)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  seasonalityOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 12
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  selectedLanguage: string = 'en';
  availableLanguages: { code: string; name: string; nativeName: string }[] = [];

  // Settings
  showSettingsModal: boolean = false;
  settings: DashboardSettings = {
    defaultChartType: 'line',
    autoRefreshInterval: 0,
    exportFormat: 'csv',
    decimalPlaces: 0,
    defaultView: 'overview',
    enableNotifications: false,
    enableAnimations: true
  };

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private userService: UserService, 
    private productApiService: ProductApiService,
    private translationService: TranslationService
  ) {
    this.authService.getCurrentUser().subscribe(user => {
      this.email = user?.email || '';
    });
  }

  ngOnInit(): void {
    this.initializeDates();
    this.loadUsers();
    this.loadUserStats();
    this.loadUserRoleDistribution();
    this.loadRecentActivity();
    this.updateSystemHealth();
    this.calculateLastLoginTime();
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.updateChartColors();
    
    // Update last login time every minute
    setInterval(() => {
      this.calculateLastLoginTime();
    }, 60000);

    const email = localStorage.getItem('userEmail');
    console.log('Dashboard loaded userEmail:', email);
    if (email) {
      this.userName = email.split('@')[0];
    } else {
      this.userName = 'User';
    }
    console.log('Dashboard extracted userName:', this.userName);

    // Initialize language
    this.selectedLanguage = localStorage.getItem('language') || 'en';
    this.availableLanguages = this.translationService.getAvailableLanguages();
    
    // Ensure the translation service loads the current language
    this.translationService.loadLanguage(this.selectedLanguage);
    
    // Subscribe to language changes
    this.translationService.currentLanguage$.subscribe(lang => {
      console.log('Language changed to:', lang);
    });

    // Load settings
    this.loadSettings();
    this.applySettings();
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

  toggleChartType(chart: 'sales' | 'channel' | 'productTrends'): void {
    if (chart === 'sales') {
      this.salesChartType = this.salesChartType === 'line' ? 'bar' : 'line';
    } else if (chart === 'channel') {
      this.channelChartType = this.channelChartType === 'line' ? 'bar' : 'line';
    } else if (chart === 'productTrends') {
      this.productTrendsChartType = this.productTrendsChartType === 'line' ? 'bar' : 'line';
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

  setViewMode(mode: 'overview' | 'detailed' | 'productAnalytics'): void {
    console.log('=== SETTING VIEW MODE ===');
    console.log('Previous view mode:', this.viewMode);
    console.log('New view mode:', mode);
    this.viewMode = mode;
    console.log('Current view mode after setting:', this.viewMode);
    
    // Force chart updates when switching to Product Analytics
    if (mode === 'productAnalytics') {
      console.log('Switching to Product Analytics - loading data...');
      setTimeout(() => {
        this.loadProductAnalytics();
        this.refreshProductCharts();
        console.log('Product charts refreshed');
      }, 200);
    }
    console.log('=== VIEW MODE SET ===');
  }

  showNotifications(): void {
    // TODO: Implement notifications panel
    console.log('Show notifications');
  }

  showSettings(): void {
    this.availableLanguages = this.translationService.getAvailableLanguages();
    this.loadSettings();
    this.showSettingsModal = true;
  }

  showChartDetails(chartType: string): void {
    // Implement chart details display logic
    console.log(`Showing details for ${chartType} chart...`);
  }

  expandChart(chartType: string) {
    console.log('Expanding chart:', chartType);
    console.log('Current showModal state:', this.showModal);
    console.log('Current expandedChart state:', this.expandedChart);
    
    this.isChartLoading = true;
    this.expandedChart = chartType;
    this.showModal = true;
    
    console.log('After setting - showModal:', this.showModal, 'expandedChart:', this.expandedChart);
    
    // Force chart update after a short delay
    setTimeout(() => {
      this.isChartLoading = false;
      console.log('Chart should be loaded now');
      console.log('Final state - showModal:', this.showModal, 'expandedChart:', this.expandedChart);
    }, 100);
  }

  closeExpandedChart(): void {
    this.expandedChart = null;
    this.showModal = false;
    this.isChartLoading = false;
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
      case 'userDistribution':
        return 'User Role Distribution';
      case 'inventory':
        return 'Inventory Status';
      case 'productTrends':
        return 'Product Sales Trends';
      case 'categoryPerformance':
        return 'Category Performance';
      case 'productLifecycle':
        return 'Product Lifecycle Analysis';
      case 'profitabilityMatrix':
        return 'Profitability Matrix';
      case 'seasonality':
        return 'Seasonality Analysis';
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

  exportData(section: string): void {
    console.log('Export button clicked for:', section);
    if (section === 'salesChart') {
      const labels = this.salesPerformanceData.labels as string[];
      const datasets = this.salesPerformanceData.datasets;
      let csv = 'Month,' + datasets.map(ds => ds.label).join(',') + '\n';
      labels.forEach((label, i) => {
        csv += label + ',' + datasets.map(ds => ds.data[i]).join(',') + '\n';
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sales.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      return;
    }
    // ...other export logic...
  }

  toggleTheme(): void {
    console.log('Toggling theme - Current isDarkMode:', this.isDarkMode);
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    
    // Apply dark mode class to body for global styling
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Update chart colors for dark mode
    this.updateChartColors();
    
    console.log('Theme toggled - New isDarkMode:', this.isDarkMode);
    console.log('Theme saved to localStorage:', this.isDarkMode ? 'dark' : 'light');
  }

  private updateChartColors(): void {
    // Update chart options based on dark mode
    const textColor = this.isDarkMode ? '#adb1c9' : '#2c3e50';
    const gridColor = this.isDarkMode ? 'rgba(173, 177, 201, 0.1)' : 'rgba(159, 176, 245, 0.1)';
    const tooltipBg = this.isDarkMode ? 'rgba(45, 45, 45, 0.95)' : 'rgba(159, 176, 245, 0.9)';
    const tooltipBorder = this.isDarkMode ? '#4a90e2' : '#7B8FD4';
    
    // Update all chart options with dark mode colors
    const chartsToUpdate = [
      this.salesPerformanceOptions,
      this.topProductsOptions,
      this.regionalOptions,
      this.channelOptions,
      this.userRoleChartOptions,
      this.performanceOptions,
      this.inventoryOptions,
      this.productTrendsOptions,
      this.categoryPerformanceOptions,
      this.productLifecycleOptions,
      this.profitabilityMatrixOptions,
      this.seasonalityOptions,
      this.expandedChartOptions
    ];
    
    chartsToUpdate.forEach(chartOptions => {
      if (chartOptions) {
        // Update scales
        if (chartOptions.scales && chartOptions.scales) {
          Object.keys(chartOptions.scales).forEach(scaleKey => {
            const scale = chartOptions.scales![scaleKey as keyof typeof chartOptions.scales];
            if (scale) {
              // Update grid color
              if (scale.grid) {
                scale.grid.color = gridColor;
              }
              // Update tick colors
              if (scale.ticks) {
                scale.ticks.color = textColor;
              }
            }
          });
        }
        
        // Update legend colors
        if (chartOptions.plugins?.legend?.labels) {
          chartOptions.plugins.legend.labels.color = textColor;
        }
        
        // Update tooltip colors
        if (chartOptions.plugins?.tooltip) {
          chartOptions.plugins.tooltip.backgroundColor = tooltipBg;
          chartOptions.plugins.tooltip.borderColor = tooltipBorder;
          chartOptions.plugins.tooltip.titleColor = this.isDarkMode ? '#ffffff' : '#2c3e50';
          chartOptions.plugins.tooltip.bodyColor = this.isDarkMode ? '#adb1c9' : '#2c3e50';
        }
      }
    });
    
    // Force chart updates and redraws
    setTimeout(() => {
      this.refreshProductCharts();
      
      // Force all charts to redraw
      const chartElements = document.querySelectorAll('canvas');
      chartElements.forEach(canvas => {
        const chartInstance = (canvas as any).chart;
        if (chartInstance) {
          chartInstance.update('none'); // Update without animation
        }
      });
      
      console.log('Charts updated for dark mode:', this.isDarkMode);
    }, 100);
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

  toggleUserDistributionChart(): void {
    this.showUserDistributionChart = !this.showUserDistributionChart;
  }

  toggleSystemHealth(): void {
    this.showSystemHealth = !this.showSystemHealth;
    if (this.showSystemHealth) {
      this.updateSystemHealth();
    }
  }

  toggleEnhancedActivity(): void {
    this.showEnhancedActivity = !this.showEnhancedActivity;
  }

  updateSystemHealth(): void {
    // Simulate real-time health data
    this.systemHealth.api.responseTime = Math.floor(Math.random() * 100) + 20;
    this.systemHealth.database.connections = Math.floor(Math.random() * 20) + 5;
    this.systemHealth.server.cpu = Math.floor(Math.random() * 50) + 10;
  }

  filterActivity(): void {
    this.filteredActivities = this.allActivities.filter(activity => {
      const matchesType = this.activityFilter === 'all' || activity.type === this.activityFilter;
      const matchesDate = !this.activityDate || 
        activity.timestamp.toDateString() === new Date(this.activityDate).toDateString();
      return matchesType && matchesDate;
    });
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'login': return 'fa-sign-in-alt';
      case 'registration': return 'fa-user-plus';
      case 'update': return 'fa-edit';
      case 'delete': return 'fa-trash';
      default: return 'fa-info-circle';
    }
  }

  testChartRendering(): void {
    this.showTestChart = !this.showTestChart;
  }

  testProductAnalytics(): void {
    console.log('Testing Product Analytics...');
    console.log('Current viewMode:', this.viewMode);
    console.log('Product Analytics data:', {
      inventoryData: this.inventoryData,
      productTrendsData: this.productTrendsData,
      categoryPerformanceData: this.categoryPerformanceData,
      productLifecycleData: this.productLifecycleData,
      profitabilityMatrixData: this.profitabilityMatrixData,
      seasonalityData: this.seasonalityData
    });
    
    // Force refresh of product charts
    this.refreshProductCharts();
  }

  testModal(): void {
    console.log('Testing modal functionality...');
    console.log('Current showModal:', this.showModal);
    console.log('Current expandedChart:', this.expandedChart);
    
    // Test with inventory chart
    this.expandChart('inventory');
    
    // Log after a delay to see if it worked
    setTimeout(() => {
      console.log('After test - showModal:', this.showModal);
      console.log('After test - expandedChart:', this.expandedChart);
    }, 200);
  }

  private refreshProductCharts(): void {
    // Force chart re-rendering by updating data references
    this.inventoryData = { ...this.inventoryData };
    this.productTrendsData = { ...this.productTrendsData };
    this.categoryPerformanceData = { ...this.categoryPerformanceData };
    this.productLifecycleData = { ...this.productLifecycleData };
    this.profitabilityMatrixData = { ...this.profitabilityMatrixData };
    this.seasonalityData = { ...this.seasonalityData };
  }

  private loadProductAnalytics(): void {
    console.log('Loading product analytics data...');
    
    // Load product statistics
    this.productApiService.getProductStatistics().subscribe({
      next: (stats: ProductStatistics) => {
        this.totalProducts = stats.totalProducts;
        this.productRevenue = stats.totalRevenue;
        this.lowStockCount = stats.lowStockCount;
        this.outOfStockCount = stats.outOfStockCount;
        console.log('Product statistics loaded:', stats);
      },
      error: (error) => {
        console.error('Error loading product statistics:', error);
        // Fallback to mock data if API fails
        this.totalProducts = 40;
        this.productRevenue = 8500000;
        this.lowStockCount = 5;
        this.outOfStockCount = 5;
      }
    });

    // Load inventory status
    this.productApiService.getInventoryStatus().subscribe({
      next: (inventory: InventoryStatus) => {
        this.inventoryData = {
          labels: inventory.labels,
          datasets: [{
            data: inventory.data,
            backgroundColor: inventory.colors,
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        };
        console.log('Inventory status loaded:', inventory);
      },
      error: (error) => {
        console.error('Error loading inventory status:', error);
        // Fallback to mock data
        this.inventoryData = {
          labels: ['In Stock', 'Low Stock', 'Out of Stock'],
          datasets: [{
            data: [30, 5, 5],
            backgroundColor: ['#2ecc71', '#f39c12', '#e74c3c'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        };
      }
    });

    // Load sales trends
    this.productApiService.getSalesTrends().subscribe({
      next: (trends: SalesTrends) => {
        this.productTrendsData = {
          labels: trends.labels,
          datasets: trends.datasets.map(dataset => ({
            label: dataset.label,
            data: dataset.data,
            borderColor: dataset.borderColor,
            backgroundColor: dataset.backgroundColor,
            fill: true,
            tension: 0.4
          }))
        };
        console.log('Sales trends loaded:', trends);
      },
      error: (error) => {
        console.error('Error loading sales trends:', error);
        // Fallback to mock data
        this.productTrendsData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Kitchen Products',
              data: [45000, 52000, 48000, 55000, 60000, 58000],
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        };
      }
    });

    // Load category performance
    this.productApiService.getCategoryPerformance().subscribe({
      next: (performance: CategoryPerformance) => {
        this.categoryPerformanceData = {
          datasets: performance.datasets.map(dataset => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor,
            pointRadius: 8,
            pointHoverRadius: 12
          }))
        };
        console.log('Category performance loaded:', performance);
      },
      error: (error) => {
        console.error('Error loading category performance:', error);
        // Fallback to mock data
        this.categoryPerformanceData = {
          datasets: [
            {
              label: 'Kitchen',
              data: [{ x: 1250000, y: 15.2 }],
              backgroundColor: '#3498db',
              pointRadius: 8,
              pointHoverRadius: 12
            }
          ]
        };
      }
    });

    // Load product lifecycle
    this.productApiService.getProductLifecycle().subscribe({
      next: (lifecycle: ProductLifecycle) => {
        this.productLifecycleData = {
          labels: lifecycle.labels,
          datasets: lifecycle.datasets.map(dataset => ({
            label: dataset.label,
            data: dataset.data,
            borderColor: dataset.borderColor,
            backgroundColor: dataset.backgroundColor,
            borderWidth: 2,
            pointBackgroundColor: dataset.borderColor,
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: dataset.borderColor
          }))
        };
        console.log('Product lifecycle loaded:', lifecycle);
      },
      error: (error) => {
        console.error('Error loading product lifecycle:', error);
        // Fallback to mock data
        this.productLifecycleData = {
          labels: ['Introduction', 'Growth', 'Maturity', 'Decline', 'Innovation', 'Market Share'],
          datasets: [
            {
              label: 'Current Products',
              data: [85, 92, 78, 45, 88, 76],
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.2)',
              borderWidth: 2,
              pointBackgroundColor: '#3498db',
              pointBorderColor: '#ffffff',
              pointHoverBackgroundColor: '#ffffff',
              pointHoverBorderColor: '#3498db'
            }
          ]
        };
      }
    });

    // Load profitability matrix
    this.productApiService.getProfitabilityMatrix().subscribe({
      next: (matrix: ProfitabilityMatrix) => {
        this.profitabilityMatrixData = {
          datasets: matrix.datasets.map(dataset => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor,
            borderColor: dataset.backgroundColor,
            borderWidth: 1
          }))
        };
        console.log('Profitability matrix loaded:', matrix);
      },
      error: (error) => {
        console.error('Error loading profitability matrix:', error);
        // Fallback to mock data
        this.profitabilityMatrixData = {
          datasets: [
            {
              label: 'High Revenue, High Margin',
              data: [{ x: 1200000, y: 35, r: 25 }],
              backgroundColor: '#2ecc71',
              borderColor: '#2ecc71',
              borderWidth: 1
            }
          ]
        };
      }
    });

    // Load seasonality analysis
    this.productApiService.getSeasonalityAnalysis().subscribe({
      next: (seasonality: SeasonalityAnalysis) => {
        this.seasonalityData = {
          labels: seasonality.labels,
          datasets: seasonality.datasets.map(dataset => ({
            label: dataset.label,
            data: dataset.data,
            borderColor: dataset.borderColor,
            backgroundColor: dataset.backgroundColor,
            fill: true,
            tension: 0.4
          }))
        };
        console.log('Seasonality analysis loaded:', seasonality);
      },
      error: (error) => {
        console.error('Error loading seasonality analysis:', error);
        // Fallback to mock data
        this.seasonalityData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Kitchen Products',
              data: [85, 78, 92, 88, 95, 98, 92, 88, 85, 90, 95, 100],
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        };
      }
    });
  }

  private calculateLastLoginTime(): void {
    // Get last login time from localStorage or use a default time
    const lastLoginTimestamp = localStorage.getItem('lastLoginTimestamp');
    let lastLoginDate: Date;
    
    console.log('Calculating last login time...');
    console.log('Stored timestamp:', lastLoginTimestamp);
    
    if (lastLoginTimestamp) {
      lastLoginDate = new Date(parseInt(lastLoginTimestamp));
    } else {
      // If no stored timestamp, simulate a login 2 hours ago
      lastLoginDate = new Date(Date.now() - (2 * 60 * 60 * 1000));
      localStorage.setItem('lastLoginTimestamp', lastLoginDate.getTime().toString());
    }
    
    const now = new Date();
    const timeDiff = now.getTime() - lastLoginDate.getTime();
    
    console.log('Last login date:', lastLoginDate);
    console.log('Current time:', now);
    console.log('Time difference (ms):', timeDiff);
    
    // Calculate time difference
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    console.log('Calculated - minutes:', minutes, 'hours:', hours, 'days:', days);
    
    if (days > 0) {
      this.lastLoginTime = `${days}d ago`;
    } else if (hours > 0) {
      this.lastLoginTime = `${hours}h ago`;
    } else if (minutes > 0) {
      this.lastLoginTime = `${minutes}m ago`;
    } else {
      this.lastLoginTime = 'Just now';
    }
    
    console.log('Final lastLoginTime:', this.lastLoginTime);
  }

  // Method to update last login timestamp (call this when user logs in)
  updateLastLogin(): void {
    const now = new Date();
    localStorage.setItem('lastLoginTimestamp', now.getTime().toString());
    this.calculateLastLoginTime();
  }

  onLanguageChange() {
    console.log('Language change requested to:', this.selectedLanguage);
    this.translationService.loadLanguage(this.selectedLanguage);
  }

  // Settings Methods
  closeSettings(): void {
    this.showSettingsModal = false;
  }

  saveSettings(): void {
    localStorage.setItem('dashboardSettings', JSON.stringify(this.settings));
    this.applySettings();
    this.closeSettings();
    console.log('Settings saved:', this.settings);
  }

  resetSettings(): void {
    this.settings = {
      defaultChartType: 'line',
      autoRefreshInterval: 0,
      exportFormat: 'csv',
      decimalPlaces: 0,
      defaultView: 'overview',
      enableNotifications: false,
      enableAnimations: true
    };
  }

  loadSettings(): void {
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
  }

  applySettings(): void {
    // Apply chart type settings
    this.salesChartType = this.settings.defaultChartType;
    this.channelChartType = this.settings.defaultChartType;
    this.productTrendsChartType = this.settings.defaultChartType;

    // Apply auto-refresh
    if (this.settings.autoRefreshInterval > 0) {
      this.autoRefresh = true;
      this.refreshInterval = this.settings.autoRefreshInterval;
      this.toggleAutoRefresh();
    } else {
      this.autoRefresh = false;
    }

    // Apply default view
    this.setViewMode(this.settings.defaultView);

    // Apply animations
    if (!this.settings.enableAnimations) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }

  clearCache(): void {
    localStorage.removeItem('dashboardSettings');
    localStorage.removeItem('lastLoginTimestamp');
    // Clear other cached data
    console.log('Cache cleared');
  }
}
