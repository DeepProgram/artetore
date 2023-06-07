import {useState} from "react";
import {useSelector} from "react-redux";
import axios from "axios";

const useDeleteImageFromDB = ()=>{
    // 0 -> Nothing..Null State
    // 1 -> Sent Request To Server
    // 2 -> Operation Successful
    // 3 -> JWT Error
    // 4 -> Server Offline
    const [reqStateForDeleteImageFromDB, setReqStateForDeleteImageFromDB] = useState(0)
    const jwtToken = useSelector(state => state.userInfoSlice.token)
    const sendReqForDeleteImageFromDB = (deleteImageList)=>{
        setReqStateForDeleteImageFromDB(1)
        axios.post(`${process.env.NEXT_PUBLIC_SERVER_HOST}/admin/delete/image`,
            {
                "image_list": deleteImageList
            },
            {headers:{"Authorization" : `Bearer ${jwtToken}`}})
            .then(res=>{
                setReqStateForDeleteImageFromDB(2)
            })
            .catch(err=>{
                if (err.response === undefined){
                    setReqStateForDeleteImageFromDB(4)
                }
                else{
                    if (err.response.status === 401){
                        setReqStateForDeleteImageFromDB(3)
                    }
                    else{
                        setReqStateForDeleteImageFromDB(4)
                    }
                }
            })
    }
    return {
        reqStateForDeleteImageFromDB,
        setReqStateForDeleteImageFromDB,
        sendReqForDeleteImageFromDB
    }
}

export default useDeleteImageFromDB