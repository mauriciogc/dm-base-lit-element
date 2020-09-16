/* global window*/
import { DmBaseLitElement } from "../dm-base-lit-element";

const tagName = "dm-example";
export class DmExample extends DmBaseLitElement {
	static get properties() {
		return {
			host: { type: String },
			schema: { type: Object },
			path: { type: String },
		};
	}
	startOperation(params = {}) {
		const objParams = {
			host: this.host,
			path: this.path,
			params,
		};
		this.executeOperation(objParams);
	}
	_setStructure(data) {
		const { title, userId } = data;
		return { title, userId };
	}
}

window.customElements.define(tagName, DmExample);
