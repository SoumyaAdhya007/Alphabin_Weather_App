const BaseURL = "https://alphabin-weather-app-backend.onrender.com/api/";
const signup = document.getElementById("signup");
const signin = document.getElementById("signin");
signup.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    let obj = {
      email,
      password,
    };
    const response = await fetch(`${BaseURL}register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    if (response.ok) {
      await Swal.fire(
        "Good job!",
        "You have created your account. Now please log in to your account.",
        "success"
      );
    } else {
      let data = await response.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.message,
      });
    }
  } catch (error) {
    console.log(error);
  }
});
signin.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    let obj = {
      email,
      password,
    };
    const response = await fetch(`${BaseURL}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    let data = await response.json();
    if (response.ok) {
      localStorage.setItem("weather-app-login-token", data.token);
      await Swal.fire(
        "Good job!",
        "You have loged in to your account.",
        "success"
      );
      window.location.href = "index.html";
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.message,
      });
    }
  } catch (error) {
    console.log(error);
  }
});
