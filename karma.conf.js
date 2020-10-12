const { createDefaultConfig } = require("@open-wc/testing-karma");
const merge = require("deepmerge");

module.exports = (config) => {
	config.set(
		merge(createDefaultConfig(config), {
			files: [
				{
					pattern: config.grep ? config.grep : "test/**/*.test.js",
					type: "module",
				},
			],
			esm: { nodeResolve: true },
			coverageReporter: {
				check: {
					global: {
						statements: 100,
						lines: 100,
						functions: 100,
						branches: 100,
					},
				},
			},
		})
	);

	return config;
};
