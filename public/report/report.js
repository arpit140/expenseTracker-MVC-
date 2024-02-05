const linkdata = document.getElementById('filedownloaded');
const token2 = localStorage.getItem("token");

const header2 = {
    "Content-Type":"application/json",
    Authorization:token2,
}


fetch("http://54.234.242.153:3000/expenses/fileHistory",{
    method:"GET",
    headers:header2,
})
.then((res)=>{
    if(!res.ok){
        throw new Error(`HTTP Error ! Status : ${res.status}`);
    }
    return res.json();
})
.then((data)=>{
    let count = 1;

    data.forEach((item)=>{
        const li = document.createElement("li");
        li.setAttribute("class","list-group-item");
        li.innerHTML = `${count}:<a href="${item.link}"> ${item.updatedAt.slice(0,9)}</a>`;
        linkdata.appendChild(li);
        count++;
    })
}).catch((e)=>{
    console.log(e)
})