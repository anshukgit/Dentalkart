
const componentValidity = (startDate, endDate) => {
    let startTime = new Date(startDate).getTime();
    let endTime = new Date(endDate).getTime();
    let currentTime = new Date().getTime();
    if(startTime > endTime) alert(startDate);
    let validity = (currentTime > startTime && currentTime < endTime) ? true : false;
    return validity;
}

export default componentValidity
