# GitHub repository statistics

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

```yaml
uses: actions/github-repository-stats-action
with:
  who-to-greet: 'Bob de Bouwer'
```

## License

See the [LICENSE](LICENSE) file for license rights and limitations.

## Author

* [Julien Lengrand-Lambert](https://lengrand.fr/)