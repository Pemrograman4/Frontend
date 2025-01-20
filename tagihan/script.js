// script.js

// Fungsi untuk mengambil data tagihan dan menampilkannya
async function fetchTagihan() {
    try {
        const response = await fetch('http://localhost:8080/tagihan');
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const tagihanList = await response.json();
        displayTagihan(tagihanList);
    } catch (error) {
        console.error('Error fetching tagihan:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Gagal memuat data tagihan!',
        });
    }
}

// Fungsi untuk menampilkan data tagihan dalam bentuk card
function displayTagihan(tagihanList) {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = ''; // Kosongkan kontainer sebelum menambahkan data baru

    tagihanList.forEach(tagihan => {
        const card = document.createElement('div');
        card.className = 'card'; // Tambahkan kelas CSS untuk styling

        card.innerHTML = `
            <h2>Tagihan ID: ${tagihan.id}</h2>
            <p>Siswa ID: ${tagihan.siswa_id}</p>
            <p>Course ID: ${tagihan.course_id}</p>
            <p>Jumlah: ${tagihan.amount}</p>
            <p>Tanggal Jatuh Tempo: ${new Date(tagihan.due_date).toLocaleDateString()}</p>
            <p>Status: ${tagihan.status}</p>
        `;

        cardContainer.appendChild(card);
    });
}

// Panggil fungsi fetchTagihan saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchTagihan);
