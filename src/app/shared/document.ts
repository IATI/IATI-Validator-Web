/* eslint-disable @typescript-eslint/naming-convention */
export interface Document {
    id: string;
    hash: string;
    url: string;
    first_seen: string;
    downloaded: string;
    download_error: string;
    validation: string;
    publisher: string;
    validation_created: number;
    valid: boolean;
}
