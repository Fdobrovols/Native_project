import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { deleteLike, sendLike } from '../../firebase/firestoreUtils';

export default function PostItem({ id, title, photoLocation, url, geoLocation }) {
    const navigation = useNavigation();
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
            </View>
            <Text style={styles.postTitle}>{title}</Text>
            <View style={styles.postDetails}>
                <TouchableOpacity
                    style={styles.postComments}
                    onPress={() => navigation.navigate('Comments', { url, id })}
                >
                    <Feather name="message-circle" size={24} style={styles.postIcon} />
                    <Text style={styles.commentText}>{allComments.length}</Text>
                </TouchableOpacity>
                <View style={{ ...styles.postComments, marginLeft: 24 }}>
                    <Feather
                        name="thumbs-up"
                        size={24}
                        color={!userPutLike ? '#BDBDBD' : '#6ab084'}
                        onPress={handleLikes}
                    />
                    <Text style={styles.commentText}>{allLikes.length}</Text>
                </View>
                <TouchableOpacity
                    style={styles.postLocation}
                    onPress={() =>
                        navigation.navigate('Map', { geoLocation, photoLocation })
                    }
                >
                    <Feather name="map-pin" size={22} style={styles.locationIcon} />
                    <Text style={styles.locationText}>{photoLocation}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        marginBottom: 16,
    },
    postPhotoWrap: {
        width: '100%',
        height: 240,
        backgroundColor: '#763939',
        borderRadius: 9,
    },
    postPhoto: {
        width: '100%',
        height: 220,
        borderRadius: 7,
    },
    postTitle: {
        marginTop: 8,
        fontFamily: 'Roboto-Medium',
        color: '#1c0e38',
        fontSize: 16,
    },
    postDetails: {
        display: 'inline',
        flexDirection: 'row',
        marginTop: 6,
        justifyContent: 'space-between',
    },
    postComments: {
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
    },
    postLocation: {
        marginLeft: 'auto',
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
    },
    commentText: {
        fontFamily: 'Roboto-Regular',
        color: '#0203030',
        fontSize: 16,
    },
    locationText: {
        fontFamily: 'Roboto-Regular',
        color: '#3b71c2',
        fontSize: 14,
        textDecorationLine: 'revert',
    },
    postIcon: {
        color: '#38993d',
    },
    locationIcon: {
        color: '#348a5f',
    },
});
