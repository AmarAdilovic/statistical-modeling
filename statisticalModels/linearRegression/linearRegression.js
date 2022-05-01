function assignDataToHTML(data){
        if(data.file_name != "ERROR"){
                document.getElementById("contentDiv").style.display = "flex";
                document.getElementById("loadScreenDiv").style.display = "none";

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

                const equationText = document.getElementById("equationText");
                equationText.textContent = "Simple linear regression equation for given data: " + data.yHat;
                const rValText = document.getElementById("rValText");
                rValText.textContent = "R-value:  " + data.r_val;
                const r2ValText = document.getElementById("r2ValText");
                r2ValText.textContent = "R^2-value:  " + data.r_2_val;
                const confIntervalText = document.getElementById("confIntervalText");
                confIntervalText.textContent = "95% confidence interval for the slope of the regression line: " + data.slope_coefficient + " +/- " + data.margin_of_error;
        }
        else{
                const contentContainer = document.getElementById("contentDiv");
                contentContainer.style.display = "none";

                document.getElementById("loadScreenDiv").style.display = "flex";
                document.getElementById("loadScreen").textContent = "You have submitted an improperly formatted CSV file. Please submit a CSV file that has two columns with column names, and then a list of values underneath each column.";
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
        const inputContainer = document.getElementById("inputDiv");
        inputContainer.style.display = "block";
        
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
                const res = await fetch(`https://statistical-modeling.herokuapp.com/data/linearRegression`);
                // Parses the information passed in and decodes the JSON object with the image and other information
                const data = JSON.parse(await res.text());
                assignDataToHTML(data);
        }
        catch{
                document.getElementById("loadScreen").textContent = "An internal server error has occured, please wait a second and refresh the page.";
                internalError = true;
        }
        finally{
                hideLoadingScreen(internalError);
        }
}

async function getData() {
        // Returns a promise regarding the response from the server
        const res = await fetch(`https://statistical-modeling.herokuapp.com/data-retrieve/linearRegression`);
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
                const fetchDiv = document.getElementById("fetchDiv");
                const fetchScreen = document.getElementById("fetchDiv");
                fetchScreen.textContent = "Reading file and generating graphs ..."
                fetchDiv.style.display = "flex";
                let tryFailed = false;
                try{
                        await getData();
                }
                catch{
                        fetchScreen.textContent = "An internal error has occured, please wait and refresh the page.";
                        tryFailed = true;
                }
                finally{
                        if(!tryFailed)
                                fetchDiv.style.display = "none";
                }
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

        const fetchDiv = document.createElement("div");
        fetchDiv.setAttribute("id", "fetchDiv");
        fetchDiv.style.display = "none";

        const fetchScreen = document.createElement("span");
        fetchScreen.setAttribute("id", "fetchScreen");

        const randDataButton = document.createElement("button");
        randDataButton.textContent = "Random Data";
        randDataButton.addEventListener('click', async () => {
                fetchScreen.textContent = "Fetching randomly generated data from the server ...";
                fetchDiv.style.display = "flex";
                let tryFailed = false;
                try{
                        await getDefaultData();
                }
                catch{
                        fetchScreen.textContent = "An internal error has occured, please wait and refresh the page.";
                        tryFailed = true;
                }
                finally{
                        if(!tryFailed)
                                fetchDiv.style.display = "none";
                }
            });

        const contentContainer = document.createElement("div");
        contentContainer.setAttribute("id", "contentDiv");
        
        const fileNameText = document.createElement("p");
        fileNameText.setAttribute("id", "fileNameText");

        const downloadFileLink = document.createElement("a");
        downloadFileLink.setAttribute("id", "downloadFileLink");

        const img = document.createElement("img");
        img.setAttribute("id", "chart");

        const equationText = document.createElement("p");
        equationText.setAttribute("id", "equationText");

        const rValText = document.createElement("p");
        rValText.setAttribute("id", "rValText");

        const r2ValText = document.createElement("p");
        r2ValText.setAttribute("id", "r2ValText");

        const confIntervalText = document.createElement("p");
        confIntervalText.setAttribute("id", "confIntervalText");

        const loadScreenContainer = document.createElement("div");
        loadScreenContainer.setAttribute("id", "loadScreenDiv");
        
        const loadScreen = document.createElement("span");
        loadScreen.setAttribute("id", "loadScreen");
        loadScreen.textContent = "Loading ... This may take a moment if the server has been idled.";

        form.appendChild(input);
        inputContainer.appendChild(form);
        inputContainer.appendChild(randDataButton);
        fetchDiv.appendChild(fetchScreen);
        inputContainer.appendChild(fetchDiv);
        
        contentContainer.style.display = "none";
        inputContainer.style.display = "none";

        contentContainer.appendChild(fileNameText);
        contentContainer.appendChild(downloadFileLink);
        contentContainer.appendChild(img);
        contentContainer.appendChild(equationText);
        contentContainer.appendChild(rValText);
        contentContainer.appendChild(r2ValText);
        contentContainer.appendChild(confIntervalText);

        loadScreenContainer.appendChild(loadScreen);

        container.appendChild(headerContainer);
        setHeader();
        container.appendChild(inputContainer);
        container.appendChild(contentContainer);
        container.appendChild(loadScreenContainer);
}

setHTML();
getDefaultData();
