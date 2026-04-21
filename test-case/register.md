# Test Case: Register

## Positive Test Cases

### TC-REGISTER-P01: Register dengan Data Valid
- **Precondition**: Email belum terdaftar di sistem
- **Steps**:
  1. Buka halaman `/register`
  2. Input nama lengkap valid (contoh: `Julian Newman`)
  3. Input email valid (contoh: `testuser@example.com`)
  4. Input password valid minimal 8 karakter (contoh: `TestPassword123!`)
  5. Input confirm password yang sama dengan password
  6. Centang checkbox "Syarat Layanan dan Kebijakan Privasi"
  7. Klik tombol "Buat Akun"
- **Expected**: 
  - Success message hijau muncul: "Akun berhasil dibuat! Mengalihkan ke login..."
  - Auto redirect ke halaman login (`/`) dalam 2 detik
  - Akun tersimpan di database

### TC-REGISTER-P02: Register dengan Google
- **Precondition**: User memiliki akun Google
- **Steps**:
  1. Buka halaman `/register`
  2. Klik tombol "Daftar dengan Google"
  3. Pilih akun Google di popup OAuth
  4. Authorize aplikasi
- **Expected**: 
  - OAuth popup terbuka
  - Setelah authorize, redirect ke dashboard
  - User tercatat di sistem

### TC-REGISTER-P03: Navigasi ke Halaman Login
- **Steps**:
  1. Buka halaman `/register`
  2. Scroll ke bawah form
  3. Klik link "Masuk" di bagian "Sudah memiliki akun?"
- **Expected**: Redirect ke halaman `/login`

### TC-REGISTER-P04: Password Visibility Toggle
- **Steps**:
  1. Buka halaman `/register`
  2. Input password di field "Kata Sandi Aman"
  3. Klik icon eye/toggle visibility (jika ada)
  4. Perhatikan perubahan field
- **Expected**: 
  - Field type berubah dari `password` ke `text`
  - Password terlihat plain text
  - Klik lagi untuk hide

### TC-REGISTER-P05: Auto Redirect Jika Sudah Login
- **Precondition**: User sudah login
- **Steps**:
  1. Login terlebih dahulu
  2. Akses URL `/register` langsung
- **Expected**: 
  - Auto redirect ke `/dashboard`
  - Tidak bisa akses halaman register

---

## Negative Test Cases

### TC-REGISTER-N01: Register dengan Nama Kosong
- **Steps**:
  1. Buka halaman `/register`
  2. Biarkan field "Nama Lengkap" kosong
  3. Isi field lain dengan data valid
  4. Centang terms
  5. Klik "Buat Akun"
- **Expected**: HTML5 validation error "Please fill out this field"

### TC-REGISTER-N02: Register dengan Email Kosong
- **Steps**:
  1. Buka halaman `/register`
  2. Input nama lengkap
  3. Biarkan field email kosong
  4. Isi password dan confirm password
  5. Centang terms
  6. Klik "Buat Akun"
- **Expected**: HTML5 validation error "Please fill out this field"

### TC-REGISTER-N03: Register dengan Email Format Invalid
- **Steps**:
  1. Buka halaman `/register`
  2. Input nama lengkap
  3. Input email format salah (contoh: `testuser@`, `testuser`, `test@domain`)
  4. Isi password valid
  5. Isi confirm password
  6. Centang terms
  7. Klik "Buat Akun"
- **Expected**: HTML5 validation error "Please include an '@' in the email address"

### TC-REGISTER-N04: Register dengan Password Kosong
- **Steps**:
  1. Buka halaman `/register`
  2. Input nama dan email valid
  3. Biarkan field password kosong
  4. Input confirm password
  5. Centang terms
  6. Klik "Buat Akun"
- **Expected**: HTML5 validation error "Please fill out this field"

### TC-REGISTER-N05: Register dengan Confirm Password Kosong
- **Steps**:
  1. Buka halaman `/register`
  2. Input nama, email, dan password valid
  3. Biarkan field confirm password kosong
  4. Centang terms
  5. Klik "Buat Akun"
- **Expected**: HTML5 validation error "Please fill out this field"

### TC-REGISTER-N06: Register dengan Password Kurang dari 8 Karakter
- **Steps**:
  1. Buka halaman `/register`
  2. Input nama dan email valid
  3. Input password pendek (contoh: `Test123`, hanya 7 karakter)
  4. Input confirm password sama
  5. Centang terms
  6. Klik "Buat Akun"
- **Expected**: 
  - Error message merah muncul: "Password must be at least 8 characters long"
  - Form tidak di-submit
  - User tetap di halaman register

### TC-REGISTER-N07: Register dengan Password dan Confirm Password Tidak Match
- **Steps**:
  1. Buka halaman `/register`
  2. Input nama dan email valid
  3. Input password: `TestPassword123!`
  4. Input confirm password berbeda: `TestPassword456!`
  5. Centang terms
  6. Klik "Buat Akun"
- **Expected**: 
  - Error message merah: "Passwords do not match!"
  - Form tidak di-submit
  - User tetap di halaman register

### TC-REGISTER-N08: Register Tanpa Centang Terms
- **Steps**:
  1. Buka halaman `/register`
  2. Input semua field dengan data valid
  3. JANGAN centang checkbox "Syarat Layanan"
  4. Klik "Buat Akun"
- **Expected**: 
  - Error message merah: "Please agree to the Terms of Service and Privacy Policy"
  - Form tidak di-submit

### TC-REGISTER-N09: Register dengan Email yang Sudah Terdaftar
- **Precondition**: Email `testuser@example.com` sudah terdaftar
- **Steps**:
  1. Buka halaman `/register`
  2. Input nama lengkap
  3. Input email yang sudah terdaftar: `testuser@example.com`
  4. Input password valid dan confirm password
  5. Centang terms
  6. Klik "Buat Akun"
- **Expected**: 
  - Error message dari Supabase: "User already registered" atau similar
  - User tetap di halaman register
  - Loading state selesai

### TC-REGISTER-N10: Tombol Disable Saat Loading
- **Steps**:
  1. Buka halaman `/register`
  2. Input semua data valid
  3. Klik tombol "Buat Akun"
  4. Perhatikan state tombol sebelum response
- **Expected**: 
  - Tombol disabled (tidak bisa diklik)
  - Text berubah menjadi "Membuat Akun..."
  - Arrow icon hilang
  - Tidak bisa submit form lagi sampai proses selesai

### TC-REGISTER-N11: Prevent Double Submission
- **Steps**:
  1. Buka halaman `/register`
  2. Input data valid
  3. Klik tombol "Buat Akun" dengan cepat 2-3 kali
- **Expected**: 
  - Hanya 1 request API yang dikirim
  - Console log: "⚠️ Submit already in progress, ignoring"
  - Tidak ada duplicate account creation

### TC-REGISTER-N12: SQL Injection Attempt di Email
- **Steps**:
  1. Buka halaman `/register`
  2. Input nama: `Test User`
  3. Input email dengan SQL injection: `' OR '1'='1'--@example.com`
  4. Input password valid
  5. Klik "Buat Akun"
- **Expected**: 
  - Input di-sanitize oleh Supabase
  - Tidak ada database error leak
  - Registration gagal dengan error yang aman

### TC-REGISTER-N13: XSS Attempt di Nama
- **Steps**:
  1. Buka halaman `/register`
  2. Input nama dengan XSS script: `<script>alert('XSS')</script>`
  3. Input email dan password valid
  4. Klik "Buat Akun"
- **Expected**: 
  - Script tidak ter-execute
  - Nama tersimpan sebagai plain text atau di-sanitize
  - Tidak ada alert/popup muncul

### TC-REGISTER-N14: Network Error Handling
- **Precondition**: Simulate network error (offline atau slow 3G)
- **Steps**:
  1. Buka halaman `/register`
  2. Matikan network / simulate offline
  3. Input data valid
  4. Klik "Buat Akun"
- **Expected**: 
  - Error message: "An unexpected error occurred" atau network error
  - Loading state selesai
  - User tetap di halaman register
  - Bisa retry

---

## Edge Cases

### TC-REGISTER-E01: Nama dengan Spesial Karakter
- **Steps**:
  1. Input nama dengan karakter spesial: `O'Brien`, `José García`, `Anne-Marie`
  2. Isi field lain dengan data valid
  3. Klik "Buat Akun"
- **Expected**: 
  - Nama diterima dan tersimpan dengan benar
  - Tidak ada encoding error
  - Karakter spesial ter-handle

### TC-REGISTER-E02: Nama Sangat Panjang
- **Steps**:
  1. Input nama dengan 100+ karakter
  2. Isi field lain dengan data valid
  3. Klik "Buat Akun"
- **Expected**: 
  - Ada max length validation (jika ada) atau
  - Nama tersimpan sepenuhnya di database
  - UI tidak break

### TC-REGISTER-E03: Email dengan Whitespace
- **Steps**:
  1. Input email dengan spasi di awal/akhir: ` testuser@example.com `
  2. Isi field lain dengan data valid
  3. Klik "Buat Akun"
- **Expected**: 
  - Whitespace di-trim otomatis
  - Registration berhasil dengan email clean
  - Atau error validation jelas

### TC-REGISTER-E04: Email dengan Uppercase
- **Steps**:
  1. Input email dengan huruf besar: `TESTUSER@EXAMPLE.COM`
  2. Isi field lain valid
  3. Klik "Buat Akun"
- **Expected**: 
  - Email di-convert ke lowercase (Supabase behavior)
  - Registration berhasil
  - Login nanti case-insensitive

### TC-REGISTER-E05: Password dengan Emoji
- **Steps**:
  1. Input password dengan emoji: `Password123😀🔥`
  2. Input confirm password sama
  3. Isi field lain valid, centang terms
  4. Klik "Buat Akun"
- **Expected**: 
  - Password diterima (jika length >= 8)
  - Tersimpan dengan encoding UTF-8 benar
  - Bisa login dengan password yang sama

### TC-REGISTER-E06: Password dengan Spasi
- **Steps**:
  1. Input password dengan spasi di tengah: `Test Pass word123`
  2. Input confirm password sama
  3. Isi field lain valid
  4. Klik "Buat Akun"
- **Expected**: 
  - Password diterima (spasi valid character)
  - Registration berhasil
  - Spasi ter-handle di login

### TC-REGISTER-E07: Copy-Paste Password dengan Trailing Newline
- **Steps**:
  1. Copy password dari notepad dengan newline: `Password123\n`
  2. Paste ke field password
  3. Paste ke field confirm password
  4. Isi field lain valid
  5. Klik "Buat Akun"
- **Expected**: 
  - Newline di-trim atau di-handle
  - Password match validation bekerja
  - Registration berhasil atau error jelas

### TC-REGISTER-E08: Browser Autofill
- **Precondition**: Browser punya saved credentials
- **Steps**:
  1. Buka halaman `/register`
  2. Klik field email
  3. Browser suggest autofill
  4. Pilih suggestion
- **Expected**: 
  - Fields ter-fill otomatis
  - React state ter-update (value sync)
  - Validation bekerja normal

### TC-REGISTER-E09: Responsive UI Mobile (375px)
- **Steps**:
  1. Buka halaman `/register` di mobile viewport (375px x 667px)
  2. Verifikasi semua elemen visible
  3. Test input dengan virtual keyboard
  4. Scroll ke bawah
- **Expected**: 
  - Layout responsive, tidak horizontal scroll
  - Keyboard tidak overlap form (fixed positioning jika perlu)
  - Touch target min 44x44px
  - Semua text readable

### TC-REGISTER-E10: Responsive UI Tablet (768px)
- **Steps**:
  1. Buka halaman `/register` di tablet viewport (768px)
  2. Verifikasi layout
- **Expected**: 
  - Form centered dengan max-width 390px
  - Padding sesuai
  - Background gradient visible

### TC-REGISTER-E11: Responsive UI Desktop (1920px)
- **Steps**:
  1. Buka halaman `/register` di desktop wide screen
- **Expected**: 
  - Form tidak terlalu lebar (max 390px)
  - Centered di layar
  - Background gradient full screen

### TC-REGISTER-E12: Tab Navigation (Keyboard Accessibility)
- **Steps**:
  1. Buka halaman `/register`
  2. Tekan Tab untuk navigate antar field
  3. Tekan Shift+Tab untuk backward
  4. Tekan Enter di tombol "Buat Akun"
- **Expected**: 
  - Focus indicator visible di setiap field
  - Tab order logical (nama → email → password → confirm → checkbox → button)
  - Enter submit form
  - Accessible

### TC-REGISTER-E13: Checkbox Click Area
- **Steps**:
  1. Buka halaman `/register`
  2. Klik checkbox kecil
  3. Klik text label "Saya setuju dengan..."
- **Expected**: 
  - Checkbox toggle saat klik box
  - Checkbox toggle saat klik label (label for="agree")
  - Click area cukup besar

### TC-REGISTER-E14: Link Terms dan Privacy Policy
- **Steps**:
  1. Buka halaman `/register`
  2. Klik link "Syarat Layanan"
  3. Back ke register
  4. Klik link "Kebijakan Privasi"
- **Expected**: 
  - Link clickable (saat ini href="#", jika implemented ke halaman terms)
  - Link style berbeda (underlined atau color)
  - Navigation tidak break

### TC-REGISTER-E15: Password Strength Indicator (Optional)
- **Steps**:
  1. Input password: `12345678` (weak)
  2. Input password: `Password123` (medium)
  3. Input password: `P@ssw0rd!2024` (strong)
- **Expected**: 
  - Jika ada strength indicator, update real-time
  - Jika tidak ada, semua password >= 8 char valid

### TC-REGISTER-E16: Form State Persistence
- **Steps**:
  1. Input semua field
  2. Jangan submit
  3. Refresh halaman (F5)
- **Expected**: 
  - Data hilang (normal behavior, no localStorage)
  - Atau jika ada persistence, data tetap ada

### TC-REGISTER-E17: Success Message Auto-Hide
- **Precondition**: Registration berhasil
- **Steps**:
  1. Perhatikan success message
  2. Tunggu 2 detik
- **Expected**: 
  - Success message: "Akun berhasil dibuat! Mengalihkan ke login..."
  - Setelah 2 detik, auto redirect ke `/`
  - Tidak perlu manual click

### TC-REGISTER-E18: Error Message Persistence
- **Steps**:
  1. Submit form dengan error (password tidak match)
  2. Error muncul
  3. Fix password
  4. Submit lagi
- **Expected**: 
  - Error cleared saat re-submit
  - Jika masih error, error baru ditampilkan
  - Old error tidak stack

### TC-REGISTER-E19: Multiple Validation Errors
- **Steps**:
  1. Input password < 8 char
  2. Input confirm password berbeda
  3. Tidak centang terms
  4. Klik "Buat Akun"
- **Expected**: 
  - Tampilkan error pertama yang ditemukan
  - Priority: password match → password length → terms agreement
  - User fix satu per satu

### TC-REGISTER-E20: Slow Network Simulation
- **Precondition**: Throttle network ke Slow 3G (Chrome DevTools)
- **Steps**:
  1. Input data valid
  2. Klik "Buat Akun"
  3. Perhatikan loading state
- **Expected**: 
  - Loading indicator visible
  - Button disabled
  - Text "Membuat Akun..."
  - Tidak ada timeout error (atau timeout setelah 30s+)

### TC-REGISTER-E21: Google Sign-In Cancel
- **Steps**:
  1. Klik "Daftar dengan Google"
  2. Popup OAuth muncul
  3. Close popup tanpa authorize
- **Expected**: 
  - User tetap di halaman register
  - Tidak ada error message
  - Bisa retry

### TC-REGISTER-E22: Google Sign-In Error
- **Precondition**: Simulate OAuth error
- **Steps**:
  1. Klik "Daftar dengan Google"
  2. OAuth gagal (network issue atau permission denied)
- **Expected**: 
  - Error message: "Failed to initiate Google sign up"
  - Loading state selesai
  - User bisa retry

### TC-REGISTER-E23: Dark Mode Support (if implemented)
- **Steps**:
  1. Set browser/system ke dark mode
  2. Buka halaman `/register`
- **Expected**: 
  - Jika dark mode implemented, theme berubah
  - Contrast tetap readable
  - Colors adjusted

### TC-REGISTER-E24: Browser Back Button After Success
- **Steps**:
  1. Register berhasil
  2. Redirect ke login
  3. Klik browser back button
- **Expected**: 
  - Jika sudah login, redirect lagi ke dashboard
  - Form direset (tidak ada data lama)

### TC-REGISTER-E25: Concurrent Registrations (Same Email)
- **Precondition**: 2 browser/tab open
- **Steps**:
  1. Tab 1: Input email `test@example.com`, submit
  2. Tab 2: Input email `test@example.com`, submit dalam 1-2 detik
- **Expected**: 
  - First request berhasil
  - Second request gagal: "User already registered"
  - Database constraint prevent duplicate

---

## Test Data

### Valid Test Data
```
Nama: Julian Newman, Maria Garcia, John O'Brien
Email: testuser@example.com, test.user@domain.co.id, user+tag@gmail.com
Password: TestPassword123!, SecurePass2024, MyP@ssw0rd!
```

### Invalid Test Data
```
Email Invalid: 
  - testuser@ (incomplete domain)
  - @example.com (no username)
  - testuser (no @ and domain)
  - testuser@domain (no TLD)
  - test user@example.com (space in email)

Password Invalid:
  - Test123 (< 8 characters)
  - 1234567 (< 8 characters)
  - (empty string)

Malicious Input:
  - <script>alert('XSS')</script>
  - ' OR '1'='1'--
  - '; DROP TABLE users;--
  - ../../../etc/passwd
```

---

## Test Environment

- **Browser**: Chrome (latest), Safari, Firefox, Edge
- **Device**: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667, 414x896)
- **Network**: Fast 3G, Slow 3G, Offline
- **OS**: macOS, Windows, iOS, Android

---

## Priority

- **P0 (Critical)**: TC-REGISTER-P01, TC-REGISTER-N06, TC-REGISTER-N07, TC-REGISTER-N08, TC-REGISTER-N09, TC-REGISTER-N11
- **P1 (High)**: TC-REGISTER-P02, TC-REGISTER-P05, semua negative cases, TC-REGISTER-E09
- **P2 (Medium)**: Edge cases UI/UX, accessibility
- **P3 (Low)**: Nice-to-have edge cases

---

## Automation Coverage

Test cases yang bisa di-automate dengan Playwright:
- Semua positive cases (P01-P05)
- Negative cases N01-N14
- Edge cases E01-E24 (sebagian besar)

Manual testing required:
- Google OAuth flow (TC-REGISTER-P02, E21, E22)
- Browser autofill behavior (E08)
- Real device testing untuk responsive (E09-E11)
