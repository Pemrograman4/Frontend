// Seleksi form login
const loginForm = document.getElementById("loginForm");

// Tambahkan event listener untuk submit
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Mencegah reload halaman

  // Ambil nilai dari input username dan password
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // Validasi input tidak boleh kosong
  if (!username || !password) {
    Swal.fire({
      icon: "warning",
      title: "Peringatan",
      text: "Username dan password harus diisi!",
    });
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.status === 200) {
      // Simpan token ke localStorage atau cookie
      localStorage.setItem("auth_token", data.token);

      // Redirect berdasarkan role
      Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: "Anda akan diarahkan ke halaman dashboard.",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        if (data.role === "admin") {
          window.location.href = "http://127.0.0.1:5504/index.html"; // Admin dashboard
        } else {
          window.location.href = "http://127.0.0.1:5504/home.html"; // User dashboard
        }
      });
    } else if (response.status === 403) {
      // Jika status user tidak aktif
      Swal.fire({
        icon: "error",
        title: "Akun Tidak Aktif",
        text: "Akun Anda belum diaktifkan oleh admin.",
      });
    } else {
      // Jika username atau password salah
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: data.error || "Username atau password salah.",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      icon: "error",
      title: "Kesalahan Koneksi",
      text: "Terjadi kesalahan saat menghubungkan ke server.",
    });
  }
});