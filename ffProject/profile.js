import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

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