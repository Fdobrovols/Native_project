import moment from 'moment';
import 'moment/locale/uk';
import { StyleSheet, Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import userlogo from '../../images/userlogo.png';

export default function CommentItem({ comment, owner, createdAt }) {
    const userId = useSelector(state => state.auth.userId);

    return (
        <View
            style={{
                ...styles.commentContainer,
                flexDirection: userId !== owner.userId ? 'row' : 'row-reverse',
            }}
        >
            <Image
                source={owner.avatar ? { uri: owner.avatar } : userlogo}
                alt="User photo"
                style={styles.avatar}
            />
            <View
                style={{
                    ...styles.commentWrap,
                    borderTopLeftRadius: userId !== owner.userId ? 0 : 5,
                    borderTopRightRadius: userId !== owner.userId ? 5 : 0,
                }}
            >
                <Text style={styles.comment}>{comment}</Text>
                <Text
                    style={userId !== owner.userId ? styles.dateUser : styles.dateOwner}
                >
                    {moment(createdAt).locale('uk').format('DD MMMM, YYYY | HH:mm')}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    commentContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 5,
        gap: 28,
        width: 6,
    },
    avatar: {
        width: 7,
        height: 4,
        borderRadius: 3,
    },
    commentWrap: {
        position: 'fixed',
        flex: 5,
        borderRadius: 3,
        backgroundColor: 'rgba(107, 128, 39, 0.03)',
        padding: 8,
        gap: 4,
    },
    comment: {
        marginBottom: 2,
        fontFamily: 'cursive',
        color: '#428a70',
        fontSize: 15,
    },
    dateUser: {
        fontFamily: 'serif',
        color: '#2e5a59ff',
        fontSize: 7,
        position: 'fixed',
        bottom: 16,
        right: 10,
    },
    dateOwner: {
        fontFamily: 'Roboto-Regular',
        color: '#6f8041',
        fontSize: 7,
        position: 'fixed',
        bottom: 14,
        left: 17,
    },
});
