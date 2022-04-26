function setHTML(){
        // Container for all elements on the page
        const container = document.querySelector(".container");


        const contentContainer = document.createElement("div");
        contentContainer.setAttribute("id", "contentDiv");
        
        const linearRegressionLink = document.createElement("a");
        const linearText = document.createTextNode("Linear Regression");

        linearRegressionLink.title = "Linear Regression";
        linearRegressionLink.href = "statisticalModels/linearRegression/linearRegression.html"

        const ordinaryLeastSquaresLink = document.createElement("a");
        const ordinaryText = document.createTextNode("Ordinary Least Squares");

        ordinaryLeastSquaresLink.title = "Ordinary Least Squares";
        ordinaryLeastSquaresLink.href = "statisticalModels/ordinaryLeastSquares/ordinaryLeastSquares.html"

        linearRegressionLink.appendChild(linearText);
        linearRegressionLink.style.margin = "50px";
        ordinaryLeastSquaresLink.appendChild(ordinaryText);
        ordinaryLeastSquaresLink.style.margin = "50px";

        contentContainer.appendChild(linearRegressionLink);
        contentContainer.appendChild(ordinaryLeastSquaresLink);
        container.appendChild(contentContainer);
}

setHTML();
