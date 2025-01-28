import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authOperations';
import { authStateChange } from '../../redux/authSlice';
import Btn from '../../components/Buttons/Btn';
import AuthTextLink from '../../components/Buttons/AuthTextLink';

const wallpaper = require('../../images/wallpaper.png');

export default function LoginScreen() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setshowPassword] = useState(true);
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const navigation = useNavigation();

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

    const handleLoginSubmit = () => {
        if (email && password) {
            dispatch(login(email, password)).then(data => {
                if (data === undefined || !data.user) {
                    return;
                }
                dispatch(authStateChange({ stateChange: true }));
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
                            style={{ ...styles.form, height: keyboardStatus ? 530 : 450 }}
                        >
                            <Text style={styles.formTitle}>Увійти</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        borderColor:
                                            isFocused === 'emailAddress' ? '#FF6C00' : '#E8E8E8',
                                    },
                                ]}
                                placeholderTextColor={'#BDBDBD'}
                                placeholder="Адреса електронної пошти"
                                value={email}
                                textContentType="emailAddress"
                                autoCompleteType="email"
                                onBlur={handleBlur}
                                onFocus={() => handleFocus('emailAddress')}
                                onChangeText={setEmail}
                            />

                            <View style={(position = 'relative')}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        { marginBottom: 1 },
                                        {
                                            borderColor:
                                                isFocused === 'password' ? '#b1764c' : '#E8E8E8',
                                        },
                                    ]}
                                    placeholderTextColor={'#7f8754'}
                                    placeholder="Пароль"
                                    value={password}
                                    textContentType="password"
                                    autoCompleteType="off"
                                    secureTextEntry={showPassword}
                                    onBlur={handleBlur}
                                    onFocus={() => handleFocus('password')}
                                    onChangeText={setPassword}
                                />
                                {password && (
                                    <TouchableOpacity
                                        style={styles.btnShowPassword}
                                        onPress={() => setshowPassword(!showPassword)}
                                    >
                                        <Text style={styles.btnShowPasswordText}>
                                            {setPassword ? 'Показати' : 'Приховати'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <Btn
                                text="Увійти"
                                onPress={() => handleLoginSubmit(email, password)}
                            />
                            <AuthTextLink
                                text="Немає акаунту?"
                                linkText="Зареєструватися"
                                onPress={() => navigation.navigate('Registration')}
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
        backgroundColor: '#236742',
        alignItems: 'right',
        justifyContent: 'space-evenly',
    },
    backgroundImage: {
        flex: 4,
        resizeMode: 'cover',
        justifyContent: 'space-around',
        width: '27%',
        height: '72%',
    },
    form: {
        position: 'relative',
        paddingTop: 16,
        paddingBottom: 21,
        paddingHorizontal: 12,
        borderTopStartRadius: 16,
        borderTopEndRadius: 26,
        backgroundColor: '#244c2a',
        fontFamily: 'sans-serif',
        fontSize: 16,
    },
    formTitle: {
        fontFamily: 'serif',
        color: '#8b2929',
        marginBottom: 34,
        fontSize: 30,
        textAlign: 'center',
    },
    input: {
        fontFamily: 'serif',
        height: 50,
        borderRadius: 11,
        backgroundColor: '#524c7d',
        borderWidth: 3,
        color: '#ab2828',
        padding: 16,
        marginBottom: 19,
    },
    btnShowPassword: {
        position: 'relative ',
        right: 18,
        top: 15,
    },
    btnShowPasswordText: {
        color: '#58779a',
    },
});
