//#region src/internal/string-validators.ts
const required = (value) => value.trim().length > 0 ? ok : fail("value is required");
const minLength = (n) => (value) => value.length >= n ? ok : fail(`must be at least ${n} characters`);
const maxLength = (n) => (value) => value.length <= n ? ok : fail(`must be at least ${n} characters`);
//#endregion
//#region src/internal/validators.ts
const ok = { valid: true };
const fail = (message) => ({
	valid: false,
	message
});
/**
* This is a way to compose n number of validator functions into one validator
* @param validators 
* @returns ValidationResult
*/
const compose = (...validators) => (value) => {
	for (const v of validators) {
		const result = v(value);
		if (!result.valid) return result;
	}
	return ok;
};
const exactLength = (n) => (value) => compose(minLength(n), maxLength(n))(value);
const min = (n) => (value) => value >= n ? ok : fail(`must be at least ${n}`);
const max = (n) => (value) => value <= n ? ok : fail(`must be at most ${n}`);
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const email = (value) => emailRegex.test(value) ? ok : fail("must be valid email address");
const url = (value) => {
	try {
		new URL(value);
		return ok;
	} catch {
		return fail("must be valid URL");
	}
};
//#endregion
//#region src/internal/advanced-validators.ts
const isValidCreditCard = (number) => {
	const clean = number.replace(/\D/g, "");
	if (clean.length === 0) return {
		valid: false,
		message: "Must be a valid credit card number"
	};
	let sum = 0;
	let shouldDouble = false;
	for (let i = clean.length - 1; i >= 0; i--) {
		let digit = parseInt(clean.charAt(i), 10);
		if (shouldDouble) {
			digit *= 2;
			if (digit > 9) digit -= 9;
		}
		sum += digit;
		shouldDouble = !shouldDouble;
	}
	return sum % 10 === 0 ? { valid: true } : {
		valid: false,
		message: "Must be a valid credit card number"
	};
};
//#endregion
export { compose, email, exactLength, fail, isValidCreditCard, max, maxLength, min, minLength, ok, required, url };

//# sourceMappingURL=index.mjs.map