import ConnectOnedrive from "../../../../components/AdminPanel/ConnectOnedrive/ConnectOnedrive";
import {useSelector} from "react-redux";
import {Fragment} from "react";
import ErrorPage from "../../../../components/UI/ErrorPage/ErrorPage";


const ConnectOnedriveIndex = () => {
    const jwtToken = useSelector(state => state.userInfoSlice.token)

    if (jwtToken) {
        return (
            <Fragment>
                <ConnectOnedrive></ConnectOnedrive>
            </Fragment>
        )
    }
    return (
        <ErrorPage></ErrorPage>
    )
}

export default ConnectOnedriveIndex