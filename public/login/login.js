// const  apiUrl = "http://localhost:3000";
const apiUrl = "http://54.234.242.153:3000"

const loginForm = document.getElementById("loginForm");
const errorDiv = document.getElementById("error");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);
  
  const userData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  if (!userData.email || !userData.password) {
    errorDiv.textContent = "Please fill in all required details";
    console.log("data not filled");
    return;
  }
  try {
    const response = await fetch(`${apiUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (response.ok) {

      const data = await response.json();
      const token = data.token;

      localStorage.setItem("token",token);

      loginForm.reset();
      window.location.href = `${apiUrl}/api/expenses`
    } else {
      const data = await response.json();
      errorDiv.textContent = data.error;
    }
  } catch (error) {
    console.log(error);
  }
});