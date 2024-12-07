// Data siswa simulasi atau ambil dari localStorage
let siswaData = JSON.parse(localStorage.getItem('siswaData')) || [
    {
        id: 1,
        nama: "Ali Rahman",
        alamat: "Jakarta",
        telepon: "08123456789",
        email: "ali@example.com",
        status: "Aktif"
    }
];

// Fungsi memperbarui tabel siswa
function updateSiswaTable() {
    const tbody = document.querySelector('#siswaTable tbody');
    tbody.innerHTML = ''; // Kosongkan tabel sebelum diisi ulang
    siswaData.forEach(siswa => {
        const row = `
            <tr data-id="${siswa.id}">
                <td>${siswa.id}</td>
                <td>${siswa.nama}</td>
                <td>${siswa.alamat}</td>
                <td>${siswa.telepon}</td>
                <td>${siswa.email}</td>
                <td>${siswa.status}</td>
                <td>
                    <button class="btn-edit" onclick="editSiswa(${siswa.id})">Edit</button>
                    <button class="btn-delete" onclick="hapusSiswa(${siswa.id})">Hapus</button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

// Fungsi edit siswa
function editSiswa(id) {
    const siswa = siswaData.find(s => s.id === id);
    if (siswa) {
        Swal.fire({
            title: 'Edit Data Siswa',
            html: `
                <input type="text" id="editNama" class="swal2-input" placeholder="Nama Lengkap" value="${siswa.nama}">
                <input type="text" id="editAlamat" class="swal2-input" placeholder="Alamat" value="${siswa.alamat}">
                <input type="text" id="editTelepon" class="swal2-input" placeholder="Nomor Telepon" value="${siswa.telepon}">
                <input type="email" id="editEmail" class="swal2-input" placeholder="Email" value="${siswa.email}">
                <select id="editStatus" class="swal2-input">
                    <option value="Aktif" ${siswa.status === "Aktif" ? "selected" : ""}>Aktif</option>
                    <option value="Nonaktif" ${siswa.status === "Nonaktif" ? "selected" : ""}>Nonaktif</option>
                </select>
            `,
            confirmButtonText: 'Simpan',
            showCancelButton: true,
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const nama = Swal.getPopup().querySelector('#editNama').value;
                const alamat = Swal.getPopup().querySelector('#editAlamat').value;
                const telepon = Swal.getPopup().querySelector('#editTelepon').value;
                const email = Swal.getPopup().querySelector('#editEmail').value;
                const status = Swal.getPopup().querySelector('#editStatus').value;

                if (!nama || !alamat || !telepon || !email) {
                    Swal.showValidationMessage('Semua field harus diisi!');
                }

                return { nama, alamat, telepon, email, status };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                siswa.nama = result.value.nama;
                siswa.alamat = result.value.alamat;
                siswa.telepon = result.value.telepon;
                siswa.email = result.value.email;
                siswa.status = result.value.status;

                saveSiswaData();
                updateSiswaTable();

                Swal.fire('Berhasil!', 'Data siswa berhasil diperbarui.', 'success');
            }
        });
    }
}

// Fungsi hapus siswa
function hapusSiswa(id) {
    const siswa = siswaData.find(s => s.id === id);

    if (siswa) {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Anda akan menghapus data siswa: ${siswa.nama}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                // Hapus siswa dari array
                siswaData = siswaData.filter(s => s.id !== id);
                saveSiswaData(); // Simpan perubahan ke localStorage
                updateSiswaTable(); // Perbarui tabel

                Swal.fire('Terhapus!', 'Data siswa berhasil dihapus.', 'success');
            }
        });
    }
}


// Fungsi menyimpan data siswa ke localStorage
function saveSiswaData() {
    localStorage.setItem('siswaData', JSON.stringify(siswaData));
}

// Fungsi tambah siswa baru
function tambahSiswa(data) {
    const idBaru = siswaData.length > 0 ? siswaData[siswaData.length - 1].id + 1 : 1;
    data.id = idBaru;
    siswaData.push(data);
    saveSiswaData();
    Swal.fire('Berhasil!', 'Data siswa berhasil ditambahkan.', 'success').then(() => {
        window.location.href = 'index.html'; // Kembali ke halaman utama
    });
}

// Tambahkan event listener ke form tambah siswa
document.getElementById('formTambahSiswa')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = {
        nama: document.getElementById('nama').value,
        alamat: document.getElementById('alamat').value,
        telepon: document.getElementById('telepon').value,
        email: document.getElementById('email').value,
        status: document.getElementById('status').value
    };

    tambahSiswa(data);
});

// Inisialisasi tabel saat halaman dimuat
document.addEventListener('DOMContentLoaded', updateSiswaTable);
