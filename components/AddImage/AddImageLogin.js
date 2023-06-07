import classes from "./AddImageLogin.module.css"
import {useEffect, useState} from "react";
import useLogin from "../customHooks/useLogin";
import LoaderDotCircle from "../UI/Loader/LoaderDotCircle";
import ServerResponse from "../UI/Notification/ServerResponse";
import {useRouter} from "next/router";

const AddImageLogin = () => {

    const [userName, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const {reqToServerState, setReqToServerState, sendLoginRequest} = useLogin()

    const [showLoadingDotCircle, setShowLoadingDotCircle] = useState(false)
    const [showResponseBarTransition, setShowResponseBarTransition] = useState(false)
    const [serverResponseInfo, setServerResponseInfo] = useState({
        show: false,
        isSuccessful: false,
        message: ""
    })

    const router = useRouter()
    const submitBtnHandler = () => {
        sendLoginRequest(userName.trim(), password.trim())
    }


    useEffect(() => {
        if (reqToServerState === 1) {
            setShowLoadingDotCircle(true)
        } else if (reqToServerState >= 2) {
            setShowLoadingDotCircle(false)

            if (reqToServerState === 2) {
                setServerResponseInfo({
                    show: true,
                    isSuccessful: true,
                    message: "Login Successful.. Redirecting"
                })
                setShowResponseBarTransition(true)
                setTimeout(() => {
                    setShowResponseBarTransition(false)
                }, 1500)
                setShowResponseBarTransition(true)
                router.push({
                    pathname: "/connect/onedrive"
                })
            }
            else{
                if (reqToServerState === 3) {
                    setServerResponseInfo({
                        show: true,
                        isSuccessful: false,
                        message: "Login Failed"
                    })
                } else if (reqToServerState === 4) {
                    setServerResponseInfo({
                        show: true,
                        isSuccessful: false,
                        message: "Server Offline"
                    })
                }
                setShowResponseBarTransition(true)
                setTimeout(() => {
                    setShowResponseBarTransition(false)
                }, 1500)
            }
        }
    }, [reqToServerState, router])

    if (reqToServerState === 2){
        return
    }

    if (showLoadingDotCircle) {
        return (
            <LoaderDotCircle></LoaderDotCircle>
        )
    }

    return (
        <div className={classes.loginBody}>
            {
                <div className={`${classes.serverResponseContainer} ${showResponseBarTransition && classes.show}`}>
                    {
                        serverResponseInfo.show &&
                        <ServerResponse isSuccessful={serverResponseInfo.isSuccessful}
                                        message={serverResponseInfo.message}></ServerResponse>
                    }

                </div>
            }
            <div className={classes.loginContainer}>
                <div className={classes.loginText}>Login</div>
                <div className={classes.inputContainer}>
                    <div className={classes.userName}><input onChange={(event) => {
                        setUsername(event.target.value)
                    }}
                                                             value={userName} className={classes.inputUsername}
                                                             placeholder={"Enter Username"} type={"password"}/></div>
                    <div className={classes.passWord}><input onChange={(event) => {
                        setPassword(event.target.value)
                    }}
                                                             value={password} className={classes.inputPassWord}
                                                             placeholder={"Enter Password"} type={"password"}/></div>
                </div>
                <div>
                    <button onClick={submitBtnHandler} className={classes.submitBtn}>Submit</button>
                </div>
            </div>
        </div>

    )
}

export default AddImageLogin