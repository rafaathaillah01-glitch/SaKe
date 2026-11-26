// filter.js - filter level pedas di halaman Produk
//
// Level pedas tiap produk diatur lewat atribut data-pedas di catalog.html:
//   data-pedas="1"  -> Ringan
//   data-pedas="2"  -> Sedang
//   data-pedas="3"  -> Pedas
// Untuk mengganti level sebuah produk, cukup ubah angkanya di catalog.html.

const NAMA_LEVEL = { 1: "Ringan", 2: "Sedang", 3: "Pedas" };

const kartuProduk = document.querySelectorAll(".product-grid .card");
const tombolFilter = document.querySelectorAll(".filter-btn");
const pesanKosong = document.getElementById("filterKosong");

// Tambahkan label level pedas (🌶️ + nama level) di setiap kartu
kartuProduk.forEach(function (kartu) {
    const level = Number(kartu.dataset.pedas);
    const tag = kartu.querySelector(".card-tag");
    if (!tag || !NAMA_LEVEL[level]) return;

    const badge = document.createElement("span");
    badge.className = "pedas-badge";
    badge.textContent = "🌶️".repeat(level) + " " + NAMA_LEVEL[level];
    tag.insertAdjacentElement("afterend", badge);
});

// Tampilkan hanya kartu yang sesuai dengan level yang dipilih
function terapkanFilter(level) {
    let jumlahTampil = 0;

    kartuProduk.forEach(function (kartu) {
        const cocok = level === "semua" || kartu.dataset.pedas === level;
        kartu.classList.toggle("sembunyi", !cocok);
        if (cocok) jumlahTampil++;
    });

    pesanKosong.hidden = jumlahTampil > 0;
}

// Klik tombol filter
tombolFilter.forEach(function (tombol) {
    tombol.addEventListener("click", function () {
        tombolFilter.forEach(function (t) { t.classList.remove("aktif"); });
        tombol.classList.add("aktif");
        terapkanFilter(tombol.dataset.level);
    });
});
