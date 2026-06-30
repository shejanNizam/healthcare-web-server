# CENM Healthcare — Public Website API

> **Base URL:** `http://localhost:5000/api/v1`
>
> **Auth header:** `Authorization: Bearer <accessToken>`
>
> All responses follow the envelope:
> ```json
> { "success": true, "statusCode": 200, "message": "...", "data": {}, "meta": {} }
> ```
> Errors use `"success": false` with an `"errorMessages"` array.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [User Account (Self)](#2-user-account-self)
3. [Job Posts](#3-job-posts)
4. [Job Applications (3-Step Flow)](#4-job-applications-3-step-flow)
5. [Blogs](#5-blogs)
6. [Staffing Solutions](#6-staffing-solutions)
7. [Static Content](#7-static-content)
8. [Banners](#8-banners)
9. [Contact / Enquiry](#9-contact--enquiry)
10. [Values / Dropdown Options](#10-values--dropdown-options)
11. [Feedback (Logged-in users)](#11-feedback-logged-in-users)
12. [File Upload](#12-file-upload)

---

## 1. Authentication

### POST `/auth/login`
Log in with email and password. Returns `accessToken` in body + sets `refreshToken` cookie.

> Rate-limited: 10 requests / 15 min per IP

**Request body**
```json
{
  "email": "nurse@example.com",
  "password": "myPassword123"
}
```

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "<jwt>",
    "user": { "_id": "...", "name": "Jane Doe", "email": "...", "role": "user" }
  }
}
```

---

### POST `/auth/logout`
Clears the `refreshToken` cookie.

**Response `200`** — `{ "message": "Logged out successfully" }`

---

### POST `/auth/refresh-token`
Exchange a valid `refreshToken` cookie for a new `accessToken`.

**Response `200`** — `{ "data": { "accessToken": "<new-jwt>" } }`

---

### GET `/auth/google`
Redirect the browser to Google OAuth consent screen.

| Query param | Type | Description |
|---|---|---|
| `redirect` | `string` | URL to redirect to after login (optional) |

**Response `302`** — Redirects to Google.

---

### POST `/auth/change-password`  `🔒 Auth required`
Change current password. Works for all roles.

**Request body**
```json
{
  "oldPassword": "current",
  "newPassword": "newSecure123"
}
```

---

### POST `/auth/forgot-password`
Send a password-reset link to the registered email.

**Request body** — `{ "email": "nurse@example.com" }`

**Response `200`** — `{ "message": "Reset email sent if account exists" }`

---

### POST `/auth/reset-password`
Reset password using the token from the email link. Uses the `Authorization: Bearer <resetToken>` header.

**Request body** — `{ "newPassword": "newSecure123" }`

---

## 2. User Account (Self)

### POST `/user/signup`
Register a new account. Sends OTP to the provided email.

> Rate-limited: 5 requests / 15 min per IP

**Request body**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "StrongPass123"
}
```

**Response `201`** — `{ "message": "OTP sent to your email. Please verify." }`

---

### POST `/user/verify-email?email=jane@example.com`
Verify the 6-digit OTP. Promotes pending signup to active account and issues tokens.

**Request body** — `{ "otp": "482931" }`

**Response `200`**
```json
{
  "data": {
    "accessToken": "<jwt>",
    "user": { "_id": "...", "name": "Jane Doe", "email": "...", "role": "user" }
  }
}
```
Also sets `refreshToken` cookie.

---

### POST `/user/resend?email=jane@example.com`
Resend the registration OTP.

> Rate-limited: 3 requests / 5 min per IP

**Response `200`** — `{ "message": "OTP resent successfully" }`

---

### POST `/user/forget-password`
Send a password-reset OTP to email.

**Request body** — `{ "email": "jane@example.com" }`

---

### POST `/user/verify-forget-otp`
Verify the reset OTP. Returns a short-lived `resetGrant` token.

**Request body** — `{ "email": "jane@example.com", "otp": "829341" }`

**Response `200`** — `{ "data": { "resetGrant": "<64-char hex>" } }`

---

### POST `/user/reset-password`
Complete the password reset using the grant from the previous step.

**Request body**
```json
{
  "email": "jane@example.com",
  "resetGrant": "<64-char hex>",
  "newPassword": "NewPass456"
}
```

---

### GET `/user/me`  `🔒 Auth required`
Fetch the currently authenticated user's profile.

**Response `200`**
```json
{
  "data": {
    "_id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1 555-0100",
    "address": "Los Angeles, CA",
    "role": "user",
    "avatar": { "url": "https://...", "publicId": "..." },
    "isEmailVerified": true
  }
}
```

---

### GET `/user/my-profile`  `🔒 Auth required`
Alias for `/user/me`.

---

### POST `/user/update`  `🔒 Auth required`
Update own profile (name, phone, address, avatar).

**Request body** *(all optional)*
```json
{
  "name": "Jane Smith",
  "phone": "+1 555-9999",
  "address": "San Diego, CA",
  "avatar": { "url": "https://...", "publicId": "cloud_id" }
}
```

---

### DELETE `/user/me`  `🔒 Auth required`
Soft-delete own account.

---

## 3. Job Posts

### GET `/job/all`
List all active job posts. Supports pagination, filtering, sorting, and search.

| Query param | Type | Example | Description |
|---|---|---|---|
| `page` | `number` | `1` | Page number (default 1) |
| `limit` | `number` | `10` | Items per page (default 10) |
| `searchTerm` | `string` | `nurse` | Full-text search across title, hospital |
| `sort` | `string` | `-createdAt` | Sort field, `-` prefix = descending |
| `jobType` | `string` | `contract` | Filter by job type |
| `category` | `string` | `ICU` | Filter by category |
| `profession` | `string` | `RN` | Filter by profession |

**Response `200`**
```json
{
  "data": [
    {
      "_id": "...",
      "title": "ICU RN - Night Shift",
      "hospitalName": "Cedars-Sinai",
      "address": "Los Angeles, CA",
      "jobType": "contract",
      "salaryMin": 60,
      "salaryMax": 80,
      "salaryPeriod": "hour",
      "currency": "USD",
      "hoursPerWeek": 36,
      "deadline": "2026-08-01T00:00:00.000Z",
      "category": "ICU",
      "profession": "RN",
      "description": "...",
      "createdAt": "2026-06-30T..."
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPage": 5 }
}
```

---

### GET `/job/single/:id`
Fetch a single job post by MongoDB ObjectId.

**Path param** — `id` : MongoDB ObjectId

**Response `200`** — single job object (same shape as list item above)

**Response `404`** — job not found or deleted

---

## 4. Job Applications (3-Step Flow)

### Step 1 — POST `/apply/personal-info`
Submit personal/contact info. Creates the application record and returns `appliedJobId`.
For **local** applications pass `jobPostId`; omit it for **international** applications.

**Request body**
```json
{
  "applyType": "local",
  "jobPostId": "667abc...",
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1 310-555-0100",
  "country": "USA",
  "state": "CA",
  "city": "Los Angeles",
  "gender": "Female",
  "profession": "RN",
  "discipline": "Critical Care",
  "specialty": "ICU",
  "secondarySpecialty": "ER"
}
```

> `applyType` : `"local"` | `"international"`
> `gender` : `"Male"` | `"Female"` | `"Other"`
> `jobPostId` is **required** when `applyType = "local"`, forbidden when `"international"`

**Response `201`**
```json
{
  "data": {
    "appliedJobId": "668xyz...",
    "personalInfoId": "668abc..."
  }
}
```

---

### Step 2 — POST `/apply/create/:id`
Submit professional licenses and certifications. `:id` is the `appliedJobId` from Step 1.

**Request body**
```json
{
  "certifications": ["BLS", "ACLS"],
  "licenses": [
    {
      "medicalAssistant": "Dr. Smith",
      "city": "Los Angeles",
      "state": "CA",
      "licenseType": "RN License"
    }
  ]
}
```

**Response `201`** — `{ "data": { "appliedJobId": "..." } }`

---

### Step 3 — PUT `/apply/education-info/:id`
Submit education and employment history. `:id` is the `appliedJobId`.

**Request body**
```json
{
  "education": [
    {
      "degree": "BSN",
      "school": "UCLA",
      "year": "2020",
      "major": "Nursing",
      "city": "Los Angeles",
      "country": "USA"
    }
  ],
  "employment": [
    {
      "company": "Cedars-Sinai",
      "specialty": "ICU",
      "country": "USA",
      "state": "CA",
      "city": "Los Angeles",
      "startDate": "2020-06-01",
      "endDate": "2024-01-01"
    }
  ]
}
```

**Response `200`** — `{ "message": "Application completed successfully" }`

---

## 5. Blogs

### GET `/blog/all`
List all published blogs.

| Query param | Type | Description |
|---|---|---|
| `page` | `number` | Pagination page |
| `limit` | `number` | Items per page |
| `searchTerm` | `string` | Search in title / description |
| `category` | `string` | Filter by category |
| `sort` | `string` | Sort field |

**Response `200`**
```json
{
  "data": [
    {
      "_id": "...",
      "blogTitle": "5 Tips for ICU Nurses",
      "category": "Nursing",
      "url": "5-tips-for-icu-nurses",
      "banner": "https://...",
      "tags": ["icu", "tips"],
      "metaDescription": "...",
      "createdAt": "..."
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 25, "totalPage": 3 }
}
```

---

### GET `/blog/single/:id`
Fetch a blog by **MongoDB ObjectId** OR **URL slug**.

**Path param** — `id` : ObjectId or slug string

**Response `200`** — single blog object with full `description`

---

### GET `/blog/category/blogs`
Get all distinct categories that have at least one published blog.

**Response `200`** — `{ "data": ["Nursing", "Healthcare", "Tips"] }`

---

## 6. Staffing Solutions

### GET `/staffing/all`
List all staffing solution pages.

**Response `200`**
```json
{
  "data": [
    {
      "_id": "...",
      "type": "staffing_solutions",
      "bannerTitle": "Healthcare Staffing",
      "bannerSubTitle": "...",
      "pageTitle": "...",
      "url": "staffing-solutions",
      "metaDescription": "..."
    }
  ]
}
```

---

### GET `/staffing/all-faq`
List all FAQs across all staffing pages.

**Response `200`** — array of FAQ objects `{ question, answer, staffingId }`

---

### GET `/staffing/:id`
Fetch a single staffing solution page with full detail.

**Response `200`** — full staffing object including `whatWeDo`, `guaranteesDescription`, etc.

---

## 7. Static Content

### GET `/about`
Get the About Us page content.

**Response `200`**
```json
{ "data": { "type": "about", "content": "<html or text>", "updatedAt": "..." } }
```

---

### GET `/terms`
Get the Terms and Conditions content.

---

### GET `/privacy`
Get the Privacy Policy content.

---

## 8. Banners

### GET `/banner`
Get all active banners.

**Response `200`**
```json
{
  "data": [
    {
      "_id": "...",
      "title": "Join Our Team",
      "subtitle": "Healthcare staffing made simple",
      "image": "https://...",
      "link": "/jobs",
      "isActive": true
    }
  ]
}
```

---

## 9. Contact / Enquiry

### POST `/contact/create`
Submit a contact/enquiry form. No authentication required. Triggers an admin notification.

**Request body**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1 555-0199",
  "subject": "Staffing Enquiry",
  "message": "I would like to know more about your staffing services..."
}
```

**Response `201`** — `{ "message": "Your message has been sent successfully" }`

---

## 10. Values / Dropdown Options

### GET `/value/all/:group`
Fetch all active dropdown values for a specific group.

**Path param** — `group` : one of the groups listed below

| Group slug | Meaning |
|---|---|
| `Category` | Job / blog categories |
| `Profession` | Nurse profession types |
| `Discipline` | Clinical disciplines |
| `Specialty` | Medical specialties |
| `License` | License types |
| `Job-type` | Employment types |

**Response `200`**
```json
{
  "data": [
    { "_id": "...", "group": "Profession", "label": "RN", "logo": null },
    { "_id": "...", "group": "Profession", "label": "LPN", "logo": null }
  ]
}
```

---

## 11. Feedback (Logged-in users)

### POST `/feedback/create`  `🔒 Auth required (user / admin / super_admin)`
Submit feedback. Name and email are auto-filled from the authenticated user record.

**Request body**
```json
{
  "message": "Great staffing experience!",
  "rating": 5
}
```

**Response `201`** — `{ "message": "Feedback submitted successfully" }`

---

## 12. File Upload

### POST `/upload`
Upload a single file to Cloudinary.

**Content-Type:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `file` | `File` | The file to upload (image, PDF, etc.) |

**Response `200`**
```json
{
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "cenm/uploads/abc123"
  }
}
```

> Legacy path `/uploded` also works (kept for backward compatibility).

---

## Error Reference

| HTTP Code | Meaning |
|---|---|
| `400` | Bad request / validation error |
| `401` | Not authenticated or token expired |
| `403` | Forbidden — insufficient role |
| `404` | Resource not found |
| `409` | Conflict — resource already exists |
| `410` | Gone — OTP expired |
| `422` | Unprocessable entity — Zod schema failure |
| `429` | Too many requests — rate limited |
| `500` | Internal server error |

**Error envelope**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error",
  "errorMessages": [
    { "path": "body.email", "message": "Invalid email address" }
  ]
}
```
