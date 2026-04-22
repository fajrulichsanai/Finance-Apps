# Test Case: Budget Page

## Overview
Halaman Budget menampilkan ringkasan budget bulanan, utilisasi budget, daftar kategori pengeluaran dengan tracking spent vs limit, serta fitur CRUD kategori budget.

**URL**: `/budget`  
**Auth Required**: Yes  
**Related Components**:
- `app/budget/page.tsx`
- `components/features/budget/BudgetOverview.tsx`
- `components/features/budget/BudgetUtilization.tsx`
- `components/features/budget/BudgetCategoryCard.tsx`
- `components/features/category/CategoryModal.tsx`

---

## 📋 Test Case Categories

### A. UI Rendering & Initial Load
### B. Budget Overview Display
### C. Budget Utilization Chart
### D. Category List Display
### E. Sort Functionality
### F. Create Category (Modal)
### G. Edit Category (Modal)
### H. Delete Category
### I. Validation Tests
### J. Error Handling
### K. Edge Cases
### L. Performance Tests
### M. Responsive Design
### N. Accessibility

---

## A. UI RENDERING & INITIAL LOAD

### A.01 - Page Load dengan Data Kosong
**Type**: Positive  
**Precondition**: User login, belum ada kategori budget  
**Steps**:
1. Login ke aplikasi
2. Navigate ke `/budget`

**Expected**:
- ✅ Header "Budget" tampil
- ✅ Budget Overview tampil dengan nilai Rp0
- ✅ Utilisasi tampil 0%
- ✅ Tombol "+ Buat Kategori" tampil dan aktif
- ✅ Tidak ada category card
- ✅ Bottom navigation tampil
- ✅ Tidak ada error message

---

### A.02 - Page Load dengan Data Valid
**Type**: Positive  
**Precondition**: User login, sudah ada 3 kategori budget  
**Steps**:
1. Login ke aplikasi
2. Navigate ke `/budget`

**Expected**:
- ✅ Loading skeleton tampil sebentar
- ✅ Budget Overview tampil dengan total correct
- ✅ Utilisasi chart tampil dengan percentage correct
- ✅ 3 Category cards tampil dengan data lengkap
- ✅ Setiap card menampilkan: icon, nama, jumlah transaksi, spent, limit, progress bar, button
- ✅ No errors

---

### A.03 - Loading State
**Type**: Positive  
**Precondition**: API response lambat (simulated)  
**Steps**:
1. Login
2. Navigate ke `/budget` dengan network throttling

**Expected**:
- ✅ Skeleton loading tampil untuk:
  - Title (h-8 w-32)
  - Budget Overview card
  - 2 Category card skeletons
- ✅ Skeleton animasi pulse aktif
- ✅ No content flash sebelum loading selesai

---

### A.04 - Error State - API Failure
**Type**: Negative  
**Precondition**: Supabase API error (offline/500)  
**Steps**:
1. Login
2. Disconnect internet / force API error
3. Navigate ke `/budget`

**Expected**:
- ✅ Error UI tampil dengan:
  - Red warning icon
  - Error message jelas
  - "Coba Lagi" button
- ✅ No crash
- ✅ Bottom nav tetap accessible

---

### A.05 - Refresh After Error
**Type**: Positive  
**Precondition**: Error state aktif  
**Steps**:
1. Di error state
2. Klik "Coba Lagi" button

**Expected**:
- ✅ Loading state tampil
- ✅ Data fetched ulang
- ✅ Jika success, tampil normal
- ✅ Jika still error, error state kembali

---

## B. BUDGET OVERVIEW DISPLAY

### B.01 - Display Total Spent Correctly
**Type**: Positive  
**Precondition**: Ada transaksi dengan total Rp1.500.000  
**Steps**:
1. Login
2. Navigate ke `/budget`
3. Check "Total Pengeluaran Bulan Ini"

**Expected**:
- ✅ Value tampil: `Rp1.500.000` (formatted dengan separator)
- ✅ Font size 5xl, bold, putih
- ✅ Background gradient blue-900 to blue-800

---

### B.02 - Display Monthly Goal Correctly
**Type**: Positive  
**Precondition**: Total budget semua kategori = Rp5.000.000  
**Steps**:
1. Check "Target Bulanan" section

**Expected**:
- ✅ Value tampil: `Rp5.000.000`
- ✅ Label "TARGET BULANAN" uppercase, small font
- ✅ Color putih

---

### B.03 - Display Remaining Budget (Positive)
**Type**: Positive  
**Precondition**: 
- Total budget: Rp5.000.000
- Total spent: Rp2.000.000
- Remaining: Rp3.000.000

**Steps**:
1. Check "Sisa" section

**Expected**:
- ✅ Value tampil: `Rp3.000.000`
- ✅ Color hijau (green-400) karena positif
- ✅ Font bold

---

### B.04 - Display Remaining Budget (Negative/Over Budget)
**Type**: Negative  
**Precondition**: 
- Total budget: Rp5.000.000
- Total spent: Rp6.500.000
- Remaining: -Rp1.500.000

**Steps**:
1. Check "Sisa" section

**Expected**:
- ✅ Value tampil: `Rp-1.500.000`
- ✅ Color merah (red-400) karena negatif
- ✅ Font bold
- ✅ Minus sign tampil

---

### B.05 - Handle Invalid Amount (NaN/Infinity)
**Type**: Edge  
**Precondition**: Database return invalid number  
**Steps**:
1. Force invalid data (NaN/Infinity)
2. Check budget overview

**Expected**:
- ✅ Display `Rp0` sebagai fallback
- ✅ Console warning logged
- ✅ No crash, UI tetap render
- ✅ `formatCurrency()` function handle edge case

---

## C. BUDGET UTILIZATION CHART

### C.01 - Display Utilization Chart at 0%
**Type**: Positive  
**Precondition**: Tidak ada transaksi, utilization = 0%  
**Steps**:
1. Navigate ke budget page dengan 0 spent

**Expected**:
- ✅ Donut chart tampil
- ✅ Percentage tampil: `0%`
- ✅ Progress circle kosong (hanya background grey)
- ✅ Text: "Anda telah menggunakan 0.0% dari limit..."

---

### C.02 - Display Utilization Chart at 50%
**Type**: Positive  
**Precondition**: 
- Total budget: Rp10.000.000
- Total spent: Rp5.000.000

**Expected**:
- ✅ Percentage tampil: `50%`
- ✅ Progress circle fill 50% (blue)
- ✅ Animation smooth (1000ms ease-out)
- ✅ Text: "...50.0% dari limit..."

---

### C.03 - Display Utilization at 100%
**Type**: Positive  
**Precondition**: Spent = Budget (fully utilized)  
**Expected**:
- ✅ Percentage: `100%`
- ✅ Progress circle full (blue)
- ✅ No overflow visual

---

### C.04 - Display Utilization Over 100% (Cap at 100%)
**Type**: Edge  
**Precondition**: Spent > Budget (125% utilization)  
**Expected**:
- ✅ Percentage text tampil: `125%`
- ✅ Progress circle capped at 100% (tidak overflow)
- ✅ `Math.min(percentage, 100)` applied
- ✅ Color tetap blue (no red indicator di chart)

---

### C.05 - Handle Invalid Percentage
**Type**: Edge  
**Precondition**: NaN/Infinity percentage  
**Expected**:
- ✅ Default to 0%
- ✅ Console warning logged
- ✅ UI tidak crash

---

## D. CATEGORY LIST DISPLAY

### D.01 - Display Empty Category List
**Type**: Positive  
**Precondition**: Tidak ada kategori  
**Expected**:
- ✅ Hanya tombol "+ Buat Kategori" visible
- ✅ No category cards
- ✅ Clean UI, no errors

---

### D.02 - Display Single Category Normal State
**Type**: Positive  
**Precondition**: 1 kategori "Makan" dengan:
- Budget: Rp1.000.000
- Spent: Rp400.000
- Transaksi: 5

**Expected**:
- ✅ Card tampil dengan:
  - Icon + background color correct
  - Nama: "Makan"
  - Text: "5 transaksi"
  - Terpakai: Rp400.000 (black)
  - Limit: Rp1.000.000 (grey)
  - Progress bar: 40% filled, green
  - Button: "Atur Budget" (grey bg)
  - Trash icon (enabled jika 0 transaksi, disabled jika >0)

---

### D.03 - Display Category at Warning Level (80-99%)
**Type**: Positive  
**Precondition**: 
- Budget: Rp1.000.000
- Spent: Rp850.000 (85%)

**Expected**:
- ✅ Progress bar orange (bg-orange-500)
- ✅ Terpakai text still black
- ✅ Button still grey "Atur Budget"

---

### D.04 - Display Category Over Budget (>100%)
**Type**: Negative  
**Precondition**: 
- Budget: Rp1.000.000
- Spent: Rp1.300.000 (130%)

**Expected**:
- ✅ Terpakai text RED (Rp1.300.000)
- ✅ Progress bar RED, filled 100% (capped)
- ✅ Text: "+30% over limit" tampil
- ✅ Button RED: "Sesuaikan Budget"
- ✅ Animation/visual emphasis

---

### D.05 - Display Category Significantly Over Budget (>120%)
**Type**: Edge  
**Precondition**: Spent 150% dari budget  
**Expected**:
- ✅ Progress bar memiliki ring-2 ring-red-500
- ✅ "+50% over limit" tampil
- ✅ Visual warning jelas

---

### D.06 - Display Multiple Categories (3+)
**Type**: Positive  
**Precondition**: 3 kategori dengan data berbeda  
**Expected**:
- ✅ Semua card render tanpa overlap
- ✅ Spacing consistent (gap/margin)
- ✅ Scrollable jika banyak
- ✅ Animation fade-up stagger

---

### D.07 - Category with Zero Transactions
**Type**: Positive  
**Precondition**: Kategori baru, 0 transaksi  
**Expected**:
- ✅ Text: "0 transaksi"
- ✅ Trash icon ENABLED (tidak disabled)
- ✅ Can be deleted

---

### D.08 - Category with Transactions (Delete Disabled)
**Type**: Positive  
**Precondition**: Kategori dengan 5 transaksi  
**Expected**:
- ✅ Trash icon DISABLED (grey/cursor-not-allowed)
- ✅ Hover: tooltip "Kategori dengan transaksi tidak dapat dihapus"
- ✅ Klik tidak trigger delete

---

## E. SORT FUNCTIONALITY

### E.01 - Default Sort: "Habis Dulu" (Ascending Remaining)
**Type**: Positive  
**Precondition**: 3 kategori:
- A: remaining Rp100.000
- B: remaining Rp500.000
- C: remaining Rp50.000

**Expected**:
- ✅ Default sort tampil: C (50k) → A (100k) → B (500k)
- ✅ Kategori dengan sisa paling sedikit di atas

---

### E.02 - Toggle Sort to "Masih Ada Dulu" (Descending)
**Type**: Positive  
**Steps**:
1. Klik toggle sort button
2. Check order

**Expected**:
- ✅ Order reversed: B (500k) → A (100k) → C (50k)
- ✅ Kategori dengan sisa terbanyak di atas
- ✅ Transition smooth

---

### E.03 - Sort with Negative Remaining
**Type**: Edge  
**Precondition**: Kategori dengan remaining negatif (-Rp200.000)  
**Expected**:
- ✅ Negative value sorted correctly
- ✅ "Habis dulu": negative first, then ascending
- ✅ No calculation errors

---

### E.04 - Sort Empty List
**Type**: Edge  
**Precondition**: No categories  
**Expected**:
- ✅ No error
- ✅ Sort button still clickable (no crash)

---

## F. CREATE CATEGORY (MODAL)

### F.01 - Open Create Modal
**Type**: Positive  
**Steps**:
1. Klik tombol "+ Buat Kategori"

**Expected**:
- ✅ Modal slide up from bottom (animation smooth)
- ✅ Backdrop blur visible
- ✅ Title: "Buat Kategori"
- ✅ Form fields kosong/default:
  - Name: empty
  - Icon: "ShoppingCart" (default)
  - Color: #1a237e (blue default)
  - Budget: 0
- ✅ Live preview tampil dengan defaults
- ✅ Submit button clickable

---

### F.02 - Close Modal dengan Backdrop Click
**Type**: Positive  
**Steps**:
1. Buka modal
2. Klik area di luar modal (backdrop)

**Expected**:
- ✅ Modal close dengan animation slide down
- ✅ Form reset
- ✅ Kembali ke budget page

---

### F.03 - Close Modal dengan X Button
**Type**: Positive  
**Steps**:
1. Buka modal
2. Klik X button (top right)

**Expected**:
- ✅ Modal close
- ✅ Form data cleared

---

### F.04 - Create Category - Valid Input
**Type**: Positive  
**Steps**:
1. Buka modal create
2. Fill form:
   - Name: "Transportasi"
   - Icon: "Car"
   - Color: #e53e3e (red)
   - Budget: 500000
3. Submit

**Expected**:
- ✅ Loading state tampil (button disabled)
- ✅ API call ke Supabase
- ✅ Success: Modal close
- ✅ Success popup tampil: "Kategori berhasil dibuat"
- ✅ Data refresh otomatis
- ✅ New category tampil di list
- ✅ Budget overview updated

---

### F.05 - Live Preview Update on Input Change
**Type**: Positive  
**Steps**:
1. Buka modal
2. Type name: "Kesehatan"
3. Change icon to "Heart"
4. Change color to green
5. Input budget: 800000

**Expected**:
- ✅ Preview icon berubah realtime
- ✅ Preview color berubah realtime
- ✅ Preview name update realtime
- ✅ Preview budget tampil: "Budget Bulanan: Rp800.000"
- ✅ Smooth transitions (300ms)

---

### F.06 - Create Category - Name Empty (Validation Error)
**Type**: Negative  
**Steps**:
1. Buka modal
2. Leave name empty
3. Fill budget: 500000
4. Submit

**Expected**:
- ❌ Error message: "Nama kategori harus diisi"
- ❌ Red error banner tampil di atas form
- ❌ Form tidak submit
- ❌ Modal tetap open

---

### F.07 - Create Category - Name Too Long (>50 chars)
**Type**: Negative  
**Steps**:
1. Input name: "A" * 51 (51 characters)
2. Fill budget: 100000
3. Submit

**Expected**:
- ❌ Error: "Nama kategori maksimal 50 karakter"
- ❌ Tidak submit

---

### F.08 - Create Category - Budget Empty/Zero
**Type**: Negative  
**Steps**:
1. Input name: "Makan"
2. Leave budget = 0
3. Submit

**Expected**:
- ❌ Error: "Budget bulanan harus diisi dan lebih dari 0"

---

### F.09 - Create Category - Budget Negative
**Type**: Negative  
**Steps**:
1. Name: "Makan"
2. Budget: -500000
3. Submit

**Expected**:
- ❌ Input should prevent negative (input type logic)
- ❌ If bypassed: error "Budget bulanan harus diisi dan lebih dari 0"

---

### F.10 - Create Category - Budget Too Large (>999,999,999)
**Type**: Edge  
**Steps**:
1. Name: "Luxury"
2. Budget: 1000000000 (1 billion)
3. Submit

**Expected**:
- ❌ Error: "Budget maksimal Rp 999.999.999"

---

### F.11 - Create Category - Budget Not a Number (NaN)
**Type**: Edge  
**Steps**:
1. Input budget: "abc" atau special chars
2. Submit

**Expected**:
- ✅ Input sanitize (remove non-numeric)
- ✅ Or error: "Budget harus berupa angka yang valid"

---

### F.12 - Create Category - Duplicate Name
**Type**: Negative  
**Precondition**: Kategori "Makan" sudah ada  
**Steps**:
1. Create kategori baru dengan name: "Makan"
2. Submit

**Expected**:
- ❌ API error: duplicate key
- ❌ Error message: "Kategori dengan nama 'Makan' sudah ada. Gunakan nama lain."
- ❌ Modal tetap open untuk retry

---

### F.13 - Create Category - Icon Selection
**Type**: Positive  
**Steps**:
1. Buka modal
2. Scroll horizontal di icon grid
3. Pilih icon "Coffee"

**Expected**:
- ✅ Icon grid scrollable horizontal (overflow-x-auto)
- ✅ Selected icon highlight (blue border)
- ✅ Preview update langsung

---

### F.14 - Create Category - All Icon Options Visible
**Type**: Positive  
**Expected**:
- ✅ Semua CATEGORY_ICONS tampil (16+ icons)
- ✅ Grid layout: 3 rows, horizontal scroll
- ✅ Fade gradient di kanan (scroll hint)

---

### F.15 - Create Category - Color Picker
**Type**: Positive  
**Steps**:
1. Buka modal
2. Test color picker interaction

**Expected**:
- ✅ Color picker functional
- ✅ Selected color apply ke preview background
- ✅ Hex code validation (#RRGGBB)

---

### F.16 - Create Category - Invalid Color Format
**Type**: Negative  
**Steps**:
1. Force color input: "red" (not hex)
2. Submit

**Expected**:
- ❌ Error: "Format warna tidak valid"
- ❌ Regex check: `/^#[0-9a-f]{6}$/i`

---

### F.17 - Create Category - API Timeout
**Type**: Negative  
**Precondition**: Slow network / API timeout  
**Steps**:
1. Fill valid form
2. Submit
3. API takes >30s

**Expected**:
- ✅ Loading state persistent
- ✅ Eventually timeout dengan error
- ✅ Error message: "Failed to save category"
- ✅ User can retry

---

### F.18 - Create Category - Network Offline
**Type**: Negative  
**Steps**:
1. Disconnect internet
2. Fill form and submit

**Expected**:
- ❌ Error: Network error message
- ❌ Tidak crash
- ❌ Modal tetap open

---

### F.19 - Create Category - Success Popup Display
**Type**: Positive  
**Precondition**: Category created successfully  
**Expected**:
- ✅ Green success popup tampil
- ✅ Message: "Kategori berhasil dibuat" (atau similar)
- ✅ Auto-dismiss after 3-5 seconds
- ✅ Can manually close

---

### F.20 - Create Category - Form Reset After Success
**Type**: Positive  
**Steps**:
1. Create category successfully
2. Open modal create lagi

**Expected**:
- ✅ Form reset to defaults (empty name, default icon, budget 0)
- ✅ No residual data dari previous create

---

## G. EDIT CATEGORY (MODAL)

### G.01 - Open Edit Modal
**Type**: Positive  
**Precondition**: Kategori "Makan" exists  
**Steps**:
1. Klik "Atur Budget" button di category card

**Expected**:
- ✅ Modal open dengan mode: "Edit Kategori"
- ✅ Form pre-filled dengan data existing:
  - Name: "Makan"
  - Icon: existing icon
  - Color: existing color
  - Budget: existing budget
- ✅ Live preview tampil data current

---

### G.02 - Edit Category - Update Name Only
**Type**: Positive  
**Steps**:
1. Open edit modal
2. Change name: "Makan" → "Makanan & Jajanan"
3. Submit

**Expected**:
- ✅ API call updateCategory
- ✅ Success
- ✅ Modal close
- ✅ Category card updated dengan nama baru
- ✅ Other fields unchanged

---

### G.03 - Edit Category - Update Budget Only
**Type**: Positive  
**Steps**:
1. Edit modal
2. Change budget: 1000000 → 1500000
3. Submit

**Expected**:
- ✅ Budget updated
- ✅ Budget overview recalculated
- ✅ Utilization percentage updated
- ✅ Progress bar adjusted

---

### G.04 - Edit Category - Update Icon & Color
**Type**: Positive  
**Steps**:
1. Edit modal
2. Change icon: "ShoppingCart" → "Coffee"
3. Change color: blue → red
4. Submit

**Expected**:
- ✅ Category card icon & color updated
- ✅ Visual changes reflected immediately

---

### G.05 - Edit Category - Validation: Empty Name
**Type**: Negative  
**Steps**:
1. Edit modal
2. Clear name field
3. Submit

**Expected**:
- ❌ Error: "Nama kategori harus diisi"
- ❌ Tidak submit

---

### G.06 - Edit Category - Validation: Budget Zero
**Type**: Negative  
**Steps**:
1. Edit modal
2. Change budget to 0
3. Submit

**Expected**:
- ❌ Error: "Budget bulanan harus diisi dan lebih dari 0"

---

### G.07 - Edit Category - Duplicate Name
**Type**: Negative  
**Precondition**: Kategori "Transportasi" exists  
**Steps**:
1. Edit kategori "Makan"
2. Change name to "Transportasi" (duplicate)
3. Submit

**Expected**:
- ❌ Error: "Kategori dengan nama 'Transportasi' sudah ada"

---

### G.08 - Edit Category - No Changes (Submit Same Data)
**Type**: Edge  
**Steps**:
1. Open edit modal
2. Don't change anything
3. Submit

**Expected**:
- ✅ API call still happens
- ✅ Success (idempotent)
- ✅ Modal close

---

### G.09 - Edit Category - Cancel Edit (Discard Changes)
**Type**: Positive  
**Steps**:
1. Edit modal
2. Change budget: 1000000 → 2000000
3. Close modal without saving (X button)
4. Open edit modal again

**Expected**:
- ✅ Changes discarded
- ✅ Form shows original data (1000000)

---

### G.10 - Edit Category - API Failure
**Type**: Negative  
**Steps**:
1. Edit category
2. Simulate API error (500)
3. Submit

**Expected**:
- ❌ Error popup: "Gagal menyimpan kategori"
- ❌ Modal tetap open
- ❌ User can retry

---

## H. DELETE CATEGORY

### H.01 - Delete Category - Enabled (Zero Transactions)
**Type**: Positive  
**Precondition**: Kategori "Test" dengan 0 transaksi  
**Steps**:
1. Klik trash icon di category card

**Expected**:
- ✅ Trash icon enabled (not grey)
- ✅ Confirmation dialog tampil:
  - Title: "Hapus Kategori?"
  - Message: warning text
  - Buttons: "Batal" & "Hapus"
- ✅ Klik "Hapus" → loading state
- ✅ API call deleteCategory
- ✅ Success: category hilang dari list
- ✅ Success popup: "Kategori berhasil dihapus"
- ✅ Budget overview recalculated

---

### H.02 - Delete Category - Disabled (Has Transactions)
**Type**: Negative  
**Precondition**: Kategori "Makan" dengan 10 transaksi  
**Steps**:
1. Klik trash icon

**Expected**:
- ❌ Icon disabled (grey, cursor-not-allowed)
- ❌ No action on click
- ❌ Tooltip: "Kategori dengan transaksi tidak dapat dihapus"

---

### H.03 - Delete Category - Cancel Confirmation
**Type**: Positive  
**Steps**:
1. Klik trash icon (enabled)
2. Confirmation dialog tampil
3. Klik "Batal"

**Expected**:
- ✅ Dialog close
- ✅ No deletion
- ✅ Category still in list

---

### H.04 - Delete Category - Rapid Clicks (Race Condition)
**Type**: Edge  
**Steps**:
1. Klik trash icon
2. Dalam confirmation, rapidly klik "Hapus" 5x

**Expected**:
- ✅ Loading state prevents multiple API calls
- ✅ `deleteLoading` flag active
- ✅ Only 1 delete request sent
- ✅ No duplicate deletions

---

### H.05 - Delete Category - API Error
**Type**: Negative  
**Steps**:
1. Delete category
2. API returns error (403/500)

**Expected**:
- ❌ Error popup: "Gagal menghapus kategori"
- ❌ Confirmation dialog close
- ❌ Category masih ada di list
- ❌ User informed of failure

---

### H.06 - Delete Category - Last Category
**Type**: Edge  
**Precondition**: Hanya 1 kategori tersisa  
**Steps**:
1. Delete kategori terakhir

**Expected**:
- ✅ Deletion success
- ✅ Budget page tampil state kosong
- ✅ Total budget = Rp0
- ✅ Utilization = 0%

---

### H.07 - Delete Category - Network Offline
**Type**: Negative  
**Steps**:
1. Disconnect internet
2. Attempt delete

**Expected**:
- ❌ Error: network error
- ❌ Category tidak terhapus

---

## I. VALIDATION TESTS

### I.01 - Budget Input: Only Numeric Allowed
**Type**: Positive  
**Steps**:
1. Open create/edit modal
2. Type "abc123xyz" di budget field

**Expected**:
- ✅ Input sanitized to "123"
- ✅ Non-digit characters removed automatically

---

### I.02 - Budget Input: Leading Zeros Handled
**Type**: Edge  
**Steps**:
1. Input budget: "00500000"

**Expected**:
- ✅ Parsed as 500000
- ✅ Leading zeros ignored

---

### I.03 - Budget Input: Decimal Numbers
**Type**: Edge  
**Steps**:
1. Input budget: "123.45"

**Expected**:
- ✅ Decimal removed (only integers allowed)
- ✅ Value becomes 12345 or rejected

---

### I.04 - Name Input: Special Characters
**Type**: Edge  
**Steps**:
1. Input name: "Makan & Jajan 🍔"

**Expected**:
- ✅ Special chars & emoji allowed (if desired)
- ✅ Or sanitized sesuai policy

---

### I.05 - Name Input: Whitespace Only
**Type**: Negative  
**Steps**:
1. Input name: "   " (only spaces)
2. Submit

**Expected**:
- ❌ Error: "Nama kategori harus diisi"
- ❌ `.trim()` applied

---

### I.06 - Icon Input: Invalid Icon Name
**Type**: Edge  
**Steps**:
1. Force icon value: "InvalidIcon"
2. Submit

**Expected**:
- ❌ Error: "Ikon tidak valid"
- ❌ Check `CATEGORY_ICONS.includes()`

---

### I.07 - Color Input: Invalid Hex Format
**Type**: Negative  
**Steps**:
1. Force color: "#FFF" (short form)
2. Submit

**Expected**:
- ❌ Error: "Format warna tidak valid"
- ❌ Regex validation: `/^#[0-9a-f]{6}$/i`

---

## J. ERROR HANDLING

### J.01 - Handle Supabase Auth Error (Unauthorized)
**Type**: Negative  
**Precondition**: Session expired  
**Steps**:
1. Session expire
2. Navigate to `/budget`

**Expected**:
- ✅ Redirect to login page
- ✅ Or error: "Unauthorized"

---

### J.02 - Handle RLS Policy Violation
**Type**: Negative  
**Precondition**: Try access other user's category  
**Steps**:
1. Manipulate API to access foreign category

**Expected**:
- ❌ API blocked by RLS
- ❌ Error message
- ❌ No data leak

---

### J.03 - Handle Database Connection Error
**Type**: Negative  
**Precondition**: Supabase DB down  
**Expected**:
- ✅ Error state tampil
- ✅ Retry option
- ✅ No crash

---

### J.04 - Handle Malformed API Response
**Type**: Edge  
**Precondition**: API returns unexpected format  
**Expected**:
- ✅ Graceful error handling
- ✅ Fallback to defaults
- ✅ Console errors logged

---

## K. EDGE CASES

### K.01 - Budget with 0 Limit but Has Spent
**Type**: Edge  
**Precondition**: 
- Budget: 0
- Spent: 500000 (somehow)

**Expected**:
- ✅ Percentage calculation: division by zero handled
- ✅ Display 0% or N/A
- ✅ No crash

---

### K.02 - Category with Extremely Long Name
**Type**: Edge  
**Precondition**: Name exactly 50 chars (limit)  
**Expected**:
- ✅ Accepted (at limit)
- ✅ UI tidak overflow (text-overflow: ellipsis)

---

### K.03 - Budget with Large Numbers (999,999,999)
**Type**: Edge  
**Steps**:
1. Create category dengan budget: 999999999

**Expected**:
- ✅ Accepted (at max limit)
- ✅ Display formatted: Rp999.999.999
- ✅ No overflow errors

---

### K.04 - Many Categories (20+)
**Type**: Performance  
**Precondition**: 20+ categories  
**Expected**:
- ✅ Scroll smooth
- ✅ No lag di rendering
- ✅ All cards visible (scrollable)

---

### K.05 - Concurrent Edits (Race Condition)
**Type**: Edge  
**Steps**:
1. User A edit kategori "Makan"
2. User B also edit kategori "Makan" simultaneously
3. Both submit

**Expected**:
- ✅ Last write wins (database handles)
- ✅ Or optimistic locking error
- ✅ Data consistency maintained

---

### K.06 - Rapid Create + Delete (Stress Test)
**Type**: Performance  
**Steps**:
1. Rapidly create 5 categories
2. Immediately delete 3
3. Edit 2

**Expected**:
- ✅ All operations succeed
- ✅ Data refresh correctly
- ✅ No stale state
- ✅ No memory leaks

---

### K.07 - Modal Open with Form Pre-fill (Edit → Close → Edit Again)
**Type**: Edge  
**Steps**:
1. Edit kategori "A"
2. Close modal
3. Edit kategori "B"

**Expected**:
- ✅ Modal shows kategori "B" data (not "A")
- ✅ Form properly re-initialized
- ✅ No data pollution

---

### K.08 - Budget Update While Modal Open
**Type**: Edge  
**Steps**:
1. Open edit modal
2. External process updates budget (e.g., new transaction)
3. Submit edit

**Expected**:
- ✅ Edit saves (based on user input)
- ✅ Or refresh shows updated data after close

---

### K.09 - Negative Spent Value (Data Integrity)
**Type**: Edge  
**Precondition**: Database has negative spent  
**Expected**:
- ✅ Display correctly (negative value)
- ✅ Percentage calculation handles negative
- ✅ UI shows appropriately (red or special state)

---

### K.10 - Category Icon Missing (Fallback)
**Type**: Edge  
**Precondition**: Icon name not in CATEGORY_ICONS  
**Expected**:
- ✅ Fallback icon rendered (default icon)
- ✅ No broken image icon

---

## L. PERFORMANCE TESTS

### L.01 - Initial Page Load Time
**Type**: Performance  
**Expected**:
- ✅ First Contentful Paint (FCP) < 1.5s
- ✅ Time to Interactive (TTI) < 3s
- ✅ Largest Contentful Paint (LCP) < 2.5s

---

### L.02 - Budget Data Refresh Speed
**Type**: Performance  
**Steps**:
1. Create category
2. Measure time until data refreshed

**Expected**:
- ✅ Refresh complete < 1s
- ✅ Optimistic UI updates (if applicable)

---

### L.03 - Modal Open/Close Animation Performance
**Type**: Performance  
**Expected**:
- ✅ Animation smooth 60fps
- ✅ No jank or frame drops
- ✅ Transition duration ~300ms

---

### L.04 - Scroll Performance (Many Categories)
**Type**: Performance  
**Precondition**: 50+ categories  
**Expected**:
- ✅ Scroll smooth
- ✅ Virtual scrolling if needed
- ✅ No lag

---

### L.05 - Memory Usage (No Leaks)
**Type**: Performance  
**Steps**:
1. Open budget page
2. Create 10 categories
3. Delete 5
4. Close and reopen 20x

**Expected**:
- ✅ Memory usage stable
- ✅ No memory leaks
- ✅ Cleanup on unmount

---

## M. RESPONSIVE DESIGN

### M.01 - Mobile (375px width)
**Type**: UI  
**Steps**:
1. Set viewport: 375px x 667px (iPhone SE)
2. Navigate to budget page

**Expected**:
- ✅ Layout tidak overflow
- ✅ Cards full-width dengan margin
- ✅ Font sizes readable
- ✅ Buttons accessible (min 44x44px touch target)
- ✅ Modal full-width

---

### M.02 - Tablet (768px width)
**Type**: UI  
**Expected**:
- ✅ Layout centered dengan max-width 430px
- ✅ Responsive spacing

---

### M.03 - Desktop (1920px width)
**Type**: UI  
**Expected**:
- ✅ Container max-width 430px (centered)
- ✅ No stretching

---

### M.04 - Landscape Mode (Mobile)
**Type**: UI  
**Steps**:
1. Rotate device to landscape

**Expected**:
- ✅ Layout adjust
- ✅ Modal still accessible
- ✅ No clipping

---

### M.05 - Touch Interactions (Mobile)
**Type**: UX  
**Expected**:
- ✅ Buttons responsive to touch
- ✅ No double-tap zoom on buttons
- ✅ Smooth swipe/scroll

---

## N. ACCESSIBILITY

### N.01 - Keyboard Navigation
**Type**: A11y  
**Steps**:
1. Tab through budget page

**Expected**:
- ✅ Focus visible pada buttons/inputs
- ✅ Tab order logical
- ✅ Can open/close modal dengan keyboard

---

### N.02 - Screen Reader Support
**Type**: A11y  
**Expected**:
- ✅ ARIA labels present
- ✅ Icon buttons have `aria-label`
- ✅ Modal has proper role/aria attributes

---

### N.03 - Color Contrast (WCAG AA)
**Type**: A11y  
**Expected**:
- ✅ Text contrast ratio ≥ 4.5:1
- ✅ Icon colors meet standards

---

### N.04 - Focus Trap in Modal
**Type**: A11y  
**Steps**:
1. Open modal
2. Tab through inputs

**Expected**:
- ✅ Focus trapped inside modal
- ✅ Cannot tab to background elements
- ✅ Escape key closes modal

---

### N.05 - Error Messages Announced
**Type**: A11y  
**Steps**:
1. Submit invalid form
2. Check screen reader

**Expected**:
- ✅ Error message announced via aria-live

---

## 📊 Test Coverage Summary

| Category | Total Tests | Positive | Negative | Edge |
|----------|-------------|----------|----------|------|
| **A. UI Rendering** | 5 | 4 | 1 | 0 |
| **B. Budget Overview** | 5 | 3 | 1 | 1 |
| **C. Utilization Chart** | 5 | 3 | 0 | 2 |
| **D. Category Display** | 8 | 6 | 1 | 1 |
| **E. Sort Functionality** | 4 | 2 | 0 | 2 |
| **F. Create Category** | 20 | 10 | 6 | 4 |
| **G. Edit Category** | 10 | 5 | 3 | 2 |
| **H. Delete Category** | 7 | 2 | 3 | 2 |
| **I. Validation** | 7 | 1 | 5 | 1 |
| **J. Error Handling** | 4 | 2 | 2 | 0 |
| **K. Edge Cases** | 10 | 0 | 0 | 10 |
| **L. Performance** | 5 | 5 | 0 | 0 |
| **M. Responsive** | 5 | 5 | 0 | 0 |
| **N. Accessibility** | 5 | 5 | 0 | 0 |
| **TOTAL** | **100** | **53** | **22** | **25** |

---

## 🎯 Priority Test Execution Order

### P0 (Critical - Must Pass)
- A.02, A.04 - Page load & error handling
- F.04, F.06, F.08 - Create category (happy + validation)
- G.01, G.02, G.05 - Edit category (happy + validation)
- H.01, H.02 - Delete (enabled/disabled logic)
- B.01-B.04 - Budget overview display
- I.01, I.05 - Critical validations

### P1 (High - Should Pass)
- C.01-C.04 - Utilization chart
- D.01-D.06 - Category display states
- E.01-E.02 - Sort functionality
- F.12, F.19 - Duplicate name, success popup
- J.01-J.03 - Error handling

### P2 (Medium - Nice to Have)
- K.01-K.10 - Edge cases
- L.01-L.05 - Performance tests
- M.01-M.05 - Responsive design
- N.01-N.05 - Accessibility

---

## 🛠 Testing Tools Recommended

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright (already configured)
- **Visual Regression**: Percy or Chromatic
- **Performance**: Lighthouse CI
- **Accessibility**: axe-core, WAVE

---

## 📝 Notes

1. **Database State**: Gunakan separate test database atau reset state sebelum test
2. **Mock Data**: Prepare mock categories untuk consistent testing
3. **Authentication**: Semua tests require authenticated user
4. **Animations**: Consider `reducedMotion` setting untuk faster tests
5. **Supabase RLS**: Ensure RLS policies tested in integration tests

---

**Last Updated**: 2026-04-22  
**Version**: 1.0  
**Author**: Critical Code Tester Mode  
**Status**: Ready for Implementation
