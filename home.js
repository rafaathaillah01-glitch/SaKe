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

    // Isi huruf depan nama di foto profil (pojok kanan atas)
    const elAvatar = document.getElementById("avatarNav");
    if (elAvatar) {
        const nama = user.nama || user.email.split("@")[0];
        elAvatar.textContent = nama.charAt(0).toUpperCase();
    }
}

async function logout() {
    SakeDB.logout();
    window.location.href = "loreg.html";
}

tampilkanAkun();
