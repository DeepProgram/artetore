import {useState} from "react";
import axios from "axios";

const useGetGroupImages = ()=>{
    const [allGroupImage, setAllGroupImage] = useState([])
    // 0 -> Nothing.. Null State
    // 1 -> Sent Request
    // 2 -> Got Successful Result
    // 3 -> Couldn't Get Result
    // 4 -> Server Offline
    const [reqStateForGetGroupImage, setReqStateForGetGroupImage] = useState(0)


    const sendRequestToServer = (group)=>{
        setReqStateForGetGroupImage(1)
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/image/group?group=${group}`)
            .then(response => {
                setAllGroupImage(response.data.data)
                setReqStateForGetGroupImage(2)
            })
            .catch(err => {
                setReqStateForGetGroupImage(3)
            })
    }

    return {
        reqStateForGetGroupImage,
        setReqStateForGetGroupImage,
        allGroupImage,
        sendRequestToServer
    }

}

export default useGetGroupImages