import {useState} from "react";
import {useSelector} from "react-redux";
import axios from "axios";


const useRenameOnedriveItem = ()=>{
    const [reqRenameItemState, setReqRenameItemState] = useState(0)

    // 0 -> Do Nothing.. Null State
    // 1 -> Sent Request And Waiting
    // 2 -> Found Actual Result
    // 3 -> Rename Unsuccessful
    // 4 -> JWT Error.. Login Again
    // 5 -> Server Offline

    const jwtToken = useSelector(state => state.userInfoSlice.token)
    const sendReqForItemRename = (itemId, newName)=>{
        setReqRenameItemState(1)
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/admin/onedrive/rename?item_id=${itemId}&new_name=${encodeURI(newName)}`,
            {headers:{"Authorization" : `Bearer ${jwtToken}`}})
            .then(response=>{
                if (response.data.code === 1){
                    setReqRenameItemState(2)
                }
                else if(response.data.code === 0){
                    setReqRenameItemState(3)
                }
            }).catch(err=>{
                if (err.response.status === 401){
                    setReqRenameItemState(4)
                }
                else{
                    setReqRenameItemState(5)
                }
        })
    }
    return {
        reqRenameItemState,
        setReqRenameItemState,
        sendReqForItemRename
    }
}

export default useRenameOnedriveItem