import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Btn({ text, onPress, disabled, style, styleTitle }) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={{ ...styles.button, ...style }}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={{ ...styles.title, ...styleTitle }}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 3,
        backgroundColor: '#601f58',
        borderRadius: 15,
        marginTop: 32,
        alignItems: 'right',
        padding: 3,
    },
    title: {
        fontFamily: 'Roboto-Regular',
        color: '#82a43f',
        fontSize: 14,
    },
});
