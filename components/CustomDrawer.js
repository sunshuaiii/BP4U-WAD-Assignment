import React from 'react';
import {View, Text} from 'react-native';
import {CustomText} from '../UI.js';
import {DrawerItemList} from '@react-navigation/drawer';

const CustomDrawer = props => {
  // return (
  //   <View>
  //     <CustomText label="SETTINGS"></CustomText>
  //     <DrawerItemList {...props} />
  //   </View>
  // );

    return (
      <View>
        <Text>{'Drawer Screen'}</Text>
      </View>
    );
};

export default CustomDrawer;
