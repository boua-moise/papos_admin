const form = document.querySelector("form");
const token = sessionStorage.getItem("token");

displayPage();


form.addEventListener("submit", async (e) =>{
    e.preventDefault();
    displayPage2();
    const data = JSON.stringify(Object.fromEntries(new FormData(e.target)));

    const result = await fetch("https://papos-backend.onrender.com/auth/login", {
        method: "POST",
        body: data,
        headers: {
            "content-type": "application/json"
        }
    })

    if (result.status == 200){
        
        displayPage();
        const token = await result.json();
        sessionStorage.setItem(key="token", value=token.token);
        document.querySelector(".auth").style.display = "none";
        document.getElementById("contenu").style.display = "grid";
        location.reload();
    }else{
        const res = await result.json();
        displayPage();
        alert(res.detail);
    }
});

document.addEventListener("DOMContentLoaded", async () =>{
    const token = sessionStorage.getItem("token");
    
    if (token) {
        const result = await fetch("https://papos-backend.onrender.com/auth/currentuser", {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        

        if (result.status == 200) {
            document.querySelector(".auth").style.display = "none";
            document.getElementById("contenu").style.display = "grid";
            document.getElementById("title").style.display = "block";
        }
        
    }
});

function displayPage() {
    setTimeout(() => {
        document.querySelector(".loader").style.display = "none";
        document.querySelector(".main").style.display = "flex";
    }, 1500)
}

function displayPage2() {
    document.querySelector(".main").style.display = "none";
    document.querySelector(".loader").style.display = "flex";
}
