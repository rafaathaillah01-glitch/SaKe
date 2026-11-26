// auth.js - dipakai SEMUA halaman (beranda, produk, keranjang, akun):
// cek login, tampilkan email di sidebar, dan logout.
// (memakai database lokal SakeDB, jadi db.js harus dimuat lebih dulu)

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