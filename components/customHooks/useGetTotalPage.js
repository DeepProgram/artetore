import axios from "axios";
import {useDispatch} from "react-redux";
import {setTotalPage} from "../../redux/slices/imageDataSlice";
import {useState} from "react";
const useGetTotalPage = ()=>{
    const [serverErrorForTotalPage, setServerErrorForTotalPage] = useState(false)
    const [requestSentOnceForTotalPage, setRequestSentOnceForTotalPage] = useState(false)
    const dispatch = useDispatch()

    const getTotalPageFromServer = ()=>{
        setRequestSentOnceForTotalPage(true)
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/image/total-page`)
            .then(response => {
                dispatch(setTotalPage({
                    totalPage: response.data.totalPage
                }))
            })
            .catch(err=>{
                setServerErrorForTotalPage(true)
            })
    }

    return {
        serverErrorForTotalPage,
        setServerErrorForTotalPage,
        requestSentOnceForTotalPage,
        getTotalPageFromServer
    }
}

export default useGetTotalPage