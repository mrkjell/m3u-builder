const XMLHttpRequest  = require("xmlhttprequest").XMLHttpRequest;
const writeFileAtomically = require('write-file-atomically');

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

getList = (url) => {
  return getData(url).catch(function (error){
    console.log(error.message);
  })
}

createFavoritGroup = async (iptvListArr) => {
  var newChannelList = '#EXTM3U';
  var channelList = await getList('file://C:\\Projects\\filedownloader\\testfiles\\mychannellist.txt');
  var channelListArr = channelList.split('|');
  var qualityArr = ['FHD', 'HD', ''];
  
  channelListArr.forEach((channel) => {
    var added = false;

    qualityArr.forEach((quality) => {
      
      if(added) 
        return;

      iptvListArr.forEach((iptvChannel, iptvIndex) => {
        if(added) 
          return;

        if(!iptvChannel.includes('group-title="Sweden"')) 
          return;

        var fullChannelName = channel.trim() + ' ' + quality;

        if(iptvChannel.toLowerCase().includes(fulChannelName.toLowerCase())) {
          newChannelList += '\n' + iptvChannel.replace('group-title="Sweden"', 'group-title="Favorit"') + '\n' + iptvListArr[iptvIndex+1];
          added = true;
        }
      })

    })

    if(!added)
       console.log('could not find ' + channel )
  });

  await writeFileAtomically('C:\\Projects\\filedownloader\\testfiles\\favoriteChannels.txt', newChannelList);
}

(init = async () => {
  var iptvList = await getList('file://C:\\Projects\\filedownloader\\testfiles\\tv_channels_HJWbvVXtXm_plus.m3u');
  var iptvListArr = iptvList.split('\n');

  createFavoritGroup(iptvListArr);
})();
