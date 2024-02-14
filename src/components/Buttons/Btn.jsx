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
        height: 40,
        backgroundColor: '#359445',
        borderRadius: 40,
        marginTop: 43,
        alignItems: 'left',
        padding: 4,
    },
    title: {
        fontFamily: 'Roboto-Regular',
        color: '#395f67',
        fontSize: 16,
    },
});
