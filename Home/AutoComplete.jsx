import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Autocomplete from 'react-native-autocomplete-input'


export default class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      data: ['hello', 'shalom', 'yesssss']
    }
  }


  render() {
    const { query } = this.state;
    const { data } = this.state;
    return (
      <View>
        <View style={styles.autocompleteContainer}>
        <Text> Auto Serch  </Text>
        <Autocomplete
          data={data}
          value={query}
          onChangeText={(text) => this.setState({ query: text })}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                this.setState({item:item});
              }}>
            </TouchableOpacity>
          )}
           />
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  }
});
