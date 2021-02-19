import React,{useEffect, useLayoutEffect,useState} from 'react';
import {View,Text,SafeAreaView,FlatList,KeyboardAvoidingView} from 'react-native';
//import { FlatList } from 'react-native-gesture-handler';
import { InputField,ChatBox } from '../../component';
import { globalStyle, color, appStyle } from "../../utility";
import styles from './styles';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ImagePicker from "react-native-image-picker";
import firebase from '../../firebase/config'
import { senderMsg, recieverMsg } from "../../network";

const Chat =({route,navigation})=>{
    const{params}= route;
    const { name, img, imgText, guestUserId, currentUserId } = params;
    const [msgValue, setMsgValue] = useState("");
    const [messeges, setMesseges] = useState([]);
    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: <Text>{name}</Text>,
        });
      }, [navigation]);

      useEffect(() => {
        try {
          firebase
            .database()
            .ref("messeges")
            .child(currentUserId)
            .child(guestUserId)
            .on("value", (dataSnapshot) => {
              let msgs = [];
              dataSnapshot.forEach((child) => {
                msgs.push({
                  sendBy: child.val().messege.sender,
                  recievedBy: child.val().messege.reciever,
                  msg: child.val().messege.msg,
                  img: child.val().messege.img,
                });
              });
              setMesseges(msgs.reverse());
            });
        } catch (error) {
          alert(error);
        }
      }, []); 

      const handleSend = () => {
        setMsgValue("");
        if (msgValue) {
          senderMsg(msgValue, currentUserId, guestUserId, "")
            .then(() => {})
            .catch((err) => alert(err));
    
          // * guest user
    
          recieverMsg(msgValue, currentUserId, guestUserId, "")
            .then(() => {})
            .catch((err) => alert(err));
        }
      };


      //*handle camera 

      const handleCamera = () => {
        const option = {
          storageOptions: {
            skipBackup: true,
          },
        };
    
        ImagePicker.showImagePicker(option, (response) => {
          if (response.didCancel) {
            console.log("User cancel image picker");
          } else if (response.error) {
            console.log(" image picker error", response.error);
          } else {
            // Base 64
            let source = "data:image/jpeg;base64," + response.data;
    
            senderMsg(msgValue, currentUserId, guestUserId, source)
              .then(() => {})
              .catch((err) => alert(err));
    
            // * guest user
    
            recieverMsg(msgValue, currentUserId, guestUserId, source)
              .then(() => {})
              .catch((err) => alert(err));
          }
        });
      };


      const handleOnChange = (text) => {
        setMsgValue(text);
      };

      const imgTap = (chatImg) => {
        navigation.navigate("ShowFullImg", { name, img: chatImg });
      };
    return(
        <SafeAreaView style={[globalStyle.flex1,{backgroundColor:color.BLACK}]}>
          <FlatList
          inverted
          data= {messeges}
          keyExtractor={(_,index)=>index.toString()}
          renderItem={({item})=>(
            <ChatBox
            msg={item.msg}
            userId={item.sendBy}
            img={item.img}
            onImgTap={()=>imgTap(item.img)}
            
            />
          )}
          
          />

        {/*Send Message */}
        <View style={styles.sendMessageContainer}>
            <InputField
            placeholder="Type here"
            numberOfLines={10}
            inputStyle={styles.input}
            value={msgValue}
            onChangeText={(text)=>handleOnChange(text)}
            />
            <View style={styles.sendBtnContainer}>
                <MaterialCommunityIcons
                name="camera"
                color={color.WHITE}
                size={28}
                onPress={()=>handleCamera()}
                
                />
                <MaterialCommunityIcons
                name="send-circle"
                color={color.WHITE}
                size={30}
                onPress={()=>handleSend()}
                style={{margin: 10}}

                />
            </View>

        </View>
        </SafeAreaView>
    );
};

export default Chat;
