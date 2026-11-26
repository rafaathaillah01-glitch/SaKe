// detail.js - mengisi halaman detail sesuai produk yang dipilih
// (membutuhkan products.js; cart.js dipakai untuk tombol Tambah)

const SVG_AVATAR =
    '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">' +
    '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />' +
    '</svg>';

function formatRupiah(angka) {
    return "Rp " + Number(angka).toLocaleString("id-ID");
}

function teksBintang(jumlah) {
    const n = Math.max(0, Math.min(5, Math.round(jumlah)));
    return "★".repeat(n) + "☆".repeat(5 - n);
}

// Membuat elemen HTML dengan teks aman (tidak dibaca sebagai kode)
function buatEl(tag, kelas, teks) {
    const el = document.createElement(tag);
    if (kelas) el.className = kelas;
    if (teks !== undefined) el.textContent = teks;
    return el;
}

function buatUlasan(u) {
    const kartu = buatEl("article", "review-card");

    const avatar = buatEl("div", "review-avatar");
    avatar.setAttribute("aria-hidden", "true");
    avatar.innerHTML = SVG_AVATAR;

    const body = buatEl("div", "review-body");
    const header = buatEl("div", "review-header");
    header.appendChild(buatEl("span", "review-name", u.nama));

    const bintang = buatEl("span", "review-stars", teksBintang(u.bintang));
    bintang.setAttribute("aria-label", u.bintang + " bintang");
    header.appendChild(bintang);

    body.appendChild(header);
    body.appendChild(buatEl("p", "review-comment", u.komentar));

    kartu.appendChild(avatar);
    kartu.appendChild(body);
    return kartu;
}

let produkAktif = null;
let toastTimer;

function tampilkanProduk() {
    // Ambil kode produk dari alamat halaman: dtlbwg.html?id=cumi
    const id = new URLSearchParams(window.location.search).get("id");
    produkAktif = PRODUK.find(function (p) { return p.id === id; });

    if (!produkAktif) {
        document.title = "Produk tidak ditemukan | SaKe";
        document.getElementById("detailProduk").hidden = true;
        document.getElementById("tidakDitemukan").hidden = false;
        return;
    }

    const p = produkAktif;
    document.title = "Detail Produk - " + p.nama + " | SaKe";

    // Foto
    const foto = document.getElementById("fotoProduk");
    foto.src = p.gambar;
    foto.alt = "Foto " + p.nama;

    // Nama & harga
    document.getElementById("namaProduk").textContent = p.nama;
    document.getElementById("hargaProduk").textContent = formatRupiah(p.harga);

    // Rating (dihitung otomatis dari ulasan)
    const jumlah = p.ulasan.length;
    const elBintang = document.getElementById("bintangProduk");
    const elRating = document.getElementById("ratingProduk");

    if (jumlah > 0) {
        const rata = p.ulasan.reduce(function (s, u) { return s + u.bintang; }, 0) / jumlah;
        elBintang.textContent = teksBintang(rata);
        elBintang.setAttribute("aria-label", "Rating " + rata.toFixed(1) + " dari 5 bintang");
        elRating.textContent = rata.toFixed(1) + " (" + jumlah + " Ulasan)";
    } else {
        elBintang.hidden = true;
        elRating.textContent = "Belum ada ulasan";
    }

    // Jumlah terjual
    const elTerjual = document.getElementById("terjualProduk");
    if (p.terjual > 0) {
        elTerjual.textContent = p.terjual + " Terjual";
    } else {
        elTerjual.hidden = true;
    }

    // Daftar ulasan
    const daftar = document.getElementById("daftarUlasan");
    if (jumlah > 0) {
        p.ulasan.forEach(function (u) { daftar.appendChild(buatUlasan(u)); });
    } else {
        daftar.appendChild(buatEl("p", "review-comment", "Belum ada ulasan untuk produk ini."));
    }
}

// Tombol Tambah: masukkan ke keranjang lalu tampilkan notifikasi
function tambahProduk() {
    if (!produkAktif) return;

    if (typeof tambahKeKeranjang === "function") {
        tambahKeKeranjang({
            id: produkAktif.id,
            nama: produkAktif.nama,
            harga: produkAktif.harga,
            gambar: produkAktif.gambar
        });
    }

    document.getElementById("teksToast").textContent =
        produkAktif.nama + " ditambahkan ke keranjang!";

    const toast = document.getElementById("toastNotif");
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, 2500);
}

tampilkanProduk();
