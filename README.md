# Dashboard Statistics - Full Stack Application

A comprehensive dashboard application with dynamic user management, built with Angular frontend and Spring Boot backend.

## 🚀 Features

### Frontend (Angular)
- **Dynamic User Management**: Add, edit, delete, and search users
- **Real-time Data**: Live updates with loading states and error handling
- **Responsive Design**: Modern UI with dark/light mode support
- **Interactive Charts**: Sales performance, product analytics, and regional data
- **User Authentication**: JWT-based authentication system

### Backend (Spring Boot)
- **RESTful API**: Complete CRUD operations for user management
- **Database Integration**: H2 database with JPA/Hibernate
- **Data Validation**: Input validation and error handling
- **CORS Support**: Cross-origin resource sharing configuration
- **Sample Data**: Automatic initialization with sample users

## 🛠️ Technology Stack

### Frontend
- **Angular 17** - Modern frontend framework
- **TypeScript** - Type-safe JavaScript
- **Chart.js** - Interactive charts and graphs
- **SCSS** - Advanced CSS styling
- **RxJS** - Reactive programming

### Backend
- **Spring Boot 3** - Java-based backend framework
- **Spring Data JPA** - Database abstraction layer
- **H2 Database** - In-memory database
- **Spring Security** - Authentication and authorization
- **JWT** - JSON Web Token authentication

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Java** (JDK 17 or higher)
- **Maven** (for backend build)

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Build the project
./mvnw clean install

# Run the Spring Boot application
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8081`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Start the development server
ng serve
```

The frontend will start on `http://localhost:4200`

### 3. Access the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8081/api
- **H2 Database Console**: http://localhost:8081/h2-console

## 📊 API Endpoints

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `GET /api/users/search?q={query}` - Search users
- `GET /api/users/role/{role}` - Get users by role
- `GET /api/users/status/{status}` - Get users by status
- `GET /api/users/statistics` - Get user statistics

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP,
    last_login TIMESTAMP
);
```

## 🔧 Configuration

### Backend Configuration (`application.properties`)
- **Port**: 8081
- **Database**: H2 (file-based)
- **JPA**: Hibernate with auto-ddl
- **CORS**: Enabled for frontend

### Frontend Configuration
- **API URL**: http://localhost:8081/api
- **Port**: 4200
- **Environment**: Development

## 🎯 Sample Data

The application comes with pre-loaded sample users:
- Sahar Belhaj Amor (Admin)
- Alaa Belhaj Amor (User)
- Najwa Bela (User)
- Hadyl Rbiha (Viewer)
- Amina Mraihi (User)
- Ala Ben Samir (Admin)

## 🔐 Authentication

The application includes JWT-based authentication:
- Login/Register functionality
- Token-based session management
- Protected routes and API endpoints

## 📱 Features Overview

### Dashboard Features
- **KPI Cards**: Revenue, orders, customer satisfaction metrics
- **Interactive Charts**: Line, bar, and doughnut charts
- **Real-time Data**: Auto-refresh capabilities
- **Export Functionality**: Chart and data export
- **Responsive Design**: Mobile-friendly interface

### User Management Features
- **CRUD Operations**: Full user lifecycle management
- **Search & Filter**: Find users by name, email, role, or status
- **Bulk Operations**: Multiple user management
- **Status Management**: Active, Inactive, Pending states
- **Role-based Access**: Admin, User, Viewer roles

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -ano | findstr :8081
   # Kill the process or change port in application.properties
   ```

2. **CORS Errors**
   - Ensure backend is running on port 8081
   - Check CORS configuration in UserController

3. **Database Connection Issues**
   - Verify H2 database file permissions
   - Check application.properties configuration

4. **Frontend Build Issues**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📝 Development

### Adding New Features
1. Create backend entity/model
2. Add repository interface
3. Implement service layer
4. Create REST controller
5. Update frontend interfaces
6. Add service methods
7. Update components and templates

### Code Structure
```
├── backend/
│   ├── src/main/java/
│   │   └── com/example/productapi/
│   │       ├── controller/
│   │       ├── model/
│   │       ├── repository/
│   │       └── service/
│   └── src/main/resources/
└── Frontend/
    └── src/app/
        ├── dashboard/
        ├── services/
        ├── types/
        └── core/
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the API documentation
- Open an issue on GitHub

---

**Happy Coding! 🎉** 