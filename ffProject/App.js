import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
import React, { useState } from 'react';

const { Magic } = require('@magic-sdk/react-native');

const m = new Magic('pk_live_4A07772AF4011BB6');

const styles = StyleSheet.create({
    appContainer: {
        padding: 50,
    },
    view: {
        marginTop: 300,
        marginBottom: 300
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

    const onClick = async () => {
        console.log(phoneNumber);
        m.auth.loginWithSMS({ phoneNumber: phoneNumber })
    };

    const logout = async () => {
        await m.user.logout();
        console.log(await m.user.isLoggedIn());
    }

    const getMeta = async () => {
        const meta = await m.user.getMetadata()
        console.log(meta);
    };

    return (
            <View style={styles.appContainer}>
                {/* Remember to render the `Relayer` component into your app! */}
                <m.Relayer />
                <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} />
                <Button style={styles.button} onPress={onClick} title="Submit" />
                <Button onPress={logout} title="Logout" />
                <Button onPress={getMeta} title="Get Data" />
            </View>
            );
}
