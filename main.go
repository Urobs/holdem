package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
)

//go:embed dist/*
var dist embed.FS

func main() {
	contentStatic, err := fs.Sub(dist, "dist")
	if err != nil {
		log.Fatal(err)
	}

	http.Handle("/", http.FileServer(http.FS(contentStatic)))

	log.Println("Listening on http://localhost:8080...")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}
