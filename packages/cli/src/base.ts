import { Command, Flags } from "@oclif/core";
import { Octokit } from "@octokit/rest";
import { DateTime } from "luxon";

export default abstract class Base extends Command {
  // this is immediately overwritten in the init method
  github: Octokit = new Octokit();

  static baseFlags = {
    baseUrl: Flags.string({
      description: "GitHub base url",
      default: "https://api.github.com",
    }),

    token: Flags.string({
      description: "GitHub personal access token",
      env: "GITHUB_TOKEN",
      required: true,
    }),

    owner: Flags.string({
      dependsOn: ["repo"],
      description: "GitHub repository owner",
    }),

    repo: Flags.string({
      dependsOn: ["owner"],
      description: "GitHub repository name",
    }),

    format: Flags.option({
      options: ["JSONL", "JSON", "CSV"] as const,
      default: "JSONL",
      description: "export format",
    })(),
  };

  /**
   * Parse date into ISO or "*" if null/undefined this
   * allows it to be used with the `created` filter
   * for GitHub Search
   *
   * @param {string} flagName
   * @param {string} date
   * @returns {string}
   */
  parseDateFlag(flagName: string, date: string | undefined): string {
    let searchDate = "*";

    if (date) {
      const datetime = DateTime.fromFormat(date, "yyyy-MM-dd");

      if (!datetime.isValid) {
        throw new Error(
          `unable to parse flag "${flagName}"\n${datetime.invalidExplanation}`
        );
      }

      // toISODate() returns null if the date is invalid; fallback to "*" (any date) for GitHub search
      searchDate = datetime.toISODate() || "*";
    }

    return searchDate;
  }

  async init() {
    await super.init();
    const { flags } = await this.parse(this.constructor as typeof Base);
    const { baseUrl, token } = flags;

    this.github = new Octokit({
      baseUrl,
      auth: token,
    });
  }
}
