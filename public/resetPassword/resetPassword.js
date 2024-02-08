// const apiUrl = "http://localhost:3000"; 
const apiUrl = "http://13.233.255.87:3000"

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");

    console.log("this is uuid", uuid);

    const error = document.getElementById("error-msg");

    let newPassword = password.value;
    let confirmedPassword = confirmPassword.value;

    // Basic client-side validation
    if (newPassword.length < 8) {
      error.innerHTML = "Password must be at least 8 characters long";
      return;
    }

    if (newPassword !== confirmedPassword) {
      error.innerHTML = "Passwords do not match";
      setTimeout(() => {
        error.innerHTML = "";
      }, 2000);
      return;
    }

    let obj = {
      password: newPassword,
      uuid: uuid,
    };

    const sendPassword = await fetch(`${apiUrl}/api/reset/newPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    if (sendPassword.ok) {
      const data = await sendPassword.json();
      console.log(data);
    } else {
      const errorData = await sendPassword.json();
      error.innerHTML = `Password reset failed: ${errorData.message}`;
    }
  } catch (error) {
    console.log(error);
  }
});