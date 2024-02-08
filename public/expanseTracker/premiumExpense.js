// const apiUrl = `http://localhost:3000`;
// const apiUrl = "http://13.233.255.87:3000"

const isPremium = localStorage.getItem("isPremium");
const premiumBtn = document.getElementById("premiumBtn");
const navbar = document.getElementById("navbar");
const token1 = localStorage.getItem("token");

const header = {
  "Content-Type": "application/json",
  Authorization: token1,
};

premiumBtn.addEventListener("click", async (e) => {
  try {
    let response = await fetch(`/api/premium/takepremium`, {
      method: "GET",
      headers: header,
    });
    if (!response.ok) {
      console.log("failed to fetch order details");
      alert("Error occured while fetching order details");
      return;
    }

    const { key_id, order_id } = await response.json();

    const rzp = Razorpay({
      key: key_id,
      order_id: order_id,
      handler: async function (response) {
        //sending payment consfirmation to the backend
        try {
          const paymentResponse = await fetch(
            `/api/premium/updatetransactionstatus`,
            {
              method: "POST",
              headers: header,
              body: JSON.stringify({
                order_id: order_id,
                payment_id: response.razorpay_payment_id,
              }),
            }
          );
          if (paymentResponse.ok) {
            rzp.close();
            alert("Payment Succesfull , you are premium user now");
            localStorage.setItem("isPremium", "true");
            const paragraph = document.getElementById("premiumStatus");

            paragraph.innerHTML = "Premium User";
            showPremiumUI();
            return paymentResponse.json();
          } else {
            console.log(error);
            alert("error occured while confirming payment");
          }
        } catch (err) {
          console.log(err);
          alert("error occured while confirming payment");
        }
      },
    });
    rzp.open();
    e.preventDefault();
  } catch (err) {
    console.log(err);
    alert("error occured while processing paymrnt");
  }
});

function showPremiumUI() {
  const leaderboardBtn = document.createElement("button");

  leaderboardBtn.innerHTML = "LeaderBoard";
  leaderboardBtn.setAttribute("id", "leaderBoardBtn");

  const paragraph = document.createElement("h1");
  paragraph.innerHTML = " Premium User";

  navbar.removeChild(premiumBtn);
  navbar.appendChild(paragraph);
  navbar.appendChild(leaderboardBtn);

  let leaderboard = "leaderboard";

  leaderboardreport(leaderboard, leaderboardBtn);
}


function leaderboardreport(data , btn){
    btn.addEventListener("click", async() =>{
        try{
            let result = await fetch(`/api/premium/${data}`,{
                method:"GET",
                headers:header,
            })
            let res = await result.json();
             
            let leaderboardData = document.getElementById("leaderboard-data");
                while(leaderboardData.firstChild){
                    leaderboardData.removeChild(leaderboardData.firstChild);
                }
                let count = 1;
                res.forEach((res)=>{
                    let li = document.createElement("li");
                    li.innerHTML = `${count}: ${res.name} -- ${res.total_cost}`;
                    count++;
                    leaderboardData.appendChild(li);
                })
        }catch(error){
            console.log(err)
        }
    })
}

if (isPremium === "true") {
  showPremiumUI();
}