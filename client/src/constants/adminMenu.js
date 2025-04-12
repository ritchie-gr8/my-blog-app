import { Bell, FileText, Grid, Key, User } from "lucide-react";

export const adminMenu = [
    {
        id: 'a1ac1014-cbaf-4d07-ac77-2715f2570669',
        title: "Article management",
        icon: FileText,
        tab: "article",
    },
    {
        id: '099a760d-0ef1-4ac9-be14-d1e6971f0bda',
        title: "Category management",
        icon: Grid,
        tab: "category",
    },
    {
        id: '3ea33318-741c-4797-bf26-37367a6ca721',
        title: "Profile",
        icon: User,
        tab: "profile",
    },
    {
        id: 'a80625f8-d244-4c90-a5be-35ea18d5faa0',
        title: "Notification",
        icon: Bell,
        tab: "notification",
    },
    {
        id: 'bfeb783f-4182-4d87-9d5a-00eb3790f83f',
        title: "Reset password",
        icon: Key,
        tab: "reset-password",
    },
];