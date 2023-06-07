import {useState} from "react";
import {useSelector} from "react-redux";
import axios from "axios";

const useGetGroupsWithImages = ()=>{
    // 0 -> Nothing
    // 1 -> Sent Request
    // 2 -> Got Actual Result
    // 3 -> Empty Database
    // 4 -> JWT Error
    // 5 -> Server Offline
    const [reqStateForGetGroupsWithImages, setReqStateForGetGroupsWithImages] = useState(0)
    const [groupWithImagesObj, setGroupWithImagesObj] = useState({})
    const jwtToken = useSelector(state => state.userInfoSlice.token)
    const sendReqForGetGroupsWithImages = ()=>{
        setReqStateForGetGroupsWithImages(1)
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/admin/groups/images`,
            {headers:{"Authorization" : `Bearer ${jwtToken}`}})
            .then(res=>{
                if (res.data.code === 1){
                    setGroupWithImagesObj(res.data.data)
                    setReqStateForGetGroupsWithImages(2)
                }
                else{
                    setGroupWithImagesObj({})
                    setReqStateForGetGroupsWithImages(3)
                }
            })
            .catch(err=>{
                if (err.response === undefined){
                    setReqStateForGetGroupsWithImages(5)
                }
                else{
                    if (err.response.status === 401){
                        setReqStateForGetGroupsWithImages(4)
                    }
                    else{
                        setReqStateForGetGroupsWithImages(5)
                    }
                }
            })
    }

    return {
        groupWithImagesObj,
        setGroupWithImagesObj,
        reqStateForGetGroupsWithImages,
        setReqStateForGetGroupsWithImages,
        sendReqForGetGroupsWithImages
    }
}

export default useGetGroupsWithImages