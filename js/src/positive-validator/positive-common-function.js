const commonFunction = (function(){
    /**
     * @param {any} value
     * @returns {boolean}
     */
    const isNumber = function(value) {
        return !isNaN(value);
    };

    /**
     * Check the Null value or Not.
     * This method will return true, if value is null, undefined and length 0 String value.
     *
     * @param {any} value
     * @return {boolean}
     */
    const isNull = function(value){
        let isNull = false;

        if(value === null || value === 'undefined' || value === undefined){
            isNull = true;
        }else if(typeof value === 'string' && value.length === 0){
            isNull = true;
        }

        return isNull;
    };

    /**
     * Check the value is Not Null.
     * This method will return false, if value is null, undefined and length 0 String value.
     *
     * @param {any} value
     * @return {boolean}
     */
    const isNotNull = function(value){
        let isNotNull = false;
        if(!isNull(value)){
            isNotNull = true;
        }
        return isNotNull;
    };

    return {
        isNumber,
        isNull,
        isNotNull,
    }
})();

export default commonFunction;
