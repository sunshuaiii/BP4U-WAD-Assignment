import React, {Component} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  FlatList,
  View,
  Switch,
  Button,
  TouchableNativeFeedback,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import SearchBar from 'react-native-dynamic-search-bar';
import {InputWithLabel, PickerWithLabel, AppButton} from '../UI';
import {ScrollViewHistory} from '../components/ScrollViewHistory.js';

let config = require('../Config');
let logo = require('../assets/icons/BP4U.png');

export default class HistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderHistory: [],
      memberDetails: [],
      memberID: '10001',
      searchText: '',
      isFetching: false,
    };
    this._loadOrderHistory = this._loadOrderHistory.bind(this);
  }

  handleOnChangeText = text => {
    this.setState({
      searchText: text,
      spinnerVisibility: true,
    });

    this.setState({
      spinnerVisibility: false,
    });
  };

  _loadOrderHistory() {
    let url =
      config.settings.serverPath + '/api/order-details/' + this.state.memberID;
    this.setState({isFetching: true});
    fetch(url)
      .then(response => {
        console.log(response);
        if (!response.ok) {
          Alert.alert('Error: ', repsonse.status.toString());
          throw Error('Error' + response.status);
        }
        this.setState({isFetching: false});
        return response.json();
      })
      .then(orderHistory => {
        console.log(orderHistory);
        this.setState({orderHistory: orderHistory});
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this._loadOrderHistory();
  }

  render() {
    const {spinnerVisibility} = this.state;

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} />
          {/* <SearchBar
            height={50}
            fontSize={20}
            fontColor="#fdfdfd"
            iconColor="#fdfdfd"
            shadowColor="#282828"
            cancelIconColor="#fdfdfd"
            spinnerVisibility={spinnerVisibility}
            placeholder="Search by Order ID"
            onChangeText={this.handleOnChangeText}
            keyboardType= {'numeric'}
            onSearchPress={() => {
              this.props.navigation.navigate('Search', {
                searchKeyword: this.state.searchText,
              });
            }}
          /> */}
        </View>
        <ScrollView style={styles.content}>
          {/* Order History */}
          <Text style={styles.title}>Order History</Text>
          <ScrollViewHistory
            isFetching={this.state.isFetching}
            loadOrderHistory={this._loadOrderHistory}
            orderHistory={this.state.orderHistory}
            navigation={this.props.navigation}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightpink',
    paddingBottom: '5%',
    marginBottom: '5%',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 18,
  },
  container: {
    backgroundColor: 'lightpink',
    paddingBottom: '15%',
    marginBottom: '15%',
  },
  logo: {
    width: 65,
    height: 65,
    padding: 5,
    margin: 20,
  },
  title: {
    width: '100%',
    marginTop: 20,
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: '10%',
  },
  productsListContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'mistyrose',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    marginVertical: 20,
  },
  thumb: {
    height: 360,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
  },
  discountedPrice: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  attribute: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
});
