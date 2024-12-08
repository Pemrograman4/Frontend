const courseForm = document.getElementById('courseForm');
const submitButton = document.getElementById('submitButton');
const courseTable = document.getElementById('courseTable').getElementsByTagName('tbody')[0];
const costInput = document.getElementById('cost');
const costValue = document.getElementById('costValue');

let courseData = [];  // Array to store course data
let editingIndex = null;  // Index of course being edited

// Function to render the table
function renderTable() {
    // Clear the table body before rendering
    courseTable.innerHTML = '';
    
    // Loop through all courseData and create rows
    courseData.forEach((course, index) => {
        let row = courseTable.insertRow();
        
        row.insertCell(0).textContent = course.id;
        row.insertCell(1).textContent = course.name;
        row.insertCell(2).textContent = course.duration;
        row.insertCell(3).textContent = course.cost;
        row.insertCell(4).textContent = course.description;

        // Action Column (Edit and Delete buttons)
        let actionCell = row.insertCell(5);
        actionCell.classList.add('action-btns');  // Add CSS class for spacing

        let editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.onclick = () => editCourse(index);
        actionCell.appendChild(editBtn);

        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = () => deleteCourse(index);
        actionCell.appendChild(deleteBtn);
    });
}

// Function to add or update a course
function saveCourse(event) {
    event.preventDefault();

    // Create a new course object from form input
    let course = {
        id: document.getElementById('programId').value,
        name: document.getElementById('programName').value,
        duration: document.getElementById('duration').value,
        cost: `Rp ${parseInt(document.getElementById('cost').value).toLocaleString()}`, // Format cost as currency
        description: document.getElementById('description').value
    };

    if (editingIndex !== null) {
        // If editing, update the existing course data
        courseData[editingIndex] = course;
        editingIndex = null;
        submitButton.textContent = 'Tambah Program';  // Reset the button text
    } else {
        // If adding a new course, push it to the array
        courseData.push(course);
    }

    // Re-render the table to show the updated list
    renderTable();

    // Reset the form inputs
    courseForm.reset();
    costValue.textContent = `Rp 0.000`;  // Reset the cost display to default
}

// Function to edit an existing course
function editCourse(index) {
    let course = courseData[index];

    // Pre-fill the form with the selected course data
    document.getElementById('programId').value = course.id;
    document.getElementById('programName').value = course.name;
    document.getElementById('duration').value = course.duration;
    document.getElementById('cost').value = parseInt(course.cost.replace('Rp ', '').replace('.', '').replace(',', '')); // Adjust for format
    document.getElementById('description').value = course.description;

    // Update cost display
    costValue.textContent = course.cost;

    // Set the editing index and change button text to "Simpan Perubahan"
    editingIndex = index;
    submitButton.textContent = 'Simpan Perubahan';
}

// Function to delete a course
function deleteCourse(index) {
    // Remove the course from the array
    courseData.splice(index, 1);

    // Re-render the table to show the updated list
    renderTable();
}

// Listen to form submission
courseForm.addEventListener('submit', saveCourse);

// Update cost display when range input is changed
costInput.addEventListener('input', function() {
    let cost = parseInt(costInput.value);
    costValue.textContent = `Rp ${cost.toLocaleString()}`;
});

// Render the table initially (if there's already data)
renderTable();
