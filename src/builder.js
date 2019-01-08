const writeFileAtomically = require('write-file-atomically');

module.exports = {
  createGroup: async (iptvListArr, listName) => {
    var newChannelList = '';

    iptvListArr.forEach((item) => {
      newChannelList += item + '\n';
    });

    await writeFileAtomically('files/'+listName+'.txt', newChannelList);
  }
}
