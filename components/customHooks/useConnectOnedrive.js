import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setConnectionStatus} from "../../redux/slices/onedriveSlice";

const useConnectOnedrive = ()=>{
    const [requestStateForOneDriveConnection, setRequestStateForOneDriveConnection] = useState(0)

    // 0 -> Null State.. Doing Nothing
    // 1 -> Request Sent
    // 2 -> Got Actual Result
    // 3 -> Couldn't Connect.. Manual Authorization Required
    // 4 -> Unauthorized Access
    // 5 -> Server Offline

    const [authUrl, setAuthUrl] = useState(null)
    const jwtToken = useSelector(state => state.userInfoSlice.token)
    const dispatch = useDispatch()
    const sendConnectionRequestForOnedrive = ()=>{
        setRequestStateForOneDriveConnection(1)
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/admin/onedrive/connect`,
            {headers:{"Authorization" : `Bearer ${jwtToken}`}})
            .then(response=>{
                if (response.data.code === 1){
                    dispatch(setConnectionStatus({
                        connected: 1
                    }))
                    setRequestStateForOneDriveConnection(2)
                }
                else if (response.data.code === 0){
                    setAuthUrl(response.data.url)
                    setRequestStateForOneDriveConnection(3)
                }
            })
            .catch(err=>{
                if (err.response === undefined){
                    setRequestStateForOneDriveConnection(5)
                }
                else{
                    if (err.response.status === 401){
                        setRequestStateForOneDriveConnection(4)
                    }
                    else{
                        setRequestStateForOneDriveConnection(5)
                    }
                }

            })
    }
    return {
        requestStateForOneDriveConnection,
        setRequestStateForOneDriveConnection,
        sendConnectionRequestForOnedrive,
        authUrl
    }
}

export default useConnectOnedrive