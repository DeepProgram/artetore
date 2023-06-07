import {useState} from "react";
import classes from "./AllModal.module.css";
import anotherClass from "../../AdminPanel/ConnectOnedrive/ConnectOnedrive.module.css"

const UploadFileModal = (props) => {
    const [dragActive, setDragActive] = useState(false)
    const dragHandlerEnd = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }

    const dragHandlerStart = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(true)
    }

    const processAndSetFiles = (filesObj) => {
        const tempFileList = []
        const tempUploadFileStatusObj = {}
        for (let i = 0; i < filesObj.length; i++) {
            tempFileList.push({
                name: filesObj[i].name,
                size: filesObj[i].size,
                file: filesObj[i]
            })
            tempUploadFileStatusObj[filesObj[i].name] = 0
        }
        props.setUploadFileList(tempFileList)

        props.setUploadFileStatusObj(tempUploadFileStatusObj)
    }
    const handleFileDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false)
        processAndSetFiles(event.dataTransfer.files)
    }

    const handleFileChange = (event) => {
        processAndSetFiles(event.target.files)

    }

    const removeUploadItemFromList = (fileName) => {

        if (props.reqStateForFileUpload < 1){
            cancelFileUpload(fileName)
        }
        else{
            props.setUploadFileList(prevState => prevState.filter(fileObj => fileObj.name !== fileName))
        }
    }

    const cancelFileUpload = (fileName)=>{
        props.setUploadFileStatusObj(prevState => {
            return {...prevState, [fileName]:4}
        })
    }

    // console.log(props.uploadFileList)
    // console.log(props.uploadFileStatusObj)



    return (
        <div className={classes.detailsContainer}>
            <div className={`${classes.modalContainer}`}>
                <div className={`${classes.modal__big} ${dragActive && classes.dragActive}`}>
                    <div className={classes["modal__details"]}>
                        <h1 className={classes.modal__title_upload}>Upload Files</h1>
                    </div>
                    {
                        props.uploadFileList.length === 0 &&
                        <div className={classes.fileUploadContainer}>
                            <div className={classes.fileInput} onDragEnter={dragHandlerStart}
                                 onDragLeave={dragHandlerEnd}
                                 onDragOver={dragHandlerStart} onDrop={handleFileDrop}>
                                <input type="file" name="file" id="file" onChange={handleFileChange} multiple={true}/>
                                <label htmlFor="file">
                                    <div>
                                        <span className={classes.dropFile}> Drop files here </span>
                                        <span className={classes.dropFileOr}> Or </span>
                                        <span className={classes.browse}> Browse </span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    }

                    {
                        props.uploadFileList.length !== 0 &&
                        <div className={classes.uploadListContainer}>
                            {
                                props.uploadFileList.map((fileObj, index) => {
                                    return (
                                        <div key={index} className={classes.uploadedFile}>
                                            <div className={classes.uploadFileName}>{fileObj.name}</div>
                                            <div className={classes.uploadFileRight}>
                                                <div className={classes.fileSize}>{(fileObj.size < 1024000) ? (fileObj.size * 0.0009765625).toFixed(2).toString() + " KB" : (fileObj.size * 0.00000095367432).toFixed(2).toString() + " MB"}</div>
                                                {
                                                    props.uploadFileStatusObj[fileObj.name] !== null && props.uploadFileStatusObj[fileObj.name] < 2 &&
                                                    <div className={classes.crossIcon} onClick={() => {
                                                        removeUploadItemFromList(fileObj.name)}}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                                            <path
                                                                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                                                        </svg>
                                                    </div>
                                                }
                                                {
                                                    props.uploadFileStatusObj[fileObj.name] !== null && (props.uploadFileStatusObj[fileObj.name] === 1|| props.uploadFileStatusObj[fileObj.name] === 4) &&
                                                    <div className={classes.spinnerContainer}>
                                                        <svg className={anotherClass.connectingSpinner} xmlns="http://www.w3.org/2000/svg" width="22"
                                                             height="22" viewBox="0 0 48 48">
                                                            <circle cx="24" cy="4" r="4" fill="#fff"/>
                                                            <circle cx="12.19" cy="7.86" r="3.7" fill="#fff"/>
                                                            <circle cx="5.02" cy="17.68" r="3.4" fill="#fff"/>
                                                            <circle cx="5.02" cy="30.32" r="3.1" fill="#fff"/>
                                                            <circle cx="12.19" cy="40.14" r="2.8" fill="#fff"/>
                                                            <circle cx="24" cy="44" r="2.5" fill="#fff"/>
                                                            <circle cx="35.81" cy="40.14" r="2.2" fill="#fff"/>
                                                            <circle cx="42.98" cy="30.32" r="1.9" fill="#fff"/>
                                                            <circle cx="42.98" cy="17.68" r="1.6" fill="#fff"/>
                                                            <circle cx="35.81" cy="7.86" r="1.3" fill="#fff"/>
                                                        </svg>
                                                    </div>
                                                }
                                                {
                                                    props.uploadFileStatusObj[fileObj.name] !== null && props.uploadFileStatusObj[fileObj.name] === 2 &&
                                                    <div className={classes.fileUploadSuccessIconContainer}><svg className={classes.fileUploadSuccessIcon} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#10b79b" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"></path></svg></div>
                                                }
                                                {
                                                    props.uploadFileStatusObj[fileObj.name] !== null && props.uploadFileStatusObj[fileObj.name] === 3 &&
                                                    <svg style={{color:"red"}} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm5.793-4.207a1 1 0 0 1 1.414 0L12 10.586l2.793-2.793a1 1 0 1 1 1.414 1.414L13.414 12l2.793 2.793a1 1 0 0 1-1.414 1.414L12 13.414l-2.793 2.793a1 1 0 0 1-1.414-1.414L10.586 12 7.793 9.207a1 1 0 0 1 0-1.414z" fill="red"></path></svg>
                                                }

                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }

                    {
                        props.reqStateForFileUpload === 0 &&
                        <div className={classes.modalBtnContainer}>
                            <button className={classes.submitBtn} onClick={() => {
                                props.uploadFileSubmitHandler()
                            }}>Confirm
                            </button>
                            <button className={classes.cancelBtn} onClick={() => {
                                props.cancelBtnHandler("upload")
                            }}>Cancel
                            </button>
                        </div>
                    }
                    {
                        props.reqStateForFileUpload >= 1 &&
                        <div className={classes.modalBtnContainer}>
                            <button className={classes.submitBtn} onClick={() => {
                                    props.closeAndFetchFolders()
                                }}>{props.reqStateForFileUpload === 1?"Cancel":"Close"}
                            </button>
                        </div>
                    }

                </div>
            </div>
        </div>
    )
}

export default UploadFileModal