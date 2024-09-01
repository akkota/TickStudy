import { useContext, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import  Alert  from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [coins, setCoins] = useState(null);
    const [userID, setUserID] = useState(null);

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
                setUserID(data.user_id);
                setCoins(data.coins);
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
                console.log("Not recorded")
                window.alert("There was an issue recording your study time.");
                navigate("/dashboard");
            } else {
                console.log("Recorded")
                navigate("/statistics");
            }
        } catch (err) {
            console.error(err);
            window.alert("There was an issue recording your study time.");
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
                window.alert("There was an issue fetching your study time.")
                navigate(-1);
                return;
            } else {
                const studyTime = (response.data.studyTime)
                return studyTime;
            }
        } catch (err) {
            console.error(err);
            window.alert("There was an issue fetching your statistics")
            navigate(-1);
        }

    }

    async function getStudyTimeStat() {
        try {
            const response = await axiosJWT.post("http://localhost:5001/api/getstudytimestat",
                {email: user.email},
                {
                    headers: {
                        authorization: "Bearer " + user.accessToken,
                    },
                    withCredentials: true,
                }
            ); 

            if (response.data.error) {
                window.lert("There was an issue fetching your study time.")
                navigate(-1);
                return;
            } else {
                const studyStat = (response.data.studyStat)
                return studyStat;
            }

        } catch (err) {
            console.error(err);
            window.alert("There was an issue fetching your statistics");
            navigate(-1);
        }
    }

    async function getTasks() {
        try {
            const response = await axiosJWT.post("http://localhost:5001/api/gettasks", 
                {email: user.email},
                {
                    headers: {
                        authorization: "Bearer " + user.accessToken
                    },
                    withCredentials: true,
                }
            );

            const tasks = response.data.tasks
            return tasks

        } catch (err) {
            console.error(err);
            window.alert("Issue fetching tasks")
            navigate(-1)
            return;
        }
    }

    async function addTask(taskTitle, priority) {
        try {
            const response = await axiosJWT.post("http://localhost:5001/api/addtasks", 
                {email: user.email, taskTitle, priority}, 
                {
                    headers: {
                        authorization: "Bearer " + user.accessToken
                    },
                    withCredentials: true,
                }
            )

            if (response.data.error) {
                window.alert("Issue adding task");
                navigate(-1)
                return;
            } else {
                return response.data.message
            }
        } catch (err) {
            console.error(err);
            window.alert("Issue adding task")
            return;
        }
    }

    async function removeTask(taskTitle) {
        try {
            const response = await axiosJWT.post("http://localhost:5001/api/removetasks", 
                {email: user.email, taskTitle},
                {
                    headers: {
                        authorization: "Bearer " + user.accessToken
                    },
                    withCredentials: true,
                }
            )
    
            if (response.data.error) {
                return "Issue removing task";
            } else {
                return (response.data.message);
            }
        } catch (err) {
            console.error(err);
            return "Issue removing task";
        }
        
    }

    async function updateStreak() {
        try {
            const response = await axiosJWT.post("http://localhost:5001/api/updatestreak", 
                {email: user.email},
                {
                    headers: {
                        authorization: "Bearer " + user.accessToken
                    },
                    withCredentials: true,
                }
            )

            if (response.data.error) {
                window.alert("Issue updating streak");
            }

        } catch (err) {
            console.error(err);
        }
    }

    async function getStreak() {
        try {
            const response = await axiosJWT.post("http://localhost:5001/api/getstreak", 
                {email: user.email},
                {
                    headers: {
                        authorization: "Bearer " + user.accessToken
                    },
                    withCredentials: true,
                }
            )

            if (response.data.error) {
                window.alert("Issue getting streak");
                navigate(-1);
            } else {
                return response.data.streak;
            }

        } catch (err) {
            console.error(err);
        }
    }

    async function submitHabit(habitTitle) {

        try {
            const response = await axiosJWT.post("http://localhost:5001/api/addhabit", 
                {email: user.email, habitTitle},
                {
                    headers: {
                        authorization: "Bearer " + user.accessToken
                    },
                    withCredentials: true,
                }
            )
    
            if (response.data.error) {
                window.alert("Issue submitting habit");
                navigate(-1);
                return;
            } else {
                return response.data.message;
            }

        } catch (err) {
            console.error(err);
        }
    }

    async function getHabit() {

        try {
            const response = await axiosJWT.post("http://localhost:5001/api/gethabit", 
                {email: user.email},
                {
                    headers: {
                        authorization: "Bearer " + user.accessToken
                    },
                    withCredentials: true,
                }
            )

            if (response.data.error) {
                window.alert("Issue getting habit");
                navigate(-1);
                return;
            } else {
                return response.data.habits
            }
        } catch (err) {
            console.error(err);
        }

    }

    async function updateStreakHabit(habitName) {
        try {
            const response = await axiosJWT.post("http://localhost:5001/api/updatestreakhabit",
                {email: user.email, habitName},
                {
                    headers: {
                        authorization: "Bearer " + user.accessToken
                    },
                    withCredentials: true,
                }
            )

            if (response.data.error) {
                window.alert("Could not update streak");
                navigate(-1);
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function getCoins() {
        try {
            const response = await axiosJWT.post("http://localhost:5001/api/getcoins",
                {email: user.email},
                {
                    headers: {
                        authorization: "Bearer " + user.accessToken
                    },
                    withCredentials: true,
                }
            )

            if (response.data.error) {
                window.alert("Could not get coins");
                return;
            }

            return response.data.coins
        } catch (err) {
            console.error(err);
        }
    }

    async function handleShopBuy(shopItem, itemCost) {
        setCoins(coins - itemCost);
        try {
            const response = await axiosJWT.post("http://localhost:5001/api/updateshop",
                {email: user.email, shopItem},
                {
                    headers: {
                        authorization: "Bearer " + user.accessToken
                    },
                    withCredentials: true,
                }
            )

            if (response.data.error) {
                window.alert("Could not buy item");
                return;
            }


        } catch (err) {
            console.error(err);
        }
    }

    async function getShopBought() {
        try {
            const response = await axiosJWT.post("http://localhost:5001/api/getshop", 
                {email: user.email},
                {
                    headers: {
                        authorization: "Bearer " + user.accessToken
                    },
                    withCredentials: true,
                }
            )

            if (response.data.error) {
                window.alert("Issue fetching item bought");
                return;
            }

            return response.data.boughtItems;
        } catch (err) {
            console.error(err);
        }
    }

    async function getLeaderboardData() {
        try {

            const response = await axiosJWT.post("http://localhost:5001/api/getleaderboard", 
                {email: user.email},
                {
                    headers: {
                        authorization: "Bearer " + user.accessToken
                    },
                    withCredentials: true,
                }
            )
            
            if (response.data.error) {
                window.alert("Issue fetching leaderboard data");
                return;
            }

            return response.data.result;

        } catch (err) {
            console.error(err);
        }
    }

    let contextData = {
        user,
        userID,
        coins,
        setCoins,
        loginUser,
        saveTime,
        getStudyTime,
        getTasks,
        addTask,
        removeTask,
        getShopBought,
        alert,
        getStreak,
        getStudyTimeStat,
        updateStreak,
        setAlert,
        submitHabit,
        updateStreakHabit,
        getHabit,
        getCoins,
        handleShopBuy,
        getLeaderboardData,
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