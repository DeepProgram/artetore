import {useState} from "react";
import classes from "./AllModal.module.css";

const CreateFolderModal = (props) => {
    const [folderName, setFolderName] = useState("")

    const validateInputAndSendToServer = ()=>{
        if (folderName.trim() !== ""){
            props.creatFolderSubmitHandler(folderName.trim())
        }
    }

    return (
        <div className={classes.detailsContainer}>
            <div className={classes.modalContainer}>
                <div className={classes.modal}>
                    <div className={classes["modal__details"]}>
                        <h1 className={classes.modalTitle__addNewFolder}>Add New Folder</h1>
                    </div>
                    <div className={classes.modalBody__forCreateFolder}>
                        <div>
                            <input value={folderName} onChange={(event) => {
                                setFolderName(event.target.value)
                            }} className={classes.modalInput} placeholder={"Enter New Folder Name"}/>
                        </div>
                        <div className={classes.modalBtnContainer}>
                            <button className={classes.submitBtn} onClick={validateInputAndSendToServer}>Submit
                            </button>
                            <button className={classes.cancelBtn} onClick={() => {
                                props.cancelBtnHandler("add")
                            }}>Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateFolderModal