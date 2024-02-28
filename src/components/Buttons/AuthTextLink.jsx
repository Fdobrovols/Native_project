import { StyleSheet, Text, View } from 'react-native';

export default function AuthTextLink({ text, linkText, onPress }) {
    return (
        <View style={styles.wrap}>
            <Text style={styles.text}>{text}</Text>
            <Text
                style={{ ...styles.text, textDecorationLine: 'underline' }}
                onPress={onPress}
            >
                {linkText}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        justifyContent: 'right',
        gap: 7,
    },
    text: {
        marginTop: 13,
        color: '#cb2eae',
        textAlign: 'left',
    },
});
