import {useState} from "react";
import classes from "./AllModal.module.css";

const RenameItemModal = (props) => {
    const [newName, setNewName] = useState("")
    return (
        <div className={classes.detailsContainer}>
            <div className={classes.modalContainer}>
                <div className={classes.modal}>
                    <div className={classes["modal__details"]}>
                        <h1 className={classes.modalTitle__addNewFolder}>Rename Item</h1>
                    </div>
                    <div className={classes.modalBody}>
                        <div className={classes.nameContainer}>
                            <div>Previous Name : <span className={classes.previousName}>{props.previousName}</span>
                            </div>
                            <div>
                                <input value={newName} onChange={(event) => {
                                    setNewName(event.target.value)
                                }} className={classes.modalInput} placeholder={"Enter New Name"}/>
                            </div>
                        </div>
                        <div className={classes.modalBtnContainer}>
                            <button className={classes.submitBtn} onClick={() => {
                                props.reNameSubmitBtnHandler(newName)
                            }}>Submit
                            </button>
                            <button className={classes.cancelBtn} onClick={() => {
                                props.cancelBtnHandler("rename")
                            }}>Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RenameItemModal