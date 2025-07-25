const form = document.querySelector("form");
const token = sessionStorage.getItem("token");

displayPage();


form.addEventListener("submit", async (e) =>{
    e.preventDefault();
    displayPage2();
    const data = JSON.stringify(Object.fromEntries(new FormData(e.target)));
    console.log(data);

    const result = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        body: data,
        headers: {
            "content-type": "application/json"
        }
    })

    if (result.status == 200){
        console.log(result);
        
        displayPage();
        const token = await result.json();
        console.log(token.token);
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
    console.log("token:", token);
    
    if (token) {
        const result = await fetch("http://127.0.0.1:8000/auth/currentuser", {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        console.log(result);
        

        if (result.status == 200) {
            document.querySelector(".auth").style.display = "none";
            document.getElementById("contenu").style.display = "grid";
        }
        
    }
});

function displayPage() {
    setTimeout(() => {
        document.querySelector(".loader").style.display = "none";
        document.querySelector(".main").style.display = "flex";
        document.querySelector(".title").style.display = "block";
    }, 1500)
}

function displayPage2() {
    document.querySelector(".main").style.display = "none";
    document.querySelector(".loader").style.display = "flex";
}
