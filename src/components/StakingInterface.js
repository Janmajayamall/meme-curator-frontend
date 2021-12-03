import { useDisclosure } from "@chakra-ui/hooks";
import { useDispatch, useSelector } from "react-redux";
import {
	selectPostTradeModalState,
	selectOracleInfoObj,
	selectMarketsMetadata,
	sUpdatePostTradeModal,
	sUpdateOraclesInfoObj,
	sUpdateMarketsMetadata,
	selectGroupsFollowed,
	selectRinkebyLatestBlockNumber,
	selectUserProfile,
} from "../redux/reducers";
import {
	Button,
	Text,
	Flex,
	NumberInput,
	NumberInputField,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core/packages/core";
import { CloseIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import { useState } from "react";
import {
	useBuyMinTokensForExactCTokens,
	useQueryMarketByMarketIdentifier,
	useQueryMarketTradeAndStakeInfoByUser,
	useSellExactTokensForMinCTokens,
	useStakeForOutcome,
} from "../hooks";
import {
	convertBlocksToSeconds,
	convertDecimalStrToBigNumber,
	convertDecimalStrToInt,
	convertIntToDecimalStr,
	determineMarketState,
	filterMarketIdentifiersFromMarketsGraph,
	filterOracleIdsFromMarketsGraph,
	findModeratorsByIdArr,
	findPostsByMarketIdentifierArr,
	formatBNToDecimal,
	getAmountCBySellTokenAmount,
	getAmountCToBuyTokens,
	getAvgPrice,
	getAvgPriceOfOutcomeToken,
	getFavoredOutcomeName,
	getMarketStageName,
	getMarketStateDetails,
	getTempOutcomeInChallengePeriod,
	getTokenAmountToBuyWithAmountC,
	parseDecimalToBN,
	populateMarketWithMetadata,
	roundValueTwoDP,
	TWO_BN,
	useBNInput,
	outcomeDisplayName,
	formatTimeInSeconds,
	determineOutcome,
	getWinningsArr,
	getTradeWinningsArr,
	getStakeWinArr,
	ONE_BN,
	determineOutcomeInExpiry,
} from "../utils";
import PostDisplay from "../components/PostDisplay";
import TwoColTitleInfo from "../components/TwoColTitleInfo";
import { useParams } from "react-router";

import { BigNumber, ethers, utils } from "ethers";
import TradingInput from "./TradingInput";
import TradePriceBoxes from "./TradePriceBoxes";
import ChallengeHistoryTable from "./ChallengeHistoryTable";

function StakingInterface({ market, stakeHistories }) {
	const { account } = useEthers();
	const userProfile = useSelector(selectUserProfile);
	const isAuthenticated = account && userProfile;

	const { state, send } = useStakeForOutcome();

	const { input, bnValue, setInput, err } = useBNInput();
	const [tempOutcome, setTempOutcome] = useState(0);
	const [favoredOutcome, setFavoredOutcome] = useState();

	function setInputToMinStakeReq() {
		setInput(
			ethers.utils.formatUnits(
				market.lastAmountStaked.isZero()
					? ONE_BN
					: market.lastAmountStaked.mul(TWO_BN),
				18
			)
		);
	}

	useEffect(() => {
		if (!market) {
			return;
		}
		setInputToMinStakeReq();

		let _tempOutcome = determineOutcomeInExpiry(market);
		setTempOutcome(_tempOutcome);
		setFavoredOutcome(_tempOutcome == 2 ? 2 : 1 - _tempOutcome);
	}, []);

	return (
		<Flex flexDirection="column">
			<TwoColTitleInfo
				title={"Temp outcome"}
				info={`${outcomeDisplayName(tempOutcome)}`}
			/>
			<TwoColTitleInfo
				title={"Time left to challenge"}
				info={`${formatTimeInSeconds(
					convertBlocksToSeconds(market.optimisticState.blocksLeft)
				)}`}
			/>
			<TwoColTitleInfo
				title={"Challenges left"}
				info={`${
					market.donEscalationLimit - market.donEscalationCount
				}`}
			/>
			<TwoColTitleInfo
				title={"Min amount to challenge"}
				info={`${formatBNToDecimal(
					parseDecimalToBN(market.lastAmountStaked).mul(TWO_BN)
				)}`}
			/>
			<Text marginTop={5}>Challenge temp outcome</Text>

			<TwoColTitleInfo
				title={"Your chosen outcome"}
				info={`${outcomeDisplayName(favoredOutcome)}`}
			/>
			<NumberInput
				onChange={(val) => {
					setInput(val);
				}}
				placeholder="Amount"
				value={input}
			>
				<NumberInputField />
			</NumberInput>
			<Button
				disabled={!isAuthenticated}
				onClick={() => {
					if (!isAuthenticated) {
						return;
					}

					// TODO validation checks

					// favored outcome can't be 2
					if (favoredOutcome == 2) {
						return;
					}

					send(
						favoredOutcome,
						bnValue,
						market.oracle.id,
						market.marketIdentifier
					);
				}}
			>
				<Text color="white" fontSize="md" fontWeight="medium" mr="2">
					Challenge
				</Text>
			</Button>

			<ChallengeHistoryTable stakeHistories={stakeHistories} />
		</Flex>
	);
}

export default StakingInterface;
