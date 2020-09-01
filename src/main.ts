import * as core from "@actions/core";
import * as github from "@actions/github";
import {Octokit} from "@octokit/rest";
import { inspect } from "util";

export interface Inputs {
  token: string,
  owner: string,
  repo: string,
  baseBranch: string,
  headBranch: string,
  title: string,
  body: string
}

async function createOrUpdatePullRequest(inputs: Inputs): Promise<void> {
  const listParams: Octokit.PullsListParams = {
    owner: inputs.owner,
    repo: inputs.repo,
    base: inputs.baseBranch,
    head: `${inputs.owner}:${inputs.headBranch}`,
    state: 'open'
  }

  const octokit = github.getOctokit(inputs.token);

  const title = "Install Release Drafter";
  const body = "";
  const listPullRequestResponse = await octokit.pulls.list(listParams)
  if (listPullRequestResponse.data.length === 0) {
    // create pull request
    const params: Octokit.PullsCreateParams = {
      owner: inputs.owner,
      repo: inputs.repo,
      base: inputs.baseBranch,
      head: `${inputs.owner}:${inputs.headBranch}`,
      title,
      body
    }
    const response = await octokit.pulls.create(params)
  } else {
    // update pull request
    const pullRequest = listPullRequestResponse.data[0]
    const params: Octokit.PullsUpdateParams = {
      owner: inputs.owner,
      repo: inputs.repo,
      // eslint-disable-next-line @typescript-eslint/camelcase
      pull_number: pullRequest.number,
      title,
      body
    }
    const response = await octokit.pulls.update(params)
  }
}

async function run(): Promise<void> {
  try {
    const inputs: Inputs = {
      token: core.getInput("token"),
      path: core.getInput("path"),
      branch: core.getInput("branch"),
      defaultBranch: core.getInput("defaultBranch")
    };
    core.debug(`Inputs: ${inspect(inputs)}`);

    await createPullRequest(inputs);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
