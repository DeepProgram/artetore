import classes from "./HeaderLoggedIn.module.css"
import Link from "next/link";
import {Fragment, useState} from "react";
import AddedImageModal from "../../UI/Modal/AddedImageModal";

const HeaderLoggedIn = (props) => {
    const [showCartModal, setShowCartModal] = useState(false)
    const cartButtonHandler = () => {
        if (Object.keys(props.imageListObj).length !== 0){
            setShowCartModal(true)
        }
    }

    const closeAddedModalBtnHandler = ()=>{
        setShowCartModal(false)
    }

    return (
        <Fragment>
            <nav className={classes.header}>
                <div className={classes.headerLeft}>
                    <Link href={"/"} className={classes.logo}>
                        <div className={classes.logo__icon}></div>
                        <div className={classes.logo__text}>ARTETORE</div>
                    </Link>
                </div>
                <div className={classes.tabContainer}>
                    <div
                        className={`${classes.tabContainer__data} ${props.showTab === 0 && classes.tabContainer__data__active}`}
                    ><Link href={"/connect/onedrive"}>Connect</Link></div>
                    <div
                        className={`${classes.tabContainer__data} ${props.showTab === 1 && classes.tabContainer__data__active}`}
                    ><Link href={"/update"}>Update</Link></div>
                    <div
                        className={`${classes.tabContainer__data} ${props.showTab === 2 && classes.tabContainer__data__active}`}
                    ><Link href={"/delete"}>Delete</Link>
                    </div>
                    <div className={classes.itemContainer} onClick={cartButtonHandler}>
                        <svg className={`${classes.itemCartIcon} ${props.imageListObj !== undefined && Object.keys(props.imageListObj).length !== 0 && classes.selected}`}
                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            <path
                                d="M320 192h17.1c22.1 38.3 63.5 64 110.9 64c11 0 21.8-1.4 32-4v4 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V339.2L280 448h56c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-53 0-96-43-96-96V192.5c0-16.1-12-29.8-28-31.8l-7.9-1c-17.5-2.2-30-18.2-27.8-35.7s18.2-30 35.7-27.8l7.9 1c48 6 84.1 46.8 84.1 95.3v85.3c34.4-51.7 93.2-85.8 160-85.8zm160 26.5v0c-10 3.5-20.8 5.5-32 5.5c-28.4 0-54-12.4-71.6-32h0c-3.7-4.1-7-8.5-9.9-13.2C357.3 164 352 146.6 352 128v0V32 12 10.7C352 4.8 356.7 .1 362.6 0h.2c3.3 0 6.4 1.6 8.4 4.2l0 .1L384 21.3l27.2 36.3L416 64h64l4.8-6.4L512 21.3 524.8 4.3l0-.1c2-2.6 5.1-4.2 8.4-4.2h.2C539.3 .1 544 4.8 544 10.7V12 32v96c0 17.3-4.6 33.6-12.6 47.6c-11.3 19.8-29.6 35.2-51.4 42.9zM432 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm48 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32z"/>
                        </svg>
                        <div className={classes.itemCount}>
                        {
                            props.imageListObj !== undefined && Object.keys(props.imageListObj).length !== 0 && `(${Object.keys(props.imageListObj).length})`
                        }
                        </div>

                    </div>
                </div>
                <div className={classes.headerRight}>
                    <div className={classes.navContainer}>
                        <Link className={classes.artetoreYT} href={"https://www.youtube.com/@artetore"}
                              rel="noopener noreferrer" target="_blank"></Link>
                        <Link className={classes.artetoreFB} href={"https://www.facebook.com/artetore"}
                              rel="noopener noreferrer" target="_blank"></Link>
                        <div className={classes.aboutText}>About</div>
                    </div>
                </div>
            </nav>
            {
                showCartModal &&
                <div>
                    <AddedImageModal action={props.action} sendBtnHandlerForAddImage={()=>{
                            setShowCartModal(false)
                            props.sendDataToServer()
                        }
                    } imageListObj={props.imageListObj} closeAddedModalBtnHandler={closeAddedModalBtnHandler}></AddedImageModal>
                </div>
            }

        </Fragment>

    )
}

export default HeaderLoggedIn