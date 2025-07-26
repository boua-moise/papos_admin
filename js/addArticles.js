const token = sessionStorage.getItem("token");


displayPage();

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
          byFile: 'http://127.0.0.1:8000/articles/uploadFile', // Your backend file uploader endpoint
          byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
        }
      }
    }
  },
  placeholder: `Contenu de la section... `
});

const inputFile = document.getElementById("image");


document.querySelector('form').addEventListener("submit", async (e)=>{
    e.preventDefault();

    displayPage2();

    const contenu = await editor.save();
    const titre = document.getElementById("blog-title").value;
    const description = document.getElementById("blog-description").value;
    const categorie = document.getElementById("category").value;
    const data = {
        authorId: 1,
        titre: titre,
        contenu: JSON.stringify(contenu),
        categorie: categorie,
        view: 0
    }
    
    const result = await fetch("http://127.0.0.1:8000/admin/add_article", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (result.status == 200){
        localStorage.removeItem("updateArticleId");
        const dataReponse = await result.json();
        
        const fichier = inputFile.files[0]; // Le premier fichier sélectionné
        const extiensionFile = fichier.name.split('.').pop().toLowerCase();
        const extiension = ["jpeg", "png", "jpg", "webp"];
        if (extiension.includes(extiensionFile)) {
            const cleanForm = new FormData()
            cleanForm.append("image", fichier);
            const resultImage = await fetch(`http://127.0.0.1:8000/admin/image_article/${parseInt(dataReponse.response)}`,{
                method: "POST",
                body: cleanForm
            });
            if (resultImage.status == 200){
              location.href = "/index.html";
            }
        }else{
            alert("Veuillez entrez une image svp");
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
