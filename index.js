const core = require('@actions/core');
const github = require('@actions/github');


async function main() {

  try {

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
  
    console.log(`The views : ${JSON.stringify(views, undefined, 2)}`);
    console.log(`The clones : ${JSON.stringify(clones, undefined, 2)}`);
  
    // `who-to-greet` input defined in action metadata file
    // const nameToGreet = core.getInput('who-to-greet');
    // console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // // Get the JSON context for the event that triggered the workflow
    // const context = JSON.stringify(github.context, undefined, 2)
    // console.log(`The event context : ${context}`);
  
    // // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
