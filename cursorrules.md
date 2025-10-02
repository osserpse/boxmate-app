# Cursor Rules for Next.js App with Supabase Auth

## Core Technologies

- TypeScript, Node.js, Next.js 14+ (App Router)
- React 18+, Server Components
- Supabase Auth
- Chadcn UI, Tailwind CSS
– yarn (NOT npm)

## Architecture Rules

1. Server/Client Separation
   - Use Server Components by default
   - Mark client components with "use client"
   - Keep auth services server-side
   - Use server actions for mutations
   - Handle API calls through server-side routes
   - Minimize 'use client', 'useEffect', and 'setState'
   - Wrap client components in Suspense with fallback
   - Use dynamic loading for non-critical components
   - Limit 'use client' to:
     - Web API access in small components
     - Avoid for data fetching or state management
     - Favor server components and Next.js SSR

2. Authentication
   - Use Supabase Auth
   - Store provider token in Supabase session
   - Handle auth state server-side with cookies()
   - Never use document.cookie in server components
   - Implement proper token refresh and error handling
   - Use secure cookie settings for production

## Code Style

1. TypeScript
   - Strict mode enabled
   - Prefer interfaces over types
   - No any unless justified
   - Use discriminated unions for API responses
   - Define proper return types for all functions
   - Use proper type guards
   - Avoid enums; use maps instead
   - Use the "function" keyword for pure functions

2. Components
   - Functional components only
   - Named exports
   - Props interface for each component
   - Error boundaries for API calls
   - Proper loading states
   - Proper error handling
   - Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError)
   - Avoid unnecessary curly braces in conditionals
   - Use concise syntax for simple statements

3. File Structure
   - Feature-based organization
   - Separate auth and drive services
   - Group related components
   - Use consistent naming patterns
   - Keep API routes in app/api
   - Keep services in lib directory
   - Use lowercase with dashes for directories (e.g., components/auth-wizard)
   - Structure files: exported component, subcomponents, helpers, static content, types

## Patterns to Follow

1. Server Components

   ```typescript
   // Good
   export default async function Page({ params }: { params: Promise<{ id: string }> }) {
     const { id } = await params
     const cookieStore = await cookies()
     const supabase = createServerClient(/* ... */)
     const { data: { session } } = await supabase.auth.getSession()
     if (!session?.provider_token) return <AuthRequired />
     // Implementation
   }

   // Avoid
   export default function Page({ params }: { params: { id: string } }) {
     // Direct params access
     // Client-side auth checks
   }
   ```

2. Authentication

   ```typescript
   // Good
   const cookieStore = cookies()
   const supabase = createServerClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
     {
       cookies: {
         get(name: string) {
           return cookieStore.get(name)?.value
         },
         set(name: string, value: string, options: any) {
           cookieStore.set(name, value, options)
         },
         remove(name: string, options: any) {
           cookieStore.delete(name)
         },
       },
     }
   )
   const { data: { session } } = await supabase.auth.getSession()
   if (!session?.provider_token) return <AuthRequired />

   // Avoid
   const supabase = createClient(/* ... */)
   const session = await supabase.auth.getSession()
   ```

## Error Handling

1. API Calls
   - Always use try-catch
   - Provide meaningful error messages
   - Log errors appropriately
   - Handle token expiration
   - Implement proper retry logic
   - Use proper error types

2. Type Safety
   - Validate API responses
   - Use proper error types
   - Handle edge cases
   - Implement proper fallbacks
   - Use type guards
   - Proper null checks

## Performance

1. Optimization
   - Use React Server Components
   - Implement proper caching
   - Optimize images and assets:
     - Use WebP format
     - Include size data
     - Implement lazy loading
   - Handle API rate limits
   - Use proper loading states
   - Implement proper error boundaries
   - Optimize Core Web Vitals (LCP, CLS, FID)
   - Use 'nuqs' for URL search parameter state management

2. State Management
   - Use server actions
   - Implement optimistic updates
   - Handle loading states
   - Proper error boundaries
   - Use proper caching strategies
   - Implement proper revalidation
   - Use URL-based state management where appropriate

## Security

1. Authentication
   - Validate sessions server-side
   - Handle token refresh
   - Secure cookie management
   - Proper OAuth scopes
   - Implement proper CSRF protection
   - Use proper session management

2. API Access
   - Server-side token management
   - Rate limiting
   - Error recovery
   - Proper permissions
   - Implement proper validation
   - Use proper error handling

## Testing

1. Requirements
   - Unit tests for components
   - Integration tests for auth
   - API endpoint testing
   - Error scenario coverage
   - Proper mocking
   - End-to-end testing

2. CI/CD
   - Type checking
   - Linting
   - Build verification
   - Environment validation
   - Proper deployment checks
   - Security scanning

## Environment

1. Variables

   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   NEXT_PUBLIC_APP_URL
   ```

## Dependencies

1. Core
   - @supabase/ssr
   - @supabase/supabase-js
   - next
   - react
   - typescript

2. UI
   - @radix-ui/react-*
   - class-variance-authority
   - tailwindcss
   - lucide-react
   - @chadcn/ui

## Commands

1. Development

   ```bash
   yarn dev
   yarn lint
   yarn build
   yarn type-check
   ```

2. Testing

   ```bash
   yarn test
   yarn test:watch
   yarn test:coverage
   ```

## Goals

1. Primary
   - Type-safe implementation
   - Secure authentication
   - Scalable architecture
   - Proper error handling
   - Performance optimization
   - Optimized Web Vitals
   - Efficient state management

2. Secondary
   - Developer experience
   - Code maintainability
   - Testing coverage
   - Documentation
   - Accessibility
   - SEO optimization
   - Image and asset optimization
   - Client-side performance
