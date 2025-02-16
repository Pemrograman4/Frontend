// Seleksi form registrasi
const registerForm = document.getElementById("registerForm");

// Tambahkan event listener untuk submit
registerForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Mencegah reload halaman

  // Ambil nilai dari input username, email, dan password
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Validasi input tidak boleh kosong
  if (!username || !email || !password) {
    Swal.fire({
      icon: "warning",
      title: "Peringatan",
      text: "Username, email, dan password harus diisi!",
    });
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.status === 201) {
      // Registrasi berhasil, tetapi user harus menunggu aktivasi admin
      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        text: "Akun Anda menunggu persetujuan admin sebelum bisa login.",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "../login/login.html";
      });
    } else {
      // Registrasi gagal, tampilkan pesan error dari backend
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal!",
        text: data.error || "Terjadi kesalahan saat registrasi.",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      icon: "error",
      title: "Kesalahan Koneksi",
      text: "Terjadi kesalahan koneksi ke server.",
    });
  }
});