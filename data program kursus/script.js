// Mendapatkan referensi ke elemen-elemen yang dibutuhkan
const costSlider = document.getElementById('costRange');
const costValue = document.getElementById('costValue');
const courseTable = document.getElementById('courseTable')?.getElementsByTagName('tbody')[0];
const courseForm = document.getElementById('courseForm');
const submitButton = document.getElementById('submitButton');  // Tombol submit

// Menampilkan nilai dari slider biaya secara dinamis
if (costSlider) {
    // Mengupdate nilai yang ditampilkan saat slider berubah
    costSlider.oninput = function() {
        costValue.textContent = `Rp ${costSlider.value}`;
    };
    // Menetapkan nilai awal ketika halaman pertama kali dimuat
    costValue.textContent = `Rp ${costSlider.value}`;
}

// Menangani pengiriman form untuk menyimpan atau mengupdate data kursus
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

        // Mengecek apakah ini pengeditan atau penambahan kursus baru
        const urlParams = new URLSearchParams(window.location.search);
        const editIndex = urlParams.get('edit');

        if (editIndex !== null) {
            // Mengupdate kursus yang sudah ada
            courses[editIndex] = course;
        } else {
            // Menambahkan kursus baru
            courses.push(course);
        }

        // Menyimpan kembali array kursus ke localStorage
        localStorage.setItem('courses', JSON.stringify(courses));

        // Mereset form setelah data disimpan
        courseForm.reset();
        costValue.textContent = 'Rp 100.000';

        // Mengarahkan kembali ke halaman daftar kursus setelah penyimpanan
        window.location.href = 'list_courses.html';
    });
}

// Memuat dan menampilkan kursus dari localStorage
function loadCourses() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
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
            window.location.href = `input_course.html?edit=${index}`;
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

// Memuat data kursus untuk pengeditan jika parameter 'edit' ada di URL
function loadCourseForEditing() {
    const urlParams = new URLSearchParams(window.location.search);
    const editIndex = urlParams.get('edit');

    if (editIndex !== null) {
        let courses = JSON.parse(localStorage.getItem('courses')) || [];
        const course = courses[editIndex];

        // Mengisi form dengan data kursus yang akan diedit
        document.getElementById('programId').value = course.programId;
        document.getElementById('programName').value = course.programName;
        document.getElementById('duration').value = course.duration;
        costSlider.value = course.cost;
        costValue.textContent = `Rp ${course.cost}`;
        document.getElementById('description').value = course.description;

        // Mengubah teks tombol submit menjadi 'Selesai Perubahan'
        if (submitButton) {
            submitButton.textContent = 'Selesai Perubahan';
        }
    }
}

// Menjalankan loadCourseForEditing jika berada di halaman edit kursus
if (window.location.pathname.includes('input_course.html')) {
    loadCourseForEditing();
}
