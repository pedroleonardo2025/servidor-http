const API_BASE_URL = 'http://localhost:3006/curso';
const courseForm = document.getElementById('course-form');
const courseIdInput = document.getElementById('course-id');
const courseNameInput = document.getElementById('course-name');
const courseDescriptionInput = document.getElementById('course-description');
const coursePriceInput = document.getElementById('course-price');
const courseWorkloadInput = document.getElementById('course-workload');
const courseProfessorInput = document.getElementById('course-professor');

const feedbackMessage = document.getElementById('feedback-message');
const coursesTableBody = document.getElementById('courses-table-body');
const formTitle = document.getElementById('form-title');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-button');

async function fetchCourses() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Erro ao buscar cursos.');
        }
        const data = await response.json();
        
        renderCourses(data.cursos); 
        
    } catch (error) {
        showFeedback('danger', 'Erro ao carregar a lista de cursos.');
        console.error('Erro na busca:', error);
    }
}

async function submitCourse(event) {
    event.preventDefault(); 

    const id = courseIdInput.value;
    const name = courseNameInput.value;
    const description = courseDescriptionInput.value;
    const price = parseFloat(coursePriceInput.value);
    const workload = parseInt(courseWorkloadInput.value);
    const professor = courseProfessorInput.value;

    if (!name || !description || isNaN(price) || isNaN(workload) || !professor) {
        showFeedback('warning', 'Por favor, preencha todos os campos corretamente.');
        return;
    }

    const courseData = { 
        nome: name, 
        descricao: description,
        preco: price,
        carga_horaria: workload, 
        professor: professor
    };

    try {
        let response;
        if (id) {
        
            response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseData)
            });
            if (!response.ok) {
                throw new Error('Erro ao atualizar o curso.');
            }
            showFeedback('success', 'Curso atualizado com sucesso!');
        } else {
            response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseData)
            });
            if (!response.ok) {
                throw new Error('Erro ao cadastrar o curso.');
            }
            showFeedback('success', 'Curso cadastrado com sucesso!');
        }
        resetForm();
        fetchCourses();

    } catch (error) {
        showFeedback('danger', error.message);
        console.error('Erro na submissão:', error);
    }
}
async function deleteCourse(id) {
    if (!confirm('Tem certeza que deseja deletar este curso?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar o curso.');
        }

        showFeedback('success', 'Curso deletado com sucesso!');
        fetchCourses(); 

    } catch (error) {
        showFeedback('danger', error.message);
        console.error('Erro na exclusão:', error);
    }
}

function showFeedback(type, message) {
    feedbackMessage.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
}

function renderCourses(courses) {
    coursesTableBody.innerHTML = ''; 
    if (courses.length === 0) {
        coursesTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum curso cadastrado.</td></tr>';
        return;
    }

    courses.forEach(course => {
        const row = document.createElement('tr');
        
        const precoFormatado = typeof course.preco === 'number' ? course.preco.toFixed(2) : parseFloat(course.preco).toFixed(2);
        
        row.innerHTML = `
            <td>${course.nome}</td>
            <td>${course.descricao}</td>
            <td>R$ ${precoFormatado}</td>
            <td>${course.carga_horaria}h</td> <td>${course.professor}</td>
            <td>
                <button class="btn btn-sm btn-info me-2 edit-btn" data-id="${course.id}">Editar</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${course.id}">Excluir</button>
            </td>
        `;
        coursesTableBody.appendChild(row);
    });
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const course = courses.find(c => c.id == id);
            fillFormForEdit(course);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            deleteCourse(id);
        });
    });
}

function fillFormForEdit(course) {
    courseIdInput.value = course.id;
    courseNameInput.value = course.nome;
    courseDescriptionInput.value = course.descricao;
    coursePriceInput.value = course.preco;
    courseWorkloadInput.value = course.carga_horaria; 
    courseProfessorInput.value = course.professor;

    formTitle.textContent = 'Editar Curso';
    submitButton.textContent = 'Atualizar';
    cancelButton.style.display = 'block';
}

function resetForm() {
    courseForm.reset();
    courseIdInput.value = '';
    formTitle.textContent = 'Cadastrar Novo Curso';
    submitButton.textContent = 'Cadastrar';
    cancelButton.style.display = 'none';
}


courseForm.addEventListener('submit', submitCourse);

cancelButton.addEventListener('click', resetForm);

document.addEventListener('DOMContentLoaded', fetchCourses);