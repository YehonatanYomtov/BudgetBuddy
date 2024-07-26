//! Disable submit (login/register) button until all inputs are filled

const loginForm = document.getElementById("login-form");

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
    const res = await fetch("/login", options);
    if (res.ok) {
      window.location.href = "/";
    } else {
      const data = await res.json();
      document.getElementById("response-display").innerText =
        data.error || "Login failed";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("response-display").innerText = err.message;
  }
});
