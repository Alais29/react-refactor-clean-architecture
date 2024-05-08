import React, { Dispatch, SetStateAction } from "react";

export interface User {
    id: string;
    name: string;
    isAdmin: boolean;
}

export interface AppContextState {
    currentUser: User;
    users: User[];
    setCurrentUser: Dispatch<SetStateAction<User>>;
}

export const AppContext = React.createContext<AppContextState | null>(null);
