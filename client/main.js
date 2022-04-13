const img = document.querySelector(`#chart`);

const getData = async () => {
        // Returns a promise regarding the response from the server
        const res = await fetch(`http://localhost:3000/data`);
        // Parses the information passed in and decodes the image
        const data = JSON.parse(await res.text());
        img.src = `data:image/jpg;base64,${data.img}`;
        let rValue = data.r_val;
        console.log("R-Value: " + rValue);
}

getData();
