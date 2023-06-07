import {useState} from "react";
import axios from "axios";
import {useSelector} from "react-redux";


const useCreateOnedriveFolder = ()=>{
    const [reqStateForCreateOnedriveFolder, setReqStateForCreateOnedriveFolder] =  useState(0)
    // 0 -> Null State.. Doing Nothing
    // 1 -> Sent Request..Waiting
    // 2 -> Got Actual Result
    // 3 -> Couldn't Create Folder
    // 4 -> JWT Error
    // 5 -> Server Offline

    const jwtToken = useSelector(state => state.userInfoSlice.token)
    const sendRequestToCreateOnedriveFolder = (folderName)=>{
        setReqStateForCreateOnedriveFolder(1)
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/admin/onedrive/add-folder?folder_name=${encodeURI(folderName)}`,
            {headers:{"Authorization" : `Bearer ${jwtToken}`}})
            .then(res=>{
                if (res.data.code === 1){
                    setReqStateForCreateOnedriveFolder(2)
                }
                else if (res.data.code === 0){
                    setReqStateForCreateOnedriveFolder(3)
                }
            }).catch(err=>{
                if (err.response.status === 401){
                    setReqStateForCreateOnedriveFolder(4)
                }
                else{
                    setReqStateForCreateOnedriveFolder(5)
                }
        })
    }
    return {
        reqStateForCreateOnedriveFolder,
        setReqStateForCreateOnedriveFolder,
        sendRequestToCreateOnedriveFolder
    }
}

export default useCreateOnedriveFolder