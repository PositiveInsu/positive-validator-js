import {PositiveValidator} from "../js/src/positive-validator/positive-validator.js";
import {JSDOM} from "jsdom";

describe('Positive Validator - Vanilla JavaScript Validator Test', function() {

    beforeEach(function() {
        const range = document.createRange();
        const documentFragment = range.createContextualFragment(`
            <div id="test-parent-dom">
                <div id="test-validation">
                    <label for="test-input">test input</label>
                    <input id="test-input" type="text" value="test value" class="target"/>
                    <p class="error-msg"></p>
                </div>
            </div>
        `);

        document.body.appendChild(documentFragment);
    });


    it('Can create the validator object with parent DOM', function() {
        const validator = new PositiveValidator('test-parent-dom');
        expect(true).toBe(true);
    });
});

