async function getTimePostgres() {
    const response = await fetch("http://localhost:3500/test");
    const jsonData = await response.json();
    console.log(jsonData);

    const node = document.createElement("p");
    const textnode = document.createTextNode(jsonData.time);
    node.appendChild(textnode);
    document.getElementById("data-postgres").appendChild(node);
}

async function getTimeMongo() {
    const response = await fetch("http://localhost:3500/test2");
    const jsonData = await response.json();
    console.log(jsonData);

    const node = document.createElement("p");
    const textnode = document.createTextNode(jsonData.time);
    node.appendChild(textnode);
    document.getElementById("data-mongo").appendChild(node);
}

async function getTimeCassandra() {
    const response = await fetch("http://localhost:3500/test3");
    const jsonData = await response.json();
    console.log(jsonData);

    const node = document.createElement("p");
    const textnode = document.createTextNode(jsonData.time);
    node.appendChild(textnode);
    document.getElementById("data-cassandra").appendChild(node);
}
