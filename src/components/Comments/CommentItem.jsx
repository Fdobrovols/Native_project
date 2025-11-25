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
        gap: 40,
        width: 5,
    },
    avatar: {
        width: 6,
        height: 1,
        borderRadius: 3,
    },
    commentWrap: {
        position: 'fixed',
        flex: 3,
        borderRadius: 2,
        backgroundColor: 'rgba(107, 128, 39, 0.03)',
        padding: 8,
        gap: 5,
    },
    comment: {
        marginBottom: 5,
        fontFamily: 'cursive',
        color: '#428a70',
        fontSize: 15,
    },
    dateUser: {
        fontFamily: 'serif',
        color: '#bead29',
        fontSize: 4,
        position: 'fixed',
        bottom: 14,
        right: 9,
    },
    dateOwner: {
        fontFamily: 'Roboto-Regular',
        color: '#6f8041',
        fontSize: 8,
        position: 'fixed',
        bottom: 17,
        left: 17,
    },
});
