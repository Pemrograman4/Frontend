// Fungsi untuk mendapatkan data siswa dari localStorage
function getSiswaData() {
    return JSON.parse(localStorage.getItem('siswaData')) || [];
}

// Fungsi untuk menyimpan data siswa ke localStorage
function saveSiswaData(data) {
    localStorage.setItem('siswaData', JSON.stringify(data));
}

// Fungsi untuk menampilkan data siswa dalam format card
function tampilkanDataSiswa() {
    const siswaData = getSiswaData();
    const siswaList = document.getElementById('siswaList');
    siswaList.innerHTML = '';
    siswaData.forEach(siswa => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <h3>${siswa.nama}</h3>
            <p><strong>Alamat:</strong> ${siswa.alamat}</p>
            <p><strong>Telepon:</strong> ${siswa.telepon}</p>
            <p><strong>Email:</strong> ${siswa.email}</p>
            <p><strong>Status:</strong> ${siswa.status}</p>
        `;

        // Bagian aksi (tombol edit & hapus)
        const cardActions = document.createElement("div");
        cardActions.className = "card-actions";

        // Tombol Edit
        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        editButton.onclick = () => editSiswa(siswa.id);

        // Tombol Delete
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteButton.onclick = () => hapusSiswa(siswa.id);

        // Tambahkan tombol ke bagian aksi
        cardActions.appendChild(editButton);
        cardActions.appendChild(deleteButton);

        // Tambahkan cardActions ke card
        card.appendChild(cardActions);

        siswaList.appendChild(card);
    });
}

// Fungsi untuk mengedit data siswa
function editSiswa(id) {
    window.location.href = `edit_siswa.html?id=${id}`;
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
            let siswaData = getSiswaData();
            siswaData = siswaData.filter(siswa => siswa.id !== id);
            saveSiswaData(siswaData);
            Swal.fire('Terhapus!', 'Data siswa telah dihapus.', 'success')
                .then(() => {
                    tampilkanDataSiswa();
                });
        }
    });
}

// Fungsi untuk mencari siswa berdasarkan nama
function searchSiswa() {
    const query = document.getElementById('search').value.toLowerCase();
    const siswaData = getSiswaData();
    const filteredData = siswaData.filter(siswa =>
        siswa.nama.toLowerCase().includes(query)
    );
    const siswaList = document.getElementById('siswaList');
    siswaList.innerHTML = '';
    filteredData.forEach(siswa => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <h3>${siswa.nama}</h3>
            <p><strong>Alamat:</strong> ${siswa.alamat}</p>
            <p><strong>Telepon:</strong> ${siswa.telepon}</p>
            <p><strong>Email:</strong> ${siswa.email}</p>
            <p><strong>Status:</strong> ${siswa.status}</p>
        `;
        siswaList.appendChild(card);
    });
}

// Tampilkan data siswa saat halaman dimuat
tampilkanDataSiswa();
