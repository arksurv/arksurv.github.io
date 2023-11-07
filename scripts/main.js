let sublinks;
let con;

function getSubLinks() {
    fetch("https://api.github.com/gists/b4381609f9c2308dddbdb00d2a16e14b").then((response) => {
        return response.json();
    }).then((data) => {
        fetch(data.files.links.raw_url).then((response) => {
            return response.json();
        }).then((data) => {
            sublinks = data;
        })
    })
}

function hasData() {
    if (sublinks != undefined) {
        clearInterval(con);
        modifyPage();
    }
}

function modifyPage() {
    //modify list
    let dataList = document.getElementById("items");
    let newListHTML = "";
    for (let name in sublinks.items) {
        newListHTML += "<option value=\"" + name + "\">";
    }
    dataList.innerHTML = newListHTML;

    //console.log(sublinks);
}

getSubLinks();
con = setInterval(hasData, 100);

function displayItemData(item) {
    let history;
    fetch(sublinks.items[item]).then((response) => {
        return response.json();
    }).then((data) => {
        history = data.history;
        fetch(data.files[Object.keys(data.files)[0]].raw_url).then((response) => {
            return response.json()
        }).then((data) => {
            let div = document.createElement("div");
            div.id = "popup-overlay";
    
            let heading = document.createElement("h1");
            heading.textContent = item;
            heading.style.gridArea = "name";
            div.appendChild(heading);
    
            /*let canvas = document.createElement("canvas");
            let context = canvas.getContext("2d");
            canvas.style.gridArea = "img";
            div.appendChild(canvas);
            
            context.drawImage(image, item[1][0], item[1][1], item[1][2], item[1][3]);
            */
            
            let imgDiv = document.createElement("div");
            imgDiv.style.gridArea = "img";
            imgDiv.style.width = "auto";
            imgDiv.style.height = "auto";
            div.appendChild(imgDiv);

            let itemImage = sublinks.images[item]

            let image = new Image();
            image.src = itemImage[0];
            
            //imgDiv.style.backgroundImage = "url(\"https://i.imgur.com/alNHHJ6.png\")";
            //imgDiv.style.backgroundPosition = "0% 10%";
            //imgDiv.style.backgroundSize = "10% 10%";
            //imgDiv.style.backgroundRepeat = "no-repeat"; (itemImage[1][1] * 100 / image.naturalHeight)  itemImage[1][1] + 0.25 * itemImage[1][3])
            imgDiv.style.background = "url(\"" + itemImage[0] + "\") " + (itemImage[1][0] * 106.25 / image.naturalWidth) + "% " + (itemImage[1][1] * 106.25 / image.naturalHeight) + "% / " + (image.naturalWidth * 100 / itemImage[1][2]) + "% " + (image.naturalHeight * 100 / itemImage[1][3]) + "% no-repeat";
            //imgDiv.style.background = "url(\"" + itemImage[0] + "\") " + itemImage[1][0] + "px " + itemImage[1][1] + "px / " + itemImage[1][2] + "px " + itemImage[1][3] + "px no-repeat";
            //image.alt = "Image of " + item;
            //image.style.clipPath = "inset(25.04% 31.31% 0% 6.06%)"; //"inset(" + item[1][1] + "px " + (item[1][1] + item[1][3]) + "px " + item[1][0] + "px " + (item[1][0] + item[1][2]) + "px)";
            //imgDiv.appendChild(image);
    
            let currentDiv = document.createElement("div");
            currentDiv.style.gridArea = "cur";
            div.appendChild(currentDiv);

            if (data.sample) {
                let sampleNotice = document.createElement("h1");
                sampleNotice.textContent = "THIS IS A SAMPLE VALUE!!! THIS IS NOT THE REAL VALUE OF THE ITEM!!!";
                sampleNotice.style.color = "red";
                currentDiv.appendChild(sampleNotice);
            }

            let current = document.createElement("h2");
            current.textContent = "Current Price: " + data.price + " WL(s) for " + data.amount + " item(s)."
            currentDiv.appendChild(current);

            let currentDisclaimer = document.createElement("p");
            currentDisclaimer.textContent = "Source: " + data.source + "; Submitter: " + data.submitter;
            currentDiv.appendChild(currentDisclaimer);

            let historicalDiv = document.createElement("div");
            historicalDiv.id = "historical-item-price-div";
            historicalDiv.style.gridArea = "hist";
            div.appendChild(historicalDiv);
    
            document.getElementById("main-article-section").appendChild(div);

            for (let x in history) {
                fetch(history[x].url).then((response) => {
                    return response.json();
                }).then((data) => {
                    fetch(data.files[Object.keys(data.files)[0]].raw_url).then((response) => {
                            return response.json();
                    }).then((data) => {
                        if (data.count) {
                            let historicalDataPoint = document.createElement("div");
                            let dataContainer = document.createElement("p");
                            dataContainer.textContent = "Time: " + history[x].committed_at + "; Price: " + data.price + " WL(s) for " + data.amount + " item(s).";
                            historicalDataPoint.appendChild(dataContainer);

                            let disclaimerContainer = document.createElement("p");
                            disclaimerContainer.textContent = "Source: " + data.source + "; Submitter: " + data.submitter;
                            historicalDataPoint.appendChild(disclaimerContainer);

                            historicalDiv.appendChild(historicalDataPoint);
                        }
                    }).catch((error) => {
                        console.log(error);
                    })
                })
            }
        })
    }) 
}

function checkItem() {
    let item = document.getElementById("item-search").value;

    if (document.getElementById("popup-overlay") != undefined) {
        document.getElementById("popup-overlay").remove();
    }

    if (sublinks.items[item] != undefined) {
        console.log(item);
        displayItemData(item);
    } else {
        window.alert("Unknown item");
    }
}