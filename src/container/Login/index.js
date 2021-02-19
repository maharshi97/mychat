import { View } from 'native-base';
import React, { useState,useContext } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, Text, TouchableWithoutFeedback} from 'react-native'
import { globalStyle,color } from '../../utility';
import {Logo,InputField,RoundCornerButton} from '../../component';
import {Store} from '../../context/store';
import {LOADING_START, LOADING_STOP} from '../../context/actions/types';
import { setUniqueValue, keyboardVerticalOffset } from '../../utility/constants';
import { setAsyncStorage, keys } from "../../asyncStorage";
import { LoginRequest } from "../../network";
import firebase from "../../firebase/config";

const Login = ({navigation}) => {

    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;
    const [showLogo, toggleLogo] = useState(true);


    const [credentials,setCredentials]=useState({
    email:'',
    password:'', 
});
const {email,password}= credentials;

onLoginPress= ()=>{
    if(!email){
        alert('email is required');

    }else if(!password){
        alert('Password is required');
    }else{
    dispatchLoaderAction({
        type: LOADING_START,
    });
    LoginRequest(email,password)
    .then((res)=>{
        if (!res.additionalUserInfo) {
            dispatchLoaderAction({
              type: LOADING_STOP,
            });
            alert(res);
            return;
          }
        setAsyncStorage(keys.uuid, res.user.uid);
        setUniqueValue(res.user.uid);
        dispatchLoaderAction({
            type: LOADING_STOP,
        }); 
        navigation.replace('Dashboard');
    })
    .catch((err)=>{
        dispatchLoaderAction({
            type: LOADING_STOP,
        }); 
        
        alert(err);

    });
    }
};

const handleOnChange = (name,value) =>{
    setCredentials({
        ...credentials,
        [name]:value,
    });
};

//*on Focus input

const handleFocus=()=>{
    setTimeout(()=>{
        toggleLogo(false);
    },200);
};
//* on blur input
const handleBlur=()=>{
    setTimeout(()=>{
        toggleLogo(false);
    },200);
}


    return (
        //<KeyboardAvoidingView
        //style={[globalStyle.flex1, { backgroundColor: color.BLACK }]}
        //behavior={Platform.OS==='android'?'padding':'height'}
        //keyboardVerticalOffset={keyboardVerticalOffset} >

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
             
        <SafeAreaView style={[globalStyle.flex1, { backgroundColor: color.BLACK }]} >

            {
                showLogo && (
                <View style={[globalStyle.containerCentered]}>
                    <Logo/>
                </View>
                    )
            }
            
              <View style={[globalStyle.flex2,globalStyle.sectionCentered]}>
                <InputField  placeholder="Enter email" value ={email}
                onChangeText={(text)=> handleOnChange('email', text)}
                onFocus={()=>handleFocus()}
                onBlur={()=> handleBlur()}
                />
                <InputField placeholder="Enter password" secureTextEntry={true} 
                value={password}
                onChangeText={(text)=> handleOnChange('password', text)}
                onFocus={()=>handleFocus()}
                onBlur={()=> handleBlur()}
                />
                <RoundCornerButton title="Login" onPress={()=>onLoginPress()}/>
                 <Text style={{
                     fontSize: 28,
                     fontWeight: 'bold',
                     color: color.LIGHT_GREEN,
                     
                 }}onPress ={()=> navigation.navigate('SignUp')} >
                     SignUp
                </Text>
              </View>
        </SafeAreaView>
        </TouchableWithoutFeedback>  
        //</KeyboardAvoidingView>
    );
}; 

export default Login;