package main

import (
	stdlog "log"
	"math/rand"
	"os"
	"time"

	"gopkg.in/DataDog/dd-trace-go.v1/ddtrace/tracer"

	"github.com/weaveworks/weave-gitops-enterprise/cmd/clusters-service/app"
)

func main() {
	tracer.Start(
		tracer.WithRuntimeMetrics(),
		// tracer.WithEnv("prod"),
		tracer.WithService("gitops-clusters"),
		// tracer.WithServiceVersion("abc123"),
	)
	rand.New(rand.NewSource(time.Now().UnixNano()))

	tempDir, err := os.MkdirTemp("", "*")
	if err != nil {
		stdlog.Fatalf("Failed to create a temp directory for Helm: %v", err)
	}
	defer func() {
		_ = os.RemoveAll(tempDir)
		tracer.Stop()
	}()

	command := app.NewAPIServerCommand()

	if err := command.Execute(); err != nil {
		os.Exit(1)
	}
}
