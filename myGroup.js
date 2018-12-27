var XMLHttpRequest  = require("xmlhttprequest").XMLHttpRequest;

getData = (url) => new Promise(
  function (resolve, reject) {
    var xhr = new XMLHttpRequest();  
    xhr.open("GET", url, false);
  
    xhr.onreadystatechange = function () {         
      if (xhr.readyState == 4 && (xhr.status === 200 || xhr.status == 0)) {        
        resolve(xhr.responseText) 
      } else {
        reject(new Error('Could not get data from ' + url));
      }              
    }
  
    xhr.send();
  }
);

getList = (url) => {
  return getData(url).catch(function (error){
    console.log(error.message);
  })
}

writeToFile = (text) => {

} 

createMyTvList = async () => {
  var newList = '#EXTM3U \n'
  var myList = await getList('file://C:\\Projects\\filedownloader\\testfiles\\mychannellist.txt');
  var tvList = await getList('file://C:\\Projects\\filedownloader\\testfiles\\tvchannels.m3u');

  var myListArr = myList.split('\n');
  var tvListArr = tvList.split('\n');
  
  myListArr.forEach((myItem) => {
    tvListArr.forEach((tvItem, i) => {
      if(tvItem.toLowerCase().includes(myItem.toLowerCase())){
        newList += tvListArr[i-1] + '\n' + tvItem;
      }
    })
  });

console.log(newList);

}

createMyTvList();