import classes from "./AllModal.module.css";
import updateImageClass from "../../AdminPanel/UpdateImage/UpdateImage.module.css"
import {Fragment} from "react";

const AddedImageModal = (props) => {
    return (
        <Fragment>
            <div className={classes.backdrop}></div>
            <div className={classes.detailsContainer}>
                <div className={`${classes.modalContainer} ${classes.modalContainer__addedImageList}`}>
                    <div className={`${classes.modal} ${classes.modal__forAddedImageList}`}>
                        <div className={classes["modal__details"]}>
                            <h1 className={`${classes.modalTitle__addNewFolder} ${classes.propertiesModalTitle}`}>
                                {props.action === "add"?"Add ":"Delete "}
                                Image List</h1>
                        </div>
                        <div className={classes.addedImageListContent}>
                            {
                                Object.keys(props.imageListObj).map(objKey=>{
                                    return(
                                        <div key={objKey}>
                                            <div className={classes.addedImageFolder}>{
                                                props.action === "delete"?"Group "+objKey.toString():props.imageListObj[objKey]["folder_name"]
                                            }</div>
                                            <div className={updateImageClass.fileTree}>
                                                <ul className={updateImageClass.folderList}>
                                                    {
                                                        props.action === "add" &&
                                                        props.imageListObj[objKey]["all_image_id"].map(imageObj=>{
                                                            return(
                                                                <li className={updateImageClass.file} key={imageObj["file_id"]}>
                                                                    <div className={updateImageClass.fileName}>{imageObj["file_name"]}</div>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                    {
                                                        props.action === "delete" &&
                                                        props.imageListObj[objKey].map(imageObj=>{
                                                            return(
                                                                <li className={updateImageClass.file} key={imageObj["image_id"]}>
                                                                    <div className={updateImageClass.fileName}>{imageObj["image_name"]}</div>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>

                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className={classes.addedImageListBtnContainer}>
                            <button className={`${classes.bottomBtn} ${classes.sendBtn}`} onClick={props.sendBtnHandlerForAddImage}>Send</button>
                            <button className={`${classes.bottomBtn} ${classes.closeBtn}`} onClick={props.closeAddedModalBtnHandler}>Close</button>
                        </div>
                    </div>

                </div>

            </div>
        </Fragment>

    )
}

export default AddedImageModal