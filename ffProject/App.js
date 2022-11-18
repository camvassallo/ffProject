import {StyleSheet, Text, View, Button, TextInput} from 'react-native';


const { Magic } = require('@magic-sdk/react-native');

const magicClient = new Magic('pk_live_4A07772AF4011BB6'); // ✨

export default function App() {
	return (
		<View style={styles.appContainer}>
			<View style={styles.inputContainer}>
				<TextInput style={styles.textInput} placeholder="Your course goal!" />
				<Button title="Add Goal" />
			</View>
			<View>
				<Text>List of Goals</Text>
			</View>
			<View style={{padding: 50, flexDirection: "row", justifyContent: 'center', alignItems: 'space-around'}}>
				<View style={styles.redBox}><Text style={{align: 'left'}}>1</Text></View>
				<View style={styles.blueBox}><Text>2</Text></View>
				<View style={styles.greenBox}><Text>3</Text></View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	appContainer: {
		padding: 50,
	},
	inputContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	textInput: {
		borderWidth: 1,
		borderColor: '#cccccc',
		width: '80%',
		marginRight: 8,
		padding: 8,
	},
	redBox: {
		backgroundColor: 'red',
		width: 100,
		height: 100,
		justifyContent: 'center',
		alignItems: 'center',
	},
	blueBox: {
		backgroundColor: 'blue',
		width: 100,
		height: 100,
		justifyContent: 'center',
		alignItems: 'center',
	},
	greenBox: {
		backgroundColor: 'green',
		width: 100,
		height: 100,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
