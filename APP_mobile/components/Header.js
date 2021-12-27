import React, { Component } from 'react';
import { StyleSheet, ImageBackground, Text, View, Image } from 'react-native';

export default class Header extends React.Component {
    render() {
        return (
            <View style={styles.container_header}>
                <ImageBackground
                    source={require('../assets/back.jpg')}
                    imageStyle={{
                        borderBottomLeftRadius: 80,
                    }}
                    resizeMode="cover" style={styles.image}>
                    <View>
                        <Text style={styles.texttitel}></Text>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container_header: {
        backgroundColor: '#426EB4',
        // alignItems: 'center',
        justifyContent: 'center',
        height: '25%',
        borderBottomColor: "gray",
        borderBottomLeftRadius: 80,
        // shadowColor: '#171717',
        // shadowOffset: { width: 5, peak: 9 },
        // shadowOpacity: 0.4,
        // shadowRadius: 3,
    },
    texttitel: {
        marginLeft: 30,
        fontSize: 30,
        color: "blue"
    },
    image: {
        flex: 1,
       // justifyContent: "center",
        shadowOpacity: 20,
        
      },
});
