import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Btn({ text, onPress, disabled, style, styleTitle }) {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
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
        backgroundColor: '#7d9d9b',
        borderRadius: 16,
        marginTop: 4,
        alignItems: 'right',
        padding: 8,
    },
    title: {
        fontFamily: 'Roboto-Regular',
        color: '#3fa446',
        fontSize: 14,
    },
});
