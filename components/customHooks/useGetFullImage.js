import {useState} from "react";
import axios from "axios";


const useGetFullImage = ()=>{
    // 0 -> Null State.. Doing Nothing
    // 1 -> Sent Request
    // 2 -> Got Result
    // 3 -> Failed To Get Full Image
    // 4 -> Server Offline
    const [reqStateForGetFullImage, setReqStateForGetFullImage] = useState(0)
    const [fullImage, setFullImage] = useState(null)

    const sendReqForgetFullImage = (groupId, imageId)=>{
        setReqStateForGetFullImage(1)
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/image/download?group_id=${groupId}&image_id=${imageId}`)
            .then(res=>{
                if (res.data.code === 1){
                    setFullImage(res.data.image)
                    setReqStateForGetFullImage(2)
                }
                else{
                    setReqStateForGetFullImage(3)
                }
            }).catch(err=>{
                setReqStateForGetFullImage(4)
        })
    }
    return{
        fullImage,
        setFullImage,
        reqStateForGetFullImage,
        setReqStateForGetFullImage,
        sendReqForgetFullImage
    }
}

export default useGetFullImage