// URLs
const BACKEND_URL = "https://expense-tracker-gpov.onrender.com"; // Render backend
const FRONTEND_URL = "https://Adityaxletscode.github.io/Expense-tracker"; // GitHub Pages frontend

// Signup functionality
document.querySelector(".signupbtn").addEventListener("click", async () => {
  const name = document.querySelector(".namefield input").value;
  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;

  if (!name || !email || !password) {
    alert("Please fill all fields!");
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    alert(data.message);

    if (data.success) {
      // Save username in localStorage
      localStorage.setItem("username", name);
      // Redirect to frontend index page on GitHub Pages
      window.location.href = `${FRONTEND_URL}/index.html`;
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong!");
  }
});

// Signin functionality
document.querySelector(".signinbtn").addEventListener("click", async () => {
  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;

  if (!email || !password) {
    alert("Please enter both email and password!");
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Login Successful!");
      localStorage.setItem("username", data.name);
      window.location.href = `${FRONTEND_URL}/index.html`;
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong!");
  }
});

// Toggle password visibility
document
  .getElementById("togglePassword")
  ?.addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.classList.toggle("fa-eye-slash");
  });
