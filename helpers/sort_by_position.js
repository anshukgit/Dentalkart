
const sortByPosition = (arr) => {
    try {
        const sortedArr = arr.sort((A, B) => {
            if (A.hasOwnProperty('position') && B.hasOwnProperty('position')) {
                let positionA = A.position;
                let positionB = B.position;
                if(positionA < positionB) return -1;
                if(positionA > positionB) return 1;
                return 0;
            }else {
                console.error("Position Attribute is required");
                return 0;
            }
        });
        return sortedArr;
    } catch (e) {
        console.log(e);
    }
}

export default sortByPosition;
