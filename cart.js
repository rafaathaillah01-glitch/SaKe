// cart.js - keranjang belanja, disimpan di browser (localStorage)
//
// Bentuk satu barang:
// { id: "cumi", nama: "Sambal Cumi", harga: 25000, jumlah: 1, gambar: "Cumi.jpg" }
//
// Untuk menambah barang dari halaman produk, panggil:
//   tambahKeKeranjang({ id: "cumi", nama: "Sambal Cumi", harga: 25000, gambar: "Cumi.jpg" });
// (halaman itu harus memuat cart.js)

const KUNCI = "keranjang_sake";

function bacaKeranjang() {
    try {
        const data = JSON.parse(localStorage.getItem(KUNCI));
        return Array.isArray(data) ? data : [];
    } catch (e) {
        return [];
    }
}

function simpanKeranjang(items) {
    localStorage.setItem(KUNCI, JSON.stringify(items));
}

function tambahKeKeranjang(barang) {
    const items = bacaKeranjang();
    const ada = items.find(b => b.id === barang.id);
    if (ada) {
        ada.jumlah++;
    } else {
        items.push({ ...barang, jumlah: 1 });
    }
    simpanKeranjang(items);
}

function rupiah(angka) {
    return "Rp " + Number(angka).toLocaleString("id-ID");
}

function aman(teks) {
    const d = document.createElement("div");
    d.textContent = teks;
    return d.innerHTML;
}

function tampilkan() {
    const daftar = document.getElementById("daftar");
    if (!daftar) return;   // dipanggil dari halaman lain

    const items = bacaKeranjang();
    const ada = items.length > 0;

    document.getElementById("kosong").hidden = ada;
    document.getElementById("ringkasan").hidden = !ada;

    daftar.innerHTML = items.map(function (b) {
        return `
        <article class="box cart-item">
            <img src="${aman(b.gambar || "")}" alt="${aman(b.nama)}">
            <div class="item-info">
                <h3>${aman(b.nama)}</h3>
                <p class="harga">${rupiah(b.harga)}</p>
                <div class="qty">
                    <button data-aksi="kurang" data-id="${aman(b.id)}" aria-label="Kurangi">−</button>
                    <span>${b.jumlah}</span>
                    <button data-aksi="tambah" data-id="${aman(b.id)}" aria-label="Tambah">+</button>
                </div>
            </div>
            <button class="hapus" data-aksi="hapus" data-id="${aman(b.id)}" aria-label="Hapus">×</button>
        </article>`;
    }).join("");

    document.getElementById("totalJumlah").textContent =
        items.reduce((s, b) => s + b.jumlah, 0);
    document.getElementById("totalHarga").textContent =
        rupiah(items.reduce((s, b) => s + b.jumlah * b.harga, 0));
}

const elDaftar = document.getElementById("daftar");
if (elDaftar) {
    elDaftar.addEventListener("click", function (e) {
        const tombol = e.target.closest("button[data-aksi]");
        if (!tombol) return;

        let items = bacaKeranjang();
        const barang = items.find(b => String(b.id) === tombol.dataset.id);
        if (!barang) return;

        if (tombol.dataset.aksi === "tambah") barang.jumlah++;
        if (tombol.dataset.aksi === "kurang") barang.jumlah = Math.max(1, barang.jumlah - 1);
        if (tombol.dataset.aksi === "hapus") items = items.filter(b => b !== barang);

        simpanKeranjang(items);
        tampilkan();
    });

    document.getElementById("btnKosongkan").addEventListener("click", function () {
        if (confirm("Kosongkan semua isi keranjang?")) {
            simpanKeranjang([]);
            tampilkan();
        }
    });

    cekLogin();
    tampilkan();
}
