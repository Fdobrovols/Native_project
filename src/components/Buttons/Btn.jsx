import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Btn({ text, onPress, disabled, style, styleTitle }) 
{
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
        height: 50,
        backgroundColor: '#FF6C00',
        borderRadius: 50,
        marginTop: 43,
        alignItems: 'center',
        padding: 10,
    },
    title: {
        fontFamily: 'Roboto-Regular',
        color: '#b44141',
        fontSize: 16,
    },
});
