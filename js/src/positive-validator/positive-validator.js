class Target {
    /** @property {string} #id */
    #id = '';
    /** @property {HTMLInputElement} #inputElement */
    #inputElement;
    /** @property {HTMLElement} #errorMessageElement */
    #errorMessageElement;
    /** @property {string} #label */
    #label = '';
    /** @property {Object[]} #ruleList */
    #ruleList = [];
    /** @property {boolean} #checkValidation*/
    #checkValidation = true;

    /**
     * @param {string} elementID
     * @param {HTMLElement} parent
     */
    constructor(elementID, parent) {
        this.#id = elementID;
        const targetElement = this.#getValidateElement(parent, '#' + this.#id);

        if(targetElement){
            this.#setElements(targetElement);
            this.#checkServerErrorMsg();
        }else{
            this.#LogElementFindError(this.#id);
        }
    }

    /**
     * @param {HTMLElement} parentElement
     * @param {String} selector
     * @returns {HTMLElement}
     */
    #getValidateElement(parentElement, selector) {
        const foundElement = parentElement.querySelector(selector);
        if(foundElement === null){
            console.error('Parent element: ', parentElement);
            throw new Error('Can not find the DOM Element by selector. Given selector is \'' + selector + '\'');
        }
        return foundElement;
    }

    /**
     * @param {HTMLElement} targetElement
     */
    #setElements(targetElement) {
        this.#inputElement = this.#getValidateElement(targetElement, 'input.target');
        this.#errorMessageElement = this.#getValidateElement(targetElement, '.error-msg');
        this.#label = this.#getValidateElement(targetElement, 'label').innerHTML;
    }

    /**
     * @param {String} elementID
     */
    #LogElementFindError(elementID) {
        console.group('Validator Init Error.');
        console.error('Can not find the Element ID. Target ID is - ', elementID);
        console.error('This element will be skipped when executing the validation.');
        console.groupEnd();
    }

    #checkServerErrorMsg() {
        if(this.#errorMessageElement.innerText.length > 0){
            this.#showErrorMessage();
        }
    }

    #getTargetElement(){
        return this.#inputElement;
    }

    /**
     * @returns {string}
     */
    getID(){
        return this.#id;
    }

    /**
     * @returns {any}
     */
    getValue(){
        return this.#getTargetElement().value;
    }

    /**
     * @returns {string}
     */
    getLabel(){
        return this.#label;
    }

    /**
     * @param {Object} rule
     * @param {boolean} condition
     *
     * @returns {Target}
     */
    setRule(rule, condition = true){
        if(condition){
            this.removeExistingRuleFromList(rule.getName());
            this.#ruleList.push(rule);
        }
        return this;
    }

    /**
     * @param {string} ruleName
     */
    removeExistingRuleFromList(ruleName) {
        if(this.isRuleExistInRuleList(ruleName)){

            this.#ruleList = this.#ruleList.filter((existRule) => {
                return existRule.getName() !== ruleName
            });

            console.group('Validator Message');
            console.log('The \'' + ruleName + '\' rule is replaced.')
            console.groupEnd();
        }
    }

    /**
     * @param {string} ruleName
     * @return {boolean}
     */
    isRuleExistInRuleList(ruleName) {
        return this.#ruleList.some((existRule) => {
            return existRule.getName() === ruleName;
        });
    }

    removeAllProperties(){
        this.#ruleList = [];
        this.#errorMessageElement = null;
        this.#inputElement = null;
    }

    /**
     * @param {String} message
     */
    #setErrorMessage(message) {
        this.#errorMessageElement.innerText = message;
    }

    #showErrorMessage() {
        this.#errorMessageElement.style.display = 'block';
    }

    #hideErrorMessage() {
        this.#errorMessageElement.style.display = 'none';
    }

    /**
     * @param {boolean} isValidate
     * @param {Object} rule
     */
    #handleErrorMessage(isValidate, rule) {
        if(isValidate){
            this.#hideErrorMessage();
        }else{
            const label = this.#label.toLowerCase();
            this.#setErrorMessage(rule.getMessage(label));
            this.#showErrorMessage();
        }
    }

    /**
     * @param {Number} index
     * @returns {boolean}
     */
    #isRuleRemain(index) {
        const max = this.#ruleList.length;
        return index < max;
    }

    /**
     * @param {Error} e
     * @param {Object} rule
     */
    #LogValidateRulesError(e, rule) {
        console.group('Error Occurred in target.#validateRules().');
        console.error('Executed Rule Information - ',rule);
        console.error(e);
        console.groupEnd();
    }

    /**
     * @param {Object[]} ruleList
     * @param {Number} index
     *
     * @returns {Promise<boolean>}
     */
    async #validateRules(ruleList, index){
        const rule = ruleList[index];
        let isValidated = false;

        const ruleValidatePromise = new Promise((resolve) => {
            const isRuleValidated = rule.validate(this.getValue());
            resolve(isRuleValidated);
        });

        try {
            isValidated = await ruleValidatePromise;

            index++;

            if(isValidated && this.#isRuleRemain(index)){
                this.#hideErrorMessage();
                isValidated = await this.#validateRules(ruleList, index);
            } else {
                this.#handleErrorMessage(isValidated, rule);
            }
        } catch (e) {
            isValidated = false;
            this.#LogValidateRulesError(e, rule);
        }

        return isValidated;
    }

    /**
     * @returns {Promise<boolean>}
     */
    async validate() {
        let index = 0;
        let isValidate = true;

        if( this.#ruleList.length > 0 && this.#checkValidation){
            isValidate = await this.#validateRules(this.#ruleList, index);
        }

        return isValidate;
    }

    disableCheckingValidation() {
        this.#checkValidation = false;
    }

    enableCheckingValidation() {
        this.#checkValidation = true;
    }

    hideErrorMessage() {
        this.#hideErrorMessage();
    }
}

export class PositiveValidator{
    /** @property {HTMLElement} #scope */
    #scope;
    /** @property {Target[]} #targetList */
    #targetList = [];

    /**
     * @param {string} parentID
     */
    constructor(parentID) {
        this.#scope = document.getElementById(parentID);
    }

    /**
     * @param {string} elementID
     * @returns {Target|null}
     */
    setElement(elementID) {
        let target = null;

        if(this.#isTargetNotExist(elementID)){
            target = this.#getNewTargetByElementId(elementID);
        }else{
            console.error('Target already exist. Use getElement method.')
        }

        return target;
    }

    /**
     * @param {string} elementID
     * @returns {Target}
     */
    #getNewTargetByElementId(elementID) {
        const target = new Target(elementID, this.#scope);

        if(target){
            this.#targetList.push(target);
        }else{
            console.error('Can not find the validator element by element ID. Given ID is ' + elementID);
        }

        return target;
    }

    /**
     * @param {string} elementID
     * @returns {boolean}
     */
    #isTargetNotExist(elementID) {
        const existTarget = this.getElement(elementID);

        let isTargetExist = false;
        if(existTarget) {
            isTargetExist = true;
        }

        return !isTargetExist;
    }

    /**
     * @param {string} elementID
     * @returns {void}
     */
    deleteElement(elementID) {
        this.#targetList = this.#targetList.filter(function(target){
            let isDeletingTarget = false;
            if(target.getID() === elementID){
                isDeletingTarget = true;
                target.removeAllProperties();
            }
            return !isDeletingTarget;
        });
    }

    /**
     * @param elementID
     * @return Target|null
     */
    getElement(elementID){
        return this.#findTarget(elementID);
    }

    /**
     * @param {string} elementID
     * @return {Target|null}
     */
    #findTarget(elementID) {
        const max = this.#targetList.length;
        let resultTarget = null;
        for(let i = 0; i < max; i++){
            if(this.#targetList[i].getID() === elementID){
                resultTarget = this.#targetList[i];
                break;
            }
        }
        return resultTarget;
    }

    /**
     * @param {string} elementId
     */
    disableValidation(elementId){
        const target = this.#findTarget(elementId);
        if (target) {
            target.disableCheckingValidation();
        }
    }

    /**
     * @param {string} elementId
     */
    enableValidation(elementId){
        const target = this.#findTarget(elementId);
        if (target) {
            target.enableCheckingValidation();
        }
    }

    /**
     * @param {string} elementID
     * @returns {Promise<boolean>}
     */
    async validate(elementID) {
        const target = this.#findTarget(elementID);
        this.#validateTargetExist(target, elementID);
        return target.validate();
    }

    /**
     * @param {string} elementID
     */
    hideErrorMessage(elementID) {
        const target = this.#findTarget(elementID);
        this.#validateTargetExist(target, elementID);
        target.hideErrorMessage();
    }

    /**
     * @param {Target|null} target
     * @param {String} elementID
     */
    #validateTargetExist(target, elementID) {
        if(!target){
            throw Error('Can\'t find the element by ID. Your given ID is ' + elementID);
        }
    }

    #getTargetValidationPromiseList() {
        const promiseList = [];

        this.#targetList.map(function (target) {
            promiseList.push(target.validate());
        });

        return promiseList;
    }

    /**
     * @param {boolean[]} resultList
     * @returns {*}
     */
    #getPassedTargetList(resultList) {
        return resultList.filter(function (isValidated) {
            return isValidated;
        });
    }

    /**
     * @param {boolean[]} passedTargetResultList
     * @returns {boolean}
     */
    #isAllTargetPassed(passedTargetResultList) {
        return passedTargetResultList.length === this.#targetList.length;
    }

    /**
     * @returns {Promise<boolean>}
     */
    async validateAll() {
        return new Promise(async (resolve) => {
            const promiseList = this.#getTargetValidationPromiseList();
            const resultList = await Promise.all(promiseList);
            const passedTargetResultList = this.#getPassedTargetList(resultList);
            const result = this.#isAllTargetPassed(passedTargetResultList);
            resolve(result);
        });
    }

    /**
     * @returns {array}
     */
    getTargetStatus() {
        return this.#targetList.reduce((publicTargetList, target)=>{
            publicTargetList.push({id: target.getID(), label: target.getLabel(), result: target.validate()});
            return publicTargetList;
        }, []);
    }
}

