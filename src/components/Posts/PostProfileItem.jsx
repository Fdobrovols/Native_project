import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { deleteLike, deletePost, sendLike } from '../../firebase/firestoreUtils';

export default function PostProfileItem({ id, title, photoLocation, url, geoLocation }) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const name = useSelector(state => state.auth.name);
    const userId = useSelector(state => state.auth.userId);
    const avatar = useSelector(state => state.auth.avatar);
    const [allComments, setAllComments] = useState([]);
    const [allLikes, setAllLikes] = useState([]);
    const [userPutLike, setUserPutLike] = useState(false);

    useEffect(() => {
        const commentsRef = collection(db, 'posts', id, 'comments');
        onSnapshot(commentsRef, data => {
            const dbComments = data.docs.map(doc => ({
                commentId: doc.id,
                ...doc.data(),
            }));
            setAllComments(dbComments);
        });
    }, []);

    useEffect(() => {
        const likesRef = collection(db, 'posts', id, 'likes');
        onSnapshot(likesRef, data => {
            const dbLikes = data.docs.map(doc => ({
                likeId: doc.id,
                ...doc.data(),
            }));
            const didUserPutLike = dbLikes.some(dbLike => dbLike.likeId === userId);
            setUserPutLike(didUserPutLike);
            setAllLikes(dbLikes);
        });
    }, []);

    const handleLikes = async () => {
        if (!userPutLike) {
            await sendLike(id, userId, name, avatar);
            return;
        }
        await deleteLike(id, userId);
    }

    return (
        <View style={styles.postContainer}>
            <View style={styles.postPhotoWrap}>
                <Image source={{ uri: url }} style={styles.postPhoto} alt={title} />
                <TouchableOpacity
                    style={styles.trashBtn}
                    onPress={() => dispatch(deletePost(id))}
                >
                    <Feather name="trash-2" size={20} color={'#9e9d9d'} />
                </TouchableOpacity>
            </View>
            <Text style={styles.postTitle}>{title}</Text>
            <View style={styles.postDetails}>
                <TouchableOpacity
                    style={styles.postData}
                    onPress={() => navigation.navigate('Comments', { url, id })}
                >
                    <Feather
                        name={'message-circle'}
                        size={24}
                        color={allComments.length === 0 ? '#5c886e' : '#00fbff'}
                    />
                    <Text style={styles.commentText}>{allComments.length}</Text>
                </TouchableOpacity>
                <View style={{ ...styles.postData, marginLeft: 25 }}>
                    <Feather
                        name="thumbs-up"
                        size={23}
                        color={!userPutLike ? '#3e9a69' : '#FF6C00'}
                        onPress={handleLikes}
                    />
                    <Text style={styles.commentText}>{allLikes.length}</Text>
                </View>
                <View style={styles.postLocation}>
                    <Feather name="map-pin" size={23} color={'#2130bb'} />
                    <Text
                        style={styles.locationText}
                        onPress={() =>
                            navigation.navigate('Map', { geoLocation, photoLocation })
                        }
                    >
                        {photoLocation}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        marginTop: 16,
    },
    postPhotoWrap: {
        width: '100%',
        height: 240,
        backgroundColor: '#f11e96',
        borderRadius: 7,
    },
    postPhoto: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    trashBtn: {
        height: 31,
        width: 30,
        borderRadius: 91,
        justifyContent: 'left',
        alignItems: 'center',
        backgroundColor: '#334d63',
        position: 'fixed',
        top: 11,
        right: 12,
        zIndex: 1,
    },
    postTitle: {
        marginTop: 9,
        fontFamily: 'Roboto-Medium',
        color: '#6cda35',
        fontSize: 16,
    },
    postDetails: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 8,
    },
    postData: {
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
    },
    postLocation: {
        marginLeft: 'auto',
        display: 'flex',
        flexDirection: 'row',
        gap: 4,
    },
    commentText: {
        fontFamily: 'Roboto-Regular',
        color: '#b4623',
        fontSize: 16,
    },
    locationText: {
        fontFamily: 'Roboto-Regular',
        color: '#3d495511',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
