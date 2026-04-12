# 📋 Category Management System - User Guide

## 🎯 Overview

Complete category management system with budget tracking, custom icons, colors, and transaction counting. Users can create personal "wallets" for each spending category.

## ✨ Features Implemented

- ✅ **Create Categories** - Custom categories with names, icons, and colors
- ✅ **Set Budget** - Set monthly budget limit per category
- ✅ **Adjust Budget** - Update budget anytime by editing category
- ✅ **Transaction Count** - Automatically counts transactions per category
- ✅ **Custom Icons** - Choose from 17+ Lucide icons
- ✅ **Custom Colors** - Pick from 10+ preset colors
- ✅ **Budget Tracking** - Real-time spent/remaining calculation
- ✅ **Over Budget Alerts** - Visual warnings when budget exceeded
- ✅ **User Isolation** - Each user has their own categories via RLS

---

## 🗂️ Database Schema

### Categories Table

```sql
categories
├─ id               UUID        Primary key
├─ user_id          UUID        Owner (FK → auth.users)
├─ name             VARCHAR     Category name
├─ type             VARCHAR     'income' | 'expense'
├─ icon             VARCHAR     Icon component name
├─ color            VARCHAR     Hex color code
├─ budget           DECIMAL     Monthly budget limit
├─ created_at       TIMESTAMPTZ Created timestamp
└─ updated_at       TIMESTAMPTZ Last update timestamp
```

### Computed Fields (from RPC)

```sql
get_categories_with_budget() returns:
├─ total_spent       DECIMAL     Sum of expense transactions
├─ remaining_budget  DECIMAL     budget - total_spent
└─ transaction_count BIGINT      Count of transactions
```

---

## 🚀 How to Use

### 1. Create New Category

**Location:** Budget Page or Categories Page → Click "Buat Kategori Budget Baru"

**Steps:**
1. Click the green "+" button
2. Fill in:
   - **Name**: e.g., "Transportasi", "Makanan"
   - **Type**: Income or Expense
   - **Budget**: Monthly limit (for expense only)
   - **Icon**: Choose from available icons
   - **Color**: Pick a color
3. Preview shows how it will look
4. Click "Tambah"

**Code:**
```typescript
// In components/CategoryModal.tsx
const formData = {
  name: 'Transportasi',
  type: 'expense',
  icon: 'Car',
  color: '#3b82f6',
  budget: 1000000  // 1 juta
};

await categoryService.createCategory(formData);
```

---

### 2. Set/Adjust Budget

**Location:** Budget Page → Click on any category card

**Steps:**
1. Click on a category card
2. Modal opens in edit mode
3. Update the **Budget** field
4. Click "Update"
5. Changes reflect immediately

**Code:**
```typescript
// In lib/services/categories.ts
await categoryService.updateCategory(categoryId, {
  budget: 2000000  // Update to 2 juta
});
```

**Examples:**
- Initial budget: Rp 1,000,000
- Adjust to: Rp 2,000,000
- Spent: Rp 500,000
- Remaining: Rp 1,500,000

---

### 3. View Transaction Count

**Location:** Budget Page or Categories Page → Each card shows count

**Display:**
```
┌─────────────────────────────┐
│ 🚗 Transportasi             │
│ 12 transaksi                │ ← Transaction count
│ Rp 750,000 / Rp 1,000,000  │
└─────────────────────────────┘
```

**Code:**
```typescript
// Automatically calculated in RPC function
const { data } = await supabase.rpc('get_categories_with_budget', {
  p_user_id: user.id,
  p_type: 'expense'
});

// Returns:
// transaction_count: 12
// total_spent: 750000
// remaining_budget: 250000
```

---

### 4. Customize Icon

**Available Icons:**

| Icon | Name | Use Case |
|------|------|----------|
| 🚗 | Car | Transport |
| ☕ | Coffee | Food & Drink |
| 🛍️ | ShoppingBag | Shopping |
| 🏠 | Home | Housing/Bills |
| ⚡ | Zap | Utilities |
| ❤️ | Heart | Healthcare |
| 📚 | BookOpen | Education |
| 🎬 | Film | Entertainment |
| 💼 | Briefcase | Work/Freelance |
| 📱 | Smartphone | Gadgets |
| 💻 | Laptop | Tech |
| 🎁 | Gift | Gifts |
| 📈 | TrendingUp | Investment |
| 💵 | DollarSign | Income |
| 💳 | CreditCard | Credit |
| 🐷 | PiggyBank | Savings |
| 👛 | Wallet | General |

**Code:**
```typescript
// Icon is stored as string, rendered as component
const IconComponent = Icons[category.icon]; // e.g., Icons.Car
<IconComponent style={{ color: category.color }} />
```

---

### 5. Customize Color

**Available Colors:**

| Color | Hex | Use Case |
|-------|-----|----------|
| 🔴 Red | #ef4444 | Bills, Urgent |
| 🟠 Orange | #f59e0b | Food |
| 🟡 Yellow | #eab308 | Warning |
| 🟢 Green | #10b981 | Income, Savings |
| 🔵 Blue | #3b82f6 | Transport, General |
| 🟣 Purple | #8b5cf6 | Shopping, Luxury |
| 🩷 Pink | #ec4899 | Entertainment |
| ⚫ Gray | #64748b | Other |
| 🔷 Cyan | #06b6d4 | Education |
| 🟧 Deep Orange | #f97316 | Energy |

**Implementation:**
```typescript
// Color applied to icon and background
<div style={{ backgroundColor: `${color}20` }}>  {/* 20 = 12% opacity */}
  <Icon style={{ color: color }} />
</div>
```

---

## 📱 UI Integration

### Budget Page (`/budget`)

**Features:**
- ✅ View all expense categories with budgets
- ✅ Click card to edit category and adjust budget
- ✅ Click "Buat Kategori Budget Baru" to create
- ✅ Real-time budget utilization chart
- ✅ Over-budget warning indicators

**User Flow:**
```
Budget Page
  ├─ Budget Overview (total spent/remaining)
  ├─ Utilization Chart (percentage)
  ├─ Category Cards (clickable for edit)
  │   └─ Shows: icon, color, name, count, spent/limit
  ├─ Create Button
  └─ Category Modal (create/edit)
```

### Categories Page (`/categories`)

**Features:**
- ✅ Full CRUD operations
- ✅ Delete categories
- ✅ Budget alerts (over budget, warning)
- ✅ Summary cards with totals

**User Flow:**
```
Categories Page
  ├─ Total Budget Summary
  ├─ Alert Cards (over budget warnings)
  ├─ Category List
  │   ├─ Edit button
  │   ├─ Delete button
  │   └─ Delete confirmation
  ├─ Create Button
  └─ Category Modal
```

---

## 🔐 Security (RLS Policies)

All categories are **user-isolated** via Row Level Security:

```sql
-- ✅ Users can ONLY see their own categories
SELECT * FROM categories WHERE user_id = auth.uid();

-- ✅ Users can ONLY create categories for themselves
INSERT INTO categories (user_id, ...) VALUES (auth.uid(), ...);

-- ✅ Users can ONLY update their own categories
UPDATE categories SET ... WHERE user_id = auth.uid();

-- ✅ Users can ONLY delete their own categories
DELETE FROM categories WHERE user_id = auth.uid();
```

**You cannot:**
- ❌ See other users' categories
- ❌ Modify other users' categories
- ❌ Create categories for other users

---

## 📊 Budget Tracking Logic

### Calculation Flow

```typescript
// 1. User creates category with budget
budget = 1,000,000

// 2. User makes transactions
transaction_1 = 250,000
transaction_2 = 300,000
transaction_3 = 150,000

// 3. System calculates totals
total_spent = SUM(transactions) = 700,000
remaining_budget = budget - total_spent = 300,000
transaction_count = COUNT(transactions) = 3

// 4. Determine status
if (remaining_budget < 0) → OVER BUDGET ⚠️
else if (remaining_budget < budget * 0.2) → WARNING 🔶
else → OK ✅
```

### Visual Indicators

```
remaining > 20% → Green ✅
remaining < 20% → Orange 🔶
remaining < 0   → Red ⚠️
```

---

## 💾 Data Flow

### Create Category

```
User Input (Modal)
  ↓
CategoryModal component
  ↓
categoryService.createCategory()
  ↓
Supabase INSERT
  ↓
RLS checks user_id = auth.uid()
  ↓
Database inserts row
  ↓
useExpenseBudgets.refresh()
  ↓
UI updates
```

### Edit Budget

```
Click Category Card
  ↓
CategoryModal opens (edit mode)
  ↓
User updates budget field
  ↓
categoryService.updateCategory()
  ↓
Supabase UPDATE
  ↓
RLS verifies ownership
  ↓
useExpenseBudgets.refresh()
  ↓
Card shows new budget/remaining
```

### View with Tracking

```
Page loads
  ↓
useExpenseBudgets() hook
  ↓
categoryService.getCategoriesWithBudget()
  ↓
Supabase RPC 'get_categories_with_budget'
  ↓
SQL JOINs categories + transactions
  ↓
Calculates: total_spent, remaining, count
  ↓
Returns enriched data
  ↓
UI renders cards with all info
```

---

## 🎨 Customization Examples

### Example 1: Food Category
```typescript
{
  name: 'Makanan & Minuman',
  type: 'expense',
  icon: 'Coffee',
  color: '#f59e0b',  // Orange
  budget: 1500000    // 1.5 juta
}
```

### Example 2: Transport Category
```typescript
{
  name: 'Transportasi',
  type: 'expense',
  icon: 'Car',
  color: '#3b82f6',  // Blue
  budget: 1000000    // 1 juta
}
```

### Example 3: Income Category
```typescript
{
  name: 'Gaji',
  type: 'income',
  icon: 'Zap',
  color: '#10b981',  // Green
  budget: 0          // Income doesn't need budget
}
```

---

## 🧪 Testing Checklist

- [ ] Create new expense category with budget
- [ ] Create new income category (no budget)
- [ ] Edit category name
- [ ] Edit category icon
- [ ] Edit category color
- [ ] Adjust budget (increase)
- [ ] Adjust budget (decrease)
- [ ] Delete category
- [ ] Check transaction count updates after adding transaction
- [ ] Check budget remaining updates after transaction
- [ ] Verify over-budget warning appears
- [ ] Verify low-budget warning appears
- [ ] Test with multiple users (isolation check)

---

## 🐛 Troubleshooting

### Categories not showing?
**Check:**
1. User is authenticated
2. RLS policies are enabled
3. Network tab shows successful RPC call
4. `user_id` matches `auth.uid()`

### Budget not updating?
**Check:**
1. Transactions have correct `category_id`
2. RPC function is being called (not direct query)
3. Transaction type matches category type
4. `refresh()` is called after update

### Icons not rendering?
**Check:**
1. Icon name matches Lucide icon exactly
2. Icon is imported in `* as Icons from 'lucide-react'`
3. `getIconComponent()` fallback returns `Wallet`

---

## 📚 Related Files

- **Database:** `/doc/migrations/20260412_category_management_complete.sql`
- **Frontend Service:** `/lib/services/categories.ts`
- **React Hooks:** `/lib/hooks/useCategories.ts`
- **Modal Component:** `/components/CategoryModal.tsx`
- **Card Component:** `/components/CategoryCard.tsx`
- **Budget Page:** `/app/budget/page.tsx`
- **Categories Page:** `/app/categories/page.tsx`

---

## 🎯 Summary

Your category management system is **fully functional**:

✅ Complete backend with RLS
✅ Full CRUD operations
✅ Budget tracking with transaction counts
✅ Custom icons (17+ options)
✅ Custom colors (10+ options)
✅ Real-time calculations
✅ User isolation and security
✅ Integrated with both Budget and Categories pages

**You can now:**
1. Create categories with custom icons and colors
2. Set and adjust budgets
3. View transaction counts per category
4. Track spending vs budget in real-time
5. Get visual alerts for over-budget categories

---

**Built with ❤️ for Supabase Free Tier optimization**
