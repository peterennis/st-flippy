import { h } from "@stencil/core";
/**
 * two ways of defining flip behaviour:
 * - through native browser events for flip and flip-back (e.g. click, mouseenter, …)
 * - through isFlipped true|false
 *
 * only one of these can be used. `isFlipped` is prioritized if both were to be used.
 */
export class StFlippy {
    constructor() {
        this.events = { flipEvents: [], flipBackEvents: [] };
    }
    // private options = { duration: 400, timingFunction: 'ease-in' };
    componentWillLoad() {
        this.init();
    }
    /**
     * add options to the element (duration, timingfunction).
     */
    componentDidLoad() {
        const duration = this.flipDuration || 400;
        const timingFunction = this.flipTimingFunction || 'ease-in';
        ['front', 'back']
            .forEach(key => {
            const el = this.element.querySelector(`.st-flippy__${key}`);
            el['style'].transition = `all ${duration / 1000}s ${timingFunction}`;
        });
    }
    /**
     * handling the `is-flipped` attribute.
     * usually this is used together with modern frameworks.
     */
    componentWillUpdate() {
        if (this.isFlipped !== undefined) {
            this.flipState = this.isFlipped;
        }
    }
    init() {
        if (this.isFlipped !== undefined) {
            this.flipState = this.isFlipped;
        }
        else if (this.flipEvents !== undefined) {
            ['flipEvents', 'flipBackEvents'].forEach(key => {
                this.events[key] = (this[key]) ?
                    this[key].split(',') :
                    [];
            });
            // adding event listeners
            const allEvents = [...this.events.flipEvents, ...this.events.flipBackEvents];
            allEvents
                .filter((eventType, index) => allEvents.indexOf(eventType) === index)
                .forEach(eventType => this.element.addEventListener(eventType, (evt) => this.processFlip(evt)));
            this.flipState = false;
        }
    }
    processFlip(evt) {
        const eventType = evt.type;
        if (this.flipState && this.events.flipBackEvents.indexOf(eventType) !== -1) {
            this.flipState = !this.flipState;
        }
        else if (!this.flipState && this.events.flipEvents.indexOf(eventType) !== -1) {
            this.flipState = !this.flipState;
        }
    }
    render() {
        return (h("div", { class: `st-flippy ${(this.flipState ? 'st-flippy--flipped' : '')}` },
            h("div", { class: "st-flippy__front" },
                h("slot", { name: "front" })),
            h("div", { class: "st-flippy__back" },
                h("slot", { name: "back" }))));
    }
    static get is() { return "st-flippy"; }
    static get originalStyleUrls() { return {
        "$": ["st-flippy.css"]
    }; }
    static get styleUrls() { return {
        "$": ["st-flippy.css"]
    }; }
    static get properties() { return {
        "flipEvents": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "flip-events",
            "reflect": false
        },
        "flipBackEvents": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "flip-back-events",
            "reflect": false
        },
        "flipDuration": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "flip-duration",
            "reflect": false
        },
        "flipTimingFunction": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "flip-timing-function",
            "reflect": false
        },
        "isFlipped": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "is-flipped",
            "reflect": false
        }
    }; }
    static get states() { return {
        "flipState": {}
    }; }
    static get elementRef() { return "element"; }
}
