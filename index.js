const core = require('@actions/core');
const github = require('@actions/github');
import got from 'got';

async function main() {

  try {
    const time = new Date().toISOString();

    let repository = core.getInput('repository');
    let serverUrl = core.getInput('server-url');

    let owner; 
    let repo;
    if (repository.length !== 0 ) {
      [owner, repo] = repository.split("/");

    } else{
      console.log("Grabbing repository from context");
      const fullName = github.context.payload.repository.full_name;
      [owner, repo] = fullName.split("/");
    }

    console.log(`Processing statistics for ${owner}/${repo}!`);

    // remove trailing slash
    if (serverUrl.endsWith('/')) {
      console.log("Removing serverUrl trailing slash");
      serverUrl = serverUrl.slice(0, -1);
    }
    console.log(`The server url is ${serverUrl}!`);

    const token = core.getInput('access-token');
    console.log(`The token is ${token}!`);
  
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

    const repoData = await octokit.request('GET /repos/{owner}/{repo}', {
        owner: owner,
        repo: repo,
    })

    await sendViewsStats(serverUrl, owner, repo, views.data);
    await sendClonesStats(serverUrl, owner, repo, clones.data);
    await sendRepoStats(serverUrl, owner, repo, time, repoData.data);

    const payload = {
      owner: owner,
      repo: repo,
      views: views.data,
      clones: clones.data,
      repoData: repoData.data,
      time: time
    }

    core.setOutput("payload", payload);

  } catch (error) {
    core.setFailed(error.message);
  }
}

async function sendViewsStats(serverUrl, owner, repo, payload) {
  const url = `${serverUrl}/api/repositories/${owner}/${repo}/views`;
  try {
   const response = await got.post(url, {
      json: payload,
   }).json();
  } catch (error) {
    console.error(error);
  }
}

async function sendClonesStats(serverUrl, owner, repo, payload) {
  const url = `${serverUrl}/api/repositories/${owner}/${repo}/clones`;

  try {
    const response = await got.post(url, {
       json: payload,
    }).json();
   } catch (error) {
     console.error(error);
   }
}

async function sendRepoStats(serverUrl, owner, repo, time, payload) {

  const data = {
    timestamp: time,
    forks: payload.forks_count,
    stars: payload.stargazers_count,
    networks: payload.network_count,
    subscribers: payload.subscribers_count,
  }

  console.log("SENDING")
  console.log(data);

  const url = `${serverUrl}/api/repositories/${owner}/${repo}/stars`;

  try {
    const response = await got.post(url, {
      json: data,
    }).json();
  } catch (error) {
    console.error(error);
  }


}

main();

