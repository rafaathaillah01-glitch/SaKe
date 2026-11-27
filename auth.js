// auth.js - dipakai SEMUA halaman (beranda, produk, keranjang, akun):
// cek login, tampilkan email di sidebar, dan logout.
// (memakai database lokal SakeDB, jadi db.js harus dimuat lebih dulu)

// Huruf depan dari nama akun (kalau nama belum diisi, dipakai bagian depan email)
function inisialAkun(user) {
    const nama = user.nama || user.email.split("@")[0];
    return nama.charAt(0).toUpperCase();
}

async function cekLogin() {
    const user = SakeDB.getCurrentUser();

    // Belum login -> kembali ke halaman login
    if (!user) {
        window.location.href = "loreg.html";
        return null;
    }

    // Tampilkan email jika elemennya ada di halaman
    const elEmail = document.getElementById("userEmail");
    if (elEmail) {
        elEmail.textContent = user.email;
    }

    // Isi huruf depan nama di foto profil (pojok kanan atas), jika ada di halaman
    const elAvatar = document.getElementById("avatarNav");
    if (elAvatar) {
        elAvatar.textContent = inisialAkun(user);
    }

    return user;
}

async function logout() {
    SakeDB.logout();
    window.location.href = "loreg.html";
}

// Otomatis dijalankan di setiap halaman yang memuat auth.js,
// supaya tulisan "Memuat akun..." di sidebar langsung berganti jadi email.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cekLogin);
} else {
    cekLogin();
}
