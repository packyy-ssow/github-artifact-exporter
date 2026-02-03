import BaseCommand from "../base";

export default abstract class Search extends BaseCommand {
  static description = "GitHub Search base command";

  static baseFlags = {
    ...BaseCommand.baseFlags,
  };

  async run() {
    this._help();
  }
}
