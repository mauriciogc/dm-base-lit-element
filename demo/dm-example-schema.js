const dataSchema = (() => {
	const mapping = {
		$schema: "http://json-schema.org/draft-04/schema#",
		type: "object",
		properties: {
			title: {
				type: "string",
			},
			userId: {
				type: "integer",
			},
		},
		additionalProperties: false,
		required: ["title", "userId"],
	};
	const response = {
		$schema: "http://json-schema.org/draft-04/schema#",
		type: "object",
		properties: {
			completed: {
				type: "boolean",
			},
			id: {
				type: "integer",
			},
			title: {
				type: "string",
			},
			userId: {
				type: "integer",
			},
		},
		additionalProperties: false,
		required: ["completed", "id", "title", "userId"],
	};

	const error = {};
	const params = {
		$schema: "http://json-schema.org/draft-04/schema#",
		type: "object",
		properties: {
			host: {
				type: "string",
			},
			path: {
				type: "string",
			},
			method: {
				type: "string",
			},
			params: {
				type: "object",
				properties: {
					agileOperationType: {
						type: "string",
					},
				},
				additionalProperties: true,
			},
		},
		additionalProperties: false,
		required: ["host", "path", "params"],
	};
	return {
		mapping,
		response,
		error,
		params,
	};
})();

export default dataSchema;
