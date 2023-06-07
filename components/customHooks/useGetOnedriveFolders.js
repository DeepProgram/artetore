import {useState} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {setConnectionStatus, setFolders} from "../../redux/slices/onedriveSlice";


const useGetOnedriveFolders = () =>{
    const [reqStateForOnedriveFolder, setReqStateForOnedriveFolder] = useState(0)

    // 0 -> Null State.. Doing Nothing
    // 1 -> Sent Request To Server
    // 2 -> Found Actual Result
    // 3 -> Error Found.. Need Manual Authentication
    // 4 -> Data Extraction Error. Need to Fix From Server Immediately
    // 5 -> JWT Error, Need To Log in Again
    // 6 -> Server Offline

    // const [folders, setFolders] = useState({})
    const [authUrlFromFolderReq, setAuthUrlFromFolderReq] = useState(null)

    const jwtToken = useSelector(state => state.userInfoSlice.token)
    const connected = useSelector(state => state.onedriveSlice.connectionStatus)
    const dispatch = useDispatch()
    const sendFolderReqToServer = ()=>{
        setReqStateForOnedriveFolder(1)
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/admin/onedrive/folders`,
            {headers:{"Authorization" : `Bearer ${jwtToken}`}})
            .then(response=>{
                if (response.data.code === 1){
                    setReqStateForOnedriveFolder(2)
                    if (connected === 0){
                        dispatch(setConnectionStatus({
                            connected: 1
                        }))
                    }
                    dispatch(setFolders({
                        folders: response.data.folders
                    }))
                }
                else if(response.data.code === 0){
                    setAuthUrlFromFolderReq(response.data.url)
                    setReqStateForOnedriveFolder(3)
                }
                else if (response.data.code === 99){
                    setReqStateForOnedriveFolder(4)
                }
            })
            .catch(err=>{
                if (err.response === undefined){
                    setReqStateForOnedriveFolder(6)
                }
                else{
                    if (err.response.status === 401){
                        setReqStateForOnedriveFolder(5)
                    }
                    else{
                        setReqStateForOnedriveFolder(6)
                    }
                }

            })
    }

    return {
        reqStateForOnedriveFolder,
        setReqStateForOnedriveFolder,
        authUrlFromFolderReq,
        sendFolderReqToServer
    }
}

export default useGetOnedriveFolders