import {StyleSheet, Text, View, Button, TextInput, SafeAreaView} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as web3 from '@solana/web3.js';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const { Magic } = require('@magic-sdk/react-native');
const { SolanaExtension } = require('@magic-ext/solana');
const rpcUrl = "https://api.devnet.solana.com";
const connection = new web3.Connection(rpcUrl);

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './login.js';
import { wallet } from './login.js';

import { magic } from './magic.js';

var m = magic;

const styles = StyleSheet.create({
    appContainer: {
        height: "100%",
        justifyContent: 'center'
    },
    view: {
    },
    input: {
        height: 60,
        width: 300,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'red',
        paddingLeft: 10,
        borderRadius: 10
    },
    button: {
        marginTop: 100,
        marginBottom: 300
    }
})

export default function App() {

    const [phoneNumber, setPhoneNumber] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [balance, setBalance] = useState(0);
    const [userMetadata, setUserMetadata] = useState({});
    const [disabled, setDisabled] = useState(false);
    const [destinationAddress, setDestinationAddress] = useState('');
    const [sendAmount, setSendAmount] = useState(0);
    const [sendingTransaction, setSendingTransaction] = useState(false);
    const [txHash, setTxHash] = useState("");

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


    const onClick = async () => {
        console.log(phoneNumber);
        magic.auth.loginWithSMS({ phoneNumber: phoneNumber })
    };

    const logout = async () => {
        await m.user.logout();
        console.log(await m.user.isLoggedIn());
    }

    const getMeta = async () => {
        const meta = await m.user.getMetadata()
        setUserMetadata(meta)
        console.log(meta.publicAddress);
        return meta.publicAddress;
    }

    const getBalance = async (pubKey) => {
        connection.getBalance(pubKey).then((bal) => setBalance(bal / 1000000000));
        console.log(balance)
    };

    const printBalance = async () => {
        m.user.getMetadata().then((user) => {
            setUserMetadata(user);
            const pubKey = new web3.PublicKey(user.publicAddress);
            getBalance(pubKey);
        });
    }

    const airdrop = async () => {
        console.log('initializng airdrop');
        setDisabled(true);
        const pubKey = new web3.PublicKey(userMetadata.publicAddress);
        const airdropSignature = await connection.requestAirdrop(
                pubKey,
                web3.LAMPORTS_PER_SOL
                );

        await connection.confirmTransaction(airdropSignature);
        getBalance(pubKey);
        setDisabled(false);
        console.log('airdrop complete');
    }

    const handleSendTransaction = async () => {
        console.log(destinationAddress)
        console.log(sendAmount)
        setSendingTransaction(true);
        const recipientPubKey = new web3.PublicKey(destinationAddress);
        m.user.getMetadata().then((user) => {
            setUserMetadata(user);
            console.log('metadata set')
            console.log(userMetadata.publicAddress)
        });
        const payer = new web3.PublicKey(userMetadata.publicAddress);

        console.log(payer)

        const hash = await connection.getRecentBlockhash();

        let transactionMagic = new web3.Transaction({
            feePayer: payer,
            recentBlockhash: hash.blockhash
        });

        console.log('here')

        const transaction = web3.SystemProgram.transfer({
            fromPubkey: payer,
            toPubkey: recipientPubKey,
            lamports: sendAmount
        });

        transactionMagic.add(...[transaction]);

        const serializeConfig = {
            requireAllSignatures: false,
            verifySignatures: true
        };

        const signedTransaction = await m.solana.signTransaction(
                transactionMagic,
                serializeConfig
                );

        console.log("Signed transaction", signedTransaction);

        const tx = web3.Transaction.from(signedTransaction.rawTransaction);
        const signature = await connection.sendRawTransaction(tx.serialize());
        setTxHash('https://explorer.solana.com/tx/' + signature + '?cluster=devnet');
        setSendingTransaction(false);
        console.log(signature);
        console.log(txHash);
    };

    const Stack = createNativeStackNavigator();

    const HomeScreen = ({ navigation }) => {
        if (isLoggedIn) {
            return (
                    <Stack.Screen name="Profile" component={ProfileScreen} />
            );
        }
        return (
                <SafeAreaView style={styles.appContainer}>

                <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} />
                <Button style={styles.button} onPress={onClick} title="Submit" />
                <Button
                    title="Go to Jane's profile"
                    onPress={() =>
                    navigation.navigate('Profile', { name: 'Jane' })
                }
                />
                </SafeAreaView>
                );
    };
    const ProfileScreen = ({ navigation, route }) => {
        //        return <Text>This is {route.params.name}'s profile</Text>;
        return (
                <SafeAreaView style={styles.appContainer}>
                    {/* Remember to render the `Relayer` component into your app! */}
                    <Button onPress={logout} title="Logout" />
                    <Button onPress={getMeta} title="Get Public Address" />
                    <Button onPress={printBalance} title="Get Balance" />
                    <Button onPress={airdrop} title="Get Solana" />
                    <TextInput style={styles.input}
                        type="text"
                        name="destination"
                        className="full-width"
                        required="required"
                        placeholder="Destination address"
                        value={destinationAddress}
                        onChangeText={setDestinationAddress}
                    />
                    <TextInput style={styles.input}
                        keyboardType='numeric'
                        name="amount"
                        className="full-width"
                        required="required"
                        placeholder="Amount in LAMPORTS"
                        value={sendAmount}
                        onChangeText={setSendAmount}
                    />
                    <Button onPress={handleSendTransaction} title= "Sign & Send Transaction" />
                </SafeAreaView>
                );
    };

//      Original Dev App return
//    return (
//            <NavigationContainer>
//                <m.Relayer />
//                <Stack.Navigator>
//                    <Stack.Screen
//                        name="Home"
//                        component={HomeScreen}
//                        options={{ title: 'Welcome' }}
//                    />
//                    <Stack.Screen name="Profile" component={ProfileScreen} />
//                </Stack.Navigator>
//            </NavigationContainer>
//            );

	// Conditional Rendering
	const LoginFilter = () => {
		if (isLoggedIn) {
			console.log("here")
			return <ProfileScreen />
//			return <Stack.Screen name={"Profile"} component={ProfileScreen}/>
		}
		console.log("there")
		return <LoginScreen />
	}


    // App return with imported view from other js files
    return (
			<SafeAreaView style={styles.appContainer}>
				<LoginFilter />
			</SafeAreaView>
            );

}