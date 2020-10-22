import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import { useHistory } from "react-router-dom";
import Nweet from "components/Nweet";

const Profile = ({ userObj, refreshUser }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [nweets, setNweets] = useState([]);
    const onSignOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    const getMyNweets = async () => {
        const nweetArray = await dbService
            .collection("nweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createdAt", "desc")
            .get();
        const myNweets = nweetArray.docs.map((doc) => {
            return {
                id: doc.id, ...doc.data()
            };
        });
        setNweets(myNweets);
    };
    useEffect(() => {
        getMyNweets();
    }, []);
    const onChange = (event) => {
        const { target: { value } } = event;
        setNewDisplayName(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName
            });
            refreshUser();
        }
    }
    return (
        <div
            style={{
                maxWidth: 890,
                width: "100%",
                margin: "0 auto",
                marginTop: 80,
                display: "flex",
                justifyContent: "center",
            }}>
            <div className="container">
                <form onSubmit={onSubmit} className="profileForm">
                    <input
                        onChange={onChange}
                        type="text"
                        autoFocus
                        placeholder="Display Name"
                        value={newDisplayName}
                        className="formInput" />
                    <input
                        type="submit"
                        value="Upload Profile"
                        className="formBtn"
                        style={{
                            marginTop: 10,
                        }} />
                </form>
                <span className="formBtn cancelBtn logOut" onClick={onSignOutClick}>
                    Sign Out
            </span>
                <div style={{ marginTop: 30 }}>
                    {nweets.map((nweet) => (
                        <Nweet
                            key={nweet.id}
                            nweetObj={nweet}
                            isOwner={nweet.creatorId === userObj.uid}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
export default Profile;