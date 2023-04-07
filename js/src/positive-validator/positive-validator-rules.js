import commonFunction from "./positive-common-function";

const ruleMessage = {
    REQUIRED: 'The :attribute field is required.',
    LESS_STRING_LENGTH: 'The :attribute must be at least :min characters.',
    MORE_STRING_LENGTH: 'The :attribute must not exceed :max characters.',
    EMAIL: 'The :attribute must be a valid email format. e.g. sample@gmail.com',
    INVALID_POSTAL_CODE: 'The :attribute format is invalid. e.g. R1R 1R1',
    INVALID_PHONE_NUMBER: 'The :attribute format is invalid. e.g. 204-123-4567',
    NUMBER_NOT_GREATER_THAN: 'The :attribute should not be greater than :maxValue',
    NUMBER_NOT_LESS_THAN: 'The :attribute should not be less than :minValue',
    DUPLICATE_USER_ID: 'This ID already exist.',
    DUPLICATE_EMAIL: 'This email address already exist.',
    CONFIRM_PASSWORD: 'The password is not matched.',
    INVALID_FILE_EXTENSION: 'The :attribute format is invalid. Upload jpeg/png/pdf',
};

/**
 * Validation Rule Interface.
 * If you want to make the new rule, follow the code template below;
 *
 * const rule_name = function(){
 *     const name = 'rule_name';
 *
 *     const validate = function(value){
 *          ( Validation Logic )
 *          return boolean;
 *     }
 *
 *     const getName = function(){
 *          return name;
 *     }
 *
 *     const getMessage = function(label){
 *         return ERROR_MSG changed by label name;
 *     }
 *
 *     return {
 *          validate,
 *          getName,
 *          getMessage
 *     }
 * }
 */

/**
 * Validate input field has value or not.
 *
 * @returns {{getName: (function(): string), getMessage: (function(string): string), validate: (function(string): boolean)}}
 */
const required = function(){
    const name = 'required';

    /**
     * @param {string} data
     * @returns {boolean}
     */
    const isSet = function(data){
        let isSet = true;

        if(data.length === 0){
            isSet = false;
        }

        return isSet;
    };

    /**
     * @param {string} value
     * @returns {boolean}
     */
    const validate = function(value){
        return isSet(value);
    };

    /**
     * @returns {string}
     */
    const getName = function(){
        return name;
    };

    /**
     * @param {string} label
     * @returns {string}
     */
    const getMessage = function(label){
        return ruleMessage.REQUIRED.replace(':attribute', label);
    };

    return {
        validate,
        getName,
        getMessage
    }
};

/**
 * Validate input field's value has less length than given minLength value.
 *
 * @param {Number} minLength
 * @returns {{getName: (function(): string), getMessage: (function(string): string), validate: (function(string): boolean)}}
 */
const stringNotBeLessThan = function(minLength) {
    const name = 'stringNotBeLessThan';

    /**
     * @param {string} value
     * @returns {boolean}
     */
    const isValueLengthOver = function(value) {
        let isLengthOver = true;
        if( value.length < minLength){
            isLengthOver = false;
        }
        return isLengthOver;
    };

    /**
     * @param {string} value
     * @returns {boolean}
     */
    const validate = function(value){
        let result = true;
        if(value){
            result = isValueLengthOver(value);
        }
        return result;
    };

    /**
     * @returns {string}
     */
    const getName = function(){
        return name;
    };

    /**
     * @param {string} label
     * @returns {string}
     */
    const getMessage = function(label) {
        return ruleMessage.LESS_STRING_LENGTH.replace(':attribute', label).replace(':min', minLength.toString());
    };

    return {
        validate,
        getName,
        getMessage
    }
};

/**
 * Validate input field's value has more length than given maxLength value.
 *
 * @param {Number} maxLength
 * @returns {{getName: (function(): string), getMessage: (function(string): string), validate: (function(string): boolean)}}
 */
const stringNotBeMoreThan = function(maxLength) {

    const name = 'stringNotBeMoreThan';

    /**
     * @param {string} value
     * @returns {boolean}
     */
    const isValueLengthUnder = function(value) {
        let isLengthUnder = true;
        if( value.length > maxLength){
            isLengthUnder = false;
        }
        return isLengthUnder;
    };

    /**
     * @param {string} value
     * @returns {boolean}
     */
    const validate = function(value){
        let result = true;
        if(value) {
            result = isValueLengthUnder(value);
        }
        return result;
    };

    /**
     * @returns {string}
     */
    const getName = function(){
        return name;
    };

    /**
     * @param {string} label
     * @returns {string}
     */
    const getMessage = function(label){
        return ruleMessage.MORE_STRING_LENGTH.replace(':attribute', label).replace(':max', maxLength.toString());
    };

    return {
        validate,
        getName,
        getMessage
    }

};

/**
 * Validate email format
 *
 * @returns {{getName: (function(): string), getMessage: (function(string): string), validate: (function(string): boolean)}}
 */
const email = function() {
    const name = 'email';
    const REGEX_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // https://emailregex.com/

    /**
     * @param {string} value
     * @returns {boolean}
     */
    const validate = function(value){
        let result = true;
        if(value){
            result = REGEX_EMAIL.test(value);
        }
        return result;
    }

    /**
     * @returns {string}
     */
    const getName = function(){
        return name;
    };

    /**
     * @param {string} label
     * @returns {string}
     */
    const getMessage = function(label){
        return ruleMessage.EMAIL.replace(':attribute', label);
    };

    return {
        validate,
        getName,
        getMessage
    }
};

/**
 * Validate Canada postal code format
 *
 * @returns {{getName: (function(): string), getMessage: (function(string): string), validate: (function(string): boolean)}}
 */
const postalCodeCA = function() {
    const name = 'postalCode';
    const REGEX_POSTAL_CODE = /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/;

    /**
     * @param {string} value
     * @returns {boolean}
     */
    const validate = function(value){
        let result = true;
        if(value){
            result = REGEX_POSTAL_CODE.test(value);
        }
        return result;
    };

    /**
     * @returns {string}
     */
    const getName = function(){
        return name;
    };

    /**
     * @param {string} label
     * @returns {string}
     */
    const getMessage = function(label){
        return ruleMessage.INVALID_POSTAL_CODE.replace(':attribute', label);
    };

    return {
        validate,
        getName,
        getMessage
    }
};

/**
 * Validate Canada phone number format
 *
 * @returns {{getName: (function(): string), getMessage: (function(string): string), validate: (function(string): boolean)}}
 */
const phoneNumberCA = function() {
    const name = 'phoneNumber';
    const REGEX_PHONE_NUMBER = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})\s*$/;

    /**
     * @param {string} value
     * @returns {boolean}
     */
    const validate = function(value){
        let result = true;
        if(value){
            result = REGEX_PHONE_NUMBER.test(value);
        }
        return result;
    }

    /**
     * @returns {string}
     */
    const getName = function(){
        return name;
    };

    /**
     * @param {string} label
     * @returns {string}
     */
    const getMessage = function(label){
        return ruleMessage.INVALID_PHONE_NUMBER.replace(':attribute', label);
    };

    return {
        validate,
        getName,
        getMessage
    }
};

/**
 * Validate input field's number value is over than given maxNumber value.
 *
 * @param {Number} maxNumber
 * @returns {{getName: (function(): string), getMessage: (function(string): string), validate: (function(string): boolean)}}
 */
const numberNotGreaterThan = function(maxNumber) {
    const name = 'numberNotGreaterThan';

    /**
     * @param {string} value
     * @returns {boolean}
     */
    const validate = function(value){
        let result = true;

        if(commonFunction.isNotNull(value)){
            let intValue = Number(value);
            result = intValue <= maxNumber;
        }

        return result;
    }

    /**
     * @returns {string}
     */
    const getName = function(){
        return name;
    };

    /**
     * @param {string} label
     * @returns {string}
     */
    const getMessage = function(label){
        return ruleMessage.NUMBER_NOT_GREATER_THAN.replace(':attribute', label).replace(':maxValue', maxNumber.toString());
    };

    return {
        validate,
        getName,
        getMessage
    }
};

/**
 * Validate input field's number value is less than given minNumber value.
 *
 * @param {Number} minNumber
 * @returns {{getName: (function(): string), getMessage: ((function(string): string)|*), validate: (function(string): boolean)}}
 */
const numberNotLessThan = function(minNumber) {
    const name = 'numberNotLessThan';

    /**
     * @param {string} value
     * @returns {boolean}
     */
    const validate = function(value){
        let result = true;
        if (commonFunction.isNotNull(value)){
            let intValue = Number(value);
            result = intValue >= minNumber;
        }
        return result;
    }

    /**
     * @returns {string}
     */
    const getName = function(){
        return name;
    };

    /**
     * @param {string} label
     * @returns {string}
     */
    const getMessage = function(label) {
        return ruleMessage.NUMBER_NOT_LESS_THAN.replace(':attribute', label).replace(':minValue', minNumber.toString());
    };

    return {
        validate,
        getName,
        getMessage
    }
};

/**
 * Validate User ID duplication by Ajax call
 *
 * @returns {{getName: (function(): string), getMessage: (function(string): string), validate: (function(string): Promise<boolean>)}}
 */
const checkUserIdDuplication = function(){
    const name = 'checkUserIdDuplication';
    const url = 'please put the user checking REST api url';

    /**
     * @param {string} userId
     * @returns {boolean}
     */
    const validate = async function(userId){
        let isValidate = false;
        const param = {
            'user_id': userId,
        };

        try {
            /**
             * Write the code your own Ajax call method for checking the user id duplication
             *
             * Example
             *
             * const response = await axios.post(url, param);
             * isValidate = !response.data.isDuplicatedId;
             */
            console.group();
            console.error('Error from positive-validator-rules.js.');
            console.error('Before using checkUserIdDuplication rule, please implement Ajax code in checkUserIdDuplication function at positive-validator-rules.js.');
            console.groupEnd();

            isValidate = true;
        } catch (e) {
            isValidate = false;
        }

        return isValidate;
    };

    /**
     * @returns {string}
     */
    const getName = function(){
        return name;
    };

    /**
     * @param {string} label
     * @returns {string}
     */
    const getMessage = function(label){
        return ruleMessage.DUPLICATE_USER_ID;
    };

    return {
        validate,
        getName,
        getMessage
    }
};

/**
 * Validate Email duplication by Ajax call
 *
 * @returns {{getName: (function(): string), getMessage: (function(string): string), validate: (function(string): Promise<boolean>)}}
 */
const checkEmailDuplication = function(){
    const name = 'checkEmailDuplication';
    const url = 'please put the email checking REST api url';

    /**
     * @param {string} email
     * @returns {boolean}
     */
    const validate = async function(email){
        let isValidate;
        const param = {
            'email': email,
        };

        try {
            /**
             * Write the code your own Ajax call method for checking the email duplication
             *
             * Example
             *
             * const response = await axios.post(url, param);
             * isValidate = !response.data.isDuplicatedEmail;
             */
            console.group();
            console.error('Error from positive-validator-rules.js.');
            console.error('Before using checkEmailDuplication rule, please implement Ajax code in checkEmailDuplication function at positive-validator-rules.js.');
            console.groupEnd();
        } catch (e) {
            isValidate = false;
        }

        return isValidate;
    };

    /**
     * @returns {string}
     */
    const getName = function(){
        return name;
    };

    /**
     * @param {string} label
     * @returns {string}
     */
    const getMessage = function(label){
        return ruleMessage.DUPLICATE_EMAIL;
    };

    return {
        validate,
        getName,
        getMessage
    }
};

/**
 * Validate confirm password value matches with given targetElement Input Field value.
 *
 * @param {string} targetElementID
 * @returns {{getName: (function(): string), getMessage: (function(string): string), validate: (function(string): boolean)}}
 */
const confirmPassword = function(targetElementID) {
    const name = 'confirmPassword';

    /**
     * @param {string} value
     * @returns {boolean}
     */
    const validate = function(value){
        const targetPasswordElement = document.querySelector('#' + targetElementID);
        let isValidated = false;

        if(targetPasswordElement){
            isValidated = targetPasswordElement.value === value;
        }

        return isValidated;
    };

    /**
     * @returns {string}
     */
    const getName = function(){
        return name;
    };

    /**
     * @returns {string}
     */
    const getMessage = function(label){
        return ruleMessage.CONFIRM_PASSWORD;
    };

    return {
        validate,
        getName,
        getMessage
    }
};

/**
 * Validate file extension. JPG, JPEG, PNG, PDF format are default
 *
 * @returns {{getName: (function(): string), getMessage: (function(string): string), validate: (function(string): boolean)}}
 */
const validFileExtension = function() {
    const name = 'validFileExtension';
    const REGEX_VALID_FILE_EXTENSION = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;

    /**
     * @param {string} value
     * @returns {boolean}
     */
    const validate = function(value){
        let result = true;

        if(value){
            result = REGEX_VALID_FILE_EXTENSION.test(value.toLowerCase());
        }

        return result;
    }

    /**
     * @returns {string}
     */
    const getName = function(){
        return name;
    };

    /**
     * @param {string} label
     * @returns {string}
     */
    const getMessage = function(label){
        return ruleMessage.INVALID_FILE_EXTENSION.replace(':attribute', label);
    };

    return {
        validate,
        getName,
        getMessage
    }
};

export const rule = {
    required,
    stringNotBeLessThan,
    stringNotBeMoreThan,
    numberNotGreaterThan,
    numberNotLessThan,
    email,
    confirmPassword,
    postalCodeCA,
    phoneNumberCA,
    checkUserIdDuplication,
    checkEmailDuplication,
    validFileExtension,
}
