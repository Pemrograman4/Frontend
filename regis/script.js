// Seleksi form registrasi
const registerForm = document.getElementById('registerForm');

// Tambahkan event listener untuk submit
registerForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah reload halaman

    // Ambil nilai dari input username, email, dan password
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Kirim data dengan fetch
    fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, email: email, password: password }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                // Registrasi berhasil
                console.log('Registrasi sukses:', data);
                alert('Registrasi berhasil! Silakan login.');
                // Redirect ke halaman login
                window.location.href = '../login/login.html';
            } else {
                // Registrasi gagal
                console.error('Registrasi gagal:', data);
                alert(data.message || 'Terjadi kesalahan saat registrasi.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Terjadi kesalahan koneksi.');
        });
});
