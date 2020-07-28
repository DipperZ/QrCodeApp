/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
'use strict';
import React, {Component, useSate, useEffect} from 'react';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import {
  Image,
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
  View,
  Picker,
  ActivityIndicator,
  FlatList,
  TextInput
} from 'react-native';

import {
  CameraKitCameraScreen,
} from 'react-native-camera-kit';

export default class App extends Component{
    constructor(){
    super();
        this.state ={
            qrvalue: '',
            opneScanner: false,
            card_seri: '',
            card_pin: '',
            card_img_data: 'zxc',
            file_path: '',
            signature: '123',
            provider: 'Mobiphone',
            card_detected_result: '11'
        };
    }
    onOpenlink(){
        Linking.openURL(this.state.qrvalue);
    }
    onBarCodeScan(qrvalue){
        this.setState({qrvalue: qrvalue});
        this.setState({opneScanner: false});
    }
    onOpneScanner(){
        var that = this;
        async function requestCameraPermission(){
            try{
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,{
                    'title': 'QRCodeScan App Camera Permission',
                    'message':'QRCodeScan App needs access to your camera'
                    }
                )
                if(granted == PermissionsAndroid.RESULTS.GRANTED){
                    that.setState({qrvalue: ''});
                    that.setState({opneScanner: true});
                } else {
                    alert("Camera permission denied");
                }
            } catch {
                alert("Camera permission err", err);
                console.warn(err);
            }
        }
        requestCameraPermission();
    }

    render(){
        let displayModel;
        if(!this.state.opneScanner) {
            return (
                <View style ={styles.container}>
                    <Image style ={styles.imageStyle}
                        source ={require('./img/image_2020_05_07T02_05_20_762Z.png')}/>
                    <Text style={styles.heading}>Imedia - QRCodeScan</Text>
                    <Text style={styles.simpleText}>{this.state.qrvalue ?'Seri: '+ this.state.qrvalue.split(" ")[0].trim() :''}</Text>
                    <Text style={styles.simpleText}>{this.state.qrvalue ?'DataCard: '+ this.state.qrvalue.split(" ")[1].trim() :''}</Text>
                    <Text style={styles.simpleText}>{this.state.qrvalue ?'ProviverURL: '+ this.state.qrvalue.split(" ")[2].trim() :''}</Text>
                    {this.state.qrvalue.includes("http") ?
                        <TouchableHighlight
                            onPress={() =>this.onOpenlink()}
                            style ={styles.button}>
                            <Text style={{color: '#FFFFFF', fontSize: 12}}>Open Link</Text>
                        </TouchableHighlight>
                        : null
                    }
                    <TouchableHighlight
                        onPress={() => this.onOpneScanner()}
                        style={styles.button}>
                           <Text style={{ color: '#FFFFFF', fontSize: 12 }}>Open QR Scanner</Text>
                    </TouchableHighlight>
                    if (this.state.qrvalue) {
                    <TouchableHighlight
                                            onPress={() => this.addData()}
                                            style={styles.button}>
                                               <Text style={{ color: '#FFFFFF', fontSize: 12 }}>Add Card</Text>
                                        </TouchableHighlight>
                                        }
                </View>
            );
        }

        return (
            <View style ={{flex: 1}}>
                <CameraKitCameraScreen
                    showFrame={false}
                    scanBarcode={true}
                    laserColor={'blue'}
                    frameColor={'yellow'}
                    colorForScannerFrame={'black'}
                    onReadCode ={event =>this.onBarCodeScan(event.nativeEvent.codeStringValue)}
                />
            </View>
        );
    }
}
function status (response){
    if (response.status >= 200 && response.status < 300){
        return response
    }
    throw new Error(response.statusText)
}
function json(response){
    return response.json()
}

fetch('http://192.168.100.169:8085/card_service/savecard',{
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: {
               card_seri: this.state.qrvalue,
               card_pin: this.state.qrvalue,
               card_img_data: this.state.qrvalue,
               file_path: this.state.qrvalue,
               signature:this.state.qrvalue,
               provider:this.state.qrvalue,
               card_detected_result: this.state.card_detected_result
        }
        }).then(status).then(json).then(function(json){
            console.log('Request success: ', json)
        }).catch(function(error){
            console.log('Request fail',error)
        })


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#FFFAF0'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2c3539',
    padding: 10,
    width:300,
    marginTop:16
  },
  heading: {
    color: 'black',
    fontSize: 24,
    alignSelf: 'center',
    padding: 10,
    marginTop: 30
  },
  simpleText: {
    color: 'black',
    fontSize: 20,
    alignSelf: 'center',
    padding: 10,
    marginTop: 16
  },
  imageStyle:{
    width: 250,
    height: 120,
    marginBottom:120,
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
    borderBottomLeftRadius:5,
    borderBottomRightRadius:5
  },
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30,
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30,
    }
});


