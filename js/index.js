const getToken = sessionStorage.getItem("token");

async function getAllCours(token) {
    const result = await fetch("https://papos-backend.onrender.com/admin/liste_article", {
        method: "GET",
        headers:{
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (result.status == 200) {
        const contenuHtml = document.getElementById("contenu");
        const data = await result.json();

        for (let index = 0; index < data.article.length; index++) {
            const element = data.article[index];
            
            contenuHtml.innerHTML += 
            `
                <div class="content-article" id="${element.id}">
                    <div class="img-article">
                        <img src="${element.image}" alt="image-blog">
                    </div>

                    <div class="domaine-article">
                        <span>${element.categorie}</span>
                    </div>

                    <div class="titre_info-article">
                        <h3 class="titre-article">${element.titre}</h3>
                        <p class="info-article">${element.view}</p>
                    </div>
                    <div class="content-cta">
                        <div class="cta update" id="${element.id}">mise à jour</div>
                        <div class="cta delete" id="${element.id}">supprimer</div>
                    </div>
                </div>
            
            `
        }

    }else{
        console.log("non autorisé");
        
    }
    
}

getAllCours(getToken);

document.addEventListener("click", async (e) =>{
    if (e.target.classList.contains("update")) {
        localStorage.setItem(key="updateArticleId", vlaue=e.target.id);
        location.href = "/papos_admin/pages/update.html";
    }
    if (e.target.classList.contains("delete")) {
        
        const result = await fetch(`https://papos-backend.onrender.com/admin/delete_article/${e.target.id}`, {
            method: "DELETE",
            headers:{
                "content-type": "application/json",
                "Authorization": `Bearer ${getToken}`
            }
        })

        if (result.status == 200) {
            const article = document.getElementById(`${e.target.id}`);
            article.parentElement.removeChild(article);
        }
    }
    
})