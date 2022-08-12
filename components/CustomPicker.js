import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

export default class CustomPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animal: '',
    };
  }

  render() {
    let animals = [
      {
        key: '111',
        value: 'Kangaroo',
      },
      {
        key: '222',
        value: 'Koala',
      },
      {
        key: '333',
        value: 'Quokka',
      },
      {
        key: '444',
        value: 'Wombat',
      },
    ];

    return (
      <View>
        <Picker
          style={styles.picker}
          mode={'dropdown'}
          prompt={'Animal'} // dialog
          selectedValue={this.state.animal}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({animal: itemValue})
          }>
          {animals.map((item, index) => {
            return <Picker.Item label={item.value} value={item.key} />;
          })}
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  picker: {
    color: 'maroon',
    margin: 10,
  },
});
