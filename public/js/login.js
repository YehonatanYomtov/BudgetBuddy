const loginForm = document.getElementById("login-form");
const responseDisplay = document.getElementById("response-display");

//* Can place in a util function
const loadingSpinner = `
<div class="fa-3x">
  <i class="fa-solid fa-cog fa-spin"></i>
</div>
`;

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = e.target.username.value;
  const password = e.target.password.value;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  };

  try {
    responseDisplay.innerHTML = loadingSpinner;

    const res = await fetch("/login", options);
    if (res.ok) {
      window.location.href = "/";
    } else {
      const data = await res.json();
      responseDisplay.innerHTML = data.error || "Login failed";
    }
  } catch (err) {
    console.error(err);
    responseDisplay.innerHTML = err.message;
  }

  document.querySelectorAll("input").forEach((input) => (input.value = ""));
});
