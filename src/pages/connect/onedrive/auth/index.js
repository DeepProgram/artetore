import ConnectOneDriveAuth from "../../../../../components/AdminPanel/ConnectOnedriveAuth/ConnectOneDriveAuth";
import useAuthJWT from "../../../../../components/customHooks/useAuthJWT";
import {useEffect} from "react";
import ErrorPage from "../../../../../components/UI/ErrorPage/ErrorPage";


const OnedriveAuthIndex = () => {
    const {requestStatusForAuthJWT, setRequestStatusForAuthJWT, sendRequestForAuthJWT} = useAuthJWT()

    useEffect(() => {
        if (requestStatusForAuthJWT === 0) {
            sendRequestForAuthJWT()
        }
    })

    if (requestStatusForAuthJWT > 2) {
        return (
            <ErrorPage></ErrorPage>
        )
    }


    if (requestStatusForAuthJWT === 2) {
        return (
            <ConnectOneDriveAuth></ConnectOneDriveAuth>
        )
    }
}

export default OnedriveAuthIndex