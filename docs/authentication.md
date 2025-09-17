# Authentication Implementation

This document explains how authentication is implemented in the restaurant dashboard using Supabase Auth.

## Overview

The authentication system uses Supabase Auth with a React Context provider to manage the user's authentication state across the application.

## Key Components

### 1. Supabase Client (`lib/supabase/client.ts`)

Initializes the Supabase client with the project URL and anon key from environment variables.

### 2. Auth Context (`lib/supabase/auth-context.tsx`)

Provides the authentication state and methods throughout the application:

- `user`: The current authenticated user or null
- `signUp`: Function to create a new user account
- `signIn`: Function to sign in with email and password
- `signOut`: Function to sign out the current user
- `loading`: Loading state during authentication operations

### 3. Protected Route Component (`components/protected-route.tsx`)

A wrapper component that ensures only authenticated users can access certain pages. It redirects unauthenticated users to the sign-in page.

### 4. Logout Button (`components/logout-button.tsx`)

A reusable button component that handles the sign-out process.

## Authentication Flow

1. **Sign Up**: Users can create an account using email and password or Google OAuth
2. **Sign In**: Users can sign in using email and password or Google OAuth
3. **Session Management**: The AuthProvider automatically manages the user's session
4. **Protected Routes**: Pages that require authentication are wrapped with the ProtectedRoute component
5. **Sign Out**: Users can sign out using the LogoutButton component

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Implementation Details

### AuthProvider

The AuthProvider component should be placed at the root of the application to make the authentication state available everywhere. It automatically handles:

- Checking for an existing session on app load
- Listening for auth state changes
- Updating the user state accordingly

### Protected Routes

To protect a page, wrap it with the ProtectedRoute component:

```tsx
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  )
}
```

### Using Auth State in Components

To access the authentication state in any component:

```tsx
import { useAuth } from "@/lib/supabase/auth-context"

export default function MyComponent() {
  const { user, signIn, signUp, signOut, loading } = useAuth()
  
  // Use the auth methods and state as needed
}
```

## Error Handling

Authentication errors are handled gracefully and displayed to the user through error messages in the sign-in and sign-up forms.

## Session Persistence

Supabase automatically persists the user's session in localStorage, so users remain signed in even after refreshing the page or closing the browser.