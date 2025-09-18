# Test Plan for Restaurant Dashboard

## Overview
This test plan outlines the testing strategy for identifying and resolving bugs in the Restaurant Dashboard project. The plan covers unit testing, integration testing, and end-to-end testing.

## Test Environment Setup

1. Install all project dependencies:
   ```
   npm install
   ```

2. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   BREVO_SMTP_HOST=smtp-relay.sendinblue.com
   BREVO_SMTP_PORT=587
   BREVO_SMTP_USER=your_brevo_login
   BREVO_SMTP_PASS=your_brevo_password
   BREVO_SENDER_EMAIL=sender@yourdomain.com
   BREVO_SENDER_NAME="Restaurant Dashboard"
   ```

## Unit Tests

### 1. Authentication Tests
- Test `signUp` function with valid and invalid credentials
- Test `signIn` function with valid and invalid credentials
- Test `signOut` function
- Test `resetPassword` function
- Test auth context initialization

### 2. Email Service Tests
- Test `sendEmail` function with valid and invalid configurations
- Test email template functions
- Test Brevo configuration validation

### 3. UI Component Tests
- Test Button component with different variants and sizes
- Test other UI components in the `components/ui/` directory

## Integration Tests

### 1. Supabase Integration Tests
- Test database connection
- Test authentication flow with Supabase
- Test data fetching from Supabase

### 2. Email Service Integration Tests
- Test sending emails through Brevo SMTP
- Test password reset email flow
- Test reservation confirmation email flow
- Test order confirmation email flow

### 3. API Route Tests
- Test `/api/send-test-email` endpoint
- Test `/api/send-password-reset` endpoint

## End-to-End Tests

### 1. User Authentication Flow
- Test sign-up process
- Test sign-in process
- Test password reset flow
- Test protected route access

### 2. Dashboard Functionality
- Test navigation between different dashboard sections
- Test order management features
- Test inventory management features
- Test menu management features
- Test customer management features
- Test staff management features

### 3. Email Notification Flow
- Test reservation confirmation emails
- Test order confirmation emails
- Test password reset emails

## Test Cases for Identified Bugs

### 1. Environment Variable Validation
- Test application startup with missing Supabase credentials
- Test email service with missing Brevo credentials
- Test graceful error handling when environment variables are missing

### 2. Error Handling
- Test API routes with invalid input data
- Test API routes with server errors
- Verify that sensitive information is not exposed in error messages

### 3. Password Reset Functionality
- Test password reset with valid email
- Test password reset with invalid email
- Test password reset when custom email fails
- Test password reset when Supabase reset fails

## Test Data

### 1. Test Users
- Create test users with different roles (manager, chef, waiter)
- Create test data for each user role

### 2. Test Orders
- Create sample orders with different statuses
- Create orders with special requests

### 3. Test Inventory
- Create sample inventory items
- Create low stock scenarios

### 4. Test Menu
- Create sample menu items
- Create menu items in different categories

## Test Execution

### 1. Unit Tests
```
npm run test
```

### 2. Watch Mode
```
npm run test:watch
```

### 3. Coverage Report
```
npm run test:coverage
```

## Reporting

### 1. Test Results
- Document all test results
- Identify failing tests and their causes
- Prioritize bugs based on severity

### 2. Bug Reports
- Create detailed bug reports for each identified issue
- Include steps to reproduce
- Include expected vs actual behavior
- Include screenshots where applicable

## Continuous Integration
- Set up CI pipeline to run tests automatically
- Configure test coverage requirements
- Set up automated reporting

## Conclusion
This test plan provides a comprehensive approach to identifying and resolving bugs in the Restaurant Dashboard project. By following this plan, we can ensure that the application is reliable, secure, and provides a good user experience.