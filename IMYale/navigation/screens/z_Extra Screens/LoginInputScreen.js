import React, {useState} from 'react';
import {View, Text, Button, Image, StyleSheet, Dimensions, TextInput, TouchableOpacity} from 'react-native';
import {apiURL} from '../../../global.js';

const LoginInputScreen = ({ navigation }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const handleLogin = () => {
        setIsLoggedIn(true);
        navigation.replace('Main');
    };

    return (
        
        <View style={styles.container}>
            <Text style={styles.title}>ImYale</Text>

            <TextInput style={styles.input}
                       placeholder="email (Yale)"
                       keyboardType="email-address"
                       autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin} >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'sans-serif'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00356B',
        marginBottom: 30,
    },
    input: {
        backgroundColor: 'white',
        color: '#00356B',
        width: '80%',
        height: 40,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#00356B', // New color
        borderRadius: 20, // Slightly smaller border radius
        paddingVertical: 12, // Slightly smaller padding
        paddingHorizontal: 24, // Slightly smaller padding
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowRadius: 6,
        shadowOpacity: 1,
        elevation: 4, // Android shadow
    },
    buttonText: {
        color: 'white',
        fontSize: 16, // Slightly smaller text size
        fontWeight: 'bold',
        textTransform: 'uppercase',
    }
}


export default LoginInputScreen;
