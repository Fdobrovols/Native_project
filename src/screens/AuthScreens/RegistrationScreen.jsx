import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
    StyleSheet,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Image,
    ImageBackground,
} from 'react-native';
import {
    AntDesign,
    MaterialCommunityIcons,
    Ionicons,
} from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { register } from '../../redux/authOperations';
import { storage } from '../../firebase/config';
import Btn from '../../components/Buttons/Btn';
import AuthTextLink from '../../components/Buttons/AuthTextLink';

const wallpaper = require('../../images/wallpaper.png');
const userlogo = require('../../images/userlogo.png');

export default function RegisterScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [openCamera, setOpenCamera] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardStatus(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardStatus(false);
        });
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const handleFocus = key => {
        setIsFocused(key);
    }

    const handleBlur = () => {
        setIsFocused('');
    }

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            await MediaLibrary.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const makePhoto = async () => {
        if (cameraRef) {
            const { uri } = await cameraRef.takePictureAsync();
            setAvatar(uri);
            setOpenCamera(false);
        }
    }

    const uploadPhotoToServer = async () => {
        const uniqPostId = Date.now().toString();
        try {
            const response = await fetch(avatar);
            const file = await response.blob();
            const imageRef = ref(storage, `avatarImage/${uniqPostId}`);
            await uploadBytes(imageRef, file);
            const processedPhoto = await getDownloadURL(imageRef);
            return processedPhoto;
        }
        catch (error) {
            console.log('error', error.message);
        }
    }

    const handleRegisterSubmit = async (name, email, password) => {
        if (name && email && password) {
            const photo = avatar ? await uploadPhotoToServer() : '';

            dispatch(register(name, email, password, photo)).then(data => {
                if (data === undefined || !data.uid) {
                    return;
                }
                setName('');
                setEmail('');
                setPassword('');
            });
            return;
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <ImageBackground source={wallpaper} style={styles.backgroundImage}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1, justifyContent: 'flex-end' }}
                    >
                        <View
                            style={{ ...styles.form, height: keyboardStatus ? 690 : 540 }}
                        >
                            <View style={styles.avatarWrap}>
                                {openCamera ? (
                                    <Camera
                                        style={styles.avatar}
                                        type={type}
                                        ref={setCameraRef}
                                        ratio="1:1"
                                    >
                                        <TouchableOpacity
                                            style={styles.cameraRevers}
                                            onPress={() => {
                                                setType(
                                                    type === Camera.Constants.Type.front
                                                        ? Camera.Constants.Type.back
                                                        : Camera.Constants.Type.front
                                                );
                                            }}
                                        >
                                            <MaterialCommunityIcons
                                                name="camera-flip"
                                                size={23}
                                                color={'#bdbdbd'}
                                            />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.cameraBtnPos}
                                            onPress={makePhoto}
                                        >
                                            <Ionicons name="ios-camera" size={23} color={'#755e5e'} />
                                        </TouchableOpacity>
                                    </Camera>
                                ) : (
                                    <Image
                                        source={avatar ? { uri: avatar } : userlogo}
                                        style={styles.avatar}
                                        alt="User photo"
                                    />
                                )}

                                <TouchableOpacity style={styles.btnAdd}>
                                    {!avatar ? (
                                        <AntDesign
                                            name="pluscircleo"
                                            size={25}
                                            color={'#b28260'}
                                            onPress={() => {
                                                setAvatar(null);
                                                setOpenCamera(true);
                                            }}
                                        />
                                    ) : (
                                        <AntDesign
                                            name="closecircleo"
                                            size={25}
                                            color={'#b0aeae'}
                                            onPress={() => {
                                                setAvatar(null);
                                                setOpenCamera(false);
                                            }}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.formTitle}>Реєстрація</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        borderColor:
                                            isFocused === 'username' ? '#648765' : '#E8E8E8',
                                    },
                                ]}
                                placeholderTextColor={'#37423e'}
                                placeholder="Логін"
                                value={name}
                                textContentType="username"
                                autoCompleteType="off"
                                onBlur={handleBlur}
                                onFocus={() => handleFocus('username')}
                                onChangeText={value => setName(value)}
                            />

                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        borderColor:
                                            isFocused === 'emailAddress' ? '#FF6C00' : '#E8E8E8',
                                    },
                                ]}
                                placeholderTextColor={'#872f2f'}
                                placeholder="Адреса електронної пошти"
                                value={email}
                                textContentType="emailAddress"
                                autoCompleteType="off"
                                onBlur={handleBlur}
                                onFocus={() => handleFocus('emailAddress')}
                                onChangeText={value => setEmail(value)}
                            />

                            <View style={(position = 'fixed')}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        { marginBottom: 0 },
                                        {
                                            borderColor:
                                                isFocused === 'password' ? '#FF6C00' : '#E8E8E8',
                                        },
                                    ]}
                                    placeholderTextColor={'#BDBDBD'}
                                    placeholder="Пароль"
                                    value={password}
                                    textContentType="password"
                                    autoCompleteType="off"
                                    secureTextEntry={showPassword}
                                    onBlur={handleBlur}
                                    onFocus={() => handleFocus('password')}
                                    onChangeText={value => setPassword(value)}
                                />
                                {password && (
                                    <TouchableOpacity
                                        style={styles.btnShowPassword}
                                        onPress={() => setShowPassword(!showPassword)}
                                    >
                                        <Text style={styles.btnShowPasswordText}>
                                            {showPassword ? 'Показати' : 'Приховати'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <Btn
                                text="Зареєстуватися"
                                onPress={() => handleRegisterSubmit(name, email, password)}
                            />
                            <AuthTextLink
                                text="Вже є акаунт?"
                                linkText="Увійти"
                                onPress={() => navigation.navigate('Login')}
                            />
                        </View>
                    </KeyboardAvoidingView>
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: '#39704f',
        alignItems: 'left',
        justifyContent: 'flex-end',
    },
    backgroundImage: {
        flex: 2,
        resizeMode: 'cover',
        justifyContent: 'flex-end',
        width: '89%',
        height: '13%',
    },
    avatarWrap: {
        position: 'absolute',
        top: -30,
        left: '30%',
        transform: [{ translateX: -25 }],
        width: 120,
        height: 120,
        backgroundColor: '#8f5757',
        borderRadius: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 16,
        backgroundColor: '#406b71',
    },
    cameraBtnPos: {
        position: 'absolute',
        bottom: 6,
        left: 5,
    },
    cameraRevers: {
        position: 'fixed',
        top: 6,
        right: 2,
    },
    btnAdd: {
        position: 'absolute',
        top: 76,
        right: -13,
        width: 26,
        height: 25,
        backgroundColor: '#2d8d50',
        borderRadius: 50,
    },
    form: {
        position: 'relative',
        paddingTop: 95,
        paddingBottom: 41,
        paddingHorizontal: 19,
        borderTopStartRadius: 25,
        borderTopEndRadius: 26,
        backgroundColor: '#3d555b',
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
    },
    formTitle: {
        fontFamily: 'Roboto-Medium',
        color: '#369f7e',
        marginBottom: 33,
        fontSize: 32,
        textAlign: 'center',
    },
    input: {
        fontFamily: 'Roboto-Regular',
        height: 7,
        borderRadius: 10,
        backgroundColor: '#4cad41',
        borderWidth: 3,
        color: '#4fac69',
        padding: 17,
        marginBottom: 16,
    },
    btnShowPassword: {
        position: 'absolute',
        right: 18,
        top: 17,
    },
    btnShowPasswordText: {
        color: '#55b941',
    },
});
