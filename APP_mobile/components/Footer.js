import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Switch } from 'react-native';

export default function Footer() {
    const [toggle1, setIsEnabled1] = useState(false);
    const [toggle2, setIsEnabled2] = useState(false);
    const [toggle3, setIsEnabled3] = useState(false);
    const toggleSwitch1 = (value) => {
        setIsEnabled1(value)
    }
    const toggleSwitch2 = (value) => {
        setIsEnabled2(value)
    }
    const toggleSwitch3 = (value) => {
        setIsEnabled3(value)
    }
    return (
        <View style={styles.container_view}>
            <View style={styles.info}>
                <View style={styles.dataview}>
                    <View style={[styles.box, { backgroundColor: "white", marginRight: 13 }]}>
                        <Image style={styles.Imagebox}
                            source={require('../assets/tem.png')} />
                        <Text style={styles.text}>TEMPERATURE</Text>
                        <Text style={styles.data}>00</Text>
                    </View>
                    <View style={[styles.box, { backgroundColor: "white", marginRight: 13 }]}>
                        <Image style={styles.Imagebox}
                            source={require('../assets/hum.png')} />
                        <Text style={styles.text}>HUMIDITY</Text>
                        <Text style={styles.data}>00</Text>
                    </View>
                    <View style={[styles.box, { backgroundColor: "white" }]}>
                        <Image style={styles.Imagebox}
                            source={require('../assets/light.png')} />
                        <Text style={styles.text}>LIGHT</Text>
                        <Text style={styles.data}>00</Text>
                    </View>
                </View>
                <View style={[styles.boxp, { backgroundColor: "white" }]}>
                    <View style={styles.pp}>
                        <Text style={{
                            textAlign: 'center',
                            fontFamily: "Cochin",
                            fontSize: 13,
                            color: 'blue'
                        }}>COUNT PEOPLE</Text>
                        <View style={styles.ppp}>
                            <Image
                                style={{
                                    marginRight: 10
                                }}
                                source={require('../assets/step.png')} />
                            <Text style={{
                                fontSize: 25,
                                marginTop: 8,
                                color: '#999999'
                            }}>0</Text>
                        </View>
                    </View>
                    <View style={styles.status}>
                        <Text
                            style={{
                                textAlign: 'center',
                                fontFamily: "Cochin",
                                fontSize: 13,
                                color: 'blue'
                            }}>{toggle1 ? 'MANUAL' : 'AUTO'}</Text>
                        <View style={styles.ppp}>
                            <Text

                                style={{
                                    marginTop: 8,
                                    color: '#999999'
                                }}>A</Text>
                            <Switch
                                onValueChange={toggleSwitch1}
                                value={toggle1}
                            />
                            <Text
                                style={{
                                    marginTop: 8,
                                    color: '#999999'
                                }}>M</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.button_crl}>
                <View style={[styles.button, { backgroundColor: "white", marginRight: 30 }]}>
                    <Image style={styles.lamp}
                        source={require('../assets/idea.png')} />
                    <Switch
                        style={{ transform: [{ scaleX: .9 }, { scaleY: .8 }] }}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        onValueChange={toggleSwitch2}
                        value={toggle2}
                    />
                </View>
                <View style={[styles.button, { backgroundColor: "white", marginRight: 10 }]}>
                    <Image style={styles.lamp}
                        source={require('../assets/fan.png')} />
                    <Switch
                        style={{ transform: [{ scaleX: .9 }, { scaleY: .8 }] }}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        onValueChange={toggleSwitch3}
                        value={toggle3}
                    />
                </View>
            </View>


        </View>
    )

}
const styles = StyleSheet.create({
    container_view: {
        // backgroundColor: '#EEEEEE',
        marginTop: 25,
        paddingTop: 0,
    },
    info: {
        paddingHorizontal: 33,
    },
    dataview: {
        flexDirection: "row",
        paddingVertical: 20
    },
    box: {
        height: 160,
        flex: 1,
        //paddingHorizontal: 10,
        // justifyContent: 'center',
        //alignItems: 'center',
        //
        borderRadius: 15,
        shadowColor: '#426EB4',
        shadowOffset: { width: 7, peak: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    Imagebox: {
        marginTop: 20,
        width: 28,
        //resizeMode: 'contain',
        marginBottom: 20,
        marginLeft: 40
    },
    text: {
        fontFamily: "Cochin",
        fontSize: 12,
        marginLeft: 8,
        textAlign: 'center'
    },
    data: {
        marginTop: 20,
        textAlign: "center",
        fontFamily: "Cochin",
        fontSize: 27,
        color: '#999999'
    },
    boxp: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        height: 70,
        borderRadius: 20,
        shadowColor: '#171717',
        shadowColor: '#426EB4',
        shadowOffset: { width: 2, peak: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        paddingVertical: 5,
        marginTop: 15,
        marginBottom: 15,
    },
    pp: {

    },
    status: {
        // marginTop: 10
    },
    ppp: {
        flexDirection: 'row',
        marginTop: 8
    },
    button_crl: {
        flexDirection: "row",
        paddingVertical: 20,
        paddingHorizontal: 55,
    },
    button: {
        height: 130,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        //
        borderRadius: 90,
        shadowColor: '#426EB4',
        shadowOffset: { width: -5 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    lamp: {
        width: 60,
        height: 60,
        marginBottom: 5
    }
});
