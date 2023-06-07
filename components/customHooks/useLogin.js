import {useState} from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import {setToken} from "../../redux/slices/userInfoSlice";

const useLogin = ()=>{
    const [reqToServerState, setReqToServerState] = useState(0)
    // 0 -> Null State
    // 1 -> Sent Request
    // 2 -> Login Successful
    // 3 -> Login Failed
    // 4 -> Got Error

    const dispatch = useDispatch()

    const sendLoginRequest = (userName, passWord)=>{
        setReqToServerState(1)
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/login/?username=${encodeURI(userName)}&password=${encodeURI(passWord)}`,
            {
                timeout: 20000
            })
            .then(response=>{
                if (response.data.code === 2){
                    dispatch(setToken({
                        token: response.data.token
                    }))
                    localStorage.setItem("token", response.data.token)
                    setReqToServerState(2)
                }
                else{
                    setReqToServerState(3)
                }

            })
            .catch(err=>{
                setReqToServerState(4)
            })
    }
    return {
        reqToServerState,
        setReqToServerState,
        sendLoginRequest
    }
}

export default useLogin