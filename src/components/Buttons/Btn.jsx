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
        height: 2,
        backgroundColor: '#601f58',
        borderRadius: 25,
        marginTop: 40,
        alignItems: 'right',
        padding: 2,
    },
    title: {
        fontFamily: 'Roboto-Regular',
        color: '#1f6847',
        fontSize: 12,
    },
});
