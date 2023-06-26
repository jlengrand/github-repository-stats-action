const core = require('@actions/core');
const github = require('@actions/github');
import got from 'got';

async function main() {

  try {
    const time = Date.now();

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

    await sendViewsStats(serverUrl, owner, repo, views.data);
    await sendClonesStats(serverUrl, owner, repo, clones.data);
  
    const payload = {
      owner: owner,
      repo: repo,
      views: views.data,
      clones: clones.data,
      time: time
    }

    core.setOutput("payload", payload);

  } catch (error) {
    core.setFailed(error.message);
  }
}

async function sendViewsStats(serverUrl, owner, repo, payload) {
  try {
   const response = await got.post(`${serverUrl}/api/repositories/${owner}/${repo}/views`, {
      json: payload,
   }).json();
  } catch (error) {
    console.error(error);
  }
}

async function sendClonesStats(serverUrl, owner, repo, payload) {
  try {
    const response = await got.post(`${serverUrl}/api/repositories/${owner}/${repo}/clones`, {
       json: payload,
    }).json();
   } catch (error) {
     console.error(error);
   }
}

main();

