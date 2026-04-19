# Test Case: Login

## Positive Test Cases

### TC-LOGIN-P01: Login dengan Email dan Password Valid
- **Precondition**: User sudah terdaftar di sistem
- **Steps**:
  1. Buka halaman login
  2. Input email valid (contoh: `testuser@example.com`)
  3. Input password valid (contoh: `TestPassword123!`)
  4. Klik tombol "Masuk"
- **Expected**: Redirect ke dashboard, tidak ada error

### TC-LOGIN-P02: Login dengan Google
- **Precondition**: User memiliki akun Google
- **Steps**:
  1. Buka halaman login
  2. Klik tombol "Masuk dengan Google"
  3. Pilih akun Google di popup
  4. Authorize aplikasi
- **Expected**: Redirect ke dashboard setelah OAuth berhasil

### TC-LOGIN-P03: Navigasi ke Lupa Password
- **Steps**:
  1. Buka halaman login
  2. Klik link "LUPA KATA SANDI?"
- **Expected**: Redirect ke `/auth/forgot-password`

### TC-LOGIN-P04: Navigasi ke Halaman Register
- **Steps**:
  1. Buka halaman login
  2. Scroll ke bawah
  3. Klik link "Daftar"
- **Expected**: Redirect ke `/register`

### TC-LOGIN-P05: Display Success Message
- **Precondition**: User baru reset password atau verifikasi email
- **Steps**:
  1. Akses login dengan success query parameter
- **Expected**: Success message hijau muncul di atas form

---

## Negative Test Cases

### TC-LOGIN-N01: Login dengan Email Kosong
- **Steps**:
  1. Buka halaman login
  2. Biarkan field email kosong
  3. Input password
  4. Klik tombol "Masuk"
- **Expected**: HTML5 validation error "Please fill out this field"

### TC-LOGIN-N02: Login dengan Password Kosong
- **Steps**:
  1. Buka halaman login
  2. Input email valid
  3. Biarkan field password kosong
  4. Klik tombol "Masuk"
- **Expected**: HTML5 validation error "Please fill out this field"

### TC-LOGIN-N03: Login dengan Email Format Invalid
- **Steps**:
  1. Buka halaman login
  2. Input email format salah (contoh: `testuser@`)
  3. Input password valid
  4. Klik tombol "Masuk"
- **Expected**: HTML5 validation error atau error message "Invalid email format"

### TC-LOGIN-N04: Login dengan Password Salah
- **Precondition**: User terdaftar dengan password tertentu
- **Steps**:
  1. Buka halaman login
  2. Input email valid
  3. Input password salah (contoh: `WrongPassword123!`)
  4. Klik tombol "Masuk"
- **Expected**: 
  - Error message merah muncul: "Invalid login credentials"
  - User tetap di halaman login

### TC-LOGIN-N05: Login dengan User Tidak Terdaftar
- **Steps**:
  1. Buka halaman login
  2. Input email yang tidak terdaftar (contoh: `notexist@example.com`)
  3. Input password apapun
  4. Klik tombol "Masuk"
- **Expected**: Error message "Invalid login credentials"

### TC-LOGIN-N06: Tombol Disable Saat Loading
- **Steps**:
  1. Buka halaman login
  2. Input credentials valid
  3. Klik tombol "Masuk"
  4. Perhatikan state tombol sebelum response
- **Expected**: 
  - Tombol disabled
  - Text berubah menjadi "Masuk..."
  - Tidak bisa diklik lagi

### TC-LOGIN-N07: Multiple Failed Login Attempts
- **Steps**:
  1. Buka halaman login
  2. Input email valid tapi password salah
  3. Klik "Masuk" → Gagal
  4. Ulangi 3-5 kali dengan password salah
- **Expected**: Error message tetap muncul di setiap attempt

### TC-LOGIN-N08: SQL Injection Attempt
- **Steps**:
  1. Buka halaman login
  2. Input SQL injection string di email: `' OR '1'='1`
  3. Input password apapun
  4. Klik "Masuk"
- **Expected**: 
  - Login gagal
  - Error message "Invalid login credentials"
  - Tidak ada database error leak

---

## Edge Cases

### TC-LOGIN-E01: Login dengan Whitespace di Email
- **Steps**:
  1. Input email dengan spasi di awal/akhir: ` testuser@example.com `
  2. Input password valid
  3. Klik "Masuk"
- **Expected**: Whitespace di-trim, login berhasil jika credentials valid

### TC-LOGIN-E02: Copy-Paste Password dengan Karakter Hidden
- **Steps**:
  1. Copy password dari notepad dengan trailing newline
  2. Paste ke field password
  3. Klik "Masuk"
- **Expected**: Trailing characters di-handle atau error jelas

### TC-LOGIN-E03: Browser Autofill
- **Precondition**: Browser punya saved credentials
- **Steps**:
  1. Buka halaman login
  2. Klik field email
  3. Pilih autofill suggestion
- **Expected**: 
  - Email dan password ter-fill otomatis
  - Login bisa langsung dilakukan

### TC-LOGIN-E04: Responsive UI Mobile
- **Steps**:
  1. Buka halaman login di mobile viewport (375px)
  2. Verifikasi semua elemen visible
  3. Test input keyboard mobile
- **Expected**: 
  - Layout responsive
  - Keyboard tidak overlap form
  - Touch target cukup besar (min 44px)
