const buildHelper = require('./buildHelper');
const writeFileAtomically = require('write-file-atomically');

module.exports = {
  createGroup: async (iptvListArr, listName) => {
    var newChannelList = '';

    iptvListArr.forEach((item) => {
      newChannelList += item + '\n';
    });

    await writeFileAtomically('C:\\Projects\\m3u-builder\\src\\files\\'+listName+'.txt', newChannelList);
  },

  createGroupFromFavoriteList: async (iptvListArr, listName, groupName) => {
    var newChannelList = '#EXTM3U';
    var channelList = await buildHelper.getList('file://C:\\Projects\\m3u-builder\\src\\files\\mychannellist.txt');
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

          var fullChannelName = channel.trim() + ' ' + quality;

          if(iptvChannel.toLowerCase().includes(fullChannelName.toLowerCase())
          || iptvChannel.toLowerCase().includes(fullChannelName.replace(' ', '').toLowerCase())) {
            newChannelList += '\n' + iptvChannel.replace('group-title="Sweden"', 'group-title="'+groupName+'"') + '\n' + iptvListArr[iptvIndex+1];
            added = true;
          }
        })

      })

      if(!added)
        console.log(channel);

    });

    await writeFileAtomically('C:\\Projects\\m3u-builder\\src\\files\\'+listName+'.txt', newChannelList);
  }
}
