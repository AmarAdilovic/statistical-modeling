const img = document.querySelector(`#chart`);

const getDefaultData = async () => {
        // Returns a promise regarding the response from the server
        const res = await fetch(`http://localhost:3000/data`);
        // Parses the information passed in and decodes the image
        const data = JSON.parse(await res.text());
        img.src = `data:image/jpg;base64,${data.img}`;
        let rValue = data.r_val;
        console.log("R-Value: " + rValue);

}

async function getData() {
        // Returns a promise regarding the response from the server
        const res = await fetch(`http://localhost:3000/data-retrieve`);
        // Parses the information passed in and decodes the image
        const data = JSON.parse(await res.text());
        img.src = `data:image/jpg;base64,${data.img}`;
        console.log("getData() called");
}

function handleFile(){
        let file = this.files[0];
        let reader = new FileReader();
      
        reader.readAsText(file);
      
        reader.onload = async function() {
                console.log(reader.result);
                const sendFile = async () => {
                        let formData = new FormData();
                        formData.set("csv", file, file.name);

                        const response = await fetch(`http://localhost:3000/data-upload`, {body: formData, method: "POST",});
                        const data = JSON.parse(await response.text());
                        console.log(data);
                }
                await sendFile();
                getData();
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
        input.addEventListener("change", handleFile, false);


        const contentContainer = document.createElement("div")
        contentContainer.setAttribute("id", "contentDiv");;
        
        form.appendChild(input);
        inputContainer.appendChild(form);
        contentContainer.appendChild(img);

        container.appendChild(inputContainer);
        container.appendChild(contentContainer);
}

setHTML();
getDefaultData();
