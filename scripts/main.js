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
    
            let image = document.createElement("img");
            image.src = sublinks.images[item];
            image.alt = "Image of " + item;
            image.style.gridArea = "img";
            div.appendChild(image);
    
            let currentDiv = document.createElement("div");
            currentDiv.style.gridArea = "cur";
            div.appendChild(currentDiv);

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
    
            document.body.appendChild(div);

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