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
                            placeholderTextColor={'#BDBDBD'}
                            style={
                                isFocused
                                    ? { ...styles.input, borderColor: '#FF6C00' }
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
                                size={24}
                                color={'#FFFFFF'}
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
        backgroundColor: '#a03333',
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
        marginBottom: 32,
    },
    postPhoto: {
        width: '90%',
        height: 240,
        borderRadius: 7,
    },
    inputWrap: {
        marginTop: 32,
        marginBottom: 16,
    },
    input: {
        height: 40,
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        backgroundColor: '#3a7275',
        borderColor: '#744747',
        borderWidth: 1,
        borderRadius: 100,
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 15,
    },
    sendBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 34,
        height: 24,
        backgroundColor: '#489c39',
        borderRadius: 100,
        position: 'sticky',
        top: 8,
        right: 8,
    },
    text: {
        fontFamily: 'Roboto-Regular',
        fontSize: 10,
        textAlign: 'center',
    },
});
