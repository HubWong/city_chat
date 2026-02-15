import { host } from "@/shared/config";


export const useFileRequest = () => {

    const downloadFile = async (path) => {
        const response = await fetch(`${host}/${path}`, {
            method: "GET",
        });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename; // 下载的文件名
        document.body.appendChild(a);
        a.click();
        a.remove();

        // 释放内存
        window.URL.revokeObjectURL(url);
    };

    return { downloadFile }

}