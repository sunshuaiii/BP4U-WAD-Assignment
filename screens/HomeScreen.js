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

// creating the home screen with search function and view products by categories

import SearchBar from 'react-native-dynamic-search-bar';
import {InputWithLabel, PickerWithLabel, AppButton} from '../UI';
import {ScrollViewProduct} from '../components/ScrollViewProduct.js';

let config = require('../Config');
let logo = require('../assets/icons/BP4U.png');

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newreleasedProducts: [],
      onsalesProducts: [],
      albums: [],
      magazines: [],
      fashions: [],
      searchText: '',
      isFetching: false,
    };
    this._loadAllproducts = this._loadAllproducts.bind(this);
    this._loadNewReleasedProducts = this._loadNewReleasedProducts.bind(this);
    this._loadOnsalesProducts = this._loadOnsalesProducts.bind(this);
    this._loadAlbums = this._loadAlbums.bind(this);
    this._loadMagazines = this._loadMagazines.bind(this);
    this._loadFashions = this._loadFashions.bind(this);
  }

  handleOnChangeText = text => {
    // ? Visible the spinner
    this.setState({
      searchText: text,
      spinnerVisibility: true,
    });

    this.setState({
      spinnerVisibility: false,
    });
  };

  _loadAllproducts() {
    let url = config.settings.serverPath + '/api/product';
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
      .then(products => {
        console.log(products);
        this.setState({products: products});
      })
      .catch(error => {
        console.log(error);
      });
  }

  _loadNewReleasedProducts() {
    let url = config.settings.serverPath + '/api/product/new-released';
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
      .then(newreleasedProducts => {
        console.log(newreleasedProducts);
        this.setState({newreleasedProducts: newreleasedProducts});
      })
      .catch(error => {
        console.log(error);
      });
  }

  _loadOnsalesProducts() {
    let url = config.settings.serverPath + '/api/product/on-sales';
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
      .then(onsalesProducts => {
        console.log(onsalesProducts);
        this.setState({onsalesProducts: onsalesProducts});
      })
      .catch(error => {
        console.log(error);
      });
  }

  _loadAlbums() {
    let url = config.settings.serverPath + '/api/product/album';
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
      .then(albums => {
        console.log(albums);
        this.setState({albums: albums});
      })
      .catch(error => {
        console.log(error);
      });
  }

  _loadMagazines() {
    let url = config.settings.serverPath + '/api/product/magazine';
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
      .then(magazines => {
        console.log(magazines);
        this.setState({magazines: magazines});
      })
      .catch(error => {
        console.log(error);
      });
  }

  _loadFashions() {
    let url = config.settings.serverPath + '/api/product/fashion';
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
      .then(fashions => {
        console.log(fashions);
        this.setState({fashions: fashions});
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this._loadAllproducts();
    this._loadNewReleasedProducts();
    this._loadOnsalesProducts();
    this._loadAlbums();
    this._loadMagazines();
    this._loadFashions();
  }

  render() {
    const {spinnerVisibility} = this.state;

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} />
          <SearchBar
            height={50}
            fontSize={20}
            fontColor="#fdfdfd"
            iconColor="#fdfdfd"
            shadowColor="#282828"
            cancelIconColor="#fdfdfd"
            spinnerVisibility={spinnerVisibility}
            placeholder="Search by product name"
            onChangeText={this.handleOnChangeText}
          />
        </View>

        <ScrollView style={styles.content}>
          {/* New Released Category */}
          <Text style={styles.title}>New Released</Text>
          <ScrollViewProduct
            title="New Released"
            isFetching={this.state.isFetching}
            loadProducts={this._loadNewReleasedProducts}
            productData={this.state.newreleasedProducts}
            navigation={this.props.navigation}
          />

          {/* On Sales Category */}
          <Text style={styles.title}>On Sales</Text>
          <ScrollViewProduct
            title="New Released"
            isFetching={this.state.isFetching}
            loadProducts={this._loadOnsalesProducts}
            productData={this.state.onsalesProducts}
            navigation={this.props.navigation}
          />

          {/* Albums Category */}
          <Text style={styles.title}>Albums 4U</Text>
          <ScrollViewProduct
            title="New Released"
            isFetching={this.state.isFetching}
            loadProducts={this._loadAlbums}
            productData={this._loadAlbums}
            navigation={this.props.navigation}
          />

          {/* Magazines Category */}
          <Text style={styles.title}>Magazines 4U</Text>
          <ScrollViewProduct
            title="New Released"
            isFetching={this.state.isFetching}
            loadProducts={this._loadMagazines}
            productData={this.state.magazines}
            navigation={this.props.navigation}
          />
          
          {/* Fashions Category */}
          <Text style={styles.title}>Fashions 4U</Text>
          <ScrollViewProduct
            title="New Released"
            isFetching={this.state.isFetching}
            loadProducts={this._loadFashions}
            productData={this.state.fashions}
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
    borderRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 1,
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
