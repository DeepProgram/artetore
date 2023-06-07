import classes from "./AllModal.module.css";

const DeleteItemModal = (props) => {
    return (
        <div className={classes.detailsContainer}>
            <div className={classes.modalContainer}>
                <div className={classes.modal}>
                    <div className={classes["modal__details"]}>
                        <h1 className={classes["modal__title"]}>Delete {props.isFolder?"Folder":"File"}</h1>
                    </div>
                    <div className={classes.modalBody__forCreateFolder}>
                        <div className={classes.deleteConfirmation}>
                            <div className={classes.deleteConfirmText}>Are you Sure You Want To Delete This {props.isFolder?"Folder":"File"}?
                            </div>
                            <div className={classes.deletionFolderName}>{props.itemName}</div>
                        </div>
                        <div className={classes.modalBtnContainer}>
                            <button className={classes.submitBtn} onClick={() => {
                                props.deleteItemSubmitHandler()
                            }}>Confirm
                            </button>
                            <button className={classes.cancelBtn} onClick={() => {
                                props.cancelBtnHandler("delete")
                            }}>Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteItemModal