import BaseCommand from "../base";

export default class Repo extends BaseCommand {
  static description = "Export GitHub artifacts from a repository";

  async run() {
    await this.config.runHook('init', {id: this.id, argv: this.argv})
    return this.showHelp()
  }
}
