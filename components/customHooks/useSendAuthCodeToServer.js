import axios from "axios";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {setConnectionStatus} from "../../redux/slices/onedriveSlice";

const useSendAuthCodeToServer = ()=>{
    const [sentRequestForSendingAuthUrl, setSentRequestForSendingAuthUrl] = useState(false)
    const [foundTokens, setFoundTokens] = useState(null)
    const [foundError, setFoundError] = useState(false)
    const [authUrl, setAuthUrl] = useState(null)
    const dispatch = useDispatch()

    const sendAuthCodeToServer = (authCode)=>{
        const jwtToken = localStorage.getItem("token")
        axios.post("http://127.0.0.1:8000/admin/auth/code",{
            "auth_code": authCode
        }, { headers: {"Authorization" : `Bearer ${jwtToken}`}})
            .then(response=>{
                if (response.data.code === 1){
                    setFoundTokens(true)
                    dispatch(setConnectionStatus(
                        {
                            connected: 1
                        }
                    ))
                }
                else{
                    setFoundTokens(false)
                    setAuthUrl(response.data.url)
                }
            })
            .catch(err=>{
                setFoundError(false)
            })
    }
    return {
        sentRequestForSendingAuthUrl,
        foundTokens,
        foundError,
        authUrl,
        sendAuthCodeToServer
    }
}

export default useSendAuthCodeToServer