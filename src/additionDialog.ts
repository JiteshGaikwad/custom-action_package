// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
  Expression,
  NumberExpression,
  NumberExpressionConverter,
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

export interface AdditionDialogConfiguration extends DialogConfiguration {
  arg1: number | string | Expression | NumberExpression;
  arg2: number | string | Expression | NumberExpression;
  resultProperty?: string | Expression | StringExpression;
}

export class AdditionDialog
  extends Dialog
  implements AdditionDialogConfiguration {
  public static $kind = "AdditionDialog";

  public arg1: NumberExpression = new NumberExpression(0);
  public arg2: NumberExpression = new NumberExpression(0);
  public resultProperty?: StringExpression;

  public getConverter(
    property: keyof AdditionDialogConfiguration
  ): Converter | ConverterFactory {
    switch (property) {
      case "arg1":
        return new NumberExpressionConverter();
      case "arg2":
        return new NumberExpressionConverter();
      case "resultProperty":
        return new StringExpressionConverter();
      default:
        return super.getConverter(property);
    }
  }

  public beginDialog(dc: DialogContext): Promise<DialogTurnResult> {
    console.log('AdditionDialog Called')
    const arg1 = this.arg1.getValue(dc.state);
    const arg2 = this.arg2.getValue(dc.state);
    console.log(`arg1: ${arg1}`)
    console.log(`arg2: ${arg2}`)
    const result = arg1 + arg2;
    console.log(`result: ${result}`)
    if (this.resultProperty) {
      dc.state.setValue(this.resultProperty.getValue(dc.state), result);
    }

    return dc.endDialog(result);
  }

  protected onComputeId(): string {
    return "AdditionDialog";
  }
}
