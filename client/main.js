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
        
        const contentContainer = document.createElement("div");
        contentContainer.style.textAlign = "center";
        contentContainer.setAttribute("id", "contentDiv");
        
        const contentHeader = document.createElement("h1");
        contentHeader.textContent = "Statistical Models Offered";

        const modelLinkContainer = document.createElement("div");
        modelLinkContainer.style.display = "flex";
        modelLinkContainer.style.justifyContent = "center";
        modelLinkContainer.setAttribute("id", "modelLinkDiv");

        const linearRegressionContainer = document.createElement("div");
        linearRegressionContainer.setAttribute("id", "linearRegressionDiv");

        const linearRegressionTitle = document.createElement("h3");
        linearRegressionTitle.textContent = "Simple Linear Regression";

        const linearRegressionLink = document.createElement("a");
        linearRegressionLink.title = "Linear Regression";
        linearRegressionLink.href = "https://amaradilovic.github.io/statistical-modeling/statisticalModels/linearRegression/linearRegression.html"

        const linearRegressionImage = document.createElement("img");
        linearRegressionImage.src = "client/images/linearImage.jpg";
        linearRegressionImage.style.height = "450px";
        linearRegressionImage.style.width = "450px";
        linearRegressionLink.appendChild(linearRegressionImage);

        const olsContainer = document.createElement("div");
        olsContainer.setAttribute("id", "olsDiv");

        const olsTitle = document.createElement("h3");
        olsTitle.textContent = "Ordinary Least Squares";

        const olsLink = document.createElement("a");
        olsLink.title = "Ordinary Least Squares";
        olsLink.href = "https://amaradilovic.github.io/statistical-modeling/statisticalModels/ordinaryLeastSquares/ordinaryLeastSquares.html"

        const olsImage = document.createElement("img");
        olsImage.src = "client/images/olsImage.jpg";
        olsImage.style.height = "450px";
        olsImage.style.width = "450px";
        olsLink.appendChild(olsImage);

        linearRegressionContainer.appendChild(linearRegressionTitle);
        linearRegressionContainer.appendChild(linearRegressionLink);

        olsContainer.appendChild(olsTitle);
        olsContainer.appendChild(olsLink);

        modelLinkContainer.appendChild(linearRegressionContainer);
        modelLinkContainer.appendChild(olsContainer);

        contentContainer.appendChild(contentHeader);
        contentContainer.appendChild(modelLinkContainer);

        container.appendChild(headerContainer);
        setHeader();
        container.appendChild(contentContainer);
}

setHTML();
