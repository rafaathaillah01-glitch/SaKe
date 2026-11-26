const homeView = document.getElementById('homeView');
const formView = document.getElementById('formView');
const formTitle = document.getElementById('formTitle');
const brandTitle = document.getElementById('brandTitle');
const passwordInput = document.getElementById('passwordInput');

// Mode Login atau Register
let currentMode = 'Login';


// ==============================
// MENAMPILKAN FORM
// ==============================

function showForm(type) {

  currentMode = type;

  homeView.classList.add('hidden');
  formView.classList.remove('hidden');

  formTitle.textContent = type;

  brandTitle.style.fontSize = '22px';
  brandTitle.style.marginBottom = '15px';

  document.getElementById('authForm').reset();
  document.getElementById('message').textContent = '';

}


// ==============================
// KEMBALI KE MENU UTAMA
// ==============================

function showHome() {

  formView.classList.add('hidden');
  homeView.classList.remove('hidden');

  brandTitle.style.fontSize = '32px';
  brandTitle.style.marginBottom = '25px';

}


// ==============================
// TAMPILKAN PASSWORD
// ==============================

function togglePasswordVisibility() {

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }

}


// ==============================
// PROSES LOGIN / REGISTER
// (memakai database lokal SakeDB dari db.js)
// ==============================

async function handleSubmit(event) {

  event.preventDefault();

  const email = document.getElementById('emailInput').value.trim();
  const password = passwordInput.value;

  const message = document.getElementById('message');
  const button = document.getElementById('submitButton');

  button.disabled = true;
  message.textContent = 'Sedang memproses...';

  try {

    if (currentMode === 'Register') {

      await SakeDB.register(email, password);

      message.textContent = 'Register berhasil!';
      window.location.href = 'home.html';

    } else {

      await SakeDB.login(email, password);

      message.textContent = 'Login berhasil!';
      window.location.href = 'home.html';

    }

  } catch (error) {

    message.textContent = error.message;

  } finally {

    button.disabled = false;

  }

}