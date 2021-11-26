import { toCheckSumAddress } from "./auth";
import Web3 from "web3";
import { BigNumber, ethers, utils } from "ethers";
import { useState } from "react";
import { useEffect } from "react";
const ZERO_BN = BigNumber.from("0");
const ONE_BN = BigNumber.from("1");
const TWO_BN = BigNumber.from("2");
const FOUR_BN = BigNumber.from("4");

const web3 = new Web3();
/**
 * Filters oracle ids from market schema returns by Graph index
 * @note Oracle ids are oracle addresses, thus the value returned
 * is checksummed
 */
export function filterOraclesFromMarketsGraph(markets) {
	const oracleIds = [];
	markets.forEach((market) => {
		if (market.oracle && market.oracle.id) {
			oracleIds.push(toCheckSumAddress(market.oracle.id));
		}
	});
	return oracleIds;
}

export function filterMarketIdentifiersFromMarketsGraph(markets) {
	const identifiers = [];
	markets.forEach((market) => {
		if (market.marketIdentifier) {
			identifiers.push(market.marketIdentifier);
		}
	});
	return identifiers;
}

export function populateMarketWithMetadata(
	market,
	oraclesInfo,
	marketsMetadata,
	groupsFollowed
) {
	return {
		...market,
		oracleInfo: oraclesInfo[toCheckSumAddress(market.oracle.id)],
		imageUrl: marketsMetadata[market.marketIdentifier]
			? marketsMetadata[market.marketIdentifier].eventIdentifierStr
			: undefined,
		follow: groupsFollowed[toCheckSumAddress(market.oracle.id)]
			? toCheckSumAddress(market.oracle.id)
			: false,
	};
}

export function roundValueTwoDP(value) {
	let _value = value;
	try {
		if (typeof _value == "string") {
			_value = Number(_value);
		}
	} catch (e) {
		return 0;
	}

	// TODO finish this
	return _value.toFixed(2);
}

export function numStrFormatter(value, digits = 1) {
	let _value = value;
	try {
		if (typeof _value == "string") {
			_value = Number(_value);
		}
	} catch (e) {
		return 0;
	}

	if (_value > 1000000) {
		_value = (_value / 1000000).toFixed(digits) + "M";
	} else if (_value > 1000) {
		_value = (_value / 1000).toFixed(digits) + "K";
	} else {
		_value = String(_value);
	}
	return _value;
}

export function parseDecimalToBN(val, base = 18) {
	return ethers.utils.parseUnits(val, base);
}

export function formatBNToDecimal(val, base = 18, dp = 2) {
	val = ethers.utils.formatUnits(val, base);
	return parseFloat(val).toFixed(2);
}

export function convertBigNumberToDecimalStr(value, base = 18) {}

export function isValidTradeEq(r0, r1, a0, a1, a, isBuy) {
	if (typeof isBuy !== "boolean") {
		return false;
	}

	if (
		!BigNumber.isBigNumber(r0) ||
		!BigNumber.isBigNumber(r1) ||
		!BigNumber.isBigNumber(a) ||
		!BigNumber.isBigNumber(a0) ||
		!BigNumber.isBigNumber(a1)
	) {
		return false;
	}

	if (
		isBuy &&
		r0.add(a).sub(a0).gte(ZERO_BN) &&
		r1.add(a).sub(a1).gte(ZERO_BN)
	) {
		return true;
	} else if (
		!isBuy &&
		r0.add(a0).sub(a).gte(ZERO_BN) &&
		r1.add(a1).sub(a).gte(ZERO_BN)
	) {
		return true;
	}
	return false;
}

export function getTokenAmountToBuyWithAmountC(r0, r1, a, tokenIndex) {
	if (
		!BigNumber.isBigNumber(r0) ||
		!BigNumber.isBigNumber(r1) ||
		!BigNumber.isBigNumber(a)
	) {
		return { amount: 0, err: true };
	}

	if (tokenIndex > 1 || tokenIndex < 0) {
		return { amount: 0, err: true };
	}
	let tokenAmount = BigNumber.from(0);
	if (tokenIndex == 0) {
		tokenAmount = r0.add(a).sub(r0.mul(r1).div(r1.add(a)));
	} else {
		tokenAmount = r1.add(a).sub(r0.mul(r1).div(r0.add(a)));
	}
	tokenAmount = tokenAmount.sub(ONE_BN);
	return {
		amount: tokenAmount,
		err: false,
	};
}

/**
 * @ref https://github.com/Uniswap/sdk-core/blob/76b41d349ef7f9e0555383b1b11f95872e91e975/src/utils/sqrt.ts#L14
 */
export function sqrtBn(value) {
	if (!BigNumber.isBigNumber(value) || value.lte(ZERO_BN)) {
		return 0;
	}

	if (value.lte(BigNumber.from(Number.MAX_SAFE_INTEGER - 1))) {
		return BigNumber.from(Math.sqrt(Number(value.toString())));
	}

	let z;
	let x;
	z = value;
	x = value.div(TWO_BN).add(ONE_BN);
	while (x.lt(z)) {
		z = x;
		x = value.div(x).add(x).div(TWO_BN);
	}
	return z;
}

export function getAmountCBySellTokenAmount(r0, r1, tA, tokenIndex) {
	if (tokenIndex > 1 || tokenIndex < 0) {
		return { amount: ZERO_BN, err: true };
	}

	if (
		!BigNumber.isBigNumber(r0) ||
		!BigNumber.isBigNumber(r1) ||
		!BigNumber.isBigNumber(tA)
	) {
		return { amount: ZERO_BN, err: true };
	}

	let a0 = tokenIndex == 0 ? tA : ZERO_BN;
	let a1 = tokenIndex == 1 ? tA : ZERO_BN;

	let b = r0.add(a0).add(r1).add(a1);
	let c = r0.mul(a1).add(a1.mul(a0)).add(r1.mul(a0));
	let root = sqrtBn(b.pow(TWO_BN).sub(c.mul(FOUR_BN)));

	let a = b.add(root).div(TWO_BN);
	if (isValidTradeEq(r0, r1, a0, a1, a, false)) {
		return {
			amount: a.sub(ONE_BN),
			err: false,
		};
	}

	a = b.sub(root).div(TWO_BN);
	if (isValidTradeEq(r0, r1, a0, a1, a, false)) {
		return {
			amount: a.sub(ONE_BN),
			err: false,
		};
	}
	return {
		amount: ZERO_BN,
		err: true,
	};
}

export function getAmountCToBuyTokens(r0, r1, a0, a1) {
	let b = r0 + r1 - (a0 + a1);
	let c = a0 * a1 - r0 * a1 - r1 * a0;

	let root = b ** 2 - 4 * c;

	if (root < 0) {
		return { amount: 0, err: true };
	}
	root = Math.sqrt(root);

	let a = (-1 * b + root) / 2;

	if (isValidTradeEq(r0, r1, a0, a1, a, true)) {
		return { amount: a + 1, err: false };
	}

	a = (-1 * b - root) / 2;

	if (isValidTradeEq(r0, r1, a0, a1, a, true)) {
		return { amount: a + 1, err: false };
	}

	return 0, true;
}

export function getAvgPrice(amountIn, amountOut) {
	if (!BigNumber.isBigNumber(amountIn) || !BigNumber.isBigNumber(amountOut)) {
		return "0.00";
	}
	if (amountIn.isZero() || amountOut.isZero()) {
		return "0.00";
	}
	let val = amountIn.mul(BigNumber.from("1000")).div(amountOut).toString();
	if (val.length <= 3) {
		return "0." + val;
	}
	return val.slice(0, val.length - 3) + "." + val.slice(val.length - 3);
}

export function getAvgPriceOfAmountC(tokenAmountIn, AmountCOut) {
	return AmountCOut / tokenAmountIn;
}

export function convertDecimalStrToInt(value, base = 10 ** 18) {
	return parseFloat(value) * base;
}

export function convertIntToDecimalStr(value, base = 10 ** 18) {
	return `${value / 10 ** 18}`;
}

export function useBNInput() {
	const [input, setInput] = useState("0");
	const [bnValue, setBnValue] = useState(BigNumber.from("0"));
	const [err, setErr] = useState(false);

	useEffect(() => {
		try {
			let bn = parseDecimalToBN(`${input == "" ? "0" : input}`);
			setBnValue(bn);
			setErr(false);
		} catch (e) {
			// TODO set invalid input error
			setErr(true);
		}
	}, [input]);

	return {
		input,
		bnValue,
		setInput,
		err,
	};
}
