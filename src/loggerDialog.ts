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
    public message: StringExpression = new StringExpression();

    public getConverter(
        property: keyof LoggerDialogConfiguration
    ): Converter | ConverterFactory {
        return new StringExpressionConverter();
    }

    public emailMask(email: String ) {
        var maskedEmail = email.replace(/([^@\.])/g, "*").split('');
        var previous	= "";
        for(let i=0;i<maskedEmail.length;i++){
            if (i<=1 || previous == "." || previous == "@"){
                maskedEmail[i] = email[i];
            }
            previous = email[i];
        }
        return maskedEmail.join('');
    }
    public beginDialog(dc: DialogContext): Promise<DialogTurnResult> {
        console.log('LoggerDialog Called');
        const message = this.message.getValue(dc.state);
        console.log(this.emailMask(message));
        return dc.endDialog();
    }

    protected onComputeId(): string {
        return "LoggerDialog";
    }
}
