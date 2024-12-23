// Seleksi form login
const loginForm = document.getElementById('loginForm');

// Tambahkan event listener untuk submit
loginForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah reload halaman

    // Ambil nilai dari input username dan password
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Kirim data dengan fetch
    fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.token) {
                // Login berhasil
                console.log('Login sukses:', data);
                alert('Login berhasil!');
                // Redirect ke halaman lain, misalnya dashboard
                window.location.href = '/dashboard.html';
            } else {
                // Login gagal
                console.error('Login gagal:', data);
                alert('Username atau kata sandi salah.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat login.');
        });
});
