import axios from "axios";
import {setImageList} from "../../redux/slices/imageDataSlice";
import {useDispatch} from "react-redux";
import {useState} from "react";
const useGetOnePageImage = ()=>{
    // 0 -> Null State.. Doing Nothing
    // 1 -> Sent Request To Server
    // 2 -> Got Actual Result
    // 3 -> Database Empty
    // 4 -> Server Offline
    const [reqStateForOnePageImage, setReqStateForOnePageImage] = useState(0)
    const dispatch = useDispatch()

    const getOnePageDataFromServer = (pageNo)=>{
        setReqStateForOnePageImage(1)
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/image/page?page=${pageNo}`)
            .then(response=>{
                if (response.data.code  === 1){
                    dispatch(setImageList({
                        imageList: response.data.data
                    }))
                    setReqStateForOnePageImage(2)
                }
                else{
                   setReqStateForOnePageImage(3)
                }

            })
            .catch(err=>{
                setReqStateForOnePageImage(4)
            })
    }
    return {
        reqStateForOnePageImage,
        setReqStateForOnePageImage,
        getOnePageDataFromServer
    }
}

export default useGetOnePageImage