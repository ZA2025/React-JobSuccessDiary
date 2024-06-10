import { useState, useEffect } from "react";
import { useToken } from "./useToken";

export const useUser = () => {
    const [token] = useToken();

    const getPayloadFromToken = token => {
        if (!token || token.split('.').length !== 3) {
            return null;
        }
        const encodedPayload = token.split('.')[1];
        const decodedPayload = atob(encodedPayload);
        return JSON.parse(decodedPayload);
    }

    const [user, setUser] = useState(() => {
        if (!token) {
            return null;
        }
        return getPayloadFromToken(token);
    });
    // to make sure the useEffect hook runs or fires only when the token changes [token]
    useEffect(() => {
        if (!token) {
            setUser(null);
        } else {
            setUser(getPayloadFromToken(token));
        }
    }, [token]);

    return user;
}