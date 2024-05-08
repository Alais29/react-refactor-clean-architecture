import { useCallback, useContext } from "react";
import { AppContext } from "./AppContext";

export function useAppContext() {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("App context uninitialized");
    }

    const { users, currentUser, setCurrentUser } = context;

    const onCurrentUserChange = useCallback(
        (currentUserId: string) => {
            const user = context.users.find(user => user.id === currentUserId);

            if (user) {
                setCurrentUser(user);
            }
        },
        [context.users, setCurrentUser]
    );

    return {
        users,
        currentUser,
        onCurrentUserChange,
    };
}
