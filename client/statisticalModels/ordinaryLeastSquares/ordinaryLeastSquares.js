function assignDataToHTML(data){
        const fileNameText = document.getElementById("fileNameText");
        fileNameText.textContent = data.file_name;

        const downloadFileLink = document.getElementById("downloadFileLink");  
        let loc = window.location.pathname;
        let mainWorkingDir = loc.substring(0, loc.lastIndexOf('client'));
        downloadFileLink.download = data.file_name;
        downloadFileLink.href = mainWorkingDir + "csvFiles/" + data.file_name;
        downloadFileLink.textContent = "Download " + data.file_name ;

        const img = document.getElementById("chart");
        img.src = `data:image/jpg;base64,${data.img}`;

        const olsText = document.getElementById("olsText");
        let splitOLSResult = data.ols_regression_results.split(/\n|\s\n/);
        for(let i = 0; i < 25; i++){
                const olsLine = document.getElementById(i);
                olsLine.textContent = splitOLSResult[i];
        }

}

// Show loading screen only if this is the first time it has been shown
let globalLoadCounter = 0;

function showLoadingScreen()
{
    if(globalLoadCounter == 0)
    {
        document.getElementById("loadScreenDiv").style.display = "flex";
        globalLoadCounter = 1;
    }
}

function hideLoadingScreen(internalError)
{
    if(globalLoadCounter == 1 && !internalError)
    {
        document.getElementById("loadScreenDiv").style.display = "none";
        const contentContainer = document.getElementById("contentDiv");
        contentContainer.style.display = "flex";
        contentContainer.style.flexDirection = "column";
        contentContainer.style.alignItems = "center";
        globalLoadCounter = 2;
    }
}

const removeFile = async () => {
        await fetch(`https://statistical-modeling.herokuapp.com/clear-file-cache`, {method: "POST",});
}

const getDefaultData = async () => {
        showLoadingScreen();
        let internalError = false;
        try{
                await removeFile();
                // Returns a promise regarding the response from the server
                const res = await fetch(`https://statistical-modeling.herokuapp.com/data/ordinaryLeastSquares`, {method: "POST",});
                // Parses the information passed in and decodes the JSON object with the image and other information
                const data = JSON.parse(await res.text());
                assignDataToHTML(data);
        }
        catch{
                document.getElementById("loadScreen").textContent = "An internal server error has occured, please try again later.";
                internalError = true;
        }
        finally{
                hideLoadingScreen(internalError);
        }

}

async function getData() {
        // Returns a promise regarding the response from the server
        const res = await fetch(`https://statistical-modeling.herokuapp.com/data-retrieve/ordinaryLeastSquares`);
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
                        await fetch(`https://statistical-modeling.herokuapp.com/data-upload`, {body: formData, method: "POST",});
                }
                await sendFile();
                console.log("After uploading file, but before getting data");
                getData();
                console.log("After getting data");
                // Reset the file input so that a user can enter a file, generate random data, then enter the same file
                const inputFile = document.getElementById("inputFile");
                inputFile.value = "";
        };
      
        reader.onerror = function() {
                console.log(reader.error);
        };
}

function setHeader(){
        const headerContainer = document.getElementById("headerDiv");
        headerContainer.style.display = "flex";
        headerContainer.style.padding = "15px 0";
        headerContainer.style.position = "fixed";
        headerContainer.style.width = "100%";
        headerContainer.style.top = "0px";
        headerContainer.style.left = "0px";
        headerContainer.style.zIndex = 2;
        headerContainer.style.backgroundColor = "#1F2937";

        const headerLinks = document.createElement("div");
        headerLinks.style.display = "flex";
        headerLinks.style.alignItems = "center";
        headerLinks.style.gap = "30px";
        headerLinks.style.marginLeft = "auto";

        const homeLink = document.createElement("a");
        const homeText = document.createTextNode("Home");
        homeLink.title = "Home";
        homeLink.href = "https://amaradilovic.github.io/statistical-modeling/"
        homeLink.style.color = "white";
        homeLink.style.textDecoration = "none";
        homeLink.addEventListener('mouseenter', e => {
                homeLink.style.color = "rgb(200, 200, 200)";
        });
              
        homeLink.addEventListener('mouseleave', e => {
                homeLink.style.color = "white";
        });
        homeLink.appendChild(homeText);

        const linearRegressionLink = document.createElement("a");
        const linearText = document.createTextNode("Linear Regression");
        linearRegressionLink.title = "Linear Regression";
        linearRegressionLink.href = "https://amaradilovic.github.io/statistical-modeling/statisticalModels/linearRegression/linearRegression.html"
        linearRegressionLink.style.color = "white";
        linearRegressionLink.style.textDecoration = "none";
        linearRegressionLink.addEventListener('mouseenter', e => {
                linearRegressionLink.style.color = "rgb(200, 200, 200)";
        });
              
        linearRegressionLink.addEventListener('mouseleave', e => {
                linearRegressionLink.style.color = "white";
        });
        linearRegressionLink.appendChild(linearText);

        const ordinaryLeastSquaresLink = document.createElement("a");
        const ordinaryText = document.createTextNode("Ordinary Least Squares");
        ordinaryLeastSquaresLink.title = "Ordinary Least Squares";
        ordinaryLeastSquaresLink.href = "https://amaradilovic.github.io/statistical-modeling/statisticalModels/ordinaryLeastSquares/ordinaryLeastSquares.html"
        ordinaryLeastSquaresLink.style.color = "white";
        ordinaryLeastSquaresLink.style.textDecoration = "none";
        ordinaryLeastSquaresLink.addEventListener('mouseenter', e => {
                ordinaryLeastSquaresLink.style.color = "rgb(200, 200, 200)";
        });
              
        ordinaryLeastSquaresLink.addEventListener('mouseleave', e => {
                ordinaryLeastSquaresLink.style.color = "white";
        });
        ordinaryLeastSquaresLink.appendChild(ordinaryText);

        headerLinks.appendChild(homeLink);
        headerLinks.appendChild(linearRegressionLink);
        headerLinks.appendChild(ordinaryLeastSquaresLink);

        headerContainer.appendChild(headerLinks);
}

function setHTML(){
        // Container for all elements on the page
        const container = document.querySelector(".container");
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.margin = "50px";

        const headerContainer = document.createElement("div");
        headerContainer.setAttribute("id", "headerDiv");

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

        const img = document.createElement("img");
        img.setAttribute("id", "chart");

        const olsText = document.createElement("p");
        olsText.setAttribute("id", "olsText");

        for(let i = 0; i < 25; i++){
                const olsLine = document.createElement("pre");
                olsLine.setAttribute("id", i);
                olsText.appendChild(olsLine);
        }

        const loadScreenContainer = document.createElement("div");
        loadScreenContainer.setAttribute("id", "loadScreenDiv");
        
        const loadScreen = document.createElement("span");
        loadScreen.setAttribute("id", "loadScreen");
        loadScreen.textContent = "Loading ...";

        form.appendChild(input);
        inputContainer.appendChild(form);
        inputContainer.appendChild(randDataButton);

        contentContainer.style.display = "none";

        contentContainer.appendChild(fileNameText);
        contentContainer.appendChild(downloadFileLink);
        contentContainer.appendChild(img);
        contentContainer.appendChild(olsText);

        loadScreenContainer.appendChild(loadScreen);

        container.appendChild(headerContainer);
        setHeader();
        container.appendChild(inputContainer);
        container.appendChild(contentContainer);
        container.appendChild(loadScreenContainer);
}

setHTML();
getDefaultData();
