import {useState} from "react";
import axios from "axios";
import {useSelector} from "react-redux";


const useAddImagInDatabase = ()=>{
    const [reqStateForAddImageInDatabase, setReqStateForAddImageInDatabase] = useState(0)
    // 0 -> Null State
    // 1 -> Sent Request
    // 2 -> Got Result
    // 3 -> Got Error
    // 4 -> JWT Error
    // 5 -> Server Offline

    const jwtToken = useSelector(state => state.userInfoSlice.token)
    const sendReqForAddImageInDatabase = (imageList)=>{
        setReqStateForAddImageInDatabase(1)
        axios.post(`${process.env.NEXT_PUBLIC_SERVER_HOST}/admin/add/image`,
            {
                "image_list": imageList
            },
            {headers:{"Authorization" : `Bearer ${jwtToken}`}})
            .then(res=>{
                if (res.data.code === 1){
                    setReqStateForAddImageInDatabase(2)
                }
            })
            .catch(err=>{
                if (err.response === undefined){
                    setReqStateForAddImageInDatabase(5)
                }
                else{
                    if (err.response.status === 401){
                        setReqStateForAddImageInDatabase(4)
                    }
                    else{
                        setReqStateForAddImageInDatabase(5)
                    }
                }
            })
    }
    return{
        reqStateForAddImageInDatabase,
        setReqStateForAddImageInDatabase,
        sendReqForAddImageInDatabase
    }
}

export default useAddImagInDatabase