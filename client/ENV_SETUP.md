# Environment Variables Setup

This application uses environment variables to manage configuration across different environments (development, staging, production).

## Setup Instructions

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the `.env` file with your configuration:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

## Environment Variables

### VITE_API_URL
The base URL for your backend API.

- **Development:** `http://localhost:5000/api`
- **Production:** `https://your-production-domain.com/api`

**Important:** In Vite, all environment variables must be prefixed with `VITE_` to be exposed to the client-side code.

## Usage in Code

### Using the config utility (Recommended)

```javascript
import config from './config/env';

// Get API URL
const apiUrl = config.apiUrl;

// Get base URL (without /api)
const baseUrl = config.baseUrl;

// Get full image URL
const imageUrl = config.getImageUrl('filename.jpg');
// Returns: http://localhost:5000/uploads/filename.jpg

// Check environment
if (config.isDevelopment) {
  console.log('Running in development mode');
}
```

### Direct access (Not recommended)

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Production Deployment

When deploying to production:

1. **Update your `.env` file** or set environment variables in your hosting platform:
   ```env
   VITE_API_URL=https://api.yourdomain.com/api
   ```

2. **Rebuild the application:**
   ```bash
   npm run build
   ```

3. Environment variables are embedded during build time, so you must rebuild after changing them.

## Multiple Environments

You can create different environment files:

- `.env` - Default environment (loaded in all cases)
- `.env.local` - Local overrides (not committed to git)
- `.env.production` - Production environment
- `.env.development` - Development environment

Vite will automatically load the correct file based on the mode.

## Important Notes

- ⚠️ Never commit `.env` files to git (they are in `.gitignore`)
- ⚠️ Only variables prefixed with `VITE_` are accessible in client-side code
- ⚠️ Rebuild is required after changing environment variables
- ✅ Use `.env.example` as a template for your team
