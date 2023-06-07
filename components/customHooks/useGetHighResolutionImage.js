import {useState} from "react";
import axios from "axios";


const useGetHighResolutionImage =  (HIGH_RES_IMAGE, REQ_STATE_FOR_HIGH_RES_IMAGE)=>{
    const [highResImage, setHighResImage] = useState(HIGH_RES_IMAGE)
    // 0 -> Null State
    // 1 -> Sent Request
    // 2 -> Got Successful Result
    // 3 -> Couldn't Find Image
    // 4 -> Server Offline
    const [reqStateForGetHighResImage, setReqStateForGetHighResImage] = useState(REQ_STATE_FOR_HIGH_RES_IMAGE)
    const sendRequestForHighResImage = (group, imageID) => {
        setReqStateForGetHighResImage(1)
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/image/?group=${group}&image_id=${imageID}`)
            .then(response => {
                if (response.data.code === 1){
                    setHighResImage(response.data.data)
                    setReqStateForGetHighResImage(2)
                }
                else{
                    setReqStateForGetHighResImage(3)
                }
            })
            .catch(err => {
                setReqStateForGetHighResImage(4)
            })
    }

    return {
        reqStateForGetHighResImage,
        setReqStateForGetHighResImage,
        highResImage,
        setHighResImage,
        sendRequestForHighResImage
    }
}

export default useGetHighResolutionImage