const costSlider = document.getElementById('costRange');
const costValue = document.getElementById('costValue');
const courseForm = document.getElementById('courseForm');
const submitButton = document.getElementById('submitButton');  // Tombol submit
const programIdInput = document.getElementById('programId');

// Menampilkan nilai dari slider biaya secara dinamis
if (costSlider) {
    costSlider.oninput = function() {
        costValue.textContent = `Rp ${costSlider.value}`;
    };
    costValue.textContent = `Rp ${costSlider.value}`;
}

// Fungsi untuk menghasilkan ID program secara otomatis
function generateProgramId() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const newId = `ID-${courses.length + 1}`;
    programIdInput.value = newId;  // Menampilkan ID baru pada input programId
}

// Menangani pengiriman form untuk menambah kursus baru
if (courseForm) {
    courseForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Mengambil nilai dari input form
        const programId = document.getElementById('programId').value;
        const programName = document.getElementById('programName').value;
        const duration = document.getElementById('duration').value;
        const cost = costSlider.value;
        const description = document.getElementById('description').value;

        // Validasi kolom form
        if (!programId || !programName || !duration || !description) {
            alert('Semua kolom wajib diisi!');
            return;
        }

        const course = {
            programId,
            programName,
            duration,
            cost,
            description
        };

        // Mengambil data kursus yang ada di localStorage atau membuat array kosong
        let courses = JSON.parse(localStorage.getItem('courses')) || [];

        // Menambahkan kursus baru
        courses.push(course);

        // Menyimpan kembali array kursus ke localStorage
        localStorage.setItem('courses', JSON.stringify(courses));

        // Mereset form setelah data disimpan
        courseForm.reset();
        costValue.textContent = 'Rp 100.000';
        generateProgramId();  // Memperbarui ID program untuk kursus berikutnya

        // Mengarahkan kembali ke halaman daftar kursus setelah penyimpanan
        window.location.href = 'list_courses.html';
    });
}

// Memuat dan menampilkan kursus dari localStorage
function loadCourses() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const courseTable = document.getElementById('courseTable').getElementsByTagName('tbody')[0];
    courseTable.innerHTML = '';  // Membersihkan tabel sebelum menambahkan baris baru

    courses.forEach((course, index) => {
        const row = courseTable.insertRow();
        row.insertCell(0).textContent = course.programId;
        row.insertCell(1).textContent = course.programName;
        row.insertCell(2).textContent = course.duration;
        row.insertCell(3).textContent = `Rp ${course.cost}`;
        row.insertCell(4).textContent = course.description;

        const actionCell = row.insertCell(5);
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.onclick = function() {
            window.location.href = `edit_course.html?edit=${index}`;
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = function() {
            deleteCourse(index);
        };

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
    });
}

// Fungsi untuk menghapus kursus
function deleteCourse(index) {
    let courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses.splice(index, 1); // Menghapus kursus berdasarkan index
    localStorage.setItem('courses', JSON.stringify(courses));
    loadCourses();  // Memuat ulang tabel setelah penghapusan
}

// Memuat kursus ketika halaman pertama kali dimuat
if (document.getElementById('courseTable')) {
    loadCourses();
}

// Generate ID pertama kali ketika halaman dimuat
if (programIdInput) {
    generateProgramId();
}