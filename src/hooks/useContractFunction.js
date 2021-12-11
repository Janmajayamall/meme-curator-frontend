import { addresses } from "../contracts";
import {
	useContractFunction,
	useSendTransaction,
} from "@usedapp/core/packages/core";
import {
	marketRouterContract,
	oracleFactoryContract,
	oracleContract,
	wEthContract,
} from "../utils";
import Web3 from "web3";

export function useCreateNewMarket() {
	const { state, send } = useContractFunction(
		marketRouterContract,
		"createFundBetOnMarket"
	);
	return { state, send };
}

export function useCreateNewOracle() {
	const { state, send } = useContractFunction(
		oracleFactoryContract,
		"createOracle"
	);
	return { state, send };
}

export function useBuyMinTokensForExactCTokens() {
	const { state, send } = useContractFunction(
		marketRouterContract,
		"buyMinTokensForExactCTokens"
	);
	return { state, send };
}

export function useSellExactTokensForMinCTokens() {
	const { state, send } = useContractFunction(
		marketRouterContract,
		"sellExactTokensForMinCTokens"
	);
	return { state, send };
}

export function useStakeForOutcome() {
	const { state, send } = useContractFunction(
		marketRouterContract,
		"stakeForOutcome"
	);
	return { state, send };
}

export function useRedeemWinning() {
	const { state, send } = useContractFunction(
		marketRouterContract,
		"redeemWinning"
	);
	return { state, send };
}

export function useRedeemWinningBothOutcomes() {
	const { state, send } = useContractFunction(
		marketRouterContract,
		"redeemWinningBothOutcomes"
	);
	return { state, send };
}

export function useRedeemMaxWinning() {
	const { state, send } = useContractFunction(
		marketRouterContract,
		"redeemMaxWinning"
	);
	return { state, send };
}

export function useRedeemMaxWinningAndStake() {
	const { state, send } = useContractFunction(
		marketRouterContract,
		"redeemMaxWinningAndStake"
	);
	return { state, send };
}

export function useRedeemStake(oracleAddress) {
	const { state, send } = useContractFunction(
		oracleAddress ? oracleContract(oracleAddress) : undefined,
		"redeemStake"
	);
	return {
		state,
		send,
	};
}

export function useERC1155SetApprovalForAll(oracleAddress) {
	const { state, send } = useContractFunction(
		oracleAddress ? oracleContract(oracleAddress) : undefined,
		"setApprovalForAll"
	);

	return {
		state,
		send,
	};
}

export function useSetOutcome(oracleAddress) {
	const { state, send } = useContractFunction(
		oracleAddress ? oracleContract(oracleAddress) : undefined,
		"setOutcome"
	);

	return {
		state,
		send,
	};
}

export function useUpdateMarketConfig(oracleAddress) {
	const { state, send } = useContractFunction(
		oracleAddress ? oracleContract(oracleAddress) : undefined,
		"updateMarketConfig"
	);

	return {
		state,
		send,
	};
}

export function useTokenApprove() {
	const { state, send } = useContractFunction(wEthContract, "approve");
	return {
		state,
		send,
	};
}

export function useDepositEthToWeth() {
	const { state, sendTransaction } = useSendTransaction({
		transactionName: "Deposit ETH",
	});
	return { state, sendTransaction };
}
