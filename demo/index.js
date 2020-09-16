/* global document*/
import "pretty-json";

import "./dm-example.js";
import dataSchema from "./dm-example-schema";

//DOM
const dm = document.querySelector("dm-example");
const pj = document.querySelector("pretty-json");

document.addEventListener("click", (e) => {
	const isButton = e.target.nodeName === "BUTTON";
	const id = e.target.id;
	if (!isButton) return;

	dm.schema = dataSchema;
	dm.host = "https://jsonplaceholder.typicode.com/";

	if (id === "goodRequest") {
		dm.path = "/todos/1";
	}
	if (id === "badRequestBySchema") {
		dm.path = "/posts";
	}
	if (id === "badRequestBy404") {
		dm.path = "/wtf";
	}

	//Init
	dm.startOperation({});
});

dm.addEventListener("request-success", ({ detail }) => {
	pj.json = detail;
});

dm.addEventListener("request-error", ({ detail }) => {
	pj.json = detail;
});
