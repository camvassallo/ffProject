const { Magic } = require('@magic-sdk/react-native');
const { SolanaExtension } = require('@magic-ext/solana');
import * as web3 from '@solana/web3.js';

const rpcUrl = "https://api.devnet.solana.com";
const connection = new web3.Connection(rpcUrl);

var magic = new Magic('pk_live_4A07772AF4011BB6', {
	extensions: [
		new SolanaExtension({
			rpcUrl
		}),
		],
});
export {magic, web3, connection};

export const checkUser = async () => {
	const isLoggedIn = await magic.user.isLoggedIn();
	if (isLoggedIn) {
		const user = await magic.user.getMetadata();
		console.log({ isLoggedIn: true, email: user.phoneNumber });
	}
	console.log({ isLoggedIn: false });
};