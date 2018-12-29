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

createMyTvList = async () => {
  var newChannelList = '#EXTM3U';
  var myChannelList = await getList('file://C:\\Projects\\filedownloader\\testfiles\\mychannellist.txt');
  var iptvList = await getList('file://C:\\Projects\\filedownloader\\testfiles\\tv_channels_HJWbvVXtXm_plus.m3u');

  var myChannelListArr = myChannelList.split('|');
  var iptvListArr = iptvList.split('\n');
  var qualityArr = ['FHD', 'HD', ''];
  
  myChannelListArr.forEach((myChannel) => {
    var added = false;

    qualityArr.forEach((quality) => {
      
      if(added) 
        return;

      iptvListArr.forEach((iptvChannel, iptvIndex) => {
        if(added) 
          return;

        if(!iptvChannel.includes('group-title="Sweden"')) 
          return;

        var channel = myChannel + ' ' + quality;

        if(iptvChannel.toLowerCase().includes(channel.toLowerCase())) {
          newChannelList += '\n' + iptvChannel.replace('group-title="Sweden"', 'group-title="Min lista"') + '\n' + iptvListArr[iptvIndex+1];
          added = true;
        }
      })

    })

    if(!added)
       console.log('could not find ' + myChannel )
  });

  await writeFileAtomically('C:\\Projects\\filedownloader\\testfiles\\favoriteChannels.txt', newChannelList);
}

createMyTvList();