
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RadioButtonRN from 'radio-buttons-react-native';
import styles from '../StyleSheet'
class RadioButtonComponent extends React.Component {

	constructor(props) {
        super(props);

        this.state = {
			res: {},
			example: 1
		};
		this._renderRadioBtn = this._renderRadioBtn.bind(this);
	}

	_renderRadioBtn() {
		let { example } = this.state;
		if (example === 1) {
        this.props.sortByDate()
		}
		else if (example === 2) {
      this.props.sortByLikes()
		}
		else if (example === 3) {
      this.props.viewOpPosts()
		}
	}
	render() {
		let { example } = this.state;
		return (
			<View>

				<View style={{ margin: 10, flexDirection: 'row' }}>
					<TouchableOpacity
						activeOpacity={1}
						style={{ ...styles.openButton,  backgroundColor: example === 1 ? '#ccc' : '#fff' }}
						onPress={() => this.setState({ example: 1 })}
					>
						<Text>
            By Date
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={1}
						style={{ ...styles.openButton,  backgroundColor: example === 2 ? '#ccc' : '#fff' }}
						onPress={() => this.setState({ example: 2 })}
					>
						<Text>
            By Likes
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={1}
						style={{ ...styles.openButton,  backgroundColor: example === 3 ? '#ccc' : '#fff' }}
						onPress={() => this.setState({ example: 3 })}
					>
						<Text>
            View OP Post
						</Text>
					</TouchableOpacity>

				</View>


			</View>
		);
	}
};


export default RadioButtonComponent;
