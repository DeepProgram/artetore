import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {addImages} from "../../redux/slices/onedriveSlice";

const useGetSingleImageForAdmin = ()=>{
    const [reqStateForGetSingleImageForAdmin, setReqStateForGetSingleImageForAdmin] = useState({
        state: 0,
        gotResultFor: 0
    })
        //State
    // 0 -> Nothing
    // 1-> Sent Request
    // 2 -> Got Actual Result
    // 3 -> Failed to Get Result
    // 4 -> JWT Error
    // 5 -> Server Offline

        // gotResultFor
    // 1 -> Low Resolution Single Image
    // 2 -> Group First Image

    const [lowResImage, setLowResImage] = useState({})
    const [groupFirstImage, setGroupFirstImage] = useState({})
    const jwtToken = useSelector(state => state.userInfoSlice.token)
    // const dispatch = useDispatch()
    const sendRequestForSingleImageForAdmin = (groupId, imageId=null)=>{
        setReqStateForGetSingleImageForAdmin({
            state: 0,
            gotResultFor: null
        })
        let connect_string = ""
        if (imageId === null){
            connect_string = `${process.env.NEXT_PUBLIC_SERVER_HOST}/admin/image?group_id=${groupId}`
        }
        else{
            connect_string = `${process.env.NEXT_PUBLIC_SERVER_HOST}/admin/image?group_id=${groupId}&image_id=${imageId}`
        }
        axios.get(connect_string,
            {headers:{"Authorization" : `Bearer ${jwtToken}`}})
            .then(res=>{
                if (res.data.code === 1){
                    if (imageId !== null){
                        setLowResImage(prevState => ({
                            ...prevState,[groupId]: {
                                ...prevState[groupId],
                                [imageId]: res.data.image
                            }
                        }))
                        setReqStateForGetSingleImageForAdmin({
                            state: 2,
                            gotResultFor: 1
                        })
                    }
                    else{
                        setGroupFirstImage(prevState => ({
                            ...prevState, [groupId]: res.data.image
                        }))
                        setReqStateForGetSingleImageForAdmin({
                            state: 2,
                            gotResultFor: 2
                        })
                    }
                }
                else{
                    setReqStateForGetSingleImageForAdmin({
                        state: 3,
                        gotResultFor: 0
                    })
                }
            })
            .catch(err=>{
                if (err.response === undefined){
                    setReqStateForGetSingleImageForAdmin({
                        state: 5,
                        gotResultFor: 0
                    })
                }
                else{
                    if (err.response.status === 401){
                        setReqStateForGetSingleImageForAdmin({
                            state: 4,
                            gotResultFor: 0
                        })
                    }
                    else{
                        setReqStateForGetSingleImageForAdmin({
                            state: 5,
                            gotResultFor: 0
                        })
                    }
                }
            })
    }
    return{
        lowResImage,
        setLowResImage,
        groupFirstImage,
        setGroupFirstImage,
        reqStateForGetSingleImageForAdmin,
        setReqStateForGetSingleImageForAdmin,
        sendRequestForSingleImageForAdmin
    }
}

export default useGetSingleImageForAdmin