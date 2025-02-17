// Fungsi utama untuk memuat data kursus
async function loadCourses() {
  console.log("Memuat data kursus...");
  const courseCards = document.getElementById("courseCards");
  if (!courseCards) {
    console.error("Elemen dengan ID 'courseCards' tidak ditemukan!");
    return;
  }

  courseCards.innerHTML = ""; // Bersihkan kontainer sebelum memuat data baru

  try {
    const response = await fetch("http://localhost:8080/courses");
    if (!response.ok) {
      throw new Error("Gagal mengambil data dari server.");
    }

    const courses = await response.json();
    console.log("Data dari server:", courses); // Log data dari server

    if (courses.length === 0) {
      courseCards.innerHTML = "<p>Tidak ada program kursus yang tersedia.</p>";
      return;
    }

    renderCourses(courses); // Tampilkan data kursus di halaman
    localStorage.setItem("courses", JSON.stringify(courses)); // Simpan ke localStorage
  } catch (error) {
    console.error(
      "Gagal memuat data dari server. Menggunakan data dari localStorage...",
      error
    );

    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    if (courses.length === 0) {
      courseCards.innerHTML = "<p>Tidak ada program kursus yang tersedia.</p>";
      return;
    }

    renderCourses(courses); // Render data dari localStorage jika fetch gagal
  }
}

// Fungsi untuk menampilkan data kursus dalam bentuk kartu
function renderCourses(courses) {
  const courseCards = document.getElementById("courseCards");

  courses.forEach((course) => {
    console.log("Rendering course:", course); // Log data kursus yang dirender

    const card = document.createElement("div");
    card.classList.add("course-card");

    const formattedCost = Number(course.cost).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    const schedule = course.schedule
      ? course.schedule.join(", ")
      : "Belum tersedia"; // Menambahkan jadwal kursus

    card.innerHTML = `
        <h3 class="course-name">${course.name}</h3>
        <p><strong>Durasi:</strong> ${course.duration}</p>
        <p><strong>Biaya:</strong> ${formattedCost}</p>
        <p><strong>Deskripsi:</strong> ${course.description}</p>
        <p><strong>Jadwal:</strong> ${schedule}</p>
        <div class="card-actions">
          <button class="edit-btn" onclick="editCourse('${course._id}')">Edit</button>
          <button class="delete-btn" onclick="deleteCourse('${course._id}')">Hapus</button>
        </div>
      `;
    courseCards.appendChild(card);
  });
}

// Fungsi untuk mengedit kursus
function editCourse(courseId) {
  console.log(`Edit kursus dengan ID ${courseId}`);
  window.location.href = `edit_course.html?id=${courseId}`; // Arahkan ke halaman edit
}

// Fungsi untuk menghapus kursus
async function deleteCourse(courseId) {
  try {
    console.log(`Menghapus kursus dengan ID: ${courseId}`);

    const response = await fetch(`http://localhost:8080/courses/${courseId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Gagal menghapus kursus.");
    }

    console.log(`Kursus dengan ID ${courseId} berhasil dihapus.`);
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Kursus berhasil dihapus!",
    }).then(() => {
      loadCourses(); // Memuat ulang data kursus setelah penghapusan
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat menghapus kursus:", error);
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: `Gagal menghapus kursus. Error: ${error.message}`,
    });
  }
}

// Panggil fungsi loadCourses saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", loadCourses);
