import React,{useEffect} from 'react';
import { View, Text } from 'react-native';
import {Logo} from '../../component';
import {globalStyle,color,appStyle} from '../../utility';
import {getAsyncStorage,keys} from '../../asyncStorage';
import {setUniqueValue} from '../../utility/constants';
const Splash =({navigation})=> {
    useEffect(() => {
        const redirect = setTimeout(() => {
          getAsyncStorage(keys.uuid)
            .then((uuid) => {
              if (uuid) {
                setUniqueValue(uuid);
                console.log(uuid);
                navigation.replace('Dashboard');
              } else {
                navigation.replace('Login');
              }
            })
            .catch((err) => {
              console.log(err);
              navigation.replace('Login');
            });
        }, 4000);
        return () => clearTimeout(redirect);
      }, [navigation]);
    return (
        <View style= {[globalStyle.containerCentered, {backgroundColor:color.BLACK}]} >
            <Logo/>

        </View>
    )

}

export default Splash
