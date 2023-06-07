import {useState} from "react";
import axios from "axios";
import {useSelector} from "react-redux";


const useDeleteOnedriveFolder = ()=>{
    const [reqStateForDeleteOnedriveFolder, setReqStateForDeleteOnedriveFolder] =  useState(0)
    // 0 -> Null State.. Doing Nothing
    // 1 -> Sent Request..Waiting
    // 2 -> Got Actual Result
    // 3 -> Couldn't Create Folder
    // 4 -> JWT Error
    // 5 -> Server Offline

    const jwtToken = useSelector(state => state.userInfoSlice.token)
    const sendRequestToDeleteOnedriveFolder = (folderId)=>{
        setReqStateForDeleteOnedriveFolder(1)
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/admin/onedrive/delete-folder?folder_id=${encodeURI(folderId)}`,
            {headers:{"Authorization" : `Bearer ${jwtToken}`}})
            .then(res=>{
                if (res.data.code === 1){
                    setReqStateForDeleteOnedriveFolder(2)
                }
                else if (res.data.code === 0){
                    setReqStateForDeleteOnedriveFolder(3)
                }
            }).catch(err=>{
                if (err.response.status === 401){
                    setReqStateForDeleteOnedriveFolder(4)
                }
                else{
                    setReqStateForDeleteOnedriveFolder(5)
                }
        })
    }
    return {
        reqStateForDeleteOnedriveFolder,
        setReqStateForDeleteOnedriveFolder,
        sendRequestToDeleteOnedriveFolder
    }
}

export default useDeleteOnedriveFolder