import {Fragment} from "react";
import {useSelector} from "react-redux";
import ErrorPage from "../../../components/UI/ErrorPage/ErrorPage";
import UpdateImage from "../../../components/AdminPanel/UpdateImage/UpdateImage";



const UpdateImageIndex = () => {

    const token = useSelector(state => state.userInfoSlice.token)

    if (token !== "") {
        return (
            <Fragment>
                <UpdateImage></UpdateImage>
            </Fragment>
        )
    }
    else{
        return (
            <ErrorPage></ErrorPage>
        )
    }


}

export default UpdateImageIndex