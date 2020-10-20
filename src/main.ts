import * as core from "@actions/core";
import * as github from "@actions/github";
import { Octokit } from "@octokit/rest";
import { inspect } from "util";

export interface Inputs {
  token: string;
  owner: string;
  repo: string;
  baseBranch: string;
  headBranch: string;
  title: string;
  body: string;
}

async function createPullRequest(inputs: Inputs): Promise<void> {
  const listParams: Octokit.PullsListParams = {
    owner: inputs.owner,
    repo: inputs.repo,
    base: inputs.baseBranch,
    head: `${inputs.owner}:${inputs.headBranch}`,
    state: "open",
  };

  const octokit = new github.GitHub(inputs.token);

  const listPullRequestResponse = await octokit.pulls.list(listParams);
  if (listPullRequestResponse.data.length === 0) {
    // create pull request
    const params: Octokit.PullsCreateParams = {
      owner: inputs.owner,
      repo: inputs.repo,
      base: inputs.baseBranch,
      head: `${inputs.owner}:${inputs.headBranch}`,
      title: inputs.title,
      body: inputs.body,
    };
    const response = await octokit.pulls.create(params);
    core.info(`Inputs: ${inspect(response)}`);
  } else {
    core.info(`The PR already exists. Will do nothing.`);
  }
}

async function run(): Promise<void> {
  try {
    const inputs: Inputs = {
      token: core.getInput("token"),
      owner: core.getInput("owner"),
      repo: core.getInput("repo"),
      baseBranch: core.getInput("baseBranch"),
      headBranch: core.getInput("headBranch"),
      title: core.getInput("title"),
      body: core.getInput("body"),
    };
    core.info(`Inputs: ${inspect(inputs)}`);

    await createPullRequest(inputs);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
