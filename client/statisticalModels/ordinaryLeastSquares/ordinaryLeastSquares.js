const img = document.querySelector(`#chart`);

function assignDataToHTML(data){
        const fileNameText = document.getElementById("fileNameText");
        fileNameText.textContent = data.file_name;

        const downloadFileLink = document.getElementById("downloadFileLink");  
        let loc = window.location.pathname;
        let mainWorkingDir = loc.substring(0, loc.lastIndexOf('client'));
        downloadFileLink.download = data.file_name;
        downloadFileLink.href = mainWorkingDir + "csvFiles/" + data.file_name;
        downloadFileLink.textContent = "Download " + data.file_name ;

        img.src = `data:image/jpg;base64,${data.img}`;
}

const removeFile = async () => {
        await fetch(`http://localhost:3000/clear-file-cache`, {method: "POST",});
}

const getDefaultData = async () => {
        await removeFile();
        // Returns a promise regarding the response from the server
        const res = await fetch(`http://localhost:3000/data/ordinaryLeastSquares`);
        // Parses the information passed in and decodes the image
        const data = JSON.parse(await res.text());
        assignDataToHTML(data);
}

async function getData() {
        // Returns a promise regarding the response from the server
        const res = await fetch(`http://localhost:3000/data-retrieve/ordinaryLeastSquares`);
        // Parses the information passed in and decodes the image
        const data = JSON.parse(await res.text());
        assignDataToHTML(data);
}

function handleFile(){
        let file = this.files[0];
        let reader = new FileReader();
      
        reader.readAsText(file);
      
        reader.onload = async function() {
                // Clear cache prior to uploading a new file
                await removeFile();
                const sendFile = async () => {
                        let formData = new FormData();
                        formData.set("csv", file, file.name);
                        // Local host: http://localhost:3000/
                        // Heroku: https://statistical-modeling.herokuapp.com/
                        const response = await fetch(`http://localhost:3000/data-upload`, {body: formData, method: "POST",});
                        const data = JSON.parse(await response.text());
                }
                await sendFile();
                getData();
                // Reset the file input so that a user can enter a file, generate random data, then enter the same file
                const inputFile = document.getElementById("inputFile");
                inputFile.value = "";
        };
      
        reader.onerror = function() {
                console.log(reader.error);
        };
}

function setHTML(){
        // Container for all elements on the page
        const container = document.querySelector(".container");

        const inputContainer = document.createElement("div");
        inputContainer.setAttribute("id", "inputDiv");

        const form = document.createElement("form");
        form.setAttribute("id", "form");
        form.setAttribute("method", "post");
        form.setAttribute("action", "/data-upload");
        form.setAttribute("enctype", "multipart/form-data");

        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".csv";
        input.name = "csv";
        input.setAttribute("id", "inputFile");
        input.addEventListener("change", handleFile, false);

        const randDataButton = document.createElement("button");
        randDataButton.textContent = "Random Data";
        randDataButton.addEventListener('click', () => {
                getDefaultData();
            });

        const contentContainer = document.createElement("div");
        contentContainer.setAttribute("id", "contentDiv");

        const fileNameText = document.createElement("p");
        fileNameText.setAttribute("id", "fileNameText");

        const downloadFileLink = document.createElement("a");
        downloadFileLink.setAttribute("id", "downloadFileLink");

        const olsText = document.createElement("p");
        olsText.setAttribute("id", "olsText");

        form.appendChild(input);
        inputContainer.appendChild(form);
        inputContainer.appendChild(randDataButton);

        contentContainer.appendChild(fileNameText);
        contentContainer.appendChild(downloadFileLink);
        contentContainer.appendChild(img);
        contentContainer.appendChild(olsText);

        container.appendChild(inputContainer);
        container.appendChild(contentContainer);
}

setHTML();
getDefaultData();
