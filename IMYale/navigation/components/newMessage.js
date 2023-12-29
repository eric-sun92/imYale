import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * NewMessage Component
 * 
 * A modal component for creating and submitting a new message.
 * 
 * @param {Object} props - Component props.
 * @param {string} props.title - Title of the modal.
 * @param {boolean} props.visible - Whether the modal is visible.
 * @param {Function} props.onClose - Function to call when closing the modal.
 * @param {Function} props.onSubmit - Function to call when submitting the message.
 * @param {string} props.inputValue - The current value of the input field.
 * @param {Function} props.setInputValue - Function to update the value of the input field.
 * @returns {React.Component} - A modal for new message input.
 */
const NewMessage = ({title, visible, onClose, onSubmit, inputValue, setInputValue }) => {
    // const [inputValue, setInputValue] = useState('');

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.textStyle}>X</Text>
                    </TouchableOpacity>
                    <Text style={styles.heading}>{title}</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={setInputValue}
                        value={inputValue}
                        placeholder="Enter your text here"
                        multiline={true}
                        numberOfLines={4}
                    />
                    <TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%', // Adjust as needed
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    textStyle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 15,
    },
    textInput: {
        height: 120, // Increased height
        width: '100%', // Width relative to the modal
        margin: 12,
        borderWidth: 1,
        padding: 10,
        textAlignVertical: 'top', // Align text to the top
    },
    submitButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default NewMessage;
