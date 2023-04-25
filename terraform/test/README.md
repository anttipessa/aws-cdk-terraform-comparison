## E2E module tests with Terratest

Requirements:

- Go (version: go1.20.2)
- Terraform


Run tests with:
```go test -v -timeout 30m```

With test output:

```
go test -timeout 30m | tee test_output.log
terratest_log_parser -testlog test_output.log -outputdir test_output
```