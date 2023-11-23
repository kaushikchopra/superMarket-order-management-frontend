import useAuth from './useAuth'
import axios from "../api/axios";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get(`/api/auth/refresh`, {
            withCredentials: true,
        });
        // console.log("useRefreshToken response: ", response);
        // console.log("useRefreshToken access token: ", response.data.accessToken);
        setAuth(prev => {
            // console.log("prev: ", JSON.stringify(prev));
            return { ...prev, accessToken: response.data.accessToken }
        });
        return response.data.accessToken;
    };
    return refresh;
}

export default useRefreshToken;