# Error Handling & Feedback Components

This directory contains components and hooks for consistent error handling, loading states, empty states, and form validation feedback throughout the application.

## Components

### ErrorDisplay

Displays error messages in different variants (inline, card, fullscreen).

```tsx
import { ErrorDisplay } from '@/components/feedback';

// Card variant (default)
<ErrorDisplay 
  error={error} 
  onRetry={() => refetch()} 
/>

// Inline variant
<ErrorDisplay 
  error={error} 
  variant="inline" 
  onDismiss={() => setError(null)} 
/>

// Fullscreen variant
<ErrorDisplay 
  error={error} 
  variant="fullscreen" 
  onRetry={() => refetch()} 
/>
```

### ErrorState

Full-page error state for when entire pages fail to load.

```tsx
import { ErrorState } from '@/components/feedback';

if (error) {
  return (
    <ErrorState
      error={error}
      title="Failed to load data"
      onRetry={() => refetch()}
      onGoBack={() => router.back()}
    />
  );
}
```

### LoadingState

Consistent loading indicators with different sizes.

```tsx
import { LoadingState } from '@/components/feedback';

// Medium size (default)
<LoadingState message="Loading products..." />

// Small size
<LoadingState size="small" message="Saving..." />

// Large size
<LoadingState size="large" message="Loading dashboard..." />

// Fullscreen
<LoadingState fullScreen message="Loading..." />
```

### EmptyState

Displays empty states with different variants.

```tsx
import { EmptyState } from '@/components/feedback';

// Default variant
<EmptyState
  title="No products found"
  description="Start by adding your first product"
  action={<Button onPress={handleAdd}>Add Product</Button>}
/>

// Search variant
<EmptyState
  variant="search"
  title="No results"
  description="Try adjusting your search terms"
/>

// Error variant
<EmptyState
  variant="error"
  title="Failed to load"
  description="Please try again"
/>
```

### FormValidationFeedback

Displays form validation errors consistently.

```tsx
import { FormValidationFeedback, getFieldError } from '@/components/feedback';

// At the top of form
<FormValidationFeedback 
  errors={errors} 
  touched={touched}
/>

// Get error for specific field
const emailError = getFieldError(errors, 'email');

<FormInput
  label="Email"
  error={emailError}
  ...
/>
```

## Hooks

### useLoading

Manages loading state and errors for async operations.

```tsx
import { useLoading } from '@/components/feedback';

function MyComponent() {
  const { loading, error, execute } = useLoading({
    onError: (err) => {
      showErrorToast(err.message);
    }
  });

  const handleSubmit = async () => {
    const result = await execute(async () => {
      return await api.createProduct(data);
    });
    
    if (result) {
      // Success
      showSuccessToast('Product created!');
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorDisplay error={error} onRetry={handleSubmit} />;

  return <Form onSubmit={handleSubmit} />;
}
```

## Usage Patterns

### Page with Data Fetching

```tsx
import { useLoading, LoadingState, ErrorState, EmptyState } from '@/components/feedback';

function ProductsPage() {
  const { loading, error, execute } = useLoading();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    execute(async () => {
      const data = await api.getProducts();
      setProducts(data);
    });
  }, []);

  if (loading) return <LoadingState fullScreen />;
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />;
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products"
        description="Add your first product to get started"
        action={<Button onPress={handleAdd}>Add Product</Button>}
      />
    );
  }

  return <ProductList products={products} />;
}
```

### Form with Validation

```tsx
import { FormValidationFeedback, useLoading, ErrorDisplay } from '@/components/feedback';
import { FormInput } from '@/components/forms';

function ProductForm() {
  const { loading, error, execute } = useLoading();
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleSubmit = async (data) => {
    const result = await execute(async () => {
      return await api.createProduct(data);
    });

    if (result) {
      showSuccessToast('Product created!');
    }
  };

  return (
    <View>
      <FormValidationFeedback errors={formErrors} touched={touched} />
      
      {error && (
        <ErrorDisplay 
          error={error} 
          variant="inline" 
          onDismiss={() => setError(null)} 
        />
      )}

      <FormInput
        label="Name"
        error={getFieldError(formErrors, 'name')}
        onBlur={() => setTouched({ ...touched, name: true })}
        ...
      />

      <Button 
        onPress={handleSubmit} 
        loading={loading}
      >
        Submit
      </Button>
    </View>
  );
}
```

### List with Empty State

```tsx
import { DataList, EmptyState } from '@/components/lists';

function ProductList({ products, loading }) {
  if (loading) return <LoadingState />;
  
  return (
    <DataList
      data={products}
      loading={loading}
      emptyIcon="inbox"
      emptyTitle="No products found"
      emptyDescription="Add your first product to get started"
      emptyAction={<Button onPress={handleAdd}>Add Product</Button>}
      renderItem={({ item }) => <ProductItem product={item} />}
    />
  );
}
```

## Best Practices

1. **Always show loading states** for async operations
2. **Use ErrorState for page-level errors**, ErrorDisplay for component-level errors
3. **Use EmptyState variants** appropriately (search, error, default)
4. **Show form errors** only after fields are touched
5. **Provide retry actions** for recoverable errors
6. **Use useLoading hook** to manage async operation states consistently
