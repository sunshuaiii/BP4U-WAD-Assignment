import React, {Component} from 'react';
import {Text} from 'react-native';
import {AppText} from '../components/AppText';

// need olivia's help
export class ScrollViewProduct extends Component {
  render() {
    return (
      <ScrollView>
        {/* New Released Category */}
        <Text style={styles.title}>New Released</Text>

        <FlatList
          style={styles.productsListContainer}
          refreshing={this.state.isFetching}
          onRefresh={this._loadNewReleasedProducts}
          data={this.state.newreleasedProducts}
          renderItem={({item, index}) => {
            if (item.discount == 0) {
              return (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => {
                    navigation.navigate('ProductScreen', {
                      productId: item.id,
                    });
                  }}>
                  <View style={styles.infoContainer}>
                    <Image source={{uri: item.photo}} style={styles.thumb} />
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.price}>RM {item.price}</Text>
                  </View>
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => {
                    navigation.navigate('ProductScreen', {
                      productId: item.id,
                    });
                  }}>
                  <View style={styles.infoContainer}>
                    <Image source={{uri: item.photo}} style={styles.thumb} />
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.discountedPrice}>RM {item.price}</Text>
                    <Text style={styles.price}>
                      RM{' '}
                      {(
                        Number(item.price) *
                        (1 - Number(item.discount))
                      ).toFixed(2)}
                    </Text>
                    <Text style={styles.attribute}>
                      Discount: {Number(item.discount) * 100}%
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }
          }}></FlatList>
      </ScrollView>
    );
  }
}
