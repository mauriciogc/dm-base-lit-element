# \<dm-base-lit-element>

## Installation

```bash
npm i
```

```bash
yarn install
```

## Demo

```bash
npm start
```

```bash
yarn start
```

Runs the app in the development mode.
Open http://localhost:8001/demo/ to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

## Usage

### Create data manager component:

```javascript
//dm-example.js
import "dm-base-lit-element/dm-base-lit-element.js";

const tagName = "dm-example";
export class DmExample extends DmBaseLitElement {
	static get properties() {
		return {
			host: { type: String },
			schema: { type: Object },
			path: { type: String },
		};
	}
	//Init request
	startOperation(params = {}) {
		const objParams = {
			host: this.host,
			path: this.path,
			params,
		};
		this.executeOperation(objParams);
	}
	//Data Structure
	_setStructure(data) {
		const { title, userId } = data;
		return { title, userId };
	}
}

window.customElements.define(tagName, DmExample);
```

### Create schema file

```javascript
//dm-example-schema.js
const dataSchema = (() => {
	const mapping = {...}; //Validate output data
	const response = {...}; //Validate data response
	const params = {...}; //Validate data request
	return { mapping, response, params, };
})();

export default dataSchema;
```

### Import tv4 and component

```html
<script src="../node_modules/tv4/tv4.js"></script>
<dm-example></dm-example>

<script type="module">
	import "./dm-example.js";
	import dataSchema from "./dm-example-schema";

	/** Watch the demo for more examples **/
	const dm = document.querySelector("dm-example");
	dm.host = "...";
	dm.path = "...";
	dm.schema = dataSchema;
	dm.startOperation({});

	dm.addEventListener("request-success", ({ detail }) => {
		console.log(detail);
	});

	dm.addEventListener("request-error", ({ detail }) => {
		console.log(detail);
	});
</script>
```

## Testing with Karma

To run the suite of karma tests, run

```bash
npm run test
```

```bash
yarn test
```

To run the tests in watch mode (for <abbr title="test driven development">TDD</abbr>, for example), run

```bash
npm run test:watch
```

```bash
yarn test:watch
```

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.
If you customize the configuration a lot, you can consider moving them to individual files.

## Tips

Does not work "husky"? test...

```bash
rm -rf .git/hooks/
rm -rf node_modules
yarn
```
