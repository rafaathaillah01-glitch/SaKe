/* layout.js - mengingat sidebar sedang terbuka atau tertutup,
   supaya keadaannya ikut terbawa saat pindah halaman. */
(function () {
    const toggle = document.getElementById("sidebar-toggle");
    const sidebar = document.querySelector(".sidebar");
    if (!toggle) return;

    // Matikan animasi sebentar supaya sidebar tidak "bergeser" saat halaman baru dibuka
    sidebar.style.transition = "none";
    try { toggle.checked = localStorage.getItem("sakeSidebar") === "open"; } catch (e) {}
    sidebar.offsetHeight;              // paksa browser menggambar ulang
    sidebar.style.transition = "";

    // Simpan keadaan setiap kali tombol ditekan
    toggle.addEventListener("change", function () {
        try { localStorage.setItem("sakeSidebar", toggle.checked ? "open" : "closed"); } catch (e) {}
    });
})();
