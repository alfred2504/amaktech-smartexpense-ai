# Login Redirect & Theme Crash Bugfix

## Problem 1: Login not redirecting to dashboard

After a successful login, the app stayed on the login page instead of navigating to `/`.

**Root cause:** The API response structure was nested under `data`, but the code was reading from the top level.

API response shape:
```json
{
  "status": "success",
  "data": {
    "accessToken": "...",
    "user": { ... }
  }
}
```

The code was looking for `data.token` and `data.user`, which were both `undefined`. Nothing got saved to localStorage or context, so `ProtectedRoute` saw no auth state and redirected back to `/login`.

**Fix:** Updated `LoginPage.tsx` to read from the correct path:

```ts
// Before
if (data.token) { ... }
if (data.user) { ... }

// After
const token = data.data?.accessToken;
const user = data.data?.user;
```

---

## Problem 2: ThemeToggle crash on dashboard load

After the redirect fix, the dashboard crashed with:

```
TypeError: Cannot destructure property 'dark' of 'useTheme(...)' as it is null.
```

**Root cause:** `ThemeProvider` was never added to the app's provider tree in `main.tsx`, so `useContext(ThemeContext)` returned `null` (the context default value).

**Fix:** Wrapped the app with `ThemeProvider` in `main.tsx`:

```tsx
// Before
<AuthProvider>
  <App />
</AuthProvider>

// After
<ThemeProvider>
  <AuthProvider>
    <App />
  </AuthProvider>
</ThemeProvider>
```
