import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
    const [init, setInit] = useState(false);
    const [userObj, setUserObj] = useState(null);
    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setUserObj({
                    displayName: user.displayName,
                    uid: user.uid,
                    updateProfile: (args) => user.updateProfile(args),
                    email: user.email
                });
            } else {
                setUserObj(null);
            }
            setInit(true);
        });
    }, []);
    const refreshUser = () => {
        const user = authService.currentUser;
        setUserObj({
            displayName: user.displayName,
            uid: user.uid,
            updateProfile: (args) => user.updateProfile(args),
            email: user.email
        });
    };
    return (
        <>
            {init ?
                <AppRouter
                    refreshUser={refreshUser}
                    isLoggedIn={Boolean(userObj)}
                    userObj={userObj} /> : "Initializing...."}
            <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
        </>
    );
}

export default App;