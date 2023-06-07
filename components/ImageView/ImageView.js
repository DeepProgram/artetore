import classes from "./ImageView.module.css"
import {useEffect, useState} from "react";
import Image from "next/image";
import useGetHighResolutionImage from "../customHooks/useGetHighResolutionImage";
import LoaderHorizontal from "../UI/Loader/LoaderHorizontal";
import connectOnedriveClasses from "../AdminPanel/ConnectOnedrive/ConnectOnedrive.module.css"
import updateImageClass from "../AdminPanel/UpdateImage/UpdateImage.module.css"
import {useRouter} from "next/router";
import useGetFullImage from "../customHooks/useGetFullImage";

const ImageView = (props) => {
    const {
        reqStateForGetHighResImage, setReqStateForGetHighResImage,
        highResImage, sendRequestForHighResImage
    } = useGetHighResolutionImage(props.highResImage, props.reqStateForHighResImage)


    const {fullImage, setFullImage, reqStateForGetFullImage, setReqStateForGetFullImage,
            sendReqForgetFullImage} = useGetFullImage()

    const [fileType, setFileType] = useState("png")
    const [showDownloadBtn, setShowDownloadBtn] = useState(false)
    const [showSyncSpinner, setShowSyncSpinner] = useState(false)
    const [selectedImageInfo, setSelectedImageInfo] = useState(props.selectedGroupInfo)
    
    const router = useRouter()
    
    
    useEffect(()=>{
        if (reqStateForGetHighResImage === 3 || reqStateForGetHighResImage === 4){
            router.reload()
        }
    },[reqStateForGetHighResImage])

    useEffect(()=>{
        if (reqStateForGetFullImage === 1){
            setShowSyncSpinner(true)
        }
        else if (reqStateForGetFullImage >= 2){
            setShowSyncSpinner(false)
            if (reqStateForGetFullImage === 2){
                setShowDownloadBtn(true)
            }
        }
    },[reqStateForGetFullImage, setShowDownloadBtn, setShowSyncSpinner])
    
    const requestHighResImageFromServer = (group, imageID) => {
        if (!(highResImage.group === group && highResImage.imageID === imageID)) {
            sendRequestForHighResImage(group, imageID)
            setShowDownloadBtn(false)
            setFullImage({})
            setSelectedImageInfo({
                groupId: group,
                imageId: imageID
            })
        }
    }

    const fileTypeChangeHandler = (event) => {
        setFileType(event.target.value)
    }
    
    const downloadImageHandler = ()=>{
        if (!showDownloadBtn){
            sendReqForgetFullImage(selectedImageInfo.groupId, selectedImageInfo.imageId)
        }
    }

    return (
        <div className={classes.gradiantContainer}>
            <div className={classes.imageViewCloseBtn}>
                <div className={classes["btn-close"]} onClick={() => {
                    props.imagePreviewCloseHandler()
                }}></div>
            </div>

            <div className={classes.imageViewContainer}>
                <div className={classes.leftContainer}>
                    <div className={classes.imageTitle}>
                        {highResImage.title}
                    </div>
                    <div className={classes.showImages}>
                        <div className={classes.imageBox}>
                            {
                                reqStateForGetHighResImage === 1 &&
                                <LoaderHorizontal></LoaderHorizontal>
                            }
                            {
                                reqStateForGetHighResImage === 2 && highResImage &&
                                <Image className={classes.showFullImage} src={highResImage.image} width={645} height={470}
                                       alt={highResImage.imageName}></Image>
                            }
                        </div>
                        <div className={classes.allImages}>
                            {
                                props.allGroupImage.length !== 0 &&
                                props.allGroupImage.map(imageObj => {
                                    return (
                                        <div key={imageObj.imageID}
                                             className={`${classes.smallImageBox}`}
                                             onClick={() => {
                                                 requestHighResImageFromServer(imageObj.group, imageObj.imageID)
                                             }}>
                                            <Image className={classes.showSmallImage} src={imageObj.image}
                                                   alt={imageObj.imageName} width={180} height={115}></Image>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className={classes.rightContainer}>
                    <div className={classes.downloadContainer}>
                        <div className={classes.downloadRequestContainer}>
                            <div className={`${classes.downloadButton} ${showDownloadBtn && classes.btnDisabled}`} onClick={downloadImageHandler}>
                                Request To Download
                            </div>
                            {/*<select className={classes.fileExtension} onChange={fileTypeChangeHandler}>*/}
                            {/*    <option className={classes.fileExtensionOption} value={"png"}>PNG</option>*/}
                            {/*    <option className={classes.fileExtensionOption} value={"jpg"}>JPG</option>*/}
                            {/*    <option className={classes.fileExtensionOption} value={"webp"}>WEBP</option>*/}
                            {/*</select>*/}
                            <div className={connectOnedriveClasses.syncSpinContainer} style={{width:'24px', height:'24px'}}>
                                {
                                    showSyncSpinner &&
                                    <div className={`${connectOnedriveClasses.syncSpinner} ${updateImageClass.spinnerPos}`}></div>
                                }
                            </div>
                        </div>
                        {
                            showDownloadBtn &&
                            <div className={classes.downloadNowContainer}>
                                <div className={classes.downloadNowContainer__fileReadyText}>Your File Is Ready</div>
                                <div className={classes.downloadNowContainer_downloadBtn}>
                                    <a href={fullImage.image} download={`${fullImage["image_name"]}`}>
                                        Download Now
                                    </a>
                                </div>
                            </div>

                        }
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ImageView