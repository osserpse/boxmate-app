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

## Tailwind Color System

### Architecture
The project uses a modular Tailwind color system for easy maintenance and experimentation:

1. **`app/tailwind-colors.css`** - Complete Tailwind color palette
   - Contains ALL Tailwind colors as CSS custom properties
   - Uses HSL values for consistency with Tailwind's design system
   - Includes 22 color families (slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose)
   - Each color has 11 shades (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
   - Naming convention: `--tw-{color}-{shade}` (e.g., `--tw-blue-500`)

2. **`app/globals.css`** - Semantic color mapping
   - Imports the color palette: `@import './tailwind-colors.css';`
   - Maps semantic colors to Tailwind colors
   - Handles light/dark mode variations
   - Defines app-specific color meanings

### Usage Patterns

1. **Semantic Color Mapping**
   ```css
   /* In globals.css */
   --primary: var(--tw-lime-500);
   --accent: var(--tw-yellow-400);
   --secondary: var(--tw-stone-100);
   ```

2. **Easy Color Experimentation**
   ```css
   /* Change entire theme by updating semantic mappings */
   --primary: var(--tw-blue-500);        /* Blue theme */
   --accent: var(--tw-indigo-400);       /* Purple accent */
   --secondary: var(--tw-slate-100);     /* Slate secondary */
   ```

3. **Component Usage**
   ```tsx
   // Use semantic colors in components
   <Button className="bg-primary text-primary-foreground">
   <Card className="bg-card text-card-foreground border-border">
   ```

### Color System Rules

1. **Never use raw HSL values** - Always reference Tailwind colors
   ```css
   /* ❌ Bad */
   --primary: 84 100% 45%;

   /* ✅ Good */
   --primary: var(--tw-lime-500);
   ```

2. **Use semantic naming** - Colors should have meaning
   ```css
   /* ✅ Semantic */
   --primary: var(--tw-blue-500);
   --destructive: var(--tw-red-500);
   --success: var(--tw-green-500);
   ```

3. **Maintain consistency** - Use the same color family for related elements
   ```css
   /* ✅ Consistent */
   --primary: var(--tw-blue-500);
   --primary-foreground: var(--tw-blue-50);
   --ring: var(--tw-blue-500);
   ```

4. **Consider accessibility** - Ensure proper contrast ratios
   ```css
   /* ✅ Good contrast */
   --primary: var(--tw-blue-600);        /* Darker for better contrast */
   --primary-foreground: var(--tw-white); /* High contrast text */
   ```

### Adding New Colors

1. **Add to tailwind-colors.css** if using a new color family
2. **Update semantic mapping** in globals.css
3. **Test in both light and dark modes**
4. **Verify accessibility** with contrast checkers

### Color Experimentation Workflow

1. **Quick theme changes** - Update semantic mappings in globals.css
2. **Test different shades** - Try 400, 500, 600 variants
3. **Consider color psychology** - Blue for trust, green for success, etc.
4. **Maintain brand consistency** - Keep primary color consistent across app

### Dark Mode Considerations

1. **Separate mappings** - Define different colors for dark mode
2. **Lighter variants** - Use lighter shades in dark mode for better visibility
3. **Consistent contrast** - Maintain readability in both modes
   ```css
   .dark {
     --primary: var(--tw-blue-400);      /* Lighter in dark mode */
     --background: var(--tw-slate-950);  /* Dark background */
   }
   ```

## Building New Components with Tailwind Colors

### Component Development Rules

1. **ALWAYS use semantic colors** - Never hardcode Tailwind color classes
   ```tsx
   // ❌ NEVER do this
   <Button className="bg-blue-500 hover:bg-blue-600 text-white">
   <div className="text-red-600 bg-red-50 border-red-200">

   // ✅ ALWAYS do this
   <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
   <div className="text-destructive bg-destructive/10 border-destructive/20">
   ```

2. **Use semantic color variables** - Reference the complete color system
   ```tsx
   // Primary colors
   className="bg-primary text-primary-foreground"
   className="border-primary hover:bg-primary/10"

   // Secondary colors
   className="bg-secondary text-secondary-foreground"
   className="border-secondary hover:bg-secondary/80"

   // Semantic colors
   className="bg-destructive text-destructive-foreground"  // Errors
   className="bg-success text-success-foreground"          // Success states
   className="bg-warning text-warning-foreground"          // Warnings
   className="bg-info text-info-foreground"                // Info messages

   // UI colors
   className="bg-background text-foreground"               // Main content
   className="bg-card text-card-foreground"                // Cards
   className="bg-muted text-muted-foreground"              // Subtle elements
   className="border-border"                               // Borders
   ```

3. **Opacity modifiers** - Use opacity for hover states and subtle backgrounds
   ```tsx
   // Hover states
   className="hover:bg-primary/90"           // 90% opacity
   className="hover:bg-destructive/10"       // 10% opacity for subtle backgrounds

   // Background overlays
   className="bg-primary/10 border-primary/20"  // Light backgrounds with borders
   className="bg-warning/10 text-warning"       // Warning backgrounds
   ```

### Component Color Patterns

1. **Buttons**
   ```tsx
   // Primary button
   <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">

   // Secondary button
   <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">

   // Destructive button
   <Button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">

   // Muted button
   <Button variant="ghost" className="text-muted-foreground hover:bg-muted">
   ```

2. **Cards and Containers**
   ```tsx
   // Main card
   <Card className="bg-card text-card-foreground border-border">

   // Warning card
   <Card className="bg-warning/10 border-warning/20 text-warning">

   // Success card
   <Card className="bg-success/10 border-success/20 text-success">
   ```

3. **Form Elements**
   ```tsx
   // Input fields
   <Input className="border-border bg-background text-foreground focus:border-primary" />

   // Error states
   <div className="bg-destructive/10 border-destructive/20 text-destructive p-3 rounded">

   // Success states
   <div className="bg-success/10 border-success/20 text-success p-3 rounded">
   ```

4. **Navigation and UI Elements**
   ```tsx
   // Navigation items
   <Link className="text-muted-foreground hover:text-foreground hover:bg-muted">

   // Active states
   <Link className="text-primary bg-primary/10 border-primary/20">

   // Dropdowns
   <div className="bg-popover text-popover-foreground border-border">
   ```

### Color System Checklist for New Components

Before creating any component, ensure:

1. **✅ No hardcoded colors** - Check for `red-`, `blue-`, `green-`, `yellow-`, `gray-`, etc.
2. **✅ Use semantic variables** - `primary`, `secondary`, `destructive`, `success`, `warning`, `info`
3. **✅ Proper contrast** - Use `-foreground` variants for text on colored backgrounds
4. **✅ Hover states** - Use opacity modifiers like `/90` or `/10`
5. **✅ Dark mode ready** - Colors automatically adapt via CSS variables
6. **✅ Consistent patterns** - Follow existing component color patterns

### Common Mistakes to Avoid

1. **❌ Hardcoded Tailwind colors**
   ```tsx
   // DON'T DO THIS
   className="bg-blue-500 text-white border-blue-600"
   ```

2. **❌ Missing foreground colors**
   ```tsx
   // DON'T DO THIS - poor contrast
   className="bg-primary text-white"

   // DO THIS - proper contrast
   className="bg-primary text-primary-foreground"
   ```

3. **❌ Inconsistent hover states**
   ```tsx
   // DON'T DO THIS - inconsistent opacity
   className="bg-primary hover:bg-blue-600"

   // DO THIS - consistent opacity
   className="bg-primary hover:bg-primary/90"
   ```

4. **❌ Wrong semantic colors**
   ```tsx
   // DON'T DO THIS - using primary for errors
   className="bg-primary text-primary-foreground" // for error message

   // DO THIS - use appropriate semantic color
   className="bg-destructive text-destructive-foreground" // for error message
   ```

### Testing Color Changes

1. **Component isolation** - Test components in both light and dark modes
2. **Accessibility** - Verify contrast ratios meet WCAG standards
3. **Consistency** - Ensure colors match the overall design system
4. **Theme switching** - Test that colors update when changing CSS variables

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

## Development Workflow

1. **Localhost Process Management**
   - Always kill localhost processes after testing
   - Use `pkill -f "next dev"` to stop Next.js dev server
   - Use `lsof -ti:3000,3001 | xargs kill -9` to force kill ports
   - Check ports with `lsof -i:3000,3001` before starting dev server
   - Leave ports clean for user's own development

2. **Testing Protocol**
   - Run tests and verify functionality
   - Clean up any background processes
   - Ensure ports 3000 and 3001 are free
   - Document any issues found
   - Provide clear status updates

3. **Build Verification**
   - ALWAYS run `npm run build` or `yarn build` after making changes
   - Check for TypeScript errors, linting issues, and build failures
   - Fix any Suspense boundary errors with `useSearchParams()` or other client hooks
   - Ensure all pages build successfully before considering work complete
   - Verify no server-side rendering conflicts with client components
   - Test that the app is ready for production deployment (Vercel, etc.)
   - If build fails, fix errors immediately before proceeding

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
