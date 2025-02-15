// Fungsi untuk memuat data siswa dan kursus
async function loadSiswaAndCourses() {
  const studentNameInput = document.getElementById("studentName");
  const statusInput = document.getElementById("status");
  const emailInput = document.getElementById("email");
  const courseDropdown = document.getElementById("courseDropdown");

  // Ambil ID pengguna yang sedang login dari localStorage
  const loggedInUserId = localStorage.getItem("loggedInUserId");

  if (!loggedInUserId) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Silakan login terlebih dahulu!",
    });
    return;
  }

  try {
    // Ambil data siswa berdasarkan pengguna yang login
    const siswaResponse = await fetch(
      `http://localhost:8080/siswa/${loggedInUserId}`
    );
    if (!siswaResponse.ok) {
      throw new Error("Gagal mengambil data siswa.");
    }

    const siswaData = await siswaResponse.json();
    studentNameInput.value = siswaData.name;
    statusInput.value = siswaData.status;
    emailInput.value = siswaData.email;

    // Muat daftar kursus untuk dropdown
    const coursesResponse = await fetch("http://localhost:8080/courses");
    if (!coursesResponse.ok) {
      throw new Error("Gagal mengambil data kursus.");
    }

    const courses = await coursesResponse.json();
    if (courses.length === 0) {
      courseDropdown.innerHTML =
        '<option value="">Tidak ada kursus yang tersedia</option>';
    } else {
      courseDropdown.innerHTML = '<option value="">Pilih kursus</option>'; // Reset dropdown
      courses.forEach((course) => {
        const option = document.createElement("option");
        option.value = course.id;
        option.textContent = course.name;
        courseDropdown.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    Swal.fire({
      icon: "error",
      title: "Gagal Memuat Data",
      text: "Terjadi masalah dalam memuat data siswa atau kursus.",
    });
  }
}

// Fungsi untuk menangani pengiriman form
document
  .getElementById("courseSelectionForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const studentName = document.getElementById("studentName").value;
    const status = document.getElementById("status").value;
    const email = document.getElementById("email").value;
    const selectedCourse = document.getElementById("courseDropdown").value;

    if (!studentName || !status || !email || !selectedCourse) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Harap isi semua data dengan benar!",
      });
      return;
    }

    // Simulasi pengiriman data ke server
    Swal.fire({
      icon: "success",
      title: "Pendaftaran Berhasil!",
      text: `Anda telah berhasil mendaftar untuk kursus ${selectedCourse} dengan status ${status}.`,
    });

    // Reset form setelah pengiriman
    document.getElementById("courseSelectionForm").reset();
  });

// Panggil fungsi loadSiswaAndCourses saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadSiswaAndCourses);
