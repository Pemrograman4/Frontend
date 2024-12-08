 // Fungsi untuk menambahkan data siswa ke localStorage
 function tambahSiswa(event) {
    event.preventDefault();

    // Ambil data dari form
    const nama = document.getElementById('nama').value;
    const alamat = document.getElementById('alamat').value;
    const telepon = document.getElementById('telepon').value;
    const email = document.getElementById('email').value;
    const status = document.getElementById('status').value;

    // Ambil data siswa dari localStorage (atau buat array baru jika belum ada)
    let siswaData = JSON.parse(localStorage.getItem('siswaData')) || [];

    // Buat ID baru untuk siswa
    const idBaru = siswaData.length > 0 ? siswaData[siswaData.length - 1].id + 1 : 1;

    // Tambahkan data siswa baru ke array
    siswaData.push({
        id: idBaru,
        nama,
        alamat,
        telepon,
        email,
        status
    });

    // Simpan kembali data siswa ke localStorage
    localStorage.setItem('siswaData', JSON.stringify(siswaData));

    // Tampilkan notifikasi sukses dengan SweetAlert2
    Swal.fire({
        title: 'Berhasil!',
        text: 'Data siswa berhasil ditambahkan.',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        // Arahkan kembali ke halaman utama setelah notifikasi
        window.location.href = 'index.html';
    });
}

// Tambahkan event listener ke form
document.getElementById('formTambahSiswa').addEventListener('submit', tambahSiswa);


// Fungsi untuk mengedit data siswa
function editSiswa(id) {
    window.location.href = `edit_siswa.html?id=${id}`; // Mengarahkan ke halaman edit dengan ID siswa sebagai parameter
}

// Fungsi untuk menghapus data siswa
function hapusSiswa(id) {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Data siswa akan dihapus secara permanen!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Ambil data siswa dari localStorage
            let siswaData = JSON.parse(localStorage.getItem('siswaData')) || [];

            // Temukan indeks siswa yang akan dihapus
            const siswaIndex = siswaData.findIndex(siswa => siswa.id == id);

            if (siswaIndex > -1) {
                // Hapus siswa dari array
                siswaData.splice(siswaIndex, 1);

                // Simpan kembali data siswa ke localStorage
                localStorage.setItem('siswaData', JSON.stringify(siswaData));

                // Tampilkan notifikasi sukses dengan SweetAlert2
                Swal.fire(
                    'Terhapus!',
                    'Data siswa telah dihapus.',
                    'success'
                ).then(() => {
                    // Memuat kembali data siswa
                    tampilkanDataSiswa();
                });
            }
        }
    });
}

// Fungsi untuk menampilkan data siswa
function tampilkanDataSiswa() {
    // Ambil data siswa dari localStorage
    const siswaData = JSON.parse(localStorage.getItem('siswaData')) || [];

    // Kosongkan tabel sebelum menampilkan data baru
    const tbody = document.getElementById('siswaTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    // Tampilkan setiap siswa dalam tabel
    siswaData.forEach(siswa => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${siswa.id}</td>
            <td>${siswa.nama}</td>
            <td>${siswa.alamat}</td>
            <td>${siswa.telepon}</td>
            <td>${siswa.email}</td>
            <td>${siswa.status}</td>
            <td>
                <button onclick="editSiswa(${siswa.id})">Edit</button>
                <button onclick="hapusSiswa(${siswa.id})">Hapus</button>
            </td>
        `;
    });
}

// Panggil fungsi untuk menampilkan data siswa
tampilkanDataSiswa();
 // Fungsi untuk memperbarui data siswa di localStorage
 function editSiswa(event) {
    event.preventDefault();

    // Ambil data dari form
    const id = getUrlParameter('id'); // Mendapatkan ID siswa dari URL
    const nama = document.getElementById('nama').value;
    const alamat = document.getElementById('alamat').value;
    const telepon = document.getElementById('telepon').value;
    const email = document.getElementById('email').value;
    const status = document.getElementById('status').value;

    // Ambil data siswa dari localStorage
    let siswaData = JSON.parse(localStorage.getItem('siswaData')) || [];

    // Temukan siswa dengan ID tertentu
    const siswaIndex = siswaData.findIndex(siswa => siswa.id == id);

    // Perbarui data siswa
    siswaData[siswaIndex] = {
        id: parseInt(id),
        nama,
        alamat,
        telepon,
        email,
        status
    };

    // Simpan kembali data siswa ke localStorage
    localStorage.setItem('siswaData', JSON.stringify(siswaData));

    // Tampilkan notifikasi sukses dengan SweetAlert2
    Swal.fire({
        title: 'Berhasil!',
        text: 'Data siswa berhasil diperbarui.',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        // Arahkan kembali ke halaman utama setelah notifikasi
        window.location.href = 'index.html';
    });
}

// Ambil parameter 'id' dari URL
function getUrlParameter(name) {
    var url = new URL(window.location.href);
    return url.searchParams.get(name);
}

// Tambahkan event listener ke form
document.getElementById('formEditSiswa').addEventListener('submit', editSiswa);