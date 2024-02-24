const apiUrl1 = `http://localhost:3000`;
const navmenu = document.getElementById("navmenu");
const isPremium = localStorage.getItem("isPremium");
const premiumbtn = document.getElementById("premiumbtn");
const mainHeading = document.getElementById("mainHeading");


premiumbtn.addEventListener("click", async (e) => {
    
    try{
        let response = await fetch(`${apiUrl1}/premium/takepremium`,{
            method: "GET",
            headers: headers,
        });

        if(!response.ok){
            console.log("failed to fetch order details");
            alert("Error occurred while fetching order details");
            return;
        }


        const {key_id, order_id} = await response.json();

        const rzp = Razorpay({
            key: key_id,
            order_id: order_id,
            handler: async function(response){

                // sending payment confirmation to the backend
                try{
                    const paymentResponse = await fetch(
                      `${apiUrl1}/premium/updatetransactionstatus`,
                      {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify({
                          order_id: order_id,
                          payment_id: response.razorpay_payment_id,
                        }),
                      }
                    );

                if (paymentResponse.ok) {
                    rzp.close();
                    alert("payment successful. You are a premium user now");
                    localStorage.setItem("isPremium", "true");
                    showPremiumUI();
                    mainHeading.innerHTML =
                      "Welcome, Premium Explorer!<br>Discover Exclusive Features!";
                    return paymentResponse.json();
                }else{
                    const errorData = await paymentResponse.json();
                    alert(`Payment failed: ${errorData.message}`);
                }
            }
             catch(error){
                console.log(error);
                alert("error occurred while confirming payment");
            }
        },

        });

        rzp.open();
        e.preventDefault();
    } catch (error){
        console.log(error);
        alert("error occurred while processing the payment");
    }
});

function showLeaderboardModal(heading) {
  // Assuming you're using Bootstrap's modal method
  var leaderboardModal = new bootstrap.Modal(
    document.getElementById("leaderboardModal")
  );
  var modalTitle = document.getElementById("leaderboardModalLabel");
  modalTitle.innerHTML = heading;
  leaderboardModal.show();
}
function leaderboardreport(duration, btn) {
  btn.addEventListener("click", async () => {
    try {
      let result = await fetch(`${apiUrl1}/premium/${duration}`,{
        method: "GET",
        headers: headers,
      });
      result = await result.json();
      let res = result;
      let leaderboardData = document.getElementById("leaderboard-data");
      while (leaderboardData.firstChild) {
        leaderboardData.removeChild(leaderboardData.firstChild);
      }
      let count = 1;
      res.forEach((res) => {
        let li = document.createElement("li");
        li.innerHTML = `${count}: ${res.name} - ${res.totalCost}`;
        count++;
        leaderboardData.appendChild(li);
      });
      showLeaderboardModal("Leaderboard");
    } catch (err) {
      console.log(err);
    }
  });
} 

function reportButton(duration, btn) {
  btn.addEventListener("click", async () => {
    try {
      let result = await fetch(
        `${apiUrl1}/premium/${duration}`,
        {
          method: "GET",
          headers: headers,
        }
      );
      result = await result.json();
      console.log(result);
      let res = result;
      let leaderboardData = document.getElementById("leaderboard-data");

      while (leaderboardData.firstChild) {
        leaderboardData.removeChild(leaderboardData.firstChild);
      }

      let count = 1;
      res.forEach((res) => {
        let li = document.createElement("li");
        let formattedDate = new Date(res.updatedAt).toLocaleString();
        li.innerHTML = `${count}: ${res.name} -- ${res.quantity}pkt -- ₹${res.amount} -- ${formattedDate}`;
        count++;
        leaderboardData.appendChild(li);
      });
      showLeaderboardModal(capitalizeFirstLetter(duration));
    } catch (err) {
      console.log(err);
    }
  });
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function showPremiumUI(){

     if (premiumbtn) {
       premiumbtn.remove();
     }
     const premiumSlider = document.getElementById("premiumSlider");
     premiumSlider.style.display = "block";

     const leaderboardbtn = document.getElementById("leaderboardbtn");
     const daily = document.getElementById("daily");
     const monthly = document.getElementById("monthly");
     const yearly = document.getElementById("yearly");
     const report = document.getElementById("report");
     const downloadhistory = document.getElementById("downloadhistory");

     leaderboardbtn.style.display = "block";
     daily.style.display = "block";
     monthly.style.display = "block";
     yearly.style.display = "block";
     report.style.display = "block";
     downloadhistory.style.display = "block";
    

    leaderboardreport("leaderboard", leaderboardbtn);
    reportButton("daily", daily);
    reportButton("monthly", monthly);
    reportButton("yearly", yearly);

    report.addEventListener("click", async () => {
      try {
         let reportdownload = await fetch(`${apiUrl1}/user/download`, {
      method: "GET",
      headers: headers,
    });

    if (!reportdownload.ok) {
      throw new Error(`HTTP error! Status: ${reportdownload.status}`);
    }

    reportdownload = await reportdownload.json(); // Parse the JSON response
    let link = reportdownload.fileURL;
    console.log(reportdownload.fileURL);

    window.location.href = link;
  }
    catch(err){
      console.log(err)
    }
  });
  downloadhistory.addEventListener('click', async () => {
  try {
    window.location.href = `${apiUrl1}/premium/report`;
  } catch (err) {
    console.log(err);
  }
});
}

// const mainHeading = document.getElementById("mainHeading");

if (isPremium === "true") {
  showPremiumUI();
  mainHeading.innerHTML = "Welcome, Premium Explorer!<br>Discover Exclusive Features!";
  mainHeading.style.textShadow = "3px 3px 5px #888";
} else {
  mainHeading.innerHTML = "Keep Track Of Your Expenses!";
  mainHeading.style.textShadow = "2px 2px 4px #555";
}
