// ==========================================================
// db.js  -  DATABASE LOKAL SaKe (pengganti supabase.js)
// ----------------------------------------------------------
// Berjalan 100% offline di browser memakai localStorage.
// Tidak butuh internet, server, atau library tambahan.
// Hanya cocok untuk presentasi front end (bukan keamanan asli).
// ==========================================================

const SakeDB = (function () {

  // Nama "tabel" di dalam localStorage
  const KEY_USERS = 'sake_users';      // daftar semua akun
  const KEY_SESSION = 'sake_session';  // akun yang sedang login

  // ---------- Fungsi bantu baca/tulis ----------

  function bacaUsers() {
    try {
      return JSON.parse(localStorage.getItem(KEY_USERS)) || [];
    } catch (e) {
      return [];
    }
  }

  function simpanUsers(users) {
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
  }

  // Mengacak password (SHA-256). Jika browser tidak mendukung,
  // dipakai cara sederhana sebagai cadangan.
  async function acakPassword(teks) {
    try {
      if (window.crypto && window.crypto.subtle) {
        const data = new TextEncoder().encode(teks);
        const hash = await window.crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
          .map(function (b) { return b.toString(16).padStart(2, '0'); })
          .join('');
      }
    } catch (e) { /* lanjut ke cadangan */ }

    let h = 0;
    for (let i = 0; i < teks.length; i++) {
      h = (h << 5) - h + teks.charCodeAt(i);
      h |= 0;
    }
    return 'x' + Math.abs(h).toString(16);
  }

  function buatId() {
    return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // ---------- Fungsi yang dipakai halaman ----------

  // DAFTAR AKUN BARU
  async function register(email, password) {
    email = String(email).trim().toLowerCase();

    if (password.length < 6) {
      throw new Error('Password minimal 6 karakter.');
    }

    const users = bacaUsers();

    if (users.some(function (u) { return u.email === email; })) {
      throw new Error('Email sudah terdaftar. Silakan login.');
    }

    const userBaru = {
      id: buatId(),
      email: email,
      password: await acakPassword(password),
      nama: '',
      createdAt: new Date().toISOString()
    };

    users.push(userBaru);
    simpanUsers(users);

    // Setelah daftar, langsung dianggap login
    simpanSesi(userBaru);
    return bersihkan(userBaru);
  }

  // LOGIN
  async function login(email, password) {
    email = String(email).trim().toLowerCase();

    const users = bacaUsers();
    const user = users.find(function (u) { return u.email === email; });

    if (!user) {
      throw new Error('Akun belum terdaftar.');
    }

    if (user.password !== await acakPassword(password)) {
      throw new Error('Password salah.');
    }

    simpanSesi(user);
    return bersihkan(user);
  }

  // LOGOUT
  function logout() {
    localStorage.removeItem(KEY_SESSION);
  }

  // AMBIL AKUN YANG SEDANG LOGIN (null jika belum login)
  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(KEY_SESSION));
    } catch (e) {
      return null;
    }
  }

  function isLoggedIn() {
    return getCurrentUser() !== null;
  }

  // UBAH NAMA AKUN YANG SEDANG LOGIN
  function updateNama(nama) {
    const sesi = getCurrentUser();
    if (!sesi) {
      throw new Error('Anda belum login.');
    }

    const users = bacaUsers();
    const user = users.find(function (u) { return u.id === sesi.id; });
    if (!user) {
      throw new Error('Akun tidak ditemukan.');
    }

    user.nama = String(nama).trim();
    simpanUsers(users);
    simpanSesi(user);
    return bersihkan(user);
  }

  // HAPUS SEMUA DATA (berguna untuk reset sebelum presentasi)
  function resetDatabase() {
    localStorage.removeItem(KEY_USERS);
    localStorage.removeItem(KEY_SESSION);
  }

  // ---------- Fungsi internal ----------

  function simpanSesi(user) {
    localStorage.setItem(KEY_SESSION, JSON.stringify(bersihkan(user)));
  }

  // Membuang password sebelum data dipakai di halaman
  function bersihkan(user) {
    return { id: user.id, email: user.email, nama: user.nama || '', createdAt: user.createdAt };
  }

  return {
    register: register,
    login: login,
    logout: logout,
    updateNama: updateNama,
    getCurrentUser: getCurrentUser,
    isLoggedIn: isLoggedIn,
    resetDatabase: resetDatabase
  };

})();