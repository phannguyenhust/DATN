import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import hook useNavigation
import Background from '../components/Background';
import BackButton from '../components/BackButton';
import { Navigation } from '../types';

type Props = {
    navigation: Navigation;
};

const ProfileScreen = ({ navigation }: Props) => {
    const nav = useNavigation(); // Sử dụng hook useNavigation

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <BackButton goBack={() => nav.goBack()} />
            <View >
                <Text style = {{color: 'black'}}>Profile Screen</Text>
            </View>
        </View>
    );
};

export default ProfileScreen;
