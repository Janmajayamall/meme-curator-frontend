import "./App.css";
import ConnectButton from "./components/ConnectButton";
import LoginButton from "./components/LoginButton";
import { Button, Box, Text, Flex } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core/packages/core";
import { utils } from "ethers";
import { useCreateNewMarket } from "./hooks";

import Web3 from "web3";
import { useEffect } from "react";
import {
	newPost,
	keccak256,
	updateModerator,
	toCheckSumAddress,
} from "./utils";

const web3 = new Web3();

function App() {
	const { account, chainId } = useEthers();
	const { state, send } = useCreateNewMarket();

	const imageUrl = "12dddwijijwwai12121o";
	const moderatorAddress = "0x3A8ed689D382Fe98445bf73c087A2F6102B75ECe";

	useEffect(async () => {
		if (state.receipt) {
			console.log(state, "jiji");
			const txHash = state.receipt.transactionHash;
			await newPost(txHash, imageUrl);
		}
	}, [state]);

	async function trial() {
		const signature =
			"0xd63257c295c23cd9c2fa54f6f860391115ee46a60e91a23fc29e7f671f77a7b40726dc2d7903974343cc6026f98196fa112404d3463d0d98d0ae20a7d3b3468b1b";

		const address = web3.eth.accounts.recover(
			JSON.stringify({
				hotAddress: "0xdcC73E699F5A910AE90947a76f75e0C2732aff40",
				accountNonce: 1,
			}),
			signature
		);
		console.log(address);
	}

	async function trial2() {
		await newPost(
			"0xfe24612d943c9c92f4f111bfea62a73fdb02fdb1d398f8ead024f5c4af0140d1",
			imageUrl
		);
	}

	async function trial3() {
		await updateModerator(toCheckSumAddress(moderatorAddress), {
			name: "User 1",
		});
	}

	return (
		<div>
			<ConnectButton />
			<LoginButton />
			<div>{state.status}</div>
			<Button
				onClick={async () => {
					trial3();
					return;

					try {
						console.log("identifier - ", keccak256(imageUrl));
						send(
							account,
							moderatorAddress,
							keccak256(imageUrl),
							utils.parseEther("1"),
							utils.parseEther("1"),
							1
						);

						// console.log(r, "kkik");
					} catch (e) {
						console.log(e);
					}
				}}
				bg="gray.800"
				border="1px solid transparent"
				_hover={{
					border: "1px",
					borderStyle: "solid",
					borderColor: "blue.400",
					backgroundColor: "gray.700",
				}}
				borderRadius="xl"
				m="1px"
				px={3}
				height="38px"
			>
				<Text color="white" fontSize="md" fontWeight="medium" mr="2">
					Send
				</Text>
			</Button>
		</div>
	);
}

export default App;
