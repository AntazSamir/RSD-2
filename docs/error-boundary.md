# Error Boundary Component

## Overview

The Error Boundary component is a React error boundary that catches JavaScript errors anywhere in the child component tree, logs those errors, and displays a fallback UI instead of the component tree that crashed.

## Purpose

Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed. Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them.

## Implementation

The Error Boundary component is implemented as a class component that extends React.Component and implements the following lifecycle methods:

1. `static getDerivedStateFromError(error)`: This lifecycle method is called after an error has been thrown by a descendant component. It receives the error that was thrown as a parameter and should return a value to update state.

2. `componentDidCatch(error, errorInfo)`: This lifecycle method is called after an error has been thrown by a descendant component. It receives two parameters:
   - `error`: The error that was thrown
   - `errorInfo`: An object with a `componentStack` property containing information about the component stack at the time of the error

## Usage

```jsx
import { ErrorBoundary } from "@/components/error-boundary";

function MyComponent() {
  return (
    <ErrorBoundary>
      <PotentiallyFailingComponent />
    </ErrorBoundary>
  );
}
```

## Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| children | ReactNode | The components to be wrapped by the error boundary | Required |
| fallback | ReactNode | Optional custom fallback UI to display when an error occurs | Default error UI |

## Features

1. **Error Catching**: Catches errors in the component tree below it
2. **Error Logging**: Logs errors to the console for debugging purposes
3. **Fallback UI**: Displays a user-friendly error message when an error occurs
4. **Retry Functionality**: Provides a "Try again" button to reset the error state
5. **Custom Fallback**: Supports custom fallback UI through the `fallback` prop

## Error Handling

When an error is caught, the component will:
1. Log the error and component stack to the console
2. Display a fallback UI with the error message
3. Provide a "Try again" button to reset the error state

## Example with Custom Fallback

```jsx
import { ErrorBoundary } from "@/components/error-boundary";

const CustomErrorUI = () => (
  <div className="p-4 bg-red-100 border border-red-400 rounded">
    <h2>Something went wrong!</h2>
    <p>Please try refreshing the page.</p>
  </div>
);

function MyComponent() {
  return (
    <ErrorBoundary fallback={<CustomErrorUI />}>
      <PotentiallyFailingComponent />
    </ErrorBoundary>
  );
}
```

## Best Practices

1. **Placement**: Wrap sections of your application that might fail independently
2. **Granularity**: Don't wrap your entire application in a single error boundary
3. **Logging**: Implement proper error logging to a monitoring service in production
4. **User Experience**: Provide clear error messages and recovery options
5. **Testing**: Test error scenarios to ensure the error boundary works as expected