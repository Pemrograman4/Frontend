const API_URL = "http://localhost:8080/transaksi-guru";
let allTransaksiData = [];

function getAuthToken() {
  return localStorage.getItem("auth_token") || "";
}

const formatDate = (dateTimeString) => {
  if (!dateTimeString) return "Invalid Date";

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const [datePart, timePart] = dateTimeString.split(" ");
  const [day, month, year] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  return `${parseInt(day)} ${
    months[parseInt(month) - 1]
  } ${year} ${hour}:${minute}`;
};

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function tampilkanDataTransaksi(data) {
  const transaksiList = document.getElementById("transaksiList");
  if (!transaksiList) return;
  transaksiList.innerHTML = "";

  data.forEach((transaksi) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h3>${transaksi.guru_name || "-"}</h3>
      <p><strong>Jumlah:</strong> ${formatRupiah(transaksi.amount || 0)}</p>
      <p><strong>Keterangan:</strong> ${transaksi.notes || "-"}</p>
      <p><strong>Tanggal:</strong> ${formatDate(transaksi.created_at)} WIB</p>
    `;

    const cardActions = document.createElement("div");
    cardActions.className = "card-actions";
    card.appendChild(cardActions);
    transaksiList.appendChild(card);
  });
}


async function fetchTransaksiData() {
  try {
    const response = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    if (response.ok) {
      allTransaksiData = await response.json();
      tampilkanDataTransaksi(allTransaksiData);
    } else {
      throw new Error("Gagal mengambil data transaksi");
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Error", "Gagal memuat data transaksi.", "error");
  }
}

async function fetchGuruList() {
  const selectGuru = document.getElementById("guru_id");
  if (!selectGuru) return;

  try {
    const response = await fetch(
      "http://localhost:8080/gurus/status?status=aktif",
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    if (!response.ok) throw new Error("Gagal mengambil data guru");

    const gurus = await response.json();
    selectGuru.innerHTML = gurus
      .map((guru) => `<option value="${guru.id}">${guru.fullname}</option>`)
      .join("");
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Kesalahan", "Gagal mengambil daftar guru.", "error");
  }
}

// Panggil saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchGuruList);

async function handleAddTransaksiForm() {
  const formTambahTransaksi = document.getElementById("formTambahTransaksi");
  if (!formTambahTransaksi) return;

  formTambahTransaksi.addEventListener("submit", async (e) => {
    e.preventDefault();

    const transaksiData = {
      guru_id: document.getElementById("guru_id").value,
      amount: parseInt(
        document.getElementById("jumlah").value.replace(/\D/g, "")
      ),
      notes: document.getElementById("keterangan").value.trim(),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(transaksiData),
      });

      if (response.ok) {
        Swal.fire(
          "Berhasil",
          "Transaksi berhasil ditambahkan!",
          "success"
        ).then(() => {
          window.location.href = "index.html";
        });
        formTambahTransaksi.reset();
      } else {
        const error = await response.json();
        Swal.fire(
          "Gagal",
          `Gagal menambahkan transaksi: ${error.error}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Kesalahan",
        "Terjadi kesalahan saat menambahkan transaksi.",
        "error"
      );
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (path.includes("index.html")) {
    fetchTransaksiData();
  } else if (path.includes("add.html")) {
    handleAddTransaksiForm();
  }
});
