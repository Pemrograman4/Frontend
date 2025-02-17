const API_URL = "http://localhost:8080/tagihan"; // Ganti sesuai konfigurasi backend Anda
let allTagihanData = []; // Menyimpan semua data tagihan yang di-fetch dari backend

// Fungsi untuk mendapatkan token dari localStorage
function getAuthToken() {
  return localStorage.getItem("auth_token") || "";
}

// Fungsi untuk memformat tanggal ke format DD MMMM YYYY
function formatDate(dateString) {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
}

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Fungsi untuk menampilkan data tagihan dalam format card
function tampilkanDataTagihan(data) {
  const tagihanList = document.getElementById("tagihanList");
  if (!tagihanList) return;

  tagihanList.innerHTML = "";
  data.forEach((tagihan) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
            <h3>${tagihan.siswa_nama}</h3>
            <p><strong>Email:</strong> ${tagihan.siswa_email}</p>
            <p><strong>Kursus:</strong> ${tagihan.course_name}</p>
            <p><strong>Jumlah:</strong> ${formatRupiah(tagihan.amount || 0)}</p>
            <p><strong>Tanggal Jatuh Tempo:</strong> ${formatDate(
              tagihan.due_date
            )}</p>
            <p><strong>Status:</strong> ${tagihan.status}</p>
        `;

    const cardActions = document.createElement("div");
    cardActions.className = "card-actions";

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    editButton.onclick = () => editTagihan(tagihan.id);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteButton.onclick = () => hapusTagihan(tagihan.id);

    cardActions.appendChild(editButton);
    cardActions.appendChild(deleteButton);
    card.appendChild(cardActions);
    tagihanList.appendChild(card);
  });
}

// Fungsi untuk mendapatkan data tagihan dari backend
async function fetchTagihanData() {
  try {
    const response = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    if (response.ok) {
      allTagihanData = await response.json();
      tampilkanDataTagihan(allTagihanData);
    } else {
      throw new Error("Gagal mengambil data tagihan");
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Error", "Gagal memuat data tagihan.", "error");
  }
}

// Fungsi untuk mengedit data tagihan
function editTagihan(id) {
  window.location.href = `edit.html?id=${id}`;
}

// Fungsi untuk menghapus data tagihan
async function hapusTagihan(id) {
  Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Data tagihan akan dihapus secara permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        });
        if (response.ok) {
          Swal.fire("Terhapus!", "Data tagihan telah dihapus.", "success");
          fetchTagihanData();
        } else {
          throw new Error("Gagal menghapus data tagihan");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "Gagal menghapus data tagihan.", "error");
      }
    }
  });
}
async function fetchSiswaList() {
  const selectSiswa = document.getElementById("siswa_id");
  if (!selectSiswa) return;

  try {
    const response = await fetch("http://localhost:8080/siswa", {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    if (!response.ok) throw new Error("Gagal mengambil data siswa");

    const siswas = await response.json();
    selectSiswa.innerHTML = siswas
      .map((siswa) => `<option value="${siswa.id}">${siswa.fullname}</option>`)
      .join("");
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Kesalahan", "Gagal mengambil daftar siswa.", "error");
  }
}
document.addEventListener("DOMContentLoaded", fetchSiswaList);

async function fetchCourseList() {
  const selectCourse = document.getElementById("program");
  if (!selectCourse) return;

  try {
    const response = await fetch("http://localhost:8080/courses", {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    if (!response.ok) throw new Error("Gagal mengambil data kursus");

    const courses = await response.json();
    selectCourse.innerHTML = courses
      .map((course) => `<option value="${course._id}">${course.name}</option>`)
      .join("");
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Kesalahan", "Gagal mengambil daftar kursus.", "error");
  }
}
document.addEventListener("DOMContentLoaded", fetchCourseList);

async function handleAddTagihanForm() {
  const formTambahTagihan = document.getElementById("formTambahTagihan");
  if (!formTambahTagihan) return;

  formTambahTagihan.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectSiswa = document.getElementById("siswa_id");
    const selectCourse = document.getElementById("program");
    const dueDate = document.getElementById("tanggalTagihan").value.trim();

    const siswaID = selectSiswa.value;
    const siswaNama = selectSiswa.options[selectSiswa.selectedIndex].text;
    const courseID = selectCourse.value;
    const courseName = selectCourse.options[selectCourse.selectedIndex].text;

    const tagihanData = {
      siswa_id: siswaID,
      course_id: courseID,
      due_date: dueDate,
    };

    try {
      const response = await fetch("http://localhost:8080/tagihan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(tagihanData),
      });

      if (response.ok) {
        Swal.fire(
          "Berhasil",
          `Tagihan untuk ${siswaNama} di kursus ${courseName} berhasil ditambahkan!`,
          "success"
        ).then(() => {
          window.location.href = "index.html";
        });
        formTambahTagihan.reset();
      } else {
        const error = await response.json();
        Swal.fire(
          "Gagal",
          `Gagal menambahkan tagihan: ${error.error}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Kesalahan",
        "Terjadi kesalahan saat menambahkan tagihan.",
        "error"
      );
    }
  });
}


function formatDateToInput(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Menghasilkan format yyyy-MM-dd
}

function parseDateFromInput(dateString) {
  if (!dateString) return null; // Cegah error jika input kosong

  let dateParts;

  if (dateString.includes("/")) {
    // Format dd/MM/yyyy
    dateParts = dateString.split("/");
    // Menghasilkan format yyyy-MM-dd
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  } else if (dateString.includes("-")) {
    // Format yyyy-MM-dd (dari input date HTML)
    return dateString; // Langsung kembalikan tanggal tanpa konversi ke ISO
  } else {
    throw new Error("Format tanggal tidak valid");
  }
}


// Fungsi untuk mengedit/update data tagihan
async function handleEditTagihanForm() {
  const formEditTagihan = document.getElementById("formEditTagihan");
  const id = new URLSearchParams(window.location.search).get("id");

  if (!formEditTagihan || !id) return;

  try {
    const response = await fetch(`http://localhost:8080/tagihan/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    if (response.ok) {
      const tagihan = await response.json();
      document.getElementById("siswa_id").value = tagihan.siswa_id || "";
      document.getElementById("program").value = tagihan.course_id || "";
      document.getElementById("tanggalTagihan").value = formatDateToInput(
        tagihan.due_date
      );
    } else {
      throw new Error("Gagal mengambil data tagihan.");
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Error", "Terjadi kesalahan saat memuat data.", "error");
  }

  formEditTagihan.addEventListener("submit", async (e) => {
    e.preventDefault();
    const updatedData = {
      siswa_id: document.getElementById("siswa_id").value,
      course_id: document.getElementById("program").value,
      due_date: parseDateFromInput(
        document.getElementById("tanggalTagihan").value
      ),
    };

    try {
      const response = await fetch(`http://localhost:8080/tagihan/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        Swal.fire("Berhasil", "Tagihan berhasil diperbarui!", "success").then(
          () => {
            window.location.href = "index.html";
          }
        );
      } else {
        throw new Error("Gagal memperbarui data tagihan.");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Terjadi kesalahan saat menyimpan data.", "error");
    }
  });
}

// Inisialisasi berdasarkan halaman
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("index.html")) {
    fetchTagihanData();
  } else if (path.includes("add.html")) {
    handleAddTagihanForm();
  } else if (path.includes("edit.html")) {
    handleEditTagihanForm();
  }
});
