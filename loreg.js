
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
// PROSES LOGIN DAN REGISTER
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

      // REGISTER AKUN BARU

      const { data, error } =
        await supabaseClient.auth.signUp({

          email: email,
          password: password

        });

      if (error) throw error;

      // Jika pendaftaran langsung menghasilkan sesi
      if (data.session) {

        message.textContent = 'Register berhasil!';

        window.location.href = 'home.html';

      } else {

        message.textContent =
          'Akun berhasil didaftarkan. Silakan verifikasi email terlebih dahulu.';

      }

    } else {

      // LOGIN AKUN

      const { data, error } =
        await supabaseClient.auth.signInWithPassword({

          email: email,
          password: password

        });

      if (error) throw error;

      // LOGIN BERHASIL

      message.textContent = 'Login berhasil!';

      window.location.href = 'home.html';

    }

  } catch (error) {

    message.textContent = error.message;

  } finally {

    button.disabled = false;

  }

}
s