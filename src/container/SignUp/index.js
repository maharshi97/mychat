import { View } from 'native-base';
import React, { useState, useContext } from 'react'
import { SafeAreaView, Text, Keyboard,KeyboardAvoidingView,TouchableWithoutFeedback,Platform } from 'react-native'
import { globalStyle,color } from '../../utility';
import {Logo,InputField,RoundCornerButton} from '../../component';
import {Store} from '../../context/store';
import {LOADING_START, LOADING_STOP} from '../../context/actions/types';
import SignUpRequest from '../../network/signup';
import { AddUser } from '../../network/user';
import {keys, setAsyncStorage} from '../../asyncStorage';
import { setUniqueValue,keyboardVerticalOffset } from '../../utility/constants';
import firebase from '../../firebase/config';

const SignUp = ({navigation}) => {

    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;
    const [showLogo, toggleLogo] = useState(true);

const [credentials,setCredentials]=useState({
    name:'',
    email:'',
    password:'',
    confirmPassword:'',
});
const {name,email,password,confirmPassword}= credentials;

onSignUpPress = () => {
    if(!name){
        alert('name is required');

    }
    else if(!email)
    {
        alert('email is required');

    }else if(!password){
        alert('Password is required');
    }
    else if(password !== confirmPassword){
        alert('Password is not match');
    }
    
    else{
        dispatchLoaderAction({
            type: LOADING_START,
        });
        SignUpRequest(email,password)
        .then((res) => {
            if (!res.additionalUserInfo) {
                dispatchLoaderAction({
                  type: LOADING_STOP,
                });
                alert(res);
                return;
              }
            console.log(firebase.auth().currentUser);
            let uid = firebase.auth().currentUser.uid;
            let profileImg = '';
            AddUser(name,email,uid,profileImg)
            .then(()=>{
                setAsyncStorage(keys.uuid.uid);
                setUniqueValue(uid);
                dispatchLoaderAction({
                    type: LOADING_STOP,
                });
                navigation.replace('Dashboard');
            })
            .catch((err) =>{
                    dispatchLoaderAction({
                        type: LOADING_STOP,
                    });
                    alert(err);
                });

        })
        .catch((err) =>{
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
      //keyboardVerticalOffset={keyboardVerticalOffset}
      //behavior={Platform.OS == "ios" ? "padding" : "height"}
      //style={[globalStyle.flex1, { backgroundColor: color.BLACK }]}>
     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
         
        
        <SafeAreaView style={[globalStyle.flex1, { backgroundColor: color.BLACK }]}
        >
             {
                showLogo && (
                <View style={[globalStyle.containerCentered]}>
                    <Logo/>
                </View>
                    )
            }

              <View style={[globalStyle.flex2,globalStyle.sectionCentered]}>
              <InputField  placeholder="Enter name" value ={name}
                onChangeText={(text)=> handleOnChange('name', text)}
                onFocus={()=>handleFocus()}
                onBlur={()=> handleBlur()}
                />

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
                <InputField 
                placeholder="Confirm Password"
                value ={confirmPassword}
                secureTextEntry={true}
                onChangeText={(text)=>

                 handleOnChange('confirmPassword', text)}
                 onFocus={()=>handleFocus()}
                onBlur={()=> handleBlur()}
                />
                <RoundCornerButton title="SignUp" onPress={()=> onSignUpPress()}/>
                 <Text style={{
                     fontSize: 28,
                     fontWeight: 'bold',
                     color: color.LIGHT_GREEN,
                     
                 }}onPress ={()=> navigation.navigate('Login')} >
                     Login
                     
                </Text>
              </View>
        </SafeAreaView>
    </TouchableWithoutFeedback>   
    //</KeyboardAvoidingView>
    );
}; 

export default SignUp;