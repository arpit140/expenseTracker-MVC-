const apiUrl = `http://localhost:3000`;
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
    let response = await fetch(`${apiUrl}/api/premium/takepremium`, {
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
            `${apiUrl}/api/premium/updatetransactionstatus`,
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

function leaderboardreport(duration , btn){
    btn.addEventListener("click", async() =>{
        try{
            let result = await fetch(`${apiUrl}/api/premium/${duration}`,{
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

function reportButton(duration,btn) {
  btn.addEventListener("click",async ()=> {
    try{
      let result = await fetch(
        `${apiUrl}/api/premium/${duration}`,{
          method:"GET",
          headers:header,
        }
      );
      result = await result.json();
      console.log(result);
      let res=result;
      let leaderboardData = document.getElementById("leaderboard-data");

      while(leaderboardData.firstChild){
        leaderboardData.removeChild(leaderboardData.firstChild);
      }
      let count = 1;
      res.forEach((res) => {
        let li = document.createElement("li");
        let formattedDate = new Date(res.updatedAt).toLocaleString();
        li.innerHTML = `${count}: ${res.name} -- ${res.quantity}Pkt -- ${res.amount} -- ${formattedDate}`;
        count++;
        leaderboardData.appendChild(li);
      })
    }catch(err){
      console.log(err);
    }
  })
}

function showPremiumUI() {
  const leaderboardBtn = document.createElement("button");
  const daily = document.createElement("button");
  const monthly = document.createElement("button");
  const yearly = document.createElement("button");
  const report = document.createElement("button");
  const downloadHistory = document.createElement("button");

  leaderboardBtn.innerHTML = "LeaderBoard";
  leaderboardBtn.setAttribute("id", "leaderBoardBtn");
  daily.setAttribute("id","daily");
  monthly.setAttribute("id","monthly");
  yearly.setAttribute("id","yearly");
  report.setAttribute("id","report");
  downloadHistory.setAttribute("id","downloadHistory");

  daily.innerHTML = "daily";
  monthly.innerHTML = "monthly";
  yearly.innerHTML = "yearly";
  report.innerHTML = "report";
  downloadHistory.innerHTML = "File History";

  const paragraph = document.createElement("h2");
  paragraph.innerHTML = " Premium User";

  navbar.removeChild(premiumBtn);
  navbar.appendChild(paragraph);
  navbar.appendChild(leaderboardBtn);
  navbar.appendChild(daily);
  navbar.appendChild(monthly);
  navbar.appendChild(yearly);
  navbar.appendChild(report);
  navbar.appendChild(downloadHistory);


  let leaderboard = "leaderboard";
  let daily1 = "daily"
  let month = "monthly";
  let year = "yearly"
  leaderboardreport(leaderboard, leaderboardBtn);
  reportButton(daily1,daily);
  reportButton(month,monthly);
  reportButton(year,yearly);
  report.addEventListener("click", async ()=>{
    try{
      let reportDownload = await fetch(`${apiUrl}/api/expenses/download`,{
        method:"GET",
        headers:header,
      })
      if(!reportDownload){
        throw new Error (`HTTP error! Status: ${reportdownload.status}`)
      }
      reportDownload = await reportDownload.json();
      let link = reportDownload.fileUrl;
      console.log(fileUrl);
      window.location.href = link;
    }catch(e){
      console.log(e);
    }
  })
  downloadHistory.addEventListener("click", async() => {
    try{
      window.location.href = `${apiUrl}/api/report`;
    }catch(e){
      console.log(e);
    }
  })
}
if (isPremium === "true") {
  showPremiumUI();
}
