---
description: "Build or enhance authentication flows with Supabase Auth, including login, register, protected routes, middleware protection, and secure session handling"
argument-hint: "Describe the auth feature to implement (e.g., 'add OAuth provider', 'protect admin routes')"
agent: "agent"
---

# Authentication Flow Builder

Build secure authentication features following this project's Supabase Auth patterns.

## Requirements

When implementing authentication, ensure:

### 1. **Supabase Auth Integration**
- Use `@supabase/ssr` for server-side auth
- Client: Use `/lib/supabase/client.ts` for client components
- Server: Use `/lib/supabase/server.ts` for server components/actions
- Middleware: Use `/lib/supabase/middleware.ts` for route protection

### 2. **Login Implementation**
- Component location: `/components/features/auth/LoginForm.tsx`
- Hook location: `/hooks/useLogin.ts`
- Page route: `/app/login/page.tsx` (or root `/app/page.tsx`)
- Use `supabase.auth.signInWithPassword()` for email/password
- Use `supabase.auth.signInWithOAuth()` for OAuth providers
- Handle errors with clear user feedback
- Redirect to `/dashboard` on success

### 3. **Register Implementation**
- Component location: `/components/features/auth/RegisterForm.tsx`
- Hook location: `/hooks/useRegister.ts`
- Page route: `/app/register/page.tsx`
- Use `supabase.auth.signUp()` with email confirmation
- Create user profile record in `users` table after signup
- Validate passwords (min 8 chars recommended)
- Auto-login after successful registration

### 4. **Protected Routes**
- Configure in `/middleware.ts` with `config.matcher`
- Skip auth checks for:
  - Public assets: `'/((?!_next|api|favicon.ico|.*\\.|public).*)'`
  - Auth pages: `/`, `/register`, `/auth/callback`
- Implement in `/lib/supabase/middleware.ts`:
  ```typescript
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  ```
- Update `config.matcher` to include new protected routes

### 5. **Session Handling**
- Use `AuthProvider` wrapper in `/app/layout.tsx`
- Store session in cookies (handled by `@supabase/ssr`)
- Refresh session automatically via middleware
- Handle session expiry gracefully (redirect to login)

### 6. **Security Best Practices**
- **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` to client
- Enable RLS policies on all user-related tables
- Validate user sessions server-side for sensitive operations
- Use `auth.uid()` in RLS policies to scope data access
- Clear sensitive data on logout

### 7. **Auth Callback**
- Route: `/app/auth/callback/route.ts`
- Handle OAuth redirects and email confirmations
- Exchange code for session
- Redirect to appropriate page after authentication

## Code Style

- TypeScript strict mode (no `any`)
- Functional components only
- `async/await` (no `.then()`)
- Descriptive variable names (no `temp`, `data`, `x`)
- Extract reusable logic into custom hooks

## Example Pattern

```typescript
// hooks/useLogin.ts
export const useLogin = () => {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      // Handle error
      return
    }
    
    router.push('/dashboard')
  }

  return { login, loading }
}
```

## Testing Checklist

After implementation, verify:
- [ ] Unauthenticated users redirected to login
- [ ] Successful login redirects to dashboard
- [ ] Protected routes block unauthorized access
- [ ] Logout clears session and redirects
- [ ] Session persists on page refresh
- [ ] Auth callback handles OAuth/email confirmation
- [ ] Error states display user-friendly messages

## Reference Files

- Middleware: [middleware.ts](../../middleware.ts)
- Client Supabase: [lib/supabase/client.ts](../../lib/supabase/client.ts)
- Server Supabase: [lib/supabase/server.ts](../../lib/supabase/server.ts)
- Auth Provider: [providers/AuthProvider.tsx](../../providers/AuthProvider.tsx)
- Project Guidelines: [.github/copilot-instructions.md](../copilot-instructions.md)

---

**Output**: Provide complete, production-ready code following project conventions. Include file paths, imports, and integration points.
