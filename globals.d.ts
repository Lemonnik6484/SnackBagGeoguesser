declare var ContentService: {
    /**
     * Creates a new TextOutput object for content served as plain text.
     * @param content Optional string content.
     * @returns {TextOutput}
     */
    createTextOutput: (content?: string) => TextOutput;

    MimeType: {
        ATOM: 'application/atom+xml',
        CSV: 'text/csv',
        HTML: 'text/html',
        JAVASCRIPT: 'application/javascript',
        JSON: 'application/json',
        RSS: 'application/rss+xml',
        TEXT: 'text/plain',
        XML: 'application/xml',
    };
};

interface TextOutput {
    append: (text: string) => TextOutput;
    clear: () => TextOutput;
    downloadAsFile: (filename: string) => TextOutput;
    getContent: () => string;
    getMimeType: () => string;
    setMimeType: (mimeType: string) => TextOutput;
    setContent: (content: string) => TextOutput;
}

declare interface GoogleAppsScriptEvent {
    parameter: { [key: string]: string };
    contextPath: string;
    contentLength: number;
    queryString: string;
    postData: {
        contents: string;
        length: number;
        name: string;
        type: string;
    };
}

declare var DriveApp: {
    /**
     * Returns the folder with the specified ID.
     * @param folderId The ID of the folder to retrieve.
     * @returns {GoogleAppsScript.Drive.Folder} The folder with the given ID.
     */
    getFolderById: (folderId: string) => GoogleAppsScript.Drive.Folder;

    /**
     * Returns the file with the specified ID.
     * @param fileId The ID of the file to retrieve.
     * @returns {GoogleAppsScript.Drive.File} The file with the given ID.
     */
    getFileById: (fileId: string) => GoogleAppsScript.Drive.File;
};

declare var Utilities: {
    /**
     * Returns UUID.
     * @returns {string} The folder with the given ID.
     */
    getUuid: () => string;
};

declare namespace GoogleAppsScript.Drive {
    interface Folder {
        createFile: (name: string, content: string, mimeType: string) => GoogleAppsScript.Drive.File;
        getId: () => string;
        getName: () => string;
        getFiles: () => GoogleAppsScript.Drive.FileIterator;
    }

    interface File {
        getId: () => string;
        getName: () => string;
        getMimeType: () => string;
        getBlob: () => GoogleAppsScript.Base.Blob;
    }

    interface FileIterator {
        hasNext: () => boolean;
        next: () => GoogleAppsScript.Drive.File;
    }
}

declare namespace GoogleAppsScript.Base {
    interface Blob {
        getDataAsString: () => string;
    }
}
