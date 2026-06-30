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
        backgroundColor: '#413661',
        borderRadius: 16,
        marginTop: 4,
        alignItems: 'right',
        padding: 6,
    },
    title: {
        fontFamily: 'Roboto-Regular',
        color: '#a2a43f',
        fontSize: 15,
    },
});
