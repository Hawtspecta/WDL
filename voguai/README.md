# VogueAI - Fashion Discovery & Sentiment Analysis Platform

A comprehensive full-stack fashion platform that demonstrates advanced web development, machine learning integration, and modern deployment practices.

## 🌟 Overview

VogueAI is a fashion discovery and sentiment analysis platform that combines:
- **HTML5 Semantic Structure** with Bootstrap 5 responsive design
- **Flask** for static/dynamic routing and RESTful APIs
- **FastAPI** for ML-powered sentiment analysis
- **Django** for a full-featured blog system with CRUD operations
- **PostgreSQL** integration for scalable data storage
- **Multiple deployment configurations** for different platforms

## 🚀 Features

### Frontend Experiments
- **EXP 1**: HTML5 semantic page structure with proper tags
- **EXP 2**: Bootstrap 5 responsive design with components
- **EXP 3**: JavaScript form validation with regex patterns
- **EXP 13**: Frontend sentiment analysis interface with real-time ML integration

### Backend Experiments
- **EXP 4**: Flask app with Jinja2 templates and dynamic routes
- **EXP 5**: Flask RESTful API serving fashion product data
- **EXP 6**: FastAPI with Pydantic data validation
- **EXP 7**: ML sentiment analysis using TextBlob and Transformers

### Django Blog System
- **EXP 8**: Django project with blog app and models
- **EXP 9**: Full CRUD operations for blog posts
- **EXP 10**: User authentication with custom forms
- **EXP 11**: Django REST Framework API with JWT authentication
- **EXP 12**: PostgreSQL integration with proper indexing

### Deployment & DevOps
- **EXP 14**: Apache and Nginx configuration files
- **EXP 15**: Django + Gunicorn + Nginx setup
- **EXP 16**: ML app systemd and Gunicorn configurations
- **EXP 17**: Cloud deployment configs (Heroku, PythonAnywhere, Digital Ocean)

### Advanced Features
- **EXP 18**: Full-stack ML dashboard with Chart.js visualizations

## 📁 Project Structure

```
voguai/
├── frontend/                # Static HTML site (EXP 1-3, 13)
│   ├── index.html          # Main fashion discovery page
│   ├── sentiment.html      # Sentiment analysis interface
│   ├── css/
│   │   └── style.css       # Custom fashion-themed CSS
│   └── js/
│       └── validation.js   # Form validation logic
├── flask_app/              # Flask application (EXP 4-5)
│   ├── app.py             # Main Flask app with routes
│   ├── templates/         # Jinja2 templates
│   └── static/           # Static assets
├── fastapi_app/           # FastAPI ML service (EXP 6-7)
│   ├── main.py           # FastAPI app with sentiment analysis
│   └── requirements.txt  # FastAPI dependencies
├── django_project/        # Django blog system (EXP 8-12)
│   ├── manage.py        # Django management script
│   ├── vogueblog/       # Main Django project
│   └── blog/           # Blog app with models, views, templates
├── deployment/           # Deployment configurations (EXP 14-17)
│   ├── nginx/          # Nginx configs
│   ├── apache/         # Apache configs
│   ├── systemd/        # Systemd service files
│   └── cloud/          # Cloud platform configs
├── requirements.txt     # Complete project dependencies
└── README.md           # This file
```

## 🛠️ Tech Stack

### Frontend
- **HTML5** with semantic elements
- **Bootstrap 5** for responsive design
- **Vanilla JavaScript** for interactivity
- **Chart.js** for data visualization
- **Google Fonts** (Playfair Display + Inter)

### Backend
- **Flask** - Lightweight web framework
- **FastAPI** - Modern async API framework
- **Django** - Full-featured web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Production database
- **SQLite** - Development database

### Machine Learning
- **TextBlob** - Sentiment analysis
- **Transformers** - Advanced NLP models
- **PyTorch** - Deep learning framework
- **Scikit-learn** - Machine learning utilities

### Deployment
- **Gunicorn** - WSGI server
- **Uvicorn** - ASGI server
- **Nginx** - Reverse proxy
- **Systemd** - Service management
- **Docker** - Containerization (optional)

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+ (optional for frontend tools)
- PostgreSQL 12+ (for production)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd voguai
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Running the Applications

#### Frontend (Static Site)
```bash
# Serve with Python's built-in server
cd frontend
python -m http.server 8000
# Or use any static file server
```

#### Flask Application
```bash
cd flask_app
python app.py
# Access at http://localhost:5000
```

#### FastAPI ML Service
```bash
cd fastapi_app
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# Access at http://localhost:8000
# API docs at http://localhost:8000/docs
```

#### Django Blog System
```bash
cd django_project

# Database migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data (optional)
python manage.py loaddata blog/fixtures/sample_data.json

# Run development server
python manage.py runserver
# Access at http://localhost:8000/blog/
```

## 📊 Experiments Overview

### EXP 1-3: Frontend Foundation
- Semantic HTML5 structure
- Bootstrap 5 responsive components
- Advanced form validation
- Fashion-themed design system

### EXP 4-5: Flask Web App
- Dynamic routing with URL parameters
- Jinja2 template inheritance
- RESTful API endpoints
- JSON data serving

### EXP 6-7: FastAPI ML Integration
- Pydantic data validation
- ML model loading and caching
- Sentiment analysis API
- Automatic API documentation

### EXP 8-12: Django Blog System
- Complete CRUD operations
- User authentication
- REST API with JWT
- PostgreSQL integration
- Admin interface

### EXP 13-18: Advanced Features
- Real-time ML interface
- Deployment configurations
- ML dashboard with analytics
- Multi-platform deployment

## 🔧 Configuration

### Environment Variables
```bash
# Database
DB_NAME=vogueblog
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Secret Key
SECRET_KEY=your-secret-key-here

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Database Setup (PostgreSQL)
```sql
CREATE DATABASE vogueblog;
CREATE USER vogueuser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE vogueblog TO vogueuser;
```

## 🚀 Deployment

### Development
All applications can be run locally using the commands above.

### Production
See `deployment/` directory for platform-specific configurations:
- **Nginx**: Reverse proxy and static file serving
- **Apache**: Alternative web server configuration
- **Systemd**: Service management files
- **Cloud**: Platform-specific deployment files

### Docker (Optional)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📚 API Documentation

### FastAPI Endpoints
- `GET /` - API information
- `GET /health` - Health check
- `POST /analyze` - Sentiment analysis
- `GET /docs` - Interactive documentation

### Flask Endpoints
- `GET /` - Homepage
- `GET /collections` - Collections list
- `GET /collection/<name>` - Collection details
- `GET /api/products` - Products API
- `GET /api/products/<id>` - Product details

### Django Endpoints
- `GET /blog/` - Blog posts
- `GET /blog/api/posts/` - Blog API
- `POST /blog/api/posts/` - Create post (authenticated)
- Authentication via JWT tokens

## 🎨 Design System

### Color Palette
- **Primary Black**: `#0a0a0a`
- **Primary Gold**: `#c9a84c`
- **Primary White**: `#ffffff`
- **Primary Rose**: `#e8b4b8`

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Components
- Responsive navigation with mobile menu
- Fashion-themed cards with hover effects
- Modal popups for product details
- Form validation with inline feedback
- Loading states and error handling

## 🧪 Testing

```bash
# Run Django tests
cd django_project
python manage.py test

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

## 📈 Performance

### Optimization Features
- Image optimization and lazy loading
- Database query optimization
- Caching with Redis
- CDN integration ready
- SEO-friendly URLs and meta tags

### Monitoring
- Django logging configuration
- Error tracking with Sentry (optional)
- Performance metrics collection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Bootstrap for responsive framework
- HuggingFace for ML models
- Unsplash for demo images
- Google Fonts for typography

## 📞 Support

For questions and support:
- Create an issue in the repository
- Check the API documentation
- Review the experiment-specific documentation

---

**VogueAI** - Where Fashion Meets Artificial Intelligence 🤖✨
