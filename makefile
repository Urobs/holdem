.PHONY: all windows linux clean

BINARY_NAME=holdem

all: windows linux macos

windows:
	GOOS=windows GOARCH=amd64 go build -o bin/${BINARY_NAME}-windows-amd64.exe main.go

linux:
	GOOS=linux GOARCH=amd64 go build -o bin/${BINARY_NAME}-linux-amd64 main.go
	GOOS=linux GOARCH=arm64 go build -o bin/${BINARY_NAME}-linux-arm64 main.go

macos:
	GOOS=darwin GOARCH=amd64 go build -o bin/${BINARY_NAME}-darwin-amd64 main.go
	GOOS=darwin GOARCH=arm64 go build -o bin/${BINARY_NAME}-darwin-arm64 main.go

clean:
	rm -rf bin/
