var XMLHttpRequest  = require("xmlhttprequest").XMLHttpRequest;
const writeFileAtomically = require('write-file-atomically');

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

createMyTvList = async () => {
  var newList = '';
  var myList = await getList('file://C:\\Projects\\filedownloader\\testfiles\\mychannellist.txt');
  var tvList = await getList('file://C:\\Projects\\filedownloader\\testfiles\\tvchannels.m3u');

  var myListArr = myList.split('\n');
  var tvListArr = tvList.split('\n');
  
  myListArr.forEach((myItem, myi) => {
    tvListArr.forEach((tvItem, tvi) => {
      // Adds first line (#EXTM3U) to new file
      if(myi === 0 && tvi === 0){
        newList += tvItem;
      }

      if(tvItem.toLowerCase().includes(myItem.toLowerCase())){
        newList += '\n' + tvListArr[tvi-1] + '\n' + tvItem;
      }
    })
  });

  await writeFileAtomically('C:\\Projects\\filedownloader\\testfiles\\test.txt', newList);
  console.log(newList);

}

createMyTvList();