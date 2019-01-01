const buildHelper = require('./buildHelper');
const builder = require('./builder');

var getGroupTitle = (name) => {
    return (name.split(',')[1]).replaceAll('##########', '').replaceAll('==========', '').trim();
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

getIptv = async (iptvListArr, onlySwedish = false) => {
    var iptvArr = [];
    var vodArr = [];
    var country = ''
    var groupTitle = '';
    var skipIndex = '';
    iptvListArr.forEach((iptvChannel, i) => { 
        if(skipIndex == i)
            return;

        if(iptvChannel.includes('##########')){
            country = iptvChannel;
            groupTitle = getGroupTitle(iptvChannel);
            skipIndex = i + 1;
            return;
        }

        if(onlySwedish && !country.toLowerCase().includes('sweden'))
            return; 

        if(iptvChannel.includes('#EXTINF')) {

            if(iptvChannel.includes('==========')){
                groupTitle = getGroupTitle(iptvChannel);
                skipIndex = i + 1;
                return;
            }

            var iptvChannelSplit = iptvChannel.split(',');
            var customExtinfRow = buildHelper.getExtinf(iptvChannelSplit[1], groupTitle);

            if(groupTitle.toLowerCase().includes('vod'))
                vodArr.push(customExtinfRow);
            else
                iptvArr.push(customExtinfRow);
        }
        else {
            if(groupTitle.toLowerCase().includes('vod'))
                vodArr.push(customExtinfRow);
            else
                iptvArr.push(iptvChannel);            
        }
    });


    return iptvArr.concat(vodArr);

}

(init = async () => {
    var iptvList = await buildHelper.getList('file://C:\\Projects\\m3u-builder\\src\\files\\tv_channels_OhnHB0qWvx.m3u');
    var iptvListArr = await iptvList.split('\n');

    var sweIptvArr = await getIptv(iptvListArr, true);
    builder.createGroup(sweIptvArr, 'sweCustomList');

    var fullIptvArr = await getIptv(iptvListArr);
    builder.createGroup(fullIptvArr, 'fullCustomList');
})();
