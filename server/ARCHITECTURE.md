# Backend Architecture - MVC Pattern

This backend follows the **Model-View-Controller (MVC)** architectural pattern for better code organization, maintainability, and scalability.

## Directory Structure

```
server/
├── config/          # Configuration files (database, etc.)
├── controllers/     # Business logic layer
├── middleware/      # Express middleware (auth, upload, etc.)
├── models/          # Mongoose schemas and models
├── routes/          # Route definitions (thin layer)
├── uploads/         # File upload directory
└── server.js        # Application entry point
```

## Architecture Layers

### 1. Models (Data Layer)
Location: `models/`

Mongoose schemas that define data structure and database operations.

- **User.js** - User authentication and profiles
- **Event.js** - Event management
- **News.js** - News/announcements
- **Committee.js** - Committee member information
- **Gallery.js** - Photo gallery items
- **Page.js** - Dynamic pages
- **SiteSettings.js** - Global site configuration

### 2. Controllers (Business Logic Layer)
Location: `controllers/`

Contains all business logic and database operations. Routes delegate to controllers.

- **authController.js** - Authentication logic (register, login, profile)
- **eventController.js** - Event CRUD operations
- **newsController.js** - News CRUD operations
- **committeeController.js** - Committee member CRUD operations
- **galleryController.js** - Gallery CRUD operations
- **pageController.js** - Page CRUD operations
- **settingsController.js** - Settings management
- **uploadController.js** - File upload/delete operations

### 3. Routes (Routing Layer)
Location: `routes/`

Thin routing layer that maps HTTP endpoints to controller functions.

- **auth.js** - `/api/auth/*` routes
- **events.js** - `/api/events/*` routes
- **news.js** - `/api/news/*` routes
- **committee.js** - `/api/committee/*` routes
- **gallery.js** - `/api/gallery/*` routes
- **pages.js** - `/api/pages/*` routes
- **settings.js** - `/api/settings/*` routes
- **upload.js** - `/api/upload/*` routes

### 4. Middleware
Location: `middleware/`

- **auth.js** - JWT authentication and authorization
- **upload.js** - Multer file upload configuration

## Benefits of MVC Architecture

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Maintainability**: Easy to locate and modify code
3. **Testability**: Controllers can be unit tested independently
4. **Scalability**: Easy to add new features following the same pattern
5. **Reusability**: Controllers can be reused across different routes

## API Endpoint Structure

All endpoints follow RESTful conventions:

```
GET    /api/resource      # Get all items
GET    /api/resource/:id  # Get single item
POST   /api/resource      # Create new item (protected)
PUT    /api/resource/:id  # Update item (protected)
DELETE /api/resource/:id  # Delete item (protected)
```

## Authentication & Authorization

- **protect** middleware - Verifies JWT token
- **admin** middleware - Checks for admin role
- Public routes: No middleware
- Protected routes: `protect` middleware
- Admin routes: `protect` + `admin` middleware

## Example Request Flow

```
Client Request
    ↓
Express Router (routes/events.js)
    ↓
Middleware (protect, admin)
    ↓
Controller (controllers/eventController.js)
    ↓
Model (models/Event.js)
    ↓
MongoDB Database
    ↓
Response back through the chain
```

## Code Example

**Route (routes/events.js):**
```javascript
import { getAllEvents, createEvent } from '../controllers/eventController.js';

router.get('/', getAllEvents);
router.post('/', protect, admin, createEvent);
```

**Controller (controllers/eventController.js):**
```javascript
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Model (models/Event.js):**
```javascript
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true }
});

export default mongoose.model('Event', eventSchema);
```

## Environment Variables

Required in `.env` file:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CLIENT_URL` - Frontend URL for CORS

## Future Enhancements

- Add service layer for complex business logic
- Implement validation middleware using Joi or express-validator
- Add API versioning
- Implement caching layer (Redis)
- Add logging middleware (Winston, Morgan)
