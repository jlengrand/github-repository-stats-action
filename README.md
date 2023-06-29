# GitHub repository statistics

This action grabs [repository traffic](https://docs.github.com/en/rest/metrics/traffic?apiVersion=2022-11-28) from GitHub and send them to [Repo Insights](https://www.repoinsights.com/).

The main idea here is to get over the limitation of Github's traffic view, [which only shows the last 14 days of traffic](https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/viewing-traffic-to-a-repository).

## Inputs

### `access-token`

**Required** The action requires a GitHub access token with write access to the repository. You can create one [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

**Note:** Make sure to add the token to your repository secrets and not to hardcode it in your workflow.

### `server-url`

The URL of the Repo Insights server to send the data to. Used only for internal testing, and should not be used in production.
Defaults to `https://www.repoinsights.com/`.


## Outputs

### `payload`

Payload contains all the data grabbed from the GitHub API and sent to the website.

## Example usage

You will need some sort of trigger to run the action. I recommend you use a cron job. You can run it once a week, or more often in order to avoid losing data in case the action fails.

```yaml
on:
  schedule:
    - cron: '30 5 * * *' # Every day at 5:30 AM UTC

jobs:
  stats_job:
    runs-on: ubuntu-latest
    name: Grabbing latest statistics from the repository, every day
    steps:
      - name: Grabbing repo stats
        id: stats
        uses: /jlengrand/github-repository-stats-action@feat/grabbing-repo-stats
        with:
          access-token: ${{ secrets.ACCESS_TOKEN }}
```

## License

See the [LICENSE](LICENSE) file for license rights and limitations.

## Author

* [Julien Lengrand-Lambert](https://lengrand.fr/)
