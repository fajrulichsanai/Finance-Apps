# Test Cases - Record Transaction Page

**Feature**: Halaman Record Transaksi  
**Path**: `/record`  
**Last Updated**: 22 April 2026

---

## 📋 Table of Contents

1. [Positive Test Cases](#positive-test-cases)
2. [Negative Test Cases](#negative-test-cases)
3. [Edge Cases](#edge-cases)
4. [UI/UX Test Cases](#uiux-test-cases)
5. [Performance Test Cases](#performance-test-cases)
6. [Security Test Cases](#security-test-cases)

---

## ✅ Positive Test Cases

### TC-REC-P-001: Submit Transaksi Expense dengan Data Valid
**Priority**: Critical  
**Precondition**: User sudah login, kategori sudah ada

**Test Steps**:
1. Buka halaman `/record`
2. Pilih tipe transaksi "Pengeluaran" (default)
3. Input amount: `50000`
4. Input description: "Makan siang"
5. Pilih kategori: "Makanan & Minuman"
6. Pilih tanggal: (hari ini - default)
7. Klik "Simpan Transaksi"

**Expected Result**:
- ✅ Loading state muncul pada button ("Menyimpan...")
- ✅ Toast success muncul: "Transaksi Berhasil Disimpan!"
- ✅ Form direset ke state awal setelah 2.5 detik
- ✅ Amount kembali ke 0
- ✅ Description dikosongkan
- ✅ Category direset
- ✅ Tanggal kembali ke hari ini

---

### TC-REC-P-002: Submit Transaksi Income dengan Data Valid
**Priority**: Critical  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Toggle tipe transaksi ke "Pemasukan"
3. Input amount: `5000000`
4. Input description: "Gaji bulanan"
5. Tanggal: (hari ini)
6. Klik "Simpan Transaksi"

**Expected Result**:
- ✅ Category selector TIDAK muncul (karena income)
- ✅ Loading state muncul
- ✅ Toast success muncul
- ✅ Form direset setelah sukses
- ✅ Transaksi tersimpan tanpa category_id

---

### TC-REC-P-003: Input Amount dengan Format IDR
**Priority**: High  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Klik pada input amount
3. Ketik angka: `1234567`

**Expected Result**:
- ✅ Angka diformat menjadi: "Rp 1.234.567"
- ✅ Nilai internal tetap: 1234567 (number)
- ✅ Placeholder menunjukkan format "Rp"

---

### TC-REC-P-004: Tambah Note pada Transaksi
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Isi semua field required
3. Klik pada "Note Input"
4. Ketik: "Makan di warteg langganan"
5. Submit transaksi

**Expected Result**:
- ✅ Note tersimpan bersamaan dengan transaksi
- ✅ Note tidak wajib diisi (optional)
- ✅ Transaksi berhasil disimpan dengan note

---

### TC-REC-P-005: Ubah Tanggal Transaksi ke Tanggal Kemarin
**Priority**: High  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Klik pada Date Picker
3. Pilih tanggal kemarin
4. Isi field lainnya dengan valid
5. Submit transaksi

**Expected Result**:
- ✅ Tanggal kemarin dapat dipilih
- ✅ Transaksi tersimpan dengan tanggal kemarin
- ✅ Tidak ada error message

---

### TC-REC-P-006: Toggle Tipe Transaksi Income ke Expense
**Priority**: High  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Toggle ke "Pemasukan"
3. Input amount: `100000`
4. Input description: "Bonus"
5. Toggle kembali ke "Pengeluaran"

**Expected Result**:
- ✅ Category selector muncul dengan animasi fade-in
- ✅ Form field (amount, description) direset
- ✅ Placeholder description berubah sesuai tipe
- ✅ Category_id direset ke null

---

### TC-REC-P-007: Submit dengan Amount Minimum Valid (1)
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Input amount: `1`
3. Isi field required lainnya
4. Submit transaksi

**Expected Result**:
- ✅ Transaksi berhasil disimpan
- ✅ Amount 1 diterima (karena > 0)

---

### TC-REC-P-008: Submit dengan Amount Maximum Valid (999.999.999)
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Input amount: `999999999`
3. Isi field required lainnya
4. Submit transaksi

**Expected Result**:
- ✅ Transaksi berhasil disimpan
- ✅ Amount diformat: "Rp 999.999.999"
- ✅ Tidak ada error message

---

### TC-REC-P-009: Pilih Kategori dari Daftar yang Sudah Dimuat
**Priority**: High  
**Precondition**: User sudah login, ada kategori di database

**Test Steps**:
1. Buka halaman `/record`
2. Tipe: Pengeluaran
3. Scroll ke bagian kategori
4. Pilih kategori "Transport"

**Expected Result**:
- ✅ Kategori terpilih dengan visual feedback
- ✅ Category_id tersimpan di state
- ✅ Button "Simpan Transaksi" enabled (jika field lain valid)

---

### TC-REC-P-010: Sanitasi Input Description dengan HTML Tags
**Priority**: High  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Input description: `<script>alert('xss')</script>Makan siang`
3. Isi field lainnya
4. Submit transaksi

**Expected Result**:
- ✅ HTML tags disanitasi oleh `sanitizeInput()`
- ✅ Description tersimpan tanpa script tag
- ✅ Transaksi berhasil disimpan

---

## ❌ Negative Test Cases

### TC-REC-N-001: Submit Tanpa Description
**Priority**: Critical  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Input amount: `50000`
3. Pilih kategori
4. Kosongkan description (atau isi dengan whitespace saja)
5. Klik "Simpan Transaksi"

**Expected Result**:
- ❌ Button "Simpan Transaksi" disabled
- ❌ Tooltip muncul: "Masukkan deskripsi transaksi"
- ❌ Transaksi TIDAK tersimpan
- ❌ Validasi error: "Deskripsi transaksi harus diisi"

---

### TC-REC-N-002: Submit Expense Tanpa Kategori
**Priority**: Critical  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Tipe: "Pengeluaran"
3. Input amount: `100000`
4. Input description: "Beli barang"
5. Tidak pilih kategori
6. Klik "Simpan Transaksi"

**Expected Result**:
- ❌ Button disabled
- ❌ Tooltip: "Pilih kategori terlebih dahulu"
- ❌ Error message inline: "Pilih kategori untuk pengeluaran"
- ❌ Transaksi TIDAK tersimpan

---

### TC-REC-N-003: Submit dengan Amount = 0
**Priority**: Critical  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Input amount: `0` (atau kosongkan)
3. Isi field lainnya
4. Klik "Simpan Transaksi"

**Expected Result**:
- ❌ Button disabled
- ❌ Tooltip: "Masukkan jumlah transaksi"
- ❌ Validasi error: "Jumlah harus lebih dari 0"
- ❌ Transaksi TIDAK tersimpan

---

### TC-REC-N-004: Submit dengan Amount Negatif
**Priority**: High  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Coba input amount: `-50000`
3. Isi field lainnya
4. Coba submit

**Expected Result**:
- ❌ Input tidak menerima nilai negatif
- ❌ Button disabled
- ❌ Transaksi TIDAK tersimpan

---

### TC-REC-N-005: Submit dengan Amount Melebihi Batas Maximum (> 999.999.999)
**Priority**: High  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Input amount: `1000000000` (1 miliar)
3. Isi field lainnya
4. Klik "Simpan Transaksi"

**Expected Result**:
- ❌ Error message inline: "Jumlah transaksi terlalu besar (max: Rp 999.999.999)"
- ❌ Background merah pada inline error dengan icon
- ❌ Transaksi TIDAK tersimpan

---

### TC-REC-N-006: Submit dengan Tanggal di Masa Depan
**Priority**: Critical  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Isi semua field valid
3. Ubah tanggal menjadi besok atau tanggal masa depan
4. Klik "Simpan Transaksi"

**Expected Result**:
- ❌ Validasi error: "Tanggal transaksi tidak boleh di masa depan"
- ❌ Error popup atau inline error muncul
- ❌ Transaksi TIDAK tersimpan

---

### TC-REC-N-007: Akses Halaman Record Tanpa Login
**Priority**: Critical  
**Precondition**: User belum login atau session expired

**Test Steps**:
1. Logout dari aplikasi
2. Akses langsung URL `/record`

**Expected Result**:
- ❌ User di-redirect ke `/auth`
- ❌ Halaman record TIDAK muncul
- ❌ Auth check gagal di useEffect

---

### TC-REC-N-008: Submit Saat Kategori Masih Loading
**Priority**: High  
**Precondition**: User sudah login, koneksi lambat

**Test Steps**:
1. Buka halaman `/record` (simulasi slow network)
2. Tipe: "Pengeluaran"
3. Kategori masih loading (skeleton)
4. Coba klik "Simpan Transaksi"

**Expected Result**:
- ❌ Button disabled
- ❌ Text button: "Menunggu Kategori..."
- ❌ Tooltip: "Menunggu kategori dimuat..."
- ❌ Error message: "Kategori masih dimuat. Silakan tunggu..."
- ❌ Transaksi TIDAK tersimpan

---

### TC-REC-N-009: Double Click pada Button Submit
**Priority**: High  
**Precondition**: User sudah login, data valid

**Test Steps**:
1. Buka halaman `/record`
2. Isi semua field dengan valid
3. Klik "Simpan Transaksi" 2x dengan cepat (double click)

**Expected Result**:
- ✅ Hanya 1 transaksi yang tersimpan
- ✅ `submission.status === 'loading'` mencegah multiple submit
- ✅ Button disabled saat loading

---

### TC-REC-N-010: Submit dengan Network Error
**Priority**: High  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Isi semua field valid
3. Disconnect internet
4. Klik "Simpan Transaksi"

**Expected Result**:
- ❌ Error Popup muncul
- ❌ Title: "Gagal Menyimpan Transaksi"
- ❌ Message: Error dari catch block
- ❌ Button "Retry" dan "Cancel" muncul
- ❌ Transaksi TIDAK tersimpan
- ❌ Form data tetap ada (tidak direset)

---

### TC-REC-N-011: Submit dengan Supabase Error (RPC Fail)
**Priority**: High  
**Precondition**: User sudah login, Supabase error

**Test Steps**:
1. Buka halaman `/record`
2. Isi semua field valid
3. Trigger Supabase error (misal: RLS policy gagal)
4. Submit transaksi

**Expected Result**:
- ❌ Error Popup muncul
- ❌ Message dari error handler
- ❌ Transaksi TIDAK tersimpan
- ❌ Result tidak memiliki ID

---

### TC-REC-N-012: Submit Description dengan Whitespace Saja
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Input description: `     ` (5 spasi)
3. Isi field lainnya valid
4. Coba submit

**Expected Result**:
- ❌ Button disabled
- ❌ Validasi: `!formData.description.trim()` gagal
- ❌ Transaksi TIDAK tersimpan

---

### TC-REC-N-013: Cancel Request saat User Navigate Away
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Isi data valid
3. Klik "Simpan Transaksi"
4. Segera navigate away (klik back atau ganti halaman) sebelum request selesai

**Expected Result**:
- ✅ AbortController membatalkan request
- ✅ Error `AbortError` tidak ditampilkan ke user
- ✅ Submission state reset ke 'idle'
- ✅ Tidak ada memory leak

---

## 🔍 Edge Cases

### TC-REC-E-001: Input Amount dengan Karakter Non-Numeric
**Priority**: High  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Coba ketik di amount: `abc123`, `1.2.3`, `Rp50000`, `50000abc`

**Expected Result**:
- ✅ AmountInput component hanya terima numeric
- ✅ Karakter non-numeric diabaikan atau di-filter
- ✅ Hanya angka valid yang tersimpan

---

### TC-REC-E-002: Input Description dengan Special Characters
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Input description: `Makan @ Café "Nusantara" & Minum 50%`
3. Submit transaksi

**Expected Result**:
- ✅ Special characters diterima
- ✅ `sanitizeInput()` membersihkan HTML tags tapi keep special chars
- ✅ Transaksi tersimpan dengan benar

---

### TC-REC-E-003: Input Description dengan Emoji
**Priority**: Low  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Input description: `Makan siang 🍜🍚 enak banget 😋`
3. Submit transaksi

**Expected Result**:
- ✅ Emoji diterima dan tersimpan
- ✅ Database mendukung emoji (UTF-8)
- ✅ Display di UI tidak rusak

---

### TC-REC-E-004: Input Description dengan Panjang Maximum
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Input description dengan 500 karakter
3. Submit transaksi

**Expected Result**:
- ✅ Jika ada limit, validasi error muncul
- ✅ Jika tidak ada limit, transaksi tersimpan
- ✅ UI tidak break dengan text panjang

---

### TC-REC-E-005: Input Note dengan Panjang Maximum
**Priority**: Low  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Input note dengan 1000+ karakter
3. Submit transaksi

**Expected Result**:
- ✅ Jika ada limit, validasi atau truncate
- ✅ UI tidak break
- ✅ Database column cukup menampung

---

### TC-REC-E-006: Rapid Toggle Type (Income ↔ Expense)
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Toggle Income → Expense → Income → Expense dengan sangat cepat (5x dalam 2 detik)

**Expected Result**:
- ✅ State tetap konsisten
- ✅ Tidak ada race condition
- ✅ Category selector muncul/hilang sesuai type
- ✅ Form data direset dengan benar
- ✅ Tidak ada memory leak

---

### TC-REC-E-007: Submit Tepat di Boundary Date (Tengah Malam)
**Priority**: Low  
**Precondition**: User sudah login, waktu sistem 23:59:59

**Test Steps**:
1. Buka halaman `/record` jam 23:59:50
2. Isi data valid dengan tanggal hari ini
3. Submit tepat setelah jam 00:00:00 (besok)

**Expected Result**:
- ⚠️ Validasi date masih menggunakan date string comparison
- ⚠️ Kemungkinan edge case jika timezone berbeda
- ✅ Transaksi tersimpan dengan tanggal yang benar

---

### TC-REC-E-008: User Session Expired saat Mengisi Form
**Priority**: High  
**Precondition**: User sudah login, session hampir expired

**Test Steps**:
1. Login
2. Buka halaman `/record`
3. Isi form perlahan hingga session expired
4. Klik "Simpan Transaksi"

**Expected Result**:
- ❌ Auth check gagal saat submit
- ❌ Error dari Supabase: Unauthorized
- ❌ User di-redirect ke `/auth` (idealnya)
- ❌ Transaksi TIDAK tersimpan

---

### TC-REC-E-009: Multiple Tabs Open - Submit di 2 Tabs Bersamaan
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka `/record` di Tab 1
2. Buka `/record` di Tab 2
3. Isi data yang sama di kedua tab
4. Submit di Tab 1 dan Tab 2 hampir bersamaan (1 detik selisih)

**Expected Result**:
- ✅ Kedua transaksi tersimpan (tidak ada conflict)
- ✅ Masing-masing punya ID berbeda
- ✅ Tidak ada race condition
- ✅ State management per-tab independent

---

### TC-REC-E-010: Browser Back Button saat Loading
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Isi data valid
3. Klik "Simpan Transaksi"
4. Saat loading, klik browser back button

**Expected Result**:
- ✅ AbortController membatalkan request
- ✅ Cleanup useEffect jalan (clearTimeout, abort)
- ✅ Tidak ada memory leak
- ✅ User kembali ke halaman sebelumnya

---

### TC-REC-E-011: Submit dengan Slow Network (Timeout)
**Priority**: High  
**Precondition**: User sudah login, network 3G

**Test Steps**:
1. Buka halaman `/record`
2. Throttle network ke 3G/Slow 3G
3. Isi data valid
4. Submit transaksi
5. Request memakan waktu >30 detik

**Expected Result**:
- ⚠️ Tergantung timeout config Supabase client
- ❌ Jika timeout, error muncul
- ✅ Loading state tidak stuck forever
- ✅ User bisa retry

---

### TC-REC-E-012: Kategori List Kosong (Belum Ada Kategori)
**Priority**: High  
**Precondition**: User baru login, belum ada kategori

**Test Steps**:
1. Login sebagai user baru
2. Buka halaman `/record`
3. Pilih tipe "Pengeluaran"
4. Lihat category selector

**Expected Result**:
- ✅ Category selector muncul tapi kosong
- ⚠️ Idealnya ada pesan: "Belum ada kategori"
- ❌ Button "Simpan" disabled karena category_id null
- ⚠️ User stuck tidak bisa submit expense (harus buat kategori dulu)

---

### TC-REC-E-013: Component Unmount saat Async Operation
**Priority**: High  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Isi data valid
3. Klik "Simpan Transaksi"
4. Saat proses async createTransaction, unmount component (navigate away)

**Expected Result**:
- ✅ AbortController abort request
- ✅ setState tidak dipanggil setelah unmount
- ✅ Tidak ada warning: "Can't perform state update on unmounted component"
- ✅ Cleanup berjalan dengan baik

---

### TC-REC-E-014: Input Amount dengan Decimal/Float
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Coba input amount: `50000.50`, `1234.99`

**Expected Result**:
- ⚠️ Tergantung implementasi AmountInput
- ✅ Jika integer only, decimal diabaikan/di-round
- ✅ Format tetap konsisten (IDR biasanya integer)

---

### TC-REC-E-015: Copy-Paste Text Panjang ke Description
**Priority**: Low  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Copy text panjang (500+ karakter) dari dokumen lain
3. Paste ke field description
4. Submit

**Expected Result**:
- ✅ Text diterima dan tersimpan
- ✅ UI tidak break
- ✅ Jika ada limit, validasi atau truncate

---

### TC-REC-E-016: SQL Injection Attempt di Description
**Priority**: Critical (Security)  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Input description: `'; DROP TABLE transactions; --`
3. Submit transaksi

**Expected Result**:
- ✅ Supabase/PostgreSQL prepared statements mencegah injection
- ✅ `sanitizeInput()` membersihkan input
- ✅ Transaksi tersimpan sebagai plain text
- ✅ Database TIDAK rusak

---

### TC-REC-E-017: XSS Attempt di Note Field
**Priority**: Critical (Security)  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Input note: `<img src=x onerror=alert('XSS')>`
3. Submit transaksi
4. Lihat transaksi di halaman activity/dashboard

**Expected Result**:
- ✅ `sanitizeInput()` remove HTML tags
- ✅ Script tidak dieksekusi
- ✅ Display di UI aman (React escape by default)

---

### TC-REC-E-018: Resize Window saat Form Terisi
**Priority**: Low  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record` di desktop (wide screen)
2. Isi setengah form
3. Resize window ke mobile size (375px)
4. Lanjut isi form dan submit

**Expected Result**:
- ✅ Form data tidak hilang saat resize
- ✅ Layout responsive dengan baik
- ✅ Button tetap accessible
- ✅ Transaksi berhasil disimpan

---

### TC-REC-E-019: Rotate Device (Mobile) saat Form Terisi
**Priority**: Low  
**Precondition**: User sudah login, buka di mobile

**Test Steps**:
1. Buka halaman `/record` di mobile (portrait)
2. Isi beberapa field
3. Rotate device ke landscape
4. Rotate kembali ke portrait
5. Submit

**Expected Result**:
- ✅ Form data tidak hilang
- ✅ Layout adjust dengan baik
- ✅ Transaksi tersimpan

---

### TC-REC-E-020: Browser Auto-fill Description
**Priority**: Low  
**Precondition**: User sudah pernah isi form sebelumnya

**Test Steps**:
1. Buka halaman `/record`
2. Klik pada description input
3. Browser suggest auto-fill dari history
4. Pilih salah satu suggestion
5. Submit

**Expected Result**:
- ✅ Auto-fill value diterima dengan baik
- ✅ State terupdate
- ✅ Transaksi tersimpan

---

## 🎨 UI/UX Test Cases

### TC-REC-UI-001: Loading State pada Button Submit
**Priority**: High  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Isi data valid
3. Klik "Simpan Transaksi"
4. Amati button saat loading

**Expected Result**:
- ✅ Text berubah: "Menyimpan..."
- ✅ Button disabled
- ✅ Loading indicator (jika ada)
- ✅ User tidak bisa double-click

---

### TC-REC-UI-002: Success Toast Animation
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Isi data valid
3. Submit transaksi
4. Amati success toast

**Expected Result**:
- ✅ Toast muncul dengan animasi smooth
- ✅ Icon success (checkmark)
- ✅ Title: "Transaksi Berhasil Disimpan!"
- ✅ Message: "Saldo Anda telah diperbarui."
- ✅ Auto dismiss setelah 3 detik
- ✅ Bisa dismiss manual dengan close button

---

### TC-REC-UI-003: Error Popup Retry Button
**Priority**: High  
**Precondition**: User sudah login, akan trigger error

**Test Steps**:
1. Buka halaman `/record`
2. Trigger error (disconnect network)
3. Submit transaksi
4. Error popup muncul
5. Klik "Retry"

**Expected Result**:
- ✅ Popup close
- ✅ `handleSave()` dipanggil lagi
- ✅ Form data tidak hilang
- ✅ Retry attempt berjalan

---

### TC-REC-UI-004: Error Popup Cancel Button
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Trigger error popup
2. Klik "Cancel"

**Expected Result**:
- ✅ Popup close
- ✅ Submission state reset ke 'idle'
- ✅ Form data tetap ada (tidak direset)
- ✅ User bisa edit dan retry manual

---

### TC-REC-UI-005: Category Selector Animation (Fade-in)
**Priority**: Low  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Toggle dari Income ke Expense
3. Amati category selector muncul

**Expected Result**:
- ✅ Animasi fade-in smooth
- ✅ Class: `animate-fade-in-up`
- ✅ Tidak ada layout shift (CLS = 0)

---

### TC-REC-UI-006: Disabled Button Tooltip
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Jangan isi description
3. Hover button "Simpan Transaksi"

**Expected Result**:
- ✅ Tooltip muncul: "Masukkan deskripsi transaksi"
- ✅ Button opacity 50% (disabled state)
- ✅ Cursor: not-allowed

---

### TC-REC-UI-007: Inline Error Message Visual
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Trigger validasi error (misal: amount > max)
3. Amati inline error message

**Expected Result**:
- ✅ Background: red-50
- ✅ Border-left: red-500 (4px)
- ✅ Icon warning
- ✅ Text red-700
- ✅ Animasi fade-in-up

---

### TC-REC-UI-008: Responsive Layout - Mobile (375px)
**Priority**: High  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record` di viewport 375px x 667px (iPhone SE)
2. Test semua interaksi

**Expected Result**:
- ✅ Semua element fit dalam viewport
- ✅ Tidak ada horizontal scroll
- ✅ Button accessible (tidak tertutup bottom nav)
- ✅ Font size readable
- ✅ Touch target ≥ 44px

---

### TC-REC-UI-009: Responsive Layout - Tablet (768px)
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record` di viewport 768px x 1024px (iPad)
2. Test layout

**Expected Result**:
- ✅ Max-width container: 430px (tetap centered)
- ✅ Layout tidak stretched
- ✅ Spacing proporsional

---

### TC-REC-UI-010: Placeholder Description Dinamis
**Priority**: Low  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Tipe: Expense → Cek placeholder
3. Toggle ke Income → Cek placeholder

**Expected Result**:
- ✅ Expense: "Untuk apa? (cth: makan pecel, bensin, bayar listrik)"
- ✅ Income: "Untuk apa? (cth: gaji bulanan, freelance, bonus)"

---

### TC-REC-UI-011: Focus State pada Input Fields
**Priority**: Low  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Tab through semua input fields
3. Amati focus indicator

**Expected Result**:
- ✅ Focus ring visible (accessibility)
- ✅ Keyboard navigation works
- ✅ Focus order logical

---

### TC-REC-UI-012: Dark Mode Support (Jika Ada)
**Priority**: Low  
**Precondition**: User sudah login, dark mode enabled

**Test Steps**:
1. Enable dark mode
2. Buka halaman `/record`
3. Test semua state (idle, loading, error, success)

**Expected Result**:
- ✅ Background: dark mode color
- ✅ Text contrast readable
- ✅ Button styles adjust
- ✅ Toast/popup dark mode

---

## ⚡ Performance Test Cases

### TC-REC-PERF-001: Initial Page Load Time
**Priority**: High  
**Precondition**: User sudah login, cold start

**Test Steps**:
1. Clear cache
2. Navigate ke `/record`
3. Measure time to interactive

**Expected Result**:
- ✅ Page load < 2 detik (3G)
- ✅ Category data fetched in parallel
- ✅ No blocking requests

---

### TC-REC-PERF-002: Category Loading Performance
**Priority**: High  
**Precondition**: User punya 50+ kategori

**Test Steps**:
1. Login sebagai user dengan banyak kategori
2. Buka halaman `/record`
3. Toggle ke Expense
4. Measure category load time

**Expected Result**:
- ✅ Category list render < 500ms
- ✅ Skeleton loading saat fetch
- ✅ Sorted by usage (query optimized)

---

### TC-REC-PERF-003: Submit Transaction Response Time
**Priority**: High  
**Precondition**: User sudah login, normal network

**Test Steps**:
1. Buka halaman `/record`
2. Isi data valid
3. Submit transaksi
4. Measure submit time

**Expected Result**:
- ✅ Submit success < 1 detik (normal network)
- ✅ No unnecessary re-renders
- ✅ Toast muncul segera setelah success

---

### TC-REC-PERF-004: Form Re-render Count
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record` dengan React DevTools Profiler
2. Ketik di amount input: `12345` (5 angka)
3. Hitung re-render

**Expected Result**:
- ✅ Minimal re-render (ideally 5-6x for 5 keystrokes)
- ✅ useCallback/useMemo optimize re-render
- ✅ Component tidak re-render unnecessarily

---

### TC-REC-PERF-005: Memory Leak Test
**Priority**: High  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Submit 10 transaksi berturut-turut
3. Navigate away
4. Check memory dengan DevTools

**Expected Result**:
- ✅ Timeout cleared (useEffect cleanup)
- ✅ AbortController cleanup
- ✅ No event listener left behind
- ✅ Memory released

---

### TC-REC-PERF-006: Concurrent Requests Handling
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Buka halaman `/record`
2. Submit transaksi → Immediately submit lagi
3. Amati network tab

**Expected Result**:
- ✅ Previous request di-abort
- ✅ Only latest request processed
- ✅ No duplicate transactions

---

## 🔒 Security Test Cases

### TC-REC-SEC-001: Authentication Check on Mount
**Priority**: Critical  
**Precondition**: No session

**Test Steps**:
1. Hapus session/cookie
2. Akses `/record` langsung via URL

**Expected Result**:
- ✅ Auth check gagal
- ✅ Redirect ke `/auth`
- ✅ Page content tidak render

---

### TC-REC-SEC-002: XSS Prevention di Description
**Priority**: Critical  
**Precondition**: User sudah login

**Test Steps**:
1. Input description: `<img src=x onerror=alert(1)>`
2. Submit
3. Lihat di activity page

**Expected Result**:
- ✅ Script tidak eksekusi
- ✅ `sanitizeInput()` clean input
- ✅ React escape by default

---

### TC-REC-SEC-003: SQL Injection Prevention
**Priority**: Critical  
**Precondition**: User sudah login

**Test Steps**:
1. Input description: `'; DELETE FROM transactions WHERE '1'='1`
2. Submit

**Expected Result**:
- ✅ Supabase prepared statements protect
- ✅ Input treated as string literal
- ✅ No database damage

---

### TC-REC-SEC-004: CSRF Protection
**Priority**: High  
**Precondition**: User sudah login

**Test Steps**:
1. Coba submit form dari external site dengan user's session

**Expected Result**:
- ✅ Supabase auth token required
- ✅ Same-origin policy enforced
- ✅ Request rejected if no valid session

---

### TC-REC-SEC-005: Input Sanitization Test
**Priority**: High  
**Precondition**: User sudah login

**Test Steps**:
1. Input description dan note dengan berbagai payload:
   - `<script>alert(1)</script>`
   - `javascript:alert(1)`
   - `<iframe src=...>`
2. Submit

**Expected Result**:
- ✅ Semua HTML tags removed
- ✅ `sanitizeInput()` works correctly
- ✅ Data tersimpan clean

---

### TC-REC-SEC-006: User ID Validation (Supabase RLS)
**Priority**: Critical  
**Precondition**: User sudah login

**Test Steps**:
1. Submit transaksi
2. Verifikasi di database bahwa user_id = auth.uid()
3. Coba manipulasi user_id di client (jika possible)

**Expected Result**:
- ✅ Supabase RLS enforce user_id = auth.uid()
- ✅ User tidak bisa submit untuk user lain
- ✅ Server-side validation

---

### TC-REC-SEC-007: Rate Limiting (Jika Ada)
**Priority**: Medium  
**Precondition**: User sudah login

**Test Steps**:
1. Submit 100 transaksi dalam 1 menit

**Expected Result**:
- ⚠️ Jika ada rate limit, request ditolak setelah threshold
- ⚠️ Error message: "Too many requests"
- ⚠️ User di-block sementara

---

### TC-REC-SEC-008: Session Timeout Handling
**Priority**: High  
**Precondition**: User sudah login, session hampir expired

**Test Steps**:
1. Login
2. Tunggu hingga session expired (tergantung config)
3. Coba submit transaksi

**Expected Result**:
- ❌ Auth error dari Supabase
- ✅ User di-redirect ke `/auth`
- ✅ Error message: session expired

---

---

## 📊 Test Coverage Summary

| **Category**           | **Test Cases** | **Priority Critical** | **Priority High** | **Priority Medium** | **Priority Low** |
|------------------------|----------------|-----------------------|-------------------|---------------------|------------------|
| **Positive**           | 10             | 2                     | 4                 | 3                   | 1                |
| **Negative**           | 13             | 5                     | 6                 | 2                   | 0                |
| **Edge Cases**         | 20             | 2                     | 5                 | 7                   | 6                |
| **UI/UX**              | 12             | 0                     | 2                 | 4                   | 6                |
| **Performance**        | 6              | 0                     | 3                 | 3                   | 0                |
| **Security**           | 8              | 4                     | 3                 | 1                   | 0                |
| **TOTAL**              | **69**         | **13**                | **23**            | **20**              | **13**           |

---

## 🎯 Priority Guidelines

- **Critical**: Must pass sebelum production deploy (security, data integrity, blocking bugs)
- **High**: Core functionality, user-facing bugs, performance issues
- **Medium**: Edge cases yang reasonably bisa terjadi, minor bugs
- **Low**: Nice-to-have, rare edge cases, cosmetic issues

---

## 🔧 Testing Tools Recommendation

1. **Manual Testing**: User acceptance testing
2. **Automation**: Playwright (sudah ada di project)
3. **Performance**: Lighthouse, Chrome DevTools
4. **Security**: OWASP ZAP, manual penetration testing
5. **Cross-browser**: BrowserStack, LambdaTest

---

## 📝 Notes untuk QA Engineer

- Focus on **Critical** dan **High** priority test cases terlebih dahulu
- Test di multiple devices (iPhone, Android, Desktop)
- Test di berbagai network condition (WiFi, 4G, 3G)
- Gunakan real data untuk testing (bukan mock)
- Dokumentasikan semua bugs dengan screenshot/video
- Re-test setelah bug fixed

---

**Document Version**: 1.0  
**Created by**: Fajrul Ichsan Kamil (GitHub Copilot - Critical Code Tester Mode)  
**Last Updated**: 22 April 2026
