import classes from "./HomeComponent.module.css"
import allModalClasses from "../UI/Modal/AllModal.module.css"
import {Fragment, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Image from "next/image";
import ImageView from "../ImageView/ImageView";
import useGetOnePageImage from "../customHooks/useGetOnePageImage";
import useGetTotalPage from "../customHooks/useGetTotalPage";
import LoaderDotCircle from "../UI/Loader/LoaderDotCircle";
import ErrorModal from "../UI/Modal/ErrorModal";
import useGetHighResolutionImage from "../customHooks/useGetHighResolutionImage";
import useGetGroupImages from "../customHooks/useGetGroupImages";
import {useRouter} from "next/router";


const HomeComponent = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const totalPage = useSelector(state => state.imageDataSlice.totalPage)
    const imageList = useSelector(state => state.imageDataSlice.imageList)
    const {reqStateForOnePageImage, setReqStateForOnePageImage, getOnePageDataFromServer} = useGetOnePageImage()
    const [startChangingPageAnimation, setStartChangingPageAnimation] = useState(false)
    const {getTotalPageFromServer} = useGetTotalPage()
    const [showErrorModal, setShowErrorModal] = useState(true)
    const [showLoaderBeforeImagePreview, setShowLoaderImageBeforeImagePreview] = useState(false)

    const router = useRouter()

    const {
        reqStateForGetHighResImage, setReqStateForGetHighResImage,
        highResImage, setHighResImage, sendRequestForHighResImage
    } = useGetHighResolutionImage(null, 0)
    const {
        reqStateForGetGroupImage, setReqStateForGetGroupImage,
        showGroupImageError, allGroupImage, sendRequestToServer
    } = useGetGroupImages()


    useEffect(() => {
        if (imageList.length === 0 && reqStateForOnePageImage === 0) {
            setStartChangingPageAnimation(true)
            getTotalPageFromServer()
            getOnePageDataFromServer(currentPage)
        } else if (reqStateForOnePageImage === 2) {
            setStartChangingPageAnimation(false)
        }
    }, [currentPage, imageList, reqStateForOnePageImage, setStartChangingPageAnimation])


    useEffect(() => {
        if (reqStateForGetGroupImage === 2 && reqStateForGetHighResImage === 0) {
            sendRequestForHighResImage(allGroupImage[0]["group"], allGroupImage[0]["imageID"])
        }
        else if(reqStateForGetHighResImage === 2){
            setShowLoaderImageBeforeImagePreview(false)
        }
        else if (reqStateForGetHighResImage === 3 || reqStateForGetGroupImage === 3 || reqStateForGetGroupImage === 4) {
            setShowLoaderImageBeforeImagePreview(false)
            router.reload()
        }
    }, [allGroupImage, reqStateForGetGroupImage, reqStateForGetHighResImage, router, setShowLoaderImageBeforeImagePreview])



    const imageClickHandler = (group) => {
        setShowLoaderImageBeforeImagePreview(true)
        sendRequestToServer(group)
    }

    const imagePreviewCloseHandler = () => {
        setHighResImage(null)
        setReqStateForGetGroupImage(0)
        setReqStateForGetHighResImage(0)
    }

    const handlerPageChange = (requestedPage) => {
        getOnePageDataFromServer(requestedPage)
        setStartChangingPageAnimation(true)
    }


    const refreshButtonClicked = () => {
        setStartChangingPageAnimation(true)
        getTotalPageFromServer()
        getOnePageDataFromServer(currentPage)
    }

    const modalCloseButtonClicked = () => {
        setStartChangingPageAnimation(false)
        setShowErrorModal(false)
    }

    const backdropHandler = () => {
        setStartChangingPageAnimation(false)
        setShowErrorModal(false)

    }

    if (reqStateForOnePageImage === 4 && showErrorModal) {
        return (
            <ErrorModal refreshButtonClicked={refreshButtonClicked} modalCloseButtonClicked={modalCloseButtonClicked}
                        backdropHandler={backdropHandler}></ErrorModal>
        )
    }

    if (startChangingPageAnimation) {
        return (
            <LoaderDotCircle></LoaderDotCircle>
        )
    }

    if (highResImage !== null) {
        return (
            <ImageView selectedGroupInfo={
                {
                    groupId: allGroupImage[0]["group"],
                    imageId: allGroupImage[0]["imageID"]
                }
            } highResImage={highResImage} allGroupImage={allGroupImage} reqStateForHighResImage={2}
                       imagePreviewCloseHandler={imagePreviewCloseHandler}></ImageView>
        )
    }

    if (imageList.length === 0){
        return
    }

    return (
        <Fragment>
            {
                showLoaderBeforeImagePreview &&
                <Fragment>
                    <div className={`${allModalClasses.backdrop} ${classes.backdropForHome}`}></div>
                    <div className={classes.loaderDotCirclePos}>
                        <LoaderDotCircle></LoaderDotCircle>
                    </div>
                </Fragment>

            }
            <div className={classes.container}>
                <div className={classes.bodyContent}>
                    <div className={classes.showImages}>
                        {
                            imageList.length !== 0 &&
                            imageList.map(imageObj => {
                                return (
                                    <div key={imageObj.group} className={classes.imageBox}
                                         onClick={() => {
                                             imageClickHandler(imageObj.group)
                                         }}>
                                        <Image src={imageObj.image} alt={imageObj["image_name"]} width={180}
                                               height={115}></Image>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {
                        totalPage > 1 &&
                        <div className={classes.pageChangeContainer}>
                            <div className={classes.pagination}>
                                <li className={`${classes["page-item-previous"]}`}>
                                    <div
                                        className={`${classes["page-link"]} ${currentPage === 1 && classes["page-item-disabled"]}`}
                                        onClick={() => {
                                            if (currentPage > 1) {
                                                setCurrentPage(prevState => prevState - 1)
                                                handlerPageChange(currentPage-1)
                                            }

                                        }}>Previous
                                    </div>
                                </li>
                                <li className={`${classes["page-item"]}`}>
                                    <div
                                        className={`${classes["page-link"]} ${currentPage === 1 && classes["page-item-active"]}`}
                                        onClick={() => {
                                            if (currentPage !== 1) {
                                                setCurrentPage(1)
                                                handlerPageChange(1)
                                            }
                                        }
                                        }>1
                                    </div>
                                </li>

                                <li className={`${classes["page-item"]}`}>
                                    <div
                                        className={`${classes["page-link"]} ${currentPage === 2 && classes["page-item-active"]}`}
                                        onClick={() => {
                                            if (currentPage !== 2) {
                                                setCurrentPage(2)
                                                handlerPageChange(2)
                                            }

                                        }
                                        }>2
                                    </div>
                                </li>
                                {
                                    totalPage > 2 &&
                                    <li className={`${classes["page-item"]}`}>
                                        <div>..</div>
                                        <div
                                            className={`${classes["page-link"]} ${currentPage > 2 && classes["page-item-active"]}`}>{(currentPage < 4) ? 3 : currentPage}
                                        </div>
                                    </li>
                                }
                                <li className={`${classes["page-item-next"]}`}>
                                    <div
                                        className={`${classes["page-link"]} ${totalPage === currentPage && classes["page-item-disabled"]}`}
                                        onClick={() => {
                                            if (currentPage < totalPage) {
                                                setCurrentPage(prevState => prevState + 1)
                                                handlerPageChange(currentPage+1)
                                            }
                                        }
                                        }
                                    >Next
                                    </div>
                                </li>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </Fragment>

    )
}

export default HomeComponent