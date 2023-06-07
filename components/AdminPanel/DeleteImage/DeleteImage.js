import {Fragment, useEffect, useState} from "react";
import HeaderLoggedIn from "../HeaderLoggedIn/HeaderLoggedIn";
import updateImageClass from "../UpdateImage/UpdateImage.module.css";
import classes from "./DeleteImage.module.css"
import Image from "next/image";
import useGetGroupsWithImages from "../../customHooks/useGetGroupsWithImages";
import useGetSingleImageForAdmin from "../../customHooks/useGetSingleImageForAdmin";
import useDeleteImageFromDB from "../../customHooks/useDeleteImageFromDB";
import connectOnedriveClasses from "../ConnectOnedrive/ConnectOnedrive.module.css"
import ServerResponse from "../../UI/Notification/ServerResponse";

const DeleteImage = () => {
    const {
        groupWithImagesObj, setGroupWithImagesObj, reqStateForGetGroupsWithImages,
        setReqStateForGetGroupsWithImages, sendReqForGetGroupsWithImages
    } = useGetGroupsWithImages()

    const {lowResImage, setLowResImage, groupFirstImage, setGroupFirstImage,
            reqStateForGetSingleImageForAdmin, setReqStateForGetSingleImageForAdmin,
            sendRequestForSingleImageForAdmin} = useGetSingleImageForAdmin()

    const {reqStateForDeleteImageFromDB, setReqStateForDeleteImageFromDB,
            sendReqForDeleteImageFromDB} = useDeleteImageFromDB()

    const [loadedForFirstTime, setLoadedForFirstTime] = useState(true)

    const [showNotification, setShowNotification] = useState({
        show: false,
        isSuccessful: false,
        message: ""
    })

    const [showSyncSpinner, setShowSyncSpinner] = useState(false)

    // 0 -> Dont Show Image
    // 1 -> Showing Loading Image Animation
    // 2 -> Show Image
    const [showGroupImageState, setShowGroupImageState] = useState({
        state: 0,
        group: null
    })

    const [showImageState, setShowImageState] = useState({
        state: 0,
        group: null,
        image: null
    })


    useEffect(() => {
        if (loadedForFirstTime && reqStateForGetGroupsWithImages === 0) {
            setShowNotification({
                show: true,
                isSuccessful: true,
                message: "Started Syncing Database"
            })
            sendReqForGetGroupsWithImages()
            if (!showSyncSpinner){
                setShowSyncSpinner(true)
            }
        }
        else if(reqStateForGetGroupsWithImages >= 2){
            setShowSyncSpinner(false)

            if(reqStateForGetGroupsWithImages === 2){
                setShowNotification({
                    show: true,
                    isSuccessful: true,
                    message: "Database Synced"
                })
            }
            else if(reqStateForGetGroupsWithImages === 3){
                setShowNotification({
                    show: true,
                    isSuccessful: false,
                    message: "Database Empty"
                })
            }
        }
    }, [loadedForFirstTime, reqStateForGetGroupsWithImages, setShowNotification, setShowSyncSpinner])


    useEffect(()=>{
        if(reqStateForGetSingleImageForAdmin.state === 2){
            if (reqStateForGetSingleImageForAdmin.gotResultFor === 1){
                setShowImageState(prevState => ({
                    ...prevState, state: 2
                }))
            }
            else if (reqStateForGetSingleImageForAdmin.gotResultFor === 2){
                setShowGroupImageState(prevState => ({
                    ...prevState, state: 2
                }))
            }


        }
    },[reqStateForGetSingleImageForAdmin])
    
    
    useEffect(()=>{
        if (reqStateForDeleteImageFromDB === 2){
            setReqStateForDeleteImageFromDB(0)
            sendReqForGetGroupsWithImages()
        }
    },[reqStateForDeleteImageFromDB, setReqStateForDeleteImageFromDB])

    
    useEffect(() => {
        if (showNotification.show) {
            setTimeout(() => {
                setShowNotification({
                    show: false,
                    isSuccessful: false,
                    message: ""
                })
            }, 2000)
        }
    }, [showNotification.show])


    const showGroupImageHandler = (groupKey)=>{
        if (showGroupImageState.state === 0 && showImageState.state === 0){
            if (groupFirstImage[groupKey] === undefined){
                sendRequestForSingleImageForAdmin(parseInt(groupKey))
                setShowGroupImageState({
                    state: 1,
                    group: groupKey
                })
            }
            else{
                setShowGroupImageState({
                    state: 2,
                    group: groupKey
                })
            }

        }
        else if(showImageState.state === 0 && showGroupImageState.group === groupKey){
            setShowGroupImageState({
                state: 0,
                group: null
            })
        }
    }

    const showImageHandler = (group, image)=>{
        if (showImageState.state === 0 && showGroupImageState.state === 0){
            if (lowResImage[group] === undefined || (lowResImage[group] !== undefined && lowResImage[group][image] === undefined)){
                sendRequestForSingleImageForAdmin(group, image)
                setShowImageState({
                    state: 1,
                    group: group,
                    image: image
                })
            }
            else {
                setShowImageState({
                    state: 2,
                    group: group,
                    image: image
                })
            }
        }
        else if(showGroupImageState.state === 0 && showImageState.group === group && showImageState.image === image){
            setShowImageState({
                state: 0,
                group: null,
                image: null
            })
        }
    }


    const groupExpandHandler = (group)=>{
        if (groupWithImagesObj[group].expanded === undefined || !groupWithImagesObj[group].expanded){
            setGroupWithImagesObj(prevState => ({
                ...prevState, [group]:{
                    ...prevState[group], expanded:true
                }
            }))

        }
        else{
            setGroupWithImagesObj(prevState => ({
                ...prevState, [group]:{
                    ...prevState[group], expanded:false
                }
            }))
        }
    }

    const groupSelectHandler = (group, checked)=>{
        if(checked){
            setGroupWithImagesObj(prevState => ({
                ...prevState, [group]: {
                    ...prevState[group],
                    selectedCount: prevState[group]["images"].length,
                    "images": prevState[group]["images"].map(imageObj=>{
                        return {
                            ...imageObj, selected: true
                        }
                    })
                }
            }))
        }
        else{
            setGroupWithImagesObj(prevState => ({
                ...prevState, [group]: {
                    ...prevState[group],
                    selectedCount: 0,
                    "images": prevState[group]["images"].map(imageObj=>{
                        return {
                            ...imageObj, selected: false
                        }
                    })
                }
            }))
        }
    }

    const imageSelectHandler = (group, imageId, checked)=>{
        setGroupWithImagesObj(prevState => ({
            ...prevState, [group]: {
                ...prevState[group],
                selectedCount: (checked)?(prevState[group].selectedCount === undefined?1:prevState[group].selectedCount+1):prevState[group].selectedCount-1,
                "images": prevState[group]["images"].map(imageObj=>{
                    if (imageObj["image_id"] === imageId){
                        return {
                            ...imageObj, selected: checked
                        }
                    }
                    else{
                        return {
                            ...imageObj
                        }
                    }

                })
            }
        }))
    }

    const generateDeleteList = () => {
        const deleteImageListObj = {}
        Object.keys(groupWithImagesObj).map(groupKey=>{
            if (groupWithImagesObj[groupKey].selectedCount !== undefined && groupWithImagesObj[groupKey].selectedCount !== 0){
                deleteImageListObj[groupKey] = groupWithImagesObj[groupKey]["images"].filter(imageObj=> imageObj.selected === true)
            }
        })
        return deleteImageListObj
    }
    const sendDataToServer = () => {
        setShowNotification({
            show: true,
            isSuccessful: true,
            message: "Sent Request For Deletion"
        })
        setShowImageState({
            state: 0,
            group: null,
            image: null
        })
        setShowGroupImageState({
            state: 0,
            group: null
        })
        setGroupFirstImage({})
        setLowResImage({})

        sendReqForDeleteImageFromDB(generateDeleteList())
        setShowSyncSpinner(true)
    }

    console.log(groupFirstImage)
    console.log(lowResImage)

    return (
        <Fragment>
            <HeaderLoggedIn action={"delete"} sendDataToServer={sendDataToServer} imageListObj={generateDeleteList()}
                            showTab={2}></HeaderLoggedIn>
            <div className={`${connectOnedriveClasses.serverResponseContainer} ${showNotification.show && connectOnedriveClasses.show}`}>
                <ServerResponse isSuccessful={showNotification.isSuccessful}
                                message={showNotification.message}></ServerResponse>
            </div>
            <div className={updateImageClass.addImageContainer}>
                <div className={updateImageClass.addImageHeader}>
                    <div className={updateImageClass.text}>Delete Image From Database</div>
                    <div className={connectOnedriveClasses.syncSpinContainer}>
                        {
                            showSyncSpinner &&
                            <div className={`${connectOnedriveClasses.syncSpinner} ${updateImageClass.spinnerPos}`}></div>
                        }
                    </div>
                </div>
                <div className={updateImageClass.fileViewer}>
                    <div className={updateImageClass.infoHeader}>
                        <div className={`${updateImageClass.headerFileName} ${classes.headerFileName}`}>Groups</div>
                        <div className={`${updateImageClass.headerFileName} ${classes.folderName}`}>Folder</div>
                        <div className={updateImageClass.headerAddFile}>Delete File</div>
                        <div className={updateImageClass.headerGroupImage}>Group Image</div>
                    </div>
                    <div className={updateImageClass.detailsContainer}>
                        <div className={updateImageClass.infoBody}>
                            {
                                Object.keys(groupWithImagesObj).length !== 0 &&
                                Object.keys(groupWithImagesObj).map(groupKey => {
                                    return (
                                        <Fragment key={groupKey}>
                                            <div className={updateImageClass.folderInfo}>
                                                <div className={`${updateImageClass.folderContainer} ${classes.folderContainer}`}>
                                                    <div className={`${updateImageClass.expandToggleButton} ${classes.expandToggleButton}`}
                                                         onClick={() => {
                                                             groupExpandHandler(groupKey)
                                                         }}>
                                                        {
                                                            groupWithImagesObj[groupKey].expanded &&
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                 viewBox="0 0 448 512">
                                                                <path
                                                                    d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM152 232H296c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/>
                                                            </svg>
                                                        }
                                                        {
                                                            !groupWithImagesObj[groupKey].expanded &&
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                 viewBox="0 0 448 512">
                                                                <path
                                                                    d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
                                                            </svg>
                                                        }
                                                    </div>

                                                    <div className={`${updateImageClass.folderIcon} ${classes.folderIcon}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                            <path
                                                                d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z"/>
                                                        </svg>
                                                    </div>
                                                    <div
                                                        className={`${updateImageClass.folderName} ${classes.groupName}`}>Group {groupKey}
                                                    </div>
                                                </div>
                                                {/*<div className={`${classes.folderNameContainer}${classes.notActive}`}></div>*/}
                                                <span className={`${updateImageClass.span} ${classes.checkBox_span}`}>
                                                <input className={updateImageClass["purple_checkbox"]} type={"checkbox"}
                                                       checked={groupWithImagesObj[groupKey].selectedCount===groupWithImagesObj[groupKey]["images"].length}
                                                       onChange={
                                                           (event) => {
                                                               groupSelectHandler(groupKey, event.target.checked)
                                                           }
                                                       }/>
                                            </span>
                                                <div className={`${updateImageClass.imageContainer} ${classes.deleteImageContainer}`}>
                                                    {
                                                        showGroupImageState.state > 0 && showGroupImageState.group === groupKey &&
                                                        <div className={`${updateImageClass.imageBox} ${classes.deleteImageBox}`}>
                                                            {
                                                                showGroupImageState.state === 1 &&
                                                                <div className={updateImageClass["lds-default"]}>
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
                                                                showGroupImageState.state === 2 &&
                                                                <Image src={groupFirstImage[showGroupImageState.group]} alt={"small_image"} width={156} height={100}></Image>
                                                            }
                                                        </div>

                                                    }
                                                </div>

                                                <div className={updateImageClass.showImageContainer} onClick={() => {
                                                    showGroupImageHandler(groupKey)
                                                }}>
                                                    <svg
                                                        className={`${updateImageClass.showImageIcon} ${(showGroupImageState.state === 2 && showGroupImageState.group === groupKey)?updateImageClass.selected:classes.showImageIcon__folder}`}
                                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                        <path
                                                            d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            {
                                                groupWithImagesObj[groupKey].expanded !== undefined && groupWithImagesObj[groupKey].expanded &&
                                                <div className={`${updateImageClass.fileTree} ${classes.filetreeForDelete}`}>
                                                    <ul className={updateImageClass.folderList}>
                                                        {
                                                            groupWithImagesObj[groupKey]["images"].map(imageObj=>{
                                                                return (
                                                                    <li key={imageObj["image_id"]} className={updateImageClass.file}>
                                                                        <div
                                                                            className={`${updateImageClass.fileName} ${classes.fileName}`}>{imageObj["image_name"]}
                                                                        </div>
                                                                        <div className={classes.folderNameContainer}>
                                                                            <div>{imageObj["folder_name"]}</div>
                                                                        </div>
                                                                        <span className={`${updateImageClass.span__image} ${classes.checkBox_span__image}`}><input
                                                                            checked={imageObj.selected}
                                                                            onChange={(event) => {
                                                                                imageSelectHandler(groupKey, imageObj["image_id"], event.target.checked)
                                                                            }}
                                                                            className={updateImageClass["purple_checkbox"]}
                                                                            type={"checkbox"}/>
                                                                        </span>
                                                                        <div className={`${updateImageClass.imageContainer} ${classes.deleteImageContainer}`}>
                                                                            {
                                                                                showImageState.state > 0 && (showImageState.group === groupKey && showImageState.image === imageObj["image_id"]) &&
                                                                                <div className={`${updateImageClass.imageBox} ${classes.deleteImageBox__image}`}>
                                                                                    {
                                                                                        showImageState.state === 1 &&
                                                                                        <div className={updateImageClass["lds-default"]}>
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
                                                                                        showImageState.state === 2 &&
                                                                                        <Image src={lowResImage[groupKey][imageObj["image_id"]]} alt={"small_image"} width={156} height={100}></Image>
                                                                                    }
                                                                                </div>

                                                                            }
                                                                        </div>
                                                                        <div className={updateImageClass.showImageContainer} onClick={() => {
                                                                            showImageHandler(groupKey, imageObj["image_id"])
                                                                        }}>
                                                                            <svg
                                                                                className={`${updateImageClass.showImageIcon} ${(showImageState.state === 2 && (showImageState.group === groupKey && showImageState.image === imageObj["image_id"]))?updateImageClass.selected:updateImageClass.active}`}
                                                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                                                <path
                                                                                    d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/>
                                                                            </svg>
                                                                        </div>
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

export default DeleteImage