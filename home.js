// home.js - halaman Beranda: tampilkan email di sidebar dan logout
// (memakai database lokal SakeDB, jadi db.js harus dimuat lebih dulu)

async function tampilkanAkun() {
    const user = SakeDB.getCurrentUser();

    // Belum login -> kembali ke halaman login
    if (!user) {
        window.location.href = "loreg.html";
        return;
    }

    document.getElementById("userEmail").textContent = user.email;
}

async function logout() {
    SakeDB.logout();
    window.location.href = "loreg.html";
}

tampilkanAkun();