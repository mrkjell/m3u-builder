const XMLHttpRequest  = require("xmlhttprequest").XMLHttpRequest;

getData = (url) => new Promise(
    function (resolve, reject) {
      var xhr = new XMLHttpRequest();  
      xhr.open("GET", url, false);
  
      xhr.onreadystatechange = function () {         
        if (xhr.readyState == 4 && (xhr.status === 200 || xhr.status == 0))  
          resolve(xhr.responseText) 
        else
          reject(new Error('Could not get data from ' + url));  
      }
    
      xhr.send();
    }
  );
  
module.exports = {
    getList: (url) => {
        return getData(url).catch(function (error){
            console.log(error.message);
        })
    },
    getExtinf: (extinf, groupTitle) => {
        return extinf.replace(/group-title="(.+?)\"/g, "group-title=\"" + groupTitle + "\"")
    }
}