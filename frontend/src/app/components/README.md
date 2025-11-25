# Reusable Components

## Toast Notifications

A reusable toast notification system matching the fire-plan module's design - clean, slick, and consistent across the app.

### Features
- ✅ 4 toast types: `success`, `error`, `warning`, `info`
- ✅ Auto-dismiss after 3.5 seconds (configurable)
- ✅ Manual dismiss with close button
- ✅ Smooth slide-in animation from right
- ✅ Fixed top-right positioning
- ✅ Stacked notifications with spacing
- ✅ Consistent with app theme colors

### Usage

#### 1. Import the hook and component

```tsx
import ToastContainer from '@/app/components/Toast';
import { useToast } from '@/app/hooks/useToast';
```

#### 2. Use the hook in your component

```tsx
export default function MyPage() {
  const { toasts, addToast, removeToast } = useToast();
  
  // Your component logic...
  
  return (
    <div>
      {/* Your page content */}
      
      {/* Toast container at the end */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
```

#### 3. Trigger toasts

```tsx
// Success toast (green)
addToast('Fire plan saved successfully', 'success');

// Error toast (red)
addToast('Failed to save report', 'error');

// Warning toast (orange/yellow)
addToast('Please check all required fields', 'warning');

// Info toast (blue)
addToast('Loading data...', 'info');

// With custom duration (in milliseconds)
addToast('This will disappear in 5 seconds', 'info', 5000);
```

### Design Specs

- **Position**: Fixed top-right (`top-4 right-4`)
- **Width**: Min 260px, Max ~400px
- **Animation**: Slide in from right (0.3s ease-out)
- **Auto-dismiss**: 3.5 seconds default
- **Z-index**: 50 (above most content)
- **Border**: Colored based on tone
- **Icon**: FontAwesome icons matching tone
- **Background**: White with subtle shadow

### Toast Types & Colors

| Type | Icon | Border Color | Icon Color |
|------|------|--------------|------------|
| `success` | `fa-circle-check` | Green | Green |
| `error` | `fa-circle-exclamation` | Red | Red |
| `warning` | `fa-triangle-exclamation` | Orange | Orange |
| `info` | `fa-circle-info` | Blue | Blue |

### Examples in the App

- **Fire Plan Module**: Used for save confirmations, errors, floor plan uploads
- **Incident Management**: Form submissions, validations, archive operations
- **Logbook**: Entry saves, filter updates

### Customization

To change the default duration globally, edit the `useToast` hook:

```tsx
// In /app/hooks/useToast.ts
const addToast = useCallback(
  (title: string, tone: ToastTone = 'info', duration: number = 5000) => { // Changed from 3500
    // ...
  }
);
```

### Best Practices

1. Keep toast messages concise (1-2 lines max)
2. Use appropriate tone for the context
3. Only show one ToastContainer per page
4. Prefer success/error over info for actions
5. Use warning for validation messages
