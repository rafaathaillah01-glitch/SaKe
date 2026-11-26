// products.js - DAFTAR SEMUA PRODUK SaKe
//
// Halaman detail (dtlbwg.html) hanya ada satu dan dipakai semua produk.
// Produk yang tampil ditentukan dari alamat halamannya, contoh:
//   dtlbwg.html?id=cumi   -> Sambal Cumi
//   dtlbwg.html?id=ijo    -> Sambal Ijo
//
// Untuk MENAMBAH produk baru: salin satu blok { ... }, ganti isinya,
// lalu buat tautan "Lihat detail" ke dtlbwg.html?id=<id baru>.
//
// Keterangan isi:
//   id      : kode unik, huruf kecil tanpa spasi (dipakai di alamat halaman)
//   nama    : nama produk
//   harga   : angka saja, tanpa titik (25000)
//   gambar  : nama file foto
//   terjual : jumlah terjual (isi 0 jika ingin disembunyikan)
//   ulasan  : daftar ulasan pembeli (boleh dikosongkan: [])

const PRODUK = [
    {
        id: "cumi",
        nama: "Sambal Cumi",
        harga: 25000,
        gambar: "Cumi.jpg",
        terjual: 20,
        ulasan: [
            { nama: "Muzakki", bintang: 5, komentar: "Rasanya enak banget, cocok untuk pendamping pas makan." },
            { nama: "Aurel", bintang: 5, komentar: "Praktis banget buat dibawa kemana-mana, cocok dibawa buat bekal ataupun liburan dekat." }
        ]
    },
    { id: "ijo",    nama: "Sambal Ijo",    harga: 25000, gambar: "Ijo.jpg",    terjual: 0, ulasan: [] },
    { id: "matah",  nama: "Sambal Matah",  harga: 25000, gambar: "matah.jpg",  terjual: 0, ulasan: [] },
    { id: "terasi", nama: "Sambal Terasi", harga: 25000, gambar: "Terasi.jpg", terjual: 0, ulasan: [] },
    { id: "teri",   nama: "Sambal Teri",   harga: 25000, gambar: "Mangga.jpg", terjual: 0, ulasan: [] },
    { id: "tomat",  nama: "Sambal Tomat",  harga: 25000, gambar: "Cumi.jpg",   terjual: 0, ulasan: [] }
];
