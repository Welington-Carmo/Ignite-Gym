import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useTheme } from "native-base";
import { createBottomTabNavigator, BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NotificationWillDisplayEvent, OneSignal, OSNotification } from "react-native-onesignal";

import HomeSvg from '@assets/home.svg'
import HistorySvg from '@assets/history.svg'
import ProfileSvg from '@assets/profile.svg'



import Home from "@screens/Home";
import History from "@screens/History";
import Profile from "@screens/Profile";
import Exercise from "@screens/Exercise";
import { Notification } from "@components/Notification";


type AppRoutes = {
    home: undefined;
    history: undefined;
    profile: undefined;
    exercise: {
        exerciseId: string;
    };
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export default function AppRoutes() {
    const { sizes, colors } = useTheme();
    const [notification, setNotification] = useState<OSNotification>();


    const IconSize = sizes[6];

    useEffect(() => {
        const handleNotification = (event: NotificationWillDisplayEvent): void => {
            event.preventDefault();
            const response = event.getNotification();
            setNotification(response);
        }

        OneSignal.Notifications.addEventListener(
            'foregroundWillDisplay',
            handleNotification
        )

        return () => OneSignal.Notifications.removeEventListener(
            'foregroundWillDisplay',
            handleNotification)
    }, []);

    return (
        <>
            <Navigator screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.green[500],
                tabBarInactiveTintColor: colors.gray[200],
                tabBarStyle: {
                    backgroundColor: colors.gray[600],
                    borderTopWidth: 0,
                    height: Platform.OS === 'android' ? 'auto' : 96,
                    paddingBottom: sizes[10],
                    paddingTop: sizes[6]
                }
            }}>
                <Screen
                    name="home"
                    component={Home}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <HomeSvg fill={color} width={IconSize} height={IconSize} />
                        ),
                    }}
                />
                <Screen
                    name="history"
                    component={History}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <HistorySvg fill={color} width={IconSize} height={IconSize} />
                        ),
                    }}
                />
                <Screen
                    name="profile"
                    component={Profile}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <ProfileSvg fill={color} width={IconSize} height={IconSize} />
                        ),
                    }}
                />
                <Screen
                    name="exercise"
                    component={Exercise}
                    options={{ tabBarButton: () => null }}
                />
            </Navigator>

            {
                notification &&
                <Notification data={notification} onClose={() => setNotification(undefined)} />
            }
        </>
    );
}
