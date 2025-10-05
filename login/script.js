document.querySelector(".signupbtn").addEventListener("click", async () => {
  const name = document.querySelector(".namefield input").value;
  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;

  if (!name || !email || !password) {
    alert("Please fill all fields!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    alert(data.message);

    if (data.success) {
      // Save username in localStorage
      localStorage.setItem("username", name);
      // Redirect to frontend index page
      window.location.href = "../frontend/index.html";
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong!");
  }
});

document.querySelector(".signinbtn").addEventListener("click", async () => {
  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;

  if (!email || !password) {
    alert("Please enter both email and password!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Login Successful!");
      // Save username in localStorage
      localStorage.setItem("username", data.name);
      // Redirect to frontend index page
      window.location.href = "../frontend/index.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong!");
  }
});

document.getElementById("togglePassword")?.addEventListener("click", function () {
  const passwordInput = document.getElementById("password");
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  this.classList.toggle("fa-eye-slash");
});
