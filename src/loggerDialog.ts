// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as crypto from 'crypto';
const algorithm = "aes-256-cbc";
// generate 16 bytes of random data

const ENCRYPTION_KEY = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16
import {
    Expression,
    StringExpression,
    StringExpressionConverter,
    EnumExpression,
    EnumExpressionConverter
} from "adaptive-expressions";

import {
    Converter,
    ConverterFactory,
    Dialog,
    DialogConfiguration,
    DialogContext,
    DialogTurnResult
} from "botbuilder-dialogs";


export enum LogType {
    plaintext = 'plaintext',
    masked = 'masked',
    encrypted = 'encrypt'
}

export interface LoggerDialogConfiguration extends DialogConfiguration {
    message?: string | Expression | StringExpression;
    logType?: string | Expression | EnumExpression<LogType>;
}



export class LoggerDialog
    extends Dialog
    implements LoggerDialogConfiguration {
    public static $kind = "LoggerDialog";
    public message: StringExpression = new StringExpression('');
    public logType: EnumExpression<LogType> = new EnumExpression<LogType>(LogType.plaintext);


    public constructor(message: string, logType?: LogType) {
        super();
        if (logType) {
            this.logType = new EnumExpression<LogType>(logType);
        }
        if (message) {
            this.message = new StringExpression(message);
        }
    }

    public getConverter(
        property: keyof LoggerDialogConfiguration
    ): Converter | ConverterFactory {
        switch (property) {
            case "message":
                return new StringExpressionConverter();
            case "logType":
                return new EnumExpressionConverter<LogType>(LogType);
            default:
                return super.getConverter(property);
        }
    }

    public emailMask(email: string) {
        var maskedEmail = email.replace(/([^@\.])/g, "*").split('');
        var previous = "";
        for (let i = 0; i < maskedEmail.length; i++) {
            if (i <= 1 || previous == "." || previous == "@") {
                maskedEmail[i] = email[i];
            }
            previous = email[i];
        }
        return maskedEmail.join('');
    }

    public encrypt(text): string {
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    public decrypt(text): string {
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }

    public beginDialog(dc: DialogContext): Promise<DialogTurnResult> {
        console.log('LoggerDialog Called');
        const _message = this.message?.getValue(dc.state);
        const _logType = this.logType?.getValue(dc.state);
        console.log(`Logtype: ${_logType}`)
        if (_logType == LogType.masked) {
            console.log(this.emailMask(_message))
        }
        else if (_logType == LogType.encrypted) {
            console.log(`Before encrytion: ${_message}`)
            const encrypted_text = this.encrypt(_message);
            console.log(`Encrypted text: ${encrypted_text}`);
            return;
        }
        else {
            console.log(_message)
        }
        return dc.endDialog();
    }

    protected onComputeId(): string {
        return "LoggerDialog";
    }
}
