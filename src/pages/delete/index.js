import {useSelector} from "react-redux";
import {Fragment} from "react";
import ErrorPage from "../../../components/UI/ErrorPage/ErrorPage";
import DeleteImage from "../../../components/AdminPanel/DeleteImage/DeleteImage";


const DeleteImageIndex = ()=>{
    const token = useSelector(state => state.userInfoSlice.token)

    if (token !== "") {
        return (
            <Fragment>
                <DeleteImage></DeleteImage>
            </Fragment>
        )
    }
    else{
        return (
            <ErrorPage></ErrorPage>
        )
    }
}

export default DeleteImageIndex