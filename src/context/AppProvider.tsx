import { useState } from "react";
import { AppContext, User } from "./AppContext";

const adminUser: User = { id: "user1", name: "Admin user", isAdmin: true };

const users: User[] = [adminUser, { id: "user2", name: "Non admin user", isAdmin: false }];

interface AppProviderProps {
    children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User>(adminUser);

    return (
        <AppContext.Provider value={{ users, currentUser, setCurrentUser }}>
            {children}
        </AppContext.Provider>
    );
};
