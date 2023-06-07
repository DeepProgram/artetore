import {useState} from "react";
import axios from "axios";
import {useSelector} from "react-redux";


const useGetGroupList = ()=>{
    const [reqStateForGetGroupList, setReqStateForGetGroupList] = useState(0)
    const [groupList, setGroupList] = useState([])

    // 0 -> Null State
    // 1 -> Sent Request
    // 2 -> Got Result
    // 3 -> Got JWT Error
    // 4 -> Got Server Offline Error

    const jwtToken = useSelector(state => state.userInfoSlice.token)

    const sendReqForGetGroupList = ()=>{
        setReqStateForGetGroupList(1)
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/admin/groups`,
            {headers:{"Authorization" : `Bearer ${jwtToken}`}})
            .then(res=>{
                setReqStateForGetGroupList(2)
                setGroupList(res.data.data)
            })
            .catch(err=>{
                if (err.response.status === 401){
                    setReqStateForGetGroupList(3)
                }
                else{
                    setReqStateForGetGroupList(4)
                }
            })
    }
    return{
        reqStateForGetGroupList,
        setReqStateForGetGroupList,
        sendReqForGetGroupList,
        groupList
    }
}

export default useGetGroupList