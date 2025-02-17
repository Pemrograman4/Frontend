const apiUrl = "http://localhost:8080/siswa";
// fungsi untuk mendapatkan token dari setiap localstorage
function getAuthToken() {
    return localStorage.getItem("auth_token") || "";
}

// Fungsi untuk mengambil data siswa dari API
async function getSiswaData() {
    try {
        const response = await fetch(apiUrl, {
            headers: { Authorization: `Bearer ${getAuthToken()}` },
          });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Pastikan respons berbentuk array
        if (!Array.isArray(data)) {
            throw new Error("Data tidak berbentuk array.");
        }

        return data;
    } catch (error) {
        console.error("Error fetching siswa data:", error);
        Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Gagal mengambil data siswa. Silakan coba lagi nanti.",
        });
        return [];
    }
}

// Fungsi untuk menampilkan daftar siswa di halaman
async function tampilkanDataSiswa() {
    const siswaList = document.getElementById("siswaList");
    siswaList.innerHTML = ""; // Hapus konten sebelumnya

    const data = await getSiswaData();

    // Tangani kondisi jika data tidak ada atau kosong
    if (!data || data.length === 0) {
        siswaList.innerHTML = `
            <p class="empty-message">Tidak ada data siswa yang tersedia.</p>
        `;
        return;
    }

    // Loop melalui data siswa untuk membuat kartu
    data.forEach((siswa) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3>${siswa.fullname}</h3>
            <p><strong>Alamat:</strong> ${siswa.address}</p>
            <p><strong>No. HP:</strong> ${siswa.phonenumber}</p>
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
async function hapusSiswa(id) {
    Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda tidak dapat mengembalikan data siswa yang sudah dihapus!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
    }).then(async (result) => {
        if (result.isConfirmed) {
            console.log(`Menghapus siswa dengan ID: ${id}`); // Log ID untuk debugging

            try {
                const response = await fetch(`${apiUrl}/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getAuthToken()}`,
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                Swal.fire({
                    title: "Terhapus!",
                    text: "Data siswa telah dihapus.",
                    icon: "success",
                }).then(() => {
                    tampilkanDataSiswa(); // Menampilkan kembali data siswa setelah penghapusan
                });
            } catch (error) {
                console.error("Error deleting siswa:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops!",
                    text: "Gagal menghapus data siswa. Silakan coba lagi nanti.",
                });
            }
        }
    });
}



// Fungsi untuk mencari siswa berdasarkan nama
async function searchSiswa() {
    const query = document.getElementById("search").value.toLowerCase();
    const siswaList = document.getElementById("siswaList");
    siswaList.innerHTML = ""; // Hapus konten sebelumnya

    const data = await getSiswaData();
    const filteredData = data.filter((siswa) =>
        siswa.fullname.toLowerCase().includes(query)
    );

    // Tampilkan hasil pencarian
    if (!filteredData.length) {
        siswaList.innerHTML = `
            <p class="empty-message">Tidak ada siswa yang sesuai dengan pencarian.</p>
        `;
        return;
    }

    filteredData.forEach((siswa) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3>${siswa.fullname}</h3>
            <p><strong>Alamat:</strong> ${siswa.address}</p>
            <p><strong>No. HP:</strong> ${siswa.phonenumber}</p>
            <p><strong>Email:</strong> ${siswa.email}</p>
            <p><strong>Status:</strong> ${siswa.status}</p>
        `;

        siswaList.appendChild(card);
    });
}

// Panggil fungsi untuk menampilkan data siswa saat halaman dimuat
document.addEventListener("DOMContentLoaded", tampilkanDataSiswa);
