# Srigandha Kannada Koota - Full Stack CMS

A modern, full-stack Content Management System built for Srigandha Kannada Koota of Florida.

## Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS, React Router DOM
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Image Hosting**: Local server with static file serving

## Project Structure

```
srigandha-clone/
├── client/          # React frontend application
│   ├── src/
│   ├── public/
│   └── package.json
├── server/          # Express backend API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/     # User uploaded files
│   └── package.json
└── README.md
```

## Local Development

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git installed

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `server/` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```

4. Initialize database with sample data:
```bash
node initializeData.js
```

5. Start the server:
```bash
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_BASE_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Deployment to Render

### 1. Deploy Backend API

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `srigandha-api` (or your choice)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_production_jwt_secret
   CLIENT_URL=https://your-frontend-url.onrender.com
   PORT=5000
   ```

6. Click **"Create Web Service"**

7. Once deployed, note your backend URL (e.g., `https://srigandha-api.onrender.com`)

### 2. Deploy Frontend

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `srigandha-web` (or your choice)
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_BASE_URL=https://your-backend-url.onrender.com
   ```
   (Replace with your actual backend URL from step 1)

5. Click **"Create Static Site"**

### 3. Initialize Database (First Time Only)

After backend is deployed:

1. Go to your backend service on Render
2. Click **"Shell"** tab
3. Run:
```bash
node initializeData.js
```

This will populate your MongoDB with initial data.

### 4. Create Admin Account

Access your deployed site and register the first admin user, or use the Shell to create one directly in MongoDB.

## Default Admin Credentials

After running `initializeData.js`, you can create an admin user through the registration page and then manually update their role in MongoDB to 'admin'.

## Features

### Public Features
- **Homepage**: Dynamic carousel, upcoming events, membership plans
- **About Page**: Organization history timeline
- **Events**: Browse upcoming and past events
- **Gallery**: Photo galleries with YouTube video integration
- **Committee**: Current and previous committee members
- **Contact**: Contact form

### Admin Features
- **Dashboard**: Overview of site statistics
- **Carousel Management**: Upload and manage homepage carousel slides
- **Events Management**: Create, edit, delete events with image upload
- **Gallery Management**: Create albums with multiple images and YouTube videos
- **Committee Management**: Manage current and previous committee members
- **Pages Management**: Dynamic page builder
- **Settings**: Site-wide settings and membership plans
- **User Management**: Manage user accounts and roles

## Environment Variables

### Backend (.env in server/)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
CLIENT_URL=https://your-frontend-url.onrender.com
```

### Frontend (.env in client/)
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_BASE_URL=https://your-backend-url.onrender.com
```

## File Upload Configuration

Uploaded files are stored in `server/uploads/` directory with subdirectories:
- `uploads/carousel/` - Carousel slide images
- `uploads/events/` - Event images
- `uploads/gallery/` - Gallery images
- `uploads/committee/` - Committee member photos
- `uploads/general/` - Other uploads

**Important for Production**: Render's free tier has ephemeral storage. Uploaded files will be lost on service restart. For production, consider using:
- Cloudinary
- AWS S3
- Google Cloud Storage
- Or upgrade to Render paid plan with persistent storage

## API Endpoints

### Public Routes
- `GET /api/carousel` - Get active carousel slides
- `GET /api/events` - Get all events
- `GET /api/gallery` - Get all galleries
- `GET /api/committee` - Get committee members
- `GET /api/pages/:slug` - Get page by slug
- `GET /api/settings` - Get site settings
- `POST /api/contact` - Submit contact form

### Protected Routes (Require Authentication)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Admin Routes (Require Admin Role)
- All POST, PUT, DELETE operations for:
  - Carousel
  - Events
  - Gallery
  - Committee
  - Pages
  - Settings

## Troubleshooting

### Backend Issues
- **MongoDB Connection Failed**: Check MONGODB_URI is correct and IP is whitelisted in MongoDB Atlas
- **JWT Errors**: Ensure JWT_SECRET is set and consistent
- **File Upload Errors**: Check folder permissions in uploads directory

### Frontend Issues
- **API Connection Failed**: Verify VITE_API_URL points to correct backend URL
- **CORS Errors**: Check CLIENT_URL is set correctly in backend .env
- **Images Not Loading**: Ensure VITE_BASE_URL is correct

### Render Deployment Issues
- **Build Failed**: Check build logs for specific errors
- **Service Won't Start**: Verify start command and environment variables
- **Files Lost After Restart**: This is expected on free tier - use external storage

## Contributing

This is a private project for Srigandha Kannada Koota of Florida.

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact the development team.
