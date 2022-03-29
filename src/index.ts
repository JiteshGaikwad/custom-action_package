// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BotComponent } from "botbuilder";
import { AdditionDialog } from "./additionDialog";
import { LoggerDialog } from "./loggerDialog"

import { ComponentDeclarativeTypes } from "botbuilder-dialogs-declarative";

import {
  ServiceCollection,
  Configuration,
} from "botbuilder-dialogs-adaptive-runtime-core";

export default class CustomActionsDialog extends BotComponent {
  configureServices(
    services: ServiceCollection,
    _configuration: Configuration
  ): void {
    services.composeFactory<ComponentDeclarativeTypes[]>(
      "declarativeTypes",
      (declarativeTypes) =>
        declarativeTypes.concat({
          getDeclarativeTypes() {
            return [
              {
                kind:  LoggerDialog.$kind,
                type: LoggerDialog,
              },
            ];
          },
        })
    );
  }
}
