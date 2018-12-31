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

  getLogo = (channel) => {
    var path = '';
    if(channel.toLowerCase().includes('svt1') || channel.toLowerCase().includes('svt 1'))
        path += 'SVT1';
    else if(channel.toLowerCase().includes('svt2') || channel.toLowerCase().includes('svt 2'))
        path += 'SVT2';
    else if(channel.toLowerCase().includes('tv3') || channel.toLowerCase().includes('tv 3'))
        path += 'TV3';
    else if(channel.toLowerCase().includes('tv4') || channel.toLowerCase().includes('tv 4'))
        path += 'TV4';
    else if(channel.toLowerCase().includes('kanal5') || channel.toLowerCase().includes('kanal 5'))
        path += 'Kanal5';
    else if(channel.toLowerCase().includes('tv6') || channel.toLowerCase().includes('tv 6'))
        path += 'TV6';
    else if(channel.toLowerCase().includes('sjuan'))
        path += 'Sjuan';
    else if(channel.toLowerCase().includes('tv8') || channel.toLowerCase().includes('tv 8'))
        path += 'TV8';    
    else if(channel.toLowerCase().includes('kanal9') || channel.toLowerCase().includes('kanal 9'))
        path += 'Kanal9';    
    else if(channel.toLowerCase().includes('tv10') || channel.toLowerCase().includes('tv 10'))
        path += 'TV10';    
    else if(channel.toLowerCase().includes('kanal11') || channel.toLowerCase().includes('kanal 11'))
        path += 'Kanal11';    
    else if(channel.toLowerCase().includes('tv12') || channel.toLowerCase().includes('tv 12'))
        path += 'TV12';    
    else
        path += 'default';
    
    return path;
}
  
module.exports = {
    getList: (url) => {
        return getData(url).catch(function (error){
            console.log(error.message);
        })
    },
    getExtinf: (name, groupTitle) => {
        return '#EXTINF:-1 tvg-logo="'+ getLogo(name) +'" group-title="'+ groupTitle +'", ' + name
    }
}