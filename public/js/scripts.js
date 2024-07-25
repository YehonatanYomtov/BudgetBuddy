const loadingSpinner = `
<div class="fa-3x">
<i class="fa-solid fa-spinner fa-spin-pulse"></i>
</div>
`;

//! Disable submit (login/register) button until all inputs are filled
const registerForm = document.querySelector(".register-form");
const loginForm = document.querySelector(".login-form");

if (registerForm)
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // const allInputs = document.querySelectorAll("input")

    const { username, email, password } = e.target;

    const options = {};

    try {
      fetch();
    } catch (err) {
      throw err;
    }
  });

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });
