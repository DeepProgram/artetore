import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import axios from "axios";
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";
import {setUploadFileStatus} from "../../redux/slices/onedriveSlice";


const useFileUploadInOnedrive = () => {
    const [startUploadingFiles, setStartUploadingFiles] = useState(false)
    const [currentFileUploadCount, setCurrentFileUploadCount] = useState(0)
    const [folderId, setFolderId] = useState(null)
    const [uploadFileList, setUploadFileList] = useState([])
    const [fileInfo, setFileInfo] = useState({})
    const [allFileUploaded, setAllFileUploaded] = useState(false)
    const [cancelAllUpload, setCancelAllUpload] = useState(false)

    const [fileUploadingLoopInfo, setFileUploadingLoopInfo] = useState({
        start: -1,
        end: -1
    })
    const [uploadNextFile, setUploadNextFile] = useState(true)

    const [reqStateForUploadFile, setReqStateForUploadFile] = useState(0)
    // 0 -> Doing Nothing
    // 1 -> Started Uploading
    // 2 -> Finished Uploading
    // 3 -> JWT Error,, Relog
    // 4 -> Server Offline

    const [uploadFileStatusObj, setUploadFileStatusObj] = useState({})
    // 0 -> Doing Nothing
    // 1 -> Uploading
    // 2 -> Uploaded
    // 3 -> Failed
    // 4 -> Force Stop

    const jwtToken = useSelector(state => state.userInfoSlice.token)
    

    const getUploadSession = (folderID, fileName, fileSize) => {
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/admin/onedrive/upload-session?folder_id=${encodeURI(folderID)}&file_name=${encodeURI(fileName)}`,
            {headers: {"Authorization": `Bearer ${jwtToken}`}})
            .then(response => {
                if (response.data.code === 1) {
                    setUploadFileStatusObj(prevState => {
                        return {...prevState, [fileName]: 1}
                    })
                    // console.log("Got Session")
                    const chunkSize = 320 * 1024 * 10
                    let byteStart = 0
                    let byteEnd = chunkSize
                    const fullFileSize = fileSize

                    const tempFileSize = fileSize
                    let loop = ((tempFileSize / chunkSize) | 0)
                    if (tempFileSize % chunkSize !== 0) {
                        loop += 1
                    }

                    setFileUploadingLoopInfo({
                        start: 1,
                        end: loop
                    })

                    if (fullFileSize < chunkSize) {
                        byteEnd = fullFileSize
                    }

                    setFileInfo(prevState => {
                        return {
                            ...prevState,
                            uploadSession: response.data["sessionUrl"],
                            byteStart: byteStart,
                            byteEnd: byteEnd,
                            chunkSize: chunkSize
                        }
                    })

                } else if (response.data.code === 0) {
                   console.log("API Error")
                }
            })
            .catch(err => {
                setFileInfo(prevState => {
                    return {
                        ...prevState,
                        fileProcessed: true
                    }
                })
                if (err.response.status === 401) {
                    setReqStateForUploadFile(3)
                } else {
                    setReqStateForUploadFile(4)
                }
            })


    }


    useEffect(()=>{
        if (cancelAllUpload){
            setCancelAllUpload(false)
            setFileUploadingLoopInfo({
                start: -1,
                end: -1
            })
            setStartUploadingFiles(false)
            setUploadFileStatusObj({})
            setUploadFileList([])
            setAllFileUploaded(true)
            setReqStateForUploadFile(0)
            setFileInfo({})
            setCurrentFileUploadCount(0)
            setUploadNextFile(true)
        }
    },[cancelAllUpload])

    useEffect(() => {
        if (startUploadingFiles && currentFileUploadCount >= uploadFileList.length-1) {
            setFileUploadingLoopInfo({
                start: -1,
                end: -1
            })
            setAllFileUploaded(true)
            setReqStateForUploadFile(2)
            setFileInfo({})
            setCurrentFileUploadCount(0)
            setStartUploadingFiles(false)
            setUploadNextFile(true)

        }
    }, [currentFileUploadCount, uploadFileList.length])


    useEffect(() => {
        if (startUploadingFiles) {
            setReqStateForUploadFile(1)
        }
    }, [startUploadingFiles])

    useEffect(() => {
        if (startUploadingFiles) {
            if ((uploadNextFile) && (uploadFileList.length !== 0 && currentFileUploadCount < uploadFileList.length)) {
                setUploadNextFile(false)
                const controller = new AbortController()
                setFileInfo(
                    {
                        uploadSession: null,
                        file: uploadFileList[currentFileUploadCount].file,
                        fileName: uploadFileList[currentFileUploadCount].name,
                        fileSize: uploadFileList[currentFileUploadCount].size,
                        uploadStatus: 1,
                        controller: controller,
                        signal: controller.signal,
                        fileProcessed: false
                    }
                )

                getUploadSession(folderId, uploadFileList[currentFileUploadCount].name, uploadFileList[currentFileUploadCount].size)

            }
        }
    }, [currentFileUploadCount, fileInfo.fileName, fileInfo.uploadSession, folderId, startUploadingFiles, uploadFileList, uploadNextFile])


    const uploadFileToServer = (sessionUrl, signal, fileName, file, fileByteStart, fileByteEnd, chunkSize, fullFileSize) => {
        if (uploadFileStatusObj[fileName] === 4) {
            // console.log("Aborting")
            fileInfo.controller.abort()

        }
        const headers = {
            "Content-Range": `bytes ${fileByteStart}-${fileByteEnd - 1}/${fullFileSize}`
        }
        const tempFile = file.slice(fileByteStart, fileByteEnd)
        axios.put(sessionUrl, tempFile, {signal: signal, headers: headers})
            .then(response => {
                if (response.status === 202) {
                    // console.log("File Uploading")
                    setFileUploadingLoopInfo(prevState => {
                        return { start: prevState["start"]+1, end: prevState["end"]}
                    })
                    fileByteEnd += chunkSize
                    if (fullFileSize < fileByteEnd) {
                        fileByteEnd = fullFileSize
                    }
                    setFileInfo(prevState => {
                        return {...prevState, byteStart: fileByteStart + chunkSize, byteEnd: fileByteEnd}
                    })
                } else if (response.status === 201) {
                    // console.log("File Uploaded")
                    setFileUploadingLoopInfo(prevState => {
                        return { start: prevState["start"]+1, end: prevState["end"]}
                    })
                    setUploadFileStatusObj(prevState => {
                        return {...prevState, [fileName]: 2}
                    })
                    setCurrentFileUploadCount(prevState => prevState + 1)
                    setUploadNextFile(true)
                }
            })
            .catch(err => {
                setUploadFileStatusObj(prevState => {
                    return {...prevState, [fileName]: 3}
                })
                setCurrentFileUploadCount(prevState => prevState + 1)
                setUploadNextFile(true)
            })
    }


    useEffect(() => {
        if (fileUploadingLoopInfo.start !== -1 && (fileUploadingLoopInfo.start <= fileUploadingLoopInfo.end)) {
            uploadFileToServer(fileInfo.uploadSession, fileInfo.signal, fileInfo.fileName, fileInfo.file,
                fileInfo.byteStart, fileInfo.byteEnd, fileInfo.chunkSize, fileInfo.fileSize)

        }
    }, [fileInfo.byteEnd, fileInfo.byteStart, fileInfo.chunkSize, fileInfo.file, fileInfo.fileName, fileInfo.fileSize, fileInfo.signal, fileInfo.uploadSession])

    return {
        setStartUploadingFiles,
        setFolderId,
        uploadFileList,
        setUploadFileList,
        reqStateForUploadFile,
        setReqStateForUploadFile,
        uploadFileStatusObj,
        setUploadFileStatusObj,
        allFileUploaded,
        setAllFileUploaded,
        setFileInfo,
        setCurrentFileUploadCount,
        setCancelAllUpload
    }
}

export default useFileUploadInOnedrive