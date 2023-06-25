const core = require('@actions/core');
const github = require('@actions/github');
import got from 'got';

async function main() {

  try {
    const time = (new Date()).toTimeString();

    const serverUrl = core.getInput('server-url');
    const token = core.getInput('access-token');
    console.log(`The token is ${token}!`);
  
    const fullName = github.context.payload.repository.full_name;
    const [owner, repo] = fullName.split("/");
  
    console.log(`Found owner and repo : ${owner} and ${repo}`);

    const octokit = github.getOctokit(token);
    
    const views = await octokit.request('GET /repos/{owner}/{repo}/traffic/views', {
      owner: owner,
      repo: repo,
    })

    const clones = await octokit.request('GET /repos/{owner}/{repo}/traffic/clones', {
      owner: owner,
      repo: repo,
    })

    const payload = {
      owner: owner,
      repo: repo,
      views: views.data,
      clones: clones.data,
      time: time
    }

    core.setOutput("payload", payload);
    await sendStats(serverUrl, payload);
  
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function sendStats(serverUrl, payload) {
  try {
   const response = await got.post(`${serverUrl}/api/repositories/data`, {
      json: payload,
   }).json();
  } catch (error) {
    console.error(error);
  }
}

main();

