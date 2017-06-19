import {ServerOptions} from "restify";


export class OptionsBuilder {

    private _options: ServerOptions;
    private _certificate: string;
    private _key: string;
    private _formatters: Object;
    private _log: Object;
    private _name: string = "Some Name";
    private _spdy: Object;
    private _version: string = "0.0.0";
    private _handleUpgrades: boolean;
    private _httpsServerOptions: any;

    constructor() {
    }

    public withOptions(options: ServerOptions): OptionsBuilder {
        this._options = options;
        return this;
    }

    public withCertificate(value: string): OptionsBuilder {
        this._certificate = value;
        return this;
    }

    public withKey(value: string): OptionsBuilder {
        this._key = value;
        return this;
    }

    public withFormatters(value: Object): OptionsBuilder {
        this._formatters = value;
        return this;
    }

    public withLog(value: Object): OptionsBuilder {
        this._log = value;
        return this;
    }

    public withName(value: string): OptionsBuilder {
        this._name = value;
        return this;
    }

    public withSpdy(value: Object): OptionsBuilder {
        this._spdy = value;
        return this;
    }

    public withVersion(value: string): OptionsBuilder {
        this._version = value;
        return this;
    }

    public withHandleUpgrades(value: boolean): OptionsBuilder {
        this._handleUpgrades = value;
        return this;
    }

    public withHttpsServerOptions(value: any): OptionsBuilder {
        this._httpsServerOptions = value;
        return this;
    }

    public build(): ServerOptions {
        let options: ServerOptions;

        if (!!this._options) {
            options = this._options;
        } else {
            options = {};
        }

        options.certificate = this._certificate;
        options.key = this._key;
        options.formatters = this._formatters;
        options.log = this._log;
        options.name = this._name;
        options.spdy = this._spdy;
        options.version = this._version;
        options.handleUpgrades = this._handleUpgrades;
        options.httpsServerOptions = this._httpsServerOptions;


        return options;
    }
}