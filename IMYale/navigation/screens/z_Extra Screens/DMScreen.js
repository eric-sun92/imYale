import * as React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import {apiURL} from '../../../global.js';

export default function DMScreen({ navigation }) {
    const viewMessage = () => {
        navigation.navigate('MessageScreen');
    };
    // Sample data
    const chats = [
        { id: '1', name: 'Allen Tonge', lastMessage: 'Seen 2h ago', timestamp: new Date('2023-11-02T10:00:00') },
        { id: '2', name: 'Caden Roquez', lastMessage: 'fuck berkeley bro', timestamp: new Date('2023-11-02T09:00:00') },
        { id: '3', name: 'Haley White', lastMessage: 'headin over at 7:50', timestamp: new Date('2023-11-02T08:00:00') },
        //... add more chat data
    ];

    // Sorting the chats array based on the timestamp in descending order.
    chats.sort((a, b) => b.timestamp - a.timestamp);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    title="Add Message"
                    onPress={() => navigation.navigate('MessageScreen')}
                />
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.chatItem}
                        onPress={viewMessage}
                    >
                        <Text style={styles.chatName}>{item.name}</Text>
                        <Text style={styles.chatMessage}>{item.lastMessage}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    chatItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    chatName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    chatMessage: {
        fontSize: 16,
    },
});