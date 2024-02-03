const apiUrl = "http://localhost:3000";

const signupForm = document.getElementById("signupForm");
const errorDiv = document.getElementById("error");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(signupForm);
  const userData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  if (!userData.name || !userData.email || !userData.password) {
    errorDiv.textContent = "Please fill in all required details";
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (response.ok) {
      signupForm.reset();
      
      const data = await response.json();
      const token = data.token;
      const isPremium = data.isPremium;

      localStorage.setItem("token",token)
      localStorage.setItem("isPremium",isPremium)

      window.location.href = `${apiUrl}/api/login`;
    } else {
      const data = await response.json();
      errorDiv.textContent = data.error;
    }
  } catch (error) {
    console.log(error);
  }
});