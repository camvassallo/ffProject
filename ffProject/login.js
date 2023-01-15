import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { magic, web3, connection } from './magic.js';

var wallet, loginStatus
export { wallet }

const LoginScreen = () => {
//	console.log(props.route.name)

    // Create Local User Variables
	const [phoneNumber, setPhoneNumber] = useState('')
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userMetadata, setUserMetadata] = useState({});
	const [balance, setBalance] = useState(0);

	// Authenticate Phone Number with Magic
	useEffect(() => {
		magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
			setIsLoggedIn(magicIsLoggedIn);
			loginStatus = magicIsLoggedIn;
			if (magicIsLoggedIn) {
				magic.user.getMetadata().then((user) => {
					setUserMetadata(user);
					const pubKey = new web3.PublicKey(user.publicAddress);
					getBalance(pubKey);
					console.log(user.publicAddress)
				});
			}
		});
		}, [isLoggedIn]);

	const login = async () => {
		await magic.auth.loginWithEmailOTP({ email: "cam.vassallo12@gmail.com" })
		setIsLoggedIn(true);
		loginStatus = true;
	};

	const getBalance = async (pubKey) => {
		connection.getBalance(pubKey).then((bal) => setBalance(bal / 1000000000));
	};

	const logout = async () => {
		await magic.user.logout();
		setIsLoggedIn(false);
		loginStatus = false;
		setUserMetadata(magic.user)
	};

    // Display Login Form
	return (
		<View style={styles.container}>
			<magic.Relayer />
			<TextInput
				style={styles.input}
				value={phoneNumber}
				onChangeText={setPhoneNumber}
				placeholder="Phone Number"
			/>
			<Button onPress={login} title="Login with Magic"/>
			<Button onPress={logout} title="Logout"/>
			<Text>{userMetadata.publicAddress}</Text>
			<Text>{balance}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});

export default LoginScreen;
