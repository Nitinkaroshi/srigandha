# Srigandha Kannada Koota - API Documentation

## Authentication & Profile Management APIs

Base URL: `http://localhost:5000/api/auth`

---

## Public Endpoints

### 1. Register Admin User
**POST** `/api/auth/register`

Create a new admin account.

**Request Body:**
```json
{
  "username": "admin",
  "email": "admin@srigandha.org",
  "password": "admin@123",
  "role": "admin"
}
```

**Response (201 Created):**
```json
{
  "_id": "user_id",
  "username": "admin",
  "email": "admin@srigandha.org",
  "role": "admin",
  "token": "jwt_token_here"
}
```

**Errors:**
- `400`: User already exists

---

### 2. Login
**POST** `/api/auth/login`

Authenticate admin and receive JWT token.

**Request Body:**
```json
{
  "email": "admin@srigandha.org",
  "password": "admin@123"
}
```

**Response (200 OK):**
```json
{
  "_id": "user_id",
  "username": "admin",
  "email": "admin@srigandha.org",
  "role": "super-admin",
  "token": "jwt_token_here"
}
```

**Errors:**
- `401`: Invalid email or password

---

### 3. Forgot Password
**POST** `/api/auth/forgot-password`

Request a password reset email.

**Request Body:**
```json
{
  "email": "admin@srigandha.org"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset email sent successfully. Please check your email.",
  "success": true
}
```

**Errors:**
- `400`: Email is required
- `404`: No account found with this email address
- `500`: Email could not be sent

**Notes:**
- Reset token expires in 1 hour
- Email contains a link to reset password page with token

---

### 4. Reset Password
**POST** `/api/auth/reset-password`

Reset password using the token received via email.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newSecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successful. You can now login with your new password.",
  "success": true
}
```

**Errors:**
- `400`: Invalid or expired reset token
- `400`: Password must be at least 6 characters

**Notes:**
- Token is valid for 1 hour
- After successful reset, a confirmation email is sent

---

## Protected Endpoints
*All protected endpoints require authentication token in headers*

**Authorization Header:**
```
Authorization: Bearer <jwt_token>
```

---

### 5. Get Admin Profile
**GET** `/api/auth/profile`

Get the authenticated admin's profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "_id": "user_id",
  "username": "admin",
  "email": "admin@srigandha.org",
  "role": "super-admin",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `401`: Not authorized, no token
- `404`: User not found

---

### 6. Update Admin Profile
**PUT** `/api/auth/profile`

Update admin profile information (username and email).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "username": "newusername",
  "email": "newemail@srigandha.org"
}
```

**Response (200 OK):**
```json
{
  "_id": "user_id",
  "username": "newusername",
  "email": "newemail@srigandha.org",
  "role": "super-admin",
  "message": "Profile updated successfully"
}
```

**Errors:**
- `400`: Email already in use
- `401`: Not authorized
- `404`: User not found

**Notes:**
- Fields are optional - only send fields you want to update
- Email must be unique

---

### 7. Change Password
**PUT** `/api/auth/change-password`

Change password for logged-in admin.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "currentPassword": "currentPassword123",
  "newPassword": "newSecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

**Errors:**
- `400`: Current and new password required
- `400`: New password must be at least 6 characters
- `401`: Current password is incorrect
- `404`: User not found

**Notes:**
- Current password must be correct
- After successful change, a confirmation email is sent

---

## Email Configuration

To enable password reset functionality, configure the following environment variables in `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
```

### Gmail Setup Instructions:
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password
   - Use this as `EMAIL_PASSWORD` in .env file

### Email Templates:
The system sends two types of emails:

1. **Password Reset Email**
   - Contains a link with reset token
   - Token expires in 1 hour
   - Styled HTML template

2. **Password Change Confirmation**
   - Sent after successful password change
   - Includes timestamp of change
   - Security notification

---

## Example Usage with JavaScript/Fetch

### Login Example:
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@srigandha.org',
    password: 'admin@123'
  })
});

const data = await response.json();
// Store token: localStorage.setItem('token', data.token);
```

### Forgot Password Example:
```javascript
const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@srigandha.org'
  })
});

const data = await response.json();
console.log(data.message);
```

### Get Profile Example (Protected):
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:5000/api/auth/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const profile = await response.json();
```

### Update Profile Example:
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:5000/api/auth/profile', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    username: 'newusername',
    email: 'newemail@srigandha.org'
  })
});

const data = await response.json();
```

### Change Password Example:
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:5000/api/auth/change-password', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    currentPassword: 'oldPassword123',
    newPassword: 'newPassword123'
  })
});

const data = await response.json();
```

---

## Testing the APIs

You can test these APIs using:
- Postman
- Thunder Client (VS Code extension)
- cURL
- Your frontend application

### Testing with cURL:

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@srigandha.org","password":"admin@123"}'
```

**Forgot Password:**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@srigandha.org"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Security Notes

1. **JWT Tokens**:
   - Tokens expire after 30 days
   - Store securely (httpOnly cookies recommended for production)
   - Include in Authorization header for protected routes

2. **Password Reset**:
   - Tokens expire after 1 hour
   - Tokens are hashed in database
   - One-time use only

3. **Password Requirements**:
   - Minimum 6 characters
   - Passwords are hashed using bcrypt
   - Original passwords never stored

4. **Email Security**:
   - Use App Passwords, not regular passwords
   - Keep EMAIL_PASSWORD secret
   - Never commit .env file to git

---

## Frontend Integration Guide

### Login Page
- Add forgot password link
- On successful login, store token
- Redirect to dashboard

### Forgot Password Page
- Input field for email
- Show success message
- Link back to login

### Reset Password Page
- Extract token from URL query params
- Two fields: new password, confirm password
- Validate password match on frontend
- Show success and redirect to login

### Profile Page
- Display user info
- Edit username/email form
- Change password section (separate form)
- Validation before submit

### Implementation Tips
- Show loading states during API calls
- Handle errors gracefully with user-friendly messages
- Add client-side validation before API calls
- Implement password strength indicator
- Add confirmation dialogs for sensitive actions

---

## Error Handling

All endpoints return errors in this format:
```json
{
  "message": "Error description here"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication failed)
- `404`: Not Found
- `500`: Server Error
