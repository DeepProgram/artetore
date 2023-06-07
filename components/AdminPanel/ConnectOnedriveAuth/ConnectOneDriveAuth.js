import classes from "./ConnectOneDriveAuth.module.css"
import classesAnother from "../../UI/Modal/AllModal.module.css"
import {Fragment, useEffect, useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import useSendAuthCodeToServer from "../../customHooks/useSendAuthCodeToServer";
import LoaderDotCircle from "../../UI/Loader/LoaderDotCircle";



const ConnectOneDriveAuth = () => {
    const router = useRouter()
    const {sendAuthCodeToServer, foundTokens, foundError, sentRequestForSendingAuthUrl, authUrl} = useSendAuthCodeToServer()
    const [showLoadingScreen, setShowLoadingScreen] = useState(false)

    useEffect(()=>{
        if (showLoadingScreen && foundTokens !== null){
            setShowLoadingScreen(false)
        }
    },[foundTokens, showLoadingScreen])

    const sendBtnHandler = ()=>{
        setShowLoadingScreen(true)
        sendAuthCodeToServer(router.query["code"])
    }

    if (showLoadingScreen){
        return (
            <LoaderDotCircle></LoaderDotCircle>
        )
    }

    console.log(authUrl)
    console.log(router.query["code"])
    console.log(router.query["error"])

    return (
        <Fragment>
            <div className={classesAnother.backdrop}></div>
            <div className={classesAnother.detailsContainer}>
                <div className={classesAnother.modalContainer}>
                    <div className={classesAnother.modal}>
                        <div className={classesAnother["modal__details"]}>
                            {
                                foundTokens === null && (router.query["error"] === undefined && router.query["code"]) &&
                                <h1 className={`${classesAnother["modal__title"]} ${classes["successfull"]} ${classes.formatText}`}>Authorization Successfull</h1>
                            }
                            {
                                foundTokens === null && (router.query["error"] || router.query["code"] === undefined) &&
                                <h1 className={`${classesAnother["modal__title"]} ${classes.formatText}`}>Authorization Failed</h1>
                            }
                            {
                                foundTokens &&
                                <h1 className={`${classesAnother["modal__title"]} ${classes["successfull"]} ${classes.formatText}`}>Found Valid Access Token</h1>
                            }
                            {
                                foundTokens !== null && !foundTokens &&
                                <h1 className={`${classesAnother["modal__title"]} ${classes.formatText}`}>Failed To Get Access Token</h1>
                            }

                            <div className={classesAnother.socialNetwork}>
                                <Link href={"https://www.youtube.com/@artetore"} rel="noopener noreferrer"
                                      target="_blank">
                                    <div
                                        className={`${classesAnother.socialUrlContainer} ${classesAnother.youtubeUrlContainer}`}>
                                        <div className={classesAnother.artetoreYT}></div>
                                        <div>Youtube</div>
                                    </div>
                                </Link>

                                <Link href={"https://www.facebook.com/artetore"}
                                      rel="noopener noreferrer" target="_blank">
                                    <div
                                        className={`${classesAnother.socialUrlContainer} ${classesAnother.facebookUrlContainer}`}>
                                        <div className={classesAnother.artetoreFB}></div>
                                        <div>Facebook</div>
                                    </div>
                                </Link>
                            </div>
                            <div className={classes.btnContainer}>
                                {
                                    foundTokens &&
                                    <button className={classes.sendToServerBtn} onClick={()=>{window.close();}}>Close Tab</button>
                                }
                                {
                                    ((foundTokens !== null && !foundTokens) || (router.query["error"] || router.query["code"] === undefined)) &&
                                    <button className={classes.retryBtn}>
                                        {
                                            authUrl &&
                                            <Link href={authUrl}>Retry</Link>
                                        }
                                        {
                                            authUrl === null &&
                                            <div onClick={()=>{window.close();}}>Close Tab</div>
                                        }

                                    </button>
                                }

                                {
                                    foundTokens === null && router.query["error"] === undefined && router.query["code"] &&
                                    <button className={classes.sendToServerBtn} onClick={sendBtnHandler}>Send Auth Code To Server</button>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>

    )

}

export default ConnectOneDriveAuth