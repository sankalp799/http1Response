let container = document.getElementById("container");
for(let i=0; i<900; i++){
    let imageDiv = document.createElement("img");
    imageDiv.classList.add('IMG');
    container.insertAdjacentElement('beforeend', imageDiv);
}

let picArr = document.querySelectorAll('#container img');
console.log(picArr);

let client_request = (headers, path, method, queryStringObj, payload, callback) => {

    headers = typeof(headers) == 'object' && headers !== null ? headers : {};
    path = typeof(path) == 'string' ? path : '/';
    method = typeof(method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method.toUpperCase()) > -1 ? method : 'GET';
    queryStringObj = typeof(queryStringObj) == 'object' && queryStringObj !== null ? queryStringObj : {};
    payload = typeof(payload) == 'object' && payload !== null ? payload : {};
    callback = typeof(callback) == 'function' ? callback : null;

    let xhr = new XMLHttpRequest();
    xhr.open(method, path, true);
    xhr.setRequestHeader('Content-Type', 'application/json');


    xhr.onreadystatechange = () => {
        if(xhr.readyState == XMLHttpRequest.DONE){
            let statusCode = xhr.status;
            let responseText = xhr.responseText;

            if(callback){
                try{
                    responseText = JSON.parse(responseText);
					// console.log(responseText);
                    callback(statusCode, responseText);
                }catch(e){
                    callback(statusCode, false);
                }
            }console.log(responseText);
        }
    }
    
    let payloadString = JSON.stringify(payload);
    xhr.send(payloadString);
}


picArr.forEach(async (imgDiv, index) => {
    let image_number = ('000'+(index+1)).substr(-3);

    picArr[index].src = await `http://localhost:3000/public/src/image_part_${image_number}.png`;
    
});
