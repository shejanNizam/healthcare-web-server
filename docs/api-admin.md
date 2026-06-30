# CENM Healthcare — Admin Dashboard API

> **Base URL:** `http://localhost:5000/api/v1`
>
> **Auth header:** `Authorization: Bearer <accessToken>`
>
> All admin endpoints require the authenticated user to have role `admin` or `super_admin`.
> Responses follow the envelope: `{ "success", "statusCode", "message", "data", "meta" }`

---

## Table of Contents

1. [Admin Authentication](#1-admin-authentication)
2. [Dashboard Overview](#2-dashboard-overview)
3. [User Management](#3-user-management)
4. [Job Posts](#4-job-posts)
5. [Applications — Local Jobs](#5-applications--local-jobs)
6. [Applications — International](#6-applications--international)
7. [Values / Dropdown Management](#7-values--dropdown-management)
8. [Blogs](#8-blogs)
9. [Staffing Solutions](#9-staffing-solutions)
10. [Static Content](#10-static-content)
11. [Banners](#11-banners)
12. [Contact / Enquiries](#12-contact--enquiries)
13. [Notifications](#13-notifications)
14. [Feedback](#14-feedback)
15. [Payment History](#15-payment-history)
16. [Charge Settings](#16-charge-settings)
17. [Community](#17-community)
18. [File Upload](#18-file-upload)

---

## 1. Admin Authentication

Admin and super-admin accounts are seeded automatically on server start. They log in through the same auth endpoints as regular users.

### POST `/auth/login`  *(shared with website)*
Login with email and password.

**Request body**
```json
{
  "email": "admin@cenm.com",
  "password": "AdminPass123"
}
```

**Response `200`**
```json
{
  "data": {
    "accessToken": "<jwt>",
    "user": { "_id": "...", "name": "Admin", "email": "admin@cenm.com", "role": "admin" }
  }
}
```

---

### POST `/auth/refresh-token`
Get a new `accessToken` using the `refreshToken` cookie.

---

### POST `/auth/logout`
Clear refresh token cookie.

---

### POST `/auth/change-password`  `🔒 Auth required`
Change own admin password.

**Request body** — `{ "oldPassword": "...", "newPassword": "..." }`

---

## 2. Dashboard Overview

### GET `/dashboard/over-view`  `🔒 Admin`
Returns aggregated counts for the main dashboard.

**Response `200`**
```json
{
  "data": {
    "totalJobs": 24,
    "totalApplicants": 183,
    "totalContacts": 47,
    "totalUsers": 312
  }
}
```

---

### GET `/dashboard/:year`  `🔒 Admin`
Applicant count breakdown by month for the given year.

**Path param** — `year` : 4-digit year, e.g. `2026`

**Response `200`**
```json
{
  "data": [
    { "month": "Jan", "count": 12 },
    { "month": "Feb", "count": 8 },
    { "month": "Mar", "count": 21 },
    ...
    { "month": "Dec", "count": 5 }
  ]
}
```
All 12 months are always present; months with no applications return `count: 0`.

---

## 3. User Management

### GET `/dashboard/user-list`  `🔒 Admin`
Paginated list of all registered users. Supports the same query params as `/user/all-users`.

| Query param | Type | Description |
|---|---|---|
| `page` | `number` | Page number (default 1) |
| `limit` | `number` | Items per page (default 10) |
| `searchTerm` | `string` | Search by name or email |
| `sort` | `string` | Sort field |
| `role` | `string` | Filter by role: `user` / `admin` / `super_admin` |
| `status` | `string` | Filter by status: `active` / `blocked` |

**Response `200`**
```json
{
  "data": [
    {
      "_id": "...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "status": "active",
      "phone": "+1 555-0100",
      "address": "Los Angeles, CA",
      "isEmailVerified": true,
      "createdAt": "2026-06-30T..."
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 312, "totalPage": 32 }
}
```

---

### GET `/user/all-users`  `🔒 Admin`
Same as `/dashboard/user-list`. Both endpoints call the same controller.

---

### GET `/user/:id`  `🔒 Admin`
Fetch a single user by MongoDB ObjectId.

**Response `200`** — single user object

**Response `404`** — user not found

---

### PATCH `/user/:id`  `🔒 Admin`
Update a user's fields (role, status, name, phone, etc.).

**Request body** *(all optional)*
```json
{
  "name": "Jane Smith",
  "role": "admin",
  "status": "blocked",
  "phone": "+1 555-9999"
}
```

---

### DELETE `/user/:id`  `🔒 Admin`
Soft-delete a user account (`isDeleted: true`). Does not permanently remove the record.

---

## 4. Job Posts

### GET `/job/all`  *(public, but admin uses it too)*
Paginated job list with filters.

| Query param | Type | Description |
|---|---|---|
| `page` | `number` | Page |
| `limit` | `number` | Per page |
| `searchTerm` | `string` | Search title / hospital |
| `jobType` | `string` | `contract` / `part-time` / `full-time` / `per-diem` |
| `category` | `string` | Category filter |
| `profession` | `string` | Profession filter |
| `sort` | `string` | e.g. `-createdAt` |

---

### GET `/job/single/:id`  *(public)*
Fetch a job post by its ObjectId.

---

### POST `/job/create`  `🔒 Admin`
Create a new job post.

**Request body**
```json
{
  "hospitalName": "Cedars-Sinai Medical Center",
  "title": "ICU RN - Night Shift",
  "address": "8700 Beverly Blvd, Los Angeles, CA 90048",
  "deadline": "2026-09-01",
  "category": "ICU",
  "profession": "RN",
  "jobType": "contract",
  "salaryMin": 60,
  "salaryMax": 80,
  "currency": "USD",
  "salaryPeriod": "hour",
  "vacancy": 3,
  "startDate": "2026-08-01",
  "hoursPerWeek": 36,
  "description": "We are looking for an experienced ICU RN...",
  "summary": "Night-shift ICU RN at Cedars-Sinai",
  "responsibilities": ["Monitor patients", "Administer medication"],
  "requirements": ["California RN License", "2+ years ICU experience"],
  "benefits": ["Health insurance", "401k"],
  "companyLogo": "https://..."
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `hospitalName` | string | ✅ | |
| `title` | string | ✅ | |
| `jobType` | enum | ✅ | `contract` / `part-time` / `full-time` / `per-diem` |
| `hoursPerWeek` | number | ✅ | |
| `description` | string | ✅ | Min 50 characters |
| `salaryPeriod` | enum | ✅ | `hour` / `day` / `week` / `month` / `year` (default `year`) |
| `salaryMin` | number | ❌ | Must be ≤ `salaryMax` |
| `salaryMax` | number | ❌ | |
| `currency` | string | ❌ | Default `"USD"` |

**Response `201`** — created job object

---

### POST `/job/update/:id`  `🔒 Admin`
Update an existing job post. All body fields are optional.

**Path param** — `id` : ObjectId of the job

**Request body** — same fields as create, all optional

**Response `200`** — updated job object

---

### DELETE `/job/delete/:id`  `🔒 Admin`
Soft-delete a job post (`isDeleted: true`).

**Response `200`** — `{ "message": "Job deleted successfully" }`

---

## 5. Applications — Local Jobs

### GET `/apply/all/:id`  `🔒 Admin`
Get all applications for a specific job post. `:id` is the job post ObjectId.

**Response `200`**
```json
{
  "data": [
    {
      "_id": "...",
      "applyType": "local",
      "applicantName": "Jane Doe",
      "applicantEmail": "jane@example.com",
      "applicantPhone": "+1 310-555-0100",
      "jobPostId": "...",
      "isCompleted": true,
      "certifications": ["BLS", "ACLS"],
      "personalInfoId": { "_id": "...", "country": "USA", "state": "CA", "city": "LA", ... }
    }
  ]
}
```

---

### GET `/apply/single/:id`  `🔒 Admin`
Get a single application's full detail, including personal info, licenses, education, and employment history.

**Path param** — `id` : ObjectId of the applied job record

**Response `200`** — full application object

---

## 6. Applications — International

### GET `/dashboard/all-international-application`  `🔒 Admin`
List all international (no-job-post) applications.

| Query param | Description |
|---|---|
| `page` | Page number |
| `limit` | Items per page |
| `searchTerm` | Search by name / email |

**Response `200`** — paginated list of applications where `applyType = "international"`

---

### GET `/dashboard/single-international-application/:id`  `🔒 Admin`
Get full detail of one international application.

**Path param** — `id` : ObjectId of the applied job record

---

## 7. Values / Dropdown Management

Values are the seeded options used in dropdowns across the frontend (categories, professions, disciplines, specialties, license types, job types).

### GET `/value/all/:group`  *(public)*
List all values for a group.

**Path param** — `group` : `Category` | `Profession` | `Discipline` | `Specialty` | `License` | `Job-type`

---

### POST `/value/create/:group`  `🔒 Admin`
Add a new dropdown option to a group.

**Path param** — `group` : group name (see above)

**Request body**
```json
{
  "label": "Cardiology",
  "logo": "https://..."
}
```

> `logo` is **required** when `group = "Category"`.

**Response `201`** — created value object

---

### POST `/value/update/:group/:id`  `🔒 Admin`
Update an existing dropdown value.

**Path params** — `group`, `id`

**Request body** *(all optional)*
```json
{
  "label": "Cardiology & Vascular",
  "logo": "https://..."
}
```

---

### DELETE `/value/delete/:id`  `🔒 Admin`
Soft-delete a dropdown value.

---

## 8. Blogs

### GET `/blog/all`  *(public)*
Paginated blog list with filters.

### GET `/blog/single/:id`  *(public)*
Fetch by ObjectId or URL slug.

### GET `/blog/category/blogs`  *(public)*
All distinct categories.

---

### POST `/blog/create`  `🔒 Admin`
Create a new blog post.

**Request body**
```json
{
  "blogTitle": "5 Tips for ICU Nurses",
  "category": "Nursing",
  "description": "<Full HTML or markdown content>",
  "banner": "https://res.cloudinary.com/...",
  "metaDescription": "Top tips for ICU nurses in 2026",
  "pageTitle": "ICU Nursing Tips | CENM Healthcare",
  "url": "5-tips-for-icu-nurses",
  "tags": ["icu", "nursing", "tips"]
}
```

| Field | Required |
|---|---|
| `blogTitle` | ✅ |
| `category` | ✅ |
| `description` | ✅ |
| `banner` | ✅ (image URL) |
| `metaDescription` | ✅ |
| `pageTitle` | ✅ |
| `url` | ✅ (unique slug) |
| `tags` | ❌ |

**Response `201`** — created blog object

---

### POST `/blog/edit/:id`  `🔒 Admin`
Edit an existing blog post. All fields optional.

**Path param** — `id` : ObjectId of the blog

---

### DELETE `/blog/delete/:id`  `🔒 Admin`
Soft-delete a blog (`isDeleted: true`).

---

## 9. Staffing Solutions

### GET `/staffing/all`  *(public)*
### GET `/staffing/all-faq`  *(public)*
### GET `/staffing/:id`  *(public)*

---

### POST `/staffing/create`  `🔒 Admin`
Create a staffing solution page.

**Request body**
```json
{
  "type": "staffing_solutions",
  "bannerTitle": "Healthcare Staffing Solutions",
  "bannerSubTitle": "Connecting top talent with leading hospitals",
  "pageTitle": "Staffing Solutions | CENM",
  "url": "staffing-solutions",
  "metaDescription": "...",
  "guaranteesDescription": ["24/7 support", "Certified staff only"],
  "patientCareDescription": ["Patient-first approach"],
  "serviceSuccessDescription": ["99% placement rate"],
  "specialityDescription": ["ICU", "ER", "NICU"],
  "standsDescription": ["We stand for excellence"],
  "whatWeDo": ["Place nurses", "Manage payroll"]
}
```

| Field | Required | Notes |
|---|---|---|
| `type` | ✅ | `workforce_solutions` / `staffing_solutions` |
| `bannerTitle` | ✅ | |
| `bannerSubTitle` | ✅ | |
| `pageTitle` | ✅ | |
| `url` | ✅ | Unique slug |
| `metaDescription` | ✅ | |
| `*Description` / `whatWeDo` | ❌ | String arrays |

**Response `201`** — created staffing object

---

### POST `/staffing/update/:id`  `🔒 Admin`
Update core fields of a staffing page.

**Request body** — same as create, all optional

---

### PATCH `/staffing/FQA/:id`  `🔒 Admin`
Add or remove a single FAQ on a staffing page.

**Path param** — `id` : ObjectId of the staffing document

**Request body**
```json
{
  "action": "add",
  "question": "How fast can you place a nurse?",
  "answer": "We can place staff within 24–48 hours for urgent needs."
}
```
```json
{
  "action": "delete",
  "faqId": "668faq..."
}
```

> `action` : `"add"` | `"delete"`

---

### PATCH `/staffing/what_we_do/:id`  `🔒 Admin`
Add or remove a "What We Do" bullet point.

**Request body**
```json
{
  "action": "add",
  "item": "Provide per-diem staffing solutions"
}
```
```json
{
  "action": "delete",
  "item": "Provide per-diem staffing solutions"
}
```

---

## 10. Static Content

### GET `/about`  *(public)*
### GET `/terms`  *(public)*
### GET `/privacy`  *(public)*

---

### POST `/about/update`  `🔒 Admin`
Create or replace the About Us content (upsert).

**Request body**
```json
{
  "content": "<h1>About CENM Healthcare</h1><p>...</p>"
}
```

**Response `200`** — updated content document

---

### POST `/terms/update`  `🔒 Admin`
Upsert Terms and Conditions content.

**Request body** — `{ "content": "..." }`

---

### POST `/privacy/update`  `🔒 Admin`
Upsert Privacy Policy content.

**Request body** — `{ "content": "..." }`

---

## 11. Banners

### GET `/banner`  *(public)*
List active banners.

---

### POST `/banner/create`  `🔒 Admin`
Create a new banner.

**Request body**
```json
{
  "title": "Join Our Team",
  "subtitle": "Healthcare staffing made simple",
  "image": "https://res.cloudinary.com/...",
  "link": "/jobs",
  "isActive": true
}
```

**Response `201`** — created banner object

---

### PATCH `/banner/update`  `🔒 Admin`
Update an existing banner. The `id` is passed in the request body (not the URL).

**Request body**
```json
{
  "id": "668banner...",
  "title": "New Title",
  "isActive": false
}
```

---

### DELETE `/banner/delete`  `🔒 Admin`
Soft-delete a banner. The `id` is passed as a query param or in the request body.

**Query param** — `id` : ObjectId of the banner
**— or —**
**Request body** — `{ "id": "668banner..." }`

---

## 12. Contact / Enquiries

### POST `/contact/create`  *(public)*
See Website API docs.

---

### GET `/contact/all`  `🔒 Admin`
Paginated list of all contact submissions.

| Query param | Description |
|---|---|
| `page` | Page number |
| `limit` | Items per page |
| `searchTerm` | Search by name / email |
| `status` | Filter: `unread` / `read` |

**Response `200`**
```json
{
  "data": [
    {
      "_id": "...",
      "name": "John Smith",
      "email": "john@example.com",
      "phone": "+1 555-0199",
      "subject": "Staffing Enquiry",
      "message": "I would like to know...",
      "status": "unread",
      "createdAt": "..."
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 47 }
}
```

---

### GET `/contact/single/:id`  `🔒 Admin`
Fetch a single contact submission. **Automatically marks it as `"read"`.**

**Path param** — `id` : ObjectId of the contact record

**Response `200`** — single contact object with `status: "read"`

---

## 13. Notifications

Notifications are auto-created when:
- A new job application is submitted (Step 1)
- A new contact form is submitted

### GET `/notification`  `🔒 Admin`
Get all admin notifications, latest first.

**Response `200`**
```json
{
  "data": [
    {
      "_id": "...",
      "title": "New Application",
      "message": "Jane Doe has applied for ICU RN - Night Shift",
      "isRead": false,
      "createdAt": "..."
    }
  ]
}
```

---

### PATCH `/notification/read/:id`  `🔒 Admin`
Mark a notification as read.

**Path param** — `id` : ObjectId of the notification

**Response `200`** — updated notification with `isRead: true`

---

## 14. Feedback

### GET `/feedback/all`  `🔒 Admin`
Get all user feedback submissions.

**Response `200`**
```json
{
  "data": [
    {
      "_id": "...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "message": "Great staffing experience!",
      "rating": 5,
      "createdAt": "..."
    }
  ]
}
```

---

### POST `/feedback/create`  `🔒 Auth (user / admin / super_admin)`
See Website API docs. Admin can also submit feedback.

---

## 15. Payment History

### GET `/payment/history`  `🔒 Admin`
Paginated list of all payment records.

| Query param | Description |
|---|---|
| `page` | Page number |
| `limit` | Items per page |
| `searchTerm` | Search by user / transaction ID |
| `status` | Filter: `pending` / `completed` / `failed` / `refunded` |

**Response `200`**
```json
{
  "data": [
    {
      "_id": "...",
      "userId": { "_id": "...", "name": "Jane Doe", "email": "..." },
      "amount": 150.00,
      "currency": "USD",
      "status": "completed",
      "transactionId": "txn_abc123",
      "createdAt": "..."
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 88 }
}
```

---

## 16. Charge Settings

Charge settings control platform service fees or rate configurations.

### GET `/charge`  `🔒 Admin`
Get the current charge configuration.

**Response `200`**
```json
{
  "data": {
    "_id": "...",
    "amount": 15.00,
    "currency": "USD",
    "description": "Platform service fee",
    "updatedAt": "..."
  }
}
```

---

### PATCH `/charge/update`  `🔒 Admin`
Update the charge settings.

**Request body** *(all optional)*
```json
{
  "amount": 20.00,
  "currency": "USD",
  "description": "Updated platform fee"
}
```

**Response `200`** — updated charge object

---

## 17. Community

### GET `/community`  `🔒 Admin`
List all community members or entries.

---

### GET `/community/details`  `🔒 Admin`
Get detailed info for a specific community entry.

**Query param** — `id` : ObjectId

---

### DELETE `/community/delete`  `🔒 Admin`
Delete a community entry. Pass `id` as a query param or in request body.

**Query param** — `id` : ObjectId  
**— or —**  
**Request body** — `{ "id": "..." }`

---

## 18. File Upload

### POST `/upload`  *(shared with website)*
Upload a file to Cloudinary. Used for blog banners, company logos, avatars, etc.

**Content-Type:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `file` | File | The file to upload |

**Response `200`**
```json
{
  "data": {
    "url": "https://res.cloudinary.com/cenm/image/upload/v.../banner.jpg",
    "publicId": "cenm/uploads/banner"
  }
}
```

> Also available at `/uploded` (legacy alias).

---

## Rate Limits

| Route group | Limit |
|---|---|
| `/auth/login`, `/auth/forgot-password`, `/auth/change-password` | 10 req / 15 min per IP |
| `/user/signup`, `/user/forget-password` | 5 req / 15 min per IP |
| `/user/resend` | 3 req / 5 min per IP |
| All other endpoints | No default rate limit |

---

## Error Reference

| HTTP Code | Meaning |
|---|---|
| `400` | Bad request / validation error |
| `401` | Not authenticated or token expired |
| `403` | Forbidden — insufficient role (not `admin` / `super_admin`) |
| `404` | Resource not found |
| `409` | Conflict — duplicate resource |
| `410` | Gone — OTP expired |
| `422` | Zod validation failure |
| `429` | Too many requests — rate limited |
| `500` | Internal server error |

**Error envelope**
```json
{
  "success": false,
  "statusCode": 403,
  "message": "You are not authorized to access this resource",
  "errorMessages": []
}
```

---

## Common Query Params (Pagination / Filter)

All list endpoints that use `QueryBuilder` support:

| Param | Type | Description |
|---|---|---|
| `page` | `number` | Page number, default `1` |
| `limit` | `number` | Items per page, default `10` |
| `sort` | `string` | Field to sort by; prefix `-` for descending (e.g. `-createdAt`) |
| `searchTerm` | `string` | Partial match search across indexed text fields |
| Any model field | `string` | Exact filter (e.g. `status=active&role=admin`) |

**Meta response shape**
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 312,
    "totalPage": 32
  }
}
```
