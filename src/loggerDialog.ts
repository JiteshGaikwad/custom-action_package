// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    Expression,
    StringExpression,
    StringExpressionConverter,
} from "adaptive-expressions";

import {
    Converter,
    ConverterFactory,
    Dialog,
    DialogConfiguration,
    DialogContext,
    DialogTurnResult,
} from "botbuilder-dialogs";

export interface LoggerDialogConfiguration extends DialogConfiguration {
    message?: string | Expression | StringExpression;
}

export class LoggerDialog
    extends Dialog
    implements LoggerDialogConfiguration {
    public static $kind = "LoggerDialog";
    // public message?: StringExpression;
    public message: StringExpression = new StringExpression('');

    public getConverter(
        property: keyof LoggerDialogConfiguration
    ): Converter | ConverterFactory {
        switch (property) {
            case "message":
                return new StringExpressionConverter();
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
        console.log(this.message);
        const _message = this.message?.getValue(dc.state);
        console.log(_message)
        console.log(this.emailMask(_message))
        // console.log(this.emailMask(_message));
        return dc.endDialog();
    }

    protected onComputeId(): string {
        return "LoggerDialog";
    }
}
