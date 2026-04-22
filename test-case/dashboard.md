# Test Case: Dashboard Feature

**Feature**: Dashboard Halaman Utama Finance App  
**Module**: `/app/dashboard/page.tsx`  
**Last Updated**: 22 April 2026  
**Test Coverage**: Positive, Negative, Edge Cases

---

## 📋 Test Case Overview

Dashboard adalah halaman utama yang menampilkan ringkasan keuangan user, termasuk:
- Skor Kesehatan Keuangan
- Net Worth (Total Saldo)
- Ikhtisar Anggaran Bulanan
- Wawasan AI
- Statistik Pendapatan & Pengeluaran
- Aktivitas Terbaru (3 transaksi terakhir)

---

## ✅ POSITIVE TEST CASES

### **TC-DASH-001: Load Dashboard dengan Data Lengkap**
**Priority**: HIGH  
**Category**: Positive  

**Precondition**:
- User sudah login
- Database memiliki data lengkap:
  - Balance summary ada
  - Transaksi bulan ini ada (income & expense)
  - Budget categories (minimal 3)
  - Recent transactions (minimal 3)

**Test Steps**:
1. Buka browser, akses `/dashboard`
2. Tunggu loading selesai

**Expected Result**:
- ✅ Skeleton loading muncul terlebih dahulu
- ✅ Health Score Card menampilkan score (0-100)
- ✅ Net Worth Card menampilkan balance dalam format IDR
- ✅ Budget Overview menampilkan 3 kategori dengan progress bar
- ✅ AI Insight Card muncul dengan link ke `/budget`
- ✅ Monthly Stats menampilkan income dan expense
- ✅ Recent Activity menampilkan 3 transaksi terakhir
- ✅ AppHeader dan BottomNav muncul
- ✅ PWA Install Prompt muncul (jika belum terinstall)
- ✅ Tidak ada error di console

---

### **TC-DASH-002: Health Score Calculation - Kategori "Sempurna"**
**Priority**: HIGH  
**Category**: Positive  

**Precondition**:
- User sudah login
- Data bulan ini:
  - Total Income: Rp 10.000.000
  - Total Expense: Rp 3.000.000
  - Savings Rate: 70%

**Test Steps**:
1. Akses `/dashboard`
2. Perhatikan Health Score Card

**Expected Result**:
- ✅ Score menampilkan: **70**
- ✅ Standing: **"Sempurna"**
- ✅ Progress circle 70% terisi (warna hijau)
- ✅ Text insight: "Tingkat tabungan Anda 70% bulan ini."

---

### **TC-DASH-003: Health Score Calculation - Kategori "Baik"**
**Priority**: HIGH  
**Category**: Positive  

**Precondition**:
- Total Income: Rp 10.000.000
- Total Expense: Rp 6.000.000
- Savings Rate: 40%

**Expected Result**:
- ✅ Score: **40**
- ✅ Standing: **"Baik"**
- ✅ Progress circle 40% terisi

---

### **TC-DASH-004: Health Score Calculation - Kategori "Cukup"**
**Priority**: MEDIUM  
**Category**: Positive  

**Precondition**:
- Total Income: Rp 10.000.000
- Total Expense: Rp 8.000.000
- Savings Rate: 20%

**Expected Result**:
- ✅ Score: **20**
- ✅ Standing: **"Cukup"**

---

### **TC-DASH-005: Net Worth Card - Balance Positif**
**Priority**: HIGH  
**Category**: Positive  

**Precondition**:
- Balance: Rp 25.500.000

**Expected Result**:
- ✅ Balance ditampilkan: **"Rp 25.500.000"**
- ✅ Display name muncul (contoh: "John D.")
- ✅ Format currency IDR benar (dengan titik pemisah ribuan)

---

### **TC-DASH-006: Budget Overview - Kategori Dalam Batas**
**Priority**: HIGH  
**Category**: Positive  

**Precondition**:
- Kategori "Makanan":
  - Spent: Rp 800.000
  - Limit: Rp 1.500.000
  - Percentage: 53.3%

**Expected Result**:
- ✅ Progress bar 53.3% terisi
- ✅ Warna: **Hijau** (di bawah 80%)
- ✅ Text: "Rp 800.000 / Rp 1.500.000"
- ✅ Sisa budget: "Rp 700.000"

---

### **TC-DASH-007: Budget Overview - Kategori Mendekati Limit (Warning)**
**Priority**: HIGH  
**Category**: Positive  

**Precondition**:
- Kategori "Transport":
  - Spent: Rp 850.000
  - Limit: Rp 1.000.000
  - Percentage: 85%

**Expected Result**:
- ✅ Progress bar 85% terisi
- ✅ Warna: **Kuning/Orange** (80-99%)
- ✅ Visual warning muncul

---

### **TC-DASH-008: Budget Overview - Kategori Melebihi Limit**
**Priority**: HIGH  
**Category**: Positive  

**Precondition**:
- Kategori "Belanja":
  - Spent: Rp 1.200.000
  - Limit: Rp 1.000.000
  - Percentage: 120%

**Expected Result**:
- ✅ Progress bar penuh (100%, tidak overflow)
- ✅ Warna: **Merah** (≥100%)
- ✅ Text menampilkan "Melebihi anggaran"

---

### **TC-DASH-009: Recent Activity List - Menampilkan 3 Transaksi**
**Priority**: HIGH  
**Category**: Positive  

**Precondition**:
- Database memiliki 10 transaksi
- Recent: 3 transaksi terakhir

**Expected Result**:
- ✅ Hanya 3 transaksi terbaru yang ditampilkan
- ✅ Setiap transaksi menampilkan:
  - Icon kategori
  - Nama transaksi
  - Tanggal (format: "Hari ini", "Kemarin", atau "DD MMM")
  - Amount (format IDR)
- ✅ Button "Lihat Semua" muncul
- ✅ Klik "Lihat Semua" → redirect ke `/activity`

---

### **TC-DASH-010: Monthly Stats - Income dan Expense Terpisah**
**Priority**: HIGH  
**Category**: Positive  

**Precondition**:
- Monthly Income: Rp 12.000.000
- Monthly Expense: Rp 7.500.000

**Expected Result**:
- ✅ Card Income menampilkan:
  - Label: "Pendapatan Bulan Ini"
  - Amount: "Rp 12.000.000"
  - Icon panah atas (hijau)
- ✅ Card Expense menampilkan:
  - Label: "Pengeluaran Bulan Ini"
  - Amount: "Rp 7.500.000"
  - Icon panah bawah (merah)

---

### **TC-DASH-011: AI Insight Card - Navigasi ke Budget**
**Priority**: MEDIUM  
**Category**: Positive  

**Test Steps**:
1. Akses `/dashboard`
2. Klik link "Lihat Anggaran →" di AI Insight Card

**Expected Result**:
- ✅ Redirect ke `/budget`
- ✅ Halaman budget berhasil dimuat

---

### **TC-DASH-012: Navigation - Bottom Nav**
**Priority**: HIGH  
**Category**: Positive  

**Test Steps**:
1. Di dashboard, klik icon navigasi di BottomNav:
   - Insight
   - Record
   - Budget
   - Profile

**Expected Result**:
- ✅ Setiap icon berfungsi dan redirect ke halaman yang benar
- ✅ Icon "Dashboard" ter-highlight (active state)

---

### **TC-DASH-013: PWA Install Prompt - Muncul untuk First Time User**
**Priority**: MEDIUM  
**Category**: Positive  

**Precondition**:
- User belum install PWA
- Browser mendukung PWA

**Expected Result**:
- ✅ InstallPrompt component muncul
- ✅ Prompt dapat di-dismiss
- ✅ Jika di-install, prompt tidak muncul lagi

---

### **TC-DASH-014: Refresh Dashboard - Manual Reload**
**Priority**: MEDIUM  
**Category**: Positive  

**Test Steps**:
1. Akses `/dashboard`
2. Tunggu semua data dimuat
3. Tambahkan transaksi baru dari `/record`
4. Kembali ke `/dashboard`

**Expected Result**:
- ✅ Data dashboard ter-update otomatis
- ✅ Recent activity menampilkan transaksi baru
- ✅ Health score di-recalculate
- ✅ Budget categories ter-update

---

## ❌ NEGATIVE TEST CASES

### **TC-DASH-NEG-001: Akses Dashboard Tanpa Autentikasi**
**Priority**: CRITICAL  
**Category**: Negative  

**Precondition**:
- User belum login
- Session token tidak ada

**Test Steps**:
1. Buka browser (incognito/private mode)
2. Akses `/dashboard` langsung

**Expected Result**:
- ✅ Redirect ke `/auth` (login page)
- ✅ Dashboard tidak dapat diakses
- ✅ Error message: "Please login first"

---

### **TC-DASH-NEG-002: API Error - Gagal Fetch Dashboard Data**
**Priority**: HIGH  
**Category**: Negative  

**Precondition**:
- Supabase RPC `get_dashboard_data` return error
- Network timeout atau database down

**Test Steps**:
1. Simulate API error (block network di DevTools)
2. Akses `/dashboard`

**Expected Result**:
- ✅ Skeleton loading muncul
- ✅ Setelah timeout, error state muncul:
  - Icon error (warning triangle)
  - Text: "Unable to Load Dashboard"
  - Error message dari API
  - Button "Try Again"
- ✅ Klik "Try Again" → retry fetch data
- ✅ BottomNav tetap accessible

---

### **TC-DASH-NEG-003: Database Kosong - User Baru Pertama Kali**
**Priority**: HIGH  
**Category**: Negative  

**Precondition**:
- User baru registrasi
- Belum ada transaksi
- Belum ada budget

**Expected Result**:
- ✅ Dashboard tetap dimuat tanpa crash
- ✅ Health Score: **0**
- ✅ Net Worth: **Rp 0**
- ✅ Budget Overview: "Belum ada anggaran"
- ✅ Recent Activity: "Belum ada transaksi"
- ✅ Monthly Stats: Rp 0 (income & expense)

---

### **TC-DASH-NEG-004: Session Expired Saat di Dashboard**
**Priority**: HIGH  
**Category**: Negative  

**Precondition**:
- User login
- Dashboard terbuka
- Session token expired (setelah 1 jam)

**Test Steps**:
1. Login dan buka dashboard
2. Tunggu 1 jam (atau manipulasi token)
3. Refresh dashboard

**Expected Result**:
- ✅ Redirect ke `/auth`
- ✅ Error message: "Session expired, please login again"
- ✅ User diminta login ulang

---

### **TC-DASH-NEG-005: Null Data dari API**
**Priority**: HIGH  
**Category**: Negative  

**Precondition**:
- API return `null` atau `undefined` untuk:
  - balanceSummary
  - monthSummary
  - categories

**Expected Result**:
- ✅ Dashboard tidak crash
- ✅ Fallback ke default values (0 atau empty array)
- ✅ Tidak ada "undefined" atau "NaN" di UI

---

### **TC-DASH-NEG-006: Slow Network - Loading Timeout**
**Priority**: MEDIUM  
**Category**: Negative  

**Precondition**:
- Network throttling: Slow 3G
- API response > 10 detik

**Test Steps**:
1. Set network throttling di DevTools
2. Akses `/dashboard`

**Expected Result**:
- ✅ Skeleton loading tetap muncul (max 10 detik)
- ✅ Setelah timeout, error state muncul
- ✅ User dapat retry
- ✅ Tidak ada infinite loading

---

### **TC-DASH-NEG-007: Invalid User ID**
**Priority**: HIGH  
**Category**: Negative  

**Precondition**:
- User ID di session tidak valid
- User ID tidak ditemukan di database

**Expected Result**:
- ✅ API return error 404
- ✅ Redirect ke login page
- ✅ Session di-clear

---

### **TC-DASH-NEG-008: Budget Category dengan Limit 0**
**Priority**: MEDIUM  
**Category**: Negative  

**Precondition**:
- Kategori "Hiburan":
  - Spent: Rp 500.000
  - Limit: Rp 0 (user set limit = 0)

**Expected Result**:
- ✅ Kategori tidak ditampilkan di Budget Overview
- ✅ Filter: `filter((cat) => Number(cat.budget) > 0)`
- ✅ Tidak ada division by zero error

---

### **TC-DASH-NEG-009: Negative Balance**
**Priority**: MEDIUM  
**Category**: Negative  

**Precondition**:
- Balance summary: -Rp 2.000.000 (hutang)

**Expected Result**:
- ✅ Balance ditampilkan: **"-Rp 2.000.000"**
- ✅ Warna merah untuk negative balance
- ✅ Tidak ada formatting error

---

### **TC-DASH-NEG-010: API Return Corrupted Data**
**Priority**: HIGH  
**Category**: Negative  

**Precondition**:
- API return data dengan tipe yang salah:
  - amount as string instead of number
  - date format invalid

**Expected Result**:
- ✅ TypeScript validation menangkap error
- ✅ Fallback ke default values
- ✅ Error logged di console
- ✅ Dashboard tidak crash

---

### **TC-DASH-NEG-011: RLS Policy Block Access**
**Priority**: CRITICAL  
**Category**: Negative  

**Precondition**:
- User A login
- RLS policy bekerja dengan benar
- User A mencoba akses data user B (via manipulasi request)

**Expected Result**:
- ✅ RLS policy block access
- ✅ API return empty data atau error 403
- ✅ Dashboard menampilkan empty state
- ✅ **TIDAK** menampilkan data user lain

---

### **TC-DASH-NEG-012: Component Unmount Saat Async Operation**
**Priority**: MEDIUM  
**Category**: Negative  

**Precondition**:
- User akses `/dashboard`
- Sebelum data loaded, user navigate ke halaman lain

**Test Steps**:
1. Akses `/dashboard`
2. Saat skeleton loading muncul
3. Langsung klik navigasi ke `/budget`

**Expected Result**:
- ✅ Fetch request di-abort (`AbortController`)
- ✅ Tidak ada memory leak
- ✅ Tidak ada error di console: "Can't perform state update on unmounted component"
- ✅ `isMountedRef.current = false` mencegah setState

---

### **TC-DASH-NEG-013: Double/Triple Click pada Navigasi**
**Priority**: LOW  
**Category**: Negative  

**Test Steps**:
1. Di dashboard, klik "Lihat Semua" di Recent Activity 3x dengan cepat

**Expected Result**:
- ✅ Hanya 1 navigasi terjadi
- ✅ Tidak ada multiple page navigation
- ✅ Tidak ada racing condition

---

## 🔀 EDGE CASES

### **TC-DASH-EDGE-001: Exactly 3 Transaksi di Database**
**Priority**: MEDIUM  
**Category**: Edge  

**Precondition**:
- Database memiliki tepat 3 transaksi

**Expected Result**:
- ✅ Recent Activity menampilkan 3 transaksi
- ✅ `.slice(0, 3)` tidak error
- ✅ Button "Lihat Semua" tetap muncul

---

### **TC-DASH-EDGE-002: Budget Limit = Spent (100% Exact)**
**Priority**: MEDIUM  
**Category**: Edge  

**Precondition**:
- Kategori "Transport":
  - Spent: Rp 1.000.000
  - Limit: Rp 1.000.000
  - Percentage: 100%

**Expected Result**:
- ✅ Progress bar penuh (100%)
- ✅ Warna: **Merah**
- ✅ Text: "Anggaran tercapai"

---

### **TC-DASH-EDGE-003: Extreme Balance - Very Large Number**
**Priority**: LOW  
**Category**: Edge  

**Precondition**:
- Balance: Rp 999.999.999.999 (999 miliar)

**Expected Result**:
- ✅ Format currency benar: "Rp 999.999.999.999"
- ✅ Tidak ada overflow di UI
- ✅ Text tidak terpotong

---

### **TC-DASH-EDGE-004: Extreme Balance - Very Small Number**
**Priority**: LOW  
**Category**: Edge  

**Precondition**:
- Balance: Rp 1 (satu rupiah)

**Expected Result**:
- ✅ Balance ditampilkan: "Rp 1"
- ✅ Tidak ada rounding error

---

### **TC-DASH-EDGE-005: Health Score = 0% (No Savings)**
**Priority**: MEDIUM  
**Category**: Edge  

**Precondition**:
- Total Income: Rp 10.000.000
- Total Expense: Rp 10.000.000
- Savings Rate: 0%

**Expected Result**:
- ✅ Score: **0**
- ✅ Standing: **"Buruk"** atau **"Kritis"**
- ✅ Progress circle kosong (0%)
- ✅ Text insight: "Tingkat tabungan Anda 0% bulan ini."

---

### **TC-DASH-EDGE-006: Health Score > 100% (Income tanpa Expense)**
**Priority**: LOW  
**Category**: Edge  

**Precondition**:
- Total Income: Rp 10.000.000
- Total Expense: Rp 0
- Savings Rate: 100%

**Expected Result**:
- ✅ Score: **100** (di-cap, tidak boleh >100)
- ✅ Standing: **"Sempurna"**
- ✅ Progress circle penuh

---

### **TC-DASH-EDGE-007: Expense > Income (Deficit)**
**Priority**: HIGH  
**Category**: Edge  

**Precondition**:
- Total Income: Rp 5.000.000
- Total Expense: Rp 8.000.000
- Deficit: -Rp 3.000.000

**Expected Result**:
- ✅ Health Score: **0** atau **negative (capped to 0)**
- ✅ Standing: **"Buruk"**
- ✅ Balance berkurang
- ✅ Visual warning di dashboard

---

### **TC-DASH-EDGE-008: User Name Sangat Panjang**
**Priority**: LOW  
**Category**: Edge  

**Precondition**:
- Display name: "Muhammad Abdul Rahman Al-Farisi bin Abdullah"

**Expected Result**:
- ✅ Name truncated dengan ellipsis: "Muhammad Abdul..."
- ✅ Tidak overflow ke luar card
- ✅ Tooltip menampilkan full name (optional)

---

### **TC-DASH-EDGE-009: Category Name dengan Special Characters**
**Priority**: LOW  
**Category**: Edge  

**Precondition**:
- Kategori: "Makan & Minum 🍔"

**Expected Result**:
- ✅ Emoji dan special characters ditampilkan dengan benar
- ✅ Tidak ada encoding error
- ✅ XSS protection aktif (no script injection)

---

### **TC-DASH-EDGE-010: Transaksi dengan Amount = 0**
**Priority**: MEDIUM  
**Category**: Edge  

**Precondition**:
- Transaksi: "Test" dengan amount Rp 0

**Expected Result**:
- ✅ Transaksi tetap ditampilkan di Recent Activity
- ✅ Amount: "Rp 0"
- ✅ Tidak ada visual bug

---

### **TC-DASH-EDGE-011: Transaksi Hari Ini vs Kemarin vs Bulan Lalu**
**Priority**: MEDIUM  
**Category**: Edge  

**Precondition**:
- Transaksi 1: Hari ini, 10:30
- Transaksi 2: Kemarin, 15:00
- Transaksi 3: 5 hari lalu

**Expected Result**:
- ✅ Transaksi 1: "Hari ini, 10:30"
- ✅ Transaksi 2: "Kemarin, 15:00"
- ✅ Transaksi 3: "17 Apr" (format DD MMM)

---

### **TC-DASH-EDGE-012: Budget Categories > 3 (TOP_BUDGET_CATEGORIES)**
**Priority**: HIGH  
**Category**: Edge  

**Precondition**:
- User memiliki 10 budget categories
- `TOP_BUDGET_CATEGORIES = 3`

**Expected Result**:
- ✅ Hanya 3 kategori teratas yang ditampilkan
- ✅ `.slice(0, TOP_BUDGET_CATEGORIES)` bekerja
- ✅ Sorting by spent amount (highest first)

---

### **TC-DASH-EDGE-013: Transaksi dengan Description Sangat Panjang**
**Priority**: LOW  
**Category**: Edge  

**Precondition**:
- Description: "Belanja bulanan untuk kebutuhan rumah tangga termasuk sembako, sayuran, daging, buah-buahan, dan keperluan dapur lainnya di supermarket..."

**Expected Result**:
- ✅ Description truncated dengan ellipsis
- ✅ Max characters: 50-80
- ✅ Tidak overflow ke luar card

---

### **TC-DASH-EDGE-014: Midnight Transition (23:59 → 00:00)**
**Priority**: LOW  
**Category**: Edge  

**Precondition**:
- User membuka dashboard pada 23:58
- Dashboard tetap terbuka hingga 00:02 (hari berikutnya)

**Test Steps**:
1. Buka dashboard pada 23:58
2. Tunggu hingga jam 00:02
3. Refresh atau auto-reload

**Expected Result**:
- ✅ Monthly stats ter-update (jika bulan berganti)
- ✅ "Hari ini" vs "Kemarin" label ter-update
- ✅ Tidak ada timezone issue

---

### **TC-DASH-EDGE-015: Concurrent User Actions (Race Condition)**
**Priority**: HIGH  
**Category**: Edge  

**Precondition**:
- Dashboard terbuka
- User melakukan multiple actions simultaneously:
  - Klik refresh
  - Klik navigasi
  - Add transaction di tab lain

**Expected Result**:
- ✅ `AbortController` cancel previous request
- ✅ Hanya 1 request aktif pada satu waktu
- ✅ Tidak ada data corruption
- ✅ `isMountedRef` mencegah setState pada unmounted component

---

### **TC-DASH-EDGE-016: Browser Back/Forward Navigation**
**Priority**: MEDIUM  
**Category**: Edge  

**Test Steps**:
1. Akses `/dashboard`
2. Klik navigasi ke `/budget`
3. Klik browser back button

**Expected Result**:
- ✅ Kembali ke `/dashboard`
- ✅ Data tidak di-fetch ulang (cache)
- ✅ Scroll position restored
- ✅ Tidak ada flickering

---

### **TC-DASH-EDGE-017: PWA Offline Mode**
**Priority**: HIGH  
**Category**: Edge  

**Precondition**:
- PWA ter-install
- User membuka dashboard
- Network disconnect

**Expected Result**:
- ✅ Service worker menampilkan cached data
- ✅ "Offline" indicator muncul
- ✅ Saat online kembali, data ter-sync
- ✅ Tidak ada data loss

---

### **TC-DASH-EDGE-018: Multiple Tabs Open**
**Priority**: MEDIUM  
**Category**: Edge  

**Precondition**:
- Dashboard terbuka di 2 tab
- Tab 1: Add transaction
- Tab 2: Dashboard masih terbuka

**Expected Result**:
- ✅ Tab 2 ter-update otomatis (via broadcast channel atau manual refresh)
- ✅ Data konsisten di semua tabs
- ✅ Tidak ada stale data

---

### **TC-DASH-EDGE-019: Screen Resize (Desktop ↔ Mobile)**
**Priority**: MEDIUM  
**Category**: Edge  

**Test Steps**:
1. Akses dashboard di desktop (1920px)
2. Resize browser ke mobile (375px)

**Expected Result**:
- ✅ Layout responsive
- ✅ `max-w-[430px]` membatasi width di desktop
- ✅ Semua cards tetap readable
- ✅ Tidak ada horizontal scroll

---

### **TC-DASH-EDGE-020: Dark Mode Toggle**
**Priority**: MEDIUM  
**Category**: Edge  

**Test Steps**:
1. Akses dashboard (default: light mode)
2. Toggle dark mode

**Expected Result**:
- ✅ Colors ter-update sesuai theme
- ✅ Tidak ada flash of wrong theme
- ✅ Theme preference tersimpan di localStorage
- ✅ Refresh tetap maintain theme

---

## 📊 Test Coverage Summary

| Category | Total Test Cases | Priority Breakdown |
|----------|------------------|-------------------|
| **Positive** | 14 | Critical: 0, High: 10, Medium: 4, Low: 0 |
| **Negative** | 13 | Critical: 2, High: 8, Medium: 2, Low: 1 |
| **Edge** | 20 | Critical: 0, High: 4, Medium: 9, Low: 7 |
| **TOTAL** | **47** | **47 Test Cases** |

---

## 🎯 Testing Priority

### **P0 - Critical (Must Test):**
- TC-DASH-001: Load dashboard dengan data lengkap
- TC-DASH-NEG-001: Akses tanpa autentikasi
- TC-DASH-NEG-011: RLS policy security

### **P1 - High (Should Test):**
- TC-DASH-002 to TC-DASH-010: Core features
- TC-DASH-NEG-002 to NEG-010: Error handling
- TC-DASH-EDGE-007, EDGE-015, EDGE-017: Critical edge cases

### **P2 - Medium (Good to Test):**
- Semua test dengan priority MEDIUM

### **P3 - Low (Optional):**
- UI refinement, edge cases yang jarang terjadi

---

## 🔧 Test Execution Notes

### **Pre-Test Setup:**
```bash
# 1. Setup test database dengan seed data
npm run db:seed

# 2. Run Playwright tests
npm run test:e2e

# 3. Check coverage
npm run test:coverage
```

### **Test Environment:**
- **Browser**: Chrome, Firefox, Safari (webkit)
- **Viewport**: 375px (mobile), 768px (tablet), 1920px (desktop)
- **Network**: Fast 3G, Slow 3G, Offline
- **Auth**: Logged in, Logged out, Session expired

### **Known Issues/Risks:**
1. **Race condition pada concurrent requests** - Mitigated by `AbortController`
2. **Memory leak pada unmounted component** - Mitigated by `isMountedRef`
3. **Slow 3G timeout** - Implement retry mechanism
4. **RLS policy misconfiguration** - Requires thorough security audit

---

## 📝 Additional Test Scenarios (Future)

### **Performance Testing:**
- [ ] Dashboard load time < 2 seconds
- [ ] Time to Interactive (TTI) < 3 seconds
- [ ] First Contentful Paint (FCP) < 1 second
- [ ] Lighthouse score > 90

### **Security Testing:**
- [ ] SQL injection attempts
- [ ] XSS attacks via category names
- [ ] CSRF token validation
- [ ] Rate limiting on API calls

### **Accessibility Testing:**
- [ ] Screen reader compatibility
- [ ] Keyboard navigation
- [ ] Color contrast ratio (WCAG AA)
- [ ] Focus indicators

### **Localization Testing:**
- [ ] IDR currency format
- [ ] Indonesian date format
- [ ] Timezone handling (WIB)

---

## ✅ Sign Off

**Prepared by**: GitHub Copilot  
**Reviewed by**: _[QA Lead Name]_  
**Approved by**: _[Product Owner Name]_  
**Date**: 22 April 2026

---

**Notes**: Test case ini mencakup semua skenario yang teridentifikasi dari kode. Untuk automated testing, gunakan Playwright (sudah ada di `/tests/`). Pastikan semua test case di-implement dan passing sebelum production deployment.
