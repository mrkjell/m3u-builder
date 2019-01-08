const buildHelper = require('./buildHelper');
const builder = require('./builder');

getGroupTitle = (name) => {
    return (name.split(',')[1]).replaceAll('##########', '').replaceAll('==========', '').trim();
}

getCommonChannelname = (extinfRow) => {
    return (extinfRow.split(',')[1]).replaceAll('SE', '').replaceAll('FHD', '').replaceAll('HD', '').replaceAll('VIP','').replaceAll(' ', '').trim();
}

tryManualFixChannelName = (extinfRow) => {
    var extinfSplit = extinfRow.split(',');
    if(!extinfSplit[1].includes(' SE'))
        return extinfRow;

    if(extinfSplit[1].toLowerCase().includes('svt') ){
        if(extinfSplit[1].trim().charAt(3) === ' ')
            extinfSplit[1] = extinfSplit[1].splice(4, 1, '');
        extinfRow = extinfSplit[0] + ',' + extinfSplit[1];
    }
    else if(extinfSplit[1].toLowerCase().includes('tv')){
        if(extinfSplit[1].trim().charAt(2) === ' ')
            extinfSplit[1] = extinfSplit[1].splice(3, 1, '');
        extinfRow = extinfSplit[0] + ',' + extinfSplit[1];
    }
    else if(extinfSplit[1].toLowerCase().includes('kanal')){
        if(extinfSplit[1].trim().charAt(5) !== ' ')
            extinfSplit[1] = extinfSplit[1].splice(5, 0, ' ')
        extinfRow = extinfSplit[0] + ',' + extinfSplit[1];
    }
    return extinfRow;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

String.prototype.splice = function(start, delCount, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
};

getIptv = async (iptvListArr, onlySwedish = false, tryRemoveDuplicate = false, tryFixSwedishChannelName = false) => {
    var iptvArr = [];
    var vodArr = [];
    var country = ''
    var groupTitle = '';
    var skipIndex = '';

    /// Change m3u row format 
    /// Split up iptv and vod
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
                iptvArr.push(tryManualFixChannelName(customExtinfRow));
        }
        else {
            if(groupTitle.toLowerCase().includes('vod'))
                vodArr.push(iptvChannel);
            else
                iptvArr.push(iptvChannel);            
        }
    });

    /// Remove duplicate channels
    if(tryRemoveDuplicate) {
        var distinctIptvArr = [];
        var lastAdded = '';

            iptvArr.forEach((mainItem, mainIndex) => {
                var bestQualiryAdded = false; 
                if(!mainItem.includes('#EXTINF')) 
                    return;

                if(lastAdded == getCommonChannelname(mainItem))
                    return;

                var bestChannel = [mainItem, iptvArr[mainIndex + 1]];

                if(!mainItem.includes('FHD')) {

                var mainItemGroup = mainItem.substring(
                    mainItem.lastIndexOf('group-title="') + 1, 
                    mainItem.lastIndexOf('",')
                );

                    iptvArr.forEach((compareItem, compareIndex) => {

                        if(!compareItem.includes('#EXTINF'))
                            return;

                        if(mainIndex == compareIndex)
                            return;

                        var compareItemGroup = compareItem.substring(
                            compareItem.lastIndexOf('group-title="') + 1, 
                            compareItem.lastIndexOf('",')
                        );

                        if(mainItemGroup != compareItemGroup)
                            return

                        if(getCommonChannelname(mainItem) == getCommonChannelname(compareItem)) {
                            if(compareItem.includes('FHD')){
                                bestChannel = [compareItem, iptvArr[compareIndex + 1]];
                                bestQualiryAdded = true;
                            }
                            else if(compareItem.includes('HD') && !bestQualiryAdded){
                                bestChannel = [compareItem, iptvArr[compareIndex + 1]];
                            }
                        }
                    })
                }

                lastAdded = getCommonChannelname(bestChannel[0]);
                bestChannel.forEach((item) => {
                    distinctIptvArr.push(item)
                })
            })

        if(distinctIptvArr.length != 0)
            iptvArr = distinctIptvArr
    }


    return iptvArr.concat(vodArr);

}

(init = async () => {
    var iptvList = await buildHelper.getList('http://foviptv.shop:8080/get.php?username=xxx&password=xxx&type=m3u&output=ts');
    var iptvListArr = await iptvList.split('\n');

    var sweIptvArr = await getIptv(iptvListArr, true, true, true);
    builder.createGroup(sweIptvArr, 'sweCustomList');

    var fullIptvArr = await getIptv(iptvListArr);
    builder.createGroup(fullIptvArr, 'fullCustomList');
})();
