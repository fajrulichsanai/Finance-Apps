# API Validation Test Checklist
**Date:** April 14, 2026

## Pre-Test Setup

1. ✅ Open browser (Chrome/Safari)
2. ✅ Open Developer Console (F12 or Cmd+Option+I)
3. ✅ Navigate to Finance App
4. ✅ Ensure you're logged in

---

## Test 1: Dashboard API - Category Breakdown

### Steps:
1. Navigate to Dashboard page
2. Watch the console

### Expected Console Output:
```bash
✓ [getCategoryBreakdown] Calling RPC with params: { user_id: '...', type: 'expense', start_date: 'null', end_date: 'null' }
✓ [getCategoryBreakdown] RPC success, rows: X
✓ [getCategoryBreakdown] Processed results: X categories
```

### Expected UI:
- ✅ Budget Overview card shows categories
- ✅ Progress bars display correctly
- ✅ Percentages calculated

### If Error Occurs:
Look for error log:
```bash
✗ [getCategoryBreakdown] RPC error: {
    message: "...",
    details: "...",
    hint: "...",
    code: "..."
  }
```

**Action:** Report full error object for debugging

---

## Test 2: Record API - Transaction Creation

### Test 2A: Create Expense (Valid)

**Input:**
- Type: Expense
- Amount: 50000
- Category: (Select any)
- Description: (Leave empty or enter text)

**Expected Console:**
```bash
✓ [createTransaction] Validating input: { type: 'expense', has_category: true }
✓ [createTransaction] Inserting transaction...
✓ [createTransaction] Transaction created: '...'
```

**Expected UI:**
- ✅ Success popup appears
- ✅ Transaction saved
- ✅ Can see in activity list

---

### Test 2B: Create Expense (No Category - Should Fail)

**Input:**
- Type: Expense
- Amount: 50000
- Category: (None selected)

**Expected Error:**
```bash
✗ [createTransaction] Error: Category is required for expense transactions
```

**Expected UI:**
- ⚠️ Error popup with message
- Message should say: "Category is required for expense transactions"

---

### Test 2C: Create Income (No Category - Valid)

**Input:**
- Type: Income
- Amount: 100000
- Category: (None - should work)
- Description: "Salary"

**Expected Console:**
```bash
✓ [createTransaction] Validating input: { type: 'income', has_category: false }
✓ [createTransaction] Inserting transaction...
✓ [createTransaction] Transaction created: '...'
```

**Expected UI:**
- ✅ Success popup
- ✅ Income transaction saved

---

### Test 2D: Create with Empty Description (Valid)

**Input:**
- Type: Expense
- Amount: 20000
- Category: (Select any)
- Description: (Leave completely empty)

**Expected:**
- ✅ Should work fine
- ✅ Transaction saved with empty description

---

### Test 2E: Invalid Amount (Should Fail)

**Input:**
- Type: Expense
- Amount: 0 or negative

**Expected Error:**
```bash
✗ [createTransaction] Error: Amount must be greater than 0
```

---

## Test 3: Budget API - Categories with Budget

### Steps:
1. Navigate to Budget page
2. Watch the console

### Expected Console Output:
```bash
✓ [getCategoriesWithBudget] Calling RPC for user: '...'
✓ [getCategoriesWithBudget] RPC success, rows: X
✓ [getCategoriesWithBudget] Processed results: X categories
```

### Expected UI:
- ✅ Budget overview shows totals
- ✅ Category cards display with progress
- ✅ "Sisa Budget" and "Terpakai" values correct

### If Error Occurs:
Look for error log:
```bash
✗ [getCategoriesWithBudget] RPC error: {
    message: "...",
    details: "...",
    hint: "...",
    code: "..."
  }
```

**Action:** Report full error object

---

## Test 4: Notification API

### Steps:
1. Navigate to Notification page
2. Watch the console

### Expected Console Output:
```bash
✓ [getNotifications] Fetching notifications for user: '...', with filters: { include_archived: false }
✓ [getNotifications] Success: X notifications found
```

### Expected UI:
- ✅ Notifications grouped by time (Today, Yesterday, etc.)
- ✅ Each notification shows:
  - Title
  - Message
  - Date
  - Read/unread status
  - Action button (if applicable)

### If No Notifications:
- ✅ Should show: "Tidak ada notifikasi"
- ✅ Console should show: `rows: 0`

---

## Common Issues & Solutions

### Issue 1: RPC Function Not Found

**Error:**
```bash
function get_category_breakdown() does not exist
```

**Solution:**
1. Check migration files are applied
2. Run: `npx supabase db reset` (local)
3. Run: `npx supabase db push` (remote)

---

### Issue 2: Auth Error

**Error:**
```bash
[methodName] Auth error: { message: "...", status: 401 }
```

**Solution:**
1. Log out and log back in
2. Check Supabase connection
3. Verify auth.users table exists

---

### Issue 3: Empty Error Object `{}`

**Before Fix:**
```bash
Error fetching data: {}
```

**After Fix:**
```bash
[methodName] RPC error: {
  message: "actual error message",
  details: "more details",
  hint: "helpful hint",
  code: "error_code"
}
```

If you still see `{}`, the service file may not be updated.

---

## Performance Check

### Console Logs Count
During normal operation, you should see:

**Dashboard Page:**
- 4-6 log entries (auth, RPC calls, success messages)

**Budget Page:**
- 3-4 log entries

**Record Page:**
- 2-3 log entries per transaction creation

**Notification Page:**
- 2-3 log entries

### Load Times
- Dashboard: < 2 seconds
- Budget: < 1.5 seconds
- Record: < 1 second
- Notification: < 1 second

---

## Test Results Template

Copy this and fill in results:

```
## Test Results - [Your Name] - [Date]

### Dashboard API
- [ ] Category breakdown loads
- [ ] Console logs are detailed
- [ ] UI displays correctly
- Issues: _____

### Record API
- [ ] Expense with category works
- [ ] Expense without category fails with message
- [ ] Income without category works
- [ ] Empty description works
- [ ] Invalid amount fails
- Issues: _____

### Budget API
- [ ] Categories load with budget info
- [ ] Console logs are detailed
- [ ] UI displays correctly
- Issues: _____

### Notification API
- [ ] Notifications load
- [ ] Grouped correctly
- [ ] UI displays correctly
- Issues: _____

### Overall
- Error handling: ___/5
- Logging quality: ___/5
- UX clarity: ___/5
- Performance: ___/5

### Notes:
[Add any additional observations]
```

---

## Success Criteria

All tests should:
- ✅ Show detailed console logs
- ✅ Display clear error messages (if errors occur)
- ✅ Handle empty states gracefully
- ✅ Provide good UX with loading states
- ✅ Complete operations quickly (< 2s)

---

**Status:** Ready for testing! 🧪
