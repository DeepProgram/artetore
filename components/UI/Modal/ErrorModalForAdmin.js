
import classes from "./AllModal.module.css";
import {Fragment} from "react";
import {createPortal} from "react-dom";


const BackDropComponent = ()=>{
    return (
        <div className={classes.backdrop}></div>
    )
}

const ModalComponent  = ()=>{
    return (
        <div className={classes.detailsContainer}>
            <div className={classes.modalContainer}>
                <div className={classes.modal}>
                    <div className={classes["modal__details"]}>
                        <h1 className={classes["modal__title"]}>Token Expired</h1>
                        <h3 style={{textAlign:'center', color:'black'}}>Or</h3>
                        <h1 className={classes["modal__title"]}>Server Offline</h1>
                    </div>
                    <h3 className={classes.redirectionText}>Redirecting To Login Page In 4 Seconds ....</h3>
                </div>
            </div>
        </div>
    )
}
const ErrorModalForAdmin = ()=>{
    return (
        <Fragment>
            {createPortal(<BackDropComponent/>, document.getElementById("backdrop-root"))}
            {createPortal(<ModalComponent />, document.getElementById("modal-root"))}
        </Fragment>
    )
}

export default ErrorModalForAdmin