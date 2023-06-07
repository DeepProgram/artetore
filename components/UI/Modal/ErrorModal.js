import classes from "./AllModal.module.css"
import {createPortal} from "react-dom";
import {Fragment} from "react";
import Link from "next/link";

const BackDropComponent = (props) => {
    return (<div className={classes.backdrop} onClick={() => {
        props.backDropClicked()
    }}></div>)
}

const ModalComponent = (props) => {
    return (
        <div className={classes.detailsContainer}>
            <div className={classes.modalContainer}>
                <div className={classes.modal}>
                    <div className={classes["btn-modal-close"]} onClick={props.modalCloseButtonClicked}></div>
                    <div className={classes["modal__details"]}>
                        <h1 className={classes["modal__title"]}>Server Offline</h1>
                    </div>
                    <div className={classes.socialNetwork}>
                        <Link href={"https://www.youtube.com/@artetore"} rel="noopener noreferrer" target="_blank">
                            <div className={`${classes.socialUrlContainer} ${classes.youtubeUrlContainer}`}>
                                <div className={classes.artetoreYT}></div>
                                <div>Youtube</div>
                            </div>
                        </Link>

                        <Link href={"https://www.facebook.com/artetore"}
                              rel="noopener noreferrer" target="_blank">
                            <div className={`${classes.socialUrlContainer} ${classes.facebookUrlContainer}`}>
                                <div className={classes.artetoreFB}></div>
                                <div>Facebook</div>
                            </div>
                        </Link>

                    </div>
                    <div className={classes.errorModalRefreshBtn}>
                        <button className={classes.refreshBtn} onClick={props.refreshButtonClicked}>Refresh</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ErrorModal = (props) => {
    return (
        <Fragment>
            {createPortal(<BackDropComponent
                backDropClicked={props.backdropHandler}/>, document.getElementById("backdrop-root"))}
            {createPortal(<ModalComponent refreshButtonClicked={props.refreshButtonClicked}
                modalCloseButtonClicked={props.modalCloseButtonClicked}/>, document.getElementById("modal-root"))}
        </Fragment>
    )
}

export default ErrorModal