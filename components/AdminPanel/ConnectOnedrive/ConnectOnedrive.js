import {Fragment, useEffect, useState} from "react";
import LoaderDotCircle from "../../UI/Loader/LoaderDotCircle";
import classes from "./ConnectOnedrive.module.css"
import anotherClass from "../UpdateImage/UpdateImage.module.css"
import {useDispatch, useSelector} from "react-redux";
import useConnectOnedrive from "../../customHooks/useConnectOnedrive";
import useGetOnedriveFolders from "../../customHooks/useGetOnedriveFolders";
import {useRouter} from "next/router";
import {createPortal} from "react-dom";
import useRenameOnedriveItem from "../../customHooks/useRenameOnedriveItem";
import useCreateOnedriveFolder from "../../customHooks/useCreateOnedriveFolder";
import useDeleteOnedriveFolder from "../../customHooks/useDeleteOnedriveFolder";
import HeaderLoggedIn from "../HeaderLoggedIn/HeaderLoggedIn";
import CreateFolderModal from "../../UI/Modal/CreateFolderModal";
import DeleteItemModal from "../../UI/Modal/DeleteItemModal"
import RenameItemModal from "../../UI/Modal/RenameItemModal"
import UploadFileModal from "../../UI/Modal/UploadFileModal"
import PropertiesItemModal from "../../UI/Modal/PropertiesItemModal";
import ErrorModalForAdmin from "../../UI/Modal/ErrorModalForAdmin";
import ServerResponse from "../../UI/Notification/ServerResponse";
import useFileUploadInOnedrive from "../../customHooks/useFileUploadInOnedrive";
import {setConnectionStatus, setFolders} from "../../../redux/slices/onedriveSlice";

const ModalBackdrop = () => {
    return (
        <div className={classes.backdrop}></div>
    )

}

const ConnectOnedrive = () => {
    const {
        requestStateForOneDriveConnection, setRequestStateForOneDriveConnection,
        sendConnectionRequestForOnedrive, authUrl
    } = useConnectOnedrive()

    const {
        reqStateForOnedriveFolder, setReqStateForOnedriveFolder,
        sendFolderReqToServer, authUrlFromFolderReq
    } = useGetOnedriveFolders()

    const folders = useSelector(state => state.onedriveSlice.folders)
    const {reqRenameItemState, setReqRenameItemState, sendReqForItemRename} = useRenameOnedriveItem()

    const {
        reqStateForCreateOnedriveFolder,
        setReqStateForCreateOnedriveFolder,
        sendRequestToCreateOnedriveFolder
    } = useCreateOnedriveFolder()

    const {
        reqStateForDeleteOnedriveFolder,
        setReqStateForDeleteOnedriveFolder,
        sendRequestToDeleteOnedriveFolder
    } = useDeleteOnedriveFolder()


    const  {setFolderId, uploadFileList, setUploadFileList, setStartUploadingFiles, reqStateForUploadFile,
            setReqStateForUploadFile, uploadFileStatusObj, setUploadFileStatusObj, setCancelAllUpload} = useFileUploadInOnedrive()

    const dispatch = useDispatch()

    const onedriveConnected = useSelector(state => state.onedriveSlice.connectionStatus)
    const [showLoadingCircle, setShowLoadingCircle] = useState(false)
    const [showSyncSpinner, setShowSyncSpinner] = useState(false)
    const [showFolder, setShowFolder] = useState(true)
    const [openFolder, setOpenFolder] = useState(null)
    const [selectFolder, setSelectFolder] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [showMultipleFileOption, setShowMultipleFileOption] = useState(false)
    const [selectedMultipleFile, setSelectedMultipleFile] = useState({})
    const [renameItemInfo, setRenameItemInfo] = useState({
        clicked: false,
        previousName: null,
    })
    const [creatItemClicked, setCreatItemClicked] = useState(false)
    const [deleteItemClicked, setDeleteItemClicked] = useState(false)
    const [propertiesItemClicked, setPropertiesItemClicked] = useState(false)
    const [uploadFilesClicked, setUploadFilesClicked] = useState(false)
    const [forceLogout, setForceLogout] = useState(false)
    const [showNotification, setShowNotification] = useState({
        show: false,
        isSuccessful: false,
        message: ""
    })
    const router = useRouter()

    const refreshBtnHandler = () => {
        if (onedriveConnected === 1 && reqStateForOnedriveFolder === 0) {
            sendFolderReqToServer()
        }
    }

    useEffect(() => {
        if (requestStateForOneDriveConnection === 4 || requestStateForOneDriveConnection === 5) {
            setForceLogout(true)
        } else if (requestStateForOneDriveConnection === 3 && authUrl) {
            setRequestStateForOneDriveConnection(0)
            window.open(authUrl, '_blank', 'noreferrer');
        }
    }, [authUrl, requestStateForOneDriveConnection, setRequestStateForOneDriveConnection])


    useEffect(() => {
        if (reqStateForOnedriveFolder === 1) {
            if (!showSyncSpinner) {
                setShowSyncSpinner(true)
            }
        } else if (reqStateForOnedriveFolder >= 2) {
            setShowSyncSpinner(false)

            if (reqStateForOnedriveFolder === 2){
                setShowNotification({
                    show: true,
                    isSuccessful: true,
                    message: "Folder Refreshed"
                })
            }
            else if(reqStateForOnedriveFolder === 3){
                setShowNotification({
                    show: true,
                    isSuccessful: false,
                    message: "Authorization Error"
                })
                window.open(authUrlFromFolderReq, '_blank', 'noreferrer');
            }
            else if(reqStateForOnedriveFolder === 4){
                setShowNotification({
                    show: true,
                    isSuccessful: false,
                    message: "Folder Couldn't Refreshed"
                })
            }

            else if (reqStateForOnedriveFolder === 5 || reqStateForOnedriveFolder === 6) {
                setForceLogout(true)
            }
            setReqStateForOnedriveFolder(0)
        }
    }, [authUrlFromFolderReq, dispatch, reqStateForOnedriveFolder, router, setReqStateForOnedriveFolder, showSyncSpinner])


    useEffect(() => {
        if (reqRenameItemState >= 2) {
            if (reqRenameItemState === 2) {
                setShowNotification({
                    show: true,
                    isSuccessful: true,
                    message: "Renamed Successfully"
                })
                sendFolderReqToServer()
            }
            else if(reqRenameItemState === 3){
                setShowNotification({
                    show: true,
                    isSuccessful: false,
                    message: "Renamed Unsuccessful"
                })
            }
            else if (reqRenameItemState === 4 || reqRenameItemState === 5){
                setForceLogout(true)
            }
            setReqRenameItemState(0)
        }

    }, [reqRenameItemState, sendFolderReqToServer, setReqRenameItemState])

    useEffect(() => {
        if (reqStateForCreateOnedriveFolder >= 2) {
            if (reqStateForCreateOnedriveFolder === 2) {
                setShowNotification({
                    show: true,
                    isSuccessful: true,
                    message: "Folder Created Successfully"
                })
                sendFolderReqToServer()
            } else if (reqStateForCreateOnedriveFolder > 2) {
                if (reqStateForCreateOnedriveFolder === 3){
                    setShowNotification({
                        show: true,
                        isSuccessful: false,
                        message: "Folder Creation Unsuccessful"
                    })
                }
                else if (reqStateForCreateOnedriveFolder === 4 || reqStateForCreateOnedriveFolder === 5){
                    setForceLogout(true)
                }
                // setShowLoadingCircle(false)
            }
            setReqStateForCreateOnedriveFolder(0)
        }
    }, [reqStateForCreateOnedriveFolder, sendFolderReqToServer, setReqStateForCreateOnedriveFolder])

    useEffect(() => {
        if (reqStateForDeleteOnedriveFolder >= 2) {
            if (reqStateForDeleteOnedriveFolder === 2) {
                setShowNotification({
                    show: true,
                    isSuccessful: true,
                    message: "Deleted Successfully"
                })
                sendFolderReqToServer()
            } else if (reqStateForDeleteOnedriveFolder > 2) {
                if (reqStateForDeleteOnedriveFolder === 3){
                    setShowNotification({
                        show: true,
                        isSuccessful: false,
                        message: "Deletion Operation Unsuccessful"
                    })
                }
                else if (reqStateForDeleteOnedriveFolder === 4 || reqStateForDeleteOnedriveFolder === 5){
                    setForceLogout(true)
                }
                setShowLoadingCircle(false)
            }
            setReqStateForDeleteOnedriveFolder(0)
        }
    }, [reqStateForDeleteOnedriveFolder, sendFolderReqToServer, setReqStateForDeleteOnedriveFolder])

    useEffect(() => {
        if (reqStateForUploadFile === 3 || reqStateForUploadFile === 4){
            setForceLogout(true)
        }
    }, [dispatch, reqStateForUploadFile, router, setReqStateForUploadFile])

    useEffect(()=>{
        if (showNotification.show){
            setTimeout(()=>{setShowNotification({
                show: false,
                message: ""
            })},2000)
        }
    },[showNotification.show])

    const forceRelogHandler = ()=>{
        dispatch(setConnectionStatus({
            connected: 0
        }))
        dispatch(setFolders({
            folders: {}
        }))
        router.push({
            pathname: "/connect"
        })
    }
    
    useEffect(()=>{
        if (forceLogout){
            setTimeout(()=>{forceRelogHandler()}, 4000)
        }
    },[forceLogout])
    
    const connectOnedriveHandler = () => {
        if (requestStateForOneDriveConnection === 0 && onedriveConnected === 0) {
            sendConnectionRequestForOnedrive()
        }
    }


    const folderClickHandler = (folderId) => {
        setOpenFolder(folderId)
        setShowFolder(false)
        setSelectFolder(null)
    }

    const rootFolderClickHandler = () => {
        if (!showFolder) {
            // setSelectFolder(openFolder)
            setShowFolder(true)
            setOpenFolder(null)
            setSelectedFile(null)
        }
    }

    const selectFolderHandler = (folderId) => {
        if (folderId === selectFolder) {
            setSelectFolder(null)
        } else {
            setSelectFolder(folderId)
        }
    }

    const selectFileHandler = (fileId) => {
        if (selectedFile === fileId) {
            setSelectedFile(null)
        } else {
            setSelectedFile(fileId)
        }
    }


    const itemExtensionFinder = (itemName)=>{
        const regex = /\.[0-9a-z]+$/i;
        const str = itemName
        let m;
        let extension = ""
        if ((m = regex.exec(str)) !== null) {
            m.forEach((match) => {
                extension = match
            });
        }
        return extension
    }
    const renameItemHandler = () => {

        if (selectFolder !== null) {
            setRenameItemInfo(
                {
                    clicked: true,
                    previousName: folders[selectFolder]["folder_name"],
                    newName: null
                }
            )
        }
        else if(selectedFile !== null){
            let itemName = folders[openFolder]["files"][selectedFile]["file_name"]
            itemName = itemName.slice(0, itemName.indexOf(itemExtensionFinder(itemName)))
            setRenameItemInfo(
                {
                    clicked: true,
                    previousName: itemName,
                    newName: null
                }
            )
        }
    }

    const reNameSubmitBtnHandler = (newName) => {

        if (selectFolder === null && selectedFile){
            let itemName = folders[openFolder]["files"][selectedFile]["file_name"]
            sendReqForItemRename(selectedFile, newName+itemExtensionFinder(itemName))
        }
        else if(selectFolder !== null && selectedFile === null){
            sendReqForItemRename(selectFolder, newName)
        }

        setRenameItemInfo({
            clicked: false,
            previousName: null,
        })
    }

    const createFolderHandler = () => {
        setCreatItemClicked(true)
    }

    const creatFolderSubmitHandler = (folderName) => {
        setSelectFolder(null)
        sendRequestToCreateOnedriveFolder(folderName)
        setCreatItemClicked(false)
    }

    const deleteItemHandler = () => {
        if (selectFolder !== null || selectedFile !== null) {
            setDeleteItemClicked(true)
        }
    }

    const deleteItemSubmitHandler = () => {

        if (selectFolder !== null){
            setSelectFolder(null)
            sendRequestToDeleteOnedriveFolder(selectFolder)
        }
        else if(selectedFile !== null){
            setSelectedFile(null)
            sendRequestToDeleteOnedriveFolder(selectedFile)
        }

        setDeleteItemClicked(false)
    }

    const cancelBtnHandler = (action) => {
        if (action === "delete") {
            setDeleteItemClicked(false)
        } else if (action === "add") {
            setCreatItemClicked(false)
        } else if (action === "rename") {
            setRenameItemInfo({
                clicked: false,
                previousName: null
            })
        } else if (action === "upload") {
            setUploadFilesClicked(false)
            setCancelAllUpload(true)

        }
        else if(action === "property"){
            setPropertiesItemClicked(false)
        }
    }

    const uploadFileClickHandler = () => {
        if (openFolder !== null) {
            setUploadFilesClicked(true)
        }
    }

    const uploadFileSubmitHandler = async () => {
        setFolderId(openFolder)
        setStartUploadingFiles(true)
    }

    const closeAndFetchFolders = ()=>{
        sendFolderReqToServer()
        setUploadFilesClicked(false)
        setCancelAllUpload(true)

    }

    const propertiesItemClickHandler = ()=>{
        if (selectFolder !== null || selectedFile !== null){
            setPropertiesItemClicked(true)
        }
    }

    const generateProperties = ()=>{
        const properties = {
            "itemName": "",
            "itemType": "",
            "createdOn":"",
            "modifiedOn":"",
            "size":""
        }
        if (selectFolder !== null){
            properties.itemName = folders[selectFolder]["folder_name"]
            properties.itemType = "Folder"
            properties.createdOn = new Date(folders[selectFolder]["creation_time"]).toString()
            properties.modifiedOn = new Date(folders[selectFolder]["modification_time"]).toString()
            const tempSize = folders[selectFolder]["folder_size"]
            properties.size = (tempSize < 1024000) ? (tempSize * 0.0009765625).toFixed(2).toString() + " KB" : (tempSize * 0.00000095367432).toFixed(2).toString() + " MB"
        }
        else if(selectedFile !== null){
            properties.itemName = folders[openFolder]["files"][selectedFile]["file_name"]
            properties.itemType = "File"
            properties.createdOn = new Date(folders[openFolder]["files"][selectedFile]["creation_time"]).toString()
            properties.modifiedOn = new Date(folders[openFolder]["files"][selectedFile]["modification_time"]).toString()
            const tempSize = folders[openFolder]["files"][selectedFile]["file_size"]
            properties.size = (tempSize < 1024000) ? (tempSize * 0.0009765625).toFixed(2).toString() + " KB" : (tempSize * 0.00000095367432).toFixed(2).toString() + " MB"
        }
        return properties
    }



    if (forceLogout){
        return (
            <ErrorModalForAdmin></ErrorModalForAdmin>
        )
    }

    if (showLoadingCircle) {
        return (
            <Fragment>
                <LoaderDotCircle></LoaderDotCircle>
            </Fragment>
        )
    }


    return (
        <Fragment>
            <HeaderLoggedIn showTab={0} imageListObj={{}}></HeaderLoggedIn>
            <div className={`${classes.serverResponseContainer} ${showNotification.show && classes.show}`}>
                    <ServerResponse isSuccessful={showNotification.isSuccessful}
                                    message={showNotification.message}></ServerResponse>
            </div>
            <div>
                <div className={classes.buttonContainer}>
                    <div className={classes.connectingSpinnerContainer}>
                        {
                            requestStateForOneDriveConnection === 1 &&
                            <svg className={classes.connectingSpinner} xmlns="http://www.w3.org/2000/svg" width="24"
                                 height="24" viewBox="0 0 48 48">
                                <circle cx="24" cy="4" r="4" fill="#000000"/>
                                <circle cx="12.19" cy="7.86" r="3.7" fill="#000000"/>
                                <circle cx="5.02" cy="17.68" r="3.4" fill="#000000"/>
                                <circle cx="5.02" cy="30.32" r="3.1" fill="#000000"/>
                                <circle cx="12.19" cy="40.14" r="2.8" fill="#000000"/>
                                <circle cx="24" cy="44" r="2.5" fill="#000000"/>
                                <circle cx="35.81" cy="40.14" r="2.2" fill="#000000"/>
                                <circle cx="42.98" cy="30.32" r="1.9" fill="#000000"/>
                                <circle cx="42.98" cy="17.68" r="1.6" fill="#000000"/>
                                <circle cx="35.81" cy="7.86" r="1.3" fill="#000000"/>
                            </svg>
                        }
                    </div>


                    <button onClick={connectOnedriveHandler}
                            className={`${classes.btn} ${(onedriveConnected === 1) ? classes.oneDriveConnected : (requestStateForOneDriveConnection === 1) ? classes.oneDriveConnecting : classes.btnConnect}`}>
                        {(onedriveConnected === 1) ? "Onedrive Connected" : (requestStateForOneDriveConnection === 1) ? "Connecting Onedrive" : "Connect Onedrive"}
                    </button>
                    <button onClick={refreshBtnHandler}
                            className={`${classes.btn} ${(onedriveConnected === 1) ? classes.refreshBtn : classes.btnNotAvailable}`}>Refresh
                        Folders
                    </button>
                    <div className={classes.syncSpinContainer}>
                        {
                            showSyncSpinner &&
                            <div className={classes.syncSpinner}></div>
                        }
                    </div>
                </div>
                <div className={classes.foldersContainer}>
                    <div className={classes.fileChangeHeader}>
                        <div className={`${classes.fileChangeHeader__item}`} onClick={createFolderHandler}>New Folder
                        </div>
                        <div onClick={uploadFileClickHandler}
                             className={`${classes.fileChangeHeader__item} ${openFolder !== null && classes.highlightHeaderItem}`}>Upload
                            File
                        </div>
                        <div
                            className={`${classes.fileChangeHeader__item} ${(selectFolder !== null || selectedFile !== null) && classes.highlightHeaderItem}`}
                            onClick={renameItemHandler}>Rename
                        </div>
                        <div
                            className={`${classes.fileChangeHeader__item} ${(selectFolder !== null || selectedFile !== null) && classes.highlightHeaderItem}`}
                            onClick={deleteItemHandler}>Delete
                        </div>
                        <div onClick={propertiesItemClickHandler}
                            className={`${classes.fileChangeHeader__item} ${(selectFolder !== null || selectedFile !== null) && classes.highlightHeaderItem}`}>Properties
                        </div>
                        <div className={`${classes.fileChangeHeader__item}`}>{folders["used_storage"] !== undefined?`${folders["used_storage"]} GB / ${folders["total_storage"]} GB`:"N/A"}</div>
                    </div>
                    <div className={classes.foldersData}>
                        <div className={classes.folderTraverseContainer}>
                            <div className={classes.folderTraverse}>
                                <div
                                    className={`${classes.traversingFolderName} ${!showFolder && classes.traversingFolderName__expanded}`}
                                    onClick={rootFolderClickHandler}>Images
                                </div>
                                <div className={classes.arrowIcon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path
                                            d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                                    </svg>
                                </div>
                                {
                                    !showFolder &&
                                    <div className={classes.traversingFolderName}
                                         style={{cursor: "default"}}>{folders[openFolder]["folder_name"]}</div>
                                }
                            </div>
                        </div>

                        {
                            showFolder && !openFolder && Object.keys(folders).length !== 0 &&
                            <div className={classes.allDatContainer}>
                                {
                                    Object.keys(folders).map((key) => {
                                        if(key === "used_storage" || key === "total_storage"){
                                            return
                                        }
                                        return (
                                            <div key={key} className={classes.folderInfoContainer}>
                                                <div
                                                    className={`${classes.folders} ${selectFolder !== null && selectFolder === key && classes.folders__highlighted}`}>
                                                    <div onClick={() => {
                                                        selectFolderHandler(key)
                                                    }} className={classes.folderNameContainer}>
                                                        <div className={classes.folderIcon}>
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                 viewBox="0 0 512 512">
                                                                <path
                                                                    d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z"/>
                                                            </svg>
                                                        </div>
                                                        <div
                                                            className={classes.folderName}>{folders[key]["folder_name"]}</div>
                                                    </div>
                                                    <div className={classes.openFolder} onClick={() => {
                                                        folderClickHandler(key)
                                                    }}>
                                                        <div className={classes.openText}>Open</div>
                                                        <div className={classes.openFolder__icon}>
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                 viewBox="0 0 576 512">
                                                                <path
                                                                    d="M88.7 223.8L0 375.8V96C0 60.7 28.7 32 64 32H181.5c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7H416c35.3 0 64 28.7 64 64v32H144c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224H544c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480H32c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }


                        {
                            !showFolder && openFolder &&
                            <div className={classes.allDatContainer}>{
                                Object.keys(folders[openFolder]["files"]).map((fileKey) => {
                                    return (
                                        <Fragment key={fileKey}>
                                            {
                                                showMultipleFileOption &&
                                                <span className={anotherClass.span}>
                                                    <input className={anotherClass["purple_checkbox"]} type={"checkbox"} checked={folderInfoObj.allSelected} onChange={
                                                        (event)=> {
                                                            event.target.checked
                                                        }
                                                    }/>
                                                </span>
                                            }
                                            <div className={`${classes.fileContainer} 
                                                    ${selectedFile === fileKey && classes.folders__highlighted}`}>
                                                <div className={classes.files} onClick={() => {
                                                    selectFileHandler(fileKey)
                                                }}>
                                                    <div className={classes.fileNameContainer}>
                                                        <div className={classes.fileIcon}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                                                <path
                                                                    d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5s-8.2 8.6-14.2 8.6H216 176 128 80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2 .2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z"/>
                                                            </svg>
                                                        </div>
                                                        <div
                                                            className={classes.fileName}>{folders[openFolder]["files"][fileKey]["file_name"]}</div>
                                                    </div>
                                                </div>
                                                <div className={classes.downloadFile}>
                                                    <div className={classes.downloadText}>Download</div>
                                                    <div className={classes.downloadIcon}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                                            <path
                                                                d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-167l80 80c9.4 9.4 24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-39 39V184c0-13.3-10.7-24-24-24s-24 10.7-24 24V318.1l-39-39c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    )
                                })
                            }
                            </div>
                        }

                    </div>
                </div>
                {
                    creatItemClicked &&
                    <Fragment>
                        {createPortal(<ModalBackdrop/>, document.getElementById("backdrop-root"))}
                        {createPortal(<CreateFolderModal
                                cancelBtnHandler={cancelBtnHandler} creatFolderSubmitHandler={creatFolderSubmitHandler}/>
                            , document.getElementById("modal-root"))}
                    </Fragment>
                }
                {
                    renameItemInfo.clicked &&
                    <Fragment>
                        {createPortal(<ModalBackdrop/>, document.getElementById("backdrop-root"))}
                        {createPortal(<RenameItemModal previousName={renameItemInfo.previousName}
                                                       cancelBtnHandler={cancelBtnHandler}
                                                       reNameSubmitBtnHandler={reNameSubmitBtnHandler}/>
                            , document.getElementById("modal-root"))}
                    </Fragment>
                }
                {
                    deleteItemClicked &&
                    <Fragment>
                        {createPortal(<ModalBackdrop/>, document.getElementById("backdrop-root"))}
                        {createPortal(<DeleteItemModal itemName={(selectFolder !== null)?folders[selectFolder]["folder_name"]:folders[openFolder]["files"][selectedFile]["file_name"]}
                                                       isFolder={selectFolder !== null}
                                                       cancelBtnHandler={cancelBtnHandler}
                                                       deleteItemSubmitHandler={deleteItemSubmitHandler}/>
                            , document.getElementById("modal-root"))}
                    </Fragment>
                }
                {
                    propertiesItemClicked &&
                    <Fragment>
                        {createPortal(<ModalBackdrop/>, document.getElementById("backdrop-root"))}
                        {createPortal(<PropertiesItemModal propertiesInfo={generateProperties()}
                                                           cancelBtnHandler={cancelBtnHandler}/>,
                            document.getElementById("modal-root"))}
                    </Fragment>
                }
                {
                    uploadFilesClicked &&
                    <Fragment>
                        {createPortal(<ModalBackdrop/>, document.getElementById("backdrop-root"))}
                        {createPortal(<UploadFileModal uploadFileStatusObj={uploadFileStatusObj}
                                                       setUploadFileStatusObj={setUploadFileStatusObj}
                                                       reqStateForFileUpload={reqStateForUploadFile}
                                                       closeAndFetchFolders={closeAndFetchFolders}
                                                       uploadFileList={uploadFileList}
                                                       setUploadFileList={setUploadFileList}
                                                       cancelBtnHandler={cancelBtnHandler}
                                                       uploadFileSubmitHandler={uploadFileSubmitHandler}/>
                            , document.getElementById("modal-root"))}
                    </Fragment>
                }
            </div>
        </Fragment>

    )
}

export default ConnectOnedrive