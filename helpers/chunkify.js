const chunkify = (arr, parts, size) => {
    let sendRemainingElemntsIntoLastArray;
    if(!size){
        sendRemainingElemntsIntoLastArray = true;
        size = arr.length <= parts?
            arr.length%parts :
            parseInt((arr.length/parts));
    }
    if(arr.length <= parts){
        let newArray = [], i= 0;
        while(i < parts) {
            newArray.push([arr[i] || []])
            i++;
        }
        return newArray;
    }
    let tempArray = [...arr];// to copy array immutablly
    let leftArray = [...arr];
    let newArray = [];
    while(leftArray.length !== 0 && parts){
        leftArray = tempArray.splice(size);
        newArray.push(tempArray);
        tempArray = [...leftArray];
        parts--;
    }
    if(sendRemainingElemntsIntoLastArray)
        newArray[newArray.length - 1].push(...leftArray);
    return newArray;
}

export default chunkify
