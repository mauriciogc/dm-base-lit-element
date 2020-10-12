/* global window, CustomEvent */
import { LitElement, html } from "lit-element";

import "data-provider";
import { Validator } from "@cfworker/json-schema";

const tagName = "dm-base-lit-element";
export class DmBaseLitElement extends LitElement {
	static get properties() {
		return {
			loading: { type: Boolean, reflect: true },
			host: { type: String },
			schema: { type: Object },
			path: { type: String },
			method: { type: String },
			_dataUiEvent: { type: String },
			_dataErrorEvent: { type: String },
		};
	}
	constructor() {
		super();
		this.host = "";
		this.path = "";
		this.method = "GET";
		this._dataUiEvent = "request-success";
		this._dataErrorEvent = "request-error";
		this.loading = false;
	}
	executeOperation(objParams) {
		this.loading = true;
		return this._validateSchema(this.schema.params, objParams)
			.then(this._configDataProvider.bind(this))
			.then(this._validateSchema.bind(this, this.schema.response))
			.then((data) =>
				this._validateSchema(this.schema.mapping, this._setStructure(data))
			)
			.then(this._setDataUi.bind(this))
			.catch(this._errorHandler.bind(this));
	}
	_validateSchema(schema, data) {
		return new Promise((resolve, reject) => {
			const validator = new Validator(schema);
			const result = validator.validate(data);
			return result.errors.length ? reject(result.errors) : resolve(data);
		});
	}
	_configDataProvider(data) {
		const dp = this.shadowRoot.querySelector("data-provider");
		if (dp) {
			return dp.request(data);
		} else {
			throw {
				message: "data provider was not found",
				code: "404dp",
			};
		}
	}
	_setStructure(data) {
		return data;
	}
	_setDataUi(dataUI) {
		this.loading = false;
		this._eventDispatcher(this._dataUiEvent, dataUI);
	}
	_errorHandler(dataError) {
		this.loading = false;
		this._eventDispatcher(this._dataErrorEvent, dataError);
	}
	_eventDispatcher(type, data) {
		this.dispatchEvent(
			new CustomEvent(type, {
				detail: data,
				bubbles: false,
				composed: false,
			})
		);
	}
	render() {
		return html`<data-provider></data-provider>`;
	}
}

window.customElements.define(tagName, DmBaseLitElement);
