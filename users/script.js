document.addEventListener("DOMContentLoaded", function () {
    fetchUsers();
});

function fetchUsers() {
    fetch("http://localhost:8080/auth/users")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data dari API:", data);

            const userList = document.getElementById("userList");
            userList.innerHTML = "";

            // Jika data yang dikembalikan berupa array langsung
            const users = Array.isArray(data) ? data : data.users; 

            if (!users || users.length === 0) {
                userList.innerHTML = "<p>Tidak ada user tersedia.</p>";
                return;
            }

            users.forEach(user => {
                const userCard = document.createElement("div");
                userCard.classList.add("card");
                
                // Tentukan teks tombol berdasarkan status user
                const buttonText = user.Status === "active" ? "Nonaktifkan" : "Aktifkan";
                const buttonClass = user.Status === "active" ? "btn-inactive" : "btn-active";
            
                userCard.innerHTML = `
                    <h3><strong>${user.Username || "Nama tidak tersedia"}</strong></h3>
                    <p>Email: ${user.Email || "Tidak ada email"}</p>
                    <p>Role: ${user.Role || "Tidak ada role"}</p>
                    <p>Status: <span class="status-${user.Status}">${user.Status}</span></p>
                    <button class="${buttonClass}" onclick="toggleUserStatus('${user.ID}', '${user.Status}')">${buttonText}</button>
                `;
            
                userList.appendChild(userCard);
            });            
        })
        .catch(error => {
            console.error("Error fetching users:", error);
            document.getElementById("userList").innerHTML =
                "<p style='color: red;'>Gagal mengambil data users. Pastikan server berjalan.</p>";
        });
}

function toggleUserStatus(userId, currentStatus) {
    const token = localStorage.getItem("authToken"); // Ambil token dari localStorage
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    fetch(`http://localhost:8080/auth/users/${userId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Kirim token di header
        },
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            Swal.fire("Sukses!", `User berhasil ${newStatus === "active" ? "diaktifkan" : "dinonaktifkan"}`, "success");
            fetchUsers();
        } else {
            Swal.fire("Gagal!", "Terjadi kesalahan saat mengubah status.", "error");
        }
    })
    .catch(error => {
        console.error("Error updating status:", error);
        Swal.fire("Error!", "Gagal mengubah status pengguna.", "error");
    });
}

function searchUser() {
    let input = document.getElementById("search").value.toLowerCase();
    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        let username = card.querySelector("h3").innerText.toLowerCase();
        if (username.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Simpan token ke localStorage
            localStorage.setItem("authToken", data.token);

            Swal.fire("Sukses!", "Login berhasil!", "success").then(() => {
                window.location.href = "dashboard.html"; // Redirect ke halaman dashboard
            });
        } else {
            Swal.fire("Gagal!", "Username atau password salah!", "error");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        Swal.fire("Error!", "Terjadi kesalahan saat login.", "error");
    });
}
