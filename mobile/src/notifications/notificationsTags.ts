import { OneSignal } from 'react-native-onesignal';

import { UserDTO } from '@dtos/UserDTO';

export function tagUserInfoCreate(user?: UserDTO) {
    if (user) {
        OneSignal.User.addTag('user_name', user.name);
    } else {
        OneSignal.User.removeTag('user_name');
    }
}

export function tagHystoryUpdate(date?: string) {
    if (date) {
        OneSignal.User.addTag('last_register', date);
    } else {
        OneSignal.User.removeTag('last_register');
    }
}