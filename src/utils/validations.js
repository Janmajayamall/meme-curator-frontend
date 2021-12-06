import { MAX_LENGTH_DESCRIPTION, MAX_LENGTH_NAME } from ".";

export function validateIsNumber(val) {
	try {
		let value = Number(val);
		return {
			valid: true,
			expText: "",
		};
	} catch (e) {
		return {
			valid: false,
			expText: "Invalid value!",
		};
	}
}

export function validateEscalationLimit(val) {
	let isNum = validateIsNumber(val);
	if (!isNum.valid) {
		return isNum;
	}
	if (val < 1) {
		return {
			valid: false,
			expText: "We recommend Escalation limit to be at least 1",
		};
	}
	return {
		valid: true,
		expText: "",
	};
}

export function validateExpireHours(val) {
	let isNum = validateIsNumber(val);
	if (!isNum.valid) {
		return isNum;
	}
	if (val < 1) {
		return {
			valid: false,
			expText: "We recommend Trading period to be at least 1",
		};
	}
	return {
		valid: true,
		expText: "",
	};
}

export function validateBufferHours(val) {
	let isNum = validateIsNumber(val);
	if (!isNum.valid) {
		return isNum;
	}
	if (val < 1) {
		return {
			valid: false,
			expText: "We recommend Challenge period to be at least 1",
		};
	}
	return {
		valid: true,
		expText: "",
	};
}

export function validateResolutionHours(val) {
	let isNum = validateIsNumber(val);
	if (!isNum.valid) {
		return isNum;
	}
	if (val < 1) {
		return {
			valid: false,
			expText: "We recommend Resolution period to be at least 1",
		};
	}
	return {
		valid: true,
		expText: "",
	};
}

export function validateFee(val) {
	let isNum = validateIsNumber(val);
	return isNum;
}

export function validateGroupName(val) {
	if (typeof val != "string") {
		return {
			valid: false,
			expText: "Invalid Input!",
		};
	}

	if (val.split(" ").length !== 1) {
		return {
			valid: false,
			expText: "Name cannot have spaces!",
		};
	}

	if (val.length > MAX_LENGTH_NAME) {
		return {
			valid: false,
			expText: `Char count should be smaller than ${MAX_LENGTH_NAME}`,
		};
	}

	return {
		valid: true,
		expTex: "",
	};
}

export function validateGroupDescription(val) {
	if (typeof val != "string") {
		return {
			valid: false,
			expText: "Invalid Input!",
		};
	}

	if (val.length > MAX_LENGTH_DESCRIPTION) {
		return {
			valid: false,
			expText: `Char count should be smaller than ${MAX_LENGTH_DESCRIPTION}`,
		};
	}

	return {
		valid: true,
		expText: "",
	};
}

export function validateUpdateMarketConfigTxInputs(
	fee,
	escalationLimit,
	expireHours,
	bufferHours,
	resolutionHours
) {
	if (
		validateFee(fee).valid &&
		validateEscalationLimit(escalationLimit).valid &&
		validateBufferHours(bufferHours).valid &&
		validateExpireHours(expireHours).valid &&
		validateResolutionHours(resolutionHours).valid
	) {
		return {
			valid: true,
			expText: "",
		};
	}
	return {
		valid: false,
		expText: "Invalid inputs!",
	};
}