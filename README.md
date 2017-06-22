# Typescript base REST API module
[![Coverage Status](https://coveralls.io/repos/github/Artear/typescript-base-rest-api-dynamodb-module/badge.svg?branch=master)](https://coveralls.io/github/Artear/typescript-base-rest-api-dynamodb-module?branch=master)
[![CircleCI](https://circleci.com/gh/Artear/typescript-base-rest-api-dynamodb-module.svg?style=svg)](https://circleci.com/gh/Artear/typescript-base-rest-api-dynamodb-module)

This is a lightweight annotation-based restify extension for typescript.

## Installation:

This library only works with typescript. Ensure it is installed:
```
npm install typescript -g
```
To install typescript base rest api: 

```
npm i typescript_base_rest_api
```

## Get started

### 1. Define a service router
```typescript
export class ItemRouter extends RouterConfig {
    protected onConfig(): void {
        this.get("/items", ItemService.getItems);
        this.get("/items/:id", ItemService.findById);
    }
}
```
### 2. Create a service
```typescript
export default class ItemService extends BaseService {

    static controller: ItemController = new ItemController();

    @RestifyValidation.isAlphanumeric("id")
    public static findById(req: Request, res: Response, next: Next): void {
        // do stuff
    }
    public static getItems(req: Request, res: Response, next: Next): void {
      // do other stuff
    }
```
### 3. Configure your server
```typescript
let options: ServerOptions = new OptionsBuilder()
    .withName(config.get<string>("server.options.name"))
    .withVersion(config.get<string>("server.options.version"))
    .build();

export let server: Server = new ServerBuilder()
    .withTimeout(config.get<number>("server.options.timeout"))
    .withOptions(options)
    .withQueryParser(queryParser())
    .withSecurity(config.get<boolean>("security.enable"))
    .withRouter(new PingRouter())
    .withRouter(new ItemRouter())
    .withCORS(false)
    .build();

let port = config.get<number>("port");

server.listen(port, function () {
    loggerHelper.info("App online on port: " + port);
});
```

### 4. Run your application!
The API will be running at localhost:8282

## Configure your application
You can configure  your application using environment variables.
Example:
```json
{
  "port": "PORT",
  "security": {
    "enable": "SECURITY_ENABLE",
    "token": "SECURITY_TOKEN"
  },
  "newrelic": {
    "enable": "NEWRELIC_ENABLE",
    "license_key": "NEWRELIC_LICENSE_KEY",
    "app_name": "NEWRELIC_APP_NAME"
  }
}
```

## Examples
Check examples folder to see some basic usage.


## Development
To use lint in development, you need to install typescript and tslist globally:
```
npm install -g typescript tslint
```
