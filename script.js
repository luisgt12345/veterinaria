document.addEventListener('DOMContentLoaded', () => {
    const navbarMenu = document.querySelector(".navbar .links");
    const hamburgerBtn = document.querySelector(".hamburger-btn");
    const hideMenuBtn = navbarMenu.querySelector(".close-btn");
    const userLoginForm = document.getElementById('user-login-form');
    const staffLoginForm = document.getElementById('staff-login-form');
    const userSignupForm = document.getElementById('user-signup-form-content');
    const staffSignupForm = document.getElementById('staff-signup-form-content');
    const loginUserBtn = document.getElementById('login-user-btn');
    const loginStaffBtn = document.getElementById('login-staff-btn');
    const closeButtons = document.querySelectorAll('.close-btn');
    const blurBgOverlay = document.querySelector('.blur-bg-overlay');
    const signupLinks = document.querySelectorAll(".bottom-link a");

    // Show mobile menu
    hamburgerBtn.addEventListener("click", () => {
        navbarMenu.classList.toggle("show-menu");
    });

    // Hide mobile menu
    hideMenuBtn.addEventListener("click", () => {
        navbarMenu.classList.remove("show-menu");
    });

    // Show the appropriate form popup
    const openForm = (formToShow) => {
        closeAllForms();
        formToShow.classList.add('show-popup');
        blurBgOverlay.classList.add('show-popup');
    };

    const openUserForm = () => openForm(userLoginForm);
    const openStaffForm = () => openForm(staffLoginForm);
    const openUserSignupForm = () => openForm(userSignupForm);
    const openStaffSignupForm = () => openForm(staffSignupForm);

    // Hide all forms
    const closeAllForms = () => {
        userLoginForm.classList.remove('show-popup');
        staffLoginForm.classList.remove('show-popup');
        userSignupForm.classList.remove('show-popup');
        staffSignupForm.classList.remove('show-popup');
        blurBgOverlay.classList.remove('show-popup');
    };

    // Event listeners for showing forms
    loginUserBtn.addEventListener('click', openUserForm);
    loginStaffBtn.addEventListener('click', openStaffForm);
    document.getElementById('user-signup-link').addEventListener('click', openUserSignupForm);
    document.getElementById('staff-signup-link').addEventListener('click', openStaffSignupForm);

    // Event listeners for hiding forms
    closeButtons.forEach(button => button.addEventListener('click', closeAllForms));
    blurBgOverlay.addEventListener('click', closeAllForms);

    // Handle signup/login link clicks inside forms
    signupLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            if (link.id === 'user-signup-link') {
                openUserSignupForm();
            } else if (link.id === 'staff-signup-link') {
                openStaffSignupForm();
            }
        });
    });

    // Handle form submissions
    const handleFormSubmit = async (form, url) => {
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Validate passwords match (for user signup form only)
        if (form.id === 'user-signup-form-content') {
            if (data['signup-password'] !== data['signup-confirm-password']) {
                alert('Las contraseñas no coinciden');
                return;
            }
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Registro exitoso');
                closeAllForms();
                form.reset();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Error en el registro');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error en el registro');
        }
    };

    // Attach event listeners for form submissions
    if (userSignupForm) {
        userSignupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(e.target, '/register');
        });
    }

    if (staffSignupForm) {
        staffSignupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(e.target, '/staff-register');
        });
    }

    // Agregar nuevo producto
    document.getElementById('addProductForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;
        const productPrice = document.getElementById('productPrice').value;

        const table = document.querySelector('tbody');
        const newRow = `<tr>
            <td>${productName}</td>
            <td>${productDescription}</td>
            <td>Q${productPrice}</td>
        </tr>`;
        table.insertAdjacentHTML('beforeend', newRow);

        // Limpiar el formulario
        document.getElementById('addProductForm').reset();
    });

    // Función para generar el PDF
    const generatePDF = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Obtener los datos de la tabla
        const table = document.querySelector('table');
        const rows = Array.from(table.querySelectorAll('tbody tr'));

        const data = rows.map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            return cells.map(cell => cell.textContent);
        });

        // Agregar encabezados
        const headers = ['Nombre del Producto', 'Descripción', 'Precio (GTQ)'];

        // Usar autoTable para crear la tabla en el PDF
        doc.autoTable({
            head: [headers],
            body: data,
        });

        // Guardar el PDF
        doc.save('reporte_productos.pdf');
    };

    // Agregar el evento al botón "Generar Reporte"
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generatePDF);
    }
});
