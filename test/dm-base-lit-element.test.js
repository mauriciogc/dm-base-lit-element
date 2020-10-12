/* global describe, it*/
import { html, fixture, expect } from "@open-wc/testing";
import fetchMock from "fetch-mock/esm/client";

import "../dm-base-lit-element.js";
import dataSchema from "../demo/dm-example-schema";

describe("has properties and attributes and functions", () => {
	it("has a type properties", async () => {
		const el = await fixture(
			html` <dm-base-lit-element></dm-base-lit-element> `
		);

		expect(el.loading).to.be.a("boolean");
		expect(el.host).to.be.a("string");
		expect(el.schema).to.be.a("undefined");
		expect(el.path).to.be.an("string");
		expect(el.method).to.be.a("string");
		expect(el._dataUiEvent).to.be.a("string");
		expect(el._dataErrorEvent).to.be.a("string");

		expect(el.executeOperation).to.be.a("function");
		expect(el._validateSchema).to.be.a("function");
		expect(el._configDataProvider).to.be.a("function");
		expect(el._setStructure).to.be.a("function");
		expect(el._setDataUi).to.be.a("function");
		expect(el._errorHandler).to.be.a("function");
		expect(el._eventDispatcher).to.be.a("function");
	});

	it("has a default value properties", async () => {
		const el = await fixture(
			html` <dm-base-lit-element></dm-base-lit-element> `
		);

		expect(el.loading).to.be.false;
		expect(el.host).to.equal("");
		expect(el.schema).to.be.undefined;
		expect(el.path).to.equal("");
		expect(el.method).to.equal("GET");
		expect(el._dataUiEvent).to.have.equal("request-success");
		expect(el._dataErrorEvent).to.have.equal("request-error");
	});
});

describe("properties and attributes changed", () => {
	it("has changed properties at the beginning", async () => {
		const el = await fixture(html`
			<dm-base-lit-element
				?loading=${true}
				.host=${"http://example.com"}
				.path=${"/example"}
				.schema=${{}}
				.method=${"POST"}
				._dataUiEvent=${"success"}
				._dataErrorEvent=${"error"}
			></dm-base-lit-element>
		`);

		expect(el.loading).to.be.true;
		expect(el.host).to.equal("http://example.com");
		expect(el.path).to.equal("/example");
		expect(el.schema).to.be.empty;
		expect(el.method).to.equal("POST");
		expect(el._dataUiEvent).to.have.equal("success");
		expect(el._dataErrorEvent).to.have.equal("error");
	});
});

describe("all request ", () => {
	it("Request OK", async () => {
		const el = await fixture(
			html` <dm-base-lit-element></dm-base-lit-element> `
		);

		el.schema = dataSchema;
		el._setStructure = (data) => {
			const { title, userId } = data;
			return { title, userId };
		};

		el.addEventListener("request-success", ({ detail }) => {
			expect(detail.title).to.equal("delectus aut autem");
		});

		fetchMock.mock("begin:https://jsonplaceholder", {
			userId: 1,
			id: 1,
			title: "delectus aut autem",
			completed: false,
		});
		await el.executeOperation({
			host: "https://jsonplaceholder.typicode.com/",
			path: "/todos/1",
			method: "GET",
			params: {},
		});
		fetchMock.restore();
	});

	it("Remove data-provider", async () => {
		const el = await fixture(html`
			<dm-base-lit-element></dm-base-lit-element>
		`);

		const dp = el.shadowRoot.querySelector("data-provider");
		dp.parentNode.removeChild(dp);

		el.schema = dataSchema;

		el.addEventListener("request-error", ({ detail }) => {
			expect(detail.message).to.equal("data provider was not found");
		});

		await el.executeOperation({
			host: "https://jsonplaceholder.typicode.com/",
			path: "/todos/1",
			method: "GET",
			params: {},
		});
	});

	it("Fail Schema JSON init[Missing required property: params]", async () => {
		const el = await fixture(
			html` <dm-base-lit-element></dm-base-lit-element> `
		);

		el.schema = dataSchema;

		el.addEventListener("request-error", ({ detail }) => {
			expect(detail[0].error).to.equal(
				'Instance does not have required property "params".'
			);
		});

		await el.executeOperation({
			host: "https://jsonplaceholder.typicode.com/",
			path: "/todos/1",
			method: "GET",
			// params: {}
		});
	});

	it("Fail Schema request mock[Missing required property: completed]", async () => {
		const el = await fixture(
			html` <dm-base-lit-element></dm-base-lit-element> `
		);

		el.schema = dataSchema;

		el.addEventListener("request-error", ({ detail }) => {
			expect(detail[0].error).to.equal(
				'Instance does not have required property "completed".'
			);
		});

		fetchMock.mock("begin:https://jsonplaceholder", {
			userId: 1,
			id: 1,
			title: "delectus aut autem",
			//completed: false
		});

		await el.executeOperation({
			host: "https://jsonplaceholder.typicode.com/",
			path: "/todos/1",
			method: "GET",
			params: {},
		});
		fetchMock.restore();
	});

	it("Fail Schema back data [Additional properties not allowed]", async () => {
		const el = await fixture(
			html` <dm-base-lit-element></dm-base-lit-element> `
		);

		el.schema = dataSchema;

		el.addEventListener("request-error", ({ detail }) => {
			expect(detail[0].error).to.equal(
				'Property "id" does not match additional properties schema.'
			);
		});

		fetchMock.mock("begin:https://jsonplaceholder", {
			userId: 1,
			id: 1,
			title: "delectus aut autem",
			completed: false,
		});
		await el.executeOperation({
			host: "https://jsonplaceholder.typicode.com/",
			path: "/todos/1",
			method: "GET",
			params: {},
		});

		fetchMock.restore();
	});
});
