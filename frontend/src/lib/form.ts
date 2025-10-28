export type FormErrors = null | Record<string, string>;

export const getFormErrors = async (
	response: Response,
): Promise<FormErrors> => {
	if (response.status === 422) {
		const json = await response.json();
		// @ts-expect-error trust me
		return json.errors;
	}

	return null;
};
