const API_URL = "http://localhost:8080/gurus"; // Ganti sesuai konfigurasi backend Anda
let allGuruData = []; // Menyimpan semua data guru yang di-fetch dari backend

// Fungsi untuk menampilkan data guru dalam format card
function tampilkanDataGuru(data) {
    const guruList = document.getElementById("guruList");
    if (!guruList) return; // Jika elemen tidak ditemukan, hentikan fungsi

    guruList.innerHTML = "";
    data.forEach((guru) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <h3>${guru.fullname}</h3>
            <p><strong>Alamat:</strong> ${guru.address}</p>
            <p><strong>Telepon:</strong> ${guru.phonenumber}</p>
            <p><strong>Email:</strong> ${guru.email}</p>
            <p><strong>Mata Pelajaran:</strong> ${guru.school_subject}</p>
            <p><strong>Status:</strong> ${guru.status}</p>
        `;

        // Bagian aksi (tombol edit & hapus)
        const cardActions = document.createElement("div");
        cardActions.className = "card-actions";

        // Tombol Edit
        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        editButton.onclick = () => editGuru(guru.id);

        // Tombol Delete
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteButton.onclick = () => hapusGuru(guru.id);

        cardActions.appendChild(editButton);
        cardActions.appendChild(deleteButton);
        card.appendChild(cardActions);
        guruList.appendChild(card);
    });
}

// Fungsi untuk mendapatkan data guru dari backend
async function fetchGuruData() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            allGuruData = await response.json();
            tampilkanDataGuru(allGuruData);
        } else {
            throw new Error("Gagal mengambil data guru");
        }
    } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "Gagal memuat data guru.", "error");
    }
}

// Fungsi untuk mengedit data guru
function editGuru(id) {
    window.location.href = `edit.html?id=${id}`;
}

// Fungsi untuk menghapus data guru
async function hapusGuru(id) {
    Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Data guru akan dihapus secara permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                if (response.ok) {
                    Swal.fire("Terhapus!", "Data guru telah dihapus.", "success");
                    fetchGuruData(); // Refresh data setelah penghapusan
                } else {
                    throw new Error("Gagal menghapus data guru");
                }
            } catch (error) {
                console.error("Error:", error);
                Swal.fire("Error", "Gagal menghapus data guru.", "error");
            }
        }
    });
}

// Fungsi untuk menambahkan data guru
async function handleAddGuruForm() {
    const formTambahGuru = document.getElementById("formTambahGuru");
    if (!formTambahGuru) return;

    formTambahGuru.addEventListener("submit", async (e) => {
        e.preventDefault();

        const guruData = {
            fullname: document.getElementById("nama").value.trim(),
            address: document.getElementById("alamat").value.trim(),
            phonenumber: document.getElementById("telepon").value.trim(),
            email: document.getElementById("email").value.trim(),
            school_subject: document.getElementById("subject").value.trim(),
            status: document.getElementById("status").value,
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(guruData),
            });

            if (response.ok) {
                Swal.fire("Berhasil", "Guru berhasil ditambahkan!", "success").then(() => {
                    window.location.href = "index.html";
                });
                formTambahGuru.reset();
            } else {
                const error = await response.json();
                Swal.fire("Gagal", `Gagal menambahkan Guru: ${error.error}`, "error");
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire("Kesalahan", "Terjadi kesalahan saat menambahkan Guru.", "error");
        }
    });
}

// Fungsi untuk mengedit/update data guru
async function handleEditGuruForm() {
    const formEditGuru = document.getElementById("formEditGuru");
    const id = new URLSearchParams(window.location.search).get("id");

    if (!formEditGuru || !id) return;

    // Ambil data guru untuk diisi ke form
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (response.ok) {
            const guru = await response.json();
            document.getElementById("nama").value = guru.fullname || "";
            document.getElementById("alamat").value = guru.address || "";
            document.getElementById("telepon").value = guru.phonenumber || "";
            document.getElementById("email").value = guru.email || "";
            document.getElementById("mataPelajaran").value = guru.school_subject || "";
            document.getElementById("status").value = guru.status || "aktif";
        } else {
            throw new Error("Gagal mengambil data Guru.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat memuat data: " + error.message);
    }

    // Event untuk submit data yang diubah
    formEditGuru.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedData = {
            fullname: document.getElementById("nama").value,
            address: document.getElementById("alamat").value,
            phonenumber: document.getElementById("telepon").value,
            email: document.getElementById("email").value,
            school_subject: document.getElementById("mataPelajaran").value,
            status: document.getElementById("status").value,
        };

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                alert("Data Guru berhasil diperbarui!");
                window.location.href = "index.html";
            } else {
                throw new Error("Gagal memperbarui data Guru.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat menyimpan data: " + error.message);
        }
    });
}

// Inisialisasi berdasarkan halaman
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path.includes("index.html")) {
        fetchGuruData();
    } else if (path.includes("add.html")) {
        handleAddGuruForm();
    } else if (path.includes("edit.html")) {
        handleEditGuruForm();
    }
});

 