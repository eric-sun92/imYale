import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function MessageScreen({navigation}){
    const [chatMessage, setChatMessage] = useState('');
    const [showProfile, setShowProfile] = useState(false);

    const messages = [
        {
            id: 1,
            sender: 'John',
            text: 'Hello',
            date: '2022-10-01 09:00:00',
        },
        {
            id: 2,
            sender: 'Alice',
            text: 'Hi John, how are you?',
            date: '2022-10-01 09:05:00',
        },
        {
            id:  3,
            sender: 'John',
            text: 'I\'m good, thanks! How about you?',
            date: '2022-10-01 09:10:00',
        },
        {
            id: 4,
            sender: 'Alice',
            text: 'I\'m great!',
            date: '2022-10-01 09:12:00',
        },
        {
            id: 5,
            sender: 'Alice',
            text: 'I\'m great!',
            date: '2022-10-01 09:12:00',
        },
        {
            id: 6,
            sender: 'Alice',
            text: 'I\'m great!',
            date: '2022-10-01 09:12:00',
        },
        {
            id: 7,
            sender: 'Alice',
            text: 'I\'m great!',
            date: '2022-10-01 09:12:00',
        },
    ];

    const renderItem = ({ item }) => {
        const isCurrentUser = item.sender === 'John'; // Replace 'John' with the current user's name

        return (
            <View style={isCurrentUser ? styles.currentUserMessageContainer : styles.otherUserMessageContainer}>
                <View style={isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble}>
                    {!isCurrentUser && (
                        <Text style={styles.senderName}>{item.sender}</Text>
                    )}
                    <Text style={isCurrentUser ? styles.messageText : styles.otherMessageText}>{item.text}</Text>
                    <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                </View>
            </View>
        );
    };

    const sortedMessages = messages.sort((a, b) => b.date.localeCompare(a.date));

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            hour: 'numeric',
            minute: 'numeric'
        };
        return `${date.toLocaleDateString('en-US', options)}`;
    };

    const handleSend = () => {
        setChatMessage('');
        navigation.navigate('Main');
    };

    return (
        <View style={styles.container}>
            <View style={styles.chatContainer}>
                <FlatList
                    data={sortedMessages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    inverted
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    onChangeText={setChatMessage}
                    value={chatMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    )}


const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    chatContainer: {
        flex: 1,
        padding: 10,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    currentUserMessageContainer: {
        alignItems: 'flex-end',
    },
    otherUserMessageContainer: {
        alignItems: 'flex-start',
    },
    currentUserBubble: {
        borderRadius: 20,
        maxWidth: '80%',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#00356B',
    },
    otherUserBubble: {
        borderRadius: 20,
        maxWidth: '80%',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#F0F2F5',
    },
    senderName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#6C757D',
    },
    messageText: {
        fontSize: 16,
        color: '#ffffff',
        padding: 2,
    },
    otherMessageText: {
        fontSize: 16,
        color: 'black',
        paddingTop: 5,
        paddingBottom: 5,
    },
    dateText: {
        fontSize: 10,
        color: '#6C757D',
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopWidth: 1,
        borderColor: '#E0E4E7',
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 20,
        backgroundColor: '#F0F2F5',
    },
    sendButton: {
        marginLeft: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#00356B',
    },
    sendButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
