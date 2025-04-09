import {
    StyleSheet,
    View,
    Image,
    TextInput,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import CommentItem from '../../components/Comments/CommentItem';

export default function CommentsScreen({ route }) {
    const { id, url } = route.params;
    const [comment, setComment] = useState('');
    const [allComments, setAllComments] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const name = useSelector(state => state.auth.name);
    const userId = useSelector(state => state.auth.userId);
    const avatar = useSelector(state => state.auth.avatar);

    const sendComment = async () => {
        if (!comment) {
            return;
        }
        try {
            await addDoc(collection(db, 'posts', id, 'comments'), {
                comment,
                owner: { userId, name, avatar },
                createdAt: new Date().getTime(),
            });
            setComment('Write HEre');
        }
        catch (error) {
            console.log(error.code);
        }
    }


    useEffect(() => {
        const commentsRef = collection(db, 'posts', id, 'comments');
        onSnapshot(commentsRef, data => {
            const dbComments = data.docs.map(doc => ({
                commentId: doc.id,
                ...doc.data(),
            }));
            const sortedDbComments = dbComments.sort(
                (a, b) => a.createdAt - b.createdAt
            );
            setAllComments(sortedDbComments);
        });
    }, []);


    return (
        <TouchableWithoutFeedback
            TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
        >
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.postPhotoWrap}>
                        <Image
                            source={{ uri: url ? url : null }}
                            style={styles.postPhoto}
                        />
                    </View>
                    {allComments.length !== 0 ? (
                        allComments.map(({ commentId, comment, owner, createdAt }) => (
                            <CommentItem
                                key={commentId}
                                commentId={commentId}
                                comment={comment}
                                owner={owner}
                                createdAt={createdAt}
                            />
                        ))
                    ) : (
                        <View style={{ flex: 1, marginTop: 30, paddingHorizontal: 16 }}>
                            <Text style={styles.text}>Ще немає коментарів</Text>
                        </View>
                    )}
                </ScrollView>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.inputWrap}>
                        <TextInput
                            name="comment"
                            value={comment}
                            placeholder="Коментувати..."
                            placeholderTextColor={'#b22f2f'}
                            style={
                                isFocused
                                    ? { ...styles.input, borderColor: '#4d7342' }
                                    : { ...styles.input }
                            }
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onChangeText={value => setComment(value)}
                        />
                        <View style={styles.sendBtn}>
                            <Feather
                                onPress={sendComment}
                                name="arrow-up"
                                size={23}
                                color={'#792626'}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        paddingTop: 15,
        backgroundColor: '#4f829d',
        borderTopWidth: 1.0,
        borderBottomWidth: -0.5,
        borderTopColor: 'rgba(66, 188, 105, 0.3)',
        borderBottomColor: 'rgba(114, 162, 91, 0.3)',
    },
    postPhotoWrap: {
        width: '90%',
        height: 140,
        backgroundColor: '#4d885e',
        borderRadius: 7,
        marginBottom: 33,
    },
    postPhoto: {
        width: '80%',
        height: 241,
        borderRadius: 7,
    },
    inputWrap: {
        marginTop: 33,
        marginBottom: 17,
    },
    input: {
        height: 41,
        fontFamily: 'Roboto-Regular',
        fontSize: 17,
        backgroundColor: '#3a7275',
        borderColor: '#3a8b61',
        borderWidth: 2,
        borderRadius: 99,
        paddingTop: 16,
        paddingHorizontal: 17,
        paddingBottom: 15,
    },
    sendBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 34,
        height: 24,
        backgroundColor: '#2a3767',
        borderRadius: 100,
        position: 'sticky',
        top: 8,
        right: 8,
    },
    text: {
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        textAlign: 'center',
    },
});
