// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

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
    // public message?: StringExpression;
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
    public beginDialog(dc: DialogContext): Promise<DialogTurnResult> {
        console.log('LoggerDialog Called');
        // console.log(this.message);
        // console.log(this.logType);
        const _message = this.message?.getValue(dc.state);
        const _logType = this.logType?.getValue(dc.state);
        console.log(`Logtype: ${_logType}`)
        if (_logType == LogType.masked) {
            console.log(this.emailMask(_message))
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
