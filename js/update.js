const token = sessionStorage.getItem("token");


document.addEventListener("DOMContentLoaded", async () => {

  const titre = document.getElementById("blog-title");
  const description = document.getElementById("blog-description");
  const categorie = document.getElementById("category");
  const id = localStorage.getItem("updateArticleId");

  const result = await fetch(`https://papos-backend.onrender.com/articles/${id}/contenu`, {
    method: "GET",
    headers:{
      "content-type": "application/json"
    }
  });

  if (result.status == 200) {
    const data = await result.json();
    const article = data.response;
    titre.value = article.titre;
    description.value = article.description;
    categorie.value = article.categorie;
    const contenu = JSON.parse(article.contenu);
    
    await editor.render(contenu);
    displayPage();
  }
  
});




const editor = new EditorJS({ 
  holder: 'editorjs', 
   tools: {
    header: Header,
    List: {
      class: EditorjsList,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered'
      },
    },
    image: {
      class: ImageTool,
      config: {
        endpoints: {
          byFile: 'https://papos-backend.onrender.com/articles/uploadFile', // Your backend file uploader endpoint
          byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
        }
      }
    }
  },
  placeholder: `Contenu de la section... `
});



document.querySelector('button').addEventListener("click", async (e)=>{
    e.preventDefault();
    displayPage2();
    const id = localStorage.getItem("updateArticleId");
    const titre = document.getElementById("blog-title");
    const description = document.getElementById("blog-description");
    const categorie = document.getElementById("category");
    const contenu = await editor.save();
    const data = {
      "contenu": JSON.stringify(contenu),
      "titre": titre.value,
      "description": description.value,
      "categorie": categorie.value
    }

    
    const result = await fetch(`https://papos-backend.onrender.com/admin/update_article/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (result.status == 200){
        localStorage.removeItem("updateArticleId");
        location.href = "/papos_admin/index.html";
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
