/* sidebar.js - dipakai halaman Akun & Keranjang
   1. Mengingat sidebar terbuka/tertutup saat pindah halaman
   2. Mengecek login, lalu menampilkan email di sidebar
   3. Fungsi logout */

const kotakSidebar = document.getElementById("sidebar-toggle");

// Pulihkan keadaan terakhir (terbuka / tertutup)
try {
    kotakSidebar.checked = localStorage.getItem("sidebarTerbuka") === "1";
} catch (e) {}

// Simpan setiap kali tombol garis tiga ditekan
kotakSidebar.addEventListener("change", function () {
    try {
        localStorage.setItem("sidebarTerbuka", kotakSidebar.checked ? "1" : "0");
    } catch (e) {}
});

// Cek login & tampilkan email
async function cekLogin() {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
        window.location.href = "loreg.html";
        return null;
    }

    document.getElementById("userEmail").textContent = data.user.email;
    return data.user;
}

async function logout() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        alert(error.message);
        return;
    }

    window.location.href = "loreg.html";
}
