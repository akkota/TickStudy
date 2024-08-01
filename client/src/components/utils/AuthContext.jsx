import { useContext, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const loginUser = async (userInfo) => {
        const email = userInfo.email;
        const password = userInfo.password;
        try {
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setUser({ email: data.email, accessToken: data.accessToken, refreshToken: data.refreshToken });
                setError(null);
                navigate('/dashboard');
            } else {
                setError(data.error);
                console.error('Login failed:', data.error);
            }
        } catch (err) {
            setError("An error occurred during login");
            console.error("Login error: ", err);
        }
    };

    const refreshToken = async () => {
        try {
            const res = await axios.post("http://localhost:5001/api/refresh", {
                token: user.refreshToken,
            });

            if (res.data.error) {
                console.error("Issue generating token");
            }

            setUser(prev => ({
                ...prev,
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
            }));

            return res.data;
        } catch (err) {
            console.error(err);
        }
    };

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(
        async (config) => {
            let currentDate = new Date();
            const decodedToken = jwtDecode(user.accessToken);
            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                const data = await refreshToken();
                config.headers["authorization"] = "Bearer " + data.accessToken;
            }

            return config;
        },
        (error) => {
            console.error(error);
            return Promise.reject(error);
        }
    );

    async function saveTime(studytime) {
        try {
            const response = await axiosJWT.post("http://localhost:5001/api/updatetime", 
                { email: user.email, studytime },
                {
                    headers: {
                        authorization: "Bearer " + user.accessToken,
                    },
                    withCredentials: true,
                }
            );
    
            if (response.data.error) {
                alert("There was an issue recording your study time.");
                navigate("/dashboard");
            } else {
                alert("Study time recorded!");
                navigate("/dashboard");
            }
        } catch (err) {
            console.error(err);
            alert("There was an issue recording your study time.");
            navigate("/dashboard");
        }
    }

    async function getStudyTime() {
        try {
            const response = await axiosJWT.post("http://localhost:5001/api/getstudytime",
                {email: user.email},
                {
                    headers: {
                        authorization: "Bearer " + user.accessToken,
                    },
                    withCredentials: true,
                }
            );
    
            if (response.data.error) {
                alert("There was an issue fetching your study time.")
                navigate(-1);
                return;
            } else {
                const studyTime = (response.data.studyTime)
                return studyTime;
            }
        } catch (err) {
            console.error(err);
            alert("There was an issue fetching your statistics")
            navigate("/dashboard");
        }

    }

    let contextData = {
        user,
        loginUser,
        saveTime,
        getStudyTime,
        error,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext;