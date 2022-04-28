const img = document.querySelector(`#chart`);

function assignDataToHTML(data){
        const fileNameText = document.getElementById("fileNameText");
        fileNameText.textContent = data.file_name;
        img.src = `data:image/jpg;base64,${data.img}`;
        const equationText = document.getElementById("equationText");
        equationText.textContent = "Simple linear regression equation for given data: " + data.yHat;
        const rValText = document.getElementById("rValText");
        rValText.textContent = "R-value:  " + data.r_val;
        const r2ValText = document.getElementById("r2ValText");
        r2ValText.textContent = "R^2-value:  " + data.r_2_val;
        const confIntervalText = document.getElementById("confIntervalText");
        confIntervalText.textContent = "95% confidence interval for the slope of the regression line: " + data.slope_coefficient + " +/- " + data.margin_of_error;
}

const removeFile = async () => {
        // Local host: http://localhost:3000/
        // Heroku: https://statistical-modeling.herokuapp.com/
        const response = await fetch(`http://localhost:3000/clear-file-cache`, {method: "POST",});
        const data = JSON.parse(await response.text());
        console.log(data);
}

const getDefaultData = async () => {
        await removeFile();
        // Returns a promise regarding the response from the server
        const res = await fetch(`http://localhost:3000/data/linearRegression`);
        // Parses the information passed in and decodes the image
        const data = JSON.parse(await res.text());
        assignDataToHTML(data);
}

async function getData() {
        // Returns a promise regarding the response from the server
        const res = await fetch(`http://localhost:3000/data-retrieve/linearRegression`);
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

        const equationText = document.createElement("p");
        equationText.setAttribute("id", "equationText");

        const rValText = document.createElement("p");
        rValText.setAttribute("id", "rValText");

        const r2ValText = document.createElement("p");
        r2ValText.setAttribute("id", "r2ValText");

        const confIntervalText = document.createElement("p");
        confIntervalText.setAttribute("id", "confIntervalText");


        form.appendChild(input);
        inputContainer.appendChild(form);
        inputContainer.appendChild(randDataButton);

        contentContainer.appendChild(fileNameText);
        contentContainer.appendChild(img);
        contentContainer.appendChild(equationText);
        contentContainer.appendChild(rValText);
        contentContainer.appendChild(r2ValText);
        contentContainer.appendChild(confIntervalText);

        container.appendChild(inputContainer);
        container.appendChild(contentContainer);
}

setHTML();
getDefaultData();
