// akun.js - menampilkan data akun dan mengubah nama
// (memakai database lokal SakeDB dari db.js)

function namaDari(user) {
    return user.nama || user.email.split("@")[0];
}

function tampilkanProfil(user) {
    const nama = namaDari(user);
    document.getElementById("namaUser").textContent = nama;
    document.getElementById("emailUser").textContent = user.email;
    document.getElementById("avatar").textContent = nama.charAt(0).toUpperCase();
    document.getElementById("inputNama").value = nama;
}

async function muatProfil() {
    const user = await cekLogin();
    if (user) tampilkanProfil(user);
}

function tampilkanPesan(teks, ok) {
    const el = document.getElementById("pesan");
    el.textContent = teks;
    el.className = "pesan " + (ok ? "ok" : "gagal");
    el.hidden = false;
}

async function simpanNama() {
    const nama = document.getElementById("inputNama").value.trim();
    if (!nama) {
        tampilkanPesan("Nama tidak boleh kosong.", false);
        return;
    }

    const tombol = document.getElementById("btnSimpan");
    tombol.disabled = true;

    try {
        const user = SakeDB.updateNama(nama);
        tampilkanProfil(user);
        tampilkanPesan("Nama berhasil disimpan.", true);
    } catch (error) {
        tampilkanPesan(error.message, false);
    } finally {
        tombol.disabled = false;
    }
}

muatProfil();

// ==========================================
// FITUR ALAMAT PENGIRIMAN (Maks 3 Alamat)
// ==========================================

let daftarAlamat = JSON.parse(localStorage.getItem("sake_alamat_list")) || [];
let alamatTerpilih = localStorage.getItem("sake_alamat_terpilih") || null;

function renderAlamat() {
    const container = document.getElementById("daftarAlamat");
    const btnTambah = document.getElementById("btnTambahAlamat");
    
    container.innerHTML = "";

    if (daftarAlamat.length === 0) {
        container.innerHTML = `<p style="font-size: 13px; color: var(--muted); text-align: center; padding: 10px;">Belum ada alamat tersimpan.</p>`;
    }

    daftarAlamat.forEach((alamat, index) => {
        const isAktif = (alamatTerpilih === index.toString()) ? "aktif" : "";
        
        const div = document.createElement("div");
        div.className = `item-alamat ${isAktif}`;
        div.onclick = () => pilihAlamat(index);
        
        div.innerHTML = `
            <div class="alamat-info">
                <strong>${alamat.label || "Alamat " + (index+1)}</strong>
                <p>${alamat.isi}</p>
            </div>
            <div class="alamat-aksi">
                <!-- Tombol Hapus -->
                <button type="button" class="btn-hapus-alamat" onclick="event.stopPropagation(); hapusAlamat(${index})" title="Hapus Alamat">
                    🗑️
                </button>
                <!-- Radio Button -->
                <input type="radio" name="pilihAlamat" class="alamat-radio" ${isAktif ? "checked" : ""}>
            </div>
        `;
        container.appendChild(div);
    });

    // Sembunyikan tombol tambah jika sudah 3 alamat
    if (daftarAlamat.length >= 3) {
        btnTambah.hidden = true;
    } else {
        btnTambah.hidden = false;
    }
}

function pilihAlamat(index) {
    alamatTerpilih = index.toString();
    localStorage.setItem("sake_alamat_terpilih", alamatTerpilih);
    renderAlamat();
}

function bukaFormAlamat() {
    document.getElementById("formAlamat").hidden = false;
    document.getElementById("btnTambahAlamat").hidden = true;
    document.getElementById("inputLabel").value = "";
    document.getElementById("inputAlamat").value = "";
    document.getElementById("inputLabel").focus();
}

function tutupFormAlamat() {
    document.getElementById("formAlamat").hidden = true;
    document.getElementById("btnTambahAlamat").hidden = false;
}

function simpanAlamat() {
    const label = document.getElementById("inputLabel").value.trim() || "Alamat Baru";
    const isi = document.getElementById("inputAlamat").value.trim();

    if (!isi) {
        alert("Alamat lengkap tidak boleh kosong!");
        return;
    }

    if (daftarAlamat.length >= 3) {
        alert("Maksimal 3 alamat tercapai.");
        return;
    }

    // Simpan ke array
    daftarAlamat.push({ label: label, isi: isi });
    localStorage.setItem("sake_alamat_list", JSON.stringify(daftarAlamat));

    // Jika ini alamat pertama, otomatis pilih
    if (daftarAlamat.length === 1) {
        alamatTerpilih = "0";
        localStorage.setItem("sake_alamat_terpilih", alamatTerpilih);
    }

    tutupFormAlamat();
    renderAlamat();
}

function hapusAlamat(index) {
    // Konfirmasi sebelum menghapus
    if (confirm("Apakah kamu yakin ingin menghapus alamat ini?")) {
        
        // Hapus 1 data dari array berdasarkan index
        daftarAlamat.splice(index, 1);
        
        // Jika alamat yang dihapus adalah alamat yang sedang dipilih,
        // maka kita harus mereset pilihan atau memilih alamat pertama (jika ada)
        if (alamatTerpilih === index.toString()) {
            if (daftarAlamat.length > 0) {
                alamatTerpilih = "0"; // Pilih otomatis alamat pertama
            } else {
                alamatTerpilih = null; // Jika habis, tidak ada yang dipilih
            }
        } else if (alamatTerpilih !== null && parseInt(alamatTerpilih) > index) {
            // Jika yang dihapus ada di atas alamat yang dipilih, kurangi indexnya
            alamatTerpilih = (parseInt(alamatTerpilih) - 1).toString();
        }

        // Simpan perubahan ke localStorage
        localStorage.setItem("sake_alamat_list", JSON.stringify(daftarAlamat));
        if (alamatTerpilih !== null) {
            localStorage.setItem("sake_alamat_terpilih", alamatTerpilih);
        } else {
            localStorage.removeItem("sake_alamat_terpilih");
        }

        // Render ulang tampilan
        renderAlamat();
    }
}

// Jalankan saat halaman dimuat
renderAlamat();