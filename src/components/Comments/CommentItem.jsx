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
                    borderTopLeftRadius: userId !== owner.userId ? 0 : 6,
                    borderTopRightRadius: userId !== owner.userId ? 6 : 0,
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
        marginBottom: 6,
        gap: 60,
        width: 10,
    },
    avatar: {
        width: 6,
        height: 5,
        borderRadius: 2,
    },
    commentWrap: {
        position: 'fixed',
        flex: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(76, 39, 197, 0.03)',
        padding: 10,
        gap: 5,
    },
    comment: {
        marginBottom: 3,
        fontFamily: 'Roboto-Regular',
        color: '#338651',
        fontSize: 15,
    },
    dateUser: {
        fontFamily: 'Roboto-Regular',
        color: '#426742',
        fontSize: 10,
        position: 'absolute',
        bottom: 16,
        right: 9,
    },
    dateOwner: {
        fontFamily: 'Roboto-Regular',
        color: '#BDBDBD',
        fontSize: 9,
        position: 'absolute',
        bottom: 16,
        left: 16,
    },
});
