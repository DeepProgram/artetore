import {useState} from "react";
import axios from "axios";


const useAuthJWT = ()=>{
    const [requestStatusForAuthJWT, setRequestStatusForAuthJWT] = useState(0)

    // 0 -> Null State Doing Nothing
    // 1 -> Sent Request
    // 2 -> Got Good Result
    // 3 -> Got Invalid Result
    // 4 -> Got Authorization Error
    // 5 -> Got Server Error
    const sendRequestForAuthJWT = ()=>{
        setRequestStatusForAuthJWT(1)
        const jwtToken = localStorage.getItem("token")
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/auth`,{
            headers: {"Authorization" : `Bearer ${jwtToken}`}
        }).then(response=>{
            if (response.data.code === 1){
                setRequestStatusForAuthJWT(2)
            }
            else{
                setRequestStatusForAuthJWT(3)
            }
        }).catch(err=>{
            if (err.response.status === 401){
                setRequestStatusForAuthJWT(4)
            }
            else{
                setRequestStatusForAuthJWT(5)
            }
        })
    }
    return {
        requestStatusForAuthJWT,
        setRequestStatusForAuthJWT,
        sendRequestForAuthJWT
    }
}

export default useAuthJWT