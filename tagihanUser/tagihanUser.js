const API_URL = "http://localhost:8080/tagihan"; // Ganti sesuai konfigurasi backend Anda
let allTagihanData = []; // Menyimpan semua data tagihan yang di-fetch dari backend

// Fungsi untuk mendapatkan token dari localStorage
function getAuthToken() {
  return localStorage.getItem("auth_token") || "";
}

// Fungsi untuk memformat tanggal ke format DD MMMM YYYY
function formatDate(dateString) {
  if (!dateString) return "-";
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
            ${
              tagihan.paid
                ? `<p><strong>Dibayar Pada:</strong> ${formatDate(
                    tagihan.paid_at
                  )}</p>`
                : ""
            }
        `;

    const cardActions = document.createElement("div");
    cardActions.className = "card-actions";

    if (!tagihan.paid) {
      const bayarButton = document.createElement("button");
      bayarButton.className = "pay-btn";
      bayarButton.textContent = "Bayar Sekarang";
      bayarButton.onclick = () => konfirmasiBayar(tagihan.id, tagihan.amount);
      cardActions.appendChild(bayarButton);
    }

    card.appendChild(cardActions);
    tagihanList.appendChild(card);
  });
}

// Fungsi untuk mendapatkan data tagihan dari backend
async function fetchTagihanData() {
  try {
    const response = await fetch(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    if (response.ok) {
      const allTagihanData = await response.json();
      tampilkanDataTagihan(allTagihanData);
    } else {
      throw new Error("Gagal mengambil data tagihan");
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Error", "Gagal memuat data tagihan.", "error");
  }
}

// Fungsi untuk konfirmasi pembayaran
function konfirmasiBayar(tagihanId, amount) {
  Swal.fire({
    title: "Konfirmasi Pembayaran",
    text: `Apakah Anda yakin ingin membayar tagihan ini sebesar ${formatRupiah(
      amount
    )}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Bayar",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      bayarTagihan(tagihanId);
    }
  });
}

// Fungsi untuk membayar tagihan
async function bayarTagihan(tagihanId) {
  try {
    const response = await fetch(`${API_URL}/${tagihanId}/bayar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Gagal melakukan pembayaran");
    }

    Swal.fire("Sukses", "Tagihan berhasil dibayar!", "success").then(() => {
      fetchTagihanData(); // Perbarui daftar tagihan setelah pembayaran sukses
    });
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Error", "Gagal memproses pembayaran.", "error");
  }
}

// Inisialisasi halaman
document.addEventListener("DOMContentLoaded", fetchTagihanData);
