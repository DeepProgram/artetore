import classes from "./UpdateImage.module.css"
import anotherClass from "./../ConnectOnedrive/ConnectOnedrive.module.css"
import {Fragment, useEffect, useState} from "react";
import HeaderLoggedIn from "../HeaderLoggedIn/HeaderLoggedIn";
import useGetOnedriveFolders from "../../customHooks/useGetOnedriveFolders";
import {useDispatch, useSelector} from "react-redux";
import useGetGroupList from "../../customHooks/useGetGroupList";
import ServerResponse from "../../UI/Notification/ServerResponse";
import useAddImagInDatabase from "../../customHooks/useAddImagInDatabase";
import useGetSingleImageForAdmin from "../../customHooks/useGetSingleImageForAdmin";
import Image from "next/image";
import {resetImages, setConnectionStatus, setFolders} from "../../../redux/slices/onedriveSlice";
import ErrorModalForAdmin from "../../UI/Modal/ErrorModalForAdmin";
import {useRouter} from "next/router";

const UpdateImage = () => {
    const [forceLogout, setForceLogout] = useState(false)
    const [showSyncSpinner, setShowSyncSpinner] = useState(false)
    const [showNotification, setShowNotification] = useState({
        show: false,
        isSuccessful: false,
        message: ""
    })
    const [showImage, setShowImage] = useState({
        show: false,
        folder: null
    })
    const {
        reqStateForOnedriveFolder, setReqStateForOnedriveFolder,
        sendFolderReqToServer, authUrlFromFolderReq
    } = useGetOnedriveFolders()

    const {
        groupList, reqStateForGetGroupList, setReqStateForGetGroupList,
        sendReqForGetGroupList
    } = useGetGroupList()

    const {
        reqStateForAddImageInDatabase, setReqStateForAddImageInDatabase,
        sendReqForAddImageInDatabase
    } = useAddImagInDatabase()

    const {
        groupFirstImage, setGroupFirstImage, reqStateForGetSingleImageForAdmin,
        setReqStateForGetSingleImageForAdmin,
        sendRequestForSingleImageForAdmin
    } = useGetSingleImageForAdmin()

    const folders = useSelector(state => state.onedriveSlice.folders)
    const [addedImageNameList, setAddedImageNameList] = useState([]) //[{"imageId":imageId,"folderId": folderId}]
    const [localFolderObj, setLocalFolderObj] = useState({})
    const dispatch = useDispatch()
    const router = useRouter()

    // Sending Folder Request To Server If Not Fetched Previously
    useEffect(() => {
        if (Object.keys(folders).length === 0 && reqStateForOnedriveFolder === 0) {
            sendFolderReqToServer()
        }

    }, [folders, reqStateForOnedriveFolder])


    // Generate LocalFolder Object
    useEffect(() => {
        if (folders && Object.keys(localFolderObj).length === 0) {
            for (const folderId in folders) {
                const allFileID = {}
                for (const fileKey in folders[folderId]["files"]) {
                    allFileID[fileKey] = {
                        selected: false
                    }
                }
                setLocalFolderObj(prevState => ({
                    ...prevState, [folderId]: {
                        "all_file_id": allFileID,
                        "expanded": false,
                        selectedCount: 0,
                        group: -1
                    }
                }))
            }
        }
    }, [folders, localFolderObj])

    useEffect(() => {
        if (groupList.length === 0 && reqStateForGetGroupList === 0) {
            sendReqForGetGroupList()
        }

    }, [groupList.length, reqStateForGetGroupList])


    // Change Of Request State For Get Group List
    useEffect(() => {
        if (reqStateForGetGroupList === 0) {
            setShowNotification({
                show: true,
                isSuccessful: true,
                message: "Started Syncing Database"
            })
        }
        if (reqStateForGetGroupList >= 2) {
            if (reqStateForGetGroupList === 2) {
                setShowNotification({
                    show: true,
                    isSuccessful: true,
                    message: "Database Synced"
                })
                if (showSyncSpinner) {
                    setShowSyncSpinner(false)
                }
            } else {
                setForceLogout(true)
            }
        }
    }, [reqStateForGetGroupList, showSyncSpinner])


    //Handling Folders Request In Different State
    useEffect(() => {
        if (reqStateForOnedriveFolder === 1) {
            setShowSyncSpinner(true)
        } else if (reqStateForOnedriveFolder >= 2) {
            setShowSyncSpinner(false)
            if (reqStateForOnedriveFolder === 2) {
                setShowNotification({
                    show: true,
                    isSuccessful: true,
                    message: "Folder Refreshed"
                })
            } else {
                setForceLogout(true)
            }
        }

    }, [reqStateForOnedriveFolder])


    // Send Request For Adding Image Data State Changes
    useEffect(() => {
        if (reqStateForAddImageInDatabase === 2 || reqStateForAddImageInDatabase === 3){

            if (reqStateForAddImageInDatabase === 2) {
                setShowNotification({
                    show: true,
                    message: "Image Added In Database",
                    isSuccessful: true
                })
            } else if (reqStateForAddImageInDatabase === 3) {
                setShowNotification({
                    show: true,
                    message: "Error While Adding Image To Database",
                    isSuccessful: false
                })
            }
            setShowSyncSpinner(true)
            sendReqForGetGroupList()
        }
        else if (reqStateForAddImageInDatabase === 4 || reqStateForAddImageInDatabase === 5) {
            setForceLogout(true)
        }

    }, [reqStateForAddImageInDatabase, setShowNotification])


    // State Tracking For Get Group First Image For Admin
    useEffect(() => {
        if (reqStateForGetSingleImageForAdmin.state === 4 || reqStateForGetSingleImageForAdmin.state === 5) {
            setForceLogout(true)
        } else if (reqStateForGetSingleImageForAdmin.state === 3) {
            setShowImage({
                show: false,
                folder: null
            })
            setShowNotification({
                show: true,
                message: "Error While Fetching Group Image",
                isSuccessful: false
            })
        }
    }, [reqStateForGetSingleImageForAdmin])


    useEffect(() => {
        if (showNotification.show) {
            setTimeout(() => {
                setShowNotification({
                    show: false,
                    message: ""
                })
            }, 2000)
        }
    }, [showNotification.show])

    const generateImageList = () => {
        const imageListObj = {}
        addedImageNameList.forEach(obj => {
            imageListObj[obj.folderId] === undefined ? imageListObj[obj.folderId] = {
                "all_image_id": [{
                    "file_name": folders[obj.folderId]["files"][obj.fileId]["file_name"],
                    "file_id": obj.fileId
                }],
                "group": localFolderObj[obj.folderId]["group"],
                "folder_name": folders[obj.folderId]["folder_name"]
            } : imageListObj[obj.folderId]["all_image_id"].push({
                "file_name": folders[obj.folderId]["files"][obj.fileId]["file_name"],
                "file_id": obj.fileId
            })
        })
        return imageListObj
    }
    const sendDataToServer = () => {
        sendReqForAddImageInDatabase(generateImageList())

        setShowImage({
            show: false,
            folder: null
        })
        setGroupFirstImage({})
        setLocalFolderObj({})

        setAddedImageNameList([])
        setShowNotification({
            show: true,
            isSuccessful: true,
            message: "Sent Successfully"
        })
        setAddedImageNameList([])
    }

    const expandFolderHandler = (folderId) => {
        setLocalFolderObj(prevState => ({
            ...prevState, [folderId]: {
                ...prevState[folderId], "expanded": !prevState[folderId].expanded
            }
        }))
    }

    const singleFileSelectHandler = (folderId, fileId, checked) => {
        if (checked) {
            setAddedImageNameList(prevState => {
                prevState.push({
                    "fileId": fileId,
                    "folderId": folderId,
                })
                return prevState
            })
        } else {
            setAddedImageNameList(prevState => {
                return prevState.filter(obj => obj.fileId !== fileId)
            })
        }

        setLocalFolderObj(prevState => ({
            ...prevState, [folderId]: {
                ...prevState[folderId],
                "all_file_id": {
                    ...prevState[folderId]["all_file_id"], [fileId]: {
                        selected: checked
                    }
                },
                selectedCount: checked ? prevState[folderId]["selectedCount"] + 1 : prevState[folderId]["selectedCount"] - 1
            }
        }))
    }

    const folderSelectHandler = (folderId, checked) => {

        if (checked) {
            setAddedImageNameList(prevState => {
                Object.keys(localFolderObj[folderId]["all_file_id"]).map(fileId => {
                    prevState.push({
                        "fileId": fileId,
                        "folderId": folderId,
                    })
                })
                return prevState
            })
        } else {
            setAddedImageNameList(prevState => {
                return prevState.filter(obj => obj.folderId !== folderId)
            })
        }

        const temp_all_file_id = {}
        for (const imageId in localFolderObj[folderId]["all_file_id"]) {
            temp_all_file_id[imageId] = {
                "selected": checked
            }
        }
        setLocalFolderObj(prevState => ({
            ...prevState, [folderId]: {
                ...prevState[folderId],
                "all_file_id": temp_all_file_id,
                "selectedCount": checked ? Object.keys(temp_all_file_id).length : 0
            }
        }))
    }

    const changeGroupHandler = (folderId, groupId) => {
        setLocalFolderObj(prevState => ({
            ...prevState, [folderId]: {
                ...prevState[folderId], group: groupId
            }
        }))
    }

    const showImageHandler = (folderId) => {
        if (showImage.show && showImage.folder === folderId) {
            setShowImage({
                show: false,
                folder: null
            })
        }
        if (!showImage.show && localFolderObj[folderId].group !== -1) {
            setShowImage({
                show: true,
                folder: folderId,
                isSuccessful: true
            })
            const currentGroup = localFolderObj[folderId].group
            if (groupFirstImage[currentGroup] === undefined) {
                sendRequestForSingleImageForAdmin(currentGroup)
            }
        }

    }

    const forceRelogHandler = () => {
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

    useEffect(() => {
        if (forceLogout) {
            setTimeout(() => {
                forceRelogHandler()
            }, 4000)
        }
    }, [forceLogout])

    if (forceLogout) {
        return (
            <ErrorModalForAdmin></ErrorModalForAdmin>
        )
    }

    return (
        <Fragment>
            <HeaderLoggedIn action={"add"} sendDataToServer={sendDataToServer} imageListObj={generateImageList()}
                            showTab={1}></HeaderLoggedIn>
            <div className={`${anotherClass.serverResponseContainer} ${showNotification.show && anotherClass.show}`}>
                <ServerResponse isSuccessful={showNotification.isSuccessful}
                                message={showNotification.message}></ServerResponse>
            </div>
            <div className={classes.addImageContainer}>
                <div className={classes.addImageHeader}>
                    <div className={classes.text}>Add Image To Database</div>
                    <div className={anotherClass.syncSpinContainer}>
                        {
                            showSyncSpinner &&
                            <div className={`${anotherClass.syncSpinner} ${classes.spinnerPos}`}></div>
                        }
                    </div>
                </div>
                <div className={classes.fileViewer}>
                    <div className={classes.infoHeader}>
                        <div className={classes.headerFileName}>Folders ({Object.keys(folders).length})</div>
                        <div className={classes.headerSelectGroup}>Select Group</div>
                        <div className={classes.headerAddFile}>Add File</div>
                        <div className={classes.headerGroupImage}>Group Image</div>
                    </div>
                    <div className={classes.detailsContainer}>
                        <div className={classes.infoBody}>
                            {
                                Object.keys(localFolderObj).length !== 0 &&
                                Object.keys(folders).map(folderKey => {
                                    if (folderKey === "used_storage" || folderKey === "total_storage"){
                                        return
                                    }
                                    return (
                                        <Fragment key={folderKey}>
                                            <div className={classes.folderInfo}>
                                                <div className={classes.folderContainer}>
                                                    <div className={classes.expandToggleButton}
                                                         onClick={() => {
                                                             expandFolderHandler(folderKey)
                                                         }}>
                                                        {
                                                            localFolderObj[folderKey].expanded &&
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                 viewBox="0 0 448 512">
                                                                <path
                                                                    d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM152 232H296c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/>
                                                            </svg>
                                                        }
                                                        {
                                                            !localFolderObj[folderKey].expanded &&
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                 viewBox="0 0 448 512">
                                                                <path
                                                                    d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
                                                            </svg>
                                                        }
                                                    </div>

                                                    <div className={classes.folderIcon}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                            <path
                                                                d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z"/>
                                                        </svg>
                                                    </div>
                                                    <div
                                                        className={classes.folderName}>{folders[folderKey]["folder_name"]}</div>
                                                </div>
                                                <div className={classes.selectGroup}>
                                                    <select onChange={(event) => {
                                                        changeGroupHandler(folderKey, event.target.value === "NEW GROUP" ? -1 : parseInt(event.target.value.split(" ")[1]))
                                                    }} className={classes.selectContainer}
                                                            defaultValue={"NEW GROUP"}>
                                                        <option className={classes.selectOption}>NEW GROUP</option>
                                                        {
                                                            groupList.length !== 0 &&
                                                            groupList.map((obj, index) => {
                                                                return (
                                                                    <option className={classes.selectOption}
                                                                            key={index + 1}>GROUP {obj}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <span className={classes.span}>
                                                <input className={classes["purple_checkbox"]} type={"checkbox"}
                                                       checked={Object.keys(localFolderObj[folderKey]["all_file_id"]).length === 0 ? false : localFolderObj[folderKey]["selectedCount"] === Object.keys(localFolderObj[folderKey]["all_file_id"]).length}
                                                       onChange={
                                                           (event) => {
                                                               folderSelectHandler(folderKey, event.target.checked)
                                                           }
                                                       }/>
                                            </span>
                                                <div className={classes.imageContainer}>
                                                    {
                                                        showImage.show && showImage.folder === folderKey &&
                                                        <div className={classes.imageBox}>
                                                            {
                                                                groupFirstImage[localFolderObj[folderKey].group] === undefined &&
                                                                <div className={classes["lds-default"]}>
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div></div>
                                                                </div>
                                                            }
                                                            {
                                                                groupFirstImage[localFolderObj[folderKey].group] !== undefined &&
                                                                <Image
                                                                    src={groupFirstImage[localFolderObj[folderKey].group]}
                                                                    alt={"small_image"} width={180}
                                                                    height={100}></Image>
                                                            }
                                                        </div>

                                                    }
                                                </div>

                                                <div className={classes.showImageContainer} onClick={() => {
                                                    showImageHandler(folderKey)
                                                }}>
                                                    <svg
                                                        className={`${classes.showImageIcon} ${showImage.folder === folderKey ? classes.selected : localFolderObj[folderKey]["group"] !== -1 ? classes.active : ""}`}
                                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                        <path
                                                            d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            {
                                                localFolderObj[folderKey].expanded &&
                                                <div className={classes.fileTree}>
                                                    <ul className={classes.folderList}>
                                                        {
                                                            Object.keys(localFolderObj[folderKey]["all_file_id"]).map((imageId, imageIndex) => {
                                                                return (
                                                                    <li key={imageIndex} className={classes.file}>
                                                                        <div
                                                                            className={classes.fileName}>{folders[folderKey]["files"][imageId]["file_name"]}</div>
                                                                        <span className={classes.span__image}><input
                                                                            checked={localFolderObj[folderKey]["all_file_id"][imageId].selected}
                                                                            onChange={(event) => {
                                                                                singleFileSelectHandler(folderKey, imageId, event.target.checked)
                                                                            }}
                                                                            className={classes["purple_checkbox"]}
                                                                            type={"checkbox"}/></span>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            }
                                        </Fragment>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateImage