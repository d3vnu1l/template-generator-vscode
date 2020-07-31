/**
 * @File   : environment.ts
 * @Author : DengSir (tdaddon@163.com)
 * @Link   : https://dengsir.github.io/
 */

import * as _ from 'lodash';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

import {once} from './decorators';

export class Fields {
  private _name: string;
  private _camelCaseName: string;
  private _pascalCaseName: string;
  private _snakeCaseName: string;
  private _kebabCaseName: string;
  private _lowerDotCaseName: string;
  private _upperCaseName: string;
  private _omitLine: null;

  public get name() {
    return this._name;
  }

  @once('_camelCaseName')
  public get camelCaseName() {
    return _.camelCase(this._name);
  }

  @once('_pascalCaseName')
  public get pascalCaseName() {
    return _.chain(this._name).camelCase().upperFirst().value();
  }

  @once('_snakeCaseName')
  public get snakeCaseName() {
    return _.snakeCase(this._name);
  }

  @once('_kebabCaseName')
  public get kebabCaseName() {
    return _.kebabCase(this._name);
  }

  @once('_lowerDotCaseName')
  public get lowerDotCaseName() {
    return this.snakeCaseName.replace(/_/g, '.');
  }

  @once('_upperCaseName')
  public get upperCaseName() {
    return this._name.toUpperCase();
  }

  @once('_omitLine')
  public get omitLine() {
    return null;
  }

  public set name(name: string) {
    this._name = name;
    this._camelCaseName = null;
    this._pascalCaseName = null;
    this._snakeCaseName = null;
    this._kebabCaseName = null;
    this._lowerDotCaseName = null;
    this._upperCaseName = null;
    this._omitLine = null;
  }

  public get date() {
    return new Date().toLocaleString();
  }

  public get author(): string {
    return this.config.get('fields.author');
  }

  public get email(): string {
    return this.config.get('fields.email');
  }

  public get link(): string {
    return this.config.get('fields.link');
  }

  private get config() {
    return vscode.workspace.getConfiguration('templateGenerator');
  }
}

export class Environment {
  public targetFolderPath: string;
  public context: vscode.ExtensionContext;
  public fields: Fields = new Fields();

  public get config(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration('templateGenerator');
  }

  public get templatesFolderPath(): string {
    var templatesPath = this.config.get<string>('templatesPath');
    var paths = [];
    if (templatesPath) {
      templatesPath.split('/').forEach(item => {
        var result = item.match(/\${(\S*)}/);
        if (result) {
          var key = result[1];
          var temp = vscode.workspace[key];
          if (temp && typeof temp == 'string') {
            paths.push(temp);
          }
        } else {
          paths.push(item);
        }
      });
      templatesPath = path.join(...paths);
    } else {
      templatesPath = path.join(os.homedir(), '.vscode/templates');
    }
    return templatesPath;
  }

  public set fileName(fileName: string) {
    this.fields.name = fileName;
  }
}

export default new Environment();
