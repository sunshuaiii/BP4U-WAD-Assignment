import React, {Component} from 'react';
import {StyleSheet, ScrollView, FlatList, Text, TouchableOpacity, View, Image} from 'react-native';

const ScrollViewProduct = ({isFetching, loadProducts, productData, navigation}) => {
  return (
    <ScrollView>
      <FlatList
        style={styles.productsListContainer}
        refreshing={isFetching}
        onRefresh={loadProducts}
        data={productData}
        renderItem={({item, index}) => {
          if(item.discount == 0){
            return (
              <TouchableOpacity style={styles.card} onPress={() => {
                navigation.navigate('ProductDetails', {
                productId: item.id,
                });
              }}>
                <View style={styles.infoContainer}>
                <Image source={{uri: item.photo}} style={styles.thumb}/>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>RM {item.price}</Text>
              </View>
              </TouchableOpacity>
            );
          }else{
            return (
              <TouchableOpacity style={styles.card} onPress={() => {
                navigation.navigate('ProductDetails', {
                productId: item.id,
                });
              }}>
                <View style={styles.infoContainer}>
                <Image source={{uri: item.photo}} style={styles.thumb}/>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.discountedPrice}>RM {item.price}</Text>
                <Text style={styles.price}>RM {(Number(item.price) * (1-Number(item.discount))).toFixed(2)}</Text>
                <Text style={styles.attribute}>Discount: {Number(item.discount)*100}%</Text>
              </View>
              </TouchableOpacity>
            );
          }
        }}>
      </FlatList>
    </ScrollView>
  );
};

export default ScrollViewProduct;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightpink",
    paddingBottom: "5%",
    marginBottom: "5%",
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 18,
  },
  container: {
    backgroundColor: "lightpink",
    paddingBottom: "15%",
    marginBottom: "15%",
  },
  logo:{
    width: 65,
    height: 65,
    padding: 5,
  },
  title: {
    width: "100%",
    marginTop: 20,
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: "10%",
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

module.exports = {
  ScrollViewProduct: ScrollViewProduct,
};