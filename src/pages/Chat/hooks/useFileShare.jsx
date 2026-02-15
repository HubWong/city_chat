
import { useWebCxt } from "../../../services/WebCxt"
import { useState, useCallback } from 'react'
import { useLazyDownloadFileQuery } from "../../../services/fileApi";

export const useFileShare = (room) => {

    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const { socket } = useWebCxt()
    const [downloadFile] = useLazyDownloadFileQuery();


    const uploadFile = useCallback((file) => {
        if (!file)
            return

        setIsUploading(true)
        const chunkSize = 256 * 1024; // 256KB
        const totalChunks = Math.ceil(file.size / chunkSize);
        const fileId = `${file.name}-${Date.now()}`; // 简单的唯一标识

        let index = 0;

        const sendChunk = () => {
            const start = index * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const blob = file.slice(start, end);

            const reader = new FileReader();
            reader.onload = (e) => {
                socket.emit("upload_chunk", {
                    fileId,
                    fileName: file.name,
                    index,
                    total: totalChunks,
                    data: e.target?.result,
                });

                index++;
                setProgress(Math.floor((index / totalChunks) * 100));

                if (index < totalChunks) {
                    setTimeout(sendChunk, 0); // 继续发送下一片
                } else {
                    console.log('upload cmlete')
                    socket.emit("upload_complete", { fileId, fileName: file.name, room });
                    // ✅ 保证最后一片读完后，一定发 complete

                    setIsUploading(false);
                }
            };
            reader.readAsArrayBuffer(blob);
        };

        sendChunk(); // 启动
    }, [socket]);


    const downloadFileFn = async (path) => {
        try {
            const arrayPath = path.split('/')
            const id = arrayPath[arrayPath.length - 1]

            const { blob, filename } = await downloadFile(id).unwrap()
            const url = window.URL.createObjectURL(blob)

            const a = document.createElement("a")
            a.href = url
            a.download = filename || "download" // 兜底
            document.body.appendChild(a)
            a.click()
            a.remove()

            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Download error:", error)
        }

    };

    return { uploadFile, progress, isUploading, downloadFileFn };

}